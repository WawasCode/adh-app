import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { usePlaceStore } from "@/store/usePlaceStore";

/**
 * SavedWaypointMarkers renders all saved waypoints from Zustand on the map.
 * Each marker includes a popup with the waypoint's details.
 */
const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export function SavedWaypointMarkers() {
  const waypoints = usePlaceStore((s) => s.savedWaypoints);

  return (
    <>
      {waypoints.map((wp) => (
        <Marker key={wp.id} position={wp.location} icon={customIcon}>
          <Popup>
            <div className="text-sm leading-tight space-y-1">
              <strong>{wp.name}</strong>
              <div>Type: {wp.type}</div>
              {wp.description && <div>Description: {wp.description}</div>}
              {wp.telephone && <div>Phone: {wp.telephone}</div>}
              <div>Available: {wp.isAvailable ? "Yes" : "No"}</div>
              {/* TODO: Add distance to GPS position */}
              {/* TODO: Add createdAt timestamp */}
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
}
