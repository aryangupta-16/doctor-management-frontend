"use client";
import Link from "next/link";
import { Calendar, FileText, Home, User, Search, LogOut } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/services/auth";
import { ChatLauncher } from "@/components/chat/ChatLauncher";

export function PatientNavbar() {
  const router = useRouter();
  const [processing, setProcessing] = useState(false);

  const handleLogout = async () => {
    setProcessing(true);
    try {
      await auth.logout();
      router.push("/login");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-xl supports-[backdrop-filter]:bg-white/70">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-sky-100 text-xs font-semibold text-sky-700">
            TM
          </span>
          <span className="text-lg font-semibold text-slate-900">TeleMed</span>
        </Link>
        <div className="flex items-center gap-1 text-slate-600">
          <Link
            href="/patient/dashboard"
            className="flex items-center gap-2 rounded-2xl px-3 py-2 text-sm transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            <Home size={18} />
            Dashboard
          </Link>
          <Link
            href="/patient/doctors"
            className="flex items-center gap-2 rounded-2xl px-3 py-2 text-sm transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            <Search size={18} />
            Doctors
          </Link>
          <Link
            href="/patient/consultations"
            className="flex items-center gap-2 rounded-2xl px-3 py-2 text-sm transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            <Calendar size={18} />
            Consultations
          </Link>
          <Link
            href="/patient/prescriptions"
            className="flex items-center gap-2 rounded-2xl px-3 py-2 text-sm transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            <FileText size={18} />
            Prescriptions
          </Link>
          <Link
            href="/patient/profile"
            className="flex items-center gap-2 rounded-2xl px-3 py-2 text-sm transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            <User size={18} />
            Profile
          </Link>
          <ChatLauncher label="Chat with us" />
          <button
            onClick={handleLogout}
            disabled={processing}
            className="flex items-center gap-2 rounded-2xl border border-rose-100 bg-rose-50 px-3 py-2 text-sm text-rose-700 transition hover:bg-rose-100 disabled:opacity-60"
          >
            <LogOut size={18} />
            {processing ? "Signing out..." : "Logout"}
          </button>
        </div>
      </nav>
    </header>
  );
}
