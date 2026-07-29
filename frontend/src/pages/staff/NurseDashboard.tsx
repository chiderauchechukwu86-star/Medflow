import { useQuery } from "@tanstack/react-query";
import { patientsApi } from "@/api/resources";
import Card from "@/components/ui/Card";

export default function NurseDashboard() {
  const { data: patients = [], isLoading } = useQuery({ queryKey: ["patients"], queryFn: patientsApi.list });

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">Patient overview</h1>
      <p className="mt-1 text-sm text-[var(--text-muted)]">Vitals and patient status updates.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <p className="text-sm text-[var(--text-muted)]">Loading…</p>
        ) : (
          patients.map((p) => (
            <Card key={p._id}>
              <p className="font-medium">{p.user.name}</p>
              <p className="mt-1 text-xs text-[var(--text-muted)]">
                {p.gender || "—"} · Blood group {p.bloodGroup || "unknown"}
              </p>
              {p.allergies && p.allergies.length > 0 && (
                <p className="mt-2 text-xs text-vital-coral">Allergies: {p.allergies.join(", ")}</p>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
