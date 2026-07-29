import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { appointmentsApi } from "@/api/resources";
import { useAuth } from "@/context/AuthContext";
import Card from "@/components/ui/Card";
import { Badge } from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import type { AppointmentStatus } from "@/types";

export default function Appointments() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ["appointments"],
    queryFn: () => appointmentsApi.list(),
  });

  // BUG FOUND: this mutation previously had no onError handler at all — a
  // failed request (e.g. a 403 from the doctor-ownership check, or an
  // expired session) failed completely silently, which is exactly the
  // "buttons show but clicking does nothing" symptom. Now surfaced per-row.
  const [error, setError] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: AppointmentStatus }) =>
      appointmentsApi.update(id, { status }),
    onMutate: ({ id }) => {
      setError(null);
      setPendingId(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
    onError: (err: any) => {
      setError(err?.response?.data?.message || "Could not update this appointment. Please try again.");
    },
    onSettled: () => setPendingId(null),
  });

  const canManage = user && ["doctor", "receptionist", "admin"].includes(user.role);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">Appointments</h1>
      <p className="mt-1 text-sm text-[var(--text-muted)]">All scheduled and past appointments.</p>

      {error && (
        <div className="mt-4 rounded-xl border border-vital-coral/20 bg-vital-coral/8 px-4 py-3 text-sm text-vital-coral">
          {error}
        </div>
      )}

      <Card className="mt-6" glass={false}>
        {isLoading ? (
          <p className="py-8 text-center text-sm text-[var(--text-muted)]">Loading…</p>
        ) : appointments.length === 0 ? (
          <p className="py-8 text-center text-sm text-[var(--text-muted)]">No appointments found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--border-soft)] text-xs uppercase tracking-wide text-[var(--text-muted)]">
                  <th className="pb-3 pr-4">Patient</th>
                  <th className="pb-3 pr-4">Doctor</th>
                  <th className="pb-3 pr-4">Date</th>
                  <th className="pb-3 pr-4">Time</th>
                  <th className="pb-3 pr-4">Status</th>
                  {canManage && <th className="pb-3">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {appointments.map((a) => (
                  <tr key={a._id} className="border-b border-[var(--border-soft)] last:border-0">
                    <td className="py-3 pr-4">{a.patient?.user?.name || "—"}</td>
                    <td className="py-3 pr-4">Dr. {a.doctor?.user?.name || "—"}</td>
                    <td className="py-3 pr-4">{new Date(a.date).toLocaleDateString()}</td>
                    <td className="py-3 pr-4 font-data">{a.startTime}</td>
                    <td className="py-3 pr-4">
                      <Badge status={a.status} />
                    </td>
                    {canManage && (
                      <td className="py-3">
                        <div className="flex gap-2">
                          {a.status === "pending" && (
                            <Button
                              variant="secondary"
                              className="px-2.5 py-1 text-xs"
                              disabled={pendingId === a._id}
                              onClick={() => updateStatus.mutate({ id: a._id, status: "confirmed" })}
                            >
                              Confirm
                            </Button>
                          )}
                          {["pending", "confirmed"].includes(a.status) && (
                            <Button
                              variant="ghost"
                              className="px-2.5 py-1 text-xs"
                              disabled={pendingId === a._id}
                              onClick={() => updateStatus.mutate({ id: a._id, status: "completed" })}
                            >
                              Complete
                            </Button>
                          )}
                          {["pending", "confirmed"].includes(a.status) && (
                            <Button
                              variant="danger"
                              className="px-2.5 py-1 text-xs"
                              disabled={pendingId === a._id}
                              onClick={() => updateStatus.mutate({ id: a._id, status: "cancelled" })}
                            >
                              Cancel
                            </Button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
