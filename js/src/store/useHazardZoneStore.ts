import { create } from "zustand";
import type { LatLngTuple } from "leaflet";

/**
 * HazardZone represents a polygon-shaped danger zone on the map.
 * - `id`: unique identifier (e.g. UUID or backend ID)
 * - `name`: optional or generated name of the zone
 * - `coordinates`: ordered list of latitude/longitude tuples
 */
export type HazardZone = {
  id: string;
  name: string;
  coordinates: LatLngTuple[];
};

type HazardZoneState = {
  savedHazardZones: HazardZone[];
  addHazardZone: (zone: HazardZone) => void;
};

export const useHazardZoneStore = create<HazardZoneState>((set) => ({
  savedHazardZones: [],
  addHazardZone: (zone) =>
    set((state) => ({
      savedHazardZones: [...state.savedHazardZones, zone],
    })),
}));
