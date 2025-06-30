import { usePlaceStore } from "@/store/usePlaceStore";
import { useZoneStore } from "@/store/useZoneStore";
import { v4 as uuidv4 } from "uuid";
import { useViewStore } from "@/store/useViewStore";
import { ViewFooter } from "@/components/ui/ViewFooter";
import RemoteZoneMapWithClicks from "@/map/RemoteZoneMapWithClicks";

/**
 * SelectZone allows the user to place 3–8 points on the map to define a polygon hazard zone.
 * The points are stored in Zustand (`useZoneStore`) and can be saved if at least 3 exist.
 */
export default function SelectZone() {
  const { points, reset: resetZone, addHazardZone } = useZoneStore();
  const { name, description, severity, reset: resetPlace } = usePlaceStore();
  const { setPage } = useViewStore();

  const handleSave = () => {
    if (points.length >= 3 && severity !== null) {
      addHazardZone({
        id: uuidv4(),
        name,
        description,
        severity,
        coordinates: points,
      });

      resetZone();
      resetPlace();
      setPage("main");
    }
  };

  const handleCancel = () => {
    resetZone();
    resetPlace();
    setPage("main");
  };

  return (
    <div className="flex flex-col h-full px-4 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
      <div className="pt-4 pb-2">
        <button
          onClick={() => setPage("selectLocation")}
          className="text-blue-600 text-base"
        >
          &larr; Back
        </button>
        <h1 className="text-center font-semibold text-xl mt-2">Define Zone</h1>
        <p className="text-center text-sm text-gray-600 mt-2">
          Tap the map to set 3 to 8 points that will form a hazard zone.
        </p>
      </div>

      <div className="flex-1 rounded-xl overflow-hidden mb-4 mt-4">
        <RemoteZoneMapWithClicks />
      </div>

      <ViewFooter
        onCancel={handleCancel}
        onSave={handleSave}
        saveDisabled={points.length < 3}
      />
    </div>
  );
}
