"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authenticate, getRedirectForRole } from "@/lib/mockAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Role = "patient" | "doctor" | "admin";

export default function HomeAuth() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<Role>("patient");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function prefill(r: Role) {
    setRole(r);
    if (r === "patient") { setEmail("patient@example.com"); setPassword("patient123"); }
    if (r === "doctor") { setEmail("doctor@example.com"); setPassword("doctor123"); }
    if (r === "admin") { setEmail("admin@example.com"); setPassword("admin123"); }
  }

  function onSignIn(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = authenticate(email, password);
    if (!res.ok) {
      setLoading(false);
      setError("Invalid credentials. Use quick fill below.");
      return;
    }
    router.push(getRedirectForRole(res.role));
  }

  function onSignUp(e: React.FormEvent) {
    e.preventDefault();
    // Mock: accept any signup and redirect by chosen role
    router.push(getRedirectForRole(role));
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-14">
      <div className="w-full max-w-md">
        <div className="mb-4 flex items-center justify-center gap-2">
          <Button variant={mode === "signin" ? "primary" : "secondary"} onClick={() => setMode("signin")}>Sign In</Button>
          <Button variant={mode === "signup" ? "primary" : "secondary"} onClick={() => setMode("signup")}>Sign Up</Button>
        </div>
        <Card>
          <CardContent>
            {mode === "signin" ? (
              <form onSubmit={onSignIn} className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-semibold text-slate-900">Sign in</div>
                  <div className="text-sm text-slate-600">Use mock credentials below</div>
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
                  <Button type="button" variant="secondary" onClick={() => prefill("patient")}>Patient</Button>
                  <Button type="button" variant="secondary" onClick={() => prefill("doctor")}>Doctor</Button>
                  <Button type="button" variant="secondary" onClick={() => prefill("admin")}>Admin</Button>
                </div>
              </form>
            ) : (
              <form onSubmit={onSignUp} className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-semibold text-slate-900">Create account</div>
                  <div className="text-sm text-slate-600">Select your role and continue</div>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Full Name</label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
                  <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a password" required />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Role</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["patient","doctor","admin"] as Role[]).map((r) => (
                      <button key={r} type="button" onClick={() => setRole(r)} className={`rounded-xl border px-4 py-2 text-sm ${role===r?"border-slate-900 text-slate-900":"border-gray-200 text-slate-700"}`}>{r[0].toUpperCase()+r.slice(1)}</button>
                    ))}
                  </div>
                </div>
                <Button type="submit" className="w-full">Create Account</Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
