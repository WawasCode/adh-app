import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useState } from "react";

/**
 * AddPlaceView component renders a form for creating a new place (hazard or address).
 * It includes input fields for name, category, and type, and buttons to cancel or submit the entry.
 */
export default function AddPlaceView() {
  const [name, setName] = useState("");

  return (
    <div className="flex flex-col h-full px-4 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
      {/* Header */}
      <div className="pt-4 pb-2">
        <button className="text-blue-600 text-sm">&larr; Karte</button>
        <h1 className="text-center font-semibold text-lg mt-2">
          Ort hinzufügen
        </h1>
      </div>

      {/* Form fields */}
      <div className="flex flex-col gap-4 mt-4">
        <Input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-xl py-3 px-4 text-sm"
        />

        <Button
          variant="outline"
          className="justify-between text-sm font-normal py-3 px-4 rounded-xl"
        >
          Kategorie <span className="text-gray-400">&rsaquo;</span>
        </Button>

        <Button
          variant="outline"
          className="justify-between text-sm font-normal py-3 px-4 rounded-xl"
        >
          Typ <span className="text-gray-400">&rsaquo;</span>
        </Button>
      </div>

      {/* Footer Buttons */}
      <div className="mt-auto flex justify-between gap-4 pt-6 pb-[calc(3rem+env(safe-area-inset-bottom)+56px)]">
        <Button variant="outline" className="flex-1 rounded-full py-3 text-sm">
          Abbrechen
        </Button>
        <Button
          variant="outline"
          className="flex-1 rounded-full py-3 text-sm text-gray-400 border-gray-300 opacity-50"
          disabled
        >
          Senden
        </Button>
      </div>
    </div>
  );
}
