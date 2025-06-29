import { Button } from "@/components/ui/Button";
import { useViewStore } from "@/store/useViewStore";
import { usePlaceStore } from "@/store/usePlaceStore";
import RemoteMapViewWithClick from "@/map/RemoteMapViewWithClick";

/**
 * SelectWaypointLocation allows the user to click on the map
 * to select a location for the waypoint.
 * The coordinates are stored in Zustand and used when returning to ConfigureWaypoint.
 */
export default function SelectWaypointLocation() {
  const { setPage } = useViewStore();
  const location = usePlaceStore((s) => s.location);
  const { setName, setDescription } = usePlaceStore();

  return (
    <div className="flex flex-col h-full px-4 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
      {/* Header */}
      <div className="pt-4 pb-2">
        <button
          onClick={() => setPage("configureWaypoint")}
          className="text-blue-600 text-base"
        >
          &larr; Back
        </button>
        <h1 className="text-center font-semibold text-xl mt-2">
          Select Waypoint Location
        </h1>
        <p className="text-center text-sm text-gray-600 mt-2">
          Tap a location on the map to place your waypoint.
        </p>
      </div>

      {/* Karte mit Click-Funktion */}
      <div className="flex-1 rounded-xl overflow-hidden mb-4 mt-4">
        <RemoteMapViewWithClick />
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
          className="flex-1 rounded-full py-4 text-base"
          disabled={!location}
          onClick={() => setPage("configureWaypoint")}
        >
          Save
        </Button>
      </div>
    </div>
  );
}
