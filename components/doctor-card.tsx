import Image from "next/image";
import Link from "next/link";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import type { Doctor } from "@/mock/doctors";

export function DoctorCard({ doctor }: { doctor: Doctor }) {
  return (
    <Card className="flex items-center gap-4">
      <Image src={doctor.photo} alt={doctor.name} width={64} height={64} className="h-16 w-16 rounded-xl object-cover" />
      <div className="flex-1">
        <div className="text-slate-900 font-semibold">{doctor.name}</div>
        <div className="text-slate-600 text-sm">{doctor.speciality} • {doctor.experience} years</div>
        <div className="mt-2 text-sm text-slate-500">{doctor.hospital}</div>
      </div>
      <div className="flex items-center gap-2">
        <Link href={`/patient/doctor/${doctor.id}`}><Button variant="secondary">View</Button></Link>
        <Link href={`/patient/booking/${doctor.id}`}><Button>Book</Button></Link>
      </div>
    </Card>
  );
}
