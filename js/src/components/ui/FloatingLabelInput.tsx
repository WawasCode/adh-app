import { InputHTMLAttributes, useState, useRef, useEffect } from "react";
import { cn } from "~/lib/utils";

interface FloatingLabelInputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  value: string;
}

/**
 * FloatingLabelInput – An input component with a floating label that shrinks
 * when the input is focused or has a value.
 *
 * @param label - The label text for the input.
 * @param value - The current value of the input.
 * @param props - Additional HTML attributes for the input element.
 */
export function FloatingLabelInput({
  label,
  value,
  ...props
}: FloatingLabelInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-grow logic for multiline (textarea-like) input
  useEffect(() => {
    const input = inputRef.current;
    if (input) {
      input.style.height = "auto";
      input.style.height = input.scrollHeight + "px";
    }
  }, [value]);

  return (
    <div className="relative">
      <input
        {...props}
        ref={inputRef}
        value={value}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={cn(
          "block w-full rounded-xl py-4 px-5 text-base border border-gray-300 bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none min-h-[56px]",
          props.className,
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
