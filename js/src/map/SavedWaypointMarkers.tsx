import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useWaypointStore } from "@/store/useWaypointStore";

/**
 * SavedWaypointMarkers renders all saved waypoints from the backend on the map.
 * Each marker includes a popup with the waypoint's details.
 */
const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export function SavedWaypointMarkers() {
  const waypoints = useWaypointStore((s) => s.waypoints);

  console.log("WAYPOINTS aus Zustand:", waypoints);

  return (
    <>
      {waypoints.map((wp) =>
        wp.location?.coordinates ? (
          <Marker
            key={wp.id}
            position={[wp.location.coordinates[1], wp.location.coordinates[0]]}
            icon={customIcon}
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
        ) : null,
      )}
    </>
  );
}
