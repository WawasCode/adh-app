import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { useViewStore } from "@/store/useViewStore";

/**
 * SelectCircleDetailsView component collects additional data for circular hazard zones.
 * It allows the user to enter coordinates and radius information.
 */
export default function SelectCircleDetailsView() {
  const [coordinates, setCoordinates] = useState("");
  const [radius, setRadius] = useState("");

  const { goBack } = useViewStore();

  return (
    <div className="flex flex-col h-full px-4 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
      {/* Header */}
      <div className="pt-4 pb-2">
        <button onClick={goBack} className="text-blue-600 text-base">
          &larr; Zonen
        </button>
        <h1 className="text-center font-semibold text-xl mt-2">Details</h1>
      </div>

      {/* Form fields */}
      <div className="flex flex-col gap-4 mt-4">
        <Input
          placeholder="Adresse/Koordinaten"
          value={coordinates}
          onChange={(e) => setCoordinates(e.target.value)}
          className="rounded-xl py-4 px-5 text-base"
        />

        <Input
          placeholder="Radius (Meter)"
          value={radius}
          onChange={(e) => setRadius(e.target.value)}
          className="rounded-xl py-4 px-5 text-base"
        />

        {/* Platzhalter für Karte */}
        <div className="w-full h-32 bg-gray-200 rounded-xl flex items-center justify-center text-sm text-gray-600">
          [Karte folgt]
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="mt-auto flex justify-between gap-4 pt-6 pb-[calc(3rem+env(safe-area-inset-bottom)+56px)]">
        <Button
          variant="outline"
          className="flex-1 rounded-full py-4 text-base"
          onClick={goBack}
        >
          Zurück
        </Button>
        <Button
          variant="outline"
          className="flex-1 rounded-full py-4 text-base text-gray-400 border-gray-300 opacity-50"
          disabled
        >
          Senden
        </Button>
      </div>
    </div>
  );
}
