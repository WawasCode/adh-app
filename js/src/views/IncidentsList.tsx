import { Incident } from "@/store/useincidentsStore";

/**
 * Props for the IncidentsList component.
 */
export interface IncidentsListProps {
  incidents: Incident[];
  title?: string;
}

/**
 * IncidentsList – displays a list of incidents with type, title, description, time, and distance.
 */
export function IncidentsList({ incidents, title }: IncidentsListProps) {
  return (
    <div className="w-full bg-white min-h-screen">
      {title && (
        <div className="text-center font-bold text-lg py-4">{title}</div>
      )}
      <div className="px-2">
        {incidents.map((incident) => (
          <div
            key={incident.id}
            className="border-b last:border-b-0 py-3 flex flex-row items-start justify-between"
          >
            <div>
              <div className="font-bold text-xl">{incident.title}</div>
              <div className="text-base">{incident.description}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {incident.type} · {formatTimeAgo(incident.reportedAt)} ·{" "}
                {formatTime(incident.reportedAt)}
              </div>
            </div>
            <div className="text-sm text-right min-w-[5rem] pl-2 pt-1">
              {incident.distance}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Format the time since the incident was reported (e.g., "vor 2 Min.").
 */
function formatTimeAgo(date: Date) {
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return `vor ${diff} Sek.`;
  if (diff < 3600) return `vor ${Math.floor(diff / 60)} Min.`;
  if (diff < 86400) return `vor ${Math.floor(diff / 3600)} Std.`;
  return `vor ${Math.floor(diff / 86400)} Tg.`;
}

/**
 * Format the time as clock time (e.g., "14:23").
 */
function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
