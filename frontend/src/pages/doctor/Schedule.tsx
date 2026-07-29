import Appointments from "@/pages/patient/Appointments";

// Doctors see the same appointments table, scoped to their own patients by the API.
export default function Schedule() {
  return <Appointments />;
}
