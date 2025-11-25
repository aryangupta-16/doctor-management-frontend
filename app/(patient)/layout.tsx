import { PatientNavbar } from "@/components/layout/PatientNavbar";
import RoleGuard from "@/components/auth/RoleGuard";

export default function PatientLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowed={["patient"]}>
      <div className="min-h-screen bg-gray-50">
        <PatientNavbar />
        <div className="mx-auto max-w-7xl px-6 py-6">{children}</div>
      </div>
    </RoleGuard>
  );
}
