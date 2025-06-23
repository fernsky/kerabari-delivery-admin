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
import { Edit, Trash2, Image, Eye, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "./pagination";

interface PetrolPumpItem {
  id: string;
  name: string;
  slug: string;
  type: string;
  wardNumber?: number;
  locality?: string;
  address?: string;
  hasEVCharging?: boolean;
  hasCarWash?: boolean;
  hasConvenienceStore?: boolean;
  primaryMedia?: {
    mediaId: string;
    url: string;
    fileName?: string;
  };
}

interface TableViewProps {
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

export function TableView({
  pumps,
  pumpTypes,
  pagination,
  onPageChange,
  onDelete,
  isLoading,
}: TableViewProps) {
  const router = useRouter();

  const handleViewPump = (pumpId: string) => {
    router.push(
      `/dashboard/digital-profile/institutions/transportation/petrol-pumps/${pumpId}`,
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
              <TableHead>स्थान</TableHead>
              <TableHead>विशेषताहरू</TableHead>
              <TableHead className="w-36 text-right">कार्यहरू</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pumps.length > 0 ? (
              pumps.map((pump) => {
                const pumpType = pumpTypes.find((t) => t.value === pump.type);

                return (
                  <TableRow key={pump.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-start">
                        {pump.primaryMedia?.url ? (
                          <div className="mr-3 flex-shrink-0">
                            <img
                              src={pump.primaryMedia.url}
                              alt={pump.name}
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
                            onClick={() => handleViewPump(pump.id)}
                          >
                            {pump.name}
                          </button>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{pumpType?.label || pump.type}</TableCell>
                    <TableCell>
                      <div className="text-xs text-muted-foreground">
                        {pump.wardNumber && (
                          <span className="mr-2">
                            वडा नं.: {pump.wardNumber}
                          </span>
                        )}
                        {pump.locality && (
                          <span className="mr-2">{pump.locality}</span>
                        )}
                        {pump.address && <span>{pump.address}</span>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {pump.hasEVCharging && (
                          <Badge className="bg-blue-100 text-blue-800">
                            <Zap className="h-3 w-3 mr-1" />
                            इ-चार्जिंग
                          </Badge>
                        )}
                        {pump.hasCarWash && (
                          <Badge variant="outline">कार वाश</Badge>
                        )}
                        {pump.hasConvenienceStore && (
                          <Badge variant="outline">स्टोर</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewPump(pump.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
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
                          onClick={() =>
                            onDelete({
                              id: pump.id,
                              name: pump.name,
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
                    कुनै पनि पेट्रोल पम्प फेला परेन
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
