"use client";
import Link from "next/link";
import { Calendar, FileText, Home, User, Search, LogOut } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/services/auth";

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
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-900/70 backdrop-blur-2xl supports-[backdrop-filter]:bg-slate-900/60">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-500 text-xs font-semibold text-white shadow-[0_0_0_1px_rgba(148,163,184,0.5)]">
            TM
          </span>
          <span className="bg-gradient-to-r from-slate-50 via-sky-100 to-indigo-200 bg-clip-text text-lg font-semibold text-transparent">
            TeleMed
          </span>
        </Link>
        <div className="flex items-center gap-1 text-slate-300">
          <Link href="/patient/dashboard" className="flex items-center gap-2 rounded-2xl px-3 py-2 text-sm transition-colors hover:bg-slate-800/80 hover:text-slate-50">
            <Home size={18}/>
            Dashboard
          </Link>
          <Link href="/patient/doctors" className="flex items-center gap-2 rounded-2xl px-3 py-2 text-sm transition-colors hover:bg-slate-800/80 hover:text-slate-50">
            <Search size={18}/>
            Doctors
          </Link>
          <Link href="/patient/consultations" className="flex items-center gap-2 rounded-2xl px-3 py-2 text-sm transition-colors hover:bg-slate-800/80 hover:text-slate-50">
            <Calendar size={18}/>
            Consultations
          </Link>
          <Link href="/patient/prescriptions" className="flex items-center gap-2 rounded-2xl px-3 py-2 text-sm transition-colors hover:bg-slate-800/80 hover:text-slate-50">
            <FileText size={18}/>
            Prescriptions
          </Link>
          <Link href="/patient/profile" className="flex items-center gap-2 rounded-2xl px-3 py-2 text-sm transition-colors hover:bg-slate-800/80 hover:text-slate-50">
            <User size={18}/>
            Profile
          </Link>
          <button
            onClick={handleLogout}
            disabled={processing}
            className="flex items-center gap-2 rounded-2xl bg-rose-500/10 px-3 py-2 text-sm text-rose-300 transition hover:bg-rose-500/20 hover:text-rose-100 disabled:opacity-60"
          >
            <LogOut size={18}/>
            {processing ? "Signing out..." : "Logout"}
          </button>
        </div>
      </nav>
    </header>
  );
}
