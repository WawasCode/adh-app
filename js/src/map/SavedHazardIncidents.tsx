import { Marker } from "react-leaflet";
import { incidentMarkerIcon } from "@/utils/customMarkerIcon";
import { useIncidentStore } from "@/store/useIncidentDisplayStore";
import { LatLngTuple } from "leaflet";
import { useLocationStore } from "../store/useLocationStore";
import { Incident } from "@/types/incident";
import { calculateDistance, parseWKTPoint } from "@/utils/geoUtils";
import { useSlidingCardStore } from "@/store/useSlidingCardStore";

/**
 * SavedIncidents renders all incidents from the backend on the map.
 */
export function SavedHazardIncidents() {
  const incidents = useIncidentStore((s) => s.incidents);
  const { setData } = useSlidingCardStore();
  const currentPosition = useLocationStore((state) => state.position);

  const handleMarkerClick = (
    incident: Incident,
    coords: LatLngTuple | null,
  ) => {
    if (currentPosition && coords) {
      const distance = calculateDistance(currentPosition as [number, number], [
        coords[0],
        coords[1],
      ]);
      setData({ ...incident, distance });
    } else {
      setData(incident);
    }
  };

  return (
    <>
      {incidents.map((incident) => {
        const coords: LatLngTuple | null =
          typeof incident.location === "string"
            ? parseWKTPoint(incident.location)
            : incident.location?.coordinates
              ? [
                  incident.location.coordinates[1],
                  incident.location.coordinates[0],
                ]
              : null;

        if (!coords) {
          console.warn(
            "⚠️ Koordinaten konnten nicht geparst werden für Incident:",
            incident,
          );
          return null;
        }

        return (
          <Marker
            key={incident.id}
            position={coords}
            icon={incidentMarkerIcon}
            eventHandlers={{
              click: () => handleMarkerClick(incident, coords),
            }}
          />
        );
      })}
    </>
  );
}
