import { StateCreator } from "zustand";
import { Village } from "@/server/db/schema/profile";

export interface VillageState {
  villages: Village[];
  addVillage: (village: Village) => void;
  addVillages: (villages: Village[]) => void;
  removeVillage: (villageId: string) => void;
}

export const createVillageSlice: StateCreator<VillageState> = (set) => ({
  villages: [],

  addVillage: (village: Village) =>
    set((state) => ({
      villages: state.villages.some((v) => v.id === village.id)
        ? state.villages
        : [...state.villages, village],
    })),

  addVillages: (villages: Village[]) =>
    set((state) => ({
      villages: [
        ...state.villages,
        ...villages.filter(
          (village) => !state.villages.some((v) => v.id === village.id),
        ),
      ],
    })),

  removeVillage: (villageId: string) =>
    set((state) => ({
      villages: state.villages.filter((v) => v.id !== villageId),
    })),
});
