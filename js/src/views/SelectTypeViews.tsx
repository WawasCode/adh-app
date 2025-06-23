// js/src/views/SelectTypeView.tsx

import { ArrowLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface SelectTypeViewProps {
  goBack: () => void;
  onSelectZones: () => void;
  onSelectAddress: () => void;
}

export default function SelectTypeView({
  goBack,
  onSelectZones,
  onSelectAddress,
}: SelectTypeViewProps) {
  return (
    <div className="flex flex-col h-full px-4 pt-4 pb-[7rem]">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={goBack}
          className="text-blue-600 text-sm flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Ort Hinzufügen
        </button>
      </div>

      <h1 className="text-center font-semibold text-lg mb-4">Typ</h1>

      {/* Auswahlmöglichkeiten */}
      <div className="flex flex-col gap-2">
        <Button
          variant="outline"
          className="justify-between py-3 px-4 rounded-xl text-sm font-normal"
          onClick={onSelectZones}
        >
          Zonen <ChevronRight className="h-4 w-4 text-gray-400" />
        </Button>

        <Button
          variant="outline"
          className="justify-between py-3 px-4 rounded-xl text-sm font-normal"
          onClick={onSelectAddress}
        >
          Adresse <ChevronRight className="h-4 w-4 text-gray-400" />
        </Button>
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
  );
}
