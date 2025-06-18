import { useMapStore } from "@/store/useMapStore";
import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { UserMarker } from "./UserMarker";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { ButtonHTMLAttributes } from "react";
import { cn } from "~/lib/utils";

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

/*
 * MapView component renders a Leaflet map using remote raster tiles.
 * The tiles are served from OpenStreetMap.
 * It includes a user marker and sets the map instance in the store via MapSetter.
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
        <MapSetter />
      </MapContainer>
    </div>
  );
}
