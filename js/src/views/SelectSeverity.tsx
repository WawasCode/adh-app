import { Button } from "@/components/ui/Button";
import { useViewStore } from "@/store/useViewStore";

/**
 * SelectSeverityView lets the user choose the severity level for the hazard.
 * This view is part of the hazard configuration process.
 */
export default function SelectSeverity() {
  const setPage = useViewStore((s) => s.setPage);

  return (
    <div className="flex flex-col h-full px-4 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
      {/* Header */}
      <div className="pt-4 pb-2">
        <button
          onClick={() => setPage("configureHazard")}
          className="text-blue-600 text-base"
        >
          &larr; Back
        </button>
        <h1 className="text-center font-semibold text-xl mt-2">
          Select Severity
        </h1>
      </div>

      {/* Selection Buttons */}
      <div className="flex flex-col gap-4 mt-4">
        {["Low", "Medium", "High", "Critical"].map((level) => (
          <Button
            key={level}
            onClick={() => setPage("configureHazard")}
            variant="outline"
            className="justify-between text-base font-normal py-4 px-5 rounded-xl"
          >
            {level}
          </Button>
        ))}
      </div>

      {/* Footer Buttons */}
      <div className="mt-auto flex justify-between gap-4 pt-6 pb-[calc(3rem+env(safe-area-inset-bottom)+56px)]">
        <Button
          variant="outline"
          className="flex-1 rounded-full py-4 text-base"
          onClick={() => setPage("main")}
        >
          Cancel
        </Button>
        <Button
          variant="outline"
          className="flex-1 rounded-full py-4 text-base text-gray-400 border-gray-300 opacity-50"
          disabled
        >
          Save
        </Button>
      </div>
    </div>
  );
}
