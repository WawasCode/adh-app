import { useLocationStore } from "@/store/useLocationStore";
import { CircleMarker, useMap } from "react-leaflet";
import { useEffect, useState } from "react";

export function UserMarker() {
  const position = useLocationStore((s) => s.position);
  const map = useMap();
  const [radius, setRadius] = useState(30);

  useEffect(() => {
    if (position) void map.setView(position, 13);
  }, [position, map]);

  useEffect(() => {
    const updateRadius = () => {
      const zoom = map.getZoom();
      const r = Math.max(20, Math.min(50, 30 + (13 - zoom) * 5));
      setRadius(r);
    };

    map.on("zoom", updateRadius);
    updateRadius();

    return () => {
      map.off("zoom", updateRadius);
    };
  }, [map]);

  if (!position) return null;

  return (
    <CircleMarker
      center={position}
      radius={radius} // in Pixeln
      pathOptions={{
        color: "blue",
        fillColor: "blue",
        fillOpacity: 0.5,
      }}
    />
  );
}
