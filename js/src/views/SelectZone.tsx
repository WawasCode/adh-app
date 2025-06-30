import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ViewFooter } from "@/components/ui/ViewFooter";
import { useViewStore } from "@/store/useViewStore";
import { usePlaceStore } from "@/store/usePlaceStore";

/**
 * SelectZone allows users to choose a geometric shape for defining a hazard zone.
 * Currently only the "Circle" option is implemented.
 */
export default function SelectZone() {
  const { goBack, setPage } = useViewStore();
  const reset = usePlaceStore((s) => s.reset);

  const handleCancel = () => {
    reset();
    setPage("main");
  };

  return (
    <div className="flex flex-col h-full px-4 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
      {/* Header */}
      <div className="pt-4 pb-2">
        <button onClick={goBack} className="text-blue-600 text-base">
          &larr; Type
        </button>
        <h1 className="text-center font-semibold text-xl mt-2">Zones</h1>
      </div>

      {/* Zone shape options */}
      <div className="flex flex-col gap-4 mt-4">
        <Button
          variant="outline"
          className="justify-between text-base font-normal py-4 px-5 rounded-xl"
          onClick={() => setPage("circleDetails")}
        >
          Circle <ChevronRight className="h-5 w-5 text-gray-400" />
        </Button>
        <Button
          variant="outline"
          className="justify-between text-base font-normal py-4 px-5 rounded-xl"
          onClick={() => alert("Polygon not implemented yet.")}
        >
          Polygon <ChevronRight className="h-5 w-5 text-gray-400" />
        </Button>
        <Button
          variant="outline"
          className="justify-between text-base font-normal py-4 px-5 rounded-xl"
          onClick={() => alert("Rectangle not implemented yet.")}
        >
          Rectangle <ChevronRight className="h-5 w-5 text-gray-400" />
        </Button>
        <Button
          variant="outline"
          className="justify-between text-base font-normal py-4 px-5 rounded-xl"
          onClick={() => alert("Other zones not implemented yet.")}
        >
          Other <ChevronRight className="h-5 w-5 text-gray-400" />
        </Button>
      </div>

      {/* Shared Footer */}
      <ViewFooter onCancel={handleCancel} />
    </div>
  );
}
