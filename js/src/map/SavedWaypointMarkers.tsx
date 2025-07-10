import { Marker } from "react-leaflet";
import { usePlaceStore, Waypoint } from "@/store/usePlaceStore";
import { useSlidingCardStore } from "@/store/useSlidingCardStore";
import { calculateDistance } from "@/utils/geoUtils";
import { useLocationStore } from "@/store/useLocationStore";
import { customMarkerIcon } from "@/utils/customMarkerIcon";

/**
 * SavedWaypointMarkers renders all saved waypoints from Zustand on the map.
 * Each marker includes a popup with the waypoint's details.
 */

export function SavedWaypointMarkers() {
  console.log("Component rendered");
  const waypoints = usePlaceStore((state) => state.savedWaypoints);
  const { setWaypoint } = useSlidingCardStore();
  const currentPosition = useLocationStore((state) => state.position);

  const handleMarkerClick = (wp: Waypoint) => {
    console.log("Marker clicked:", wp);
    if (currentPosition) {
      const distance = calculateDistance(currentPosition, wp.location);
      setWaypoint({ ...wp, distance });
    } else {
      setWaypoint(wp);
    }
  };

  return (
    <>
      {waypoints.map((wp) => (
        <Marker
          key={wp.id}
          position={wp.location}
          icon={customMarkerIcon}
          eventHandlers={{
            click: () => handleMarkerClick(wp),
          }}
        />
      ))}
    </>
  );
}
