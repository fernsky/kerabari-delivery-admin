import { createTRPCRouter } from "@/server/api/trpc";
import { getAllHistoricalSites } from "./procedures/get-historical-sites";
import { getHistoricalSiteById } from "./procedures/get-historical-site-by-id";
import { getHistoricalSiteBySlug } from "./procedures/get-historical-site-by-slug";
import { createHistoricalSite } from "./procedures/create-historical-site";
import { updateHistoricalSite } from "./procedures/update-historical-site";
import { deleteHistoricalSite } from "./procedures/delete-historical-site";

export const historicalSiteRouter = createTRPCRouter({
  getAll: getAllHistoricalSites,
  getById: getHistoricalSiteById,
  getBySlug: getHistoricalSiteBySlug,
  create: createHistoricalSite,
  update: updateHistoricalSite,
  delete: deleteHistoricalSite,
});
