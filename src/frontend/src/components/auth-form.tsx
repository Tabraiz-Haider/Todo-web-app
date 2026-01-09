"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiClient } from "@/lib/api-client";
import { saveToken } from "@/lib/auth";

const schema = z.object({
  email: z.string().email({ message: "Enter a valid email" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

interface AuthFormProps {
  mode: "login" | "register";
}

type FormData = z.infer<typeof schema>;

export function AuthForm({ mode }: AuthFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = useCallback(async (data: FormData) => {
    console.log("[Auth] Form submitted, email:", data.email);
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      if (mode === "register") {
        console.log("[Auth] Registering user...");
        await apiClient.post("/auth/register", data);
        setSuccessMessage("Account created! You can now log in.");
        console.log("[Auth] Registration successful");
      } else {
        console.log("[Auth] Logging in...");
        const response = await apiClient.post(
          "/auth/login",
          new URLSearchParams({
            username: data.email,
            password: data.password,
          }),
          {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
          }
        );
        console.log("[Auth] Login response received:", response.data);

        const { access_token, expires_at } = response.data;
        console.log("[Auth] Token received, length:", access_token?.length);

        if (!access_token) {
          throw new Error("No token received from server");
        }

        const expiresAt = expires_at
          ? (typeof expires_at === "string" ? expires_at : new Date(expires_at).toISOString())
          : new Date(Date.now() + 60 * 60 * 1000).toISOString();
        console.log("[Auth] Saving token, expiresAt:", expiresAt, "token length:", access_token?.length);

        saveToken(access_token, expiresAt);
        console.log("[Auth] Token saved to localStorage");

        // Verify token was saved
        const savedToken = localStorage.getItem("todo_token");
        console.log("[Auth] Token verification, saved token exists:", !!savedToken);

        // Redirect to dashboard
        console.log("[Auth] Redirecting to dashboard...");
        router.push("/dashboard");
      }
    } catch (err: any) {
      console.error("[Auth] Error:", err.message || err);
      console.error("[Auth] Full error:", err);
      const message = err.response?.data?.detail || err.message || "Something went wrong";
      setError(message);
    } finally {
      setLoading(false);
      console.log("[Auth] Loading set to false");
    }
  }, [mode, router]);

  return (
    <form
      onSubmit={(e) => {
        console.log("[Auth] Form onSubmit triggered");
        handleSubmit(onSubmit)(e);
      }}
      className="space-y-4"
    >
      <div>
        <label className="block text-sm font-medium text-slate-700">Email</label>
        <input
          type="email"
          className="mt-1 w-full rounded-md border px-3 py-2"
          placeholder="you@example.com"
          {...register("email")}
        />
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700">Password</label>
        <input
          type="password"
          className="mt-1 w-full rounded-md border px-3 py-2"
          placeholder="••••••••"
          {...register("password")}
        />
        {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
      </div>
      {error && <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
      {successMessage && (
        <div className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">{successMessage}</div>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-slate-900 px-4 py-2 text-white hover:bg-slate-800 disabled:opacity-60"
      >
        {loading ? "Please wait..." : mode === "login" ? "Sign in" : "Create account"}
      </button>
    </form>
  );
}
