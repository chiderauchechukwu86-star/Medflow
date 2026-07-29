import { useState, FormEvent } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { appointmentsApi, medicalRecordsApi } from "@/api/resources";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";

export default function Consultation() {
  const queryClient = useQueryClient();
  const { data: appointments = [] } = useQuery({
    queryKey: ["appointments", "confirmed"],
    queryFn: () => appointmentsApi.list({ status: "confirmed" }),
  });

  const [selectedAppointment, setSelectedAppointment] = useState("");
  const [form, setForm] = useState({
    diagnosis: "",
    treatment: "",
    temperature: "",
    bloodPressure: "",
    heartRate: "",
  });
  const [success, setSuccess] = useState(false);

  const appointment = appointments.find((a) => a._id === selectedAppointment);

  const mutation = useMutation({
    mutationFn: () =>
      medicalRecordsApi.create({
        patient: appointment!.patient._id,
        appointment: appointment!._id,
        diagnosis: form.diagnosis,
        treatment: form.treatment,
        vitals: {
          temperature: form.temperature,
          bloodPressure: form.bloodPressure,
          heartRate: form.heartRate,
        },
      }),
    onSuccess: () => {
      setSuccess(true);
      queryClient.invalidateQueries({ queryKey: ["medical-records"] });
      setForm({ diagnosis: "", treatment: "", temperature: "", bloodPressure: "", heartRate: "" });
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    if (!appointment) return;
    mutation.mutate();
  };

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="font-display text-2xl font-semibold">Consultation</h1>
      <p className="mt-1 text-sm text-[var(--text-muted)]">Record vitals, diagnosis, and treatment for a visit.</p>

      <Card className="mt-6">
        <Select
          id="appointment"
          label="Patient / appointment"
          value={selectedAppointment}
          onChange={(e) => setSelectedAppointment(e.target.value)}
        >
          <option value="">Select a confirmed appointment…</option>
          {appointments.map((a) => (
            <option key={a._id} value={a._id}>
              {a.patient?.user?.name} — {new Date(a.date).toLocaleDateString()} {a.startTime}
            </option>
          ))}
        </Select>

        {appointment && (
          <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
            <div className="grid grid-cols-3 gap-3">
              <Input
                id="temperature"
                label="Temp (°C)"
                value={form.temperature}
                onChange={(e) => setForm((f) => ({ ...f, temperature: e.target.value }))}
              />
              <Input
                id="bp"
                label="Blood pressure"
                value={form.bloodPressure}
                onChange={(e) => setForm((f) => ({ ...f, bloodPressure: e.target.value }))}
                placeholder="120/80"
              />
              <Input
                id="hr"
                label="Heart rate"
                value={form.heartRate}
                onChange={(e) => setForm((f) => ({ ...f, heartRate: e.target.value }))}
              />
            </div>
            <Input
              id="diagnosis"
              label="Diagnosis"
              required
              value={form.diagnosis}
              onChange={(e) => setForm((f) => ({ ...f, diagnosis: e.target.value }))}
            />
            <Input
              id="treatment"
              label="Treatment / notes"
              value={form.treatment}
              onChange={(e) => setForm((f) => ({ ...f, treatment: e.target.value }))}
            />

            {success && <p className="text-sm text-vital-green">Medical record saved.</p>}

            <Button type="submit" fullWidth disabled={mutation.isPending}>
              {mutation.isPending ? "Saving…" : "Save consultation"}
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
}
