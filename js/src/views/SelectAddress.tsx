import { useZoneStore } from "@/store/useZoneStore";
import { usePlaceStore } from "@/store/usePlaceStore";
import { useViewStore } from "@/store/useViewStore";
import { ViewFooter } from "@/components/ui/ViewFooter";
import { SearchBar } from "@/views/MobileUICommon";
import RemoteZoneMapWithAddresses from "@/map/RemoteZoneMapWithAddresses";

/**
 * SelectAddressZone allows the user to define a zone by entering 3–8 addresses.
 * Each valid address will be converted into a coordinate and displayed as a point.
 * The points are visualized as a polygon.
 */
export default function SelectAddress() {
  const { points, addPoint, reset: resetZone } = useZoneStore();
  const { reset: resetPlace } = usePlaceStore();
  const { goBack, setPage } = useViewStore();

  const handleLocationSelect = (location: {
    lat: number;
    lon: number;
    name: string;
  }) => {
    if (points.length < 8) {
      addPoint([location.lat, location.lon]);
    } else {
      alert("Maximum of 8 addresses reached.");
    }
  };

  const handleCancel = () => {
    resetZone();
    resetPlace();
    setPage("main");
  };

  const handleSave = () => {
    if (points.length >= 3) {
      setPage("configureHazard");
    }
  };

  return (
    <div className="flex flex-col h-full px-4 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
      {/* Header */}
      <div className="pt-4 pb-2 z-10 bg-white">
        <button onClick={goBack} className="text-blue-600 text-base">
          &larr; Back
        </button>
        <h1 className="text-center font-semibold text-xl mt-2">
          Enter addresses
        </h1>
        <p className="text-center text-sm text-gray-600 mt-2">
          Enter 3 to 8 addresses that will form a hazard zone.
        </p>
        <div className="mt-4">
          <SearchBar onLocationSelect={handleLocationSelect} />
        </div>
      </div>

      {/* Karte */}
      <div className="flex-1 rounded-xl overflow-hidden mb-4 mt-4 z-0">
        <RemoteZoneMapWithAddresses />
      </div>

      {/* Footer */}
      <ViewFooter
        onCancel={handleCancel}
        onSave={handleSave}
        saveDisabled={points.length < 3}
      />
    </div>
  );
}
