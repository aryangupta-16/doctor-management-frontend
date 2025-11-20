import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function PatientProfile() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Full Name</label>
          <Input placeholder="Enter name" defaultValue="Rahul Verma" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
          <Input placeholder="Enter email" defaultValue="rahul@example.com" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Phone</label>
          <Input placeholder="Enter phone" defaultValue="+91 98765 43210" />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-slate-700">Address</label>
          <Textarea placeholder="Enter address" defaultValue="Bangalore, India" rows={4} />
        </div>
      </div>
      <Button className="mt-4">Save Changes</Button>
    </div>
  );
}
