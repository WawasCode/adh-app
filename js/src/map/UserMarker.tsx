import { useLocationStore } from "@/store/useLocationStore";
import { CircleMarker } from "react-leaflet";
import { theme } from "~/styles/theme";

/**
 * UserMarker component displays the user's current GPS location
 * as a blue CircleMarker on the map.
 * The marker has a fixed pixel radius and appears only when enabled.
 */
export function UserMarker() {
  const position = useLocationStore((s) => s.position);
  const showMarker = useLocationStore((s) => s.showMarker);

  if (!position || !showMarker) return null;

  const MARKER_RADIUS = 20;

  return (
    <CircleMarker
      center={position}
      radius={MARKER_RADIUS}
      pathOptions={{
        color: theme.colors.primary[500],
        fillColor: theme.colors.primary[500],
        fillOpacity: 0.5,
      }}
    />
  );
}
