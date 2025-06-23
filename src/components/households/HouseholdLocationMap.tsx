"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Navigation } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import dynamic from "next/dynamic";

// Define types for the location data
export type Location = {
  raw: string[];
  latitude: number | null;
  longitude: number | null;
};

type HouseholdLocationProps = {
  id: string;
  familyHeadName?: string;
  location?: Location;
  isLoading?: boolean;
  error?: string;
};

// Dynamically import the client-side map component with no SSR
const ClientSideMap = dynamic(() => import("./ClientSideMap"), {
  ssr: false,
  loading: () => (
    <Card className="w-full h-[400px] flex items-center justify-center">
      <div className="flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-t-primary animate-spin"></div>
      </div>
    </Card>
  ),
});

const HouseholdLocationMap = ({
  id,
  familyHeadName,
  location,
  isLoading,
  error,
}: HouseholdLocationProps) => {
  // Navigate user to the location on their device
  const navigateToLocation = () => {
    if (location?.latitude && location?.longitude) {
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${location.latitude},${location.longitude}`,
        "_blank",
      );
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <Card className="w-full h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 rounded-full border-4 border-t-primary animate-spin"></div>
          <p className="text-muted-foreground">Loading map data...</p>
        </div>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  // No location data state
  if (!location?.latitude || !location?.longitude) {
    return (
      <Card className="w-full h-[300px] flex items-center justify-center">
        <div className="text-center p-6">
          <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No Location Data</h3>
          <p className="text-muted-foreground mb-4">
            GPS coordinates are not available for this household.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* The map is rendered by the ClientSideMap component */}
      <ClientSideMap location={location} familyHeadName={familyHeadName} />

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            <strong>Coordinates:</strong> {location.latitude},{" "}
            {location.longitude}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={navigateToLocation}
          className="flex items-center gap-2"
        >
          <Navigation className="h-4 w-4" />
          Navigate to Location
        </Button>
      </div>
    </div>
  );
};

export default HouseholdLocationMap;
