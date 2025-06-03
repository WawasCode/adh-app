"use client";

import { InputHTMLAttributes } from "react";
import { cn } from "~/lib/utils";
import type { Size } from "~/styles/theme";
import { sizeClasses } from "~/styles/sizeUtils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  sizeVariant?: Size;
}

/**
 * Input component for user text input.
 * @param sizeVariant - Size of the input, defaults to "md".
 */
export function Input({ sizeVariant = "md", className, ...rest }: InputProps) {
  const base =
    "border border-gray-200 bg-white shadow focus:outline-none focus:ring-2 focus:ring-primary-500 w-full text-base";

  return (
    <input
      className={cn(base, sizeClasses[sizeVariant], className)}
      style={{ fontSize: "16px" }} // Inline style to ensure iOS doesn't zoom
      {...rest}
    />
  );
}
