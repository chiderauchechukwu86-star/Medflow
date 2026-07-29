import { ReactNode } from "react";

export default function Card({
  children,
  className = "",
  glass = true,
  hoverable = false,
}: {
  children: ReactNode;
  className?: string;
  /** kept for backward compatibility with existing call sites; both variants
   * now render the same soft-elevation surface, just with/without a border */
  glass?: boolean;
  hoverable?: boolean;
}) {
  return (
    <div
      className={`${
        glass ? "glass-card" : "rounded-2xl border border-[var(--border-soft)] bg-[var(--bg-surface)]"
      } p-6 ${hoverable ? "hover:shadow-card-hover hover:-translate-y-0.5" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
