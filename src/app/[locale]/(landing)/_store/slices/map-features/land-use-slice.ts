import { StateCreator } from "zustand";
import { LandUse } from "@/server/db/schema/profile";

export interface LandUseState {
  landUses: LandUse[];
  waterBodies: LandUse | null;
  forest: LandUse | null;
  cultivation: LandUse | null;
  bushes: LandUse | null;
  builtup: LandUse | null;
  addLandUse: (landUse: LandUse) => void;
  addLandUses: (landUses: LandUse[]) => void;
  removeLandUse: (landUseId: string) => void;
}

export const createLandUseSlice: StateCreator<LandUseState> = (set) => ({
  landUses: [],
  waterBodies: null,
  forest: null,
  cultivation: null,
  bushes: null,
  builtup: null,

  addLandUse: (landUse: LandUse) =>
    set((state) => ({
      landUses: state.landUses.some((l) => l.id === landUse.id)
        ? state.landUses
        : [...state.landUses, landUse],
    })),

  addLandUses: (landUses: LandUse[]) =>
    set((state) => ({
      landUses: [
        ...state.landUses,
        ...landUses.filter(
          (landUse) => !state.landUses.some((l) => l.id === landUse.id),
        ),
      ],
      waterBodies:
        landUses.find((l) => l.land_use_en === "Waterbodies") ||
        state.waterBodies,
      forest: landUses.find((l) => l.land_use_en === "Forest") || state.forest,
      cultivation:
        landUses.find((l) => l.land_use_en === "Cultivation") ||
        state.cultivation,
      bushes: landUses.find((l) => l.land_use_en === "Bushes") || state.bushes,
      builtup:
        landUses.find((l) => l.land_use_en === "Builtup") || state.builtup,
    })),

  removeLandUse: (landUseId: string) =>
    set((state) => ({
      landUses: state.landUses.filter((l) => l.id !== landUseId),
    })),
});
