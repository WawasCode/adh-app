import { Button } from "@/components/ui/Button";
import { useViewStore } from "@/store/useViewStore";
import { usePlaceStore } from "@/store/usePlaceStore";
import type { WaypointType } from "@/store/usePlaceStore";
import { ViewHeaderCloseWithConfirm } from "@/components/ui/ViewHeaderCloseWithConfirm";
import { ViewFooterOnlyBackButton } from "@/components/ui/ViewFooterOnlyBackButton";

/**
 * SelectWaypointType allows the user to choose a category for the waypoint.
 * Options include predefined categories like Firestation, Hospital, etc.
 */
export default function SelectWaypointType() {
  const { setPage } = useViewStore();
  const setWaypointField = usePlaceStore((s) => s.setWaypointField);
  const resetWaypointInput = usePlaceStore((s) => s.resetWaypointInput);

  const waypointOptions: WaypointType[] = [
    "firestation",
    "policestation",
    "hospital",
    "critical infrastructure",
    "medical facility",
    "supply center",
    "other",
  ];

  const handleSelectType = (type: WaypointType) => {
    setWaypointField("waypointType", type);
    setPage("configureWaypoint");
  };

  const handleCancel = () => {
    resetWaypointInput();
    setPage("main");
  };

  return (
    <div className="flex flex-col h-full px-4 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
      {/* Header */}
      <div className="pt-4 pb-2">
        <ViewHeaderCloseWithConfirm onConfirm={handleCancel} />
        <h1 className="text-center font-semibold text-xl mt-2">Select Type</h1>
      </div>

      {/* Type Options */}
      <div className="flex flex-col gap-4 mt-4">
        {waypointOptions.map((label) => (
          <Button
            key={label}
            variant="outline"
            className="justify-between text-base font-normal py-4 px-5 rounded-xl"
            onClick={() => handleSelectType(label)}
          >
            {label.charAt(0).toUpperCase() + label.slice(1)}
          </Button>
        ))}
      </div>
      <ViewFooterOnlyBackButton goBack={() => setPage("configureWaypoint")} />
    </div>
  );
}
