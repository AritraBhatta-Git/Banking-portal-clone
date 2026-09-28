import { DEMO_USERS } from "@/data/users";

export interface AuthResult {
  ok: boolean;
  error?: string;
}

export function authenticate(userId: string, password: string): AuthResult {
  const id = userId.trim();
  if (!id || !password) {
    return { ok: false, error: "Enter both your User ID and Passcode to sign in." };
  }
  const match = DEMO_USERS.find((u) => u.userId === id);
  if (!match || match.password !== password) {
    return {
      ok: false,
      error:
        "The User ID or Passcode you entered does not match our records. Please try again.",
    };
  }
  return { ok: true };
}

export const REMEMBERED_ID_KEY = "boa-remembered-user-id";

export function readRememberedId(): string {
  if (typeof window === "undefined") return "";
  try {
    return window.localStorage.getItem(REMEMBERED_ID_KEY) ?? "";
  } catch {
    return "";
  }
}

export function writeRememberedId(userId: string | null) {
  if (typeof window === "undefined") return;
  try {
    if (userId) window.localStorage.setItem(REMEMBERED_ID_KEY, userId);
    else window.localStorage.removeItem(REMEMBERED_ID_KEY);
  } catch {
    /* storage unavailable */
  }
}
