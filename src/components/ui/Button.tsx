import type { ButtonHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md";
}

const variants = {
  primary: "bg-[var(--brand)] text-white hover:bg-[#2468bd]",
  secondary: "bg-white border border-black/10 text-[var(--text-primary)] hover:bg-[var(--surface-sunken)]",
  ghost: "text-[var(--text-secondary)] hover:bg-[var(--surface-sunken)]",
  danger: "bg-[#fbe9e9] text-[#a12121] hover:bg-[#f7d9d9]",
};

const sizes = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
};

export function Button({ className, variant = "secondary", size = "md", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}
