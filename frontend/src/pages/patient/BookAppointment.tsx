import { useState, FormEvent } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { doctorsApi, appointmentsApi } from "@/api/resources";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";

export default function BookAppointment() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: doctors = [] } = useQuery({ queryKey: ["doctors"], queryFn: () => doctorsApi.list() });

  const [form, setForm] = useState({ doctor: "", date: "", startTime: "", reason: "" });
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: () => appointmentsApi.create(form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      navigate("/appointments");
    },
    onError: (err: any) => setError(err?.response?.data?.message || "Could not book appointment."),
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    mutation.mutate();
  };

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="font-display text-2xl font-semibold">Book an appointment</h1>
      <p className="mt-1 text-sm text-[var(--text-muted)]">Choose a doctor and pick a time that works for you.</p>

      <Card className="mt-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Select
            id="doctor"
            label="Doctor"
            required
            value={form.doctor}
            onChange={(e) => setForm((f) => ({ ...f, doctor: e.target.value }))}
          >
            <option value="">Select a doctor…</option>
            {doctors.map((d) => (
              <option key={d._id} value={d._id}>
                Dr. {d.user.name} — {d.specialization}
              </option>
            ))}
          </Select>

          <div className="grid grid-cols-2 gap-3">
            <Input
              id="date"
              label="Date"
              type="date"
              required
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
            />
            <Input
              id="startTime"
              label="Time"
              type="time"
              required
              value={form.startTime}
              onChange={(e) => setForm((f) => ({ ...f, startTime: e.target.value }))}
            />
          </div>

          <Input
            id="reason"
            label="Reason for visit"
            value={form.reason}
            onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))}
            placeholder="Briefly describe your symptoms or reason"
          />

          {error && <p className="text-sm text-vital-coral">{error}</p>}

          <Button type="submit" fullWidth disabled={mutation.isPending}>
            {mutation.isPending ? "Booking…" : "Book appointment"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
