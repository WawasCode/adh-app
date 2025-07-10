import { MapContainer, TileLayer, useMapEvents, Marker } from "react-leaflet";
import { UserMarker } from "@/map/UserMarker";
import { usePlaceStore } from "@/store/usePlaceStore";
import { useLocationStore } from "@/store/useLocationStore";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const CENTER: [number, number] = [52.52, 13.405];

function MapClickHandler() {
  const setHazardField = usePlaceStore((s) => s.setHazardField);

  useMapEvents({
    click(e) {
      const lat = e.latlng.lat;
      const lon = e.latlng.lng;
      setHazardField("location", [lat, lon]);
    },
  });

  return null;
}

export default function RemoteMapViewWithSingleClick() {
  const location = usePlaceStore((s) => s.hazardInput.location);
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
