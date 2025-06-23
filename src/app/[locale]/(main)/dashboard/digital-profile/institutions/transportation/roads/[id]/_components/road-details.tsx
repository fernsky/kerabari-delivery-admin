"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, InfoIcon, MapPin, Check, X } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface RoadDetailsProps {
  road: any;
}

export function RoadDetails({ road }: RoadDetailsProps) {
  // Get road type label
  const getRoadTypeLabel = (type: string) => {
    const types = {
      "HIGHWAY": "हाइवे",
      "URBAN": "सहरी सडक",
      "RURAL": "ग्रामीण सडक",
      "GRAVEL": "ग्राभेल सडक",
      "EARTHEN": "कच्ची सडक",
      "AGRICULTURAL": "कृषि सडक",
      "ALLEY": "गल्ली",
      "BRIDGE": "पुल",
    };
    return types[type as keyof typeof types] || type;
  };

  // Get road condition label
  const getRoadConditionLabel = (condition: string | null) => {
    if (!condition) return "अज्ञात";
    
    const conditions = {
      "EXCELLENT": "उत्कृष्ट",
      "GOOD": "राम्रो",
      "FAIR": "ठीकै",
      "POOR": "खराब",
      "VERY_POOR": "धेरै खराब",
      "UNDER_CONSTRUCTION": "निर्माणाधीन",
    };
    return conditions[condition as keyof typeof conditions] || condition;
  };

  // Get drainage system label
  const getDrainageSystemLabel = (drainage: string | null) => {
    if (!drainage) return "अज्ञात";
    
    const drainages = {
      "PROPER": "उचित",
      "PARTIAL": "आंशिक",
      "NONE": "नभएको",
      "BLOCKED": "अवरुद्ध",
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
          {road.description && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                विवरण
              </h3>
              <p className="text-base">{road.description}</p>
            </div>
          )}

          {/* Road Type and Condition */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                सडकको प्रकार
              </h3>
              <div>
                <Badge variant="outline" className="text-base font-normal">
                  {getRoadTypeLabel(road.type)}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                सडकको अवस्था
              </h3>
              <div>
                <Badge 
                  variant="outline" 
                  className={`text-base font-normal ${
                    road.condition === 'EXCELLENT' || road.condition === 'GOOD' 
                      ? 'bg-green-50 text-green-700 border-green-200' 
                      : road.condition === 'FAIR' 
                        ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                        : 'bg-red-50 text-red-700 border-red-200'
                  }`}
                >
                  {getRoadConditionLabel(road.condition)}
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
                    road.drainageSystem === 'PROPER'
                      ? 'bg-green-50 text-green-700 border-green-200' 
                      : road.drainageSystem === 'PARTIAL' 
                        ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                        : 'bg-red-50 text-red-700 border-red-200'
                  }`}
                >
                  {getDrainageSystemLabel(road.drainageSystem)}
                </Badge>
              </div>
            </div>
          </div>

          {/* Measurements and Points */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                सडकको चौडाई
              </h3>
              <p>{road.widthInMeters ? `${road.widthInMeters} मिटर` : "अज्ञात"}</p>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                सडकको लम्बाई
              </h3>
              <p>{road.length ? `${road.length} मिटर` : "अज्ञात"}</p>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                मर्मत सम्भार वर्ष
              </h3>
              <p>{road.maintenanceYear || "अज्ञात"}</p>
            </div>

            {road.startPoint && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  सुरुवात बिन्दु
                </h3>
                <p>{road.startPoint}</p>
              </div>
            )}

            {road.endPoint && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  अन्तिम बिन्दु
                </h3>
                <p>{road.endPoint}</p>
              </div>
            )}
          </div>

          {/* Features */}
          <div className="space-y-3 pt-4 border-t">
            <h3 className="text-sm font-medium text-muted-foreground">
              सडकको विशेषताहरू
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                {road.hasStreetLights ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <X className="h-4 w-4 text-red-600" />
                )}
                <span>स्ट्रिट लाइट</span>
              </div>

              <div className="flex items-center gap-2">
                {road.hasDivider ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <X className="h-4 w-4 text-red-600" />
                )}
                <span>डिभाइडर</span>
              </div>

              <div className="flex items-center gap-2">
                {road.hasPedestrian ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <X className="h-4 w-4 text-red-600" />
                )}
                <span>पैदल मार्ग</span>
              </div>

              <div className="flex items-center gap-2">
                {road.hasBicycleLane ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <X className="h-4 w-4 text-red-600" />
                )}
                <span>साइकल लेन</span>
              </div>
            </div>
          </div>

          {/* Coordinates */}
          {road.representativePoint && (
            <div className="space-y-2 pt-4 border-t">
              <h3 className="text-sm font-medium text-muted-foreground">
                प्रतिनिधि बिन्दु
              </h3>
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>
                  {road.representativePoint.coordinates[1].toFixed(6)},{" "}
                  {road.representativePoint.coordinates[0].toFixed(6)}
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
                <span>{formatDate(road.createdAt)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                अपडेट मिति
              </h3>
              <div className="flex items-center gap-1.5">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                <span>{formatDate(road.updatedAt)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SEO Information */}
      {(road.metaTitle || road.metaDescription || road.keywords) && (
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
            {road.metaTitle && (
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Meta Title
                </h3>
                <p>{road.metaTitle}</p>
              </div>
            )}
            {road.metaDescription && (
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Meta Description
                </h3>
                <p>{road.metaDescription}</p>
              </div>
            )}
            {road.keywords && (
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Keywords
                </h3>
                <p>{road.keywords}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
