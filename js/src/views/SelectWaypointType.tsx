import { Button } from "@/components/ui/Button";
import { ViewFooter } from "@/components/ui/ViewFooter";
import { useViewStore } from "@/store/useViewStore";
import { usePlaceStore } from "@/store/usePlaceStore";
import type { WaypointType } from "@/store/usePlaceStore";

/**
 * SelectWaypointType allows the user to choose a category for the waypoint.
 * Options include Firestation, Policestation, and Hospital.
 */
export default function SelectWaypointType() {
  const { goBack, setPage } = useViewStore();
  const setWaypointType = usePlaceStore((s) => s.setWaypointType);
  const reset = usePlaceStore((s) => s.reset);

  const waypointOptions: WaypointType[] = [
    "firestation",
    "policestation",
    "hospital",
  ];

  const handleSelectType = (type: WaypointType) => {
    setWaypointType(type);
    setPage("configureWaypoint");
  };

  const handleCancel = () => {
    reset();
    setPage("main");
  };

  return (
    <div className="flex flex-col h-full px-4 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
      {/* Header */}
      <div className="pt-4 pb-2">
        <button onClick={goBack} className="text-blue-600 text-base">
          &larr; Back
        </button>
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

      {/* Shared Footer */}
      <ViewFooter onCancel={handleCancel} />
    </div>
  );
}
