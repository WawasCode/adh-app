"use client";

import { TextareaHTMLAttributes, useState, useRef } from "react";
import { cn } from "~/lib/utils";
import type { Size } from "~/styles/theme";
import { sizeClasses } from "~/styles/sizeUtils";

export interface FloatingLabelTextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  sizeVariant?: Size;
}

export function FloatingLabelTextarea({
  label,
  value = "",
  sizeVariant = "md",
  className,
  ...props
}: FloatingLabelTextareaProps) {
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const base =
    "border border-gray-200 bg-white shadow focus:outline-none focus:ring-2 focus:ring-primary-500 w-full text-base rounded-xl resize-none";

  return (
    <div className="relative">
      <textarea
        {...props}
        ref={textareaRef}
        value={value}
        rows={3}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={cn(
          base,
          sizeClasses[sizeVariant],
          "pt-10",
          "max-h-[160px]", // ≈ 5 Zeilen @ ~32px
          "overflow-y-auto", // Scrollbar wenn voll
          className,
        )}
        style={{ fontSize: "16px", ...props.style }}
      />
      <label
        className={cn(
          "absolute left-5 pointer-events-none transition-all duration-200 text-gray-400",
          isFocused || value ? "top-1 text-xs" : "top-4 text-base",
        )}
      >
        {label}
      </label>
    </div>
  );
}
