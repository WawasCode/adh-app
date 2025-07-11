import { Polygon } from "react-leaflet";
import { useHazardZoneStore } from "@/store/useHazardZoneDisplayStore";
import { HazardZone } from "../types/hazardZone";
import { useSlidingCardStore } from "@/store/useSlidingCardStore";
import { useLocationStore } from "@/store/useLocationStore";
import { LatLngTuple } from "leaflet";
import { calculateDistance, parseWKTPoint } from "@/utils/geoUtils";

function getZoneColor(severity: string | undefined): string {
  switch (severity) {
    case "low":
      return "#ca8a04";
    case "medium":
      return "#f97316";
    case "high":
      return "#ef4444";
    case "critical":
      return "#b91c1c";
    default:
      return "#6b7280";
  }
}

/**
 * SavedHazardZones renders hazard zones fetched from the backend.
 */
export function SavedHazardZones() {
  const hazardZones = useHazardZoneStore((s) => s.savedHazardZones);
  const { setData } = useSlidingCardStore();
  const currentPosition = useLocationStore((state) => state.position);

  const handleMarkerClick = (
    hazardZone: HazardZone,
    center: LatLngTuple | null,
  ) => {
    if (currentPosition && center) {
      const distance = calculateDistance(currentPosition as [number, number], [
        center[0],
        center[1],
      ]);
      setData({ ...hazardZone, distance });
    } else {
      setData(hazardZone);
    }
  };

  return (
    <>
      {hazardZones.map((zone) => {
        const centerCoords: LatLngTuple | null =
          typeof zone.center === "string"
            ? parseWKTPoint(zone.center)
            : zone.center?.coordinates
              ? [zone.center.coordinates[1], zone.center.coordinates[0]]
              : null;

        if (!centerCoords) return null;

        return (
          <Polygon
            key={zone.id}
            positions={zone.coordinates as [number, number][]}
            pathOptions={{
              color: getZoneColor(zone.severity),
              fillColor: getZoneColor(zone.severity),
              fillOpacity: 0.4,
            }}
            eventHandlers={{
              click: () => handleMarkerClick(zone, centerCoords),
            }}
          />
        );
      })}
    </>
  );
}
