import { StateCreator } from "zustand";
import { TouristPlace } from "@/server/db/schema/profile";

export interface TouristPlaceState {
  touristPlaces: TouristPlace[];
  addTouristPlace: (place: TouristPlace) => void;
  addTouristPlaces: (places: TouristPlace[]) => void;
  removeTouristPlace: (placeId: string) => void;
}

export const createTouristPlaceSlice: StateCreator<TouristPlaceState> = (
  set,
) => ({
  touristPlaces: [],

  addTouristPlace: (place) =>
    set((state) => ({
      touristPlaces: state.touristPlaces.some((p) => p.id === place.id)
        ? state.touristPlaces
        : [...state.touristPlaces, place],
    })),

  addTouristPlaces: (places) =>
    set((state) => ({
      touristPlaces: [
        ...state.touristPlaces,
        ...places.filter(
          (place) => !state.touristPlaces.some((p) => p.id === place.id),
        ),
      ],
    })),

  removeTouristPlace: (placeId) =>
    set((state) => ({
      touristPlaces: state.touristPlaces.filter((p) => p.id !== placeId),
    })),
});
