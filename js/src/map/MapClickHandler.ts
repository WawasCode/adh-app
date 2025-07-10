import { useMapEvents } from "react-leaflet";
import { useSlidingCardStore } from "@/store/useSlidingCardStore";

const MapClickHandler = () => {
  const { clearWaypoint } = useSlidingCardStore();

  useMapEvents({
    click: () => {
      clearWaypoint();
    },
  });

  return null;
};

export default MapClickHandler;
