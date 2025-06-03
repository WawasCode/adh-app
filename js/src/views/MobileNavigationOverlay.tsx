import {
  ArrowLeft,
  Crosshair,
  Map as MapIcon,
  PlusCircle,
  Flame,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { InputWithIcon, CategoryChip } from "@/views/MobileUICommon";

/**
 * Overlay for the navigation planner view.
 * @param goBack handler to return to the main map.
 */
export function MobileNavigationOverlay({
  goBack,
  BottomNavComponent,
}: {
  goBack: () => void;
  BottomNavComponent: React.ReactNode;
}) {
  return (
    <div className="absolute inset-0 z-10 pointer-events-none">
      <Card className="absolute inset-x-1 top-[calc(1rem+env(safe-area-inset-top))] pointer-events-auto bg-slate-100 shadow-lg rounded-2xl">
        <CardContent className="p-2 flex flex-col gap-4">
          <Button
            aria-label="Back"
            onClick={goBack}
            variant="ghost"
            className="left-4 w-10 h-10 rounded-full bg-white shadow flex items-center justify-center p-0 pointer-events-auto"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <InputWithIcon
            icon={<Crosshair className="h-4 w-4" />}
            placeholder="Meine Position"
          />
          <InputWithIcon
            icon={<MapIcon className="h-4 w-4" />}
            placeholder=""
          />
          <div className="flex flex-nowrap gap-2 overflow-x-auto py-2">
            <CategoryChip icon={PlusCircle} label="Krankenhaus" />
            <CategoryChip icon={Flame} label="Feuerwehr" />
            <CategoryChip icon={Shield} label="Polizeistation" />
          </div>
        </CardContent>
      </Card>
      <div className="absolute inset-x-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] pointer-events-auto">
        {BottomNavComponent}
      </div>
    </div>
  );
}
