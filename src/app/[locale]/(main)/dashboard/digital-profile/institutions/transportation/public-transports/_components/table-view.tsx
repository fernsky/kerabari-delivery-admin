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
import { Edit, Trash2, Image, Eye, Bus, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "./pagination";

interface PublicTransportItem {
  id: string;
  name: string;
  slug: string;
  type: string;
  operatorName?: string;
  routeName?: string;
  startPoint?: string;
  endPoint?: string;
  frequency?: string;
  startTime?: string;
  endTime?: string;
  intervalMinutes?: number;
  fareAmount?: number;
  vehicleCondition?: string;
  hasAirConditioning?: boolean;
  hasWifi?: boolean;
  primaryMedia?: {
    mediaId: string;
    url: string;
    fileName?: string;
  };
}

interface TableViewProps {
  transports: PublicTransportItem[];
  transportTypes: { value: string; label: string }[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  onPageChange: (page: number) => void;
  onDelete: (transport: { id: string; name: string }) => void;
  isLoading?: boolean;
}

export function TableView({
  transports,
  transportTypes,
  pagination,
  onPageChange,
  onDelete,
  isLoading,
}: TableViewProps) {
  const router = useRouter();

  const handleViewTransport = (transportId: string) => {
    router.push(
      `/dashboard/digital-profile/institutions/transportation/public-transports/${transportId}`,
    );
  };

  // Convert frequency to Nepali
  const getFrequencyLabel = (frequency?: string) => {
    if (!frequency) return "अज्ञात";

    const frequencies = {
      DAILY: "दैनिक",
      WEEKDAYS_ONLY: "कार्य दिनमा",
      WEEKENDS_ONLY: "सप्ताहन्तमा",
      OCCASIONAL: "कहिलेकाहीँ",
      SEASONAL: "मौसमी",
    };
    return frequencies[frequency as keyof typeof frequencies] || frequency;
  };

  // Get time in local format
  const formatTime = (time?: string) => {
    if (!time) return "";
    return time;
  };

  const getTransportConditionLabel = (condition?: string) => {
    if (!condition) return "अज्ञात";

    const conditions = {
      EXCELLENT: "उत्कृष्ट",
      GOOD: "राम्रो",
      FAIR: "ठीकै",
      POOR: "खराब",
      VERY_POOR: "धेरै खराब",
      UNDER_MAINTENANCE: "मर्मत अधीन",
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
      case "UNDER_MAINTENANCE":
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
              <TableHead>संचालक</TableHead>
              <TableHead>मार्ग</TableHead>
              <TableHead>तालिका</TableHead>
              <TableHead className="w-36 text-right">कार्यहरू</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transports.length > 0 ? (
              transports.map((transport) => {
                const transportType = transportTypes.find(
                  (t) => t.value === transport.type,
                );

                return (
                  <TableRow key={transport.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-start">
                        {transport.primaryMedia?.url ? (
                          <div className="mr-3 flex-shrink-0">
                            <img
                              src={transport.primaryMedia.url}
                              alt={transport.name}
                              className="h-10 w-10 rounded-md object-cover"
                            />
                          </div>
                        ) : (
                          <div className="mr-3 flex-shrink-0 h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                            <Bus className="h-5 w-5 text-muted-foreground opacity-70" />
                          </div>
                        )}
                        <div>
                          <button
                            className="hover:underline text-left font-medium"
                            onClick={() => handleViewTransport(transport.id)}
                          >
                            {transport.name}
                          </button>
                          {transport.vehicleCondition && (
                            <Badge
                              className={`mt-1 text-xs ${getConditionColor(transport.vehicleCondition)}`}
                            >
                              {getTransportConditionLabel(
                                transport.vehicleCondition,
                              )}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {transportType?.label || transport.type}
                    </TableCell>
                    <TableCell>{transport.operatorName || "अज्ञात"}</TableCell>
                    <TableCell>
                      <div className="text-xs text-muted-foreground">
                        {transport.routeName ? (
                          <div>{transport.routeName}</div>
                        ) : (
                          <>
                            {transport.startPoint && (
                              <span>{transport.startPoint}</span>
                            )}
                            {transport.startPoint && transport.endPoint && (
                              <span> → </span>
                            )}
                            {transport.endPoint && (
                              <span>{transport.endPoint}</span>
                            )}
                          </>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                        <span className="text-xs">
                          {transport.frequency && (
                            <Badge variant="outline" className="mr-1">
                              {getFrequencyLabel(transport.frequency)}
                            </Badge>
                          )}
                          {transport.startTime &&
                            `${formatTime(transport.startTime)}${transport.endTime ? " - " + formatTime(transport.endTime) : ""}`}
                          {transport.intervalMinutes && (
                            <span className="ml-1 text-muted-foreground">
                              (हरेक {transport.intervalMinutes} मिनेट)
                            </span>
                          )}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewTransport(transport.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            router.push(
                              `/dashboard/digital-profile/institutions/transportation/public-transports/edit/${transport.id}`,
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
                              id: transport.id,
                              name: transport.name,
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
                    कुनै पनि सार्वजनिक यातायात फेला परेन
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
