import { create } from "zustand";

interface MapViewState {
  isStreetView: boolean;
  toggleView: () => void;
}

export const useMapViewStore = create<MapViewState>((set) => ({
  isStreetView: true,
  toggleView: () => set((state) => ({ isStreetView: !state.isStreetView })),
}));
