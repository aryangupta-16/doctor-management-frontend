"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
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

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock: accept any signup
    router.push(getRedirectForRole(role));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-14">
      <div className="w-full max-w-md">
        <Card>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
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
              <div className="text-center text-sm text-slate-600">
                Already have an account? <a className="text-blue-600" href="/login">Sign in</a>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
