import { create } from "zustand";

// --------------------
// Type Definitions
// --------------------

export type PlaceType = "hazard" | "waypoint";
export type HazardSeverity = "low" | "medium" | "high" | "critical";
export type WaypointType =
  | "firestation"
  | "policestation"
  | "hospital"
  | "critical infrastructure"
  | "medical facility"
  | "supply center"
  | "other";

export const hazardSeverities: HazardSeverity[] = [
  "low",
  "medium",
  "high",
  "critical",
];

export type Waypoint = {
  id: string;
  name: string;
  description: string;
  location: [number, number];
  distance?: number; // Optional distance from current position
  telephone: string;
  isAvailable: boolean;
  type: WaypointType;
};

// --------------------
// Zustand Store
// --------------------

type PlaceState = {
  // Input state
  type: PlaceType | null;
  name: string;
  description: string;
  location: [number, number] | null;
  severity: HazardSeverity | null;
  waypointType: WaypointType | null;
  telephone: string;
  isAvailable: boolean;

  // Saved data
  savedWaypoints: Waypoint[];

  // Setters
  setType: (type: PlaceType) => void;
  setName: (name: string) => void;
  setDescription: (desc: string) => void;
  setLocation: (loc: [number, number]) => void;
  setSeverity: (sev: HazardSeverity) => void;
  setWaypointType: (type: WaypointType) => void;
  setTelephone: (tel: string) => void;
  setAvailability: (avail: boolean) => void;

  // Actions
  addWaypoint: (waypoint: Waypoint) => void;
  reset: () => void;
};

export const usePlaceStore = create<PlaceState>((set) => ({
  // Initial state
  type: null,
  name: "",
  description: "",
  location: null,
  severity: null,
  waypointType: null,
  telephone: "",
  isAvailable: false,

  savedWaypoints: [],

  // Save new waypoint
  addWaypoint: (waypoint) =>
    set((state) => ({
      savedWaypoints: [...state.savedWaypoints, waypoint],
    })),

  // Setter methods
  setType: (type) => set({ type }),
  setName: (name) => set({ name }),
  setDescription: (description) => set({ description }),
  setLocation: (location) => set({ location }),
  setSeverity: (severity) => set({ severity }),
  setWaypointType: (waypointType) => set({ waypointType }),
  setTelephone: (telephone) => set({ telephone }),
  setAvailability: (isAvailable) => set({ isAvailable }),

  // Reset all input fields
  reset: () =>
    set({
      type: null,
      name: "",
      description: "",
      location: null,
      severity: null,
      waypointType: null,
      telephone: "",
      isAvailable: false,
    }),
}));
