import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useViewStore } from "@/store/useViewStore";
import { ViewHeaderCloseWithConfirm } from "@/components/ui/ViewHeaderCloseWithConfirm";
import { ViewFooterOnlyBackButton } from "@/components/ui/ViewFooterOnlyBackButton";

/**
 * SelectLocation – View to choose the method for setting a hazard location.
 *
 * Users can decide whether to define a hazard via:
 * 1. A polygon-shaped zone
 * 2. A single-point address
 *
 * Navigation is handled via Zustand (`useViewStore`).
 */
export default function SelectLocation() {
  const { setPage } = useViewStore();

  /**
   * handleCancel – Navigates back to the main view without saving anything.
   */
  const handleCancel = () => {
    setPage("main");
  };

  return (
    <div className="flex flex-col h-full px-4 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
      {/* Header with close button and title */}
      <div className="pt-4 pb-2">
        <div className="flex justify-end">
          <ViewHeaderCloseWithConfirm onConfirm={handleCancel} />
        </div>
        <h1 className="text-center font-semibold text-xl mt-2">
          Select Location Type
        </h1>
      </div>

      {/* Buttons for choosing location method: Zone or Address */}
      <div className="flex flex-col gap-4 mt-4">
        <Button
          variant="outline"
          className="justify-between text-base font-normal py-4 px-5 rounded-xl"
          onClick={() => setPage("selectZone")}
        >
          Zone <ChevronRight className="h-5 w-5 text-gray-400" />
        </Button>

        <Button
          variant="outline"
          className="justify-between text-base font-normal py-4 px-5 rounded-xl"
          onClick={() => setPage("selectAddress")}
        >
          Address <ChevronRight className="h-5 w-5 text-gray-400" />
        </Button>
      </div>

      {/* Shared Footer */}
      <ViewFooterOnlyBackButton goBack={() => setPage("configureHazard")} />
    </div>
  );
}
