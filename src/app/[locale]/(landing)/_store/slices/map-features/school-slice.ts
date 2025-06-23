import { StateCreator } from "zustand";
import { School } from "@/server/db/schema/profile";

export interface SchoolState {
  schools: School[];
  addSchool: (school: School) => void;
  addSchools: (schools: School[]) => void;
  removeSchool: (schoolId: string) => void;
}

export const createSchoolSlice: StateCreator<SchoolState> = (set) => ({
  schools: [],

  addSchool: (school) =>
    set((state) => ({
      schools: state.schools.some((s) => s.id === school.id)
        ? state.schools
        : [...state.schools, school],
    })),

  addSchools: (schools) =>
    set((state) => ({
      schools: [
        ...state.schools,
        ...schools.filter(
          (school) => !state.schools.some((s) => s.id === school.id),
        ),
      ],
    })),

  removeSchool: (schoolId) =>
    set((state) => ({
      schools: state.schools.filter((s) => s.id !== schoolId),
    })),
});
