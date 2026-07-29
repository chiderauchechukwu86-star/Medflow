import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Activity } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Card from "@/components/ui/Card";

type RegisterRole = "patient" | "doctor";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState<RegisterRole>("patient");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    specialization: "",
    hospital: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone,
        role,
        specialization: role === "doctor" ? form.specialization : undefined,
        hospital: role === "doctor" ? form.hospital : undefined,
      });
      navigate("/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Unable to register. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg-app)] px-4 py-8">
      <Card className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-vital-coral/10 text-vital-coral">
            <Activity size={20} strokeWidth={2.5} />
          </div>
          <h1 className="font-display text-xl font-semibold">Create your account</h1>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            Register as a patient or a doctor. Other staff accounts are created by an administrator.
          </p>
        </div>

        {/* Role toggle */}
        <div className="mb-5 grid grid-cols-2 gap-2 rounded-full border border-[var(--border-soft)] p-1">
          <button
            type="button"
            onClick={() => setRole("patient")}
            className={`rounded-full py-2 text-sm font-medium transition-colors ${
              role === "patient" ? "bg-teal-500 text-white" : "text-[var(--text-muted)]"
            }`}
          >
            Patient
          </button>
          <button
            type="button"
            onClick={() => setRole("doctor")}
            className={`rounded-full py-2 text-sm font-medium transition-colors ${
              role === "doctor" ? "bg-teal-500 text-white" : "text-[var(--text-muted)]"
            }`}
          >
            Doctor
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input id="name" label="Full name" required value={form.name} onChange={update("name")} placeholder="Jane Doe" />
          <Input id="email" label="Email" type="email" required value={form.email} onChange={update("email")} placeholder="you@example.com" />
          <Input id="phone" label="Phone" value={form.phone} onChange={update("phone")} placeholder="+234 800 000 0000" />

          {role === "doctor" && (
            <>
              <Input
                id="specialization"
                label="Specialization"
                required
                value={form.specialization}
                onChange={update("specialization")}
                placeholder="e.g. General Medicine"
              />
              <Input
                id="hospital"
                label="Hospital / clinic"
                value={form.hospital}
                onChange={update("hospital")}
                placeholder="Optional"
              />
            </>
          )}

          <Input
            id="password"
            label="Password"
            type="password"
            required
            minLength={6}
            value={form.password}
            onChange={update("password")}
            placeholder="At least 6 characters"
          />
          {error && <p className="text-sm text-vital-coral">{error}</p>}
          <Button type="submit" fullWidth disabled={loading}>
            {loading ? "Creating account…" : `Create ${role} account`}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--text-muted)]">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-teal-500 hover:underline">
            Log in
          </Link>
        </p>
      </Card>
    </div>
  );
}
