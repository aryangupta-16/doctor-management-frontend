import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { DoctorCard } from "@/components/doctor-card";
import { doctors } from "@/mock/doctors";

export default function PatientDoctors() {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Input placeholder="Search by name" />
          <Select defaultValue="all">
            <option value="all">All specialities</option>
            <option value="Cardiologist">Cardiologist</option>
            <option value="Dermatologist">Dermatologist</option>
            <option value="Pediatrician">Pediatrician</option>
          </Select>
          <Select defaultValue="any">
            <option value="any">Any experience</option>
            <option value=">5">5+ years</option>
            <option value=">10">10+ years</option>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {doctors.map((d) => (
          <DoctorCard key={d.id} doctor={d} />
        ))}
      </div>
    </div>
  );
}
