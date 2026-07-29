import { useQuery } from "@tanstack/react-query";
import { billsApi } from "@/api/resources";
import Card from "@/components/ui/Card";
import { Badge } from "@/components/ui/Input";

export default function Bills() {
  const { data: bills = [], isLoading } = useQuery({ queryKey: ["bills"], queryFn: () => billsApi.list() });

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">Bills</h1>
      <p className="mt-1 text-sm text-[var(--text-muted)]">Your invoices and payment history.</p>

      <div className="mt-6 flex flex-col gap-4">
        {isLoading ? (
          <p className="text-sm text-[var(--text-muted)]">Loading…</p>
        ) : bills.length === 0 ? (
          <Card>
            <p className="py-6 text-center text-sm text-[var(--text-muted)]">No bills yet.</p>
          </Card>
        ) : (
          bills.map((b) => (
            <Card key={b._id}>
              <div className="flex items-center justify-between">
                <p className="font-data text-lg font-semibold">₦{b.totalAmount.toLocaleString()}</p>
                <Badge status={b.status} />
              </div>
              <p className="mt-1 text-xs text-[var(--text-muted)]">
                Issued {new Date(b.issuedDate).toLocaleDateString()}
              </p>
              <ul className="mt-3 space-y-1">
                {b.items.map((item, i) => (
                  <li key={i} className="flex justify-between text-sm">
                    <span className="text-[var(--text-muted)]">{item.description}</span>
                    <span className="font-data">₦{item.amount.toLocaleString()}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
