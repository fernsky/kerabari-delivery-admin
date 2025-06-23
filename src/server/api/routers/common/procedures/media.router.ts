import { createTRPCRouter } from "@/server/api/trpc";
import { getPresignedUrls, mediaUploadProcedures, uploadRouter } from "./media";

export const mediaRouter = createTRPCRouter({
  upload: mediaUploadProcedures.uploadMedia,
  getByEntity: mediaUploadProcedures.getMediaByEntity,
  getById: mediaUploadProcedures.getById,
  delete: mediaUploadProcedures.deleteMedia,
  setPrimary: mediaUploadProcedures.setPrimaryMedia,
  getPresignedUrls: mediaUploadProcedures.getPresignedUrls,
});

// Export the upload router for use with uploadthing
export { uploadRouter };
