import { StateCreator } from "zustand";
import { MunicipalityBoundary } from "@/server/db/schema/profile";

export interface MunicipalityBoundaryState {
  municipalityBoundaries: MunicipalityBoundary[];
  addMunicipalityBoundary: (boundary: MunicipalityBoundary) => void;
  addMunicipalityBoundaries: (boundaries: MunicipalityBoundary[]) => void;
  removeMunicipalityBoundary: (boundaryId: string) => void;
}

export const createMunicipalityBoundarySlice: StateCreator<
  MunicipalityBoundaryState
> = (set) => ({
  municipalityBoundaries: [],

  addMunicipalityBoundary: (boundary) =>
    set((state) => ({
      municipalityBoundaries: state.municipalityBoundaries.some(
        (b) => b.id === boundary.id,
      )
        ? state.municipalityBoundaries
        : [...state.municipalityBoundaries, boundary],
    })),

  addMunicipalityBoundaries: (boundaries) =>
    set((state) => ({
      municipalityBoundaries: [
        ...state.municipalityBoundaries,
        ...boundaries.filter(
          (boundary) =>
            !state.municipalityBoundaries.some((b) => b.id === boundary.id),
        ),
      ],
    })),

  removeMunicipalityBoundary: (boundaryId) =>
    set((state) => ({
      municipalityBoundaries: state.municipalityBoundaries.filter(
        (b) => b.id !== boundaryId,
      ),
    })),
});
