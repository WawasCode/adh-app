import { useMapEvents } from "react-leaflet";
import { useSlidingCardStore } from "@/store/useSlidingCardStore";

export const MapClickHandler = () => {
  const { clearWaypoint } = useSlidingCardStore();

  useMapEvents({
    click: () => {
      clearWaypoint();
    },
  });

  return null;
};
