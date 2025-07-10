import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useViewStore } from "@/store/useViewStore";
import { usePlaceStore } from "@/store/usePlaceStore";
import { ViewHeaderClose } from "@/components/ui/ViewHeaderClose";

/**
 * AddPlaceView displays the initial selection screen when adding a new place.
 * Users can choose between adding a Hazard or a Waypoint.
 */
export default function AddPlace() {
  const setPage = useViewStore((s) => s.setPage);
  const resetHazardInput = usePlaceStore((s) => s.resetHazardInput);
  const resetWaypointInput = usePlaceStore((s) => s.resetWaypointInput);

  const handleCancel = () => {
    resetHazardInput();
    resetWaypointInput();
    setPage("main");
  };

  return (
    <div className="flex flex-col h-full px-4 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
      {/* Header */}
      <div className="pt-4 pb-2">
        <div className="flex justify-end">
          <ViewHeaderClose onCancel={handleCancel} />
        </div>
        <h1 className="text-center font-semibold text-xl mt-2">
          Configure Type
        </h1>
      </div>

      {/* Type selection */}
      <div className="flex flex-col gap-4 mt-4">
        <Button
          variant="outline"
          className="justify-between text-base font-normal py-4 px-5 rounded-xl"
          onClick={() => setPage("configureHazard")}
        >
          Hazard <ChevronRight className="h-5 w-5 text-gray-400" />
        </Button>
        <Button
          variant="outline"
          className="justify-between text-base font-normal py-4 px-5 rounded-xl"
          onClick={() => setPage("configureWaypoint")}
        >
          Waypoint <ChevronRight className="h-5 w-5 text-gray-400" />
        </Button>
      </div>
    </div>
  );
}
