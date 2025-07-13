import { Button } from "@/components/ui/Button";
import { useViewStore } from "@/store/useViewStore";
import { useIncidentStore } from "@/store/useIncidentCreationStore";
import { HazardSeverity, hazardSeverities } from "@/types/incident";
import { ViewHeaderCloseWithConfirm } from "@/components/ui/ViewHeaderCloseWithConfirm";
import { ViewFooterOnlyBackButton } from "@/components/ui/ViewFooterOnlyBackButton";

/**
 * SelectSeverity – View to select a severity level for a hazard.
 *
 * The severity level is part of the hazard metadata and influences
 * styling and priority. Options include "low", "medium", "high", "critical".
 *
 * After selection, the user is redirected to ConfigureHazard.
 * State is managed via Zustand (`usePlaceStore`, `useViewStore`).
 */
export default function SelectSeverity() {
  const { setPage } = useViewStore();
  const setHazardField = useIncidentStore((s) => s.setHazardField);
  const resetHazardInput = useIncidentStore((s) => s.resetHazardInput);

  /**
   * handleSelect – Stores the selected severity and navigates back to ConfigureHazard.
   * @param value - One of the predefined `HazardSeverity` values.
   */
  const handleSelect = (value: HazardSeverity) => {
    setHazardField("severity", value);
    setPage("configureHazard");
  };

  /**
   * handleCancel – Resets the hazard input and returns to the main screen.
   */
  const handleCancel = () => {
    resetHazardInput();
    setPage("main");
  };

  return (
    <div className="flex flex-col h-full px-4 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
      {/* Header with close button and view title */}
      <div className="pt-4 pb-2">
        <div className="flex justify-end">
          <ViewHeaderCloseWithConfirm onConfirm={handleCancel} />
        </div>
        <h1 className="text-center font-semibold text-xl mt-2">
          Select Severity
        </h1>
      </div>

      {/* Severity level selection buttons – rendered from hazardSeverities array */}
      <div className="flex flex-col gap-4 mt-4">
        {hazardSeverities.map((level) => (
          <Button
            key={level}
            onClick={() => handleSelect(level)}
            variant="outline"
            className="justify-between text-base font-normal py-4 px-5 rounded-xl"
          >
            {level.charAt(0).toUpperCase() + level.slice(1)}
          </Button>
        ))}
      </div>

      {/* Shared Footer */}
      <ViewFooterOnlyBackButton goBack={() => setPage("configureHazard")} />
    </div>
  );
}
