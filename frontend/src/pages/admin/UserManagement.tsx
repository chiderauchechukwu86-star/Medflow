import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/api/resources";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function UserManagement() {
  const queryClient = useQueryClient();
  const { data: users = [], isLoading } = useQuery({ queryKey: ["admin-users"], queryFn: adminApi.users });

  const toggleActive = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => adminApi.updateUser(id, { isActive }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-users"] }),
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">User management</h1>
      <p className="mt-1 text-sm text-[var(--text-muted)]">All accounts across the system.</p>

      <Card className="mt-6" glass={false}>
        {isLoading ? (
          <p className="py-8 text-center text-sm text-[var(--text-muted)]">Loading…</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--border-soft)] text-xs uppercase tracking-wide text-[var(--text-muted)]">
                  <th className="pb-3 pr-4">Name</th>
                  <th className="pb-3 pr-4">Email</th>
                  <th className="pb-3 pr-4">Role</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border-b border-[var(--border-soft)] last:border-0">
                    <td className="py-3 pr-4">{u.name}</td>
                    <td className="py-3 pr-4">{u.email}</td>
                    <td className="py-3 pr-4 capitalize">{u.role.replace(/_/g, " ")}</td>
                    <td className="py-3 pr-4">
                      <span className={u.isActive ? "text-vital-green" : "text-vital-coral"}>
                        {u.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-3">
                      <Button
                        variant="ghost"
                        className="px-2.5 py-1 text-xs"
                        onClick={() => toggleActive.mutate({ id: u._id, isActive: !u.isActive })}
                      >
                        {u.isActive ? "Deactivate" : "Activate"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
