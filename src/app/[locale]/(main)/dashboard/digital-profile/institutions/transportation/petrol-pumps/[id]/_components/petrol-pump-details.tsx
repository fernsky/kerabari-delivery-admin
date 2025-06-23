"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, InfoIcon, MapPin, Check, X } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface PetrolPumpDetailsProps {
  petrolPump: any;
}

export function PetrolPumpDetails({ petrolPump }: PetrolPumpDetailsProps) {
  // Get petrol pump type label
  const getPetrolPumpTypeLabel = (type: string) => {
    const types = {
      PETROL: "पेट्रोल",
      DIESEL: "डिजल",
      PETROL_DIESEL: "पेट्रोल र डिजल",
      CNG: "सीएनजी",
      EV_CHARGING: "इलेक्ट्रिक चार्जिंग",
      MULTIPURPOSE: "बहुउद्देश्यीय",
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
          {petrolPump.description && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                विवरण
              </h3>
              <p className="text-base">{petrolPump.description}</p>
            </div>
          )}

          {/* Petrol Pump Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                पेट्रोल पम्प प्रकार
              </h3>
              <div>
                <Badge variant="outline" className="text-base font-normal">
                  {getPetrolPumpTypeLabel(petrolPump.type)}
                </Badge>
              </div>
            </div>
          </div>

          {/* Location Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {petrolPump.wardNumber && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  वडा नं.
                </h3>
                <p>{petrolPump.wardNumber}</p>
              </div>
            )}

            {petrolPump.locality && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  ठाउँ/टोल
                </h3>
                <p>{petrolPump.locality}</p>
              </div>
            )}

            {petrolPump.address && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  ठेगाना
                </h3>
                <p>{petrolPump.address}</p>
              </div>
            )}
          </div>

          {/* Owner Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {petrolPump.ownerName && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  मालिक/संचालकको नाम
                </h3>
                <p>{petrolPump.ownerName}</p>
              </div>
            )}

            {petrolPump.ownerContact && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  सम्पर्क नम्बर
                </h3>
                <p>{petrolPump.ownerContact}</p>
              </div>
            )}

            {petrolPump.operatingHours && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  संचालन समय
                </h3>
                <p>{petrolPump.operatingHours}</p>
              </div>
            )}
          </div>

          {(petrolPump.ownerEmail || petrolPump.ownerWebsite) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {petrolPump.ownerEmail && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    इमेल
                  </h3>
                  <p>{petrolPump.ownerEmail}</p>
                </div>
              )}

              {petrolPump.ownerWebsite && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    वेबसाइट
                  </h3>
                  <a
                    href={petrolPump.ownerWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {petrolPump.ownerWebsite}
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Features */}
          <div className="space-y-3 pt-4 border-t">
            <h3 className="text-sm font-medium text-muted-foreground">
              पेट्रोल पम्प सुविधाहरू
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                {petrolPump.hasEVCharging ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <X className="h-4 w-4 text-red-600" />
                )}
                <span>इलेक्ट्रिक वाहन चार्जिंग</span>
              </div>

              <div className="flex items-center gap-2">
                {petrolPump.hasCarWash ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <X className="h-4 w-4 text-red-600" />
                )}
                <span>कार वाश</span>
              </div>

              <div className="flex items-center gap-2">
                {petrolPump.hasConvenienceStore ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <X className="h-4 w-4 text-red-600" />
                )}
                <span>किराना पसल</span>
              </div>

              <div className="flex items-center gap-2">
                {petrolPump.hasRestroom ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <X className="h-4 w-4 text-red-600" />
                )}
                <span>शौचालय</span>
              </div>

              <div className="flex items-center gap-2">
                {petrolPump.hasAirFilling ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <X className="h-4 w-4 text-red-600" />
                )}
                <span>हावा भर्ने सुविधा</span>
              </div>
            </div>
          </div>

          {/* Coordinates */}
          {petrolPump.locationPoint && (
            <div className="space-y-2 pt-4 border-t">
              <h3 className="text-sm font-medium text-muted-foreground">
                स्थान
              </h3>
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>
                  {petrolPump.locationPoint.coordinates[1].toFixed(6)},{" "}
                  {petrolPump.locationPoint.coordinates[0].toFixed(6)}
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
                <span>{formatDate(petrolPump.createdAt)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                अपडेट मिति
              </h3>
              <div className="flex items-center gap-1.5">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                <span>{formatDate(petrolPump.updatedAt)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SEO Information */}
      {(petrolPump.metaTitle ||
        petrolPump.metaDescription ||
        petrolPump.keywords) && (
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
            {petrolPump.metaTitle && (
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Meta Title
                </h3>
                <p>{petrolPump.metaTitle}</p>
              </div>
            )}
            {petrolPump.metaDescription && (
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Meta Description
                </h3>
                <p>{petrolPump.metaDescription}</p>
              </div>
            )}
            {petrolPump.keywords && (
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Keywords
                </h3>
                <p>{petrolPump.keywords}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
