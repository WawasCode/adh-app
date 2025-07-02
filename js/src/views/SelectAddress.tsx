import { usePlaceStore } from "@/store/usePlaceStore";
import { useViewStore } from "@/store/useViewStore";
import { ViewFooter } from "@/components/ui/ViewFooter";
import { SearchBar } from "@/views/MobileUICommon";
import RemoteMapViewWithSingleClick from "@/map/RemoteMapWithSingleClick";

/**
 * SelectAddress allows the user to define a single hazard point
 * by searching for an address or clicking on the map.
 * The selected location is stored in Zustand (`usePlaceStore.location`).
 */
export default function SelectAddress() {
  const { setPage } = useViewStore();
  const location = usePlaceStore((s) => s.location);
  const reset = usePlaceStore((s) => s.reset);
  const setLocation = usePlaceStore((s) => s.setLocation);

  const handleCancel = () => {
    reset();
    setPage("main");
  };

  const handleSave = () => {
    setPage("configureHazard");
  };

  const handleSearchSelect = (location: {
    lat: number;
    lon: number;
    name: string;
  }) => {
    setLocation([location.lat, location.lon]);
  };

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
          Set Hazard Location
        </h1>
        <p className="text-center text-sm text-gray-600 mt-2">
          Tap a location on the map or search by address to set one hazard
          point.
        </p>
      </div>

      {/* Search */}
      <div className="mt-2">
        <SearchBar onLocationSelect={handleSearchSelect} />
      </div>

      {/* Map */}
      <div className="flex-1 rounded-xl overflow-hidden mb-4 mt-4 z-0">
        <RemoteMapViewWithSingleClick />
      </div>

      {/* Footer */}
      <ViewFooter
        onCancel={handleCancel}
        onSave={handleSave}
        saveDisabled={!location}
      />
    </div>
  );
}
