"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Edit, Trash2, Eye, Image, Fuel, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "./pagination";

interface PetrolPumpItem {
  id: string;
  name: string;
  slug: string;
  type: string;
  description?: string;
  wardNumber?: number;
  locality?: string;
  address?: string;
  hasEVCharging?: boolean;
  hasCarWash?: boolean;
  hasConvenienceStore?: boolean;
  hasRestroom?: boolean;
  hasAirFilling?: boolean;
  operatingHours?: string;
  ownerName?: string;
  primaryMedia?: {
    mediaId: string;
    url: string;
    fileName?: string;
  };
}

interface GridViewProps {
  pumps: PetrolPumpItem[];
  pumpTypes: { value: string; label: string }[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  onPageChange: (page: number) => void;
  onDelete: (pump: { id: string; name: string }) => void;
  isLoading?: boolean;
}

export function GridView({
  pumps,
  pumpTypes,
  pagination,
  onPageChange,
  onDelete,
  isLoading,
}: GridViewProps) {
  const router = useRouter();

  const handleViewPump = (pumpId: string) => {
    router.push(
      `/dashboard/digital-profile/institutions/transportation/petrol-pumps/${pumpId}`,
    );
  };

  const getPumpTypeColor = (type: string) => {
    switch (type) {
      case "PETROL":
        return "bg-green-50 text-green-600 border-green-200";
      case "DIESEL":
        return "bg-yellow-50 text-yellow-600 border-yellow-200";
      case "PETROL_DIESEL":
        return "bg-blue-50 text-blue-600 border-blue-200";
      case "CNG":
        return "bg-purple-50 text-purple-600 border-purple-200";
      case "EV_CHARGING":
        return "bg-indigo-50 text-indigo-600 border-indigo-200";
      case "MULTIPURPOSE":
        return "bg-amber-50 text-amber-600 border-amber-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (pumps.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">कुनै पनि पेट्रोल पम्प फेला परेन</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {pumps.map((pump) => {
          const pumpType = pumpTypes.find((t) => t.value === pump.type);

          return (
            <Card key={pump.id} className="overflow-hidden">
              <div
                className="aspect-video relative bg-muted cursor-pointer"
                onClick={() => handleViewPump(pump.id)}
              >
                {pump.primaryMedia?.url ? (
                  <img
                    src={pump.primaryMedia.url}
                    alt={pump.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted">
                    <Fuel className="h-12 w-12 text-muted-foreground opacity-20" />
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-1">
                  <Badge className={getPumpTypeColor(pump.type)}>
                    {pumpType?.label}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start gap-2">
                  <h3
                    className="font-medium text-lg truncate cursor-pointer hover:underline flex-1"
                    onClick={() => handleViewPump(pump.id)}
                  >
                    {pump.name}
                  </h3>
                </div>

                {pump.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {pump.description}
                  </p>
                )}

                <div className="flex flex-wrap gap-1 mt-3">
                  {pump.wardNumber && (
                    <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
                      वडा नं. {pump.wardNumber}
                    </div>
                  )}
                  {pump.locality && (
                    <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
                      {pump.locality}
                    </div>
                  )}
                  {pump.operatingHours && (
                    <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
                      {pump.operatingHours}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-1 mt-2">
                  {pump.hasEVCharging && (
                    <Badge className="bg-blue-100 text-blue-800">
                      <Zap className="h-3 w-3 mr-1" />
                      इ-चार्जिंग
                    </Badge>
                  )}
                  {pump.hasCarWash && <Badge variant="outline">कार वाश</Badge>}
                  {pump.hasConvenienceStore && (
                    <Badge variant="outline">किराना पसल</Badge>
                  )}
                  {pump.hasRestroom && <Badge variant="outline">शौचालय</Badge>}
                  {pump.hasAirFilling && (
                    <Badge variant="outline">हावा भर्ने</Badge>
                  )}
                </div>

                {pump.ownerName && (
                  <p className="text-xs text-muted-foreground mt-2">
                    संचालक: {pump.ownerName}
                  </p>
                )}
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between border-t mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => handleViewPump(pump.id)}
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
                        `/dashboard/digital-profile/institutions/transportation/petrol-pumps/edit/${pump.id}`,
                      )
                    }
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onDelete({ id: pump.id, name: pump.name })}
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
