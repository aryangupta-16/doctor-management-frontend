import ScheduleManager from "@/components/availability/ScheduleManager";
import SlotManager from "@/components/availability/SlotManager";

export default function DoctorAvailability() {
  return (
    <div className="space-y-8">
      <ScheduleManager />
      <SlotManager />
    </div>
  );
}
