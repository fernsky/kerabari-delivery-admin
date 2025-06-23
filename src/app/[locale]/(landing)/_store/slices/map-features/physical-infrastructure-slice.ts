import { StateCreator } from "zustand";
import { PhysicalInfrastructure } from "@/server/db/schema/profile";

export interface PhysicalInfrastructureState {
  physicalInfrastructures: PhysicalInfrastructure[];
  addPhysicalInfrastructure: (infrastructure: PhysicalInfrastructure) => void;
  addPhysicalInfrastructures: (
    infrastructures: PhysicalInfrastructure[],
  ) => void;
  removePhysicalInfrastructure: (infrastructureId: string) => void;
}

export const createPhysicalInfrastructureSlice: StateCreator<
  PhysicalInfrastructureState
> = (set) => ({
  physicalInfrastructures: [],

  addPhysicalInfrastructure: (infrastructure) =>
    set((state) => ({
      physicalInfrastructures: state.physicalInfrastructures.some(
        (i) => i.id === infrastructure.id,
      )
        ? state.physicalInfrastructures
        : [...state.physicalInfrastructures, infrastructure],
    })),

  addPhysicalInfrastructures: (infrastructures) =>
    set((state) => ({
      physicalInfrastructures: [
        ...state.physicalInfrastructures,
        ...infrastructures.filter(
          (infrastructure) =>
            !state.physicalInfrastructures.some(
              (i) => i.id === infrastructure.id,
            ),
        ),
      ],
    })),

  removePhysicalInfrastructure: (infrastructureId) =>
    set((state) => ({
      physicalInfrastructures: state.physicalInfrastructures.filter(
        (i) => i.id !== infrastructureId,
      ),
    })),
});
