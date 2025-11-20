import { Sidebar } from "@/components/layout/Sidebar";
import { RoleShell } from "@/components/layout/RoleShell";
import { Gauge, UserCog, Users, FileText } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const items = [
    { href: "/admin/dashboard", label: "Dashboard", icon: <Gauge size={18}/> },
    { href: "/admin/doctors", label: "Doctors", icon: <UserCog size={18}/> },
    { href: "/admin/patients", label: "Patients", icon: <Users size={18}/> },
    { href: "/admin/consultations", label: "Consultations", icon: <FileText size={18}/> },
  ];
  return (
    <RoleShell sidebar={<Sidebar title="Admin" items={items}/>}>{children}</RoleShell>
  );
}
