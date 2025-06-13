import { create } from "zustand";

export interface Location {
  type: "Point";
  coordinates: [number, number]; // [longitude, latitude]
}

export interface Waypoint {
  id: number;
  location: Location | null;
  name: string;
}

interface WaypointState {
  waypoints: Waypoint[];
  fetchWaypoints: () => Promise<void>;
}

export const useWaypointStore = create<WaypointState>((set) => ({
  waypoints: [],
  fetchWaypoints: async () => {
    const response = await fetch("/python/api/waypoints");
    const data = await response.json();
    set({ waypoints: data });
  },
}));
