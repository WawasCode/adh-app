import { create } from "zustand";
import type { Map } from "leaflet";

type MapState = {
  map: Map | null;
  setMap: (map: Map) => void;
};

export const useMapStore = create<MapState>((set) => ({
  map: null,
  setMap: (map) => set({ map }),
}));
