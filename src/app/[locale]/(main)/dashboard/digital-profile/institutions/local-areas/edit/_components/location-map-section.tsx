"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { LocationMapInput } from "../../create/_components/location-map-input";

type Point = {
  type: "Point";
  coordinates: [number, number];
};

type Polygon = {
  type: "Polygon";
  coordinates: [number, number][][];
};

interface LocationMapSectionProps {
  pointGeometry?: Point;
  polygonGeometry?: Polygon;
  onGeometryChange: (point?: Point, polygon?: Polygon) => void;
}

export function LocationMapSection({
  pointGeometry,
  polygonGeometry,
  onGeometryChange,
}: LocationMapSectionProps) {
  const [isMapOpen, setIsMapOpen] = useState(false);

  const handleMapToggle = () => {
    setIsMapOpen(!isMapOpen);
  };

  const handleLocationSelect = (point?: Point, polygon?: Polygon) => {
    onGeometryChange(point, polygon);
    setIsMapOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="text-lg font-medium">स्थान भौगोलिक जानकारी</div>
      <div className="grid grid-cols-1 gap-6">
        <div className="flex flex-col space-y-2">
          <Button
            type="button"
            onClick={handleMapToggle}
            variant="outline"
            className="w-full sm:w-auto"
          >
            <MapPin className="mr-2 h-4 w-4" />
            मानचित्रमा स्थान चयन गर्नुहोस्
          </Button>

          <div className="text-sm text-muted-foreground">
            {pointGeometry && (
              <div>
                बिन्दु स्थान: {pointGeometry.coordinates[1]},
                {pointGeometry.coordinates[0]}
              </div>
            )}

            {polygonGeometry && (
              <div>
                बहुभुज क्षेत्र: {polygonGeometry.coordinates[0]?.length || 0}{" "}
                बिन्दुहरू
              </div>
            )}
          </div>
        </div>

        {isMapOpen && (
          <LocationMapInput
            onLocationSelect={handleLocationSelect}
            initialPoint={pointGeometry}
            initialPolygon={polygonGeometry}
          />
        )}
      </div>
    </div>
  );
}
