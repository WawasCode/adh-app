import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useViewStore } from "@/store/useViewStore";

/**
 * SelectLocationView lets the user choose between selecting a zone or an address.
 * It's part of the hazard creation flow.
 */
export default function SelectLocation() {
  const { goBack, setPage } = useViewStore();

  return (
    <div className="flex flex-col h-full px-4 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
      {/* Header */}
      <div className="pt-4 pb-2">
        <button onClick={goBack} className="text-blue-600 text-base">
          &larr; Back
        </button>
        <h1 className="text-center font-semibold text-xl mt-2">
          Select Location Type
        </h1>
      </div>

      {/* Selection Buttons */}
      <div className="flex flex-col gap-4 mt-4">
        <Button
          variant="outline"
          className="justify-between text-base font-normal py-4 px-5 rounded-xl"
          onClick={() => setPage("selectZone")}
        >
          Zone <ChevronRight className="h-5 w-5 text-gray-400" />
        </Button>

        <Button
          variant="outline"
          className="justify-between text-base font-normal py-4 px-5 rounded-xl"
          onClick={() =>
            alert("Adresse hinzufügen ist noch nicht implementiert.")
          }
        >
          Address <ChevronRight className="h-5 w-5 text-gray-400" />
        </Button>
      </div>

      {/* Footer Buttons */}
      <div className="mt-auto flex justify-between gap-4 pt-6 pb-[calc(3rem+env(safe-area-inset-bottom)+56px)]">
        <Button
          variant="outline"
          className="flex-1 rounded-full py-4 text-base"
          onClick={goBack}
        >
          Cancel
        </Button>
        <Button
          variant="outline"
          className="flex-1 rounded-full py-4 text-base text-gray-400 border-gray-300 opacity-50"
          disabled
        >
          Save
        </Button>
      </div>
    </div>
  );
}
