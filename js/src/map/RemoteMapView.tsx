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
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { theme } from "~/styles/theme";
import L from "leaflet";
import { useLocationStore } from "@/store/useLocationStore";

// Leaflet Marker is bugged
const customMarkerIcon = new L.Icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [theme.mapMarker.iconSize.width, theme.mapMarker.iconSize.height],
  iconAnchor: [theme.mapMarker.iconAnchor.x, theme.mapMarker.iconAnchor.y],
  popupAnchor: [theme.mapMarker.popupAnchor.x, theme.mapMarker.popupAnchor.y],
  shadowSize: [
    theme.mapMarker.shadowSize.width,
    theme.mapMarker.shadowSize.height,
  ],
});

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
 * It includes a user marker and sets the map instance in the store via MapSetter.
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
        <MapSetter />
      </MapContainer>
    </div>
  );
}
