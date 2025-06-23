import { StateCreator } from "zustand";
import { Aspect } from "@/server/db/schema/profile";
import { AspectState } from "./aspect-types";

export const createAspectSlice: StateCreator<AspectState> = (set) => ({
  aspects: [],
  aspectFlat: null,
  aspectNorth: null,
  aspectNorthEast: null,
  aspectEast: null,
  aspectSouthEast: null,
  aspectSouth: null,
  aspectSouthWest: null,
  aspectWest: null,
  aspectNorthWest: null,

  addAspect: (aspect: Aspect) =>
    set((state) => ({
      aspects: state.aspects.some((a) => a.id === aspect.id)
        ? state.aspects
        : [...state.aspects, aspect],
      ...(aspect.type_en === "Flat" && { aspectFlat: aspect }),
      ...(aspect.type_en === "North" && { aspectNorth: aspect }),
      ...(aspect.type_en === "NorthEast" && { aspectNorthEast: aspect }),
      ...(aspect.type_en === "East" && { aspectEast: aspect }),
      ...(aspect.type_en === "SouthEast" && { aspectSouthEast: aspect }),
      ...(aspect.type_en === "South" && { aspectSouth: aspect }),
      ...(aspect.type_en === "SouthWest" && { aspectSouthWest: aspect }),
      ...(aspect.type_en === "West" && { aspectWest: aspect }),
      ...(aspect.type_en === "NorthWest" && { aspectNorthWest: aspect }),
    })),

  addAspects: (aspects) =>
    set((state) => ({
      aspects: [
        ...state.aspects,
        ...aspects.filter(
          (aspect) => !state.aspects.some((a) => a.id === aspect.id),
        ),
      ],
      aspectFlat: aspects.find((a) => a.type_en === "Flat") || state.aspectFlat,
      aspectNorth:
        aspects.find((a) => a.type_en === "North") || state.aspectNorth,
      aspectNorthEast:
        aspects.find((a) => a.type_en === "NorthEast") || state.aspectNorthEast,
      aspectEast: aspects.find((a) => a.type_en === "East") || state.aspectEast,
      aspectSouthEast:
        aspects.find((a) => a.type_en === "SouthEast") || state.aspectSouthEast,
      aspectSouth:
        aspects.find((a) => a.type_en === "South") || state.aspectSouth,
      aspectSouthWest:
        aspects.find((a) => a.type_en === "SouthWest") || state.aspectSouthWest,
      aspectWest: aspects.find((a) => a.type_en === "West") || state.aspectWest,
      aspectNorthWest:
        aspects.find((a) => a.type_en === "NorthWest") || state.aspectNorthWest,
    })),

  removeAspect: (aspectId) =>
    set((state) => {
      const aspectToRemove = state.aspects.find((a) => a.id === aspectId);
      return {
        aspects: state.aspects.filter((a) => a.id !== aspectId),
        ...(aspectToRemove?.type_en === "Flat" && { aspectFlat: null }),
        ...(aspectToRemove?.type_en === "North" && { aspectNorth: null }),
        ...(aspectToRemove?.type_en === "NorthEast" && {
          aspectNorthEast: null,
        }),
        ...(aspectToRemove?.type_en === "East" && { aspectEast: null }),
        ...(aspectToRemove?.type_en === "SouthEast" && {
          aspectSouthEast: null,
        }),
        ...(aspectToRemove?.type_en === "South" && { aspectSouth: null }),
        ...(aspectToRemove?.type_en === "SouthWest" && {
          aspectSouthWest: null,
        }),
        ...(aspectToRemove?.type_en === "West" && { aspectWest: null }),
        ...(aspectToRemove?.type_en === "NorthWest" && {
          aspectNorthWest: null,
        }),
      };
    }),
});
