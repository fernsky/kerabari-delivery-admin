"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImageIcon, XCircle, Maximize2, Minimize2 } from "lucide-react";
import Image from "next/image";

interface MediaFile {
  id: string;
  fileName: string;
  url: string | null;
  title: string | null;
  description: string | null;
  mimeType: string | null;
  isPrimary: boolean | null;
}

interface FarmMediaProps {
  farmId: string;
  media: MediaFile[];
}

export function FarmMedia({ farmId, media }: FarmMediaProps) {
  const [selectedImage, setSelectedImage] = useState<MediaFile | null>(null);

  // Filter to only show images
  const imageMedia = media.filter((file) =>
    file.mimeType?.startsWith("image/"),
  );

  // Sort so primary image is first
  const sortedMedia = [...imageMedia].sort((a, b) => {
    if (a.isPrimary) return -1;
    if (b.isPrimary) return 1;
    return 0;
  });

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5 text-primary" />
          फार्मका तस्बिरहरू
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sortedMedia.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">
            <ImageIcon className="h-12 w-12 mx-auto opacity-20 mb-4" />
            <h4 className="text-lg font-medium">कुनै तस्बिर छैन</h4>
            <p className="mt-1 text-sm max-w-md mx-auto">
              यस फार्मको लागि कुनै तस्बिर अहिलेसम्म अपलोड गरिएको छैन।
            </p>
          </div>
        ) : (
          <>
            {/* Featured image */}
            {selectedImage ? (
              <div className="relative">
                <div className="aspect-video w-full relative rounded-md overflow-hidden mb-4 border">
                  <Image
                    src={selectedImage.url as string}
                    alt={selectedImage.title || "फार्म तस्बिर"}
                    fill
                    className="object-contain"
                  />
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute top-2 right-2 bg-background/70 rounded-full"
                  onClick={() => setSelectedImage(null)}
                >
                  <Minimize2 className="h-4 w-4" />
                </Button>
                {selectedImage.description && (
                  <p className="text-sm text-muted-foreground mt-1 italic">
                    {selectedImage.description}
                  </p>
                )}
              </div>
            ) : (
              <div className="aspect-video w-full relative rounded-md overflow-hidden mb-4 border">
                <Image
                  src={sortedMedia[0].url as string}
                  alt={sortedMedia[0].title || "फार्म मुख्य तस्बिर"}
                  fill
                  className="object-cover"
                />
                {sortedMedia.length > 1 && (
                  <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center p-2 bg-gradient-to-t from-black/70 to-transparent">
                    <p className="text-white text-sm">
                      जम्मा {sortedMedia.length} तस्बिरहरू
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Thumbnails */}
            {sortedMedia.length > 1 && !selectedImage && (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 mt-4">
                {sortedMedia.map((file) => (
                  <div
                    key={file.id}
                    className="aspect-square relative rounded-md overflow-hidden cursor-pointer border hover:border-primary transition-colors"
                    onClick={() => setSelectedImage(file)}
                  >
                    <Image
                      src={file.url as string}
                      alt={file.title || file.fileName}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 hover:bg-black/10 transition-colors flex items-center justify-center">
                      <Maximize2 className="h-6 w-6 text-white opacity-0 hover:opacity-100 drop-shadow-md" />
                    </div>
                    {file.isPrimary && (
                      <div className="absolute top-1 left-1 bg-primary text-white text-[10px] px-1 rounded">
                        मुख्य
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
