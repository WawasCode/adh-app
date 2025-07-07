import { Button } from "@/components/ui/Button";
import { useViewStore } from "@/store/useViewStore";
import { usePlaceStore, hazardSeverities } from "@/store/usePlaceStore";
import type { HazardSeverity } from "@/store/usePlaceStore";
import { ViewHeaderCloseWithConfirm } from "@/components/ui/ViewHeaderCloseWithConfirm";

/**
 * SelectSeverity allows the user to choose the severity level for a hazard.
 */
export default function SelectSeverity() {
  const { setPage } = useViewStore();
  const setSeverity = usePlaceStore((s) => s.setSeverity);
  const reset = usePlaceStore((s) => s.reset);

  const handleSelect = (value: HazardSeverity) => {
    setSeverity(value);
    setPage("configureHazard");
  };

  const handleCancel = () => {
    reset();
    setPage("main");
  };

  return (
    <div className="flex flex-col h-full px-4 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
      {/* Header */}
      <div className="pt-4 pb-2">
        <ViewHeaderCloseWithConfirm onConfirm={handleCancel} />
        <h1 className="text-center font-semibold text-xl mt-2">
          Select Severity
        </h1>
      </div>

      {/* Severity options */}
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
    </div>
  );
}
