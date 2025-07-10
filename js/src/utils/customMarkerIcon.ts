import L from "leaflet";
import { theme } from "~/styles/theme";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

/**
 * Custom marker icon for Leaflet maps.
 * Uses the default Leaflet marker images with custom size and anchor settings.
 */

export const customMarkerIcon = new L.Icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [theme.mapMarker.iconSize.width, theme.mapMarker.iconSize.height],
  iconAnchor: [theme.mapMarker.iconAnchor.x, theme.mapMarker.iconAnchor.y],
  popupAnchor: [theme.mapMarker.popupAnchor.x, theme.mapMarker.popupAnchor.y],
  shadowSize: [
    theme.mapMarker.shadowSize.width,
    theme.mapMarker.shadowSize.height,
  ],
});
