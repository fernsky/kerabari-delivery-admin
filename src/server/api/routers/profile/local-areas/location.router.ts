import { createTRPCRouter } from "@/server/api/trpc";
import { getAllLocations } from "./procedures/get-locations";
import { getLocationById } from "./procedures/get-location-by-id";
import { getLocationBySlug } from "./procedures/get-location-by-slug";
import { createLocation } from "./procedures/create-location";
import { updateLocation } from "./procedures/update-location";
import { deleteLocation } from "./procedures/delete-location";

// Create router with all procedures
export const locationRouter = createTRPCRouter({
  getAll: getAllLocations,
  getById: getLocationById,
  getBySlug: getLocationBySlug,
  create: createLocation,
  update: updateLocation,
  delete: deleteLocation,
});
