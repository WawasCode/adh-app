import { usePlaceStore } from "@/store/usePlaceStore";
import { useZoneStore } from "@/store/useZoneStore";
import { useViewStore } from "@/store/useViewStore";
import { ViewFooter } from "@/components/ui/ViewFooter";
import RemoteZoneMapWithClicks from "@/map/RemoteZoneMapWithClicks";
import { Button } from "@/components/ui/Button";
import { ViewHeaderCloseWithConfirm } from "@/components/ui/ViewHeaderCloseWithConfirm";

/**
 * SelectZone allows the user to place 3–8 points on the map to define a polygon hazard zone.
 * The points are stored in Zustand (`useZoneStore`) and can be saved if at least 3 exist.
 * The actual saving happens in ConfigureHazard.tsx.
 */
export default function SelectZone() {
  const {
    points,
    reset: resetZone,
    removeLastPoint,
    setMaxPointsReached,
    maxPointsReached,
  } = useZoneStore();

  const { resetHazardInput } = usePlaceStore();
  const { setPage } = useViewStore();

  const handleSave = () => {
    if (points.length >= 3) {
      setPage("configureHazard");
    }
  };

  const handleCancel = () => {
    resetZone();
    resetHazardInput();
    setMaxPointsReached(false);
    setPage("main");
  };

  return (
    <div className="flex flex-col h-full px-4 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
      {/* Header */}
      <div className="pt-4 pb-2">
        <ViewHeaderCloseWithConfirm onConfirm={handleCancel} />
        <h1 className="text-center font-semibold text-xl mt-2">Enter zone</h1>
        <p className="text-center text-sm text-gray-600 mt-2">
          Tap 3 to 8 points that will form a hazard zone.
        </p>
      </div>

      {/* Map */}
      <div className="flex-1 rounded-xl overflow-hidden mb-4 mt-4">
        <RemoteZoneMapWithClicks />
      </div>

      {/* Warning */}
      {maxPointsReached && (
        <p className="text-xl text-red-500 text-center mb-2">
          You can only place up to 8 points to define a hazard zone.
        </p>
      )}

      {/* Undo buttons */}
      <Button
        variant="outline"
        className="justify-center text-base font-normal py-2 px-5 rounded-xl text-red-500 border-red-300 mb-2"
        onClick={() => {
          removeLastPoint();
          setMaxPointsReached(false);
        }}
        disabled={points.length === 0}
      >
        Undo last point
      </Button>
      <Button
        variant="outline"
        className="justify-center text-base font-normal py-2 px-5 rounded-xl text-red-500 border-red-300 mb-2"
        onClick={() => {
          resetZone();
          setMaxPointsReached(false);
        }}
        disabled={points.length === 0}
      >
        Reset zone
      </Button>

      {/* Footer */}
      <ViewFooter
        goBack={() => setPage("selectLocation")}
        onSave={handleSave}
        saveDisabled={points.length < 3}
      />
    </div>
  );
}
