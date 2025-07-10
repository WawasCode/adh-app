import { create } from "zustand";
import { Waypoint } from "@/store/useWaypointStore";

/**
 * SlidingCardState – Zustand store for managing the visibility and content
 * of a sliding detail card for a selected waypoint.
 *
 * @property isVisible Indicates whether the sliding card is shown
 * @property waypoint The currently selected waypoint for display
 * @property setWaypoint Opens the card with a given waypoint
 * @property clearWaypoint Closes the card and clears the state
 */
interface SlidingCardState {
  isVisible: boolean;
  waypoint: Waypoint | null;
  setWaypoint: (waypoint: Waypoint) => void;
  clearWaypoint: () => void;
}

/**
 * useSlidingCardStore – Zustand store that controls the sliding detail card
 * used to show information about a selected waypoint.
 *
 * Usage:
 * - `setWaypoint(wp)`: Show the card with `wp` as its content
 * - `clearWaypoint()`: Hide the card and remove the waypoint
 */
export const useSlidingCardStore = create<SlidingCardState>((set) => ({
  isVisible: false,
  waypoint: null,

  /**
   * setWaypoint – Displays the sliding card with the selected waypoint.
   *
   * @param waypoint A waypoint object to show in the card
   */
  setWaypoint: (waypoint) => set({ isVisible: true, waypoint }),

  /**
   * clearWaypoint – Hides the sliding card and clears its content.
   */
  clearWaypoint: () => set({ isVisible: false, waypoint: null }),
}));
