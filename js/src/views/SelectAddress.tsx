import { useIncidentStore } from "@/store/useIncidentCreationStore";
import { useViewStore } from "@/store/useViewStore";
import { ViewFooter } from "@/components/ui/ViewFooter";
import { SearchBar } from "@/views/MobileUICommon";
import RemoteMapViewWithSingleClick from "@/map/MapsForUserInput/RemoteMapWithSingleClick";
import { ViewHeaderCloseWithConfirm } from "@/components/ui/ViewHeaderCloseWithConfirm";
import { useMapStore } from "@/store/useMapStore";
/**
 * SelectAddress – View to set a single-point hazard location.
 *
 * The user can either search for an address or tap on the map
 * to select a hazard location. The selected coordinates are stored
 * in the Zustand slice (`hazardInput.location`).
 *
 * @returns JSX.Element – The rendered address selection view.
 */
export default function SelectAddress() {
  const { setPage } = useViewStore();
  const location = useIncidentStore((s) => s.hazardInput.location);
  const setHazardField = useIncidentStore((s) => s.setHazardField);
  const resetHazardInput = useIncidentStore((s) => s.resetHazardInput);

  /**
   * handleCancel – Resets hazard input and navigates back to the main screen.
   */
  const handleCancel = () => {
    resetHazardInput();
    setPage("main");
  };

  /**
   * handleSave – Navigates to the hazard configuration screen.
   * Assumes a valid location has already been selected.
   */
  const handleSave = () => {
    setPage("configureHazard");
  };

  /**
   * handleSearchSelect – Called when a user selects a result from the address search.
   * Updates the hazard location in Zustand state.
   *
   * @param location – Object containing `lat`, `lon`, and `name` of selected address
   */
  const map = useMapStore((s) => s.map);
  const handleSearchSelect = (location: {
    lat: number;
    lon: number;
    name: string;
  }) => {
    setHazardField("location", [location.lat, location.lon]);
    if (map) {
      map.flyTo([location.lat, location.lon], 15);
    }
  };

  return (
    <div className="flex flex-col h-full px-4 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
      {/* Header with close button, title and description */}
      <div className="pt-4 pb-2">
        <div className="flex justify-end">
          <ViewHeaderCloseWithConfirm onConfirm={handleCancel} />
        </div>
        <h1 className="text-center font-semibold text-xl mt-2">
          Set Hazard Location
        </h1>
        <p className="text-center text-sm text-gray-600 mt-2">
          Tap a location on the map or search by address to set one hazard
          point.
        </p>
      </div>

      {/* Address search bar */}
      <div className="mt-2">
        <SearchBar onLocationSelect={handleSearchSelect} />
      </div>

      {/* Map view for clicking a point */}
      <div className="flex-1 rounded-xl overflow-hidden mb-4 mt-4 z-0">
        <RemoteMapViewWithSingleClick />
      </div>

      {/* Shared Footer */}
      <ViewFooter
        goBack={() => setPage("selectLocation")}
        onSave={handleSave}
        saveDisabled={!location}
      />
    </div>
  );
}
