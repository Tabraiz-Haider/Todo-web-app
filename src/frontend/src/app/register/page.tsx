import Link from "next/link";
import { AuthForm } from "@/components/auth-form";

export default function RegisterPage() {
  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm p-8">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-semibold">Create an account</h2>
        <p className="text-sm text-slate-500">Join to manage your tasks anywhere.</p>
      </div>
      <div className="mt-6">
        <AuthForm mode="register" />
      </div>
      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link className="font-medium text-slate-900" href="/login">
          Sign in
        </Link>
      </p>
    </div>
  );
}
