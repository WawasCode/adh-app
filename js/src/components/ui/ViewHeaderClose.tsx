"use client";

import { cn } from "~/lib/utils";

interface ViewHeaderCloseProps {
  onCancel: () => void;
  className?: string;
}

/**
 * ViewHeaderClose renders a red "X" button for cancel/abort actions.
 */
export function ViewHeaderClose({ onCancel, className }: ViewHeaderCloseProps) {
  return (
    <button
      onClick={onCancel}
      className={cn("text-red-500 text-xl font-bold", className)}
      aria-label="Close"
    >
      ✕
    </button>
  );
}
