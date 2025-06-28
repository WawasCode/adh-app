import { Button } from "@/components/ui/Button";
import { useViewStore } from "@/store/useViewStore";
import { RemoteMapView } from "@/map/RemoteMapView";

/**
 * SelectWaypointLocation allows the user to mark a location on the map by tapping it.
 * The selected coordinates will be stored and used in the waypoint configuration.
 */
export default function SelectWaypointLocation() {
  const { setPage } = useViewStore();

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
          Tap a point on the map to set your waypoint location.
        </p>
      </div>

      {/* Map View */}
      <div className="flex-1 rounded-xl overflow-hidden my-4">
        <RemoteMapView />
      </div>

      {/* Footer Buttons */}
      <div className="mt-auto flex justify-between gap-4 pt-6 pb-[calc(3rem+env(safe-area-inset-bottom)+56px)]">
        <Button
          variant="outline"
          className="flex-1 rounded-full py-4 text-base"
          onClick={() => setPage("configureWaypoint")}
        >
          Cancel
        </Button>
        <Button
          variant="outline"
          className="flex-1 rounded-full py-4 text-base"
          onClick={() => setPage("configureWaypoint")}
        >
          Save
        </Button>
      </div>
    </div>
  );
}
