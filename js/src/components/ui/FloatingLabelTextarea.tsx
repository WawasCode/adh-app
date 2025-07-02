import { TextareaHTMLAttributes, useState, useRef, useEffect } from "react";
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

  // Auto-resize logic
  useEffect(() => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = "auto";
      // Calculate the height for 3 lines as minimum
      const lineHeight = parseInt(
        window.getComputedStyle(ta).lineHeight || "20",
        10,
      );
      const minHeight = lineHeight * 3;
      ta.style.height = Math.max(ta.scrollHeight, minHeight) + "px";
    }
  }, [value]);

  return (
    <div className="relative">
      <textarea
        {...props}
        ref={textareaRef}
        value={value}
        rows={3}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={cn(base, sizeClasses[sizeVariant], "pt-10", className)} // increased pt for more space
        style={{ fontSize: "16px", ...props.style, minHeight: "0" }}
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
