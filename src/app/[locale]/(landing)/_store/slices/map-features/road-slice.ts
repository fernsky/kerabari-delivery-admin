import { StateCreator } from "zustand";
import { Road } from "@/server/db/schema/profile";

export interface RoadState {
  roads: Road[];
  addRoad: (road: Road) => void;
  addRoads: (roads: Road[]) => void;
  removeRoad: (roadId: string) => void;
}

export const createRoadSlice: StateCreator<RoadState> = (set) => ({
  roads: [],

  addRoad: (road) =>
    set((state) => ({
      roads: state.roads.some((r) => r.id === road.id)
        ? state.roads
        : [...state.roads, road],
    })),

  addRoads: (roads) =>
    set((state) => ({
      roads: [
        ...state.roads,
        ...roads.filter((road) => !state.roads.some((r) => r.id === road.id)),
      ],
    })),

  removeRoad: (roadId) =>
    set((state) => ({
      roads: state.roads.filter((r) => r.id !== roadId),
    })),
});
