import { useEffect } from "react";
import { useWaypointStore } from "@/store/useWaypointDisplayStore";

/**
 * WaypointList displays a list of waypoints fetched from the store.
 * It uses Zustand to manage state and fetches waypoints on mount.
 */
export function WaypointList() {
  const { waypoints, fetchWaypoints } = useWaypointStore();

  useEffect(() => {
    fetchWaypoints();
  }, [fetchWaypoints]);

  return (
    <div>
      {waypoints.map((waypoint) => (
        <div key={waypoint.id}>
          <h3>{waypoint.name}</h3>
          {waypoint.location && (
            <p>
              Location: {waypoint.location.coordinates[1]},{" "}
              {waypoint.location.coordinates[0]}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
