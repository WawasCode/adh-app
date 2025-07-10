import { create } from "zustand";

// --------------------
// Type Definitions
// --------------------

/**
 * HazardSeverity – Enum-like type representing danger levels for hazards.
 */
export type HazardSeverity = "low" | "medium" | "high" | "critical";

/**
 * hazardSeverities – Ordered array of all severity options.
 */
export const hazardSeverities: HazardSeverity[] = [
  "low",
  "medium",
  "high",
  "critical",
];

/**
 * WaypointType – Categorical types for predefined infrastructure points.
 */
export type WaypointType =
  | "firestation"
  | "policestation"
  | "hospital"
  | "critical infrastructure"
  | "medical facility"
  | "supply center"
  | "other";

/**
 * Waypoint – A saved point of interest with metadata.
 *
 * @property id Unique string identifier
 * @property name Descriptive name
 * @property description Text description
 * @property location Geo coordinates [lat, lon]
 * @property distance Optional – Distance from user's location
 * @property telephone Optional – Contact info
 * @property isAvailable Optional – Availability status
 * @property type One of the defined WaypointTypes
 */
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

/**
 * hazardInput – Temporary input state for creating a hazard.
 */
type HazardInput = {
  name: string;
  description: string;
  location: [number, number] | null;
  severity: HazardSeverity | null;
};

/**
 * waypointInput – Temporary input state for creating a waypoint.
 */
type WaypointInput = {
  name: string;
  description: string;
  location: [number, number] | null;
  telephone: string;
  isAvailable: boolean;
  waypointType: WaypointType | null;
};

/**
 * PlaceState – Zustand store for managing form input and saved waypoints.
 *
 * - `hazardInput`, `waypointInput`: hold temporary form data
 * - `set*Field`: update individual input fields
 * - `reset*Input`: clear input state
 * - `savedWaypoints`: stored waypoints for display
 */
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

/**
 * usePlaceStore – Zustand store for managing temporary hazard/waypoint input
 * and saving waypoints locally. Used during user data entry.
 */
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

  /**
   * Updates a single hazard input field.
   */
  setHazardField: (key, value) =>
    set((state) => ({
      hazardInput: {
        ...state.hazardInput,
        [key]: value,
      },
    })),

  /**
   * Updates a single waypoint input field.
   */
  setWaypointField: (key, value) =>
    set((state) => ({
      waypointInput: {
        ...state.waypointInput,
        [key]: value,
      },
    })),

  /**
   * Clears the hazard input form.
   */
  resetHazardInput: () =>
    set({
      hazardInput: {
        name: "",
        description: "",
        location: null,
        severity: null,
      },
    }),

  /**
   * Clears the waypoint input form.
   */
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

  /**
   * Adds a new waypoint to the local list.
   */
  savedWaypoints: [],
  addWaypoint: (waypoint) =>
    set((state) => ({
      savedWaypoints: [...state.savedWaypoints, waypoint],
    })),
}));
