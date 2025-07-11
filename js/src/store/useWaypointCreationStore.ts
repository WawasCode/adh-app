// src/stores/useWaypointStore.ts

import { create } from "zustand";
import { Waypoint, WaypointInput } from "@/types/waypoint";

type WaypointState = {
  waypointInput: WaypointInput;
  setWaypointField: <K extends keyof WaypointInput>(
    key: K,
    value: WaypointInput[K],
  ) => void;
  resetWaypointInput: () => void;
  savedWaypoints: Waypoint[];
  addWaypoint: (waypoint: Waypoint) => void;
};

export const useWaypointStore = create<WaypointState>((set) => ({
  waypointInput: {
    name: "",
    description: "",
    location: null,
    telephone: "",
    isAvailable: false,
    waypointType: null,
  },
  setWaypointField: (key, value) =>
    set((state) => ({
      waypointInput: {
        ...state.waypointInput,
        [key]: value,
      },
    })),
  resetWaypointInput: () =>
    set({
      waypointInput: {
        name: "",
        description: "",
        location: null,
        telephone: "",
        isAvailable: false,
        waypointType: null,
      },
    }),
  savedWaypoints: [],
  addWaypoint: (waypoint) =>
    set((state) => ({
      savedWaypoints: [...state.savedWaypoints, waypoint],
    })),
}));
