import { MapContainer, TileLayer, useMapEvents, Marker } from "react-leaflet";
import { usePlaceStore } from "@/store/usePlaceStore";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { UserMarker } from "@/map/UserMarker";
import { useLocationStore } from "@/store/useLocationStore";

// Marker-Icon
const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const CENTER: [number, number] = [52.52, 13.405]; // z.B. Berlin

/**
 * MapClickHandler allows user to click on the map and store coordinates in Zustand.
 */
function MapClickHandler() {
  const setLocation = usePlaceStore((s) => s.setLocation);

  useMapEvents({
    click(e) {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;
      setLocation([lat, lng]);
    },
  });

  return null;
}

/**
 * RemoteMapViewWithClick renders the map and lets the user place a marker by clicking.
 * The selected location is saved in Zustand (usePlaceStore).
 */
export default function RemoteMapViewWithClick() {
  const location = usePlaceStore((s) => s.location);
  const position = useLocationStore((s) => s.position);

  return (
    <MapContainer
      center={position ?? CENTER}
      zoom={13}
      style={{ height: "100%", width: "100%" }}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <UserMarker />
      <MapClickHandler />
      {location && <Marker position={location} icon={customIcon} />}
    </MapContainer>
  );
}
