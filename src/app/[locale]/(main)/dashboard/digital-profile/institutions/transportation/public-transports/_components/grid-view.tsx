"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Edit, Trash2, Eye, Image, Bus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "./pagination";

interface PublicTransportItem {
  id: string;
  name: string;
  slug: string;
  type: string;
  description?: string;
  operatorName?: string;
  routeName?: string;
  startPoint?: string;
  endPoint?: string;
  frequency?: string;
  vehicleCondition?: string;
  hasAirConditioning?: boolean;
  hasWifi?: boolean;
  isAccessible?: boolean;
  primaryMedia?: {
    mediaId: string;
    url: string;
    fileName?: string;
  };
}

interface GridViewProps {
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

export function GridView({
  transports,
  transportTypes,
  pagination,
  onPageChange,
  onDelete,
  isLoading,
}: GridViewProps) {
  const router = useRouter();

  const handleViewTransport = (transportId: string) => {
    router.push(
      `/dashboard/digital-profile/institutions/transportation/public-transports/${transportId}`,
    );
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
      case "UNDER_MAINTENANCE":
        return "bg-blue-50 text-blue-600 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getFrequencyLabel = (frequency?: string) => {
    if (!frequency) return null;

    const frequencies = {
      DAILY: "दैनिक",
      WEEKDAYS_ONLY: "कार्य दिनमा",
      WEEKENDS_ONLY: "सप्ताहन्तमा",
      OCCASIONAL: "कहिलेकाहीँ",
      SEASONAL: "मौसमी",
    };
    return frequencies[frequency as keyof typeof frequencies] || frequency;
  };

  if (transports.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          कुनै पनि सार्वजनिक यातायात फेला परेन
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {transports.map((transport) => {
          const transportType = transportTypes.find(
            (t) => t.value === transport.type,
          );

          return (
            <Card key={transport.id} className="overflow-hidden">
              <div
                className="aspect-video relative bg-muted cursor-pointer"
                onClick={() => handleViewTransport(transport.id)}
              >
                {transport.primaryMedia?.url ? (
                  <img
                    src={transport.primaryMedia.url}
                    alt={transport.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted">
                    <Bus className="h-12 w-12 text-muted-foreground opacity-20" />
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-1">
                  <Badge variant="secondary">{transportType?.label}</Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start gap-2">
                  <h3
                    className="font-medium text-lg truncate cursor-pointer hover:underline flex-1"
                    onClick={() => handleViewTransport(transport.id)}
                  >
                    {transport.name}
                  </h3>
                  {transport.vehicleCondition && (
                    <Badge
                      className={getConditionColor(transport.vehicleCondition)}
                    >
                      {getTransportConditionLabel(transport.vehicleCondition)}
                    </Badge>
                  )}
                </div>

                {transport.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {transport.description}
                  </p>
                )}

                {/* Route details */}
                <div className="mt-3">
                  {transport.routeName && (
                    <p className="text-sm font-medium">{transport.routeName}</p>
                  )}
                  {transport.startPoint && transport.endPoint && (
                    <p className="text-xs text-muted-foreground">
                      {transport.startPoint} → {transport.endPoint}
                    </p>
                  )}
                  {transport.frequency && (
                    <Badge variant="outline" className="mt-2 text-xs">
                      {getFrequencyLabel(transport.frequency)}
                    </Badge>
                  )}
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {transport.hasAirConditioning && (
                    <Badge variant="outline" className="text-xs">
                      एसी
                    </Badge>
                  )}
                  {transport.hasWifi && (
                    <Badge variant="outline" className="text-xs">
                      वाई-फाई
                    </Badge>
                  )}
                  {transport.isAccessible && (
                    <Badge variant="outline" className="text-xs">
                      अपाङ्गमैत्री
                    </Badge>
                  )}
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between border-t mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => handleViewTransport(transport.id)}
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
                        `/dashboard/digital-profile/institutions/transportation/public-transports/edit/${transport.id}`,
                      )
                    }
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() =>
                      onDelete({ id: transport.id, name: transport.name })
                    }
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
