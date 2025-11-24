import { Sidebar } from "@/components/layout/Sidebar";
import { RoleShell } from "@/components/layout/RoleShell";
import RoleGuard from "@/components/auth/RoleGuard";
import { Calendar, FileText, Gauge, User } from "lucide-react";

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  const items = [
    { href: "/doctor/dashboard", label: "Dashboard", icon: <Gauge size={18}/> },
    { href: "/doctor/availability", label: "Availability", icon: <Calendar size={18}/> },
    { href: "/doctor/consultations", label: "Consultations", icon: <FileText size={18}/> },
    { href: "/doctor/profile", label: "Profile", icon: <User size={18}/> },
  ];
  return (
    <RoleGuard allowed={["doctor"]}>
      <RoleShell sidebar={<Sidebar title="Doctor" items={items}/>}>{children}</RoleShell>
    </RoleGuard>
  );
}
