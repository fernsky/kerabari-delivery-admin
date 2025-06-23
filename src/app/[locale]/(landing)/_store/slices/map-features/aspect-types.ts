import { Aspect } from "@/server/db/schema/profile";

export interface AspectState {
  aspects: Aspect[];
  aspectFlat: Aspect | null;
  aspectNorth: Aspect | null;
  aspectNorthEast: Aspect | null;
  aspectEast: Aspect | null;
  aspectSouthEast: Aspect | null;
  aspectSouth: Aspect | null;
  aspectSouthWest: Aspect | null;
  aspectWest: Aspect | null;
  aspectNorthWest: Aspect | null;
  addAspect: (aspect: Aspect) => void;
  addAspects: (aspects: Aspect[]) => void;
  removeAspect: (aspectId: string) => void;
}
