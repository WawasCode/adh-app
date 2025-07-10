import { create } from "zustand";

/**
 * Waypoint represents a saved point of interest on the map, like a fire station.
 * - `id`: unique identifier (from backend)
 * - `name`: name of the waypoint
 * - `location`: GeoJSON Point with [longitude, latitude]
 * - `type`: type of the waypoint (e.g., firestation, hospital)
 * - `description`, `telephone`, `isAvailable`, `createdAt`: optional metadata
 */
export interface Location {
  type: "Point";
  coordinates: [number, number]; // [longitude, latitude]
}

export interface Waypoint {
  id: number;
  name: string;
  location: Location | null;
  distance?: number;
  type: string;
  description?: string;
  telephone?: string;
  isAvailable?: boolean;
  createdAt?: string;
}

interface WaypointState {
  waypoints: Waypoint[];
  fetchWaypoints: () => Promise<void>;
}

export const useWaypointStore = create<WaypointState>((set) => ({
  waypoints: [],
  fetchWaypoints: async () => {
    try {
      const response = await fetch("/api/waypoints/");
      if (!response.ok) throw new Error("Failed to fetch waypoints");

      const data = await response.json();
      set({ waypoints: data as Waypoint[] });
    } catch (error) {
      console.error("Error fetching waypoints:", error);
    }
  },
}));
