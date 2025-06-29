import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { useViewStore } from "@/store/useViewStore";
import { usePlaceStore } from "@/store/usePlaceStore";

/**
 * ConfigureWaypoint allows the user to input information for a new waypoint.
 * Required fields: name, type, location
 * Optional fields: description, telephone, availability
 */
export default function ConfigureWaypoint() {
  const setPage = useViewStore((s) => s.setPage);

  const {
    name,
    description,
    telephone,
    waypointType,
    location,
    isAvailable,
    setName,
    setDescription,
    setTelephone,
    setAvailability,
    reset,
  } = usePlaceStore();

  const isFormComplete =
    name.trim() !== "" && waypointType !== null && location !== null;

  const handleSave = () => {
    alert("Waypoint saved and shown on map!");
    reset();
    setPage("main");
  };

  return (
    <div className="flex flex-col h-full px-4 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
      {/* Header */}
      <div className="pt-4 pb-2">
        <button
          onClick={() => setPage("addPlace")}
          className="text-blue-600 text-base"
        >
          &larr; Back
        </button>
        <h1 className="text-center font-semibold text-xl mt-2">
          Configure Waypoint
        </h1>

        {!isFormComplete && (
          <p className="text-center text-sm text-gray-700 mt-2">
            Please fill in name, type and location to enable saving.
          </p>
        )}
      </div>

      {/* Form fields */}
      <div className="flex flex-col gap-4 mt-4">
        <Input
          placeholder="Name"
          autoComplete="off"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-xl py-4 px-5 text-base"
        />

        <Textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="rounded-xl py-4 px-5 text-base"
        />

        <Button
          onClick={() => setPage("waypointLocation")}
          variant="outline"
          className="justify-between text-base font-normal py-4 px-5 rounded-xl"
        >
          {location ? "Location – saved" : "Location"}
          <span className="text-gray-400">&rsaquo;</span>
        </Button>

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

        <Input
          placeholder="Phone (optional)"
          value={telephone}
          onChange={(e) => setTelephone(e.target.value)}
          className="rounded-xl py-4 px-5 text-base"
        />

        <div className="flex items-center justify-between text-base font-normal py-4 px-5 rounded-xl border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors">
          <span>Is available</span>
          <div
            onClick={() => setAvailability(!isAvailable)}
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

      {/* Footer Buttons */}
      <div className="mt-auto flex justify-between gap-4 pt-6 pb-[calc(3rem+env(safe-area-inset-bottom)+56px)]">
        <Button
          variant="outline"
          className="flex-1 rounded-full py-4 text-base"
          onClick={() => {
            setPage("main");
            reset();
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="outline"
          className={`flex-1 rounded-full py-4 text-base ${
            !isFormComplete
              ? "text-gray-400 border-gray-300 opacity-50 cursor-not-allowed"
              : ""
          }`}
          disabled={!isFormComplete}
        >
          Save
        </Button>
      </div>
    </div>
  );
}
