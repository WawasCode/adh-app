import { create } from "zustand";
import type { LatLngTuple } from "leaflet";

/**
 * HazardZone represents a polygon-shaped danger zone on the map.
 * - `id`: unique identifier (from backend)
 * - `name`: descriptive name of the zone
 * - `coordinates`: list of [latitude, longitude] tuples representing the polygon
 */
export type HazardZone = {
  id: string;
  name: string;
  coordinates: LatLngTuple[];
  severity?: string;
  description?: string;
  isWalkable?: boolean;
  isDrivable?: boolean;
  type: "Polygon" | "Point";
};

type HazardZoneState = {
  savedHazardZones: HazardZone[];
  addHazardZone: (zone: HazardZone) => void;
  fetchHazardZones: () => Promise<void>;
};

type HazardZoneFromBackend = {
  id: number | string;
  name: string;
  location: string; // WKT-String z.B. "SRID=4326;POLYGON ((...))"
  severity?: string;
  description?: string;
  isWalkable?: boolean;
  isDrivable?: boolean;
};

// Funktion zum Parsen von WKT-POLYGON (auslagern)
function parseWKTPolygon(wkt: string): [number, number][] {
  const cleaned = wkt.replace(/^SRID=\d+;/, "").trim();
  const match = cleaned.match(/POLYGON\s*\(\((.+)\)\)/i);
  if (!match) return [];

  const coords = match[1]
    .split(",")
    .map((pair) => pair.trim().split(" ").map(parseFloat))
    .map(([lng, lat]) => [lat, lng] as [number, number]);

  return coords;
}

export const useHazardZoneStore = create<HazardZoneState>((set) => ({
  savedHazardZones: [],

  addHazardZone: (zone) =>
    set((state) => ({
      savedHazardZones: [...state.savedHazardZones, zone],
    })),

  fetchHazardZones: async () => {
    try {
      const res = await fetch("/api/hazard-zones/");
      if (!res.ok) throw new Error("Failed to fetch hazard zones");
      const data = await res.json();

      const zones: HazardZone[] = data.map((zone: HazardZoneFromBackend) => {
        const wkt = zone.location;
        const isPoint = wkt.includes("POINT");
        let coords: LatLngTuple[] = [];

        if (isPoint) {
          const match = wkt.match(/\(([\d.]+) ([\d.]+)\)/);
          if (match) {
            const [, lat, lng] = match;
            coords = [[parseFloat(lat), parseFloat(lng)]];
          }
        } else {
          coords = parseWKTPolygon(wkt);
        }

        return {
          id: zone.id.toString(),
          name: zone.name || "Unnamed Zone",
          coordinates: coords,
          severity: zone.severity,
          description: zone.description,
          isWalkable: zone.isWalkable,
          isDrivable: zone.isDrivable,
          type: isPoint ? "Point" : "Polygon",
        };
      });

      set({ savedHazardZones: zones });
    } catch (error) {
      console.error("Error fetching hazard zones:", error);
    }
  },
}));
