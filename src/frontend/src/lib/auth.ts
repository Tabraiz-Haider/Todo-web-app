"use client";

export const TOKEN_KEY = "todo_token";
export const TOKEN_EXPIRY_KEY = "todo_token_expiry";

export function saveToken(token: string, expiresAt: string) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(TOKEN_EXPIRY_KEY, expiresAt);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_EXPIRY_KEY);
}

export function getToken(): string | null {
  return typeof window === "undefined" ? null : localStorage.getItem(TOKEN_KEY);
}

export function isTokenValid(): boolean {
  if (typeof window === "undefined") return false;
  const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
  if (!expiry) return false;
  const expiryDate = new Date(expiry).getTime();
  if (isNaN(expiryDate)) return false;
  return Date.now() < expiryDate;
}
