import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useViewStore } from "@/store/useViewStore";
import { usePlaceStore } from "@/store/usePlaceStore";

/**
 * AddPlaceView displays the initial selection screen when adding a new place.
 * Users can choose between creating a hazard or a waypoint.
 * This view uses Zustand to navigate to the corresponding configuration view.
 */
export default function AddPlace() {
  const setPage = useViewStore((s) => s.setPage);
  const { setName, setDescription } = usePlaceStore();

  return (
    <div className="flex flex-col h-full px-4 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
      {/* Header */}
      <div className="pt-4 pb-2">
        <button
          onClick={() => setPage("main")}
          className="text-blue-600 text-base"
        >
          &larr; Map
        </button>
        <h1 className="text-center font-semibold text-xl mt-2">Choose Type</h1>
      </div>

      {/* Form fields */}
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

      {/* Footer Buttons */}
      <div className="mt-auto flex justify-between gap-4 pt-6 pb-[calc(3rem+env(safe-area-inset-bottom)+56px)]">
        <Button
          variant="outline"
          className="flex-1 rounded-full py-4 text-base"
          onClick={() => {
            setPage("main");
            setName("");
            setDescription("");
          }}
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
