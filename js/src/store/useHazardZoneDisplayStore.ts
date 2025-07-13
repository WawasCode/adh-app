import { create } from "zustand";
import apiClient from "@/services/apiClient";
import { HazardZone } from "@/types/hazardZone";

/**
 * HazardZoneState – Zustand store shape for hazard zone management.
 *
 * @property savedHazardZones Array of locally stored zones
 * @property addHazardZone Function to add a new zone to the state
 * @property setHazardZones Function to set hazard zones in the state
 */
type HazardZoneState = {
  savedHazardZones: HazardZone[];
  addHazardZone: (zone: HazardZone) => void;
  setHazardZones: (zones: HazardZone[]) => void;
  fetchHazardZones: () => Promise<void>;
};

/**
 * useHazardZoneStore – Zustand store for managing saved hazard zones.
 * Provides local state for hazard zones represented as either polygons or points.
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
   * setHazardZones – Sets hazard zones in the local state.
   *
   * @param zones An array of hazard zone objects
   */
  setHazardZones: (zones) => set({ savedHazardZones: zones }),

  /**
   * fetchHazardZones – Fetches hazard zones from the backend using the centralized apiClient.
   */
  fetchHazardZones: async () => {
    const setHazardZones = (zones: HazardZone[]) =>
      set({ savedHazardZones: zones });
    await apiClient.fetchHazardZones(setHazardZones);
  },
}));
