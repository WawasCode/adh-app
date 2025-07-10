import { ViewFooter } from "@/components/ui/ViewFooter";
import { useViewStore } from "@/store/useViewStore";
import { usePlaceStore } from "@/store/usePlaceStore";
import RemoteMapViewWithClick from "@/map/MapsForUserInput/RemoteMapViewWithClick";
import { SearchBar } from "@/views/MobileUICommon";
import { ViewHeaderCloseWithConfirm } from "@/components/ui/ViewHeaderCloseWithConfirm";

/**
 * SelectWaypointLocation – View to define a waypoint's position on the map.
 *
 * Users can either click on the map or use the search bar to select coordinates.
 * The chosen location is stored in Zustand (`waypointInput.location`) via `usePlaceStore`.
 * After saving, the user is redirected to ConfigureWaypoint.
 *
 * @returns JSX.Element – A map-based interface for setting waypoint coordinates.
 */
export default function SelectWaypointLocation() {
  const { setPage } = useViewStore();
  const location = usePlaceStore((s) => s.waypointInput.location);
  const resetWaypointInput = usePlaceStore((s) => s.resetWaypointInput);
  const setWaypointField = usePlaceStore((s) => s.setWaypointField);

  /**
   * handleLocationSelect – Called when a location is selected via search.
   * Saves the coordinates [lat, lon] to Zustand.
   *
   * @param location - Object containing lat/lon and name from the search result.
   */
  const handleLocationSelect = (location: {
    lat: number;
    lon: number;
    name: string;
  }) => {
    setWaypointField("location", [location.lat, location.lon]);
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
        <ViewHeaderCloseWithConfirm onConfirm={handleCancel} />
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
