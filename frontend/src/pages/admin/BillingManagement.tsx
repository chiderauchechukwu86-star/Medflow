import { useQuery } from "@tanstack/react-query";
import { billsApi } from "@/api/resources";
import Card from "@/components/ui/Card";
import { Badge } from "@/components/ui/Input";

export default function BillingManagement() {
  const { data: bills = [], isLoading } = useQuery({ queryKey: ["bills"], queryFn: () => billsApi.list() });

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">Billing</h1>
      <p className="mt-1 text-sm text-[var(--text-muted)]">All invoices across the hospital.</p>

      <Card className="mt-6" glass={false}>
        {isLoading ? (
          <p className="py-8 text-center text-sm text-[var(--text-muted)]">Loading…</p>
        ) : bills.length === 0 ? (
          <p className="py-8 text-center text-sm text-[var(--text-muted)]">No bills yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--border-soft)] text-xs uppercase tracking-wide text-[var(--text-muted)]">
                  <th className="pb-3 pr-4">Patient</th>
                  <th className="pb-3 pr-4">Total</th>
                  <th className="pb-3 pr-4">Paid</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3">Issued</th>
                </tr>
              </thead>
              <tbody>
                {bills.map((b) => (
                  <tr key={b._id} className="border-b border-[var(--border-soft)] last:border-0">
                    <td className="py-3 pr-4">{b.patient?.user?.name}</td>
                    <td className="py-3 pr-4 font-data">₦{b.totalAmount.toLocaleString()}</td>
                    <td className="py-3 pr-4 font-data">₦{b.amountPaid.toLocaleString()}</td>
                    <td className="py-3 pr-4">
                      <Badge status={b.status} />
                    </td>
                    <td className="py-3">{new Date(b.issuedDate).toLocaleDateString()}</td>
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
