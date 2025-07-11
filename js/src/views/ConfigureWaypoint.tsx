import { Button } from "@/components/ui/Button";
import { FloatingLabelTextarea } from "@/components/ui/FloatingLabelTextarea";
import { FloatingLabelInput } from "@/components/ui/FloatingLabelInput";
import { useViewStore } from "@/store/useViewStore";
import { useWaypointStore } from "@/store/useWaypointCreationStore";
import { useWaypointStore as useWaypointDisplayStore } from "@/store/useWaypointDisplayStore";
import { ViewFooter } from "@/components/ui/ViewFooter";
import { ViewHeaderCloseWithConfirm } from "@/components/ui/ViewHeaderCloseWithConfirm";

/**
 * ConfigureWaypoint – View for entering waypoint details.
 *
 * Allows the user to input name, description, type, and location
 * for a waypoint. Optional fields include telephone and availability status.
 * Data is submitted as GeoJSON Point to the backend.
 *
 * @returns JSX.Element – The rendered waypoint configuration view.
 */
export default function ConfigureWaypoint() {
  const setPage = useViewStore((s) => s.setPage);

  const {
    waypointInput: {
      name,
      description,
      telephone,
      waypointType,
      location,
      isAvailable,
    },
    setWaypointField,
    resetWaypointInput,
  } = useWaypointStore();

  const isFormComplete =
    name.trim() !== "" && waypointType !== null && location !== null;

  /**
   * handleSave – Validates and sends waypoint data to the backend.
   * Constructs a GeoJSON Point object from location coordinates.
   */
  const handleSave = async () => {
    if (!isFormComplete || !location) return;

    const waypoint = {
      name,
      description,
      location: {
        type: "Point",
        coordinates: [location[1], location[0]], // [lon, lat]
      },
      type: waypointType,
      telephone_number: telephone,
      active: isAvailable,
    };

    try {
      const res = await fetch("/api/waypoints/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(waypoint),
      });

      if (!res.ok) throw new Error("Error while saving");

      await useWaypointDisplayStore.getState().fetchWaypoints();

      alert("Waypoint saved successfully!");
      resetWaypointInput();
      setPage("main");
    } catch (error) {
      console.error("Caught error:", error);
      alert("Failed to save waypoint.");
    }
  };

  /**
   * handleCancel – Resets all waypoint inputs and navigates back to main screen.
   */
  const handleCancel = () => {
    resetWaypointInput();
    setPage("main");
  };

  return (
    <div className="flex flex-col h-full px-4 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
      {/* Header with close button and form title */}
      <div className="pt-4 pb-2">
        <div className="flex justify-end">
          <ViewHeaderCloseWithConfirm onConfirm={handleCancel} />
        </div>
        <h1 className="text-center font-semibold text-xl mt-2">
          Configure Waypoint
        </h1>

        {!isFormComplete && (
          <p className="text-center text-sm text-gray-700 mt-2">
            Please fill in name, location and type to enable saving.
          </p>
        )}
      </div>

      {/* Input fields: name, description */}
      <div className="flex flex-col gap-4 mt-4">
        <FloatingLabelInput
          value={name}
          onChange={(e) => setWaypointField("name", e.target.value)}
          className="rounded-xl py-4 px-5 text-base"
          label="Name"
          autoComplete="off"
          maxLength={50}
        />

        <FloatingLabelTextarea
          value={description}
          onChange={(e) => setWaypointField("description", e.target.value)}
          className="rounded-xl py-4 px-5 text-base"
          label="Description"
          maxLength={250}
        />

        {/* Location selector button */}
        <Button
          onClick={() => setPage("waypointLocation")}
          variant="outline"
          className="justify-between text-base font-normal py-4 px-5 rounded-xl"
        >
          {location ? "Location – saved" : "Location"}
          <span className="text-gray-400">&rsaquo;</span>
        </Button>

        {/* Waypoint type selector button */}
        <Button
          onClick={() => setPage("waypointType")}
          variant="outline"
          className="justify-between text-base font-normal py-4 px-5 rounded-xl"
        >
          {waypointType
            ? `Type – ${waypointType.charAt(0).toUpperCase() + waypointType.slice(1)}`
            : "Type"}
          <span className="text-gray-400">&rsaquo;</span>
        </Button>

        {/* Optional telephone input */}
        <FloatingLabelInput
          value={telephone}
          onChange={(e) => setWaypointField("telephone", e.target.value)}
          className="rounded-xl py-4 px-5 text-base"
          label="Phone (optional)"
          maxLength={20}
        />

        {/* Toggle switch for 'isAvailable' */}
        <div className="flex items-center justify-between text-base font-normal py-4 px-5 rounded-xl border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors">
          <span>Is available</span>
          <div
            onClick={() => setWaypointField("isAvailable", !isAvailable)}
            className={`w-12 h-6 flex items-center rounded-full p-1 duration-300 ease-in-out cursor-pointer ${
              isAvailable ? "bg-green-500" : "bg-gray-300"
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${
                isAvailable ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </div>
        </div>
      </div>

      {/* Shared Footer */}
      <ViewFooter
        goBack={() => setPage("addPlace")}
        onSave={handleSave}
        saveDisabled={!isFormComplete}
      />
    </div>
  );
}
