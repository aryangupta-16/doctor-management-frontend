import { PatientNavbar } from "@/components/layout/PatientNavbar";
import RoleGuard from "@/components/auth/RoleGuard";

export default function PatientLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowed={["patient","doctor"]}>
      <div className="min-h-screen">
        <PatientNavbar />
        <div className="mx-auto max-w-7xl px-6 py-8 animate-[subtle-fade-up_320ms_ease-out]">
          <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="relative z-10">
              {children}
            </div>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
