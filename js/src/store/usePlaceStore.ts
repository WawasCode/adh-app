import { create } from "zustand";

// Types
export type PlaceType = "hazard" | "waypoint";
export type HazardSeverity = "low" | "medium" | "high" | "critical";
export type WaypointType = "firestation" | "policestation" | "hospital";

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
  telephone: string;
  isAvailable: boolean;
  type: WaypointType;
};

type PlaceState = {
  // Current input data (e.g. for configuration)
  type: PlaceType | null;
  name: string;
  description: string;
  location: [number, number] | null;
  severity: HazardSeverity | null;
  waypointType: WaypointType | null;
  telephone: string;
  isAvailable: boolean;

  // Saved results
  savedWaypoints: Waypoint[];

  // Setter
  setType: (type: PlaceType) => void;
  setName: (name: string) => void;
  setDescription: (desc: string) => void;
  setLocation: (loc: [number, number]) => void;
  setSeverity: (sev: HazardSeverity) => void;
  setWaypointType: (type: WaypointType) => void;
  setTelephone: (tel: string) => void;
  setAvailability: (avail: boolean) => void;

  // Save data
  addWaypoint: (waypoint: Waypoint) => void;

  // reset state
  reset: () => void;
};

export const usePlaceStore = create<PlaceState>((set) => ({
  type: null,
  name: "",
  description: "",
  location: null,
  severity: null,
  waypointType: null,
  telephone: "",
  isAvailable: false,

  savedWaypoints: [],
  addWaypoint: (waypoint) =>
    set((state) => ({
      savedWaypoints: [...state.savedWaypoints, waypoint],
    })),

  setType: (type) => set({ type }),
  setName: (name) => set({ name }),
  setDescription: (description) => set({ description }),
  setLocation: (location) => set({ location }),
  setSeverity: (severity) => set({ severity }),
  setWaypointType: (waypointType) => set({ waypointType }),
  setTelephone: (telephone) => set({ telephone }),
  setAvailability: (isAvailable) => set({ isAvailable }),

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
