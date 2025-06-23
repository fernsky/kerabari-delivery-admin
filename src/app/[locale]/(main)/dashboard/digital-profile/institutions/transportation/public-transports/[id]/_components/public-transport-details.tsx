"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CalendarIcon,
  InfoIcon,
  MapPin,
  Check,
  X,
  Clock,
  Bus,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface PublicTransportDetailsProps {
  transport: any;
}

export function PublicTransportDetails({
  transport,
}: PublicTransportDetailsProps) {
  // Get transport type label
  const getTransportTypeLabel = (type: string) => {
    const types = {
      BUS: "बस",
      MINIBUS: "मिनी बस",
      MICROBUS: "माइक्रो बस",
      TEMPO: "टेम्पो",
      AUTO_RICKSHAW: "अटो रिक्सा",
      TAXI: "ट्याक्सी",
      E_RICKSHAW: "इ-रिक्सा",
      OTHER: "अन्य",
    };
    return types[type as keyof typeof types] || type;
  };

  // Get vehicle condition label
  const getVehicleConditionLabel = (condition: string | null) => {
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

  // Get frequency label
  const getFrequencyLabel = (frequency: string | null) => {
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

  // Format time (e.g. "08:00" to "08:00")
  const formatTime = (time: string | null) => {
    if (!time) return "अज्ञात";
    return time;
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
          {transport.description && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                विवरण
              </h3>
              <p className="text-base">{transport.description}</p>
            </div>
          )}

          {/* Transport Type and Vehicle Condition */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                यातायातको प्रकार
              </h3>
              <div>
                <Badge variant="outline" className="text-base font-normal">
                  {getTransportTypeLabel(transport.type)}
                </Badge>
              </div>
            </div>

            {transport.vehicleCondition && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  गाडीको अवस्था
                </h3>
                <div>
                  <Badge
                    variant="outline"
                    className={`text-base font-normal ${
                      transport.vehicleCondition === "EXCELLENT" ||
                      transport.vehicleCondition === "GOOD"
                        ? "bg-green-50 text-green-700 border-green-200"
                        : transport.vehicleCondition === "FAIR"
                          ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                          : "bg-red-50 text-red-700 border-red-200"
                    }`}
                  >
                    {getVehicleConditionLabel(transport.vehicleCondition)}
                  </Badge>
                </div>
              </div>
            )}

            {transport.operatorName && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  संचालक
                </h3>
                <p>{transport.operatorName}</p>
              </div>
            )}
          </div>

          {/* Route Details */}
          <div className="space-y-3 pt-4 border-t">
            <h3 className="text-base font-medium">मार्ग विवरण</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {transport.startPoint && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    सुरुवात बिन्दु
                  </h3>
                  <p>{transport.startPoint}</p>
                </div>
              )}

              {transport.endPoint && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    अन्तिम बिन्दु
                  </h3>
                  <p>{transport.endPoint}</p>
                </div>
              )}

              {transport.routeName && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    मार्ग नाम
                  </h3>
                  <p>{transport.routeName}</p>
                </div>
              )}
            </div>

            {transport.viaPoints && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  हुँदै जाने स्थानहरू
                </h3>
                <p>{transport.viaPoints}</p>
              </div>
            )}

            {transport.estimatedDuration && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  अनुमानित यात्रा समय
                </h3>
                <p>{transport.estimatedDuration} मिनेट</p>
              </div>
            )}
          </div>

          {/* Schedule Details */}
          <div className="space-y-3 pt-4 border-t">
            <h3 className="text-base font-medium">तालिका विवरण</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {transport.frequency && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    आवृत्ति
                  </h3>
                  <div>
                    <Badge variant="outline">
                      {getFrequencyLabel(transport.frequency)}
                    </Badge>
                  </div>
                </div>
              )}

              {transport.startTime && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    पहिलो गाडी
                  </h3>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{formatTime(transport.startTime)}</span>
                  </div>
                </div>
              )}

              {transport.endTime && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    अन्तिम गाडी
                  </h3>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{formatTime(transport.endTime)}</span>
                  </div>
                </div>
              )}

              {transport.intervalMinutes && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    अन्तराल
                  </h3>
                  <p>हरेक {transport.intervalMinutes} मिनेट</p>
                </div>
              )}
            </div>
          </div>

          {/* Vehicle Details */}
          <div className="space-y-3 pt-4 border-t">
            <h3 className="text-base font-medium">गाडी विवरण</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {transport.vehicleCount && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    गाडीहरूको संख्या
                  </h3>
                  <p>{transport.vehicleCount}</p>
                </div>
              )}

              {transport.seatingCapacity && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    सिट क्षमता
                  </h3>
                  <p>{transport.seatingCapacity} सिट</p>
                </div>
              )}

              {transport.fareAmount && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    न्यूनतम भाडा
                  </h3>
                  <p>रू. {transport.fareAmount}</p>
                </div>
              )}
            </div>

            {transport.fareDescription && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  भाडा विवरण
                </h3>
                <p>{transport.fareDescription}</p>
              </div>
            )}

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="flex items-center gap-2">
                {transport.hasAirConditioning ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <X className="h-4 w-4 text-red-600" />
                )}
                <span>एयर कण्डिसनर</span>
              </div>

              <div className="flex items-center gap-2">
                {transport.hasWifi ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <X className="h-4 w-4 text-red-600" />
                )}
                <span>वाई-फाई</span>
              </div>

              <div className="flex items-center gap-2">
                {transport.isAccessible ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <X className="h-4 w-4 text-red-600" />
                )}
                <span>अपाङ्गमैत्री</span>
              </div>
            </div>
          </div>

          {/* Operator Information */}
          <div className="space-y-3 pt-4 border-t">
            <h3 className="text-base font-medium">संचालक विवरण</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {transport.operatorContact && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    संचालकको सम्पर्क
                  </h3>
                  <p>{transport.operatorContact}</p>
                </div>
              )}

              {transport.operatorEmail && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    संचालकको इमेल
                  </h3>
                  <p>{transport.operatorEmail}</p>
                </div>
              )}

              {transport.operatorWebsite && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    वेबसाइट
                  </h3>
                  <a
                    href={transport.operatorWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {transport.operatorWebsite}
                  </a>
                </div>
              )}
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
                <span>{formatDate(transport.createdAt)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                अपडेट मिति
              </h3>
              <div className="flex items-center gap-1.5">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                <span>{formatDate(transport.updatedAt)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SEO Information */}
      {(transport.metaTitle ||
        transport.metaDescription ||
        transport.keywords) && (
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
            {transport.metaTitle && (
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Meta Title
                </h3>
                <p>{transport.metaTitle}</p>
              </div>
            )}
            {transport.metaDescription && (
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Meta Description
                </h3>
                <p>{transport.metaDescription}</p>
              </div>
            )}
            {transport.keywords && (
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Keywords
                </h3>
                <p>{transport.keywords}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
