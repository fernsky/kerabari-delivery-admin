import { createTRPCRouter } from "@/server/api/trpc";
import { getAllAgricZones } from "./procedures/get-agric-zones";
import { getAgricZoneById } from "./procedures/get-agric-zone-by-id";
import { getAgricZoneBySlug } from "./procedures/get-agric-zone-by-slug";
import { createAgricZone } from "./procedures/create-agric-zone";
import { updateAgricZone } from "./procedures/update-agric-zone";
import { deleteAgricZone } from "./procedures/delete-agric-zone";

export const agricZoneRouter = createTRPCRouter({
  getAll: getAllAgricZones,
  getById: getAgricZoneById,
  getBySlug: getAgricZoneBySlug,
  create: createAgricZone,
  update: updateAgricZone,
  delete: deleteAgricZone,
});
