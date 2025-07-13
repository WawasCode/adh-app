import { forwardRef, useState } from "react";
import { cn } from "~/lib/utils";
import {
  Navigation as NavigationIcon,
  Phone,
  CircleX,
  MoveLeft,
  MoveRight,
} from "lucide-react";
import { Waypoint } from "@/types/waypoint";
import { HazardZone } from "@/types/hazardZone";
import { Incident } from "@/types/incident";
import { ConfirmationDialog } from "@/components/ui/Confirm";
import apiClient from "@/services/apiClient";
import { useWaypointStore } from "@/store/useWaypointDisplayStore";
import { useHazardZoneStore } from "@/store/useHazardZoneDisplayStore";
import { useIncidentStore } from "@/store/useIncidentDisplayStore";
import { useSlidingCardStore } from "@/store/useSlidingCardStore";
import { theme } from "~/styles/theme";

type SlidingCardData = Waypoint | HazardZone | Incident;

type SeverityKey = keyof typeof theme.colors.severity;

function getSeverityColor(severity: string): string {
  const validSeverities: SeverityKey[] = [
    "low",
    "medium",
    "high",
    "critical",
    "default",
  ];
  return theme.colors.severity[
    (validSeverities.includes(severity as SeverityKey)
      ? severity
      : "default") as SeverityKey
  ];
}

interface SlidingCardProps {
  openNavigation: () => void;
}

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
          {waypoint.is_available ? (
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
          <span
            style={{
              color: getSeverityColor(hazardZone.severity),
            }}
          >
            {hazardZone.severity || "unknown"}
          </span>
          {hazardZone.distance !== undefined &&
            `・${hazardZone.distance.toFixed(2)} km away`}
        </div>
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
          <span
            style={{
              color: getSeverityColor(incident.severity),
            }}
          >
            {incident.severity || "unknown"}
          </span>
          {incident.distance !== undefined &&
            `・${incident.distance.toFixed(2)} km away`}
        </div>
        {incident.description && <div>Description: {incident.description}</div>}
      </div>
    </div>
  </div>
);

export const SlidingCard = forwardRef<HTMLDivElement, SlidingCardProps>(
  ({ openNavigation }, ref) => {
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const { data, clearData } = useSlidingCardStore();

    const isArray = Array.isArray(data);
    const currentData = isArray ? data[currentIndex] : data;

    if (!currentData) return null;

    console.log("Current data:", currentData);

    const handleDelete = async () => {
      try {
        let endpoint = "";
        if (isWaypoint(currentData)) {
          endpoint = `/waypoints/${currentData.id}/`;
        } else if (isHazardZone(currentData)) {
          endpoint = `/hazard-zones/${currentData.id}/`;
        } else if (isIncident(currentData)) {
          endpoint = `/incidents/${currentData.id}/`;
        } else {
          console.log("Data type not recognized");
          return;
        }
        await apiClient.deleteData(endpoint);
        if (isWaypoint(currentData)) {
          await useWaypointStore.getState().fetchWaypoints();
        } else if (isHazardZone(currentData)) {
          await useHazardZoneStore.getState().fetchHazardZones();
        } else if (isIncident(currentData)) {
          await useIncidentStore.getState().fetchIncidents();
        }
        clearData();
      } catch (error) {
        console.error("Error deleting item:", error);
      }
    };

    const handleNext = () => {
      if (isArray && currentIndex < data.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
    };

    const handlePrevious = () => {
      if (isArray && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
    };

    const renderData = () => {
      if (isWaypoint(currentData)) {
        return <WaypointContent waypoint={currentData} />;
      } else if (isHazardZone(currentData)) {
        return <HazardZoneContent hazardZone={currentData} />;
      } else if (isIncident(currentData)) {
        return <IncidentContent incident={currentData} />;
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
          "translate-y-0",
        )}
        style={{ minHeight: "13rem", maxHeight: "30rem" }}
      >
        <div className="p-4 flex-1 overflow-y-auto">
          {renderData()}
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
          {currentData.kind === "waypoint" &&
            "telephone" in currentData &&
            currentData.telephone && (
              <a href={`tel:${currentData.telephone}`}>
                <button className="bg-white font-bold py-2 px-4 rounded border flex items-center">
                  <Phone className="mr-2" size={16} />
                    Call
                </button>
              </a>
            )}
          <button
            onClick={() => setShowConfirmation(true)}
            className="bg-white font-bold py-2 px-4 rounded border flex items-center"
          >
            <CircleX className="mr-2" size={16} />
            Delete
          </button>
        </div>
        {isArray && data.length > 1 && (
          <div className="flex justify-around p-2 gap-4 border-t">
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="bg-red flex items-center disabled:opacity-50"
            >
              <MoveLeft className="mr-2" size={20} />
            </button>
            <span className="flex items-center text-xs">
              {currentIndex + 1} / {data.length}
            </span>
            <button
              onClick={handleNext}
              disabled={currentIndex === data.length - 1}
              className="bg-white flex items-center disabled:opacity-50"
            >
              <MoveRight className="mr-2" size={20} />
            </button>
          </div>
        )}
        {showConfirmation && (
          <ConfirmationDialog
            onConfirm={() => {
              setShowConfirmation(false);
              handleDelete();
            }}
            onCancel={() => setShowConfirmation(false)}
            message="Do you really want to delete this item?"
          />
        )}
      </div>
    );
  },
);
