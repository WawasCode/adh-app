import { create } from "zustand";

/**
 * ZonePoint – Tuple representing a single point on the map.
 * [latitude, longitude]
 */
export type ZonePoint = [number, number];

/**
 * HazardZone – Representation of a manually drawn polygon hazard zone.
 *
 * @property id Unique identifier (e.g. from backend or UUID)
 * @property name Descriptive name of the zone
 * @property description Optional details about the zone
 * @property severity Risk level (e.g. "high", "medium", "low")
 * @property coordinates Array of [lat, lng] points forming a polygon
 * @property isWalkable Optional flag if the zone is accessible by foot
 * @property isDrivable Optional flag if the zone is accessible by vehicle
 */
export type HazardZone = {
  id: string;
  name: string;
  description: string;
  severity: string;
  coordinates: [number, number][];
  isWalkable?: boolean;
  isDrivable?: boolean;
};

/**
 * ZoneState – Zustand store shape for building and storing polygon hazard zones.
 *
 * Includes temporary user input (points) and permanently saved zones.
 */
type ZoneState = {
  points: [number, number][];
  addPoint: (point: [number, number]) => void;
  removeLastPoint: () => void;
  reset: () => void;
  savedHazardZones: HazardZone[];
  addHazardZone: (zone: HazardZone) => void;
  maxPointsReached: boolean;
  setMaxPointsReached: (v: boolean) => void;
};

/**
 * useZoneStore – Zustand store for managing zone creation via map clicks.
 *
 * Used in the SelectZone view to collect polygon points from the user.
 * Provides functions to:
 * - Add up to 8 points
 * - Undo the last point
 * - Clear all input
 * - Track max-point warning state
 * - Persist completed hazard zones
 */
export const useZoneStore = create<ZoneState>((set) => ({
  points: [],
  addPoint: (point) =>
    set((state) =>
      state.points.length < 8 ? { points: [...state.points, point] } : state,
    ),

  maxPointsReached: false,
  setMaxPointsReached: (v) => set({ maxPointsReached: v }),

  removeLastPoint: () =>
    set((state) => ({ points: state.points.slice(0, -1) })),
  reset: () => set({ points: [], maxPointsReached: false }),

  savedHazardZones: [],
  addHazardZone: (zone) =>
    set((state) => ({
      savedHazardZones: [...state.savedHazardZones, zone],
    })),
}));
