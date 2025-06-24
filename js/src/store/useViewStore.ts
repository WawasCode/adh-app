import { create } from "zustand";
import type { Page } from "@/views/MobileUICommon";

type ViewState = {
  currentPage: Page;
  setPage: (page: Page) => void;
  goBack: () => void;
  history: Page[];
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
      const history = [...state.history];
      const previous = history.pop() || "main";
      return { currentPage: previous, history };
    }),
}));
