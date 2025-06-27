import { create } from "zustand";

type LocationState = {
  position: [number, number] | null;
  setPosition: (pos: [number, number]) => void;
  showMarker: boolean;
  setShowMarker: (show: boolean) => void;
};

/**
 * Zustand store for managing the user's GPS location and marker visibility.
 * - `position`: current GPS coordinates ([latitude, longitude])
 * - `showMarker`: whether the user marker should be visible on the map
 * - `setPosition`: updates the current position
 * - `setShowMarker`: controls the marker's visibility
 */
export const useLocationStore = create<LocationState>((set) => ({
  position: null,
  showMarker: false,
  setPosition: (pos) => set({ position: pos }),
  setShowMarker: (show) => set({ showMarker: show }),
}));
