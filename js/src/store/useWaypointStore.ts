import { create } from "zustand";

/**
 * Location – GeoJSON representation of a point.
 *
 * Used for storing geographic coordinates in [longitude, latitude] format.
 */
export interface Location {
  type: "Point";
  coordinates: [number, number]; // [longitude, latitude]
}

/**
 * Waypoint – Represents a saved location of interest (e.g., fire station, hospital).
 *
 * @property id Unique identifier (from backend)
 * @property name Human-readable label for the waypoint
 * @property location Optional GeoJSON Point (or null)
 * @property distance Optional distance from user (in meters or kilometers)
 * @property type Category of the waypoint (e.g., "firestation", "hospital")
 * @property description Optional free-text description
 * @property telephone Optional phone number
 * @property isAvailable Optional flag for resource availability
 * @property createdAt Optional creation timestamp (ISO string)
 */
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
      set({ waypoints: data as Waypoint[] });
    } catch (error) {
      console.error("Error fetching waypoints:", error);
    }
  },
}));
