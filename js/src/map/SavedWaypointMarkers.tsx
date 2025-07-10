import { Marker, Popup } from "react-leaflet";
import { useWaypointStore, Waypoint } from "@/store/useWaypointStore";
import { LatLngTuple } from "leaflet";
import { useSlidingCardStore } from "@/store/useSlidingCardStore";
import { calculateDistance } from "@/utils/geoUtils";
import { useLocationStore } from "@/store/useLocationStore";
import { customMarkerIcon } from "@/utils/customMarkerIcon";

// Funktion zum Parsen von WKT-POLYGON (auslagern)
function parseWKTPoint(wkt: string): [number, number] | null {
  const cleaned = wkt.replace(/^SRID=\d+;/, "").trim();
  const match = cleaned.match(/POINT\s*\(\s*([-\d.]+)\s+([-\d.]+)\s*\)/);
  if (!match) return null;
  const [, lng, lat] = match;
  return [parseFloat(lat), parseFloat(lng)];
}

/**
 * SavedWaypointMarkers renders all saved waypoints from the backend on the map.
 */
export function SavedWaypointMarkers() {
  const waypoints = useWaypointStore((s) => s.waypoints);
  const { setWaypoint } = useSlidingCardStore();
  const currentPosition = useLocationStore((state) => state.position);

  const handleMarkerClick = (wp: Waypoint) => {
    console.log("Marker clicked:", wp);
    if (currentPosition && wp.location) {
      const distance = calculateDistance(
        currentPosition,
        wp.location.coordinates,
      );
      setWaypoint({ ...wp, distance });
    } else {
      setWaypoint(wp);
    }
  };

  return (
    <>
      {waypoints.map((wp) => {
        const coords: LatLngTuple | null =
          typeof wp.location === "string"
            ? parseWKTPoint(wp.location)
            : wp.location?.coordinates
              ? [wp.location.coordinates[1], wp.location.coordinates[0]]
              : null;

        if (!coords) return null;

        console.log("wp.name:", wp.name);
        console.log("wp.location:", wp.location);
        console.log("coords nach parse:", coords);

        return (
          <Marker
            key={wp.id}
            position={coords}
            icon={customMarkerIcon}
            eventHandlers={{
              click: () => handleMarkerClick(wp),
            }}
          >
            <Popup>
              <div className="text-sm leading-tight space-y-1">
                <strong>{wp.name}</strong>
                {wp.type && <div>Type: {wp.type}</div>}
                {wp.description && <div>Description: {wp.description}</div>}
                {wp.telephone && <div>Phone: {wp.telephone}</div>}
                {typeof wp.isAvailable === "boolean" && (
                  <div>Available: {wp.isAvailable ? "Yes" : "No"}</div>
                )}
              </div>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
}
