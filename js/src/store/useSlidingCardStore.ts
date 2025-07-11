import { create } from "zustand";
import { Waypoint } from "@/types/waypoint";
import { HazardZone } from "@/types/hazardZone";
import { Incident } from "@/types/incident";

export type SlidingCardData = Waypoint | HazardZone | Incident;

/**
 * SlidingCardState – Zustand store for managing the visibility and content
 * of a sliding detail card for a selected item.
 *
 * @property isVisible Indicates whether the sliding card is shown
 * @property data The currently selected item for display
 * @property setData Opens the card with a given item
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
 * used to show information about a selected item.
 */
export const useSlidingCardStore = create<SlidingCardState>((set) => ({
  isVisible: false,
  data: null,

  /**
   * setData – Displays the sliding card with the selected item.
   *
   * @param data An item object to show in the card
   */
  setData: (data) => set({ isVisible: true, data }),

  /**
   * clearData – Hides the sliding card and clears the content.
   */
  clearData: () => set({ isVisible: false, data: null }),
}));
