import { createTRPCRouter } from "@/server/api/trpc";
import { getAllReligiousPlaces } from "./procedures/get-religious-places";
import { getReligiousPlaceById } from "./procedures/get-religious-place-by-id";
import { getReligiousPlaceBySlug } from "./procedures/get-religious-place-by-slug";
import { createReligiousPlace } from "./procedures/create-religious-place";
import { updateReligiousPlace } from "./procedures/update-religious-place";
import { deleteReligiousPlace } from "./procedures/delete-religious-place";

export const religiousPlaceRouter = createTRPCRouter({
  getAll: getAllReligiousPlaces,
  getById: getReligiousPlaceById,
  getBySlug: getReligiousPlaceBySlug,
  create: createReligiousPlace,
  update: updateReligiousPlace,
  delete: deleteReligiousPlace,
});
