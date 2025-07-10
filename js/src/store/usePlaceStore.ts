import { create } from "zustand";

// --------------------
// Type Definitions
// --------------------

export type HazardSeverity = "low" | "medium" | "high" | "critical";
export const hazardSeverities: HazardSeverity[] = [
  "low",
  "medium",
  "high",
  "critical",
];

export type WaypointType =
  | "firestation"
  | "policestation"
  | "hospital"
  | "critical infrastructure"
  | "medical facility"
  | "supply center"
  | "other";

export interface Waypoint {
  id: string;
  name: string;
  description: string;
  location: [number, number];
  distance?: number; // Optional distance from current position
  telephone: string;
  isAvailable: boolean;
  type: WaypointType;
}

// --------------------
// Zustand Store
// --------------------

type HazardInput = {
  name: string;
  description: string;
  location: [number, number] | null;
  severity: HazardSeverity | null;
};

type WaypointInput = {
  name: string;
  description: string;
  location: [number, number] | null;
  telephone: string;
  isAvailable: boolean;
  waypointType: WaypointType | null;
};

type PlaceState = {
  hazardInput: HazardInput;
  waypointInput: WaypointInput;

  setHazardField: <K extends keyof HazardInput>(
    key: K,
    value: HazardInput[K],
  ) => void;
  setWaypointField: <K extends keyof WaypointInput>(
    key: K,
    value: WaypointInput[K],
  ) => void;

  resetHazardInput: () => void;
  resetWaypointInput: () => void;

  savedWaypoints: Waypoint[];
  addWaypoint: (waypoint: Waypoint) => void;
};

export const usePlaceStore = create<PlaceState>((set) => ({
  hazardInput: {
    name: "",
    description: "",
    location: null,
    severity: null,
  },
  waypointInput: {
    name: "",
    description: "",
    location: null,
    telephone: "",
    isAvailable: false,
    waypointType: null,
  },

  setHazardField: (key, value) =>
    set((state) => ({
      hazardInput: {
        ...state.hazardInput,
        [key]: value,
      },
    })),

  setWaypointField: (key, value) =>
    set((state) => ({
      waypointInput: {
        ...state.waypointInput,
        [key]: value,
      },
    })),

  resetHazardInput: () =>
    set({
      hazardInput: {
        name: "",
        description: "",
        location: null,
        severity: null,
      },
    }),

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
