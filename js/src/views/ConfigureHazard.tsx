import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { ViewFooter } from "@/components/ui/ViewFooter";
import { useViewStore } from "@/store/useViewStore";
import { usePlaceStore } from "@/store/usePlaceStore";
import { useZoneStore } from "@/store/useZoneStore";
import { v4 as uuidv4 } from "uuid";

/**
 * ConfigureHazard allows the user to input information for a new hazard.
 * The input is stored in Zustand and includes name, description, zone (points) and severity.
 * The zone is saved to global store when all required fields are filled.
 */
export default function ConfigureHazard() {
  const setPage = useViewStore((s) => s.setPage);
  const {
    name,
    setName,
    description,
    setDescription,
    severity,
    reset: resetPlace,
  } = usePlaceStore();

  const { points, reset: resetZone, addHazardZone } = useZoneStore();

  const isFormComplete =
    name.trim() !== "" && severity !== null && points.length >= 3;

  const handleCancel = () => {
    resetPlace();
    resetZone();
    setPage("main");
  };

  const handleSave = () => {
    if (!isFormComplete) return;

    addHazardZone({
      id: uuidv4(),
      name,
      description,
      severity: severity!,
      coordinates: points,
    });

    resetPlace();
    resetZone();
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
          Configure Hazard
        </h1>
        {!isFormComplete && (
          <p className="text-center text-sm text-gray-700 mt-2">
            Please fill in name, severity and zone to enable saving.
          </p>
        )}
      </div>

      {/* Form fields */}
      <div className="flex flex-col gap-4 mt-4">
        <Input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-xl py-4 px-5 text-base"
        />

        <Textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="rounded-xl py-4 px-5 text-base"
        />

        <Button
          onClick={() => setPage("selectLocation")}
          variant="outline"
          className="justify-between text-base font-normal py-4 px-5 rounded-xl"
        >
          {points.length >= 3 ? "Location – saved" : "Location"}
          <span className="text-gray-400">&rsaquo;</span>
        </Button>

        <Button
          onClick={() => setPage("selectSeverity")}
          variant="outline"
          className="justify-between text-base font-normal py-4 px-5 rounded-xl"
        >
          {severity
            ? `Severity: ${severity.charAt(0).toUpperCase() + severity.slice(1)}`
            : "Severity"}
          <span className="text-gray-400">&rsaquo;</span>
        </Button>
      </div>

      {/* Shared Footer */}
      <ViewFooter
        onCancel={handleCancel}
        onSave={handleSave}
        saveDisabled={!isFormComplete}
      />
    </div>
  );
}
