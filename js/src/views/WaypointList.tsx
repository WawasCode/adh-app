import { Waypoint } from "@/store/useWaypointStore";

export interface WaypointListProps {
  waypoints: Waypoint[];
  name: string;
}

export function WaypointList({ waypoints, name }: WaypointListProps) {
  return (
    <div className="w-full bg-white min-h-screen">
      {name && <div className="text-center font-bold text-lg py-4">{name}</div>}
      <div className="px-2">
        {waypoints.map((waypoint) => (
          <div key={waypoint.id} className="mb-4">
            <h3>{waypoint.name}</h3>
            {waypoint.location && (
              <p>
                Location: {waypoint.location.coordinates[1]}
                {" · "}
                {waypoint.location.coordinates[0]}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
