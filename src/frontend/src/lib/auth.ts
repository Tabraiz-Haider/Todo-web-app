"use client";

export const TOKEN_KEY = "todo_token";
export const TOKEN_EXPIRY_KEY = "todo_token_expiry";

export function saveToken(token: string, expiresAt: string) {
  console.log("[Auth] Saving token, expiresAt:", expiresAt);
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(TOKEN_EXPIRY_KEY, expiresAt);
  console.log("[Auth] Token saved successfully");
}

export function clearToken() {
  console.log("[Auth] Clearing token");
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_EXPIRY_KEY);
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem(TOKEN_KEY);
  console.log("[Auth] getToken(), token exists:", !!token);
  return token;
}

export function isTokenValid(): boolean {
  if (typeof window === "undefined") {
    console.log("[Auth] isTokenValid: window is undefined");
    return false;
  }

  const token = localStorage.getItem(TOKEN_KEY);
  const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);

  console.log("[Auth] isTokenValid check:", {
    tokenExists: !!token,
    expiry: expiry,
  });

  if (!token) {
    console.log("[Auth] isTokenValid: No token found");
    return false;
  }

  if (!expiry) {
    console.log("[Auth] isTokenValid: No expiry found");
    return false;
  }

  // Handle different expiry formats
  let expiryMs: number;
  try {
    // If expiry is already a number (milliseconds), use it directly
    if (/^\d+$/.test(expiry)) {
      expiryMs = parseInt(expiry, 10);
    } else {
      // Parse ISO string format
      const expiryDate = new Date(expiry);
      if (isNaN(expiryDate.getTime())) {
        console.log("[Auth] isTokenValid: Invalid expiry date format");
        return false;
      }
      expiryMs = expiryDate.getTime();
    }

    const isValid = Date.now() < expiryMs;
    console.log("[Auth] isTokenValid:", isValid, {
      expiryMs,
      now: Date.now(),
      remainingMs: expiryMs - Date.now(),
    });

    return isValid;
  } catch (error) {
    console.error("[Auth] isTokenValid: Error parsing expiry:", error);
    return false;
  }
}
