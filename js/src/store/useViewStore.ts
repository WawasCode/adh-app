import { create } from "zustand";
import type { Page } from "@/views/MobileUICommon";

/**
 * Zustand store for managing view navigation within the mobile app.
 *
 * Features:
 * - `currentPage`: the currently active screen/view
 * - `setPage(page)`: navigates to a new view and updates the navigation history
 * - `goBack()`: navigates back to the previous view using the stored history
 * - `history`: stack of previously visited views
 */
type ViewState = {
  currentPage: Page;
  history: Page[];
  setPage: (page: Page) => void;
  goBack: () => void;
};

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
      const updatedHistory = [...state.history];
      const previousPage = updatedHistory.pop() ?? "main";
      return {
        currentPage: previousPage,
        history: updatedHistory,
      };
    }),
}));
