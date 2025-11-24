"use client";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-14">
      <div className="w-full max-w-md">
        <Card>
          <CardContent>
            <div className="text-center">
              <h1 className="text-2xl font-semibold text-slate-900">TeleMed</h1>
              <p className="mt-2 text-sm text-slate-600">Secure telemedicine for doctors and patients. Sign in to continue or create a new account.</p>
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
