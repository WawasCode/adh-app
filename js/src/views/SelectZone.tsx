import { usePlaceStore } from "@/store/usePlaceStore";
import { useZoneStore } from "@/store/useZoneStore";
import { useViewStore } from "@/store/useViewStore";
import { ViewFooter } from "@/components/ui/ViewFooter";
import RemoteZoneMapWithClicks from "@/map/RemoteZoneMapWithClicks";
import { Button } from "@/components/ui/Button";

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
  } = useZoneStore();
  const { reset: resetPlace } = usePlaceStore();
  const { goBack, setPage } = useViewStore();

  const handleSave = () => {
    if (points.length >= 3) {
      setPage("configureHazard");
    }
  };

  const handleCancel = () => {
    resetZone();
    resetPlace();
    setPage("main");
  };

  const maxPointsReached = useZoneStore((s) => s.maxPointsReached);

  return (
    <div className="flex flex-col h-full px-4 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
      {/* Header */}
      <div className="pt-4 pb-2">
        <button
          onClick={() => {
            resetZone();
            setMaxPointsReached(false);
            goBack();
          }}
          className="text-blue-600 text-base"
        >
          &larr; Back
        </button>
        <h1 className="text-center font-semibold text-xl mt-2">Enter zone</h1>
        <p className="text-center text-sm text-gray-600 mt-2">
          Tap 3 to 8 points that will form a hazard zone.
        </p>
      </div>

      {/* Map */}
      <div className="flex-1 rounded-xl overflow-hidden mb-4 mt-4">
        <RemoteZoneMapWithClicks />
      </div>
      {/* Warning if max points reached */}
      {maxPointsReached && (
        <p className="text-xl text-red-500 text-center mb-2">
          You can only place up to 8 points to define a hazard zone.
        </p>
      )}
      {/* Undo Button */}
      <Button
        variant="outline"
        className="justify-center text-base font-normal py-2 px-5 rounded-xl text-red-500 border-red-300 mb-2"
        onClick={() => {
          removeLastPoint();
          setMaxPointsReached(false);
        }}
        disabled={points.length === 0}
      >
        Undo (Last Point)
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
        Undo (Everything)
      </Button>

      {/* Footer */}
      <ViewFooter
        onCancel={handleCancel}
        onSave={handleSave}
        saveDisabled={points.length < 3}
      />
    </div>
  );
}
