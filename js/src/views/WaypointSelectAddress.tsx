import { ViewFooter } from "@/components/ui/ViewFooter";
import { useViewStore } from "@/store/useViewStore";
import { useWaypointStore } from "@/store/useWaypointCreationStore";
import RemoteMapViewWithClick from "@/map/MapsForUserInput/RemoteMapViewWithClick";
import { SearchBar } from "@/views/MobileUICommon";
import { ViewHeaderCloseWithConfirm } from "@/components/ui/ViewHeaderCloseWithConfirm";
import { useMapStore } from "@/store/useMapStore";
import { PhotonPlace } from "@/types/photon";

/**
 * SelectWaypointLocation – View to define a waypoint's position on the map.
 *
 * Users can either click on the map or use the search bar to select coordinates.
 * The chosen location is stored in Zustand (`waypointInput.location`) via `usePlaceStore`.
 * After saving, the user is redirected to ConfigureWaypoint.
 */
export default function SelectWaypointLocation() {
  const { setPage } = useViewStore();
  const location = useWaypointStore((s) => s.waypointInput.location);
  const resetWaypointInput = useWaypointStore((s) => s.resetWaypointInput);
  const setWaypointField = useWaypointStore((s) => s.setWaypointField);

  /**
   * handleLocationSelect – Called when a location is selected via search.
   * Saves the coordinates [lat, lon] to Zustand.
   *
   * @param location - Object containing lat/lon and name from the search result.
   */
  const map = useMapStore((s) => s.map);
  const handleLocationSelect = (args: { place: PhotonPlace; name: string }) => {
    setWaypointField("location", [args.place.coords[0], args.place.coords[1]]);
    if (map) {
      map.flyTo([args.place.coords[0], args.place.coords[1]], 15);
    }
  };

  /**
   * handleCancel – Resets the waypoint input and returns to the main view.
   */
  const handleCancel = () => {
    resetWaypointInput();
    setPage("main");
  };

  /**
   * handleSave – Navigates back to the ConfigureWaypoint view.
   */
  const handleSave = () => {
    setPage("configureWaypoint");
  };

  return (
    <div className="flex flex-col h-full px-4 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
      {/* Header with close button and description */}
      <div className="pt-4 pb-2">
        <div className="flex justify-end">
          <ViewHeaderCloseWithConfirm onConfirm={handleCancel} />
        </div>
        <h1 className="text-center font-semibold text-xl mt-2">
          Select Waypoint Location
        </h1>
        <p className="text-center text-sm text-gray-600 mt-2">
          Tap a location on the map or use search to place your waypoint.
        </p>
      </div>

      {/* Address search bar */}
      <div className="mt-2">
        <SearchBar onLocationSelect={handleLocationSelect} />
      </div>

      {/* Map view for clicking a point */}
      <div className="flex-1 rounded-xl overflow-hidden mb-4 mt-4 z-0">
        <RemoteMapViewWithClick />
      </div>

      {/* Shared Footer */}
      <ViewFooter
        goBack={() => setPage("configureWaypoint")}
        onSave={handleSave}
        saveDisabled={!location}
      />
    </div>
  );
}
