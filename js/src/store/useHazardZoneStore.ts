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
};

type HazardZoneState = {
  savedHazardZones: HazardZone[];
  addHazardZone: (zone: HazardZone) => void;
  fetchHazardZones: () => Promise<void>;
};

type HazardZoneFromBackend = {
  id: number | string;
  name: string;
  location: {
    type: "Polygon";
    coordinates: number[][][];
  };
};

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

      // Transformiere das GeoJSON-Format in dein internes Format
      const zones: HazardZone[] = data.map((zone: HazardZoneFromBackend) => ({
        id: zone.id.toString(),
        name: zone.name || "Unnamed Zone",
        coordinates:
          (zone.location?.coordinates?.[0] as [number, number][])?.map(
            (coord) => [coord[1], coord[0]], // [lat, lng]
          ) || [],
      }));

      set({ savedHazardZones: zones });
    } catch (error) {
      console.error("Error fetching hazard zones:", error);
    }
  },
}));
