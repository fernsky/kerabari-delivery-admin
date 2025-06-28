/**
 * API configuration for different environments
 */

// Base API URLs for different environments
import { getRequiredEnvVar } from "../utils/getRequiredEnvVar";
const API_URLS = {
  development:
    getRequiredEnvVar("NEXT_PUBLIC_API_URL") || "http://localhost:8080/api",
  test: getRequiredEnvVar("NEXT_PUBLIC_API_URL") || "http://localhost:8080/api",
  staging:
    getRequiredEnvVar("NEXT_PUBLIC_API_URL") ||
    "https://staging-api.digital.buddhashantimun.gov.np/api",
  production:
    getRequiredEnvVar("NEXT_PUBLIC_API_URL") ||
    "https://api.digital.buddhashantimun.gov.np/api",
};

// Determine current environment
const getEnvironment = ():
  | "development"
  | "test"
  | "staging"
  | "production" => {
  const env = process.env.NODE_ENV || "development";
  if (env === "production") {
    return process.env.NEXT_PUBLIC_ENV === "staging" ? "staging" : "production";
  }
  return env as "development" | "test";
};

// Config object with API settings
export const apiConfig = {
  baseUrl: API_URLS[getEnvironment()],
  timeout: 30000, // 30 seconds
  version: "v1",
};

// API endpoints
export const endpoints = {
  profile: {
    demographics: {
      wardWiseReligionPopulation: {
        base: "/profile/demographics/ward-wise-religion-population",
        byId: (id: string) =>
          `/profile/demographics/ward-wise-religion-population/${id}`,
        byWard: (wardNumber: number) =>
          `/profile/demographics/ward-wise-religion-population/ward/${wardNumber}`,
        byReligion: (religionType: string) =>
          `/profile/demographics/ward-wise-religion-population/religion/${religionType}`,
        religionSummary:
          "/profile/demographics/ward-wise-religion-population/summary/religion",
        wardSummary:
          "/profile/demographics/ward-wise-religion-population/summary/ward",
      },
    },
  },
};
