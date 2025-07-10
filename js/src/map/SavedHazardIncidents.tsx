import { Marker, Popup } from "react-leaflet";
import { incidentMarkerIcon } from "@/utils/customMarkerIcon";
import { useIncidentStore } from "@/store/useIncidentStore";
import { LatLngTuple } from "leaflet";

// Funktion zum Parsen von WKT-Punkt
function parseWKTPoint(wkt: string): [number, number] | null {
  const cleaned = wkt.replace(/^SRID=\d+;/, "").trim();
  const match = cleaned.match(/POINT\s*\(\s*([-\d.]+)\s+([-\d.]+)\s*\)/);
  if (!match) return null;
  const [, lng, lat] = match; // ← Richtige Reihenfolge!
  return [parseFloat(lat), parseFloat(lng)]; // ← [lat, lon]
}

/**
 * SavedIncidents renders all incidents from the backend on the map.
 */
export function SavedHazardIncidents() {
  const incidents = useIncidentStore((s) => s.incidents);

  console.log("📍 incidents in SavedHazardIncidents:", incidents);
  return (
    <>
      {incidents.map((incident) => {
        const coords: LatLngTuple | null =
          typeof incident.location === "string"
            ? parseWKTPoint(incident.location)
            : incident.location?.coordinates
              ? [
                  incident.location.coordinates[1],
                  incident.location.coordinates[0],
                ]
              : null;

        if (!coords) {
          console.warn(
            "⚠️ Koordinaten konnten nicht geparst werden für Incident:",
            incident,
          );
          return null;
        }

        return (
          <Marker key={incident.id} position={coords} icon={incidentMarkerIcon}>
            <Popup>
              <div className="text-sm leading-tight space-y-1">
                <strong>{incident.name}</strong>
                {incident.severity && <div>Severity: {incident.severity}</div>}
                {incident.description && (
                  <div>Description: {incident.description}</div>
                )}
                {incident.distance && <div>Distance: {incident.distance}</div>}
              </div>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
}
