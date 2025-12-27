import Image from "next/image";
import Link from "next/link";
import { Card } from "./ui/card";
import { Button } from "./ui/button";

type DoctorCardProps = {
  doctor: {
    id: string; // User ID for profile viewing
    doctorId?: string; // Doctor ID for booking (optional for backward compatibility)
    name: string;
    speciality: string;
    experience: number;
    hospital: string;
    photo: string;
  };
};

export function DoctorCard({ doctor }: DoctorCardProps) {
  // Use doctorId for booking if available, otherwise fall back to id for backward compatibility
  const bookingId = doctor.doctorId || doctor.id;
  
  return (
    <Card className="flex items-center gap-4">
      {/* <Image src={doctor.photo} alt={doctor.name} width={64} height={64} className="h-16 w-16 rounded-xl object-cover" /> */}
      <div className="flex-1">
        <div className="font-semibold text-slate-50">{doctor.name}</div>
        <div className="text-sm text-slate-300">{doctor.speciality} • {doctor.experience} years</div>
        <div className="mt-2 text-sm text-slate-400">{doctor.hospital}</div>
      </div>
      <div className="flex items-center gap-2">
        <Link href={`/patient/doctor/${doctor.id}`}><Button variant="secondary">View</Button></Link>
        <Link href={`/patient/booking/${bookingId}`}><Button>Book</Button></Link>
      </div>
    </Card>
  );
}
