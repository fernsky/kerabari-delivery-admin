import { Route } from "../types";

export interface NavigationState {
  currentRoute: Route | null;
  currentPartId: string | null;
  currentChapterId: string | null;
  currentSectionId: string | null;
  isMapSidebarOpen: boolean;
  setCurrentRoute: (route: Route | null) => void;
  setCurrentPartId: (partId: string | null) => void;
  setCurrentChapterId: (chapterId: string | null) => void;
  setCurrentSectionId: (sectionId: string | null) => void;
  setMapSidebarOpen: (isOpen: boolean) => void;
}
