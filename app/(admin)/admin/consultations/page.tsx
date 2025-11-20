import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { consultations } from "@/mock/consultations";

export default function AdminConsultations() {
  return (
    <Table>
      <THead>
        <TR>
          <TH>ID</TH>
          <TH>Doctor</TH>
          <TH>Patient</TH>
          <TH>Date</TH>
          <TH>Time</TH>
          <TH>Status</TH>
        </TR>
      </THead>
      <TBody>
        {consultations.map((c) => (
          <TR key={c.id}>
            <TD>{c.id}</TD>
            <TD>{c.doctorId}</TD>
            <TD>{c.patientId}</TD>
            <TD>{c.date}</TD>
            <TD>{c.time}</TD>
            <TD>{c.status}</TD>
          </TR>
        ))}
      </TBody>
    </Table>
  );
}
