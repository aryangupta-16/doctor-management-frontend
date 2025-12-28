import PrescriptionDetail from "@/components/prescription/PrescriptionDetail";

export default async function DoctorPrescriptionDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div>
      <PrescriptionDetail id={id} />
    </div>
  );
}
