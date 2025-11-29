"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/services/auth";
import { getRedirectForRole } from "@/lib/mockAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Role = "patient" | "doctor" | "admin";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("patient");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    // split name into first/last
    const parts = name.trim().split(" ");
    const firstName = parts.shift() ?? "";
    const lastName = parts.join(" ") ?? "";
    try {
      if (role === "doctor") {
        await auth.registerDoctor({ email, password, firstName, lastName });
      } else {
        await auth.register({ email, password, firstName, lastName });
      }
      // After register, redirect to login (server may require email verification)
      router.push("/login");
    } catch (err: any) {
      setError(err?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const role = auth.getRole();
    if (role) {
      router.replace(getRedirectForRole(role as any));
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-14">
      <div className="w-full max-w-md animate-[subtle-fade-up_360ms_ease-out]">
        <Card className="border border-white/15">
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-semibold text-slate-50">Create account</div>
                <div className="text-sm text-slate-300">Select your role and continue</div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-200">Full Name</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-200">Email</label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-200">Password</label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a password" required />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-200">Role</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["patient","doctor","admin"] as Role[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`rounded-2xl border px-4 py-2 text-sm transition-all ${role===r?"border-sky-400 bg-slate-900/60 text-slate-50 shadow-[0_10px_30px_rgba(56,189,248,0.4)]":"border-slate-700/80 bg-slate-900/40 text-slate-300 hover:border-slate-500"}`}
                    >
                      {r[0].toUpperCase()+r.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              {error && <div className="text-sm text-rose-400">{error}</div>}
              <Button type="submit" className="w-full" disabled={loading}>{loading?"Creating...":"Create Account"}</Button>
              <div className="text-center text-sm text-slate-300">
                Already have an account? <a className="text-sky-400 hover:text-sky-300" href="/login">Sign in</a>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
