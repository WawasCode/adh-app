import { create } from "zustand";

type LocationState = {
  position: [number, number] | null;
  setPosition: (pos: [number, number]) => void;
};

export const useLocationStore = create<LocationState>((set) => ({
  position: null,
  setPosition: (pos) => set({ position: pos }),
}));
