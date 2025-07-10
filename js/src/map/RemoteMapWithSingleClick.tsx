import { MapContainer, TileLayer, useMapEvents, Marker } from "react-leaflet";
import { UserMarker } from "@/map/UserMarker";
import { usePlaceStore } from "@/store/usePlaceStore";
import { useLocationStore } from "@/store/useLocationStore";
import "leaflet/dist/leaflet.css";
import { customMarkerIcon } from "@/utils/customMarkerIcon";

const CENTER: [number, number] = [52.52, 13.405];

/**
 * MapClickHandler saves the clicked point to Zustand via usePlaceStore
 */
function MapClickHandler() {
  const setLocation = usePlaceStore((s) => s.setLocation);

  useMapEvents({
    click(e) {
      const lat = e.latlng.lat;
      const lon = e.latlng.lng;
      setLocation([lat, lon]);
    },
  });

  return null;
}

/**
 * RemoteMapViewWithSingleClick renders a Leaflet map
 * where a single point can be selected and saved into Zustand (usePlaceStore).
 */
export default function RemoteMapViewWithSingleClick() {
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
