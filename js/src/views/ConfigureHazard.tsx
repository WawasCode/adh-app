import { FloatingLabelInput } from "@/components/ui/FloatingLabelInput";
import { FloatingLabelTextarea } from "@/components/ui/FloatingLabelTextarea";
import { Button } from "@/components/ui/Button";
import { ViewFooter } from "@/components/ui/ViewFooter";
import { useViewStore } from "@/store/useViewStore";
import { usePlaceStore } from "@/store/usePlaceStore";
import { useZoneStore } from "@/store/useZoneStore";
import { useState } from "react";
import { ViewHeaderCloseWithConfirm } from "@/components/ui/ViewHeaderCloseWithConfirm";

export default function ConfigureHazard() {
  const setPage = useViewStore((s) => s.setPage);
  const {
    hazardInput: { name, description, severity, location },
    setHazardField,
    resetHazardInput,
  } = usePlaceStore();

  const { points, reset: resetZone } = useZoneStore();
  const [isWalkable, setIsWalkable] = useState(false);
  const [isDrivable, setIsDrivable] = useState(false);

  const hasLocation =
    (location !== null && Array.isArray(location)) || points.length >= 3;
  const isFormComplete = name.trim() !== "" && severity !== null && hasLocation;

  const handleCancel = () => {
    resetHazardInput();
    resetZone();
    setPage("main");
  };

  const handleSave = async () => {
    if (!isFormComplete || (!location && points.length < 3)) return;

    const isIncident = !!location;

    const payload = {
      name,
      description,
      severity: severity!,
      isWalkable,
      isDrivable,
      location: isIncident
        ? {
            type: "Point",
            coordinates: [location[1], location[0]],
          }
        : {
            type: "Polygon",
            coordinates: [
              [
                ...points.map(([lat, lng]) => [lng, lat]),
                [points[0][1], points[0][0]],
              ],
            ],
          },
    };

    const endpoint = isIncident ? "/api/incidents/" : "/api/hazard-zones/";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Error saving hazard or incident");

      alert(`${isIncident ? "Incident" : "Hazard"} saved successfully!`);
      resetHazardInput();
      resetZone();
      setPage("main");
    } catch (error) {
      console.error("Caught error:", error);
      alert(`Failed to save ${isIncident ? "incident" : "hazard zone"}.`);
    }
  };

  return (
    <div className="flex flex-col h-full px-4 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
      <div className="pt-4 pb-2 relative">
        <ViewHeaderCloseWithConfirm onConfirm={handleCancel} />
        <h1 className="text-center font-semibold text-xl mt-2">
          Configure Hazard
        </h1>
        {!isFormComplete && (
          <p className="text-center text-sm text-gray-700 mt-2">
            Please fill in name, location and severity to enable saving.
          </p>
        )}
      </div>

      <div className="flex flex-col gap-4 mt-4">
        <FloatingLabelInput
          value={name}
          onChange={(e) => setHazardField("name", e.target.value)}
          className="rounded-xl py-4 px-5 text-base"
          label="Name"
          autoComplete="off"
          maxLength={50}
        />

        <FloatingLabelTextarea
          value={description}
          onChange={(e) => setHazardField("description", e.target.value)}
          className="rounded-xl py-4 px-5 text-base"
          label="Description"
          maxLength={250}
        />

        <Button
          onClick={() => setPage("selectLocation")}
          variant="outline"
          className="justify-between text-base font-normal py-4 px-5 rounded-xl"
        >
          {hasLocation ? "Location – saved" : "Location"}
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

        {/* Walkable Toggle */}
        <div className="flex items-center justify-between text-base font-normal py-4 px-5 rounded-xl border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors">
          <span>Is walkable</span>
          <div
            onClick={() => setIsWalkable(!isWalkable)}
            className={`w-12 h-6 flex items-center rounded-full p-1 duration-300 ease-in-out cursor-pointer ${
              isWalkable ? "bg-green-500" : "bg-gray-300"
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${
                isWalkable ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </div>
        </div>

        {/* Drivable Toggle */}
        <div className="flex items-center justify-between text-base font-normal py-4 px-5 rounded-xl border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors">
          <span>Is drivable</span>
          <div
            onClick={() => setIsDrivable(!isDrivable)}
            className={`w-12 h-6 flex items-center rounded-full p-1 duration-300 ease-in-out cursor-pointer ${
              isDrivable ? "bg-green-500" : "bg-gray-300"
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${
                isDrivable ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </div>
        </div>
      </div>

      <ViewFooter
        goBack={() => setPage("addPlace")}
        onSave={handleSave}
        saveDisabled={!isFormComplete}
      />
    </div>
  );
}
