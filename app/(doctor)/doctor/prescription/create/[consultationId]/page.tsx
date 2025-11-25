import PrescriptionForm from "@/components/prescription/PrescriptionForm";

export default async function CreatePrescription({ params }: { params: Promise<{ consultationId: string }> }) {
  const { consultationId } = await params;
  return (
    <div>
      <PrescriptionForm consultationId={consultationId} />
    </div>
  );
}
