"use client";

import { Button } from "@/components/ui/Button";

/**
 * ViewFooterOnlyBackButton renders a centered "Back" button
 * matching the size and alignment of ViewFooter buttons.
 */
export function ViewFooterOnlyBackButton({ goBack }: { goBack: () => void }) {
  return (
    <div className="mt-auto flex justify-center pt-6 pb-[calc(3rem+env(safe-area-inset-bottom)+56px)]">
      <div className="w-[370px] max-w-md px-4">
        <Button
          variant="outline"
          className="w-full rounded-full py-4 text-base"
          onClick={goBack}
        >
          Back
        </Button>
      </div>
    </div>
  );
}
