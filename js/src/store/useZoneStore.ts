import { create } from "zustand";

/**
 * useZoneStore manages the zone creation state for hazard zones.
 * - `points`: An array of up to 8 [lat, lng] tuples representing polygon corners.
 * - `addPoint`: Adds a point to the zone (max 8).
 * - `clear`: Resets the list of points.
 * This store is used to let users define hazard zones by clicking on a map.
 */
export type ZonePoint = [number, number];

type ZoneState = {
  points: [number, number][];
  addPoint: (point: [number, number]) => void;
  reset: () => void; // ✅ HIER HINZUGEFÜGT
};

export const useZoneStore = create<ZoneState>((set) => ({
  points: [],
  addPoint: (point) =>
    set((state) =>
      state.points.length < 8 ? { points: [...state.points, point] } : state,
    ),
  reset: () => set({ points: [] }), // ✅ IMPLEMENTIERT
}));
