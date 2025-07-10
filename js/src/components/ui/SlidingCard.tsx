import { forwardRef } from "react";
import { useSlidingCardStore } from "@/store/useSlidingCardStore";
import { cn } from "~/lib/utils";
import { Navigation as NavigationIcon, Phone } from "lucide-react";

const SlidingCard = forwardRef<HTMLDivElement, { openNavigation: () => void }>(
  ({ openNavigation }, ref) => {
    const { isVisible, waypoint, clearWaypoint } = useSlidingCardStore();

    if (!isVisible || !waypoint) return null;

    return (
      <div
        ref={ref}
        className={cn(
          "fixed inset-x-0 bottom-0 z-10 bg-white rounded-t-lg shadow-lg transform transition-transform duration-300 ease-in-out pointer-events-auto",
          isVisible ? "translate-y-0" : "translate-y-full",
        )}
        style={{
          minHeight: "13rem",
        }}
      >
        <div className="p-4">
          <div className="text-xl flex justify-between items-center">
            <div>{waypoint.name}</div>
            <button onClick={clearWaypoint} className="text-gray-500">
              ✕
            </button>
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
              {waypoint.description && (
                <div>Description: {waypoint.description}</div>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-center p-4 gap-4">
          <button
            onClick={openNavigation}
            className="bg-white font-bold py-2 px-4 rounded border flex items-center"
          >
            <NavigationIcon className="mr-2" size={16} />
            Navigate
          </button>
          {waypoint.telephone && (
            <a href={`tel:${waypoint.telephone}`}>
              <button className="bg-white font-bold py-2 px-4 rounded border flex items-center">
                <Phone className="mr-2" size={16} />
                Call
              </button>
            </a>
          )}
        </div>
      </div>
    );
  },
);

export default SlidingCard;
