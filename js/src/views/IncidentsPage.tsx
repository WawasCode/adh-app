import { IncidentsList } from "./IncidentsList";
import { useIncidentStore } from "@/store/useIncidentDisplayStore";
import { useEffect } from "react";

/**
 * IncidentsPage shows the most recent incidents using the IncidentsList component.
 */
export function IncidentsPage() {
  const incidents = useIncidentStore((s) => s.incidents);
  const fetchIncidents = useIncidentStore((s) => s.fetchIncidents);

  useEffect(() => {
    fetchIncidents();
  }, [fetchIncidents]);

  return <IncidentsList incidents={incidents} name="Gefährdungen" />;
}
