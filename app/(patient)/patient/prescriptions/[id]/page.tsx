import PrescriptionDetail from "@/components/prescription/PrescriptionDetail";

export default async function PatientPrescriptionDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div>
      {/* @ts-expect-error Client component */}
      <PrescriptionDetail id={id} />
    </div>
  );
}
