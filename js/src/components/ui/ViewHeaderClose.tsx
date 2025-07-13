"use client";

import CloseButton from "@/components/ui/CloseButton";

interface ViewHeaderCloseProps {
  onCancel: () => void;
}

/**
 * ViewHeaderClose renders a red "X" button for cancel/abort actions.
 */
export function ViewHeaderClose({ onCancel }: ViewHeaderCloseProps) {
  return <CloseButton onClick={onCancel} />;
}
