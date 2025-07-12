import { Polygon, useMapEvents } from "react-leaflet";
import { useHazardZoneStore } from "@/store/useHazardZoneDisplayStore";
import { useSlidingCardStore } from "@/store/useSlidingCardStore";
import L from "leaflet";
import { calculateDistance, parseWKTPoint } from "@/utils/geoUtils";
import { theme } from "~/styles/theme";
import { useLocationStore } from "../store/useLocationStore";

/**
 * SavedHazardZones renders hazard zones fetched from the backend.
 */
export function SavedHazardZones() {
  const hazardZones = useHazardZoneStore((s) => s.savedHazardZones);
  const { setData } = useSlidingCardStore();
  const currentPosition = useLocationStore((s) => s.position);

  const handleMapClick = (e: L.LeafletMouseEvent) => {
    const clickedLatLng = e.latlng;
    const clickedZones = hazardZones.filter((zone) => {
      const polygon = L.polygon(zone.coordinates as [number, number][]);
      return polygon.getBounds().contains(clickedLatLng);
    });

    if (clickedZones.length > 0) {
      const zonesWithDistance = clickedZones.map((zone) => {
        const centerCoords =
          typeof zone.center === "string"
            ? parseWKTPoint(zone.center)!
            : ([zone.center.coordinates[1], zone.center.coordinates[0]] as [
                number,
                number,
              ]);

        if (currentPosition) {
          const distance = calculateDistance(currentPosition, centerCoords);
          return { ...zone, distance };
        } else {
          return zone;
        }
      });

      setData(
        zonesWithDistance.length === 1
          ? zonesWithDistance[0]
          : zonesWithDistance,
      );
    }
  };

  const getZoneColor = (severity: string | undefined): string => {
    switch (severity) {
      case "low":
        return theme.colors.severity.low;
      case "medium":
        return theme.colors.severity.medium;
      case "high":
        return theme.colors.severity.high;
      case "critical":
        return theme.colors.severity.critical;
      default:
        return theme.colors.severity.default;
    }
  };

  return (
    <>
      {hazardZones.map((zone) => {
        return (
          <Polygon
            key={zone.id}
            positions={zone.coordinates as [number, number][]}
            pathOptions={{
              color: getZoneColor(zone.severity),
              fillColor: getZoneColor(zone.severity),
              fillOpacity: 0.4,
            }}
          />
        );
      })}
      <MapClickHandler onClick={handleMapClick} />
    </>
  );
}

function MapClickHandler({
  onClick,
}: {
  onClick: (e: L.LeafletMouseEvent) => void;
}) {
  useMapEvents({
    click: (e) => {
      onClick(e);
    },
  });
  return null;
}
