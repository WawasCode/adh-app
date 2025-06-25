import { Button } from "@/components/ui/Button";
import { useViewStore } from "@/store/useViewStore";

/**
 * SelectSeverity component renders a form for creating a new place (hazard or address).
 * It includes input fields for name, category, and type, and buttons to cancel or submit the entry.
 */
export default function AddPlaceView() {
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

      {/* Form fields */}
      <div className="flex flex-col gap-4 mt-4">
        <Button
          onClick={() => setPage("selectLocation")}
          variant="outline"
          className="justify-between text-base font-normal py-4 px-5 rounded-xl"
        >
          Low <span className="text-gray-400"></span>
        </Button>
        <Button
          onClick={() => setPage("selectLocation")}
          variant="outline"
          className="justify-between text-base font-normal py-4 px-5 rounded-xl"
        >
          Medium <span className="text-gray-400"></span>
        </Button>
        <Button
          onClick={() => setPage("selectLocation")}
          variant="outline"
          className="justify-between text-base font-normal py-4 px-5 rounded-xl"
        >
          High <span className="text-gray-400"></span>
        </Button>
        <Button
          onClick={() => setPage("selectLocation")}
          variant="outline"
          className="justify-between text-base font-normal py-4 px-5 rounded-xl"
        >
          Critical <span className="text-gray-400"></span>
        </Button>
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
          Safe
        </Button>
      </div>
    </div>
  );
}
