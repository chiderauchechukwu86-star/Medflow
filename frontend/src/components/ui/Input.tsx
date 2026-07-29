import { InputHTMLAttributes, SelectHTMLAttributes, forwardRef } from "react";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & { label?: string }>(
  ({ label, className = "", id, ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-[var(--text-muted)]">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        className={`rounded-xl border border-[var(--border-soft)] bg-[var(--bg-surface)] px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-teal-500 ${className}`}
        {...props}
      />
    </div>
  )
);
Input.displayName = "Input";

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement> & { label?: string }>(
  ({ label, className = "", id, children, ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-[var(--text-muted)]">
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={id}
        className={`rounded-xl border border-[var(--border-soft)] bg-[var(--bg-surface)] px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-teal-500 ${className}`}
        {...props}
      >
        {children}
      </select>
    </div>
  )
);
Select.displayName = "Select";

const statusColors: Record<string, string> = {
  pending: "bg-vital-amber/12 text-vital-amber",
  confirmed: "bg-teal-50 text-teal-600 dark:bg-teal-500/12 dark:text-teal-400",
  completed: "bg-vital-green/12 text-vital-green",
  cancelled: "bg-vital-coral/12 text-vital-coral",
  rescheduled: "bg-teal-50 text-teal-600 dark:bg-teal-500/12 dark:text-teal-400",
  no_show: "bg-vital-coral/12 text-vital-coral",
  active: "bg-vital-green/12 text-vital-green",
  paid: "bg-vital-green/12 text-vital-green",
  unpaid: "bg-vital-coral/12 text-vital-coral",
  partially_paid: "bg-vital-amber/12 text-vital-amber",
  requested: "bg-vital-amber/12 text-vital-amber",
  in_progress: "bg-teal-50 text-teal-600 dark:bg-teal-500/12 dark:text-teal-400",
  sample_collected: "bg-teal-50 text-teal-600 dark:bg-teal-500/12 dark:text-teal-400",
};

export function Badge({ status }: { status: string }) {
  const style = statusColors[status] || "bg-teal-50 text-teal-600";
  return (
    <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium capitalize ${style}`}>
      {status.replace(/_/g, " ")}
    </span>
  );
}
