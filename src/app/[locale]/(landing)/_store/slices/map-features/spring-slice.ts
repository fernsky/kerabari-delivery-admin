import { StateCreator } from "zustand";
import { Spring } from "@/server/db/schema/profile";

export interface SpringState {
  springs: Spring[];
  addSpring: (spring: Spring) => void;
  addSprings: (springs: Spring[]) => void;
  removeSpring: (springId: string) => void;
}

export const createSpringSlice: StateCreator<SpringState> = (set) => ({
  springs: [],

  addSpring: (spring) =>
    set((state) => ({
      springs: state.springs.some((s) => s.id === spring.id)
        ? state.springs
        : [...state.springs, spring],
    })),

  addSprings: (springs) =>
    set((state) => ({
      springs: [
        ...state.springs,
        ...springs.filter(
          (spring) => !state.springs.some((s) => s.id === spring.id),
        ),
      ],
    })),

  removeSpring: (springId) =>
    set((state) => ({
      springs: state.springs.filter((s) => s.id !== springId),
    })),
});
