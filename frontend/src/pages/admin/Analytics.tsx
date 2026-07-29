import AdminDashboard from "./AdminDashboard";

// MVP analytics reuses the dashboard's stat cards and chart; a fuller build
// would add filters by date range, department, and doctor.
export default function Analytics() {
  return <AdminDashboard />;
}
