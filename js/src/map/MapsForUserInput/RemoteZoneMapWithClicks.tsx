import { MapContainer, useMapEvents, Polygon, Marker } from "react-leaflet";
import { useZoneStore } from "@/store/useHazardZoneCreationStore";
import { useLocationStore } from "@/store/useLocationStore";
import "leaflet/dist/leaflet.css";
import { UserMarker } from "@/map/UserMarker";
import { waypointMarkerIcon } from "@/utils/customMarkerIcon";
import VectorTileLayer from "react-leaflet-vector-tile-layer";
import { CENTER } from "@/constants";

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

  return (
    <MapContainer
      center={gps ?? CENTER}
      zoom={13}
      style={{ height: "100%", width: "100%" }}
      zoomControl={false}
    >
      <VectorTileLayer styleUrl="http://localhost:8080/api/styles/osm-bright-local.json" />
      <UserMarker />
      <MapClickHandler />
      {points.map((pos, i) => (
        <Marker key={i} position={pos} icon={waypointMarkerIcon} />
      ))}
      {points.length >= 3 && (
        <Polygon positions={points} pathOptions={{ color: "red" }} />
      )}
    </MapContainer>
  );
}
