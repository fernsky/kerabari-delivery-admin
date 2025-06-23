import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { media } from "@/server/db/schema/common/media";
import { entityMedia } from "@/server/db/schema/common/entity-media";
import { v4 as uuidv4 } from "uuid";
import { and, eq, sql } from "drizzle-orm";
import { env } from "@/env";

// Define common input validation schemas
const baseMediaInputSchema = z.object({
  fileName: z.string(),
  entityId: z.string().optional(),
  entityType: z.string().optional(),
  isPrimary: z.boolean().optional().default(false),
});

// Standard file upload input schema - now supporting base64 data for direct uploads
const uploadInputSchema = baseMediaInputSchema.extend({
  fileKey: z.string().optional(),
  fileUrl: z.string().optional(),
  fileSize: z.number().optional(),
  mimeType: z.string().optional(),
  fileContent: z.string().optional(), // Add base64 content for direct uploads
});

// Direct file upload (similar to photo.ts)
export const uploadMedia = protectedProcedure
  .input(uploadInputSchema)
  .mutation(async ({ ctx, input }) => {
    try {
      if (!process.env.BUCKET_NAME) {
        throw new Error("Bucket name not configured");
      }

      const fileId = input.fileKey || uuidv4();
      const now = new Date();

      // Create the file path in MinIO storage
      const filePath = `/media/${fileId}`;

      // First check if this media already exists to prevent duplication
      const existingMedia = await ctx.db
        .select({ id: media.id })
        .from(media)
        .where(eq(media.id, fileId))
        .limit(1);

      if (existingMedia.length > 0) {
        // If this is just about associating an existing media with a new entity
        if (input.entityId && input.entityType) {
          // Check if the association already exists
          const existingAssoc = await ctx.db
            .select({ id: entityMedia.id })
            .from(entityMedia)
            .where(
              and(
                eq(entityMedia.mediaId, fileId),
                eq(entityMedia.entityId, input.entityId),
                eq(entityMedia.entityType, input.entityType as any),
              ),
            )
            .limit(1);

          if (existingAssoc.length === 0) {
            // Just create the association
            await createMediaEntityAssociation(ctx.db, {
              mediaId: fileId,
              entityId: input.entityId,
              entityType: input.entityType,
              isPrimary: input.isPrimary,
              userId: ctx.user?.id,
            });
          }

          // Return the existing media
          const mediaRecord = await ctx.db
            .select()
            .from(media)
            .where(eq(media.id, fileId))
            .limit(1);

          return {
            ...mediaRecord[0],
            entityId: input.entityId,
            entityType: input.entityType,
            isPrimary: input.isPrimary,
          };
        }
      }

      // Upload file to MinIO if fileContent is provided
      if (input.fileContent) {
        // Extract file content from base64 string
        const matches = input.fileContent.match(
          /^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/,
        );

        if (!matches) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid file format",
          });
        }

        // Get the actual mime type from the data URL
        const mimeType = matches[1];
        // Extract the base64 data
        const base64Data = input.fileContent.replace(
          /^data:[a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+;base64,/,
          "",
        );
        // Convert to buffer
        const buffer = Buffer.from(base64Data, "base64");

        // Set content type metadata
        const metaData = {
          "Content-Type": mimeType,
        };

        // Upload to MinIO
        await ctx.minio.putObject(
          process.env.BUCKET_NAME,
          filePath.substring(1), // Remove leading slash
          buffer,
          buffer.length,
          metaData,
        );
      }

      // Generate a presigned URL for the uploaded file
      let fileUrl: string | null = null;
      try {
        // Create the direct presigned URL without any prefix
        fileUrl = await ctx.minio.presignedGetObject(
          process.env.BUCKET_NAME!,
          filePath.substring(1), // Remove leading slash
          24 * 60 * 60, // 24 hours expiry
        );
      } catch (error) {
        console.error("Failed to generate presigned URL:", error);
      }

      // Begin transaction to ensure data consistency
      return await ctx.db.transaction(async (tx) => {
        // Determine the file type based on MIME type
        const fileType = determineFileType(input.mimeType || "");

        // Insert media record into database
        const mediaRecord = await tx
          .insert(media)
          .values({
            id: fileId,
            fileName: input.fileName,
            filePath: filePath.substring(1), // Store path without leading slash
            fileUrl: fileUrl || null, // Store the raw presigned URL or null
            fileSize: input.fileSize || 0,
            mimeType: input.mimeType || "application/octet-stream",
            type: fileType, // Determine file type from mime
            title: input.fileName,
            createdAt: now,
            updatedAt: now,
            createdBy: ctx.user?.id,
            updatedBy: ctx.user?.id,
          })
          .returning();

        // If entity information is provided, create the entityMedia association
        if (input.entityId && input.entityType) {
          await createMediaEntityAssociation(tx, {
            mediaId: fileId,
            entityId: input.entityId,
            entityType: input.entityType,
            isPrimary: input.isPrimary,
            userId: ctx.user?.id,
            timestamp: now,
          });
        }

        return {
          ...mediaRecord[0],
          url: fileUrl, // Return the raw presigned URL
          entityId: input.entityId,
          entityType: input.entityType,
          isPrimary: input.isPrimary,
        };
      });
    } catch (error) {
      console.error("Media upload error:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to upload media",
        cause: error,
      });
    }
  });

// Helper function to create entity-media associations
async function createMediaEntityAssociation(
  db: any, // Using any type for database to work with both tx and ctx.db
  params: {
    mediaId: string;
    entityId: string;
    entityType: string;
    isPrimary?: boolean;
    userId?: string;
    timestamp?: Date;
  },
) {
  const {
    mediaId,
    entityId,
    entityType,
    isPrimary,
    userId,
    timestamp = new Date(),
  } = params;

  // Generate a unique ID for the entity-media association
  const entityMediaId = uuidv4();

  // Check if there are any existing media for this entity
  const existingMedia = await db
    .select({ count: sql<number>`count(*)` })
    .from(entityMedia)
    .where(
      and(
        eq(entityMedia.entityId, entityId),
        eq(entityMedia.entityType, entityType as any),
      ),
    );

  // Determine if this media should be primary
  const shouldBePrimary =
    isPrimary !== undefined ? isPrimary : existingMedia[0].count === 0;

  // Insert the entity-media relationship
  await db.insert(entityMedia).values({
    id: entityMediaId,
    entityId: entityId,
    entityType: entityType as any,
    mediaId: mediaId,
    isPrimary: shouldBePrimary,
    createdAt: timestamp,
    updatedAt: timestamp,
    createdBy: userId,
    updatedBy: userId,
  });

  // If this is primary, unset primary flag for all other media
  if (shouldBePrimary) {
    await db
      .update(entityMedia)
      .set({
        isPrimary: false,
        updatedAt: timestamp,
        updatedBy: userId,
      })
      .where(
        and(
          eq(entityMedia.entityId, entityId),
          eq(entityMedia.entityType, entityType as any),
          sql`${entityMedia.mediaId} != ${mediaId}`,
        ),
      );
  }
}

// Helper function to determine file type from MIME type
function determineFileType(
  mimeType: string,
): "IMAGE" | "VIDEO" | "DOCUMENT" | "OTHER" {
  if (mimeType.startsWith("image/")) return "IMAGE";
  if (mimeType.startsWith("video/")) return "VIDEO";
  if (
    mimeType.startsWith("application/pdf") ||
    mimeType.startsWith("application/msword") ||
    mimeType.includes("document")
  )
    return "DOCUMENT";
  return "OTHER";
}

// Get media by entity ID and type
export const getMediaByEntity = publicProcedure
  .input(
    z.object({
      entityId: z.string(),
      entityType: z.string(),
    }),
  )
  .query(async ({ ctx, input }) => {
    try {
      // Join media and entityMedia tables to get complete information
      const result = await ctx.db
        .select({
          media: media,
          entityMedia: entityMedia,
        })
        .from(media)
        .innerJoin(entityMedia, eq(media.id, entityMedia.mediaId))
        .where(
          and(
            eq(entityMedia.entityId, input.entityId),
            eq(entityMedia.entityType, input.entityType as any),
          ),
        )
        .orderBy(entityMedia.displayOrder);

      return result.map((item) => ({
        ...item.media,
        isPrimary: item.entityMedia.isPrimary,
        displayOrder: item.entityMedia.displayOrder,
      }));
    } catch (error) {
      console.error("Failed to get media by entity:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch media",
        cause: error,
      });
    }
  });

// Get media by ID
export const getById = publicProcedure
  .input(
    z.object({
      id: z.string(),
    }),
  )
  .query(async ({ ctx, input }) => {
    try {
      const result = await ctx.db
        .select()
        .from(media)
        .where(eq(media.id, input.id))
        .limit(1);

      if (result.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Media not found",
        });
      }

      return result[0];
    } catch (error) {
      if (error instanceof TRPCError) throw error;

      console.error("Failed to get media by ID:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch media",
        cause: error,
      });
    }
  });

// Set a media as primary for an entity
export const setPrimaryMedia = protectedProcedure
  .input(
    z.object({
      mediaId: z.string(),
      entityId: z.string(),
      entityType: z.string(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    try {
      const { mediaId, entityId, entityType } = input;

      // First, unset primary flag for all media associated with this entity
      await ctx.db
        .update(entityMedia)
        .set({
          isPrimary: false,
          updatedAt: new Date(),
          updatedBy: ctx.user?.id,
        })
        .where(
          and(
            eq(entityMedia.entityId, entityId),
            eq(entityMedia.entityType, entityType as any),
          ),
        );

      // Then, set the specified media as primary
      const result = await ctx.db
        .update(entityMedia)
        .set({
          isPrimary: true,
          updatedAt: new Date(),
          updatedBy: ctx.user?.id,
        })
        .where(
          and(
            eq(entityMedia.mediaId, mediaId),
            eq(entityMedia.entityId, entityId),
            eq(entityMedia.entityType, entityType as any),
          ),
        )
        .returning();

      if (result.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Media-entity association not found",
        });
      }

      return { success: true, ...result[0] };
    } catch (error) {
      if (error instanceof TRPCError) throw error;

      console.error("Failed to set primary media:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to update primary media",
        cause: error,
      });
    }
  });

// Delete media by ID
export const deleteMedia = protectedProcedure
  .input(
    z.object({
      id: z.string(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    try {
      // First delete associations in entityMedia
      await ctx.db.delete(entityMedia).where(eq(entityMedia.mediaId, input.id));

      // Then delete the media record
      const result = await ctx.db
        .delete(media)
        .where(eq(media.id, input.id))
        .returning();

      if (result.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Media not found",
        });
      }

      return { success: true, id: input.id };
    } catch (error) {
      if (error instanceof TRPCError) throw error;

      console.error("Failed to delete media:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to delete media",
        cause: error,
      });
    }
  });

// Get presigned URLs for media files
export const getPresignedUrls = publicProcedure
  .input(
    z.object({
      mediaIds: z.array(z.string()),
    }),
  )
  .query(async ({ ctx, input }) => {
    try {
      if (input.mediaIds.length === 0) {
        return [];
      }

      // Get media data from database
      const mediaFiles = await ctx.db
        .select({
          id: media.id,
          filePath: media.filePath,
          fileName: media.fileName,
        })
        .from(media)
        .where(sql`${media.id} IN ${input.mediaIds}`);

      // Generate presigned URLs - using the correct file path from the database
      const results = await Promise.all(
        mediaFiles.map(async (file) => {
          try {
            // Use the filePath from the database record, not the ID
            const presignedUrl = await ctx.minio.presignedGetObject(
              process.env.BUCKET_NAME!,
              file.filePath, // Use filePath instead of ID
              24 * 60 * 60, // 24 hours expiry
            );

            return {
              id: file.id,
              url: presignedUrl, // Return the raw presigned URL
              fileName: file.fileName,
            };
          } catch (error) {
            console.error(
              `Failed to generate presigned URL for ${file.id}:`,
              error,
            );
            return {
              id: file.id,
              url: null,
              fileName: file.fileName,
            };
          }
        }),
      );

      return results;
    } catch (error) {
      console.error("Failed to get presigned URLs:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to generate presigned URLs",
        cause: error,
      });
    }
  });

// Export all TRPC procedures in a grouped object
export const mediaUploadProcedures = {
  uploadMedia,
  getMediaByEntity,
  getById,
  setPrimaryMedia,
  deleteMedia,
  getPresignedUrls,
};

// Create a router for uploadthing (if needed)
export const uploadRouter = createTRPCRouter({
  upload: uploadMedia,
});
