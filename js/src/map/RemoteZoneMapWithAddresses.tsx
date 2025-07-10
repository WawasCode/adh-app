import { MapContainer, TileLayer, Polygon, Marker } from "react-leaflet";
import { useZoneStore } from "@/store/useZoneStore";
import { useLocationStore } from "@/store/useLocationStore";
import { UserMarker } from "@/map/UserMarker";
import "leaflet/dist/leaflet.css";
import { customMarkerIcon } from "@/utils/customMarkerIcon";

/**
 * RemoteZoneMapWithAddresses renders a map that displays zone points
 * added via address search (no click interaction).
 */
export default function RemoteZoneMapWithAddresses() {
  const points = useZoneStore((s) => s.points);
  const gps = useLocationStore((s) => s.position);
  const DEFAULT_CENTER: [number, number] = [52.52, 13.405];

  return (
    <MapContainer
      center={gps ?? DEFAULT_CENTER}
      zoom={13}
      style={{ height: "100%", width: "100%" }}
      zoomControl={false}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <UserMarker />
      {points.map((pos, i) => (
        <Marker key={i} position={pos} icon={customMarkerIcon} />
      ))}
      {points.length >= 3 && (
        <Polygon positions={points} pathOptions={{ color: "red" }} />
      )}
    </MapContainer>
  );
}
