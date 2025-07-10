import { create } from "zustand";
import type { Page } from "@/views/MobileUICommon";

/**
 * useViewStore – Zustand store for managing view navigation in the mobile app.
 *
 * This store controls the current screen and supports navigation with history tracking.
 * It's used to transition between views like "main", "addPlace", "configureHazard", etc.
 */

/**
 * ViewState – Zustand store structure for tracking page navigation.
 *
 * @property currentPage The currently active view/page
 * @property history Stack of previously visited pages
 * @property setPage Function to navigate to a new page and update history
 * @property goBack Function to return to the last visited page
 */
type ViewState = {
  currentPage: Page;
  history: Page[];
  setPage: (page: Page) => void;
  goBack: () => void;
};

/**
 * useViewStore – Zustand store instance for app-wide page navigation.
 *
 * - `setPage(page)` pushes the current page to history and navigates to a new one.
 * - `goBack()` pops the last page from the history stack and navigates back.
 */
export const useViewStore = create<ViewState>((set) => ({
  currentPage: "main",
  history: [],

  /**
   * setPage – Navigates to a new page and stores the current one in the history stack.
   *
   * @param page The page to navigate to
   */
  setPage: (page) =>
    set((state) => ({
      currentPage: page,
      history: [...state.history, state.currentPage],
    })),

  /**
   * goBack – Returns to the previous page by popping from the history stack.
   *
   * Falls back to "main" if the history is empty.
   */
  goBack: () =>
    set((state) => {
      const updatedHistory = [...state.history];
      const previousPage = updatedHistory.pop() ?? "main";
      return {
        currentPage: previousPage,
        history: updatedHistory,
      };
    }),
}));
