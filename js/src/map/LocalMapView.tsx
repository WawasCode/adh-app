import { useEffect, useRef, useState } from "react";
import maplibregl, { Map, NavigationControl } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useLocationStore } from "@/store/useLocationStore";
import { cn } from "~/lib/utils";

const DEFAULT_CENTER: [number, number] = [13.405, 52.52]; // Berlin
const DEFAULT_ZOOM = 10;

interface LocalMapViewProps {
  className?: string;
  selectedLocation?: { lat: number; lon: number; name?: string };
}

/**
 * Get the style URL for the local map style
 */
const getLocalStyleUrl = (): string => {
  return "http://localhost:8080/api/styles/osm-bright-local.json";
};

export function LocalMapView({
  className,
  selectedLocation,
}: LocalMapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const position = useLocationStore((s) => s.position);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: getLocalStyleUrl(),
      center: position || DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      maxZoom: 14,
    });

    map.current.addControl(new NavigationControl(), "top-right");

    map.current.on("load", () => {
      setIsLoaded(true);

      /* 🛣️ Guarantee road-name labels even if the upstream style
         was stripped down (e.g. you deleted some layers).
         This adds them only when missing so you can iterate freely. */
      if (map.current && !map.current.getLayer("road-labels")) {
        map.current.addLayer({
          id: "road-labels",
          type: "symbol",
          source: "openmaptiles",
          "source-layer": "transportation_name",
          minzoom: 12,
          layout: {
            "symbol-placement": "line",
            "text-field": ["coalesce", ["get", "name:latin"], ["get", "name"]],
            "text-font": ["Open Sans Regular", "Open Sans Semibold"],
            "text-size": ["interpolate", ["linear"], ["zoom"], 12, 10, 16, 14],
            "text-rotation-alignment": "map",
          },
          paint: {
            "text-color": "#545454",
            "text-halo-color": "#ffffff",
            "text-halo-width": 1.25,
          },
        });
      }

      // 🚮 Remove invisible POI gizmos that clutter the hit-target atlas
      if (map.current?.getLayer("pois")) {
        map.current.removeLayer("pois");
      }
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [position]);

  // Fly to selectedLocation
  useEffect(() => {
    if (map.current && selectedLocation && isLoaded) {
      map.current.flyTo({
        center: [selectedLocation.lon, selectedLocation.lat],
        zoom: 15,
        duration: 1000,
      });
    }
  }, [selectedLocation, isLoaded]);

  // Fly to user location
  useEffect(() => {
    if (map.current && position && isLoaded) {
      map.current.flyTo({ center: position, zoom: 14, duration: 1000 });
    }
  }, [position, isLoaded]);

  return (
    <div className={cn("w-full h-full relative", className)}>
      <div ref={mapContainer} className="w-full h-full" />
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-gray-600">Loading local map…</div>
        </div>
      )}
    </div>
  );
}
