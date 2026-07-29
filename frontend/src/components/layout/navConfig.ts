import type { Role } from "@/types";
import {
  LayoutDashboard,
  CalendarPlus,
  CalendarDays,
  FileText,
  Receipt,
  UserCircle,
  Stethoscope,
  ClipboardList,
  FlaskConical,
  Users,
  BarChart3,
  Wallet,
  ShieldCheck,
} from "lucide-react";

export interface NavItem {
  label: string;
  to: string;
  icon: typeof LayoutDashboard;
}

export const navByRole: Record<Role, NavItem[]> = {
  patient: [
    { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
    { label: "Book Appointment", to: "/book-appointment", icon: CalendarPlus },
    { label: "Appointments", to: "/appointments", icon: CalendarDays },
    { label: "Medical Records", to: "/medical-records", icon: FileText },
    { label: "Bills", to: "/bills", icon: Receipt },
    { label: "Profile", to: "/profile", icon: UserCircle },
  ],
  doctor: [
    { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
    { label: "Schedule", to: "/schedule", icon: CalendarDays },
    { label: "Consultation", to: "/consultation", icon: Stethoscope },
    { label: "Prescriptions", to: "/prescriptions", icon: ClipboardList },
  ],
  nurse: [
    { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  ],
  receptionist: [
    { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
    { label: "Appointments", to: "/appointments", icon: CalendarDays },
  ],
  lab_technician: [
    { label: "Lab Dashboard", to: "/dashboard", icon: FlaskConical },
  ],
  admin: [
    { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
    { label: "Doctors", to: "/doctors", icon: Stethoscope },
    { label: "Users", to: "/users", icon: Users },
    { label: "Analytics", to: "/analytics", icon: BarChart3 },
    { label: "Billing", to: "/billing", icon: Wallet },
  ],
};

export const roleLabel: Record<Role, string> = {
  patient: "Patient",
  doctor: "Doctor",
  nurse: "Nurse",
  receptionist: "Receptionist",
  lab_technician: "Lab Technician",
  admin: "Administrator",
};

// Fallback used if a role somehow isn't a key in navByRole. In practice this
// shouldn't happen — AuthContext normalizes user.role to one of the six
// canonical roles before it ever reaches a component — but DashboardLayout
// reads this defensively rather than trusting that invariant blindly, since
// an indexing bug here previously caused a full white-screen crash.
export const DEFAULT_NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
];

export const roleIcon: Record<Role, typeof ShieldCheck> = {
  patient: UserCircle,
  doctor: Stethoscope,
  nurse: ClipboardList,
  receptionist: Users,
  lab_technician: FlaskConical,
  admin: ShieldCheck,
};
