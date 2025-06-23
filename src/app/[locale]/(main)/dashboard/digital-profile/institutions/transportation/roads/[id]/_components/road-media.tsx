"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Image, X, FileText, Video, FileImage } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface RoadMediaProps {
  roadId: string;
  media: any[];
}

export function RoadMedia({ roadId, media }: RoadMediaProps) {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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

  // Handle media delete
  const handleDelete = (mediaId: string) => {
    if (confirm("के तपाईं निश्चित हुनुहुन्छ?")) {
      deleteMedia({ id: mediaId });
    }
  };

  // Handle set primary media
  const handleSetPrimary = (mediaId: string) => {
    setPrimaryMedia({
      mediaId,
      entityId: roadId,
      entityType: "ROAD",
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
            सडकको फोटोहरू
          </CardTitle>
        </CardHeader>
        <CardContent>
          {media.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>कुनै फोटो फेला परेन</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {media.map((item) => (
                <div
                  key={item.id}
                  className={`group relative border rounded-md overflow-hidden ${
                    item.isPrimary ? "ring-2 ring-primary ring-offset-1" : ""
                  }`}
                >
                  {item.mimeType?.startsWith("image/") ? (
                    <div
                      className="aspect-video cursor-pointer"
                      onClick={() => setSelectedImage(item.url)}
                    >
                      <img
                        src={item.url}
                        alt={item.fileName || "Image"}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video flex items-center justify-center bg-muted">
                      {getMediaIcon(item.mimeType)}
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
                      onClick={() => handleDelete(item.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lightbox */}
      {renderLightbox()}
    </>
  );
}
