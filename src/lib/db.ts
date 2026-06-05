import fs from "fs";
import path from "path";
import crypto from "crypto";

// ── Database file path ────────────────────────────────────────────────────────

const DB_PATH = path.join(process.cwd(), "data", "db.json");

// ── Types ─────────────────────────────────────────────────────────────────────

export interface DbUser {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  wallet_balance: number;
  created_at: string;
}

export interface DbSession {
  token: string;
  user_id: number;
}

export interface DbRental {
  id: number;
  user_id: number;
  getatext_id: number;
  number: string;
  service_name: string;
  end_time: string;
  price_usd: number;
  price_ngn: number;
  status: string;
  sms_code: string | null;
  rented_at: string;
}

export interface DbTopup {
  id: number;
  user_id: number;
  amount: number;
  method: string;
  status: string;
  reference: string;
  created_at: string;
}

interface Counters {
  user_id: number;
  rental_id: number;
  topup_id: number;
}

interface DB {
  users: DbUser[];
  sessions: DbSession[];
  rentals: DbRental[];
  topups: DbTopup[];
  _counters: Counters;
}

// ── Read / Write ──────────────────────────────────────────────────────────────

const EMPTY: DB = {
  users: [],
  sessions: [],
  rentals: [],
  topups: [],
  _counters: { user_id: 0, rental_id: 0, topup_id: 0 },
};

export function readDB(): DB {
  try {
    const raw = fs.readFileSync(DB_PATH, "utf-8");
    const parsed = JSON.parse(raw) as Partial<DB>;
    return {
      users: parsed.users ?? [],
      sessions: parsed.sessions ?? [],
      rentals: parsed.rentals ?? [],
      topups: parsed.topups ?? [],
      _counters: parsed._counters ?? { user_id: 0, rental_id: 0, topup_id: 0 },
    };
  } catch {
    return { ...EMPTY, _counters: { ...EMPTY._counters } };
  }
}

export function writeDB(db: DB): void {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf-8");
}

export function nextId(db: DB, key: keyof Counters): number {
  db._counters[key] += 1;
  return db._counters[key];
}

// ── Password & token helpers ──────────────────────────────────────────────────

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 100_000, 64, "sha512")
    .toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const verify = crypto
    .pbkdf2Sync(password, salt, 100_000, 64, "sha512")
    .toString("hex");
  // constant-time compare to prevent timing attacks
  try {
    return crypto.timingSafeEqual(Buffer.from(verify, "hex"), Buffer.from(hash, "hex"));
  } catch {
    return false;
  }
}

export function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

// ── Auth helpers ──────────────────────────────────────────────────────────────

export function getBearerToken(req: Request): string | null {
  const auth = req.headers.get("authorization") ?? "";
  if (!auth.startsWith("Bearer ")) return null;
  return auth.slice(7);
}

export function getUserFromToken(token: string): DbUser | null {
  if (!token) return null;
  const db = readDB();
  const session = db.sessions.find((s) => s.token === token);
  if (!session) return null;
  return db.users.find((u) => u.id === session.user_id) ?? null;
}
