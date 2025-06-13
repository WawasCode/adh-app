import { WaypointList } from "./WaypointList";
import { useWaypointStore } from "@/store/useWaypointStore";

/**
 * WaypointPage shows the most recent waypoints using the WaypointList component.
 */
export function WaypointPage() {
  const waypoints = useWaypointStore((s) => s.waypoints);
  return <WaypointList waypoints={waypoints} name="Waypoints" />;
}
