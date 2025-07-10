import { ViewFooter } from "@/components/ui/ViewFooter";
import { useViewStore } from "@/store/useViewStore";
import { usePlaceStore } from "@/store/usePlaceStore";
import RemoteMapViewWithClick from "@/map/RemoteMapViewWithClick";
import { SearchBar } from "@/views/MobileUICommon";
import { ViewHeaderCloseWithConfirm } from "@/components/ui/ViewHeaderCloseWithConfirm";

/**
 * SelectWaypointLocation allows the user to place a marker on the map
 * to define the waypoint's coordinates. These are stored in Zustand.
 */
export default function SelectWaypointLocation() {
  const { setPage } = useViewStore();
  const location = usePlaceStore((s) => s.waypointInput.location);
  const resetWaypointInput = usePlaceStore((s) => s.resetWaypointInput);
  const setWaypointField = usePlaceStore((s) => s.setWaypointField);

  const handleLocationSelect = (location: {
    lat: number;
    lon: number;
    name: string;
  }) => {
    setWaypointField("location", [location.lat, location.lon]);
  };

  const handleCancel = () => {
    resetWaypointInput();
    setPage("main");
  };

  const handleSave = () => {
    setPage("configureWaypoint");
  };

  return (
    <div className="flex flex-col h-full px-4 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
      {/* Header */}
      <div className="pt-4 pb-2">
        <ViewHeaderCloseWithConfirm onConfirm={handleCancel} />
        <h1 className="text-center font-semibold text-xl mt-2">
          Select Waypoint Location
        </h1>
        <p className="text-center text-sm text-gray-600 mt-2">
          Tap a location on the map or use search to place your waypoint.
        </p>
      </div>
      {/* Search Bar */}
      <div className="mt-2">
        <SearchBar onLocationSelect={handleLocationSelect} />
      </div>

      {/* Map for selecting location */}
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
