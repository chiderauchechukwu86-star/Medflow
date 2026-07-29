import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authApi } from "@/api/auth";
import type { User } from "@/types";
import { normalizeRole, getDisplayName } from "@/utils/role";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (payload: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    role?: "patient" | "doctor";
    specialization?: string;
    hospital?: string;
  }) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Every user object entering the app — whether from a fresh API response or
// a value cached in localStorage from a previous session — passes through
// here first. This is what guarantees `user.role` is always one of the six
// canonical roles by the time any component reads it, regardless of what
// the backend (or an old cached value) actually sent.
function normalizeUser(raw: User): User {
  return {
    ...raw,
    role: normalizeRole(raw.role),
    name: getDisplayName(raw),
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("medflow_token");
    const storedUser = localStorage.getItem("medflow_user");
    if (token && storedUser) {
      try {
        setUser(normalizeUser(JSON.parse(storedUser)));
      } catch {
        // Corrupted cache (e.g. from an older app version) — clear it rather
        // than crash on JSON.parse or hand components a malformed object.
        localStorage.removeItem("medflow_token");
        localStorage.removeItem("medflow_user");
      }
    }
    setIsLoading(false);
  }, []);

  const persist = (token: string, rawUser: User) => {
    const user = normalizeUser(rawUser);
    localStorage.setItem("medflow_token", token);
    localStorage.setItem("medflow_user", JSON.stringify(user));
    setUser(user);
    return user;
  };

  const login = async (email: string, password: string) => {
    const { token, user } = await authApi.login(email, password);
    return persist(token, user);
  };

  const register = async (payload: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    role?: "patient" | "doctor";
    specialization?: string;
    hospital?: string;
  }) => {
    const { token, user } = await authApi.register(payload);
    return persist(token, user);
  };

  const logout = () => {
    localStorage.removeItem("medflow_token");
    localStorage.removeItem("medflow_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
