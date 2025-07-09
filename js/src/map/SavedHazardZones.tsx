import { Polygon, Popup } from "react-leaflet";
import { useHazardZoneStore } from "@/store/useHazardZoneStore";

function getZoneColor(severity: string | undefined): string {
  switch (severity) {
    case "low":
      return "#ca8a04";
    case "medium":
      return "#f97316";
    case "high":
      return "#ef4444";
    case "critical":
      return "#b91c1c";
    default:
      return "#6b7280";
  }
}

/**
 * SavedHazardZones renders hazard zones fetched from the backend.
 */
export function SavedHazardZones() {
  const hazardZones = useHazardZoneStore((s) => s.savedHazardZones);
  console.log("Rendering SavedHazardZones:", hazardZones);
  return (
    <>
      {hazardZones.map((zone) => {
        console.log("Zone", zone.name, "Koordinaten:", zone.coordinates);
        return (
          <Polygon
            key={zone.id}
            positions={zone.coordinates as [number, number][]}
            pathOptions={{
              color: getZoneColor(zone.severity),
              fillColor: getZoneColor(zone.severity),
              fillOpacity: 0.4,
            }}
          >
            <Popup>
              <div className="text-sm leading-tight">
                <strong>{zone.name}</strong>
                <br />
                Severity: {zone.severity || "unknown"}
                {zone.description && (
                  <>
                    <br />
                    {zone.description}
                  </>
                )}
                {zone.isWalkable !== undefined && (
                  <>
                    <br />
                    Walkable: {zone.isWalkable ? "Yes" : "No"}
                  </>
                )}
                {zone.isDrivable !== undefined && (
                  <>
                    <br />
                    Drivable: {zone.isDrivable ? "Yes" : "No"}
                  </>
                )}
              </div>
            </Popup>
          </Polygon>
        );
      })}
    </>
  );
}
