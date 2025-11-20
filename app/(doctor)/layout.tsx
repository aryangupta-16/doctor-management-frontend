import { Sidebar } from "@/components/layout/Sidebar";
import { RoleShell } from "@/components/layout/RoleShell";
import { Calendar, FileText, Gauge, User } from "lucide-react";

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  const items = [
    { href: "/doctor/dashboard", label: "Dashboard", icon: <Gauge size={18}/> },
    { href: "/doctor/availability", label: "Availability", icon: <Calendar size={18}/> },
    { href: "/doctor/consultations", label: "Consultations", icon: <FileText size={18}/> },
    { href: "/doctor/profile", label: "Profile", icon: <User size={18}/> },
  ];
  return (
    <RoleShell sidebar={<Sidebar title="Doctor" items={items}/>}>{children}</RoleShell>
  );
}
