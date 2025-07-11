import { create } from "zustand";
import { Waypoint } from "@/types/waypoint";

/**
 * WaypointState – Zustand store structure for managing waypoints.
 *
 * @property waypoints Array of loaded waypoints
 * @property fetchWaypoints Function to load waypoints from the backend API
 */

interface WaypointState {
  waypoints: Waypoint[];
  fetchWaypoints: () => Promise<void>;
}

/**
 * useWaypointStore – Zustand store for managing saved waypoint data.
 *
 * - Stores all waypoints returned from the backend.
 * - Provides `fetchWaypoints()` to retrieve data from `/api/waypoints/`.
 * - Handles error logging on failure.
 */
export const useWaypointStore = create<WaypointState>((set) => ({
  waypoints: [],
  fetchWaypoints: async () => {
    try {
      const response = await fetch("/api/waypoints/");
      if (!response.ok) throw new Error("Failed to fetch waypoints");

      const data = await response.json();
      const waypoints = (data as Waypoint[]).map((item) => ({
        ...item,
        reportedAt:
          typeof item.created_at === "string" ||
          typeof item.created_at === "number" ||
          item.created_at instanceof Date
            ? new Date(item.created_at)
            : new Date(),
      }));
      set({ waypoints });
    } catch (error) {
      console.error("Error fetching waypoints:", error);
    }
  },
}));
