import { useMapStore } from "@/store/useMapStore";
import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { UserMarker } from "./UserMarker";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { ButtonHTMLAttributes } from "react";
import { cn } from "~/lib/utils";
import { SavedWaypointMarkers } from "@/map/SavedWaypointMarkers";
import { SavedHazardZones } from "@/map/SavedHazardZones";

const CENTER: [number, number] = [52.52, 13.405]; // Berlin
const ZOOM = 10;
const MAX_ZOOM = 19;

const BOUNDS: [[number, number], [number, number]] = [
  [47.26543, 5.864417],
  [55.14777, 15.05078],
];
/**
 * MapSetter registers the Leaflet map instance in the Zustand store
 * so that it can be accessed throughout the application.
 */
function MapSetter() {
  const map = useMap();
  const setMap = useMapStore((s) => s.setMap);

  useEffect(() => {
    setMap(map);
  }, [map, setMap]);

  return null;
}

/**
 * RemoteMapView renders the main map background.
 * It includes saved waypoints, hazard zones, and the user's location.
 */
export function RemoteMapView({
  className,
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  const base = "map-container";
  return (
    <div className={cn(base, className)}>
      <MapContainer
        style={{ height: "100%", width: "100%" }}
        center={CENTER}
        zoom={ZOOM}
        maxZoom={MAX_ZOOM}
        maxBounds={BOUNDS}
        maxBoundsViscosity={1}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
          maxZoom={MAX_ZOOM}
        />
        <UserMarker />
        <SavedHazardZones />
        <SavedWaypointMarkers />
        <MapSetter />
      </MapContainer>
    </div>
  );
}

/** 
 * 
 * import { useEffect, useState } from "react";
// ...existing imports...

export function RemoteMapView({ className }: ButtonHTMLAttributes<HTMLButtonElement>) {
  const base = "map-container";
  const [hazardZones, setHazardZones] = useState<
    { id: string; coords: LatLngTuple[]; name: string }[]
  >([]);

  useEffect(() => {
    // Replace with your actual API endpoint
    fetch("/api/hazard-zones")
      .then((res) => res.json())
      .then((data) => setHazardZones(data));
  }, []);

  return (
    <div className={cn(base, className)}>
      <MapContainer
        // ...existing props...
      >
        <TileLayer
          // ...existing props...
        />
        {hazardZones.map((zone) => (
          <Polygon
            key={zone.id}
            positions={zone.coords}
            pathOptions={{ color: "red", fillColor: "red", fillOpacity: 0.4 }}
          >
            <Popup>{zone.name}</Popup>
          </Polygon>
        ))}
        <UserMarker />
        <MapSetter />
      </MapContainer>
    </div>
  );
}
*/
