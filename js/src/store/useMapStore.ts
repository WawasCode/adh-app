import { create } from "zustand";
import type { Map } from "leaflet";

type MapState = {
  map: Map | null;
  setMap: (map: Map) => void;
};

/**
 * Zustand store for globally storing and accessing the Leaflet map instance.
 *
 * - `map`: reference to the Leaflet map object
 * - `setMap`: stores the map instance in the state
 */
export const useMapStore = create<MapState>((set) => ({
  map: null,
  setMap: (map) => set({ map }),
}));
