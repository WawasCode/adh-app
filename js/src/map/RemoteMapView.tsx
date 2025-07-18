import { useMapStore } from "@/store/useMapStore";
import { UserMarker } from "./UserMarker";
import { MapContainer, useMap, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { ButtonHTMLAttributes, useEffect, useState } from "react";
import { cn } from "~/lib/utils";
import { SavedWaypointMarkers } from "@/map/SavedWaypointMarkers";
import { SavedHazardZones } from "@/map/SavedHazardZones";
import { waypointMarkerIcon } from "@/utils/customMarkerIcon";
import { useLocationStore } from "@/store/useLocationStore";
import VectorTileLayer from "react-leaflet-vector-tile-layer";
import { useWaypointStore } from "@/store/useWaypointDisplayStore";
import { useHazardZoneStore } from "@/store/useHazardZoneDisplayStore";
import { SavedHazardIncidents } from "./SavedHazardIncidents";
import { useIncidentStore } from "@/store/useIncidentDisplayStore";
import { useSlidingCardStore } from "@/store/useSlidingCardStore";
import { CENTER } from "@/constants";
import { LatLngTuple } from "leaflet";
import { calculateDistance } from "@/utils/geoUtils";
import { PhotonPlace } from "@/types/photon";

const ZOOM = 10;
const MIN_ZOOM = 0; // Vector tiles start at zoom 0
const MAX_ZOOM = 18; // High detail vector tiles end at zoom 18

const BOUNDS: [[number, number], [number, number]] = [
  [47.26543, 5.864417],
  [55.14777, 15.05078],
];
/**
 * MapSetter registers the Leaflet map instance in the Zustand store
 * so that it can be accessed throughout the application.
 */
function MapSetter() {
  const map = useMap();
  const setMap = useMapStore((s) => s.setMap);

  useEffect(() => {
    setMap(map);
  }, [map, setMap]);

  return null;
}

interface RemoteMapViewProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  center?: [number, number];
  selectedLocation?: { place: PhotonPlace; name: string };
}

// Helper component to change map view when location changes
function ChangeMapView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 15);
  }, [center, map]);
  return null;
}

/**
 * MapClickHandler clears the selected waypoint when the map is clicked.
 */
const MapClickHandler = () => {
  const { clearData } = useSlidingCardStore();

  useMapEvents({
    click: (e) => {
      const target = e.originalEvent.target;

      if (target instanceof HTMLElement) {
        if (!target.classList.contains("leaflet-interactive")) {
          clearData();
        }
      }
    },
  });

  return null;
};

/**
 * RemoteMapView renders the main map background.
 * It includes saved waypoints, hazard zones, and the user's location.
 */
export function RemoteMapView({ className }: RemoteMapViewProps) {
  const base = "map-container";
  const fetchWaypoints = useWaypointStore((s) => s.fetchWaypoints);
  const fetchHazardZones = useHazardZoneStore((s) => s.fetchHazardZones);
  const fetchIncidents = useIncidentStore((s) => s.fetchIncidents);
  const currentPosition = useLocationStore((s) => s.position);
  const { setData } = useSlidingCardStore();
  const { selectedLocation } = useMapStore();
  const [mapCenter, setMapCenter] = useState<[number, number]>(
    currentPosition || CENTER,
  );
  const [isLoading, setIsLoading] = useState<boolean>(!currentPosition);

  useEffect(() => {
    fetchWaypoints();
  }, [fetchWaypoints]);

  useEffect(() => {
    fetchHazardZones();
  }, [fetchHazardZones]);

  useEffect(() => {
    fetchIncidents();
  }, [fetchIncidents]);

  const handleMarkerClick = (
    place: PhotonPlace,
    coords: LatLngTuple | null,
  ) => {
    if (currentPosition && coords) {
      const distance = calculateDistance(currentPosition as [number, number], [
        coords[0],
        coords[1],
      ]);
      setData({ ...place, distance });
    } else {
      setData(place);
    }
  };

  useEffect(() => {
    if (currentPosition) {
      setMapCenter(currentPosition);
      setIsLoading(false);
    }
  }, [currentPosition]);

  useEffect(() => {
    if (
      selectedLocation &&
      (mapCenter[0] !== selectedLocation.place.coords[0] ||
        mapCenter[1] !== selectedLocation.place.coords[1])
    ) {
      setMapCenter(selectedLocation.place.coords);
    }
  }, [mapCenter, selectedLocation]);

  if (isLoading) {
    return <div>Loading map...</div>;
  }

  return (
    <div className={cn(base, className)}>
      {/* Ensure the map container fills the parent */}
      <MapContainer
        style={{ height: "100%", width: "100%" }}
        center={currentPosition || mapCenter}
        zoom={ZOOM}
        minZoom={MIN_ZOOM}
        maxZoom={MAX_ZOOM}
        maxBounds={BOUNDS}
        maxBoundsViscosity={1}
        zoomControl={false}
      >
        <VectorTileLayer
          styleUrl="/api/styles/osm-bright-local.json"
          maxZoom={MAX_ZOOM}
        />
        {selectedLocation && (
          <>
            <ChangeMapView center={mapCenter} />
            <Marker
              position={selectedLocation.place.coords}
              icon={waypointMarkerIcon}
              eventHandlers={{
                click: () =>
                  handleMarkerClick(
                    selectedLocation.place,
                    selectedLocation.place.coords,
                  ),
              }}
            />
          </>
        )}
        <UserMarker />
        <SavedHazardZones />
        <SavedHazardIncidents />
        <SavedWaypointMarkers />
        <MapSetter />
        <MapClickHandler />
      </MapContainer>
    </div>
  );
}
