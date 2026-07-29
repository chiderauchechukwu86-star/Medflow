import { useState, FormEvent } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { patientsApi, prescriptionsApi } from "@/api/resources";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";

interface MedRow {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

const emptyRow: MedRow = { name: "", dosage: "", frequency: "", duration: "" };

export default function Prescriptions() {
  const queryClient = useQueryClient();
  const { data: patients = [] } = useQuery({ queryKey: ["patients"], queryFn: patientsApi.list });

  const [patientId, setPatientId] = useState("");
  const [notes, setNotes] = useState("");
  const [medications, setMedications] = useState<MedRow[]>([{ ...emptyRow }]);
  const [success, setSuccess] = useState(false);

  const mutation = useMutation({
    mutationFn: () =>
      prescriptionsApi.create({
        patient: patientId,
        medications: medications.filter((m) => m.name.trim()),
        notes,
      }),
    onSuccess: () => {
      setSuccess(true);
      queryClient.invalidateQueries({ queryKey: ["prescriptions"] });
      setMedications([{ ...emptyRow }]);
      setNotes("");
    },
  });

  const updateRow = (i: number, field: keyof MedRow, value: string) => {
    setMedications((rows) => rows.map((r, idx) => (idx === i ? { ...r, [field]: value } : r)));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    mutation.mutate();
  };

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="font-display text-2xl font-semibold">Write a prescription</h1>
      <p className="mt-1 text-sm text-[var(--text-muted)]">Add medications for a patient.</p>

      <Card className="mt-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Select id="patient" label="Patient" required value={patientId} onChange={(e) => setPatientId(e.target.value)}>
            <option value="">Select a patient…</option>
            {patients.map((p) => (
              <option key={p._id} value={p._id}>
                {p.user.name}
              </option>
            ))}
          </Select>

          <div className="flex flex-col gap-3">
            {medications.map((row, i) => (
              <div key={i} className="rounded-xl border border-[var(--border-soft)] p-3.5">
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Medication"
                    required
                    value={row.name}
                    onChange={(e) => updateRow(i, "name", e.target.value)}
                  />
                  <Input label="Dosage" value={row.dosage} onChange={(e) => updateRow(i, "dosage", e.target.value)} />
                  <Input
                    label="Frequency"
                    value={row.frequency}
                    onChange={(e) => updateRow(i, "frequency", e.target.value)}
                    placeholder="e.g. 2x daily"
                  />
                  <Input
                    label="Duration"
                    value={row.duration}
                    onChange={(e) => updateRow(i, "duration", e.target.value)}
                    placeholder="e.g. 7 days"
                  />
                </div>
                {medications.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setMedications((rows) => rows.filter((_, idx) => idx !== i))}
                    className="mt-2 flex items-center gap-1 text-xs text-vital-coral"
                  >
                    <Trash2 size={12} /> Remove
                  </button>
                )}
              </div>
            ))}
            <Button type="button" variant="ghost" onClick={() => setMedications((rows) => [...rows, { ...emptyRow }])}>
              <Plus size={16} /> Add medication
            </Button>
          </div>

          <Input id="notes" label="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} />

          {success && <p className="text-sm text-vital-green">Prescription created.</p>}

          <Button type="submit" fullWidth disabled={mutation.isPending || !patientId}>
            {mutation.isPending ? "Saving…" : "Create prescription"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
