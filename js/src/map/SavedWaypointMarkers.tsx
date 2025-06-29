import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { usePlaceStore } from "@/store/usePlaceStore";

const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

/**
 * SavedWaypointMarkers shows all saved waypoints from Zustand on the map with popups.
 */
export function SavedWaypointMarkers() {
  const waypoints = usePlaceStore((s) => s.savedWaypoints);

  return (
    <>
      {waypoints.map((wp) => (
        <Marker key={wp.id} position={wp.location} icon={customIcon}>
          <Popup>
            <div className="text-sm leading-tight">
              <strong>{wp.name}</strong>
              <br />
              Type: {wp.type}
              <br />
              {wp.description && (
                <>
                  Description: {wp.description}
                  <br />
                </>
              )}
              {wp.telephone && (
                <>
                  Phone: {wp.telephone}
                  <br />
                </>
              )}
              Available: {wp.isAvailable ? "Yes" : "No"}
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
}
