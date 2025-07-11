import { forwardRef } from "react";
import { useSlidingCardStore } from "@/store/useSlidingCardStore";
import { cn } from "~/lib/utils";
import { Navigation as NavigationIcon, Phone, CircleX } from "lucide-react";
import { Waypoint } from "@/types/waypoint";
import { HazardZone } from "@/types/hazardZone";
import { Incident } from "@/types/incident";

type SlidingCardData = Waypoint | HazardZone | Incident;

function isWaypoint(data: SlidingCardData): data is Waypoint {
  return data.kind === "waypoint";
}

function isHazardZone(data: SlidingCardData): data is HazardZone {
  return data.kind === "hazardZone";
}

function isIncident(data: SlidingCardData): data is Incident {
  return data.kind === "incident";
}

// Content components for different data types
const WaypointContent = ({ waypoint }: { waypoint: Waypoint }) => (
  <div>
    <div className="text-xl flex justify-between items-center">
      <div>{waypoint.name}</div>
    </div>
    <div className="clear-both">
      <div className="text-sm leading-tight space-y-1">
        <div>
          {waypoint.type}
          {waypoint.distance !== undefined &&
            `・${waypoint.distance.toFixed(2)} km away`}
        </div>
        <div>
          {waypoint.isAvailable ? (
            <span className="text-green-600">available</span>
          ) : (
            <span className="text-red-600">not available</span>
          )}
        </div>
        {waypoint.description && <div>Description: {waypoint.description}</div>}
      </div>
    </div>
  </div>
);

const HazardZoneContent = ({ hazardZone }: { hazardZone: HazardZone }) => (
  <div>
    <div className="text-xl flex justify-between items-center">
      <div>{hazardZone.name}</div>
    </div>
    <div className="clear-both">
      <div className="text-sm leading-tight space-y-1">
        <div>
          {hazardZone.severity || "unknown"}
          {hazardZone.distance !== undefined &&
            `・${hazardZone.distance.toFixed(2)} km away`}
        </div>
        {hazardZone.isWalkable !== undefined && (
          <div>Walkable: {hazardZone.isWalkable ? "Yes" : "No"}</div>
        )}
        {hazardZone.isDrivable !== undefined && (
          <div>Drivable: {hazardZone.isDrivable ? "Yes" : "No"}</div>
        )}
        {hazardZone.description && (
          <div>Description: {hazardZone.description}</div>
        )}
      </div>
    </div>
  </div>
);

const IncidentContent = ({ incident }: { incident: Incident }) => (
  <div>
    <div className="text-xl flex justify-between items-center">
      <div>{incident.name}</div>
    </div>
    <div className="clear-both">
      <div className="text-sm leading-tight space-y-1">
        <div>
          {/* TODO: Hier die serverity Farbe benutzen, muss aber noch zu der theme Datei bewegt werden */}
          {incident.severity}
          {incident.distance !== undefined &&
            `・${incident.distance.toFixed(2)} km away`}
        </div>
        {incident.description && <div>Description: {incident.description}</div>}
      </div>
    </div>
  </div>
);

function deleteElement() {
  console.log("Delete Item");
  // Implement the logic to delete the item here
}

const SlidingCard = forwardRef<HTMLDivElement, { openNavigation: () => void }>(
  ({ openNavigation }, ref) => {
    const { isVisible, data, clearData } = useSlidingCardStore();

    if (!isVisible || !data) return null;

    const renderData = (data: SlidingCardData) => {
      if (isWaypoint(data)) {
        return <WaypointContent waypoint={data} />;
      } else if (isHazardZone(data)) {
        return <HazardZoneContent hazardZone={data} />;
      } else if (isIncident(data)) {
        return <IncidentContent incident={data} />;
      } else {
        console.log("Data type not recognized");
        return null;
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          "fixed inset-x-0 bottom-0 z-10 bg-white rounded-t-lg shadow-lg transform transition-transform duration-300 ease-in-out pointer-events-auto flex flex-col",
          isVisible ? "translate-y-0" : "translate-y-full",
        )}
        style={{ minHeight: "13rem" }}
      >
        <div className="p-4 flex-1 overflow-y-auto">
          {renderData(data)}
          <button
            onClick={clearData}
            className="absolute top-4 right-4 text-gray-500"
          >
            ✕
          </button>
        </div>
        <div className="flex justify-center p-4 gap-4">
          <button
            onClick={openNavigation}
            className="bg-white font-bold py-2 px-4 rounded border flex items-center"
          >
            <NavigationIcon className="mr-2" size={16} />
            Navigate
          </button>
          {"telephone" in data && data.telephone && (
            <a href={`tel:${data.telephone}`}>
              <button className="bg-white font-bold py-2 px-4 rounded border flex items-center">
                <Phone className="mr-2" size={16} />
                Call
              </button>
            </a>
          )}
          <button
            onClick={deleteElement}
            className="bg-white font-bold py-2 px-4 rounded border flex items-center"
          >
            <CircleX className="mr-2" size={16} />
            Delete
          </button>
        </div>
      </div>
    );
  },
);

export default SlidingCard;
