import { create } from "zustand";
import type { LatLngTuple } from "leaflet";

/**
 * HazardZone – Local representation of a hazard zone.
 *
 * Used on the map to display a polygon or a point.
 *
 * @property id Unique identifier (stringified)
 * @property name Human-readable name
 * @property coordinates Array of LatLng tuples
 * @property severity Optional severity string
 * @property description Optional text description
 * @property isWalkable Optional boolean flag
 * @property isDrivable Optional boolean flag
 * @property type "Polygon" or "Point"
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
 * HazardZoneFromBackend – Raw hazard zone object returned from the backend.
 *
 * @property location WKT string (e.g. "SRID=4326;POLYGON ((...))" or "POINT (...)")
 */
type HazardZoneFromBackend = {
  id: number | string;
  name: string;
  location: string; // WKT-String z.B. "SRID=4326;POLYGON ((...))"
  severity?: string;
  description?: string;
  isWalkable?: boolean;
  isDrivable?: boolean;
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
