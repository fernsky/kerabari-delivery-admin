"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, InfoIcon, MapPin, Check, X } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { api } from "@/trpc/react";

interface LocalAreaDetailsProps {
  location: any;
}

export function LocalAreaDetails({ location }: LocalAreaDetailsProps) {
  // Get parent location details if available - using getById since we only have the parent ID
  const { data: parentLocation } =
    api.profile.localAreas.locations.getById.useQuery(location.parentId || "", {
      enabled: !!location.parentId,
    });

  // Get location type label
  const getLocationTypeLabel = (type: string) => {
    const types = {
      VILLAGE: "गाउँ",
      SETTLEMENT: "बस्ती",
      TOLE: "टोल",
      WARD: "वडा",
      SQUATTER_AREA: "सुकुम्बासी क्षेत्र",
    };
    return types[type as keyof typeof types] || type;
  };

  return (
    <div className="space-y-6">
      {/* Main Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <InfoIcon className="h-5 w-5 text-muted-foreground" />
            आधारभूत जानकारी
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          {/* Description */}
          {location.description && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                विवरण
              </h3>
              <p className="text-base">{location.description}</p>
            </div>
          )}

          {/* Features */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                प्रकार
              </h3>
              <div>
                <Badge variant="outline" className="text-base font-normal">
                  {getLocationTypeLabel(location.type)}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                विशेषताहरू
              </h3>
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-1.5 text-sm">
                  {location.isNewSettlement ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <X className="h-4 w-4 text-red-600" />
                  )}
                  नयाँ बस्ती
                </div>
                <div className="flex items-center gap-1.5 text-sm">
                  {location.isTownPlanned ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <X className="h-4 w-4 text-red-600" />
                  )}
                  नियोजित शहरी क्षेत्र
                </div>
              </div>
            </div>

            {/* Parent Location */}
            {parentLocation && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  अभिभावक स्थान
                </h3>
                <p>
                  {parentLocation.name} (
                  {getLocationTypeLabel(parentLocation.type)})
                </p>
              </div>
            )}

            {/* Coordinates */}
            {location.pointGeometry && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  निर्देशांक
                </h3>
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {location.pointGeometry.coordinates[1].toFixed(6)},{" "}
                    {location.pointGeometry.coordinates[0].toFixed(6)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Metadata */}
          <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                सिर्जना मिति
              </h3>
              <div className="flex items-center gap-1.5">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                <span>{formatDate(location.createdAt)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                अपडेट मिति
              </h3>
              <div className="flex items-center gap-1.5">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                <span>{formatDate(location.updatedAt)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SEO Information */}
      {(location.metaTitle ||
        location.metaDescription ||
        location.keywords) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-muted-foreground"
              >
                <path d="M4 11h16"></path>
                <path d="M4 7h16"></path>
                <path d="M4 15h16"></path>
              </svg>
              SEO जानकारी
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            {location.metaTitle && (
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Meta Title
                </h3>
                <p>{location.metaTitle}</p>
              </div>
            )}
            {location.metaDescription && (
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Meta Description
                </h3>
                <p>{location.metaDescription}</p>
              </div>
            )}
            {location.keywords && (
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Keywords
                </h3>
                <p>{location.keywords}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
