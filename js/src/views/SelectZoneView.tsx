import { ArrowLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useViewStore } from "@/store/useViewStore";

/**
 * SelectZoneView – zeigt die Auswahl der Zonenarten an.
 */
export default function SelectZoneView() {
  const { setPage, goBack } = useViewStore();

  return (
    <div className="flex flex-col h-full px-4 pt-4 pb-[7rem]">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={goBack}
          className="text-blue-600 text-sm flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Label
        </button>
        <h1 className="text-center font-semibold text-lg flex-1">Zonen</h1>
      </div>

      {/* Auswahl-Buttons */}
      <div className="flex flex-col gap-2">
        <Button
          variant="outline"
          className="justify-between text-sm font-normal py-3 px-4 rounded-xl"
          onClick={() => setPage("circleDetails")}
        >
          Kreis <ChevronRight className="w-4 h-4 text-gray-400" />
        </Button>

        <Button
          variant="outline"
          className="justify-between text-sm font-normal py-3 px-4 rounded-xl"
          onClick={() => alert("Polygon-Auswahl noch nicht implementiert")}
        >
          Polygon <ChevronRight className="w-4 h-4 text-gray-400" />
        </Button>

        <Button
          variant="outline"
          className="justify-between text-sm font-normal py-3 px-4 rounded-xl"
          onClick={() => alert("Rechteck-Auswahl noch nicht implementiert")}
        >
          Rechteck <ChevronRight className="w-4 h-4 text-gray-400" />
        </Button>

        <Button
          variant="outline"
          className="justify-between text-sm font-normal py-3 px-4 rounded-xl"
          onClick={() => alert("Weitere Zone-Auswahl noch nicht implementiert")}
        >
          Weitere Zone <ChevronRight className="w-4 h-4 text-gray-400" />
        </Button>
      </div>

      {/* Footer Buttons */}
      <div className="mt-auto flex justify-between gap-4 pt-6 pb-[calc(3rem+env(safe-area-inset-bottom)+56px)]">
        <Button
          variant="outline"
          className="flex-1 rounded-full py-4 text-base"
          onClick={() => setPage("main")}
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
