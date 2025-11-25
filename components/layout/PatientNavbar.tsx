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
    <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="text-lg font-semibold text-slate-900">TeleMed</Link>
        <div className="flex items-center gap-2 text-slate-700">
          <Link href="/patient/dashboard" className="flex items-center gap-2 rounded-xl px-3 py-2 hover:bg-gray-100"><Home size={18}/>Dashboard</Link>
          <Link href="/patient/doctors" className="flex items-center gap-2 rounded-xl px-3 py-2 hover:bg-gray-100"><Search size={18}/>Doctors</Link>
          <Link href="/patient/consultations" className="flex items-center gap-2 rounded-xl px-3 py-2 hover:bg-gray-100"><Calendar size={18}/>Consultations</Link>
          <Link href="/patient/prescriptions" className="flex items-center gap-2 rounded-xl px-3 py-2 hover:bg-gray-100"><FileText size={18}/>Prescriptions</Link>
          <Link href="/patient/profile" className="flex items-center gap-2 rounded-xl px-3 py-2 hover:bg-gray-100"><User size={18}/>Profile</Link>
          <button onClick={handleLogout} disabled={processing} className="flex items-center gap-2 rounded-xl px-3 py-2 hover:bg-red-50 text-red-600">
            <LogOut size={18}/>{processing ? "Signing out..." : "Logout"}
          </button>
        </div>
      </nav>
    </header>
  );
}
