import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { adminApi } from "@/api/resources";
import { Users, Stethoscope, CalendarDays, Wallet } from "lucide-react";
import Card from "@/components/ui/Card";
import StatCard from "@/components/ui/StatCard";

// Placeholder trend for illustration; a fuller build would source this from a bills-by-week endpoint.
const revenueTrend = [
  { day: "Mon", revenue: 0 },
  { day: "Tue", revenue: 0 },
  { day: "Wed", revenue: 0 },
  { day: "Thu", revenue: 0 },
  { day: "Fri", revenue: 0 },
];

export default function AdminDashboard() {
  const { data: stats } = useQuery({ queryKey: ["admin-dashboard"], queryFn: adminApi.dashboard });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Hospital overview</h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">Key metrics across the system.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total patients" value={stats?.totalPatients ?? "—"} icon={Users} accent="teal" />
        <StatCard label="Total doctors" value={stats?.totalDoctors ?? "—"} icon={Stethoscope} accent="sky" />
        <StatCard label="Appointments today" value={stats?.appointmentsToday ?? "—"} icon={CalendarDays} accent="amber" />
        <StatCard label="Revenue" value={`₦${(stats?.revenue ?? 0).toLocaleString()}`} icon={Wallet} accent="coral" />
      </div>

      <Card>
        <h2 className="mb-4 font-display text-lg font-semibold">Revenue this week</h2>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-soft)" />
              <XAxis dataKey="day" stroke="var(--text-muted)" fontSize={12} />
              <YAxis stroke="var(--text-muted)" fontSize={12} />
              <Tooltip contentStyle={{ background: "var(--bg-surface)", border: "1px solid var(--border-soft)", borderRadius: 8 }} />
              <Bar dataKey="revenue" fill="#0EA5A0" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
