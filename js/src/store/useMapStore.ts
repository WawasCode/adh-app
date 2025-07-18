import { create } from "zustand";
import type { Map } from "leaflet";
import { PhotonPlace } from "@/types/photon";

type MapState = {
  map: Map | null;
  selectedLocation: { place: PhotonPlace; name: string } | undefined;
  setMap: (map: Map) => void;
  setSelectedLocation: (
    location: { place: PhotonPlace; name: string } | undefined,
  ) => void;
};

/**
 * Zustand store for globally storing and accessing the Leaflet map instance and selected location.
 *
 * - `map`: reference to the Leaflet map object
 * - `selectedLocation`: currently selected location on the map
 * - `setMap`: stores the map instance in the state
 * - `setSelectedLocation`: stores the selected location in the state
 */
export const useMapStore = create<MapState>((set) => ({
  map: null,
  selectedLocation: undefined,
  setMap: (map) => set({ map }),
  setSelectedLocation: (location) => set({ selectedLocation: location }),
}));
