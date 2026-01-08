import Link from "next/link";
import { AuthForm } from "@/components/auth-form";

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm p-8">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-semibold">Welcome back</h2>
        <p className="text-sm text-slate-500">Sign in to continue managing your tasks.</p>
      </div>
      <div className="mt-6">
        <AuthForm mode="login" />
      </div>
      <p className="mt-6 text-center text-sm text-slate-500">
        New here?{" "}
        <Link className="font-medium text-slate-900" href="/register">
          Create an account
        </Link>
      </p>
    </div>
  );
}
