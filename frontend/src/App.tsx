import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";

import Landing from "@/pages/public/Landing";
import Login from "@/pages/public/Login";
import Register from "@/pages/public/Register";
import NotFound from "@/pages/NotFound";
import DashboardRouter from "@/pages/DashboardRouter";

import BookAppointment from "@/pages/patient/BookAppointment";
import Appointments from "@/pages/patient/Appointments";
import MedicalRecords from "@/pages/patient/MedicalRecords";
import Bills from "@/pages/patient/Bills";
import Profile from "@/pages/patient/Profile";

import Schedule from "@/pages/doctor/Schedule";
import Consultation from "@/pages/doctor/Consultation";
import Prescriptions from "@/pages/doctor/Prescriptions";

import UserManagement from "@/pages/admin/UserManagement";
import Analytics from "@/pages/admin/Analytics";
import BillingManagement from "@/pages/admin/BillingManagement";
import AdminDoctors from "@/pages/admin/AdminDoctors";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardRouter />} />
          <Route path="/profile" element={<Profile />} />

          {/* Patient */}
          <Route element={<ProtectedRoute allowedRoles={["patient"]} />}>
            <Route path="/book-appointment" element={<BookAppointment />} />
            <Route path="/medical-records" element={<MedicalRecords />} />
            <Route path="/bills" element={<Bills />} />
          </Route>

          {/* Patient + staff who manage appointments */}
          <Route element={<ProtectedRoute allowedRoles={["patient", "receptionist", "admin"]} />}>
            <Route path="/appointments" element={<Appointments />} />
          </Route>

          {/* Doctor */}
          <Route element={<ProtectedRoute allowedRoles={["doctor"]} />}>
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/consultation" element={<Consultation />} />
            <Route path="/prescriptions" element={<Prescriptions />} />
          </Route>

          {/* Admin */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/doctors" element={<AdminDoctors />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/billing" element={<BillingManagement />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
