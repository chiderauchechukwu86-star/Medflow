import { useQuery } from "@tanstack/react-query";
import { medicalRecordsApi, patientsApi } from "@/api/resources";
import { useAuth } from "@/context/AuthContext";
import Card from "@/components/ui/Card";

export default function MedicalRecords() {
  const { user } = useAuth();
  const { data: myProfile } = useQuery({
    queryKey: ["patients", "me"],
    queryFn: patientsApi.me,
    enabled: !!user,
  });

  const { data: records = [], isLoading } = useQuery({
    queryKey: ["medical-records", myProfile?._id],
    queryFn: () => medicalRecordsApi.listByPatient(myProfile!._id),
    enabled: !!myProfile,
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">Medical records</h1>
      <p className="mt-1 text-sm text-[var(--text-muted)]">Your diagnosis and treatment history.</p>

      <div className="mt-6 flex flex-col gap-4">
        {isLoading ? (
          <p className="text-sm text-[var(--text-muted)]">Loading…</p>
        ) : records.length === 0 ? (
          <Card>
            <p className="py-6 text-center text-sm text-[var(--text-muted)]">
              No medical records yet. They'll appear here after your first consultation.
            </p>
          </Card>
        ) : (
          records.map((r) => (
            <Card key={r._id}>
              <div className="flex items-center justify-between">
                <p className="font-display font-semibold">{r.diagnosis || "General consultation"}</p>
                <p className="font-data text-xs text-[var(--text-muted)]">
                  {new Date(r.visitDate).toLocaleDateString()}
                </p>
              </div>
              <p className="mt-1 text-sm text-[var(--text-muted)]">Dr. {r.doctor?.user?.name}</p>
              {r.treatment && <p className="mt-3 text-sm">{r.treatment}</p>}
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
