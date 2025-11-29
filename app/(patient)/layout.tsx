import { PatientNavbar } from "@/components/layout/PatientNavbar";
import RoleGuard from "@/components/auth/RoleGuard";

export default function PatientLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowed={["patient","doctor"]}>
      <div className="min-h-screen">
        <PatientNavbar />
        <div className="mx-auto max-w-7xl px-6 py-8 animate-[subtle-fade-up_320ms_ease-out]">
          <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-slate-900/40 p-6 shadow-[0_18px_80px_rgba(15,23,42,0.8)] backdrop-blur-xl">
            <div className="pointer-events-none absolute -inset-px rounded-[1.5rem] bg-[radial-gradient(circle_at_top,_rgba(96,165,250,0.16),transparent_55%),radial-gradient(circle_at_120%_20%,rgba(147,197,253,0.24),transparent_55%)] opacity-80" />
            <div className="relative z-10">
              {children}
            </div>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
