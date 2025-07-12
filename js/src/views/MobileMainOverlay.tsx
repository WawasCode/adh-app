import { useRef, useEffect, useState } from "react";
import { Plus, Navigation as NavigationIcon, Crosshair } from "lucide-react";
import {
  MapIconButton,
  FilterButton,
  CompassButton,
  SearchBar,
} from "@/views/MobileUICommon";
import { SlidingCard } from "@/components/ui/SlidingCard";
import { useSlidingCardStore } from "@/store/useSlidingCardStore";

interface MobileMainOverlayProps {
  openNavigation: () => void;
  openAddPlace: () => void;
  BottomNavComponent: React.ReactNode;
  onLocationSelect?: (location: {
    lat: number;
    lon: number;
    name: string;
  }) => void;
}

// Top search and filter controls
// Right-side action buttons (zoom, navigate, center)
// Bottom persistent navigation

/**
 * Overlay for the main mobile map view.
 * @param openNavigation - handler to open the navigation planner.
 * @param BottomNavComponent - Bottom navigation bar component to display.
 */
export function MobileMainOverlay({
  openNavigation,
  openAddPlace,
  BottomNavComponent,
  onLocationSelect,
}: MobileMainOverlayProps) {
  const { isVisible } = useSlidingCardStore();
  const slidingCardRef = useRef<HTMLDivElement>(null);
  const [cardHeight, setCardHeight] = useState(0);

  useEffect(() => {
    if (isVisible && slidingCardRef.current) {
      const height = slidingCardRef.current.getBoundingClientRect().height;
      setCardHeight(height);
    } else {
      setCardHeight(0);
    }
  }, [isVisible]);

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
      <div
        className="absolute right-4 pointer-events-auto flex flex-col gap-3 transition-[bottom] duration-300 ease-in-out"
        style={{
          bottom: isVisible
            ? `calc(${cardHeight + 12}px`
            : "calc(10rem + env(safe-area-inset-bottom))",
        }}
      >
        <MapIconButton icon={Plus} label="Add Place" onClick={openAddPlace} />
        {!isVisible && (
          <MapIconButton
            icon={NavigationIcon}
            label="Navigate"
            onClick={openNavigation}
          />
        )}
        <MapIconButton icon={Crosshair} label="Center" />
      </div>
      <div className="absolute inset-x-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] pointer-events-auto">
        {BottomNavComponent}
      </div>
      <SlidingCard openNavigation={openNavigation} />
    </div>
  );
}
