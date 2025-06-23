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
import { Edit, Trash2, Eye, Tractor, Milk, Leaf } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/digital-profile";
import { Check, X } from "lucide-react";

interface FarmItem {
  id: string;
  name: string;
  slug: string;
  farmType: string;
  farmingSystem?: string;
  wardNumber?: number;
  location?: string;
  address?: string;
  totalAreaInHectares?: number;
  cultivatedAreaInHectares?: number;
  ownerName?: string;
  hasLivestock?: boolean;
  livestockTypes?: string;
  mainCrops?: string;
  cropRotation?: boolean;
  isVerified?: boolean;
  primaryMedia?: {
    mediaId: string;
    url: string;
    fileName?: string;
  };
}

interface TableViewProps {
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

export function TableView({
  farms,
  farmTypes,
  pagination,
  onPageChange,
  onDelete,
  isLoading,
}: TableViewProps) {
  const router = useRouter();

  const handleViewFarm = (farmId: string) => {
    router.push(
      `/dashboard/digital-profile/institutions/agricultural/farms/${farmId}`,
    );
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

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>नाम</TableHead>
              <TableHead>प्रकार</TableHead>
              <TableHead>स्थान</TableHead>
              <TableHead>खेती/पशुपालन</TableHead>
              <TableHead>मालिक/क्षेत्रफल</TableHead>
              <TableHead className="text-center">प्रमाणित</TableHead>
              <TableHead className="w-36 text-right">कार्यहरू</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {farms.length > 0 ? (
              farms.map((farm) => {
                const farmType = farmTypes.find(
                  (t) => t.value === farm.farmType,
                );

                return (
                  <TableRow key={farm.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-start">
                        {farm.primaryMedia?.url ? (
                          <div className="mr-3 flex-shrink-0">
                            <img
                              src={farm.primaryMedia.url}
                              alt={farm.name}
                              className="h-10 w-10 rounded-md object-cover"
                            />
                          </div>
                        ) : (
                          <div className="mr-3 flex-shrink-0 h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                            <Tractor className="h-5 w-5 text-muted-foreground opacity-70" />
                          </div>
                        )}
                        <div>
                          <button
                            className="hover:underline text-left font-medium"
                            onClick={() => handleViewFarm(farm.id)}
                          >
                            {farm.name}
                          </button>
                          {farm.farmingSystem && (
                            <div className="text-xs text-muted-foreground mt-1">
                              {getFarmingSystemLabel(farm.farmingSystem)}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {farmType?.label || farm.farmType}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs text-muted-foreground">
                        {farm.wardNumber && (
                          <span className="mr-2">
                            वडा नं.: {farm.wardNumber}
                          </span>
                        )}
                        {farm.location && (
                          <span className="mr-2">{farm.location}</span>
                        )}
                        {farm.address && <span>{farm.address}</span>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        {farm.mainCrops && (
                          <div className="flex items-center text-xs">
                            <Leaf className="h-3 w-3 mr-1" />
                            <span>
                              {farm.mainCrops.substring(0, 30)}
                              {farm.mainCrops.length > 30 ? "..." : ""}
                            </span>
                          </div>
                        )}

                        {farm.hasLivestock && farm.livestockTypes && (
                          <div className="flex items-center text-xs mt-1">
                            <Milk className="h-3 w-3 mr-1" />
                            <span>
                              {farm.livestockTypes.substring(0, 30)}
                              {farm.livestockTypes.length > 30 ? "..." : ""}
                            </span>
                          </div>
                        )}

                        {/* Crop rotation */}
                        {farm.mainCrops && (
                          <div className="flex items-center text-xs mt-1">
                            {farm.cropRotation ? (
                              <Check className="h-3 w-3 text-green-600 mr-1" />
                            ) : (
                              <X className="h-3 w-3 text-gray-400 mr-1" />
                            )}
                            <span>बाली चक्र</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        {farm.ownerName && (
                          <div className="text-xs">
                            <span className="mr-1">मालिक:</span>
                            <span className="font-medium">
                              {farm.ownerName}
                            </span>
                          </div>
                        )}

                        {farm.totalAreaInHectares && (
                          <div className="text-xs">
                            <span className="mr-1">क्षेत्रफल:</span>
                            <span className="font-medium">
                              {farm.totalAreaInHectares} हेक्टर
                            </span>
                          </div>
                        )}

                        {farm.cultivatedAreaInHectares && (
                          <div className="text-xs">
                            <span className="mr-1">खेती क्षेत्र:</span>
                            <span className="font-medium">
                              {farm.cultivatedAreaInHectares} हेक्टर
                            </span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {farm.isVerified ? (
                        <Badge
                          variant="outline"
                          className="bg-green-50 border-green-200"
                        >
                          <Check className="h-4 w-4 text-green-600" />
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="bg-gray-50 border-gray-200"
                        >
                          <X className="h-4 w-4 text-gray-400" />
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewFarm(farm.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
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
                          onClick={() =>
                            onDelete({
                              id: farm.id,
                              name: farm.name,
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
                <TableCell colSpan={7} className="text-center py-8">
                  <p className="text-muted-foreground">
                    कुनै पनि फार्म फेला परेन
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
