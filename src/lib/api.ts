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
  is_disabled?: boolean;
};

export type AuthResponse = { token: string; user: User };

export const authApi = {
  register: (name: string, email: string, password: string, referralCode?: string) =>
    apiFetch<AuthResponse>("/auth/register.php", {
      method: "POST",
      body: JSON.stringify({ name, email, password, ...(referralCode ? { referral_code: referralCode } : {}) }),
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
  source?: string | null;       // 'getatext' | 'fivesim'
  country?: string | null;      // 5sim country code, null for getatext
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

// ── Long-Term Rentals ─────────────────────────────────────────────────────────

export type LongRentalPeriodPrice = { period: string; cost: string; price_ngn: number };
export type LongRentalService     = { service_name: string; api_name: string; prices: LongRentalPeriodPrice[] };

export type LongRental = {
  id: number;
  getatext_id: number;
  number: string;
  service_name: string;
  api_name: string;
  period: string;
  price_usd: number;
  price_ngn: number;
  status: string;
  end_time: string;
  auto_renew: boolean;
  rented_at: string;
};

export type LongRentalMessage = {
  message: string;
  sender: string;
  received_at: string;
  number: string;
  service_name?: string;
};

export const longRentalsApi = {
  prices: () =>
    apiFetch<{ services: LongRentalService[] }>("/long-rentals/prices.php"),

  list: () =>
    apiFetch<LongRental[]>("/long-rentals/index.php"),

  create: (data: { service: string; period: string; auto_renew: boolean; price_usd: number; price_ngn: number }) =>
    apiFetch<{ rental: LongRental; price_ngn: number; new_balance: number }>("/long-rentals/index.php", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  cancel: (number: string, service?: string) =>
    apiFetch<{ status: string }>("/long-rentals/cancel.php", {
      method: "POST",
      body: JSON.stringify({ number, ...(service ? { service } : {}) }),
    }),

  renew: (number: string, service?: string) =>
    apiFetch<{ rental: LongRental; new_balance: number }>("/long-rentals/renew.php", {
      method: "POST",
      body: JSON.stringify({ number, ...(service ? { service } : {}) }),
    }),

  messages: (number: string, service?: string) =>
    apiFetch<{ messages: LongRentalMessage[] }>(
      `/long-rentals/messages.php?number=${encodeURIComponent(number)}${service ? `&service=${encodeURIComponent(service)}` : ""}`
    ),

  setAutoRenew: (number: string, autoRenew: boolean, service?: string) =>
    apiFetch<{ auto_renew: boolean }>("/long-rentals/auto-renew.php", {
      method: "POST",
      body: JSON.stringify({ number, auto_renew: autoRenew, ...(service ? { service } : {}) }),
    }),
};

// ── Dedicated Rentals ─────────────────────────────────────────────────────────

export type DedicatedPrice = {
  period: string;
  label: string;
  price_usd: number;
  price_ngn: number;
};

export type DedicatedRental = {
  id: number;
  getatext_id: number;
  number: string;
  period: string;
  price_usd: number;
  price_ngn: number;
  status: string;
  end_time: string;
  auto_renew: boolean;
  rented_at: string;
};

export type DedicatedMessage = {
  message: string;
  number: string;
  sender: string;
  rented_at: string;
};

export const dedicatedApi = {
  prices: () =>
    apiFetch<{ prices: DedicatedPrice[]; stock: number }>("/dedicated/prices.php"),

  list: () =>
    apiFetch<DedicatedRental[]>("/dedicated/index.php"),

  create: (data: { rental_time: string; auto_renew: boolean; price_usd: number; price_ngn: number }) =>
    apiFetch<{ rental: DedicatedRental; price_ngn: number; new_balance: number }>("/dedicated/index.php", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (data: { id: number; action: "renew" | "cancel" | "toggle_auto_renew"; auto_renew?: boolean }) =>
    apiFetch<{ rental?: DedicatedRental; new_balance?: number; status?: string; auto_renew?: boolean }>("/dedicated/update.php", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  messages: (gtId: number) =>
    apiFetch<{ messages: DedicatedMessage[] }>(`/dedicated/messages.php?id=${gtId}`),
};
