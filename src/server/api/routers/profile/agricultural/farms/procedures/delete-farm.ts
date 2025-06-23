import { protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { farm } from "@/server/db/schema/profile/institutions/agricultural/farms";
import { entityMedia } from "@/server/db/schema/common/entity-media";
import { media } from "@/server/db/schema/common/media";
import { eq, and } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { env } from "@/env";

// Delete a farm
export const deleteFarm = protectedProcedure
  .input(z.string())
  .mutation(async ({ ctx, input }) => {
    // Check permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can delete farms",
      });
    }

    try {
      // Get all media associated with this farm
      const mediaEntries = await ctx.db
        .select({
          mediaId: entityMedia.mediaId,
          filePath: media.filePath,
        })
        .from(entityMedia)
        .innerJoin(media, eq(entityMedia.mediaId, media.id))
        .where(
          and(
            eq(entityMedia.entityId, input),
            eq(entityMedia.entityType, "FARM" as any),
          ),
        );

      // Delete from MinIO
      if (mediaEntries.length > 0) {
        for (const entry of mediaEntries) {
          try {
            await ctx.minio.removeObject(env.BUCKET_NAME!, entry.filePath);
          } catch (err) {
            console.error(
              `Failed to delete file ${entry.filePath} from MinIO:`,
              err,
            );
          }

          // Delete entity-media relationship
          await ctx.db
            .delete(entityMedia)
            .where(eq(entityMedia.mediaId, entry.mediaId));

          // Delete media record
          await ctx.db.delete(media).where(eq(media.id, entry.mediaId));
        }
      }

      // Delete the farm
      await ctx.db.delete(farm).where(eq(farm.id, input));

      return { success: true };
    } catch (error) {
      console.error("Error deleting farm:", error);
      if (error instanceof TRPCError) throw error;

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to delete farm",
      });
    }
  });
