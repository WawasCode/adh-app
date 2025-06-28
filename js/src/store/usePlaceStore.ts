import { create } from "zustand";

type PlaceType = "hazard" | "waypoint";
export const hazardSeverities: HazardSeverity[] = [
  "low",
  "medium",
  "high",
  "critical",
];

export type HazardSeverity = "low" | "medium" | "high" | "critical";
export type WaypointType = "firestation" | "policestation" | "hospital";

type PlaceState = {
  type: PlaceType | null;
  name: string;
  description: string;
  location: [number, number] | null;
  severity: HazardSeverity | null;
  waypointType: WaypointType | null;
  telephone: string;
  isAvailable: boolean;

  // Setter
  setType: (type: PlaceType) => void;
  setName: (name: string) => void;
  setDescription: (desc: string) => void;
  setLocation: (loc: [number, number]) => void;
  setSeverity: (sev: HazardSeverity) => void;
  setWaypointType: (type: WaypointType) => void;
  setTelephone: (tel: string) => void;
  setAvailability: (avail: boolean) => void;

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
  isAvailable: true,

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
      isAvailable: true,
    }),
}));
