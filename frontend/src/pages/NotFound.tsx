import { Link } from "react-router-dom";
import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-[var(--bg-app)] text-[var(--text-primary)]">
      <p className="font-display text-5xl font-semibold text-teal-500">404</p>
      <p className="text-[var(--text-muted)]">This page doesn't exist.</p>
      <Link to="/">
        <Button variant="secondary">Back home</Button>
      </Link>
    </div>
  );
}
