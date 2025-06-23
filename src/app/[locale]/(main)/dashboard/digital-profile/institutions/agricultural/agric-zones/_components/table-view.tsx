"use client";

import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Edit,
  Trash2,
  Image,
  Eye,
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
  wardNumber?: number;
  location?: string;
  address?: string;
  areaInHectares?: number;
  soilQuality?: string;
  irrigationSystem?: string;
  majorCrops?: string;
  hasStorage?: boolean;
  hasProcessingUnit?: boolean;
  hasFarmersCooperative?: boolean;
  primaryMedia?: {
    mediaId: string;
    url: string;
    fileName?: string;
  };
}

interface TableViewProps {
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

export function TableView({
  zones,
  zoneTypes,
  pagination,
  onPageChange,
  onDelete,
  isLoading,
}: TableViewProps) {
  const router = useRouter();

  const handleViewZone = (zoneId: string) => {
    router.push(
      `/dashboard/digital-profile/institutions/agricultural/agric-zones/${zoneId}`,
    );
  };

  // Soil quality label helper
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

  // Irrigation system label helper
  const getIrrigationSystemLabel = (system?: string) => {
    if (!system) return "";
    const labels: Record<string, string> = {
      CANAL: "नहर/कुलो",
      SPRINKLER: "स्प्रिंकलर सिंचाई",
      DRIP: "थोपा सिंचाई",
      GROUNDWATER: "भूमिगत पानी",
      RAINWATER_HARVESTING: "वर्षाको पानी संकलन",
      SEASONAL_RIVER: "मौसमी खोला/नदी",
      NONE: "सिंचाई छैन",
      MIXED: "मिश्रित",
    };
    return labels[system] || system;
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>नाम</TableHead>
              <TableHead>प्रकार</TableHead>
              <TableHead>स्थान</TableHead>
              <TableHead>आकार / माटो</TableHead>
              <TableHead>सुविधाहरू</TableHead>
              <TableHead className="w-36 text-right">कार्यहरू</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {zones.length > 0 ? (
              zones.map((zone) => {
                const zoneType = zoneTypes.find((t) => t.value === zone.type);

                return (
                  <TableRow key={zone.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-start">
                        {zone.primaryMedia?.url ? (
                          <div className="mr-3 flex-shrink-0">
                            <img
                              src={zone.primaryMedia.url}
                              alt={zone.name}
                              className="h-10 w-10 rounded-md object-cover"
                            />
                          </div>
                        ) : (
                          <div className="mr-3 flex-shrink-0 h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                            <Sprout className="h-5 w-5 text-muted-foreground opacity-70" />
                          </div>
                        )}
                        <div>
                          <button
                            className="hover:underline text-left font-medium"
                            onClick={() => handleViewZone(zone.id)}
                          >
                            {zone.name}
                          </button>
                          {zone.majorCrops && (
                            <div className="text-xs text-muted-foreground mt-1">
                              {zone.majorCrops.substring(0, 30)}
                              {zone.majorCrops.length > 30 ? "..." : ""}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{zoneType?.label || zone.type}</TableCell>
                    <TableCell>
                      <div className="text-xs text-muted-foreground">
                        {zone.wardNumber && (
                          <span className="mr-2">
                            वडा नं.: {zone.wardNumber}
                          </span>
                        )}
                        {zone.location && (
                          <span className="mr-2">{zone.location}</span>
                        )}
                        {zone.address && <span>{zone.address}</span>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        {zone.areaInHectares && (
                          <div className="text-xs">
                            <span className="mr-1">क्षेत्रफल:</span>
                            <span className="font-medium">
                              {zone.areaInHectares} हेक्टर
                            </span>
                          </div>
                        )}
                        {zone.soilQuality && (
                          <div className="text-xs">
                            <span className="mr-1">माटो:</span>
                            <span className="font-medium">
                              {getSoilQualityLabel(zone.soilQuality)}
                            </span>
                          </div>
                        )}
                        {zone.irrigationSystem && (
                          <div className="text-xs flex items-center">
                            <Droplet className="h-3 w-3 mr-1" />
                            <span>
                              {getIrrigationSystemLabel(zone.irrigationSystem)}
                            </span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {zone.hasStorage && (
                          <Badge variant="outline">
                            <Database className="h-3 w-3 mr-1" />
                            भण्डारण
                          </Badge>
                        )}
                        {zone.hasProcessingUnit && (
                          <Badge variant="outline">प्रशोधन</Badge>
                        )}
                        {zone.hasFarmersCooperative && (
                          <Badge variant="outline">सहकारी</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewZone(zone.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
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
                          onClick={() =>
                            onDelete({
                              id: zone.id,
                              name: zone.name,
                            })
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <p className="text-muted-foreground">
                    कुनै पनि कृषि क्षेत्र फेला परेन
                  </p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {pagination.totalPages > 1 && (
        <div className="flex justify-center mt-6">
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
