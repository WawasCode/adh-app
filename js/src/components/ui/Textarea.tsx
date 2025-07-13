"use client";

import { TextareaHTMLAttributes } from "react";
import { cn } from "~/lib/utils";
import type { Size } from "~/styles/theme";
import { sizeClasses } from "~/styles/sizeUtils";

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  sizeVariant?: Size;
}

/**
 * Textarea component for multi-line user text input.
 * @param sizeVariant - Size of the textarea, defaults to "md".
 */
export function Textarea({
  sizeVariant = "md",
  className,
  ...rest
}: TextareaProps) {
  const base =
    "border border-gray-200 bg-white shadow focus:outline-none focus:ring-2 focus:ring-primary-500 w-full text-base rounded-xl";

  return (
    <textarea
      rows={4}
      className={cn(base, sizeClasses[sizeVariant], className)}
      style={{ fontSize: "16px" }} // Inline style to ensure iOS doesn't zoom
      {...rest}
    />
  );
}
