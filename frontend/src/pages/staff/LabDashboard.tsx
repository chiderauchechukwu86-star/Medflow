import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { labTestsApi } from "@/api/resources";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Badge } from "@/components/ui/Input";
import type { LabTest } from "@/types";

const nextStatus: Record<string, LabTest["status"]> = {
  requested: "sample_collected",
  sample_collected: "in_progress",
  in_progress: "completed",
};

export default function LabDashboard() {
  const queryClient = useQueryClient();
  const { data: labTests = [], isLoading } = useQuery({ queryKey: ["lab-tests"], queryFn: () => labTestsApi.list() });

  const advance = useMutation({
    mutationFn: ({ id, status }: { id: string; status: LabTest["status"] }) => labTestsApi.update(id, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["lab-tests"] }),
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">Lab requests</h1>
      <p className="mt-1 text-sm text-[var(--text-muted)]">Track samples from request to result.</p>

      <div className="mt-6 flex flex-col gap-3">
        {isLoading ? (
          <p className="text-sm text-[var(--text-muted)]">Loading…</p>
        ) : labTests.length === 0 ? (
          <Card>
            <p className="py-6 text-center text-sm text-[var(--text-muted)]">No lab requests yet.</p>
          </Card>
        ) : (
          labTests.map((t) => (
            <Card key={t._id} className="flex items-center justify-between">
              <div>
                <p className="font-medium">{t.testName}</p>
                <p className="text-xs text-[var(--text-muted)]">
                  {t.patient?.user?.name} · requested by Dr. {t.doctor?.user?.name}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge status={t.status} />
                {nextStatus[t.status] && (
                  <Button
                    variant="secondary"
                    className="px-2.5 py-1 text-xs"
                    onClick={() => advance.mutate({ id: t._id, status: nextStatus[t.status] })}
                  >
                    Mark {nextStatus[t.status].replace(/_/g, " ")}
                  </Button>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
