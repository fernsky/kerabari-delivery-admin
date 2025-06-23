import { StateCreator } from "zustand";
import { Elevation } from "@/server/db/schema/profile";

export interface ElevationState {
  elevations: Elevation[];
  elevation2100: Elevation | null;
  elevation2600: Elevation | null;
  elevation3100: Elevation | null;
  elevation3600: Elevation | null;
  elevation4257: Elevation | null;
  addElevation: (elevation: Elevation) => void;
  addElevations: (elevations: Elevation[]) => void;
  removeElevation: (elevationId: string) => void;
}

export const createElevationSlice: StateCreator<ElevationState> = (set) => ({
  elevations: [],
  elevation2100: null,
  elevation2600: null,
  elevation3100: null,
  elevation3600: null,
  elevation4257: null,

  addElevation: (elevation: Elevation) =>
    set((state) => ({
      elevations: state.elevations.some((e) => e.id === elevation.id)
        ? state.elevations
        : [...state.elevations, elevation],
    })),

  addElevations: (elevations: Elevation[]) =>
    set((state) => ({
      elevations: [
        ...state.elevations,
        ...elevations.filter(
          (elevation) => !state.elevations.some((e) => e.id === elevation.id),
        ),
      ],
      elevation2100:
        elevations.find((e) => e.elevation_en === "2100") ||
        state.elevation2100,
      elevation2600:
        elevations.find((e) => e.elevation_en === "2600") ||
        state.elevation2600,
      elevation3100:
        elevations.find((e) => e.elevation_en === "3100") ||
        state.elevation3100,
      elevation3600:
        elevations.find((e) => e.elevation_en === "3600") ||
        state.elevation3600,
      elevation4257:
        elevations.find((e) => e.elevation_en === "4257") ||
        state.elevation4257,
    })),

  removeElevation: (elevationId: string) =>
    set((state) => ({
      elevations: state.elevations.filter((e) => e.id !== elevationId),
    })),
});
