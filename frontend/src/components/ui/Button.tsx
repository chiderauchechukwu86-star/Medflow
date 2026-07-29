import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  fullWidth?: boolean;
}

const variantStyles: Record<string, string> = {
  primary: "bg-teal-500 text-white hover:bg-teal-600 shadow-glow active:scale-[0.98]",
  secondary: "bg-teal-50 text-teal-600 hover:bg-teal-100 dark:bg-teal-500/12 dark:text-teal-400 dark:hover:bg-teal-500/20",
  ghost: "bg-transparent text-[var(--text-muted)] hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)]",
  danger: "bg-vital-coral/10 text-vital-coral hover:bg-vital-coral/16",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", fullWidth = false, className = "", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-50 ${
          variantStyles[variant]
        } ${fullWidth ? "w-full" : ""} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export default Button;
