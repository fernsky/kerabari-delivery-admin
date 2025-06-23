"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, InfoIcon, MapPin, Check, X } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface ParkingFacilityDetailsProps {
  facility: any;
}

export function ParkingFacilityDetails({
  facility,
}: ParkingFacilityDetailsProps) {
  // Get facility type label
  const getFacilityTypeLabel = (type: string) => {
    const types = {
      BUS_PARK: "बस पार्क",
      TAXI_PARK: "ट्याक्सी पार्क",
      TEMPO_PARK: "टेम्पो पार्क",
      AUTO_RICKSHAW_PARK: "अटो रिक्सा पार्क",
      CAR_PARK: "कार पार्क",
      BIKE_PARK: "बाइक पार्क",
      MULTIPURPOSE_PARK: "बहुउद्देश्यीय पार्क",
      OTHER: "अन्य",
    };
    return types[type as keyof typeof types] || type;
  };

  // Get facility condition label
  const getFacilityConditionLabel = (condition: string | null) => {
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

  // Get drainage system label
  const getDrainageSystemLabel = (drainage: string | null) => {
    if (!drainage) return "अज्ञात";

    const drainages = {
      PROPER: "उचित",
      PARTIAL: "आंशिक",
      NONE: "नभएको",
      BLOCKED: "अवरुद्ध",
    };
    return drainages[drainage as keyof typeof drainages] || drainage;
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
          {facility.description && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                विवरण
              </h3>
              <p className="text-base">{facility.description}</p>
            </div>
          )}

          {/* Facility Type and Condition */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                पार्किङ प्रकार
              </h3>
              <div>
                <Badge variant="outline" className="text-base font-normal">
                  {getFacilityTypeLabel(facility.type)}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                पार्किङ अवस्था
              </h3>
              <div>
                <Badge
                  variant="outline"
                  className={`text-base font-normal ${
                    facility.condition === "EXCELLENT" ||
                    facility.condition === "GOOD"
                      ? "bg-green-50 text-green-700 border-green-200"
                      : facility.condition === "FAIR"
                        ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                        : "bg-red-50 text-red-700 border-red-200"
                  }`}
                >
                  {getFacilityConditionLabel(facility.condition)}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                नाली व्यवस्थापन
              </h3>
              <div>
                <Badge
                  variant="outline"
                  className={`text-base font-normal ${
                    facility.drainageSystem === "PROPER"
                      ? "bg-green-50 text-green-700 border-green-200"
                      : facility.drainageSystem === "PARTIAL"
                        ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                        : "bg-red-50 text-red-700 border-red-200"
                  }`}
                >
                  {getDrainageSystemLabel(facility.drainageSystem)}
                </Badge>
              </div>
            </div>
          </div>

          {/* Location Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {facility.wardNumber && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  वडा नं.
                </h3>
                <p>{facility.wardNumber}</p>
              </div>
            )}

            {facility.location && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  ठाउँ/टोल/क्षेत्र
                </h3>
                <p>{facility.location}</p>
              </div>
            )}

            {facility.address && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  ठेगाना
                </h3>
                <p>{facility.address}</p>
              </div>
            )}
          </div>

          {/* Physical Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {facility.areaInSquareMeters && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  क्षेत्रफल
                </h3>
                <p>{facility.areaInSquareMeters} वर्ग मिटर</p>
              </div>
            )}

            {facility.vehicleCapacity && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  सवारी साधन क्षमता
                </h3>
                <p>{facility.vehicleCapacity}</p>
              </div>
            )}

            {facility.operatingHours && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  संचालन समय
                </h3>
                <p>{facility.operatingHours}</p>
              </div>
            )}
          </div>

          {/* Management Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {facility.operator && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  संचालक
                </h3>
                <p>{facility.operator}</p>
              </div>
            )}

            {facility.contactInfo && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  सम्पर्क जानकारी
                </h3>
                <p>{facility.contactInfo}</p>
              </div>
            )}

            {facility.establishedYear && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  स्थापना वर्ष
                </h3>
                <p>{facility.establishedYear}</p>
              </div>
            )}
          </div>

          {/* Features */}
          <div className="space-y-3 pt-4 border-t">
            <h3 className="text-sm font-medium text-muted-foreground">
              पार्किङ सुविधाको विशेषताहरू
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                {facility.hasRoof ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <X className="h-4 w-4 text-red-600" />
                )}
                <span>छाना</span>
              </div>

              <div className="flex items-center gap-2">
                {facility.hasToilet ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <X className="h-4 w-4 text-red-600" />
                )}
                <span>शौचालय</span>
              </div>

              <div className="flex items-center gap-2">
                {facility.hasWaitingArea ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <X className="h-4 w-4 text-red-600" />
                )}
                <span>प्रतीक्षालय</span>
              </div>

              <div className="flex items-center gap-2">
                {facility.hasTicketCounter ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <X className="h-4 w-4 text-red-600" />
                )}
                <span>टिकट काउन्टर</span>
              </div>

              <div className="flex items-center gap-2">
                {facility.hasFoodStalls ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <X className="h-4 w-4 text-red-600" />
                )}
                <span>खाद्य स्टलहरू</span>
              </div>

              <div className="flex items-center gap-2">
                {facility.hasSecurityPersonnel ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <X className="h-4 w-4 text-red-600" />
                )}
                <span>सुरक्षा कर्मचारी</span>
              </div>

              <div className="flex items-center gap-2">
                {facility.hasCCTV ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <X className="h-4 w-4 text-red-600" />
                )}
                <span>CCTV</span>
              </div>
            </div>
          </div>

          {/* Coordinates */}
          {facility.locationPoint && (
            <div className="space-y-2 pt-4 border-t">
              <h3 className="text-sm font-medium text-muted-foreground">
                प्रतिनिधि बिन्दु
              </h3>
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>
                  {facility.locationPoint.coordinates[1].toFixed(6)},{" "}
                  {facility.locationPoint.coordinates[0].toFixed(6)}
                </span>
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                सिर्जना मिति
              </h3>
              <div className="flex items-center gap-1.5">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                <span>{formatDate(facility.createdAt)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                अपडेट मिति
              </h3>
              <div className="flex items-center gap-1.5">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                <span>{formatDate(facility.updatedAt)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SEO Information */}
      {(facility.metaTitle ||
        facility.metaDescription ||
        facility.keywords) && (
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
            {facility.metaTitle && (
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Meta Title
                </h3>
                <p>{facility.metaTitle}</p>
              </div>
            )}
            {facility.metaDescription && (
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Meta Description
                </h3>
                <p>{facility.metaDescription}</p>
              </div>
            )}
            {facility.keywords && (
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Keywords
                </h3>
                <p>{facility.keywords}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
