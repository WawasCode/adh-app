import { Button } from "@/components/ui/Button";
import { useViewStore } from "@/store/useViewStore";
import { useWaypointStore } from "@/store/useWaypointCreationStore";
import { WaypointType } from "@/types/waypoint";
import { ViewHeaderCloseWithConfirm } from "@/components/ui/ViewHeaderCloseWithConfirm";
import { ViewFooterOnlyBackButton } from "@/components/ui/ViewFooterOnlyBackButton";
/**
 * SelectWaypointType – View for selecting a category (type) of waypoint.
 *
 * Users choose from predefined options like Firestation or Hospital.
 * The selected type is saved in Zustand (`waypointInput.waypointType`).
 * After selection, the user is redirected back to ConfigureWaypoint.
 */
export default function SelectWaypointType() {
  const { setPage } = useViewStore();
  const setWaypointField = useWaypointStore((s) => s.setWaypointField);
  const resetWaypointInput = useWaypointStore((s) => s.resetWaypointInput);

  const waypointOptions: WaypointType[] = [
    "firestation",
    "policestation",
    "hospital",
    "critical infrastructure",
    "medical facility",
    "supply center",
    "other",
  ];

  /**
   * handleSelectType – Saves the selected type and navigates back to the waypoint config view.
   *
   * @param type - One of the predefined WaypointType values.
   */
  const handleSelectType = (type: WaypointType) => {
    setWaypointField("waypointType", type);
    setPage("configureWaypoint");
  };

  /**
   * handleCancel – Resets waypoint input and navigates back to the main view.
   */
  const handleCancel = () => {
    resetWaypointInput();
    setPage("main");
  };

  return (
    <div className="flex flex-col h-full px-4 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
      {/* Header with close button and title */}
      <div className="pt-4 pb-2">
        <div className="flex justify-end">
          <ViewHeaderCloseWithConfirm onConfirm={handleCancel} />
        </div>
        <h1 className="text-center font-semibold text-xl mt-2">Select Type</h1>
      </div>

      {/* List of selectable waypoint types */}
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
      <ViewFooterOnlyBackButton goBack={() => setPage("configureWaypoint")} />
    </div>
  );
}
