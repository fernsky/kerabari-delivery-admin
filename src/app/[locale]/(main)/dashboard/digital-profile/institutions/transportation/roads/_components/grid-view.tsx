"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Edit, Trash2, Eye, Image, Route } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "./pagination";

interface RoadItem {
  id: string;
  name: string;
  slug: string;
  type: string;
  condition?: string;
  description?: string;
  widthInMeters?: number;
  length?: number;
  hasStreetLights?: boolean;
  hasDivider?: boolean;
  hasPedestrian?: boolean;
  hasBicycleLane?: boolean;
  primaryMedia?: {
    mediaId: string;
    url: string;
    fileName?: string;
  };
}

interface GridViewProps {
  roads: RoadItem[];
  roadTypes: { value: string; label: string }[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  onPageChange: (page: number) => void;
  onDelete: (road: { id: string; name: string }) => void;
  isLoading?: boolean;
}

export function GridView({
  roads,
  roadTypes,
  pagination,
  onPageChange,
  onDelete,
  isLoading,
}: GridViewProps) {
  const router = useRouter();

  const handleViewRoad = (roadId: string) => {
    // Navigate to road detail page using ID
    router.push(
      `/dashboard/digital-profile/institutions/transportation/roads/${roadId}`,
    );
  };

  const getRoadConditionLabel = (condition?: string) => {
    if (!condition) return "अज्ञात";

    const conditions = {
      EXCELLENT: "उत्कृष्ट",
      GOOD: "राम्रो",
      FAIR: "ठीकै",
      POOR: "खराब",
      VERY_POOR: "धेरै खराब",
      UNDER_CONSTRUCTION: "निर्माणाधीन",
    };
    return conditions[condition as keyof typeof conditions] || condition;
  };

  const getConditionColor = (condition?: string) => {
    if (!condition) return "bg-gray-100 text-gray-800 border-gray-200";

    switch (condition) {
      case "EXCELLENT":
      case "GOOD":
        return "bg-green-50 text-green-600 border-green-200";
      case "FAIR":
        return "bg-yellow-50 text-yellow-600 border-yellow-200";
      case "POOR":
      case "VERY_POOR":
        return "bg-red-50 text-red-600 border-red-200";
      case "UNDER_CONSTRUCTION":
        return "bg-blue-50 text-blue-600 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (roads.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">कुनै पनि सडक फेला परेन</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {roads.map((road) => {
          const roadType = roadTypes.find((t) => t.value === road.type);

          return (
            <Card key={road.id} className="overflow-hidden">
              <div
                className="aspect-video relative bg-muted cursor-pointer"
                onClick={() => handleViewRoad(road.id)}
              >
                {road.primaryMedia?.url ? (
                  <img
                    src={road.primaryMedia.url}
                    alt={road.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted">
                    <Route className="h-12 w-12 text-muted-foreground opacity-20" />
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-1">
                  <Badge variant="secondary">{roadType?.label}</Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start gap-2">
                  <h3
                    className="font-medium text-lg truncate cursor-pointer hover:underline flex-1"
                    onClick={() => handleViewRoad(road.id)}
                  >
                    {road.name}
                  </h3>
                  <Badge className={getConditionColor(road.condition)}>
                    {getRoadConditionLabel(road.condition)}
                  </Badge>
                </div>

                {road.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {road.description}
                  </p>
                )}

                <div className="flex flex-wrap gap-1 mt-3">
                  {road.widthInMeters && (
                    <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
                      चौडाई: {road.widthInMeters} मि.
                    </div>
                  )}
                  {road.length && (
                    <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
                      लम्बाई: {road.length} मि.
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-1 mt-2">
                  {road.hasStreetLights && (
                    <Badge variant="outline" className="text-xs">
                      स्ट्रिट लाइट
                    </Badge>
                  )}
                  {road.hasDivider && (
                    <Badge variant="outline" className="text-xs">
                      डिभाइडर
                    </Badge>
                  )}
                  {road.hasPedestrian && (
                    <Badge variant="outline" className="text-xs">
                      पैदल मार्ग
                    </Badge>
                  )}
                  {road.hasBicycleLane && (
                    <Badge variant="outline" className="text-xs">
                      साइकल लेन
                    </Badge>
                  )}
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between border-t mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => handleViewRoad(road.id)}
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
                        `/dashboard/digital-profile/institutions/transportation/roads/edit/${road.id}`,
                      )
                    }
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onDelete({ id: road.id, name: road.name })}
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
