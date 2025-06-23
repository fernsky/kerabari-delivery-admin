import { StateCreator } from "zustand";
import { NavigationState } from "./navigation-types";
import { Route } from "../types";

export const createNavigationSlice: StateCreator<NavigationState> = (set) => ({
  currentRoute: null,
  currentPartId: null,
  currentChapterId: null,
  currentSectionId: null,
  isMapSidebarOpen: false,

  setCurrentRoute: (route: Route | null) => set({ currentRoute: route }),
  setCurrentPartId: (partId: string | null) => set({ currentPartId: partId }),
  setCurrentChapterId: (chapterId: string | null) =>
    set({ currentChapterId: chapterId }),
  setCurrentSectionId: (sectionId: string | null) =>
    set({ currentSectionId: sectionId }),
  setMapSidebarOpen: (isOpen: boolean) => set({ isMapSidebarOpen: isOpen }),
});
