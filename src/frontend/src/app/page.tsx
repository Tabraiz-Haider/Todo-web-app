import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-6 text-center">
      <h2 className="text-3xl font-semibold text-slate-900">Welcome to Todo Webapp</h2>
      <p className="text-slate-600">
        Manage your tasks anywhere. Create an account or sign in to get started.
      </p>
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
        <Link
          href="/register"
          className="rounded-md bg-slate-900 px-6 py-3 text-white hover:bg-slate-800"
        >
          Create an account
        </Link>
        <Link
          href="/login"
          className="rounded-md border border-slate-300 px-6 py-3 text-slate-700 hover:bg-slate-50"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
}
