import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Activity } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Card from "@/components/ui/Card";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Unable to log in. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg-app)] px-4">
      <Card className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-vital-coral/10 text-vital-coral">
            <Activity size={20} strokeWidth={2.5} />
          </div>
          <h1 className="font-display text-xl font-semibold">Welcome back</h1>
          <p className="mt-1 text-sm text-[var(--text-muted)]">Log in to your MedFlow account</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            id="email"
            label="Email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
          <Input
            id="password"
            label="Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
          {error && <p className="text-sm text-vital-coral">{error}</p>}
          <Button type="submit" fullWidth disabled={loading}>
            {loading ? "Logging in…" : "Log in"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--text-muted)]">
          Don't have an account?{" "}
          <Link to="/register" className="font-medium text-teal-500 hover:underline">
            Register
          </Link>
        </p>

        <div className="mt-6 rounded-xl border border-[var(--border-soft)] p-3.5 text-xs text-[var(--text-muted)]">
          <p className="font-medium">Demo accounts (after running the seed script):</p>
          <p className="font-data mt-1">admin@medflow.dev · doctor@medflow.dev · patient@medflow.dev</p>
          <p className="font-data">password123</p>
        </div>
      </Card>
    </div>
  );
}
