import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { consultations } from "@/mock/consultations";
import Link from "next/link";

export default function DoctorConsultations() {
  const mine = consultations; // mock: show all
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
        {mine.map((c) => (
          <TR key={c.id}>
            <TD>{c.id}</TD>
            <TD>{c.date}</TD>
            <TD>{c.time}</TD>
            <TD>{c.status}</TD>
            <TD className="text-right">
              <Link className="text-blue-600" href={`/doctor/consultation/${c.id}`}>Open</Link>
            </TD>
          </TR>
        ))}
      </TBody>
    </Table>
  );
}
