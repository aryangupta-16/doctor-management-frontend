import ConsultationDetail from "@/components/consultation/ConsultationDetail";

export default async function DoctorConsultationDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="space-y-4">
      {/* Client component will fetch and provide doctor actions */}
      <ConsultationDetail id={id} />
    </div>
  );
}
