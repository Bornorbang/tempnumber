// PHP backend API client
// Set NEXT_PUBLIC_API_URL in .env.local:
//   Local (XAMPP):   http://localhost/tempnumber/api
//   Production:      https://yourdomain.com/api
//                    https://api.yourdomain.com

export class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = "ApiError";
  }
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("tn_token");
}

async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers ?? {}),
      },
    });
  } catch {
    throw new Error(
      "Unable to reach the server. Please make sure the backend is running and NEXT_PUBLIC_API_URL is configured correctly."
    );
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg = (data as { error?: string }).error;
    throw new ApiError(msg ?? `Request failed (${res.status})`, res.status);
  }

  return data as T;
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export type User = {
  id: number;
  name: string;
  email: string;
  wallet_balance: number;
  is_admin?: boolean;
};

export type AuthResponse = { token: string; user: User };

export const authApi = {
  register: (name: string, email: string, password: string) =>
    apiFetch<AuthResponse>("/auth/register.php", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    }),

  login: (email: string, password: string) =>
    apiFetch<AuthResponse>("/auth/login.php", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  me: () => apiFetch<User>("/auth/me.php"),

  updateProfile: (name: string, email: string) =>
    apiFetch<User>("/auth/update-profile.php", {
      method: "POST",
      body: JSON.stringify({ name, email }),
    }),

  changePassword: (current_password: string, new_password: string) =>
    apiFetch<{ message: string }>("/auth/change-password.php", {
      method: "POST",
      body: JSON.stringify({ current_password, new_password }),
    }),
};

// ── Rentals ───────────────────────────────────────────────────────────────────

export type StoredRental = {
  id: number;
  getatext_id: number;
  number: string;
  service_name: string;
  end_time: string;
  price_usd: number;
  price_ngn: number;
  status: string;
  sms_code?: string | null;
  rented_at: string;
  refunded?: boolean;
};

export const rentalsApi = {
  list: () => apiFetch<StoredRental[]>("/rentals/index.php"),

  save: (data: {
    id: number;
    number: string;
    service_name: string;
    end_time: string;
    ttl?: number;
    price: string;
    status: string;
  }) =>
    apiFetch<StoredRental & { new_balance: number }>("/rentals/index.php", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (data: {
    getatext_id: number;
    status?: string;
    sms_code?: string | null;
    end_time?: string;
  }) =>
    apiFetch<{ success: boolean }>("/rentals/update.php", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  cancel: (getatext_id: number) =>
    apiFetch<{ status: string; refunded: boolean; refund_ngn: number; new_balance: number }>(
      "/rentals/cancel.php",
      { method: "POST", body: JSON.stringify({ getatext_id }) }
    ),

  pollStatus: (getatext_id: number) =>
    apiFetch<{ status: string; code: string | null; end_time?: string; refunded: boolean; new_balance: number | null }>(
      "/rentals/poll-status.php",
      { method: "POST", body: JSON.stringify({ getatext_id }) }
    ),
};

// ── Wallet ────────────────────────────────────────────────────────────────────

export type TopupRecord = {
  id: number;
  amount: number;
  method: string;
  status: "pending" | "completed" | "failed";
  reference?: string;
  created_at: string;
};

export const walletApi = {
  balance: () => apiFetch<{ balance: number }>("/wallet/index.php"),
  topups: () => apiFetch<TopupRecord[]>("/wallet/topups.php"),
};
