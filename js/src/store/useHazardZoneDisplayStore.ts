import { create } from "zustand";
import { HazardZone, HazardZoneBackend } from "@/types/hazardZone";
import { LatLngTuple } from "leaflet";

/**
 * HazardZoneState – Zustand store shape for hazard zone management.
 *
 * @property savedHazardZones Array of locally stored zones
 * @property addHazardZone Function to add a new zone to the state
 * @property fetchHazardZones Function to fetch zones from the API and parse WKT
 */
type HazardZoneState = {
  savedHazardZones: HazardZone[];
  addHazardZone: (zone: HazardZone) => void;
  fetchHazardZones: () => Promise<void>;
};

/**
 * parseWKTPolygon – Parses a WKT POLYGON string into Leaflet-compatible coordinates.
 *
 * @param wkt A string in WKT POLYGON format
 * @returns An array of [lat, lng] tuples
 */
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

/**
 * useHazardZoneStore – Zustand store for managing saved hazard zones.
 *
 * Provides local state for hazard zones represented as either polygons or points.
 * Supports:
 * - Adding new zones
 * - Fetching zones from the backend (WKT format)
 * - Parsing WKT into Leaflet-compatible coordinates
 */
export const useHazardZoneStore = create<HazardZoneState>((set) => ({
  savedHazardZones: [],

  /**
   * addHazardZone – Adds a single hazard zone to the local state.
   *
   * @param zone A hazard zone object to add
   */
  addHazardZone: (zone) =>
    set((state) => ({
      savedHazardZones: [...state.savedHazardZones, zone],
    })),

  /**
   * fetchHazardZones – Fetches hazard zones from the backend and parses them into usable format.
   *
   * Handles both POINT and POLYGON geometries by:
   * - Detecting type from WKT string
   * - Parsing coordinates
   * - Populating the store with structured `HazardZone` objects
   *
   * If an error occurs, it is logged to the console.
   */
  fetchHazardZones: async () => {
    try {
      const res = await fetch("/api/hazardzones/");
      if (!res.ok) throw new Error("Failed to fetch hazard zones");
      const data = await res.json();

      const zones: HazardZone[] = data.map((zone: HazardZoneBackend) => {
        const pointsWKT = zone.location;
        const isPoint = pointsWKT.includes("POINT");
        let coords: LatLngTuple[] = [];

        if (isPoint) {
          const match = pointsWKT.match(/\(([\d.]+) ([\d.]+)\)/);
          if (match) {
            const [, lat, lng] = match;
            coords = [[parseFloat(lat), parseFloat(lng)]];
          }
        } else {
          coords = parseWKTPolygon(pointsWKT);
        }

        return {
          id: zone.id.toString(),
          kind: zone.kind,
          name: zone.name || "Unnamed Zone",
          center: zone.center,
          coordinates: coords,
          severity: zone.severity,
          description: zone.description,
          isWalkable: zone.isWalkable,
          isDrivable: zone.isDrivable,
          type: isPoint ? "Point" : "Polygon",
          reportedAt:
            typeof zone.created_at === "string" ||
            typeof zone.created_at === "number" ||
            zone.created_at instanceof Date
              ? new Date(zone.created_at)
              : new Date(),
        };
      });

      set({ savedHazardZones: zones });
    } catch (error) {
      console.error("Error fetching hazard zones:", error);
    }
  },
}));
