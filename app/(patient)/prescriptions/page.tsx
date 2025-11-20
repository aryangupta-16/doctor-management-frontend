import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { prescriptions } from "@/mock/prescriptions";

export default function PatientPrescriptions() {
  return (
    <Table>
      <THead>
        <TR>
          <TH>ID</TH>
          <TH>Date</TH>
          <TH>Doctor</TH>
          <TH></TH>
        </TR>
      </THead>
      <TBody>
        {prescriptions.map((p) => (
          <TR key={p.id}>
            <TD>{p.id}</TD>
            <TD>{p.date}</TD>
            <TD>{p.doctorId}</TD>
            <TD className="text-right">
              <button className="text-blue-600">View</button>
              <span className="mx-2">•</span>
              <button className="text-indigo-500">Download</button>
            </TD>
          </TR>
        ))}
      </TBody>
    </Table>
  );
}
