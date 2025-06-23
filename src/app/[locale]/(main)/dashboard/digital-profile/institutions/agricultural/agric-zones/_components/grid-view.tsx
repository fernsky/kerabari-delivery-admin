"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Edit,
  Trash2,
  Eye,
  Image,
  Sprout,
  Droplet,
  Database,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/digital-profile";

interface AgricZoneItem {
  id: string;
  name: string;
  slug: string;
  type: string;
  description?: string;
  wardNumber?: number;
  location?: string;
  address?: string;
  areaInHectares?: number;
  soilQuality?: string;
  irrigationSystem?: string;
  majorCrops?: string;
  seasonalAvailability?: string;
  hasStorage?: boolean;
  hasProcessingUnit?: boolean;
  hasFarmersCooperative?: boolean;
  primaryMedia?: {
    mediaId: string;
    url: string;
    fileName?: string;
  };
}

interface GridViewProps {
  zones: AgricZoneItem[];
  zoneTypes: { value: string; label: string }[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  onPageChange: (page: number) => void;
  onDelete: (zone: { id: string; name: string }) => void;
  isLoading?: boolean;
}

export function GridView({
  zones,
  zoneTypes,
  pagination,
  onPageChange,
  onDelete,
  isLoading,
}: GridViewProps) {
  const router = useRouter();

  const handleViewZone = (zoneId: string) => {
    router.push(
      `/dashboard/digital-profile/institutions/agricultural/agric-zones/${zoneId}`,
    );
  };

  const getZoneTypeColor = (type: string) => {
    switch (type) {
      case "PULSES":
        return "bg-green-50 text-green-600 border-green-200";
      case "OILSEEDS":
        return "bg-yellow-50 text-yellow-600 border-yellow-200";
      case "COMMERCIAL_FLOWER":
        return "bg-pink-50 text-pink-600 border-pink-200";
      case "SEASONAL_CROPS":
        return "bg-blue-50 text-blue-600 border-blue-200";
      case "SUPER_ZONE":
        return "bg-purple-50 text-purple-600 border-purple-200";
      case "POCKET_AREA":
        return "bg-indigo-50 text-indigo-600 border-indigo-200";
      case "MIXED":
        return "bg-amber-50 text-amber-600 border-amber-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Get soil quality label helper
  const getSoilQualityLabel = (quality?: string) => {
    if (!quality) return "";
    const labels: Record<string, string> = {
      EXCELLENT: "उत्तम",
      GOOD: "राम्रो",
      AVERAGE: "औसत",
      POOR: "कमजोर",
      VERY_POOR: "धेरै कमजोर",
    };
    return labels[quality] || quality;
  };

  if (zones.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">कुनै पनि कृषि क्षेत्र फेला परेन</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {zones.map((zone) => {
          const zoneType = zoneTypes.find((t) => t.value === zone.type);

          return (
            <Card key={zone.id} className="overflow-hidden">
              <div
                className="aspect-video relative bg-muted cursor-pointer"
                onClick={() => handleViewZone(zone.id)}
              >
                {zone.primaryMedia?.url ? (
                  <img
                    src={zone.primaryMedia.url}
                    alt={zone.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted">
                    <Sprout className="h-12 w-12 text-muted-foreground opacity-20" />
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-1">
                  <Badge className={getZoneTypeColor(zone.type)}>
                    {zoneType?.label}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start gap-2">
                  <h3
                    className="font-medium text-lg truncate cursor-pointer hover:underline flex-1"
                    onClick={() => handleViewZone(zone.id)}
                  >
                    {zone.name}
                  </h3>
                </div>

                {zone.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {zone.description}
                  </p>
                )}

                <div className="flex flex-wrap gap-1 mt-3">
                  {zone.wardNumber && (
                    <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
                      वडा नं. {zone.wardNumber}
                    </div>
                  )}
                  {zone.location && (
                    <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
                      {zone.location}
                    </div>
                  )}
                  {zone.areaInHectares && (
                    <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
                      {zone.areaInHectares} हेक्टर
                    </div>
                  )}
                </div>

                <div className="mt-3">
                  {zone.majorCrops && (
                    <p className="text-sm font-medium">
                      बालीहरू: {zone.majorCrops}
                    </p>
                  )}

                  {zone.seasonalAvailability && (
                    <p className="text-xs text-muted-foreground">
                      {zone.seasonalAvailability}
                    </p>
                  )}

                  {zone.soilQuality && (
                    <p className="text-xs text-muted-foreground mt-1">
                      माटो: {getSoilQualityLabel(zone.soilQuality)}
                    </p>
                  )}
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {zone.hasStorage && (
                    <Badge variant="outline" className="text-xs">
                      <Database className="h-3 w-3 mr-1" />
                      भण्डारण
                    </Badge>
                  )}
                  {zone.hasProcessingUnit && (
                    <Badge variant="outline" className="text-xs">
                      प्रशोधन
                    </Badge>
                  )}
                  {zone.hasFarmersCooperative && (
                    <Badge variant="outline" className="text-xs">
                      सहकारी
                    </Badge>
                  )}
                  {zone.irrigationSystem && (
                    <Badge variant="outline" className="text-xs">
                      <Droplet className="h-3 w-3 mr-1" />
                      सिंचाई
                    </Badge>
                  )}
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between border-t mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => handleViewZone(zone.id)}
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
                        `/dashboard/digital-profile/institutions/agricultural/agric-zones/edit/${zone.id}`,
                      )
                    }
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onDelete({ id: zone.id, name: zone.name })}
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
