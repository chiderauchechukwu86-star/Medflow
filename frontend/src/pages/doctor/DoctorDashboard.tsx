import { useQuery } from "@tanstack/react-query";
import { appointmentsApi } from "@/api/resources";
import { useAuth } from "@/context/AuthContext";
import { getDisplayName } from "@/utils/role";
import Card from "@/components/ui/Card";
import StatCard from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Input";
import { CalendarDays, Clock, Users } from "lucide-react";

export default function DoctorDashboard() {
  const { user } = useAuth();
  const lastName = getDisplayName(user).split(" ").pop();
  const { data: appointments = [] } = useQuery({ queryKey: ["appointments"], queryFn: () => appointmentsApi.list() });

  const today = new Date().toDateString();
  const todaysAppointments = appointments.filter((a) => new Date(a.date).toDateString() === today);
  const pending = appointments.filter((a) => a.status === "pending");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Good to see you, Dr. {lastName}</h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">Here's your schedule at a glance.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Today's appointments" value={todaysAppointments.length} icon={CalendarDays} accent="teal" />
        <StatCard label="Pending confirmations" value={pending.length} icon={Clock} accent="amber" />
        <StatCard label="Total patients seen" value={appointments.length} icon={Users} accent="sky" />
      </div>

      <Card>
        <h2 className="mb-4 font-display text-lg font-semibold">Today's schedule</h2>
        {todaysAppointments.length === 0 ? (
          <p className="py-8 text-center text-sm text-[var(--text-muted)]">No appointments scheduled for today.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {todaysAppointments.map((a) => (
              <div
                key={a._id}
                className="flex items-center justify-between rounded-xl border border-[var(--border-soft)] px-4 py-3.5"
              >
                <div>
                  <p className="text-sm font-medium">{a.patient?.user?.name}</p>
                  <p className="text-xs text-[var(--text-muted)]">{a.reason || "General consultation"}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-data text-sm">{a.startTime}</span>
                  <Badge status={a.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
