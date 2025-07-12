import { create } from "zustand";
import { Waypoint } from "@/types/waypoint";
import apiClient from "@/services/apiClient";

/**
 * WaypointState – Zustand store structure for managing waypoints.
 *
 * @property waypoints Array of loaded waypoints
 * @property setWaypoints Function to set waypoints in the store
 */
interface WaypointState {
  waypoints: Waypoint[];
  setWaypoints: (waypoints: Waypoint[]) => void;
  fetchWaypoints: () => Promise<void>;
}

/**
 * useWaypointStore – Zustand store for managing saved waypoint data.
 */
export const useWaypointStore = create<WaypointState>((set) => ({
  waypoints: [],

  /**
   * setWaypoints – Sets waypoints in the store.
   * @param waypoints Array of waypoints
   */
  setWaypoints: (waypoints) => set({ waypoints }),

  /**
   * fetchWaypoints – Fetches waypoints from the backend.
   */
  fetchWaypoints: async () => {
    const setWaypoints = (waypoints: Waypoint[]) => set({ waypoints });
    await apiClient.fetchWaypoints(setWaypoints);
  },
}));
