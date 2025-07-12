import { useIncidentStore } from "@/store/useIncidentCreationStore";
import { useZoneStore } from "@/store/useHazardZoneCreationStore";
import { useViewStore } from "@/store/useViewStore";
import { ViewFooter } from "@/components/ui/ViewFooter";
import RemoteZoneMapWithClicks from "@/map/MapsForUserInput/RemoteZoneMapWithClicks";
import { Button } from "@/components/ui/Button";
import { ViewHeaderCloseWithConfirm } from "@/components/ui/ViewHeaderCloseWithConfirm";

/**
 * SelectZone – View for drawing a polygon hazard zone on the map.
 *
 * Users tap 3 to 8 points to define a zone.
 * The points are stored in Zustand (`useZoneStore.points`).
 * Saving is only allowed when at least 3 points exist.
 * Final saving to the backend happens in ConfigureHazard.tsx.
 *
 * @returns JSX.Element – Map interface for selecting zone points.
 */
export default function SelectZone() {
  const {
    points,
    reset: resetZone,
    removeLastPoint,
    setMaxPointsReached,
    maxPointsReached,
  } = useZoneStore();

  const { resetHazardInput } = useIncidentStore();
  const { setPage } = useViewStore();

  /**
   * handleSave – Navigates to the ConfigureHazard view
   * if a valid polygon (≥ 3 points) has been defined.
   */
  const handleSave = () => {
    if (points.length >= 3) {
      setPage("configureHazard");
    }
  };
  /**
   * handleCancel – Resets hazard and zone state,
   * clears flags, and returns to the main view.
   */
  const handleCancel = () => {
    resetZone();
    resetHazardInput();
    setMaxPointsReached(false);
    setPage("main");
  };

  return (
    <div className="flex flex-col h-full px-4 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
      {/* Header with close button, title and description */}
      <div className="pt-4 pb-2">
        <div className="flex justify-end">
          <ViewHeaderCloseWithConfirm onConfirm={handleCancel} />
        </div>
        <h1 className="text-center font-semibold text-xl mt-2">Enter zone</h1>
        <p className="text-center text-sm text-gray-600 mt-2">
          Tap 3 to 8 points that will form a hazard zone.
        </p>
      </div>

      {/* Map interface for selecting polygon points */}
      <div className="flex-1 rounded-xl overflow-hidden mb-4 mt-4">
        <RemoteZoneMapWithClicks />
      </div>

      {/* Warning if max of 8 points is reached */}
      {maxPointsReached && (
        <p className="text-xl text-red-500 text-center mb-2">
          You can only place up to 8 points to define a hazard zone.
        </p>
      )}

      {/* Undo last point – visible only if at least one point is set */}
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

      {/* Reset all points – clears the drawn zone */}
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

      {/* Shared Footer (enabled if >= 3 points) */}
      <ViewFooter
        goBack={() => setPage("selectLocation")}
        onSave={handleSave}
        saveDisabled={points.length < 3}
      />
    </div>
  );
}
