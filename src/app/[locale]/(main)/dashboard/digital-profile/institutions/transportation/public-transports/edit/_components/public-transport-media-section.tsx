"use client";

import { useRef, useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Image,
  X,
  FileText,
  Video,
  FileImage,
  Bus,
  Loader,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { FileUploader } from "@/components/shared/file-upload/custom-uploader";

interface MediaFile {
  url: string | null;
  id: string;
  fileName: string;
  filePath: string;
  title: string | null;
  description: string | null;
  mimeType: string | null;
  isPrimary: boolean | null;
  displayOrder: number | null;
}

interface PublicTransportMediaSectionProps {
  transportId: string;
  media: any[];
}

export function PublicTransportMediaSection({
  transportId,
  media,
}: PublicTransportMediaSectionProps) {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [processedMediaIds, setProcessedMediaIds] = useState(new Set<string>());

  // Get presigned URLs for existing media
  const { data: presignedUrls, isLoading: loadingUrls } =
    api.common.media.getPresignedUrls.useQuery(
      {
        mediaIds: media.map((m) => m.id),
      },
      {
        enabled: media.length > 0,
      },
    );

  useEffect(() => {
    if (media && presignedUrls) {
      // Create a set of processed media IDs
      const mediaIds = new Set(media.map((m) => m.id));
      setProcessedMediaIds(mediaIds);

      // Combine initial media with presigned URLs
      const mediaWithUrls = media.map((m) => {
        const presignedUrl = presignedUrls.find((item) => item.id === m.id);
        return {
          ...m,
          fileUrl: presignedUrl?.url || m.url,
          isPrimary: m.isPrimary,
        };
      });
      setMediaFiles(mediaWithUrls);
    } else if (media) {
      // Use available URLs if presigned URLs are not available yet
      setProcessedMediaIds(new Set(media.map((m) => m.id)));
      setMediaFiles(
        media.map((m) => ({
          ...m,
          fileUrl: m.url,
        })),
      );
    }
  }, [media, presignedUrls]);

  // Delete media mutation
  const { mutate: deleteMedia, isLoading: isDeleting } =
    api.common.media.delete.useMutation({
      onSuccess: () => {
        toast.success("मिडिया हटाइयो");
        router.refresh();
      },
      onError: (error) => {
        toast.error(`मिडिया हटाउन असफल: ${error.message}`);
      },
    });

  // Set primary media mutation
  const { mutate: setPrimaryMedia } = api.common.media.setPrimary.useMutation({
    onSuccess: () => {
      toast.success("प्राथमिक मिडिया अपडेट गरियो");
      router.refresh();
    },
    onError: (error) => {
      toast.error(`प्राथमिक मिडिया अपडेट गर्न असफल: ${error.message}`);
    },
  });

  // Upload media mutation with enhanced direct file upload support
  const { mutate: addMedia } = api.common.media.upload.useMutation({
    onSuccess: (data) => {
      // Check if this media already exists in our state to prevent duplicates
      if (!processedMediaIds.has(data.id)) {
        toast.success("मिडिया सफलतापूर्वक थपियो");

        // Add to processed media IDs
        setProcessedMediaIds((prev) => new Set(prev).add(data.id));

        // Add new file to the local list with full data including id
        setMediaFiles((prev) => [
          ...prev,
          {
            id: data.id,
            fileName: data.fileName || "",
            filePath: data.filePath || "",
            url: null,
            title: data.title || null,
            description: data.description || null,
            mimeType: data.mimeType || null,
            isPrimary: prev.length === 0, // first file is primary
            displayOrder: prev.length, // auto-increment order
          },
        ]);

        router.refresh();
      }
    },
    onError: (error: any) => {
      toast.error(`मिडिया थप्न असफल: ${error.message}`);
    },
  });

  const handleFileUploadComplete = (fileData: any) => {
    // If this media is already in our list, don't add it again
    if (processedMediaIds.has(fileData.id)) {
      return;
    }

    // The file is already uploaded through the FileUploader component
    addMedia({
      fileKey: fileData.id || fileData.fileKey,
      fileUrl: fileData.fileUrl || fileData.url || "",
      fileName: fileData.id || fileData.fileKey || fileData.fileName,
      fileSize: fileData.fileSize || 0,
      mimeType: fileData.mimeType || "image/jpeg",
      entityId: transportId,
      entityType: "PUBLIC_TRANSPORT",
      isPrimary: mediaFiles.length === 0,
      fileContent: fileData.fileContent,
    });
  };

  const handleDeleteFile = (mediaId: string) => {
    // Remove from state for UI responsiveness
    setMediaFiles((prev) => prev.filter((file) => file.id !== mediaId));

    // Remove from processed IDs
    const newProcessedIds = new Set(processedMediaIds);
    newProcessedIds.delete(mediaId);
    setProcessedMediaIds(newProcessedIds);

    // Delete from server
    deleteMedia({ id: mediaId });
  };

  const handleSetPrimary = (mediaId: string) => {
    // Update state for UI responsiveness
    setMediaFiles((prev) =>
      prev.map((file) => ({
        ...file,
        isPrimary: file.id === mediaId,
      })),
    );

    // Update on server
    setPrimaryMedia({
      mediaId,
      entityId: transportId,
      entityType: "PUBLIC_TRANSPORT",
    });
  };

  // Get media icon based on type
  const getMediaIcon = (mimeType: string) => {
    if (mimeType?.startsWith("image/")) return <Image className="h-4 w-4" />;
    if (mimeType?.startsWith("video/")) return <Video className="h-4 w-4" />;
    if (mimeType?.startsWith("application/pdf"))
      return <FileText className="h-4 w-4" />;
    return <FileImage className="h-4 w-4" />;
  };

  // Render image lightbox
  const renderLightbox = () => {
    if (!selectedImage) return null;

    return (
      <div
        className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
        onClick={() => setSelectedImage(null)}
      >
        <div className="relative max-w-4xl max-h-screen">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-black/50 text-white z-10"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage(null);
            }}
          >
            <X className="h-6 w-6" />
          </Button>
          <img
            src={selectedImage}
            alt="Full size"
            className="max-w-full max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      </div>
    );
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="h-5 w-5 text-muted-foreground" />
            सार्वजनिक यातायातको फोटोहरू
          </CardTitle>
          <CardDescription>
            यातायातको फोटोहरू अपलोड वा व्यवस्थापन गर्नुहोस्
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FileUploader
            maxFiles={10}
            uploadType="image"
            entityId={transportId}
            entityType="PUBLIC_TRANSPORT"
            onUploadComplete={handleFileUploadComplete}
            onUploadError={(error) =>
              toast.error(`अपलोड त्रुटि: ${error.message}`)
            }
          />

          {loadingUrls && (
            <p className="text-sm text-muted-foreground mt-4">
              फोटोहरू लोड हुँदैछ...
            </p>
          )}

          {mediaFiles.length === 0 && !loadingUrls ? (
            <div className="text-center py-12 text-muted-foreground mt-6">
              <Bus className="h-20 w-20 mx-auto opacity-10 mb-4" />
              <p>कुनै फोटो फेला परेन</p>
              <p className="text-sm mt-2">
                कृपया माथिको अपलोड बटन प्रयोग गरेर फोटोहरू थप्नुहोस्
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
              {mediaFiles.map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    "group relative border rounded-md overflow-hidden",
                    item.isPrimary && "ring-2 ring-primary ring-offset-1",
                  )}
                >
                  {item.mimeType?.startsWith("image/") ? (
                    <div
                      className="aspect-video cursor-pointer"
                      onClick={() => setSelectedImage(item.url)}
                    >
                      <img
                        src={item.url as string}
                        alt={item.fileName || "Image"}
                        className="w-full h-32 object-cover"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video flex items-center justify-center bg-muted h-32">
                      {getMediaIcon(item.mimeType || "")}
                    </div>
                  )}

                  <div className="p-2 flex flex-col gap-1">
                    <div className="text-xs truncate">{item.fileName}</div>
                    <div className="flex gap-1 justify-between items-center">
                      {item.isPrimary && (
                        <Badge variant="secondary" className="text-xs">
                          प्राथमिक
                        </Badge>
                      )}
                      {!item.isPrimary && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs h-6 px-2"
                          onClick={() => handleSetPrimary(item.id)}
                        >
                          प्राथमिक बनाउनुहोस्
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Hover actions */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="destructive"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => handleDeleteFile(item.id)}
                      disabled={isDeleting}
                    >
                      {isDeleting ? (
                        <Loader className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            तपाईंले अपलोड गर्नुभएको फोटोहरू सार्वजनिक रूपमा देखिन्छन् भन्ने कुरा
            सुनिश्चित गर्नुहोस्
          </p>
        </CardFooter>
      </Card>

      {/* Lightbox */}
      {renderLightbox()}
    </>
  );
}
