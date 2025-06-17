import { MapContainer, TileLayer, useMap, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { ButtonHTMLAttributes, useEffect } from "react";
import { cn } from "~/lib/utils";

const DEFAULT_CENTER: [number, number] = [52.52, 13.405]; // Berlin
const ZOOM = 10;
const MAX_ZOOM = 19;

const BOUNDS: [[number, number], [number, number]] = [
  [47.26543, 5.864417],
  [55.14777, 15.05078],
];

interface RemoteMapViewProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  center?: [number, number];
  selectedLocation?: { lat: number; lon: number; name?: string };
}

// Helper component to change map view when location changes
function ChangeMapView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 15);
  }, [center, map]);
  return null;
}

/*
 * MapView component renders a Leaflet map using remote raster tiles.
 * The tiles are served from OpenStreetMap.
 */
export function RemoteMapView({
  className,
  selectedLocation,
}: RemoteMapViewProps) {
  const base = "map-container";
  return (
    <div className={cn(base, className)}>
      <MapContainer
        style={{ height: "100%", width: "100%" }}
        center={DEFAULT_CENTER}
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
        {selectedLocation && (
          <>
            <ChangeMapView
              center={[selectedLocation.lat, selectedLocation.lon]}
            />
            <Marker position={[selectedLocation.lat, selectedLocation.lon]}>
              {selectedLocation.name && <Popup>{selectedLocation.name}</Popup>}
            </Marker>
          </>
        )}
      </MapContainer>
    </div>
  );
}
