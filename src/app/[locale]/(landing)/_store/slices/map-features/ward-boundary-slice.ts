import { StateCreator } from "zustand";
import { WardBoundary } from "@/server/db/schema/profile";

export interface WardBoundaryState {
  wardBoundaries: WardBoundary[];
  addWardBoundary: (boundary: WardBoundary) => void;
  addWardBoundaries: (boundaries: WardBoundary[]) => void;
  removeWardBoundary: (boundaryId: string) => void;
}

export const createWardBoundarySlice: StateCreator<WardBoundaryState> = (
  set,
) => ({
  wardBoundaries: [],

  addWardBoundary: (boundary) =>
    set((state) => ({
      wardBoundaries: state.wardBoundaries.some((b) => b.id === boundary.id)
        ? state.wardBoundaries
        : [...state.wardBoundaries, boundary],
    })),

  addWardBoundaries: (boundaries) =>
    set((state) => ({
      wardBoundaries: [
        ...state.wardBoundaries,
        ...boundaries.filter(
          (boundary) => !state.wardBoundaries.some((b) => b.id === boundary.id),
        ),
      ],
    })),

  removeWardBoundary: (boundaryId) =>
    set((state) => ({
      wardBoundaries: state.wardBoundaries.filter((b) => b.id !== boundaryId),
    })),
});
