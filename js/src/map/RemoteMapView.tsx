import { useMapStore } from "@/store/useMapStore";
import { UserMarker } from "./UserMarker";
import {
  MapContainer,
  TileLayer,
  useMap,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { ButtonHTMLAttributes, useEffect, useState } from "react";
import { cn } from "~/lib/utils";
import { SavedWaypointMarkers } from "@/map/SavedWaypointMarkers";
import { SavedHazardZones } from "@/map/SavedHazardZones";
import { customMarkerIcon } from "@/utils/customMarkerIcon";
import L from "leaflet";
import { useLocationStore } from "@/store/useLocationStore";
import { MapClickHandler } from "./MapClickHandler";

const DEFAULT_CENTER: [number, number] = [52.52, 13.405]; // Berlin
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

function LongClickHandler({
  onLongClick,
}: {
  onLongClick: (latlng: L.LatLng) => void;
}) {
  const map = useMap();

  useMapEvents({
    contextmenu: (e) => {
      onLongClick(e.latlng);
      map.flyTo(e.latlng, 15);
    },
  });

  return null;
}

/**
 * RemoteMapView renders the main map background.
 * It includes saved waypoints, hazard zones, and the user's location.
 */
export function RemoteMapView({
  className,
  selectedLocation,
}: RemoteMapViewProps) {
  const base = "map-container";

  const position = useLocationStore((s) => s.position);

  const [marker, setMarker] = useState<{
    position: [number, number];
    name?: string;
  } | null>(null);

  const [mapCenter, setMapCenter] = useState<[number, number]>(
    position || DEFAULT_CENTER,
  );
  const [isLoading, setIsLoading] = useState<boolean>(!position);

  useEffect(() => {
    if (position) {
      setMapCenter(position);
      setIsLoading(false);
    }
  }, [position]);

  const handleLongClick = async (latlng: L.LatLng) => {
    const { lat, lng } = latlng;
    setMarker({
      position: [lat, lng],
    });
    console.log("Long click at:", lat, lng);
  };

  useEffect(() => {
    if (
      selectedLocation &&
      (mapCenter[0] !== selectedLocation.lat ||
        mapCenter[1] !== selectedLocation.lon)
    ) {
      setMapCenter([selectedLocation.lat, selectedLocation.lon]);
    }
  }, [mapCenter, selectedLocation]);

  if (isLoading) {
    return <div>Loading map...</div>;
  }

  return (
    <div className={cn(base, className)}>
      {/* Ensure the map container fills the parent */}
      <MapContainer
        style={{ height: "100%", width: "100%" }}
        center={position || mapCenter}
        zoom={ZOOM}
        maxZoom={MAX_ZOOM}
        maxBounds={BOUNDS}
        maxBoundsViscosity={1}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          maxZoom={MAX_ZOOM}
        />
        {selectedLocation && (
          <>
            <ChangeMapView center={mapCenter} />
            <Marker
              position={[selectedLocation.lat, selectedLocation.lon]}
              icon={customMarkerIcon}
            >
              {selectedLocation.name && <Popup>{selectedLocation.name}</Popup>}
            </Marker>
          </>
        )}
        <LongClickHandler onLongClick={handleLongClick} />
        {marker && (
          <Marker position={marker.position} icon={customMarkerIcon}>
            {marker.name && <Popup>{marker.name}</Popup>}
          </Marker>
        )}
        <UserMarker />
        <SavedHazardZones />
        <SavedWaypointMarkers />
        <MapSetter />
        <MapClickHandler />
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
        <SavedHazardZones />
        <SavedWaypointMarkers />
        <MapSetter />
      </MapContainer>
    </div>
  );
}
*/
