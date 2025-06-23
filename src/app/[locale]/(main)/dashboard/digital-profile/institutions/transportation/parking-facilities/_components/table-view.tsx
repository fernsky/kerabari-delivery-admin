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
import { Edit, Trash2, Image, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "../../../../../../../../../components/digital-profile/pagination";

interface ParkingFacilityItem {
  id: string;
  name: string;
  slug: string;
  type: string;
  wardNumber?: number;
  location?: string;
  condition?: string;
  vehicleCapacity?: number;
  hasRoof?: boolean;
  hasToilet?: boolean;
  primaryMedia?: {
    mediaId: string;
    url: string;
    fileName?: string;
  };
}

interface TableViewProps {
  facilities: ParkingFacilityItem[];
  facilityTypes: { value: string; label: string }[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  onPageChange: (page: number) => void;
  onDelete: (facility: { id: string; name: string }) => void;
  isLoading?: boolean;
}

export function TableView({
  facilities,
  facilityTypes,
  pagination,
  onPageChange,
  onDelete,
  isLoading,
}: TableViewProps) {
  const router = useRouter();

  const handleViewFacility = (facilityId: string) => {
    router.push(
      `/dashboard/digital-profile/institutions/transportation/parking-facilities/${facilityId}`,
    );
  };

  const getFacilityConditionLabel = (condition?: string) => {
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
    if (!condition) return "bg-gray-100 text-gray-800";

    switch (condition) {
      case "EXCELLENT":
      case "GOOD":
        return "bg-green-100 text-green-800";
      case "FAIR":
        return "bg-yellow-100 text-yellow-800";
      case "POOR":
      case "VERY_POOR":
        return "bg-red-100 text-red-800";
      case "UNDER_CONSTRUCTION":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>नाम</TableHead>
              <TableHead>प्रकार</TableHead>
              <TableHead>अवस्था</TableHead>
              <TableHead>स्थान</TableHead>
              <TableHead className="w-36 text-right">कार्यहरू</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {facilities.length > 0 ? (
              facilities.map((facility) => {
                const facilityType = facilityTypes.find(
                  (t) => t.value === facility.type,
                );

                return (
                  <TableRow key={facility.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-start">
                        {facility.primaryMedia?.url ? (
                          <div className="mr-3 flex-shrink-0">
                            <img
                              src={facility.primaryMedia.url}
                              alt={facility.name}
                              className="h-10 w-10 rounded-md object-cover"
                            />
                          </div>
                        ) : (
                          <div className="mr-3 flex-shrink-0 h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                            <Image className="h-5 w-5 text-muted-foreground opacity-70" />
                          </div>
                        )}
                        <div>
                          <button
                            className="hover:underline text-left font-medium"
                            onClick={() => handleViewFacility(facility.id)}
                          >
                            {facility.name}
                          </button>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {facilityType?.label || facility.type}
                    </TableCell>
                    <TableCell>
                      <Badge className={getConditionColor(facility.condition)}>
                        {getFacilityConditionLabel(facility.condition)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs text-muted-foreground">
                        {facility.wardNumber && (
                          <span className="mr-2">
                            वडा नं.: {facility.wardNumber}
                          </span>
                        )}
                        {facility.location && (
                          <span className="mr-2">
                            स्थान: {facility.location}
                          </span>
                        )}
                        {facility.vehicleCapacity && (
                          <span className="mr-2">
                            क्षमता: {facility.vehicleCapacity}
                          </span>
                        )}
                        {facility.hasRoof && (
                          <span className="mr-2">छाना सहित</span>
                        )}
                        {facility.hasToilet && (
                          <span className="mr-2">शौचालय सहित</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewFacility(facility.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            router.push(
                              `/dashboard/digital-profile/institutions/transportation/parking-facilities/edit/${facility.id}`,
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
                              id: facility.id,
                              name: facility.name,
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
                <TableCell colSpan={5} className="text-center py-8">
                  <p className="text-muted-foreground">
                    कुनै पनि पार्किङ सुविधा फेला परेन
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
