import { create } from "zustand";

type LocationState = {
  position: [number, number] | null;
  setPosition: (pos: [number, number]) => void;
  showMarker: boolean;
  setShowMarker: (show: boolean) => void;
};

export const useLocationStore = create<LocationState>((set) => ({
  position: null,
  showMarker: false,
  setPosition: (pos) => set({ position: pos }),
  setShowMarker: (show) => set({ showMarker: show }),
}));
