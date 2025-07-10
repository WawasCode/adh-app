import {
  MapContainer,
  TileLayer,
  useMapEvents,
  Polygon,
  Marker,
} from "react-leaflet";
import { useZoneStore } from "@/store/useZoneStore";
import { useLocationStore } from "@/store/useLocationStore";
import "leaflet/dist/leaflet.css";
import { UserMarker } from "@/map/UserMarker";
import { customMarkerIcon } from "@/utils/customMarkerIcon";

/**
 * MapClickHandler captures click coordinates and stores them in useZoneStore.
 */
function MapClickHandler() {
  const addPoint = useZoneStore((s) => s.addPoint);
  const points = useZoneStore((s) => s.points);
  const setMaxPointsReached = useZoneStore((s) => s.setMaxPointsReached);

  useMapEvents({
    click(e) {
      if (points.length >= 8) {
        setMaxPointsReached(true);
        return;
      }
      const { lat, lng } = e.latlng;
      addPoint([lat, lng]);
    },
  });

  return null;
}

/**
 * RemoteZoneMapWithClicks renders a map that lets the user define a zone
 * by placing 3 to 8 points via map clicks. The points form a Polygon.
 */
export default function RemoteZoneMapWithClicks() {
  const points = useZoneStore((s) => s.points);
  const gps = useLocationStore((s) => s.position);
  const DEFAULT_CENTER: [number, number] = [52.52, 13.405]; // fallback: Berlin

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
      <MapClickHandler />
      {points.map((pos, i) => (
        <Marker key={i} position={pos} icon={customMarkerIcon} />
      ))}
      {points.length >= 3 && (
        <Polygon positions={points} pathOptions={{ color: "red" }} />
      )}
    </MapContainer>
  );
}
