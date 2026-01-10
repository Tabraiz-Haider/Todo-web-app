"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { clearToken } from "@/lib/auth";

export default function LogoutPage() {
  const router = useRouter();
  useEffect(() => {
    clearToken();
    router.push("/login");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="text-center">
      <p className="text-sm text-slate-500">Signing you out...</p>
    </div>
  );
}
