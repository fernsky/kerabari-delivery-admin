import { StateCreator } from "zustand";
import { WardOffice } from "@/server/db/schema/profile";

export interface WardOfficeState {
  wardOffices: WardOffice[];
  addWardOffice: (office: WardOffice) => void;
  addWardOffices: (offices: WardOffice[]) => void;
  removeWardOffice: (officeId: string) => void;
}

export const createWardOfficeSlice: StateCreator<WardOfficeState> = (set) => ({
  wardOffices: [],

  addWardOffice: (office) =>
    set((state) => ({
      wardOffices: state.wardOffices.some((o) => o.id === office.id)
        ? state.wardOffices
        : [...state.wardOffices, office],
    })),

  addWardOffices: (offices) =>
    set((state) => ({
      wardOffices: [
        ...state.wardOffices,
        ...offices.filter(
          (office) => !state.wardOffices.some((o) => o.id === office.id),
        ),
      ],
    })),

  removeWardOffice: (officeId) =>
    set((state) => ({
      wardOffices: state.wardOffices.filter((o) => o.id !== officeId),
    })),
});
