"use client";

import { ButtonHTMLAttributes } from "react";
import { cn } from "~/lib/utils";
import type { Size } from "~/styles/theme";
import { sizeClasses } from "~/styles/sizeUtils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: Size;
}

/**
 * Button component for user interactions.
 * @param props - Button HTML attributes, custom className,
 * @param size - Size of the button, defaults to "md".
 * @param variant - Variant of the button, defaults to "primary".
 */
export function Button({
  variant = "primary",
  size = "md",
  className,
  ...rest
}: ButtonProps) {
  const base =
    "font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none inline-flex items-center justify-center";

  const variants: Record<ButtonVariant, string> = {
    primary: "bg-primary-600 text-white hover:bg-primary-700",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
    ghost: "bg-transparent text-gray-900 hover:bg-gray-100",
    outline:
      "border border-gray-200 bg-transparent text-gray-900 hover:bg-gray-100",
  };

  return (
    <button
      className={cn(base, variants[variant], sizeClasses[size], className)}
      {...rest}
    />
  );
}
