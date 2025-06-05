import { Plus, Navigation as NavigationIcon, Crosshair } from "lucide-react";
import {
  MapIconButton,
  FilterButton,
  CompassButton,
  SearchBar,
} from "@/views/MobileUICommon";
import { useIncidentsStore } from "@/store/useIncidentsStore";

/**
 * Overlay for the main mobile map view.
 * @param openNavigation – handler to open the navigation planner.
 */
export function MobileMainOverlay({
  openNavigation,
  BottomNavComponent,
}: {
  openNavigation: () => void;
  BottomNavComponent: React.ReactNode;
}) {
  const addIncident = useIncidentsStore((state) => state.addIncident);

  // Function to create a random test incident
  const createRandomIncident = async () => {
    // Generate random coordinates around Freiburg area
    const baseLat = 47.999; // Freiburg latitude
    const baseLon = 7.8421; // Freiburg longitude

    // Random offset within ~10km radius
    const latOffset = (Math.random() - 0.5) * 0.1; // ~11km per 0.1 degree
    const lonOffset = (Math.random() - 0.5) * 0.1;

    const randomLat = baseLat + latOffset;
    const randomLon = baseLon + lonOffset;

    // Random incident data
    const incidentTypes = [
      {
        title: "Verkehrsunfall",
        description: "Unfall auf der Hauptstraße",
        severity: "medium",
      },
      {
        title: "Feuer gemeldet",
        description: "Rauchentwicklung in Gebäude",
        severity: "high",
      },
      {
        title: "Medizinischer Notfall",
        description: "Person benötigt Hilfe",
        severity: "critical",
      },
      {
        title: "Straßensperrung",
        description: "Baustelle blockiert Fahrbahn",
        severity: "low",
      },
      {
        title: "Vandalismus",
        description: "Sachschaden an öffentlichem Eigentum",
        severity: "low",
      },
      {
        title: "Wasserrohrbruch",
        description: "Überschwemmung auf der Straße",
        severity: "medium",
      },
    ];

    const randomIncident =
      incidentTypes[Math.floor(Math.random() * incidentTypes.length)];

    try {
      await addIncident({
        title: randomIncident.title,
        description: randomIncident.description,
        longitude: randomLon,
        latitude: randomLat,
        severity: randomIncident.severity,
      });
    } catch (error) {
      console.error("Failed to create random incident:", error);
    }
  };

  return (
    <div className="absolute inset-0 z-10 pointer-events-none">
      <div className="absolute inset-x-4 top-[calc(1.5rem+env(safe-area-inset-top))] pointer-events-auto">
        <SearchBar />
      </div>
      <div className="absolute left-4 top-[calc(5.25rem+env(safe-area-inset-top))] pointer-events-auto">
        <FilterButton />
      </div>
      <div className="absolute right-4 top-[calc(5.25rem+env(safe-area-inset-top))] pointer-events-auto">
        <CompassButton />
      </div>
      <div className="absolute right-4 bottom-[calc(10rem+env(safe-area-inset-bottom))] flex flex-col gap-3 pointer-events-auto">
        <MapIconButton
          icon={Plus}
          label="Add Test Incident"
          onClick={createRandomIncident}
        />
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
