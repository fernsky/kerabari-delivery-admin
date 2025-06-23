import { StateCreator } from "zustand";
import { Highway } from "@/server/db/schema/profile";

export interface HighwayState {
  highways: Highway[];
  addHighway: (highway: Highway) => void;
  addHighways: (highways: Highway[]) => void;
  removeHighway: (highwayId: string) => void;
}

export const createHighwaySlice: StateCreator<HighwayState> = (set) => ({
  highways: [],

  addHighway: (highway) =>
    set((state) => ({
      highways: state.highways.some((h) => h.id === highway.id)
        ? state.highways
        : [...state.highways, highway],
    })),

  addHighways: (highways) =>
    set((state) => ({
      highways: [
        ...state.highways,
        ...highways.filter(
          (highway) => !state.highways.some((h) => h.id === highway.id),
        ),
      ],
    })),

  removeHighway: (highwayId) =>
    set((state) => ({
      highways: state.highways.filter((h) => h.id !== highwayId),
    })),
});
