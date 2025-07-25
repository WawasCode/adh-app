import { create } from "zustand";
import { PhotonPlace } from "@/types/photon";

type SearchState = {
  query: string;
  selectedLocation: { place: PhotonPlace; name: string } | undefined;
  setQuery: (query: string) => void;
  setSelectedLocation: (
    location: { place: PhotonPlace; name: string } | undefined,
  ) => void;
  clearQuery: () => void;
};

/**
 * Zustand store for globally storing and accessing search-related state.
 *
 * - `selectedLocation`: currently selected location on the map
 * - `setSelectedLocation`: stores the selected location in the state
 */
export const useSearchStore = create<SearchState>((set) => ({
  query: "",
  selectedLocation: undefined,
  setQuery: (query) => set({ query }),
  setSelectedLocation: (location) => set({ selectedLocation: location }),
  clearQuery: () => set({ query: "" }),
}));
