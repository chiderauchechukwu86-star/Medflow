import { api } from "./client";
import type { User } from "@/types";

export interface AuthResponse {
  token: string;
  user: User;
}

export const authApi = {
  login: (email: string, password: string) =>
    api.post<AuthResponse>("/auth/login", { email, password }).then((r) => r.data),

  register: (payload: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    role?: "patient" | "doctor";
    dateOfBirth?: string;
    gender?: string;
    specialization?: string;
    hospital?: string;
  }) => api.post<AuthResponse>("/auth/register", payload).then((r) => r.data),

  me: () => api.get<{ user: User }>("/auth/me").then((r) => r.data.user),
};
