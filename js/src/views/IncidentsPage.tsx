import { IncidentsList } from "./IncidentsList";
import { useIncidentsStore } from "@/store/useincidentsStore";

/**
 * IncidentsPage shows the most recent incidents using the IncidentsList component.
 */
export function IncidentsPage() {
  const incidents = useIncidentsStore((s) => s.incidents);
  return <IncidentsList incidents={incidents} title="Gefährdungen" />;
}
