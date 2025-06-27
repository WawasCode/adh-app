import { Button } from "@/components/ui/Button";
import { useViewStore } from "@/store/useViewStore";
import { usePlaceStore } from "@/store/usePlaceStore";
import type { WaypointType } from "@/store/usePlaceStore";

/**
 * WaypointTypeView allows the user to choose the type of waypoint.
 * Examples include fire stations, police stations, and hospitals.
 */
export default function WaypointTypeView() {
  const { goBack, setPage } = useViewStore();
  const setWaypointType = usePlaceStore((s) => s.setWaypointType);

  const waypointOptions: WaypointType[] = [
    "firestation",
    "policestation",
    "hospital",
  ];

  const handleSelectType = (type: WaypointType) => {
    setWaypointType(type);
    setPage("configureWaypoint");
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

      {/* Options */}
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

      {/* Footer Buttons */}
      <div className="mt-auto flex justify-between gap-4 pt-6 pb-[calc(3rem+env(safe-area-inset-bottom)+56px)]">
        <Button
          variant="outline"
          className="flex-1 rounded-full py-4 text-base"
          onClick={goBack}
        >
          Cancel
        </Button>
        <Button
          variant="outline"
          className="flex-1 rounded-full py-4 text-base text-gray-400 border-gray-300 opacity-50"
          disabled
        >
          Save
        </Button>
      </div>
    </div>
  );
}
