import { useAuth } from "@/context/AuthContext";
import { getDisplayName } from "@/utils/role";
import Card from "@/components/ui/Card";
import { UserCircle } from "lucide-react";

export default function Profile() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="font-display text-2xl font-semibold">Profile</h1>
      <p className="mt-1 text-sm text-[var(--text-muted)]">Your account details.</p>

      <Card className="mt-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-500/12 text-teal-500">
            <UserCircle size={28} />
          </div>
          <div>
            <p className="font-display text-lg font-semibold">{getDisplayName(user)}</p>
            <p className="text-sm capitalize text-[var(--text-muted)]">{user.role}</p>
          </div>
        </div>

        <dl className="space-y-3 text-sm">
          <div className="flex justify-between border-b border-[var(--border-soft)] pb-3">
            <dt className="text-[var(--text-muted)]">Email</dt>
            <dd>{user.email}</dd>
          </div>
          <div className="flex justify-between border-b border-[var(--border-soft)] pb-3">
            <dt className="text-[var(--text-muted)]">Phone</dt>
            <dd>{user.phone || "—"}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-[var(--text-muted)]">Member since</dt>
            <dd>{new Date(user.createdAt).toLocaleDateString()}</dd>
          </div>
        </dl>
      </Card>
    </div>
  );
}
