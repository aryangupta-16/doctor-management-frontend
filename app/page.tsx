"use client";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-14">
      <div className="w-full max-w-md animate-[subtle-fade-up_360ms_ease-out]">
        <Card className="border border-white/15">
          <CardContent>
            <div className="mb-6 text-center">
              <div className="inline-flex items-center gap-2 rounded-2xl bg-slate-900/70 px-3 py-1 text-xs font-medium text-slate-300 ring-1 ring-white/10">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Secure, modern telemedicine
              </div>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-50">TeleMed</h1>
              <p className="mt-2 text-sm text-slate-300">
                Connect patients, doctors, and admins in a single, secure telemedicine platform.
              </p>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-3">
              <Link href="/login"><Button className="w-full">Sign In</Button></Link>
              <Link href="/signup"><Button variant="secondary" className="w-full">Sign Up</Button></Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
