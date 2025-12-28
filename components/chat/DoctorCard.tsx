"use client";
import { Star, MapPin, Clock, DollarSign, Languages } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useChat } from "./ChatProvider";

type Doctor = {
  id: string;
  name: string;
  specialty_primary: string;
  specialties_secondary?: string[];
  years_experience: number;
  consultation_fee: string;
  consultation_duration: number;
  languages: string[];
  rating: number;
  total_consultations: number;
  location?: string;
  city?: string;
  state?: string;
};

export function DoctorCard({ doctor }: { doctor: Doctor }) {
  const router = useRouter();
  const { minimizeChat, bookingContext } = useChat();

  const handleBookAppointment = () => {
    minimizeChat();
    // Pass booking context via URL query params
    const params = new URLSearchParams();
    if (bookingContext?.symptoms)
      params.set("symptoms", bookingContext.symptoms);
    if (bookingContext?.chiefComplaint)
      params.set("chiefComplaint", bookingContext.chiefComplaint);
    const query = params.toString();
    router.push(`/booking/${doctor.id}${query ? `?${query}` : ""}`);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <h3 className="font-semibold text-slate-900">{doctor.name}</h3>
          <p className="text-sm text-sky-600">{doctor.specialty_primary}</p>
          {doctor.specialties_secondary &&
            doctor.specialties_secondary.length > 0 && (
              <p className="text-xs text-slate-500 mt-0.5">
                Also: {doctor.specialties_secondary.join(", ")}
              </p>
            )}
        </div>
        <div className="flex items-center gap-1 text-sm font-medium text-amber-600">
          <Star size={14} fill="currentColor" />
          <span>{doctor.rating.toFixed(1)}</span>
        </div>
      </div>

      <div className="mt-3 space-y-1.5 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <Clock size={14} className="text-slate-400" />
          <span>
            {doctor.years_experience} years experience •{" "}
            {doctor.total_consultations} consultations
          </span>
        </div>
        {doctor.location && (
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-slate-400" />
            <span>{doctor.location}</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <DollarSign size={14} className="text-slate-400" />
          <span>
            ₹{doctor.consultation_fee} for {doctor.consultation_duration} mins
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Languages size={14} className="text-slate-400" />
          <span>{doctor.languages.join(", ")}</span>
        </div>
      </div>

      <div className="mt-4">
        <Button
          variant="primary"
          size="sm"
          onClick={handleBookAppointment}
          className="w-full"
        >
          Book Appointment
        </Button>
      </div>
    </div>
  );
}
