import { MapContainer, useMapEvents, Marker } from "react-leaflet";
import { useWaypointStore } from "@/store/useWaypointCreationStore";
import { useLocationStore } from "@/store/useLocationStore";
import { UserMarker } from "@/map/UserMarker";
import { waypointMarkerIcon } from "@/utils/customMarkerIcon";
import "leaflet/dist/leaflet.css";
import { useMap } from "react-leaflet";
import { useEffect } from "react";
import { useMapStore } from "@/store/useMapStore";
import VectorTileLayer from "react-leaflet-vector-tile-layer";
import { CENTER } from "@/constants";

function StoreMapInZustand() {
  const map = useMap();
  const setMap = useMapStore((s) => s.setMap);

  useEffect(() => {
    setMap(map);
  }, [map, setMap]);

  return null;
}

/**
 * MapClickHandler allows the user to click on the map
 * and saves the selected coordinates in Zustand.
 */
function MapClickHandler() {
  const setWaypointField = useWaypointStore((s) => s.setWaypointField);

  useMapEvents({
    click(e) {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;
      setWaypointField("location", [lat, lng]);
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
  const location = useWaypointStore((s) => s.waypointInput.location);
  const position = useLocationStore((s) => s.position);

  return (
    <MapContainer
      center={position ?? CENTER}
      zoom={13} // Default zoom for selecting locations
      style={{ height: "100%", width: "100%" }}
      zoomControl={false}
    >
      <VectorTileLayer styleUrl="http://localhost:8080/api/styles/osm-bright-local.json" />
      <StoreMapInZustand />
      <UserMarker />
      <MapClickHandler />
      {location && <Marker position={location} icon={waypointMarkerIcon} />}
    </MapContainer>
  );
}
