import { createTRPCRouter } from "@/server/api/trpc";
import { getAllGrazingAreas } from "./procedures/get-grazing-areas";
import { getGrazingAreaById } from "./procedures/get-grazing-area-by-id";
import { getGrazingAreaBySlug } from "./procedures/get-grazing-area-by-slug";
import { createGrazingArea } from "./procedures/create-grazing-area";
import { updateGrazingArea } from "./procedures/update-grazing-area";
import { deleteGrazingArea } from "./procedures/delete-grazing-area";

export const grazingAreaRouter = createTRPCRouter({
  getAll: getAllGrazingAreas,
  getById: getGrazingAreaById,
  getBySlug: getGrazingAreaBySlug,
  create: createGrazingArea,
  update: updateGrazingArea,
  delete: deleteGrazingArea,
});
