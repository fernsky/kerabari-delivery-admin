import { Client as MinioClient } from "minio";
import { env } from "@/env";

/**
 * Generate a presigned URL for a file in MinIO storage
 * @param minio MinIO client instance
 * @param filePath Path to the file in MinIO storage
 * @param expirySeconds Time in seconds until the URL expires
 * @returns A presigned URL for the specified file
 */
export async function generatePresignedUrl(
  minio: MinioClient,
  filePath: string,
  expirySeconds: number = 24 * 60 * 60, // Default: 24 hours
): Promise<string | null> {
  try {
    if (!env.BUCKET_NAME) {
      throw new Error("Bucket name not configured");
    }

    // Remove leading slash if present
    const cleanFilePath = filePath.startsWith("/")
      ? filePath.substring(1)
      : filePath;

    return await minio.presignedGetObject(
      env.BUCKET_NAME,
      cleanFilePath,
      expirySeconds,
    );
  } catch (error) {
    console.error(`Failed to generate presigned URL for ${filePath}:`, error);
    return null;
  }
}

/**
 * Generate presigned URLs for multiple media files in one batch
 */
export async function generateBatchPresignedUrls(
  minioClient: MinioClient,
  mediaFiles: Array<{ id: string; filePath: string; fileName?: string }>,
  expirySeconds = 24 * 60 * 60, // Default 24 hour expiry
) {
  return Promise.all(
    mediaFiles.map(async (file) => {
      try {
        // Generate the presigned URL
        const url = await minioClient.presignedGetObject(
          env.BUCKET_NAME!,
          file.filePath, // Use the filePath from the database
          expirySeconds,
        );

        return {
          id: file.id,
          url,
          fileName: file.fileName || file.id,
        };
      } catch (error) {
        console.error(`Error generating presigned URL for ${file.id}:`, error);
        return {
          id: file.id,
          url: null,
          fileName: file.fileName || file.id,
        };
      }
    }),
  );
}
