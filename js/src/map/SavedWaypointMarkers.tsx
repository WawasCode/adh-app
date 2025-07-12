import { Marker } from "react-leaflet";
import { useWaypointStore } from "@/store/useWaypointDisplayStore";
import { Waypoint } from "@/types/waypoint";
import { LatLngTuple } from "leaflet";
import { useSlidingCardStore } from "@/store/useSlidingCardStore";
import { calculateDistance, parseWKTPoint } from "@/utils/geoUtils";
import { useLocationStore } from "@/store/useLocationStore";
import { waypointMarkerIcon } from "@/utils/customMarkerIcon";

/**
 * SavedWaypointMarkers renders all saved waypoints from the backend on the map.
 */
export function SavedWaypointMarkers() {
  const waypoints = useWaypointStore((s) => s.waypoints);
  const { setData } = useSlidingCardStore();
  const currentPosition = useLocationStore((state) => state.position);

  const handleMarkerClick = (wp: Waypoint, coords: LatLngTuple | null) => {
    if (currentPosition && coords) {
      const distance = calculateDistance(currentPosition as [number, number], [
        coords[0],
        coords[1],
      ]);
      setData({ ...wp, distance });
    } else {
      setData(wp);
    }
  };

  return (
    <>
      {waypoints.map((wp) => {
        const coords: LatLngTuple | null =
          typeof wp.location === "string"
            ? parseWKTPoint(wp.location)
            : wp.location?.coordinates
              ? [wp.location.coordinates[1], wp.location.coordinates[0]]
              : null;

        if (!coords) return null;

        return (
          <Marker
            key={wp.id}
            position={coords}
            icon={waypointMarkerIcon}
            eventHandlers={{
              click: () => handleMarkerClick(wp, coords),
            }}
          />
        );
      })}
    </>
  );
}
