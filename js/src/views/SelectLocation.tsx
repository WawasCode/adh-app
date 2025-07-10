import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useViewStore } from "@/store/useViewStore";
import { ViewHeaderCloseWithConfirm } from "@/components/ui/ViewHeaderCloseWithConfirm";
import { ViewFooterOnlyBackButton } from "@/components/ui/ViewFooterOnlyBackButton";

/**
 * SelectLocationView lets the user choose between selecting a zone or an address.
 */
export default function SelectLocation() {
  const { setPage } = useViewStore();

  const handleCancel = () => {
    setPage("main");
  };

  return (
    <div className="flex flex-col h-full px-4 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
      {/* Header */}
      <div className="pt-4 pb-2">
        <ViewHeaderCloseWithConfirm onConfirm={handleCancel} />
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
          onClick={() => setPage("selectAddress")}
        >
          Address <ChevronRight className="h-5 w-5 text-gray-400" />
        </Button>
      </div>
      <ViewFooterOnlyBackButton goBack={() => setPage("configureHazard")} />
    </div>
  );
}
