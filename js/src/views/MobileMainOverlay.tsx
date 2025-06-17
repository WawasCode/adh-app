import { Plus, Navigation as NavigationIcon, Crosshair } from "lucide-react";
import {
  MapIconButton,
  FilterButton,
  CompassButton,
  SearchBar,
} from "@/views/MobileUICommon";

/**
 * Overlay for the main mobile map view.
 * @param openNavigation – handler to open the navigation planner.
 */
export function MobileMainOverlay({
  openNavigation,
  BottomNavComponent,
  onLocationSelect,
}: {
  openNavigation: () => void;
  BottomNavComponent: React.ReactNode;
  onLocationSelect?: (location: {
    lat: number;
    lon: number;
    name: string;
  }) => void;
}) {
  return (
    <div className="absolute inset-0 z-10 pointer-events-none">
      <div className="absolute inset-x-4 top-[calc(1.5rem+env(safe-area-inset-top))] pointer-events-auto">
        <SearchBar onLocationSelect={onLocationSelect} />
      </div>
      <div className="absolute left-4 top-[calc(5.25rem+env(safe-area-inset-top))] pointer-events-auto">
        <FilterButton />
      </div>
      <div className="absolute right-4 top-[calc(5.25rem+env(safe-area-inset-top))] pointer-events-auto">
        <CompassButton />
      </div>
      <div className="absolute right-4 bottom-[calc(10rem+env(safe-area-inset-bottom))] flex flex-col gap-3 pointer-events-auto">
        <MapIconButton icon={Plus} label="Zoom in" />
        <MapIconButton
          icon={NavigationIcon}
          label="Navigate"
          onClick={openNavigation}
        />
        <MapIconButton icon={Crosshair} label="Center" />
      </div>
      <div className="absolute inset-x-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] pointer-events-auto">
        {BottomNavComponent}
      </div>
    </div>
  );
}
