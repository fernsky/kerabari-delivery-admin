import { createTRPCRouter } from "@/server/api/trpc";
import { getAllParkingFacilities } from "./procedures/get-parking-facilities";
import { getParkingFacilityById } from "./procedures/get-parking-facility-by-id";
import { getParkingFacilityBySlug } from "./procedures/get-parking-facility-by-slug";
import { createParkingFacility } from "./procedures/create-parking-facility";
import { updateParkingFacility } from "./procedures/update-parking-facility";
import { deleteParkingFacility } from "./procedures/delete-parking-facility";

export const parkingFacilityRouter = createTRPCRouter({
  getAll: getAllParkingFacilities,
  getById: getParkingFacilityById,
  getBySlug: getParkingFacilityBySlug,
  create: createParkingFacility,
  update: updateParkingFacility,
  delete: deleteParkingFacility,
});
