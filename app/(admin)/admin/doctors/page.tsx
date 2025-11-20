import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { doctors } from "@/mock/doctors";
import Link from "next/link";

export default function AdminDoctors() {
  return (
    <Table>
      <THead>
        <TR>
          <TH>ID</TH>
          <TH>Name</TH>
          <TH>Speciality</TH>
          <TH>Experience</TH>
          <TH></TH>
        </TR>
      </THead>
      <TBody>
        {doctors.map((d) => (
          <TR key={d.id}>
            <TD>{d.id}</TD>
            <TD>{d.name}</TD>
            <TD>{d.speciality}</TD>
            <TD>{d.experience} yrs</TD>
            <TD className="text-right">
              <Link className="text-blue-600" href={`/admin/doctor/${d.id}`}>View</Link>
            </TD>
          </TR>
        ))}
      </TBody>
    </Table>
  );
}
