import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { consultations } from "@/mock/consultations";

export default function PatientConsultations() {
  return (
    <Table>
      <THead>
        <TR>
          <TH>ID</TH>
          <TH>Date</TH>
          <TH>Time</TH>
          <TH>Status</TH>
          <TH></TH>
        </TR>
      </THead>
      <TBody>
        {consultations.map((c) => (
          <TR key={c.id}>
            <TD>{c.id}</TD>
            <TD>{c.date}</TD>
            <TD>{c.time}</TD>
            <TD>
              <Badge label={c.status} color={c.status === "Scheduled" ? "blue" : c.status === "Completed" ? "green" : "gray"} />
            </TD>
            <TD className="text-right">
              <Link className="text-blue-600 hover:underline" href={`/patient/consultation/${c.id}`}>View</Link>
            </TD>
          </TR>
        ))}
      </TBody>
    </Table>
  );
}
