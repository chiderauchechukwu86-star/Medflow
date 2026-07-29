import { api } from "./client";
import type {
  Patient,
  Doctor,
  Appointment,
  MedicalRecord,
  Prescription,
  LabTest,
  Bill,
  DashboardStats,
  User,
} from "@/types";

export const patientsApi = {
  list: () => api.get<Patient[]>("/patients").then((r) => r.data),
  me: () => api.get<Patient>("/patients/me/profile").then((r) => r.data),
  getById: (id: string) => api.get<Patient>(`/patients/${id}`).then((r) => r.data),
  create: (payload: Partial<Patient> & { name: string; email: string; password?: string }) =>
    api.post<Patient>("/patients", payload).then((r) => r.data),
  update: (id: string, payload: Partial<Patient>) =>
    api.put<Patient>(`/patients/${id}`, payload).then((r) => r.data),
};

export const doctorsApi = {
  list: (specialization?: string) =>
    api.get<Doctor[]>("/doctors", { params: specialization ? { specialization } : {} }).then((r) => r.data),
  getById: (id: string) => api.get<Doctor>(`/doctors/${id}`).then((r) => r.data),
  create: (payload: {
    name: string;
    email: string;
    password?: string;
    phone?: string;
    specialization: string;
    department?: string;
    yearsOfExperience?: number;
    consultationFee?: number;
    bio?: string;
  }) => api.post<Doctor>("/doctors", payload).then((r) => r.data),
};

export const appointmentsApi = {
  list: (params?: { status?: string; date?: string }) =>
    api.get<Appointment[]>("/appointments", { params }).then((r) => r.data),
  create: (payload: { doctor: string; date: string; startTime: string; endTime?: string; reason?: string; patient?: string }) =>
    api.post<Appointment>("/appointments", payload).then((r) => r.data),
  update: (id: string, payload: Partial<Appointment>) =>
    api.put<Appointment>(`/appointments/${id}`, payload).then((r) => r.data),
};

export const medicalRecordsApi = {
  listByPatient: (patientId: string) =>
    api.get<MedicalRecord[]>(`/medical-records/${patientId}`).then((r) => r.data),
  create: (payload: { patient: string; appointment?: string; diagnosis?: string; symptoms?: string[]; treatment?: string; vitals?: Record<string, unknown> }) =>
    api.post<MedicalRecord>("/medical-records", payload).then((r) => r.data),
};

export const prescriptionsApi = {
  listByPatient: (patientId: string) =>
    api.get<Prescription[]>(`/prescriptions/${patientId}`).then((r) => r.data),
  create: (payload: { patient: string; medicalRecord?: string; medications: Prescription["medications"]; notes?: string }) =>
    api.post<Prescription>("/prescriptions", payload).then((r) => r.data),
};

export const labTestsApi = {
  list: (status?: string) => api.get<LabTest[]>("/lab-tests", { params: status ? { status } : {} }).then((r) => r.data),
  create: (payload: { patient: string; testName: string; testType?: string }) =>
    api.post<LabTest>("/lab-tests", payload).then((r) => r.data),
  update: (id: string, payload: Partial<LabTest>) =>
    api.put<LabTest>(`/lab-tests/${id}`, payload).then((r) => r.data),
};

export const billsApi = {
  list: (status?: string) => api.get<Bill[]>("/bills", { params: status ? { status } : {} }).then((r) => r.data),
  create: (payload: { patient: string; appointment?: string; items: Bill["items"]; paymentMethod?: string }) =>
    api.post<Bill>("/bills", payload).then((r) => r.data),
  update: (id: string, payload: Partial<Bill>) => api.put<Bill>(`/bills/${id}`, payload).then((r) => r.data),
};

export const adminApi = {
  dashboard: () => api.get<DashboardStats>("/admin/dashboard").then((r) => r.data),
  users: () => api.get<User[]>("/admin/users").then((r) => r.data),
  updateUser: (id: string, payload: Partial<User>) => api.put<User>(`/admin/users/${id}`, payload).then((r) => r.data),
};
