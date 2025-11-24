"use client";
import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/services/auth";

export default function RoleGuard({ allowed, children }: { allowed: string[]; children: ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const role = auth.getRole();
    if (!role || !allowed.includes(role)) {
      // not allowed, redirect to login
      auth.clear();
      router.replace("/login");
      return;
    }
    setReady(true);
  }, [allowed, router]);

  if (!ready) return null;
  return <>{children}</>;
}
