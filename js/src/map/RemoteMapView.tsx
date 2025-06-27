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
import L from "leaflet";

// Leaflet Marker is bugged
const customMarkerIcon = new L.Icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const DEFAULT_CENTER: [number, number] = [52.52, 13.405]; // Berlin should be the users location
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
 */
export function RemoteMapView({
  className,
  selectedLocation,
}: RemoteMapViewProps) {
  const base = "map-container";

  const [marker, setMarker] = useState<{
    position: [number, number];
    name?: string;
  } | null>(null);

  const [mapCenter, setMapCenter] = useState<[number, number]>(DEFAULT_CENTER);

  const handleLongClick = async (latlng: L.LatLng) => {
    const { lat, lng } = latlng;
    setMarker({
      position: [lat, lng],
    });
    console.log("Long click at:", lat, lng);
  };

  if (
    selectedLocation &&
    (mapCenter[0] !== selectedLocation.lat ||
      mapCenter[1] !== selectedLocation.lon)
  ) {
    setMapCenter([selectedLocation.lat, selectedLocation.lon]);
  }

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
      </MapContainer>
    </div>
  );
}
