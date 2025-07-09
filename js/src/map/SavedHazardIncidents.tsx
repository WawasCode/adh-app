import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useIncidentStore } from "@/store/useIncidentStore";
import { LatLngTuple } from "leaflet";

// Funktion zum Parsen von WKT-Punkt
function parseWKTPoint(wkt: string): [number, number] | null {
  const cleaned = wkt.replace(/^SRID=\d+;/, "").trim();
  const match = cleaned.match(/POINT\s*\(\s*([-\d.]+)\s+([-\d.]+)\s*\)/);
  if (!match) return null;
  const [, lat, lon] = match;
  return [parseFloat(lat), parseFloat(lon)];
}

// Custom Marker-Icon
const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

/**
 * SavedIncidents renders all incidents from the backend on the map.
 */
export function SavedIncidents() {
  const incidents = useIncidentStore((s) => s.incidents);

  console.log("INCIDENTS aus Zustand:", incidents);

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

        if (!coords) return null;

        console.log("incident.name:", incident.name);
        console.log("incident.location:", incident.location);
        console.log("coords nach parse:", coords);

        return (
          <Marker key={incident.id} position={coords} icon={customIcon}>
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
