import { create } from "zustand";
import { Waypoint } from "@/store/useWaypointStore";

interface SlidingCardState {
  isVisible: boolean;
  waypoint: Waypoint | null;
  setWaypoint: (waypoint: Waypoint) => void;
  clearWaypoint: () => void;
}

export const useSlidingCardStore = create<SlidingCardState>((set) => ({
  isVisible: false,
  waypoint: null,
  setWaypoint: (waypoint) => set({ isVisible: true, waypoint }),
  clearWaypoint: () => set({ isVisible: false, waypoint: null }),
}));
