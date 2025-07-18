import { useEffect } from "react";
import { useIncidentStore } from "@/store/useIncidentDisplayStore";

/**
 * IncidentsList fetches and displays a list of incidents.
 * It uses Zustand to manage the state of incidents.
 */
export function IncidentsList() {
  const { incidents, fetchIncidents } = useIncidentStore();

  useEffect(() => {
    fetchIncidents();
  }, [fetchIncidents]);

  return (
    <div>
      {incidents.map((incident: { id: number; name: string }) => (
        <div key={incident.id}>
          <h3>{incident.name}</h3>
        </div>
      ))}
    </div>
  );
}
