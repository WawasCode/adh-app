import { create } from "zustand";

type LocationState = {
  position: [number, number] | null;
  setPosition: (pos: [number, number]) => void;
  iconMode: "circle" | "arrow";
  setIconMode: (mode: "circle" | "arrow") => void;
};

export const useLocationStore = create<LocationState>((set) => ({
  position: null,
  setPosition: (pos) => set({ position: pos }),
  iconMode: "circle",
  setIconMode: (mode) => set({ iconMode: mode }),
}));
