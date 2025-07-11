import { IncidentsList } from "./IncidentsList";
import { WaypointList } from "./WaypointList";
import { useIncidentStore } from "@/store/useIncidentDisplayStore";
import { useHazardZoneStore } from "@/store/useHazardZoneDisplayStore";
import { useWaypointStore } from "@/store/useWaypointDisplayStore";
import { useEffect } from "react";

/**
 * IncidentsPage shows the most recent incidents using the IncidentsList component.
 */
export function IncidentsPage() {
  const incidents = useIncidentStore((s) => s.incidents);
  const hazardZones = useHazardZoneStore((s) => s.savedHazardZones); // oder hazardZones
  const waypoints = useWaypointStore((s) => s.waypoints);

  const fetchIncidents = useIncidentStore((s) => s.fetchIncidents);
  const fetchHazardZones = useHazardZoneStore((s) => s.fetchHazardZones);
  const fetchWaypoints = useWaypointStore((s) => s.fetchWaypoints);

  const items = [
    ...incidents.map((i) => ({ ...i, id: String(i.id) })),
    ...hazardZones.map((h) => ({ ...h, id: String(h.id) })),
  ];

  useEffect(() => {
    fetchIncidents();
    fetchHazardZones();
    fetchWaypoints();
  }, [fetchIncidents, fetchHazardZones, fetchWaypoints]);

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 min-h-0 overflow-y-auto">
        <IncidentsList items={items} name="Incidents & Hazardzones" />
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto border-t">
        <WaypointList waypoints={waypoints} name="Waypoints" />
      </div>
      <nav className="h-16 fixed bottom-0 left-0 right-0 bg-white border-t">
        {/* Navigation content */}
      </nav>
    </div>
  );
}
