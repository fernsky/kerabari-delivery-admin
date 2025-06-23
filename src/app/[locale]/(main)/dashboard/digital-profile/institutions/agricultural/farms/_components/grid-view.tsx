"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Edit, Trash2, Eye, Tractor, Milk, Leaf, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/digital-profile";

interface FarmItem {
  id: string;
  name: string;
  slug: string;
  farmType: string;
  farmingSystem?: string;
  description?: string;
  wardNumber?: number;
  location?: string;
  address?: string;
  totalAreaInHectares?: number;
  cultivatedAreaInHectares?: number;
  ownerName?: string;
  hasLivestock?: boolean;
  livestockTypes?: string;
  mainCrops?: string;
  secondaryCrops?: string;
  cropRotation?: boolean;
  intercropping?: boolean;
  isVerified?: boolean;
  primaryMedia?: {
    mediaId: string;
    url: string;
    fileName?: string;
  };
}

interface GridViewProps {
  farms: FarmItem[];
  farmTypes: { value: string; label: string }[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  onPageChange: (page: number) => void;
  onDelete: (farm: { id: string; name: string }) => void;
  isLoading?: boolean;
}

export function GridView({
  farms,
  farmTypes,
  pagination,
  onPageChange,
  onDelete,
  isLoading,
}: GridViewProps) {
  const router = useRouter();

  const handleViewFarm = (farmId: string) => {
    router.push(
      `/dashboard/digital-profile/institutions/agricultural/farms/${farmId}`,
    );
  };

  const getFarmTypeColor = (type: string) => {
    switch (type) {
      case "CROP_FARM":
        return "bg-green-50 text-green-600 border-green-200";
      case "LIVESTOCK_FARM":
        return "bg-amber-50 text-amber-600 border-amber-200";
      case "MIXED_FARM":
        return "bg-blue-50 text-blue-600 border-blue-200";
      case "POULTRY_FARM":
        return "bg-orange-50 text-orange-600 border-orange-200";
      case "DAIRY_FARM":
        return "bg-cyan-50 text-cyan-600 border-cyan-200";
      case "AQUACULTURE_FARM":
        return "bg-indigo-50 text-indigo-600 border-indigo-200";
      case "HORTICULTURE_FARM":
        return "bg-emerald-50 text-emerald-600 border-emerald-200";
      case "APICULTURE_FARM":
        return "bg-yellow-50 text-yellow-600 border-yellow-200";
      case "SERICULTURE_FARM":
        return "bg-purple-50 text-purple-600 border-purple-200";
      case "ORGANIC_FARM":
        return "bg-lime-50 text-lime-600 border-lime-200";
      case "COMMERCIAL_FARM":
        return "bg-red-50 text-red-600 border-red-200";
      case "SUBSISTENCE_FARM":
        return "bg-sky-50 text-sky-600 border-sky-200";
      case "AGROFORESTRY":
        return "bg-teal-50 text-teal-600 border-teal-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Get farming system label helper
  const getFarmingSystemLabel = (system?: string) => {
    if (!system) return "";
    const systems: Record<string, string> = {
      CONVENTIONAL: "परम्परागत",
      ORGANIC: "जैविक",
      INTEGRATED: "एकीकृत",
      CONSERVATION: "संरक्षणात्मक",
      HYDROPONIC: "हाइड्रोपोनिक",
      PERMACULTURE: "परमाकल्चर",
      BIODYNAMIC: "जैव गतिशील",
      TRADITIONAL: "परम्परागत",
      MIXED: "मिश्रित",
    };
    return systems[system] || system;
  };

  if (farms.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">कुनै पनि फार्म फेला परेन</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {farms.map((farm) => {
          const farmType = farmTypes.find((t) => t.value === farm.farmType);

          return (
            <Card key={farm.id} className="overflow-hidden">
              <div
                className="aspect-video relative bg-muted cursor-pointer"
                onClick={() => handleViewFarm(farm.id)}
              >
                {farm.primaryMedia?.url ? (
                  <img
                    src={farm.primaryMedia.url}
                    alt={farm.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted">
                    <Tractor className="h-12 w-12 text-muted-foreground opacity-20" />
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-1">
                  <Badge className={getFarmTypeColor(farm.farmType)}>
                    {farmType?.label}
                  </Badge>
                  {farm.isVerified && (
                    <Badge
                      variant="outline"
                      className="bg-green-50 border-green-200"
                    >
                      <Check className="h-3 w-3 text-green-600" />
                    </Badge>
                  )}
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start gap-2">
                  <h3
                    className="font-medium text-lg truncate cursor-pointer hover:underline flex-1"
                    onClick={() => handleViewFarm(farm.id)}
                  >
                    {farm.name}
                  </h3>
                </div>

                {farm.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {farm.description}
                  </p>
                )}

                <div className="flex flex-wrap gap-1 mt-3">
                  {farm.wardNumber && (
                    <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
                      वडा नं. {farm.wardNumber}
                    </div>
                  )}
                  {farm.location && (
                    <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
                      {farm.location}
                    </div>
                  )}
                  {farm.totalAreaInHectares && (
                    <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
                      {farm.totalAreaInHectares} हे.
                    </div>
                  )}
                </div>

                <div className="mt-3">
                  {farm.farmingSystem && (
                    <div className="text-sm text-muted-foreground">
                      {getFarmingSystemLabel(farm.farmingSystem)}
                    </div>
                  )}

                  {farm.mainCrops && (
                    <p className="text-sm flex gap-1 items-center mt-1">
                      <Leaf className="h-4 w-4 text-green-600" />
                      <span className="line-clamp-1">{farm.mainCrops}</span>
                    </p>
                  )}

                  {farm.hasLivestock && farm.livestockTypes && (
                    <p className="text-sm flex gap-1 items-center mt-1">
                      <Milk className="h-4 w-4 text-amber-600" />
                      <span className="line-clamp-1">
                        {farm.livestockTypes}
                      </span>
                    </p>
                  )}

                  {farm.ownerName && (
                    <p className="text-xs text-muted-foreground mt-2">
                      मालिक: {farm.ownerName}
                    </p>
                  )}
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {farm.cropRotation && (
                    <Badge variant="outline" className="text-xs">
                      बाली चक्र
                    </Badge>
                  )}
                  {farm.intercropping && (
                    <Badge variant="outline" className="text-xs">
                      अन्तरबाली
                    </Badge>
                  )}
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between border-t mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => handleViewFarm(farm.id)}
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
                        `/dashboard/digital-profile/institutions/agricultural/farms/edit/${farm.id}`,
                      )
                    }
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onDelete({ id: farm.id, name: farm.name })}
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
