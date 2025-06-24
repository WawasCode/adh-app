import { create } from "zustand";
import type { Page } from "@/views/MobileUICommon";

type ViewState = {
  currentPage: Page;
  setPage: (page: Page) => void;
  goBack: () => void;
  history: Page[];
};

/**
 * Zustand store for managing view navigation within the mobile app.
 * - `currentPage`: the currently active screen/view
 * - `setPage(page)`: navigates to a new view and updates the navigation history
 * - `goBack()`: navigates back to the previous view using the stored history
 * - `history`: stack of previously visited views to support back navigation
 */
export const useViewStore = create<ViewState>((set) => ({
  currentPage: "main",
  history: [],
  setPage: (page) =>
    set((state) => ({
      currentPage: page,
      history: [...state.history, state.currentPage],
    })),
  goBack: () =>
    set((state) => {
      const history = [...state.history];
      const previous = history.pop() || "main";
      return { currentPage: previous, history };
    }),
}));
