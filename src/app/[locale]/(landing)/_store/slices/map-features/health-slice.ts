import { StateCreator } from "zustand";
import { Health } from "@/server/db/schema/profile";

export interface HealthState {
  health: Health[];
  addHealth: (health: Health) => void;
  addHealths: (healths: Health[]) => void;
  removeHealth: (healthId: string) => void;
}

export const createHealthSlice: StateCreator<HealthState> = (set) => ({
  health: [],

  addHealth: (health) =>
    set((state) => ({
      health: state.health.some((h) => h.id === health.id)
        ? state.health
        : [...state.health, health],
    })),

  addHealths: (healths) =>
    set((state) => ({
      health: [
        ...state.health,
        ...healths.filter(
          (health) => !state.health.some((h) => h.id === health.id),
        ),
      ],
    })),

  removeHealth: (healthId) =>
    set((state) => ({
      health: state.health.filter((h) => h.id !== healthId),
    })),
});
