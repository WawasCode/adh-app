import { Polygon, Popup } from "react-leaflet";
import { useZoneStore } from "@/store/useZoneStore";

function getZoneColor(severity: string): string {
  switch (severity) {
    case "low":
      return "#ca8a04"; // yellow
    case "medium":
      return "#f97316"; // orange
    case "high":
      return "#ef4444"; // red
    case "critical":
      return "#b91c1c"; // red-700
    default:
      return "#6b7280"; // gray-500 fallback
  }
}

/**
 * SavedHazardZones renders all saved hazard zones as red polygons on the map.
 * It includes a popup with zone details: name, description and severity.
 */
export function SavedHazardZones() {
  const hazardZones = useZoneStore((s) => s.savedHazardZones);

  return (
    <>
      {hazardZones.map((zone) => (
        <Polygon
          key={zone.id}
          positions={zone.coordinates}
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
              Severity: {zone.severity}
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
      ))}
    </>
  );
}
