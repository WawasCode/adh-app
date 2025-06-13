import { IncidentsList } from "./IncidentsList";
import { useIncidentStore } from "@/store/useIncidentStore.ts";

/**
 * IncidentsPage shows the most recent incidents using the IncidentsList component.
 */
export function IncidentsPage() {
  const incidents = useIncidentStore((s) => s.incidents);
  return <IncidentsList incidents={incidents} name="Gefährdungen" />;
}
