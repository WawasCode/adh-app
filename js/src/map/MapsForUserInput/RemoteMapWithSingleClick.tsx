import { MapContainer, useMapEvents, Marker } from "react-leaflet";
import { UserMarker } from "@/map/UserMarker";
import { useIncidentStore } from "@/store/useIncidentCreationStore";
import { useLocationStore } from "@/store/useLocationStore";
import "leaflet/dist/leaflet.css";
import { incidentMarkerIcon } from "@/utils/customMarkerIcon";
import { useMapStore } from "@/store/useMapStore";
import { useMap } from "react-leaflet";
import { useEffect } from "react";
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

function MapClickHandler() {
  const setHazardField = useIncidentStore((s) => s.setHazardField);

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
  const location = useIncidentStore((s) => s.hazardInput.location);
  const position = useLocationStore((s) => s.position);

  return (
    <MapContainer
      center={position ?? CENTER}
      zoom={13}
      style={{ height: "100%", width: "100%" }}
      zoomControl={false}
    >
      <VectorTileLayer styleUrl="/api/styles/osm-bright-local.json" />
      <UserMarker />
      <MapClickHandler />
      <StoreMapInZustand />
      {location && <Marker position={location} icon={incidentMarkerIcon} />}
    </MapContainer>
  );
}
