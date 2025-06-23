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
import { MapPin, Edit, Trash2, Image, Eye } from "lucide-react";
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

interface TableViewProps {
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

export function TableView({
  locations,
  locationTypes,
  pagination,
  onPageChange,
  onDelete,
  isLoading,
}: TableViewProps) {
  const router = useRouter();

  const handleViewLocation = (locationId: string, slug?: string) => {
    // Navigate to location detail page using ID
    router.push(
      `/dashboard/digital-profile/institutions/local-areas/${locationId}`,
    );
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>नाम</TableHead>
              <TableHead>प्रकार</TableHead>
              <TableHead>विशेषताहरू</TableHead>
              <TableHead className="w-36 text-right">कार्यहरू</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {locations.length > 0 ? (
              locations.map((location) => {
                const locationType = locationTypes.find(
                  (t) => t.value === location.type,
                );

                return (
                  <TableRow key={location.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-start">
                        {location.primaryMedia?.url ? (
                          <div className="mr-3 flex-shrink-0">
                            <img
                              src={location.primaryMedia.url}
                              alt={location.name}
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
                            onClick={() =>
                              handleViewLocation(location.id, location.slug)
                            }
                          >
                            {location.name}
                          </button>
                          {location.pointGeometry && (
                            <div className="flex items-center text-xs text-muted-foreground mt-1">
                              <MapPin className="h-3 w-3 mr-1" />
                              <span>
                                {location.pointGeometry.coordinates[1].toFixed(
                                  6,
                                )}
                                ,{" "}
                                {location.pointGeometry.coordinates[0].toFixed(
                                  6,
                                )}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {locationType?.label || location.type}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {location.isNewSettlement && (
                          <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                            नयाँ बस्ती
                          </span>
                        )}
                        {location.isTownPlanned && (
                          <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                            नियोजित शहरी क्षेत्र
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            handleViewLocation(location.id, location.slug)
                          }
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
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
                          onClick={() =>
                            onDelete({
                              id: location.id,
                              name: location.name,
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
                <TableCell colSpan={4} className="text-center py-8">
                  <p className="text-muted-foreground">
                    कुनै पनि स्थान फेला परेन
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
