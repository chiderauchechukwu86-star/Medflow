import { useAuth } from "@/context/AuthContext";
import PatientDashboard from "@/pages/patient/PatientDashboard";
import DoctorDashboard from "@/pages/doctor/DoctorDashboard";
import NurseDashboard from "@/pages/staff/NurseDashboard";
import ReceptionDashboard from "@/pages/staff/ReceptionDashboard";
import LabDashboard from "@/pages/staff/LabDashboard";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import Card from "@/components/ui/Card";

export default function DashboardRouter() {
  const { user } = useAuth();
  if (!user) return null;

  switch (user.role) {
    case "patient":
      return <PatientDashboard />;
    case "doctor":
      return <DoctorDashboard />;
    case "nurse":
      return <NurseDashboard />;
    case "receptionist":
      return <ReceptionDashboard />;
    case "lab_technician":
      return <LabDashboard />;
    case "admin":
      return <AdminDashboard />;
    default:
      // Should be unreachable — AuthContext normalizes user.role to one of
      // the six cases above before it's ever set. If this renders, something
      // upstream regressed; show a recoverable message instead of a blank
      // screen so the failure is visible and debuggable rather than silent.
      return (
        <Card className="mx-auto mt-12 max-w-md text-center">
          <p className="font-display text-lg font-semibold">Unrecognized account type</p>
          <p className="mt-2 text-sm text-[var(--text-muted)]">
            Your account role ("{String(user.role)}") isn't set up with a dashboard yet. Please
            contact an administrator.
          </p>
        </Card>
      );
  }
}
