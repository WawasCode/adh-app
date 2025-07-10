import { MapContainer, TileLayer, useMapEvents, Marker } from "react-leaflet";
import { usePlaceStore } from "@/store/usePlaceStore";
import { useLocationStore } from "@/store/useLocationStore";
import { UserMarker } from "@/map/UserMarker";
import { customMarkerIcon } from "@/utils/customMarkerIcon";
import "leaflet/dist/leaflet.css";

/**
 * Default center fallback (Berlin) if GPS is unavailable
 */
const CENTER: [number, number] = [52.52, 13.405];

/**
 * MapClickHandler allows the user to click on the map
 * and saves the selected coordinates in Zustand.
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
 * RemoteMapViewWithClick renders a Leaflet map
 * that lets the user set a location marker by clicking.
 * The selected location is stored in Zustand (usePlaceStore).
 */
export default function RemoteMapViewWithClick() {
  const location = usePlaceStore((s) => s.location);
  const position = useLocationStore((s) => s.position);

  return (
    <MapContainer
      center={position ?? CENTER}
      zoom={13} // Default zoom for selecting locations
      style={{ height: "100%", width: "100%" }}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <UserMarker />
      <MapClickHandler />
      {location && <Marker position={location} icon={customMarkerIcon} />}
    </MapContainer>
  );
}
