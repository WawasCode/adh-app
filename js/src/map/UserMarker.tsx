import { useLocationStore } from "@/store/useLocationStore";
import { Circle, useMap } from "react-leaflet";
import { useEffect } from "react";

export function UserMarker() {
  const position = useLocationStore((state) => state.position);
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.setView(position, 13);
    }
  }, [position, map]);

  if (!position) return null;

  return (
    <>
      {/* blauer Kreis */}
      <Circle
        center={position}
        radius={10}
        pathOptions={{
          color: "blue",
          fillColor: "blue",
          fillOpacity: 0.5,
        }}
      />
    </>
  );
}
