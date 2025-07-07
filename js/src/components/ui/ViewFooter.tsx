"use client";

import { Button } from "@/components/ui/Button";

interface ViewFooterProps {
  goBack?: () => void;
  onSave?: () => void;
  saveDisabled?: boolean;
  saveLabel?: string;
}

/**
 * ViewFooter renders standardized Cancel and Save buttons.
 * goBack is required and called on Back button click.
 */
export function ViewFooter({
  goBack,
  onSave,
  saveDisabled = true,
  saveLabel = "Save",
}: ViewFooterProps) {
  return (
    <div className="mt-auto flex justify-between gap-4 pt-6 pb-[calc(3rem+env(safe-area-inset-bottom)+56px)]">
      <Button
        variant="outline"
        className="flex-1 rounded-full py-4 text-base"
        onClick={goBack}
      >
        Back
      </Button>
      <Button
        variant="outline"
        onClick={onSave}
        disabled={saveDisabled || !onSave}
        className={`flex-1 rounded-full py-4 text-base ${
          saveDisabled || !onSave
            ? "text-gray-400 border-gray-300 opacity-50 cursor-not-allowed"
            : ""
        }`}
      >
        {saveLabel}
      </Button>
    </div>
  );
}
