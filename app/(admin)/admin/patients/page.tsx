import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { patients } from "@/mock/patients";
import Link from "next/link";

export default function AdminPatients() {
  return (
    <Table>
      <THead>
        <TR>
          <TH>ID</TH>
          <TH>Name</TH>
          <TH>Age</TH>
          <TH>Gender</TH>
          <TH></TH>
        </TR>
      </THead>
      <TBody>
        {patients.map((p) => (
          <TR key={p.id}>
            <TD>{p.id}</TD>
            <TD>{p.name}</TD>
            <TD>{p.age}</TD>
            <TD>{p.gender}</TD>
            <TD className="text-right">
              <Link className="text-blue-600" href={`/admin/patient/${p.id}`}>View</Link>
            </TD>
          </TR>
        ))}
      </TBody>
    </Table>
  );
}
