import { MunicipalityOffice } from "@/server/db/schema";
import { StateCreator } from "zustand";

export interface MunicipalityOfficeState {
  municipalityOffices: MunicipalityOffice[];
  addMunicipalityOffice: (office: MunicipalityOffice) => void;

  addMunicipalityOffices: (offices: MunicipalityOffice[]) => void;

  removeMunicipalityOffice: (officeId: string) => void;
}

export const createMunicipalityOfficeSlice: StateCreator<
  MunicipalityOfficeState
> = (set) => ({
  municipalityOffices: [],

  addMunicipalityOffice: (office: MunicipalityOffice) =>
    set((state) => ({
      municipalityOffices: state.municipalityOffices.some(
        (o) => o.id === office.id,
      )
        ? state.municipalityOffices
        : [...state.municipalityOffices, office],
    })),

  addMunicipalityOffices: (offices: MunicipalityOffice[]) =>
    set((state) => ({
      municipalityOffices: [
        ...state.municipalityOffices,
        ...offices.filter(
          (office) =>
            !state.municipalityOffices.some((o) => o.id === office.id),
        ),
      ],
    })),

  removeMunicipalityOffice: (officeId: string) =>
    set((state) => ({
      municipalityOffices: state.municipalityOffices.filter(
        (o) => o.id !== officeId,
      ),
    })),
});
