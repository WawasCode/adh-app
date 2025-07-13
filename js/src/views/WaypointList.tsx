import { Waypoint } from "@/types/waypoint";

export interface WaypointListProps {
  waypoints: Waypoint[];
  name: string;
}

/**
 * WaypointList – Displays a list of waypoints with their details.
 *
 * @param waypoints - Array of waypoint objects to display.
 */
export function WaypointList({ waypoints, name }: WaypointListProps) {
  const sortedWaypoints = [...waypoints].sort((a, b) => {
    return new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime();
  });

  return (
    <div className="w-full h-full bg-white flex flex-col">
      {name && (
        <div className="bg-gray-50 border-b border-gray-200 text-center py-4 font-semibold text-lg">
          {name}
        </div>
      )}
      <div className="px-2 flex-1 overflow-y-auto pb-16">
        {sortedWaypoints.map((item, idx) => (
          <div
            key={item.id ?? idx}
            className="border-b last:border-b-0 py-3 flex flex-row items-start justify-between"
          >
            <div>
              <div className="font-bold text-xl">{item.name}</div>
              <div className="text-base">{item.description}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {item.kind} · {getTimeSincePosting(item.reportedAt)} ·{" "}
                {formatTime(item.reportedAt)}
              </div>
            </div>
            <div className="text-sm text-right min-w-[5rem] pl-2 pt-1">
              {item.distance}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function getTimeSincePosting(date?: Date): string {
  if (!date) return "";
  const now = new Date();
  const difference = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (difference < 60) return `vor ${difference} Sek.`;
  if (difference < 3600) return `vor ${Math.floor(difference / 60)} Min.`;
  if (difference < 86400) return `vor ${Math.floor(difference / 3600)} Std.`;
  return `vor ${Math.floor(difference / 86400)} Tg.`;
}

/**
 * Format the time as clock time (e.g., "14:23").
 */
function formatTime(date?: Date) {
  if (!date) return "";
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
