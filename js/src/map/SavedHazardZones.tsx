import { Polygon, Popup } from "react-leaflet";
import { useZoneStore } from "@/store/useZoneStore";

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
          pathOptions={{ color: "red", fillColor: "red", fillOpacity: 0.4 }}
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
            </div>
          </Popup>
        </Polygon>
      ))}
    </>
  );
}
