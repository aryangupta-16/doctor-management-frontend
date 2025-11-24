"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authenticate, getRedirectForRole } from "@/lib/mockAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handlePrefill(role: "patient" | "doctor" | "admin") {
    if (role === "patient") { setEmail("patient@example.com"); setPassword("patient123"); }
    if (role === "doctor") { setEmail("doctor@example.com"); setPassword("doctor123"); }
    if (role === "admin") { setEmail("admin@example.com"); setPassword("admin123"); }
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = authenticate(email, password);
    if (!res.ok) {
      setLoading(false);
      setError("Invalid credentials. Try prefill buttons below.");
      return;
    }
    const redirectTo = getRedirectForRole(res.role);
    router.push(redirectTo);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-md">
        <Card>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-semibold text-slate-900">Sign in</div>
                <div className="text-sm text-slate-600">Use mock credentials for now</div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
              </div>
              {error && <div className="text-sm text-rose-600">{error}</div>}
              <Button type="submit" className="w-full" disabled={loading}>{loading ? "Signing in..." : "Login"}</Button>
              <div className="text-xs text-slate-600 text-center">Quick fill</div>
              <div className="grid grid-cols-3 gap-2">
                <Button type="button" variant="secondary" onClick={() => handlePrefill("patient")}>Patient</Button>
                <Button type="button" variant="secondary" onClick={() => handlePrefill("doctor")}>Doctor</Button>
                <Button type="button" variant="secondary" onClick={() => handlePrefill("admin")}>Admin</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
