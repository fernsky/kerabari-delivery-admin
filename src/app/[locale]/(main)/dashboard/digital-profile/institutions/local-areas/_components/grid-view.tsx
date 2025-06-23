"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { MapPin, Edit, Trash2, Eye, Image } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "./pagination";

interface LocationItem {
  id: string;
  name: string;
  slug: string;
  type: string;
  description?: string;
  isNewSettlement?: boolean;
  isTownPlanned?: boolean;
  pointGeometry?: {
    type: string;
    coordinates: [number, number];
  };
  primaryMedia?: {
    mediaId: string;
    url: string;
    fileName?: string;
  };
}

interface GridViewProps {
  locations: LocationItem[];
  locationTypes: { value: string; label: string }[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  onPageChange: (page: number) => void;
  onDelete: (location: { id: string; name: string }) => void;
  isLoading?: boolean;
}

export function GridView({
  locations,
  locationTypes,
  pagination,
  onPageChange,
  onDelete,
  isLoading,
}: GridViewProps) {
  const router = useRouter();

  const handleViewLocation = (locationId: string) => {
    // Navigate to location detail page using ID
    router.push(
      `/dashboard/digital-profile/institutions/local-areas/${locationId}`,
    );
  };

  if (locations.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">कुनै पनि स्थान फेला परेन</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {locations.map((location) => {
          const locationType = locationTypes.find(
            (t) => t.value === location.type,
          );

          return (
            <Card key={location.id} className="overflow-hidden">
              <div
                className="aspect-video relative bg-muted cursor-pointer"
                onClick={() => handleViewLocation(location.id)}
              >
                {location.primaryMedia?.url ? (
                  <img
                    src={location.primaryMedia.url}
                    alt={location.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted">
                    <Image className="h-12 w-12 text-muted-foreground opacity-20" />
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-1">
                  <Badge variant="secondary">{locationType?.label}</Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <h3
                  className="font-medium text-lg truncate cursor-pointer hover:underline"
                  onClick={() => handleViewLocation(location.id)}
                >
                  {location.name}
                </h3>
                {location.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {location.description}
                  </p>
                )}
                {location.pointGeometry && (
                  <div className="flex items-center text-xs text-muted-foreground mt-2">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span>
                      {location.pointGeometry.coordinates[1].toFixed(6)},
                      {location.pointGeometry.coordinates[0].toFixed(6)}
                    </span>
                  </div>
                )}
                <div className="flex flex-wrap gap-1 mt-3">
                  {location.isNewSettlement && (
                    <Badge
                      variant="outline"
                      className="text-blue-600 bg-blue-50 border-blue-200"
                    >
                      नयाँ बस्ती
                    </Badge>
                  )}
                  {location.isTownPlanned && (
                    <Badge
                      variant="outline"
                      className="text-green-600 bg-green-50 border-green-200"
                    >
                      नियोजित शहरी क्षेत्र
                    </Badge>
                  )}
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between border-t mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => handleViewLocation(location.id)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  हेर्नुहोस्
                </Button>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() =>
                      router.push(
                        `/dashboard/digital-profile/institutions/local-areas/edit/${location.id}`,
                      )
                    }
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() =>
                      onDelete({ id: location.id, name: location.name })
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {pagination.totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </>
  );
}
