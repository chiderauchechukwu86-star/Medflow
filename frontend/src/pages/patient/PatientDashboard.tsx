import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { CalendarDays, FileText, Receipt, CalendarPlus } from "lucide-react";
import { appointmentsApi } from "@/api/resources";
import { useAuth } from "@/context/AuthContext";
import { getDisplayName } from "@/utils/role";
import Card from "@/components/ui/Card";
import StatCard from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function PatientDashboard() {
  const { user } = useAuth();
  const firstName = getDisplayName(user).split(" ")[0];
  const { data: appointments = [] } = useQuery({
    queryKey: ["appointments"],
    queryFn: () => appointmentsApi.list(),
  });

  const upcoming = appointments.filter((a) => ["pending", "confirmed"].includes(a.status)).slice(0, 5);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Welcome back, {firstName}</h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">Here's what's happening with your care.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Upcoming appointments" value={upcoming.length} icon={CalendarDays} accent="teal" />
        <StatCard label="Active prescriptions" value="—" icon={FileText} accent="sky" />
        <StatCard label="Outstanding bills" value="—" icon={Receipt} accent="amber" />
      </div>

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Upcoming appointments</h2>
          <Link to="/book-appointment">
            <Button variant="secondary">
              <CalendarPlus size={16} /> Book new
            </Button>
          </Link>
        </div>

        {upcoming.length === 0 ? (
          <p className="py-8 text-center text-sm text-[var(--text-muted)]">
            No upcoming appointments. Book one to get started.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {upcoming.map((a) => (
              <div
                key={a._id}
                className="flex items-center justify-between rounded-xl border border-[var(--border-soft)] px-4 py-3.5"
              >
                <div>
                  <p className="text-sm font-medium">Dr. {a.doctor.user.name}</p>
                  <p className="text-xs text-[var(--text-muted)]">
                    {a.doctor.specialization} · {new Date(a.date).toLocaleDateString()} at {a.startTime}
                  </p>
                </div>
                <Badge status={a.status} />
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
