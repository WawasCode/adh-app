// js/src/views/SelectCircleDetailsView.tsx

import { ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useState } from "react";

interface SelectCircleDetailsViewProps {
  goBack: () => void;
}

export default function SelectCircleDetailsView({
  goBack,
}: SelectCircleDetailsViewProps) {
  const [coordinates, setCoordinates] = useState("");
  const [radius, setRadius] = useState("");

  return (
    <div className="flex flex-col h-full px-4 pt-4 pb-[7rem]">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={goBack}
          className="text-blue-600 text-sm flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Ort Hinzufügen
        </button>
      </div>

      <h1 className="text-lg font-semibold mb-4">Details</h1>

      {/* Form fields */}
      <div className="flex flex-col gap-4">
        <Input
          placeholder="Adresse/Koordinaten"
          value={coordinates}
          onChange={(e) => setCoordinates(e.target.value)}
          className="rounded-xl py-3 px-4 text-sm"
        />

        <Input
          placeholder="Radius (Meter)"
          value={radius}
          onChange={(e) => setRadius(e.target.value)}
          className="rounded-xl py-3 px-4 text-sm"
        />

        {/* Platzhalter für Karte */}
        <div className="w-full h-32 bg-gray-200 rounded-xl flex items-center justify-center text-sm text-gray-600">
          [Karte folgt]
        </div>

        {/* Footer Buttons */}
        <div className="mt-auto flex justify-between gap-4 pt-6 pb-[calc(3rem+env(safe-area-inset-bottom)+56px)]">
          <Button
            variant="outline"
            className="flex-1 rounded-full py-4 text-base"
          >
            Abbrechen
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
    </div>
  );
}
