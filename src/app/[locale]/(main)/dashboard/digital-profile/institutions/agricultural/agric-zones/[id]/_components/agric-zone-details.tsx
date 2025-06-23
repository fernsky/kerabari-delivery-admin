"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, InfoIcon, MapPin, Check, X, Leaf } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface AgricZoneDetailsProps {
  agricZone: any;
}

export function AgricZoneDetails({ agricZone }: AgricZoneDetailsProps) {
  // Get agricultural zone type label
  const getAgricZoneTypeLabel = (type: string) => {
    const types = {
      PULSES: "दलहन",
      OILSEEDS: "तेलहन",
      COMMERCIAL_FLOWER: "व्यावसायिक फूल खेती",
      SEASONAL_CROPS: "मौसमी बाली",
      SUPER_ZONE: "सुपर जोन",
      POCKET_AREA: "पकेट क्षेत्र",
      MIXED: "मिश्रित",
      OTHER: "अन्य",
    };
    return types[type as keyof typeof types] || type;
  };

  // Get soil quality label
  const getSoilQualityLabel = (quality: string | null) => {
    if (!quality) return "अज्ञात";

    const qualities = {
      EXCELLENT: "उत्तम",
      GOOD: "राम्रो",
      AVERAGE: "औसत",
      POOR: "कमजोर",
      VERY_POOR: "धेरै कमजोर",
    };
    return qualities[quality as keyof typeof qualities] || quality;
  };

  // Get irrigation system label
  const getIrrigationSystemLabel = (system: string | null) => {
    if (!system) return "अज्ञात";

    const systems = {
      CANAL: "नहर/कुलो",
      SPRINKLER: "स्प्रिंकलर सिंचाई",
      DRIP: "थोपा सिंचाई",
      GROUNDWATER: "भूमिगत पानी",
      RAINWATER_HARVESTING: "वर्षाको पानी संकलन",
      SEASONAL_RIVER: "मौसमी खोला/नदी",
      NONE: "सिंचाई छैन",
      MIXED: "मिश्रित",
    };
    return systems[system as keyof typeof systems] || system;
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
          {agricZone.description && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                विवरण
              </h3>
              <p className="text-base">{agricZone.description}</p>
            </div>
          )}

          {/* Agricultural Zone Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                कृषि क्षेत्रको प्रकार
              </h3>
              <div>
                <Badge variant="outline" className="text-base font-normal">
                  {getAgricZoneTypeLabel(agricZone.type)}
                </Badge>
              </div>
            </div>

            {agricZone.soilQuality && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  माटोको गुणस्तर
                </h3>
                <div>
                  <Badge
                    variant="outline"
                    className={`text-base font-normal ${
                      agricZone.soilQuality === "EXCELLENT" ||
                      agricZone.soilQuality === "GOOD"
                        ? "bg-green-50 text-green-700 border-green-200"
                        : agricZone.soilQuality === "AVERAGE"
                          ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                          : "bg-red-50 text-red-700 border-red-200"
                    }`}
                  >
                    {getSoilQualityLabel(agricZone.soilQuality)}
                  </Badge>
                </div>
              </div>
            )}
          </div>

          {/* Location Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {agricZone.wardNumber && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  वडा नं.
                </h3>
                <p>{agricZone.wardNumber}</p>
              </div>
            )}

            {agricZone.location && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  ठाउँ/टोल
                </h3>
                <p>{agricZone.location}</p>
              </div>
            )}

            {agricZone.address && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  ठेगाना
                </h3>
                <p>{agricZone.address}</p>
              </div>
            )}
          </div>

          {/* Agricultural Details */}
          <div className="space-y-3 pt-4 border-t">
            <h3 className="text-base font-medium">कृषि विवरण</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {agricZone.irrigationSystem && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    सिंचाई प्रणाली
                  </h3>
                  <p>{getIrrigationSystemLabel(agricZone.irrigationSystem)}</p>
                </div>
              )}

              {agricZone.areaInHectares && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    क्षेत्रफल
                  </h3>
                  <p>{agricZone.areaInHectares} हेक्टर</p>
                </div>
              )}

              {agricZone.majorCrops && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    मुख्य बालीहरू
                  </h3>
                  <p>{agricZone.majorCrops}</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {agricZone.seasonalAvailability && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    मौसमी उपलब्धता
                  </h3>
                  <p>{agricZone.seasonalAvailability}</p>
                </div>
              )}

              {agricZone.annualProduction && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    वार्षिक उत्पादन
                  </h3>
                  <p>{agricZone.annualProduction} मेट्रिक टन</p>
                </div>
              )}

              {agricZone.productionYear && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    उत्पादन वर्ष
                  </h3>
                  <p>{agricZone.productionYear}</p>
                </div>
              )}
            </div>
          </div>

          {/* Management Details */}
          <div className="space-y-3 pt-4 border-t">
            <h3 className="text-base font-medium">व्यवस्थापन विवरण</h3>

            <div>
              <div className="space-y-2 mb-4">
                <h3 className="text-sm font-medium text-muted-foreground">
                  स्वामित्व
                </h3>
                <Badge variant="outline">
                  {agricZone.isGovernmentOwned ? "सरकारी" : "निजी"}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {agricZone.ownerName && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    मालिकको नाम
                  </h3>
                  <p>{agricZone.ownerName}</p>
                </div>
              )}

              {agricZone.ownerContact && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    मालिकको सम्पर्क
                  </h3>
                  <p>{agricZone.ownerContact}</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {agricZone.caretakerName && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    हेरचाहकर्ताको नाम
                  </h3>
                  <p>{agricZone.caretakerName}</p>
                </div>
              )}

              {agricZone.caretakerContact && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    हेरचाहकर्ताको सम्पर्क
                  </h3>
                  <p>{agricZone.caretakerContact}</p>
                </div>
              )}
            </div>
          </div>

          {/* Additional Facilities */}
          <div className="space-y-3 pt-4 border-t">
            <h3 className="text-base font-medium">अतिरिक्त सुविधाहरू</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                {agricZone.hasStorage ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <X className="h-4 w-4 text-red-600" />
                )}
                <span>भण्डारण सुविधा</span>
              </div>

              <div className="flex items-center gap-2">
                {agricZone.hasProcessingUnit ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <X className="h-4 w-4 text-red-600" />
                )}
                <span>प्रशोधन एकाई</span>
              </div>

              <div className="flex items-center gap-2">
                {agricZone.hasFarmersCooperative ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <X className="h-4 w-4 text-red-600" />
                )}
                <span>किसान सहकारी</span>
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                सिर्जना मिति
              </h3>
              <div className="flex items-center gap-1.5">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                <span>{formatDate(agricZone.createdAt)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                अपडेट मिति
              </h3>
              <div className="flex items-center gap-1.5">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                <span>{formatDate(agricZone.updatedAt)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SEO Information */}
      {(agricZone.metaTitle ||
        agricZone.metaDescription ||
        agricZone.keywords) && (
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
            {agricZone.metaTitle && (
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Meta Title
                </h3>
                <p>{agricZone.metaTitle}</p>
              </div>
            )}
            {agricZone.metaDescription && (
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Meta Description
                </h3>
                <p>{agricZone.metaDescription}</p>
              </div>
            )}
            {agricZone.keywords && (
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Keywords
                </h3>
                <p>{agricZone.keywords}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
