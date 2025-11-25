import ConsultationDetail from "@/components/consultation/ConsultationDetail";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="space-y-4">
      {/* Client component handles fetching and actions */}
      <ConsultationDetail id={id} />
    </div>
  );
}
