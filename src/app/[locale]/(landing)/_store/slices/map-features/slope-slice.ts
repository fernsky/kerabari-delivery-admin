import { StateCreator } from "zustand";
import { Slope } from "@/server/db/schema/profile";

export interface SlopeState {
  slopes: Slope[];
  slope15: Slope | null;
  slope30: Slope | null;
  slope45: Slope | null;
  slope60: Slope | null;
  slope72: Slope | null;
  addSlope: (slope: Slope) => void;
  addSlopes: (slopes: Slope[]) => void;
  removeSlope: (slopeId: string) => void;
}

export const createSlopeSlice: StateCreator<SlopeState> = (set) => ({
  slopes: [],
  slope15: null,
  slope30: null,
  slope45: null,
  slope60: null,
  slope72: null,

  addSlope: (slope: Slope) =>
    set((state) => ({
      slopes: state.slopes.some((s) => s.id === slope.id)
        ? state.slopes
        : [...state.slopes, slope],
    })),

  addSlopes: (slopes: Slope[]) =>
    set((state) => ({
      slopes: [
        ...state.slopes,
        ...slopes.filter(
          (slope) => !state.slopes.some((s) => s.id === slope.id),
        ),
      ],
      slope15: slopes.find((s) => s.angle_en === "15") || state.slope15,
      slope30: slopes.find((s) => s.angle_en === "30") || state.slope30,
      slope45: slopes.find((s) => s.angle_en === "45") || state.slope45,
      slope60: slopes.find((s) => s.angle_en === "60") || state.slope60,
      slope72: slopes.find((s) => s.angle_en === "72") || state.slope72,
    })),

  removeSlope: (slopeId: string) =>
    set((state) => ({
      slopes: state.slopes.filter((s) => s.id !== slopeId),
    })),
});
