import { create } from "zustand";
import { Waypoint } from "@/types/waypoint";
import { HazardZone } from "@/types/hazardZone";
import { Incident } from "@/types/incident";
import { PhotonPlace } from "@/types/photon";

// Define a type for a single data item
export type SlidingCardDataItem =
  | Waypoint
  | HazardZone
  | Incident
  | PhotonPlace;

// Define a type for an array of data items
export type SlidingCardData = SlidingCardDataItem | SlidingCardDataItem[];

/**
 * SlidingCardState – Zustand store for managing the visibility and content
 * of a sliding detail card for selected items.
 *
 * @property isVisible Indicates whether the sliding card is shown
 * @property data The currently selected items for display
 * @property setData Opens the card with given items
 * @property clearData Closes the card and clears the state
 */
interface SlidingCardState {
  isVisible: boolean;
  data: SlidingCardData | null;
  setData: (data: SlidingCardData) => void;
  clearData: () => void;
}

/**
 * useSlidingCardStore – Zustand store that controls the sliding detail card
 * used to show information about selected items.
 */
export const useSlidingCardStore = create<SlidingCardState>((set) => ({
  isVisible: false,
  data: null,

  /**
   * setData – Displays the sliding card with the selected items.
   *
   * @param data An item or an array of items to show in the card
   */
  setData: (data) => set({ isVisible: true, data }),

  /**
   * clearData – Hides the sliding card and clears the content.
   */
  clearData: () => set({ isVisible: false, data: null }),
}));
