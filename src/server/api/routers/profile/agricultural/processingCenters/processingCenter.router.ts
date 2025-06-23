import { createTRPCRouter } from "@/server/api/trpc";
import { getAllProcessingCenters } from "./procedures/get-processing-centers";
import { getProcessingCenterById } from "./procedures/get-processing-center-by-id";
import { getProcessingCenterBySlug } from "./procedures/get-processing-center-by-slug";
import { createProcessingCenter } from "./procedures/create-processing-center";
import { updateProcessingCenter } from "./procedures/update-processing-center";
import { deleteProcessingCenter } from "./procedures/delete-processing-center";

export const processingCenterRouter = createTRPCRouter({
  getAll: getAllProcessingCenters,
  getById: getProcessingCenterById,
  getBySlug: getProcessingCenterBySlug,
  create: createProcessingCenter,
  update: updateProcessingCenter,
  delete: deleteProcessingCenter,
});
