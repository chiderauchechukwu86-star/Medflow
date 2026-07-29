export type Role = "patient" | "doctor" | "nurse" | "receptionist" | "lab_technician" | "admin";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: Role;
  phone?: string;
  isActive: boolean;
  createdAt: string;
  // Not part of the current API contract — kept optional here only so
  // normalizeUser()/getDisplayName() can defensively read them if a stale
  // cached value or a future endpoint bug ever sends this shape instead.
  firstName?: string;
  lastName?: string;
}

export interface Patient {
  _id: string;
  user: User;
  dateOfBirth?: string;
  gender?: "male" | "female" | "other";
  bloodGroup?: string;
  address?: string;
  allergies?: string[];
  chronicConditions?: string[];
  emergencyContact?: { name?: string; relationship?: string; phone?: string };
}

export interface Doctor {
  _id: string;
  user: User;
  specialization: string;
  department?: string;
  hospital?: string;
  yearsOfExperience?: number;
  consultationFee?: number;
  bio?: string;
  availability?: { dayOfWeek: number; startTime: string; endTime: string }[];
}

export type AppointmentStatus = "pending" | "confirmed" | "completed" | "cancelled" | "rescheduled" | "no_show";

export interface Appointment {
  _id: string;
  patient: Patient;
  doctor: Doctor;
  date: string;
  startTime: string;
  endTime?: string;
  reason?: string;
  status: AppointmentStatus;
  notes?: string;
}

export interface MedicalRecord {
  _id: string;
  patient: string;
  doctor: Doctor;
  diagnosis?: string;
  symptoms?: string[];
  treatment?: string;
  vitals?: Record<string, number | string>;
  visitDate: string;
  followUpDate?: string;
}

export interface Prescription {
  _id: string;
  patient: string;
  doctor: Doctor;
  medications: { name: string; dosage?: string; frequency?: string; duration?: string; instructions?: string }[];
  notes?: string;
  issuedDate: string;
  status: "active" | "completed" | "cancelled";
}

export interface LabTest {
  _id: string;
  patient: Patient;
  doctor: Doctor;
  testName: string;
  testType?: string;
  status: "requested" | "sample_collected" | "in_progress" | "completed" | "cancelled";
  requestedDate: string;
  completedDate?: string;
  results?: string;
}

export interface Bill {
  _id: string;
  patient: Patient;
  items: { description: string; amount: number }[];
  totalAmount: number;
  amountPaid: number;
  status: "unpaid" | "partially_paid" | "paid" | "void";
  paymentMethod?: string;
  issuedDate: string;
}

export interface DashboardStats {
  totalPatients: number;
  totalDoctors: number;
  appointmentsToday: number;
  revenue: number;
}
