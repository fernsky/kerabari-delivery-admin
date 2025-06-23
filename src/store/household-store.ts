import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Household } from "@/types/household";

interface HouseholdState {
  // Current household being edited
  currentHousehold: Partial<Household> | null;
  
  // Set the current household data
  setCurrentHousehold: (household: Partial<Household> | null) => void;
  
  // Update specific fields in the current household
  updateCurrentHousehold: (updates: Partial<Household>) => void;
  
  // Reset the store
  resetCurrentHousehold: () => void;
}

export const useHouseholdStore = create<HouseholdState>()(
  persist(
    (set) => ({
      currentHousehold: null,
      
      setCurrentHousehold: (household) => 
        set({ currentHousehold: household }),
      
      updateCurrentHousehold: (updates) => 
        set((state) => ({
          currentHousehold: state.currentHousehold 
            ? { ...state.currentHousehold, ...updates } 
            : updates
        })),
      
      resetCurrentHousehold: () => 
        set({ currentHousehold: null }),
    }),
    {
      name: "household-storage",
    }
  )
);
