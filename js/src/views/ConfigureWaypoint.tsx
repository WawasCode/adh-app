import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { useViewStore } from "@/store/useViewStore";
import { usePlaceStore } from "@/store/usePlaceStore";

/**
 * ConfigureWaypoint allows the user to input information for a new waypoint.
 * It includes fields for name, description, location, type, phone number and a toggle to mark if available.
 * Navigation between views is handled via Zustand.
 */
export default function ConfigureWaypoint() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [telephone, setTelephone] = useState("");
  const [waypointIsActive, setWaypointIsActive] = useState(false);

  const setPage = useViewStore((s) => s.setPage);
  const waypointType = usePlaceStore((s) => s.waypointType);
  const location = usePlaceStore((s) => s.location);

  const isFormComplete =
    name.trim() !== "" &&
    description.trim() !== "" &&
    telephone.trim() !== "" &&
    waypointType;

  // TODO: später: Daten speichern und auf Karte anzeigen
  const handleSave = () => {
    alert("Saving not implemented yet, but form is complete!");
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
      </div>

      {/* Form fields */}
      <div className="flex flex-col gap-4 mt-4">
        <Input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-xl py-4 px-5 text-base"
        />

        <Input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="rounded-xl py-4 px-5 text-base"
        />

        <Button
          onClick={() => setPage("waypointLocation")}
          variant="outline"
          className="justify-between text-base font-normal py-4 px-5 rounded-xl"
        >
          {location ? "Location - saved" : "Location"}
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
          placeholder="+49 123 456789"
          value={telephone}
          onChange={(e) => setTelephone(e.target.value)}
          className="rounded-xl py-4 px-5 text-base"
        />

        <div className="flex items-center justify-between text-base font-normal py-4 px-5 rounded-xl border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors">
          <span>Is available</span>
          <div
            onClick={() => setWaypointIsActive(!waypointIsActive)}
            className={`w-12 h-6 flex items-center rounded-full p-1 duration-300 ease-in-out cursor-pointer ${
              waypointIsActive ? "bg-green-500" : "bg-gray-300"
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${
                waypointIsActive ? "translate-x-6" : "translate-x-0"
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
          onClick={() => setPage("main")}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="outline"
          className={`flex-1 rounded-full py-4 text-base ${
            isFormComplete
              ? ""
              : "text-gray-400 border-gray-300 opacity-50 cursor-not-allowed"
          }`}
          disabled={!isFormComplete}
        >
          Save
        </Button>
      </div>
    </div>
  );
}
