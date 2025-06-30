import { useLocationStore } from "@/store/useLocationStore";
import { CircleMarker } from "react-leaflet";
import { theme } from "~/styles/theme";

/**
 * Displays a circular marker at the user's GPS location.
 * Only shown if location tracking is active (`showMarker`).
 */
export function UserMarker() {
  const position = useLocationStore((s) => s.position);
  const showMarker = useLocationStore((s) => s.showMarker);

  if (!position || !showMarker) return null;

  const DEFAULT_MARKER_RADIUS = 20;

  return (
    <CircleMarker
      center={position}
      radius={DEFAULT_MARKER_RADIUS}
      pathOptions={{
        color: theme.colors.primary[500],
        fillColor: theme.colors.primary[500],
        fillOpacity: 0.5,
      }}
    />
  );
}
