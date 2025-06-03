"use client";

import { ButtonHTMLAttributes } from "react";
import { cn } from "~/lib/utils";
import type { Size } from "~/styles/theme";
import { sizeClasses } from "~/styles/sizeUtils";

export interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: Size;
}

/**
 * Chip component: a pill-shaped button often used for filters or categories.
 * @param props - Button HTML attributes, custom className,
 * @param size - Size of the chip, defaults to "md".
 */
export function Chip({ size = "md", className, ...rest }: ChipProps) {
  const base =
    "flex items-center justify-center gap-1 border border-gray-200 shadow rounded-full";

  return (
    <button className={cn(base, sizeClasses[size], className)} {...rest} />
  );
}
