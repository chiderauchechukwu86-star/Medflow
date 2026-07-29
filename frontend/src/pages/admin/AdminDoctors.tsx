import { useState, FormEvent } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { doctorsApi } from "@/api/resources";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Stethoscope } from "lucide-react";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  specialization: "",
  department: "",
  yearsOfExperience: "",
  consultationFee: "",
};

export default function AdminDoctors() {
  const queryClient = useQueryClient();
  const { data: doctors = [], isLoading } = useQuery({ queryKey: ["doctors"], queryFn: () => doctorsApi.list() });

  const [form, setForm] = useState(emptyForm);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: () =>
      doctorsApi.create({
        name: form.name,
        email: form.email,
        phone: form.phone,
        specialization: form.specialization,
        department: form.department || undefined,
        yearsOfExperience: form.yearsOfExperience ? Number(form.yearsOfExperience) : undefined,
        consultationFee: form.consultationFee ? Number(form.consultationFee) : undefined,
      }),
    onSuccess: () => {
      setSuccess("Doctor account created. Default password: changeme123");
      setError(null);
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      setForm(emptyForm);
    },
    onError: (err: any) => {
      setError(err?.response?.data?.message || "Could not create doctor account.");
      setSuccess(null);
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSuccess(null);
    setError(null);
    mutation.mutate();
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Doctors</h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Add doctor accounts so patients have someone to book with.
        </p>
      </div>

      <Card className="max-w-lg">
        <h2 className="mb-4 font-display text-lg font-semibold">Add a doctor</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Full name"
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Dr. Grace Okafor"
            />
            <Input
              label="Email"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Specialization"
              required
              value={form.specialization}
              onChange={(e) => setForm((f) => ({ ...f, specialization: e.target.value }))}
              placeholder="General Medicine"
            />
            <Input
              label="Department"
              value={form.department}
              onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))}
              placeholder="Outpatient"
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Input
              label="Phone"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            />
            <Input
              label="Years experience"
              type="number"
              min={0}
              value={form.yearsOfExperience}
              onChange={(e) => setForm((f) => ({ ...f, yearsOfExperience: e.target.value }))}
            />
            <Input
              label="Consultation fee"
              type="number"
              min={0}
              value={form.consultationFee}
              onChange={(e) => setForm((f) => ({ ...f, consultationFee: e.target.value }))}
            />
          </div>

          {success && <p className="text-sm text-vital-green">{success}</p>}
          {error && <p className="text-sm text-vital-coral">{error}</p>}

          <Button type="submit" fullWidth disabled={mutation.isPending}>
            {mutation.isPending ? "Creating…" : "Create doctor account"}
          </Button>
        </form>
      </Card>

      <div>
        <h2 className="mb-3 font-display text-lg font-semibold">All doctors</h2>
        {isLoading ? (
          <p className="text-sm text-[var(--text-muted)]">Loading…</p>
        ) : doctors.length === 0 ? (
          <Card>
            <p className="py-6 text-center text-sm text-[var(--text-muted)]">
              No doctors yet — add one above.
            </p>
          </Card>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {doctors.map((d) => (
              <Card key={d._id} className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
                  <Stethoscope size={18} />
                </div>
                <div>
                  <p className="font-medium">Dr. {d.user.name}</p>
                  <p className="text-xs text-[var(--text-muted)]">{d.specialization}</p>
                  {d.department && <p className="text-xs text-[var(--text-muted)]">{d.department}</p>}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
