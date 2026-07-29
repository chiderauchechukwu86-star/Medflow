import { useState, FormEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patientsApi } from "@/api/resources";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Appointments from "@/pages/patient/Appointments";

export default function ReceptionDashboard() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [success, setSuccess] = useState(false);

  const mutation = useMutation({
    mutationFn: () => patientsApi.create(form),
    onSuccess: () => {
      setSuccess(true);
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      setForm({ name: "", email: "", phone: "" });
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    mutation.mutate();
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Front desk</h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">Register walk-in patients and manage appointments.</p>
      </div>

      <Card className="max-w-md">
        <h2 className="mb-4 font-display text-lg font-semibold">Register a patient</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input id="name" label="Full name" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          <Input id="email" label="Email" type="email" required value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
          <Input id="phone" label="Phone" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
          {success && <p className="text-sm text-vital-green">Patient registered. Default password: changeme123</p>}
          <Button type="submit" fullWidth disabled={mutation.isPending}>
            {mutation.isPending ? "Registering…" : "Register patient"}
          </Button>
        </form>
      </Card>

      <div>
        <h2 className="mb-3 font-display text-lg font-semibold">All appointments</h2>
        <Appointments />
      </div>
    </div>
  );
}
