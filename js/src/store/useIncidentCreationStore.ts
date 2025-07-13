// src/stores/useIncidentStore.ts

import { create } from "zustand";
import { HazardInput } from "@/types/incident";

type IncidentState = {
  hazardInput: HazardInput;
  setHazardField: <K extends keyof HazardInput>(
    key: K,
    value: HazardInput[K],
  ) => void;
  resetHazardInput: () => void;
};

export const useIncidentStore = create<IncidentState>((set) => ({
  hazardInput: {
    name: "",
    description: "",
    location: null,
    severity: null,
  },
  setHazardField: (key, value) =>
    set((state) => ({
      hazardInput: {
        ...state.hazardInput,
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
}));
