

/**
 * Types specific to the demographics domain
 */

// Ward-wise religion population response
export interface WardWiseReligionPopulationResponse {
  id: string;
  wardNumber: number;
  religionType: ReligionType;
  population: number;
  createdAt?: string;
  updatedAt?: string;
}

// Ward population summary
export interface WardPopulationSummaryResponse {
  wardNumber: number;
  totalPopulation: number;
}

// Religion population summary
export interface ReligionPopulationSummaryResponse {
  religionType: ReligionType;
  totalPopulation: number;
}

// Filter criteria for ward-wise religion population
export interface WardWiseReligionPopulationFilter {
  wardNumber?: number;
  religionType?: ReligionType;
}

// Create DTO
export interface CreateWardWiseReligionPopulationDto {
  wardNumber: number;
  religionType: ReligionType;
  population: number;
}

// Update DTO
export interface UpdateWardWiseReligionPopulationDto {
  wardNumber: number;
  religionType: ReligionType;
  population: number;
}

// Religion enum type matching the backend
export enum ReligionType {
    HINDU = "HINDU",
    BUDDHIST = "BUDDHIST",
    KIRANT = "KIRANT",
    CHRISTIAN = "CHRISTIAN",
    ISLAM = "ISLAM",
    NATURE = "NATURE",
    BON = "BON",
    JAIN = "JAIN",
    BAHAI = "BAHAI",
    SIKH = "SIKH",
    OTHER = "OTHER",
  }
  