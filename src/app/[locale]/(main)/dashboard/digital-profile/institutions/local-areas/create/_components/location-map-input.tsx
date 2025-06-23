"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Map as MapIcon, RotateCcw, Compass } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import dynamic from "next/dynamic";
import { useMapViewStore } from "@/store/map-view-store";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Define the types for our component
type Point = {
  type: "Point";
  coordinates: [number, number];
};

type Polygon = {
  type: "Polygon";
  coordinates: [number, number][][];
};

interface LocationMapInputProps {
  onLocationSelect: (point?: Point, polygon?: Polygon) => void;
  initialPoint?: Point;
  initialPolygon?: Polygon;
}

// Create a client-only OpenLayers map component
const OpenLayersMap = dynamic(
  () => import("./_map-implementation").then((mod) => mod.OpenLayersMap),
  { ssr: false },
);

export function LocationMapInput({
  onLocationSelect,
  initialPoint,
  initialPolygon,
}: LocationMapInputProps) {
  const [mapMode, setMapMode] = useState<"point" | "polygon">("point");
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<Point | undefined>(
    initialPoint,
  );
  const [selectedPolygon, setSelectedPolygon] = useState<Polygon | undefined>(
    initialPolygon,
  );
  const { isStreetView, toggleView } = useMapViewStore();
  const [rotation, setRotation] = useState(0);
  const [tilt, setTilt] = useState(0);

  // Reference to access map controls exposed by OpenLayersMap
  const mapControlsRef = useRef<any>(null);

  const handleModeSwitchChange = (value: string) => {
    if (value === "point" || value === "polygon") {
      setMapMode(value);
      setIsDrawing(false);
    }
  };

  const handleStartDrawing = () => {
    setIsDrawing(true);
  };

  const handleClearSelection = () => {
    setSelectedPoint(undefined);
    setSelectedPolygon(undefined);
    setIsDrawing(false);
    onLocationSelect(undefined, undefined);
  };

  const handleMapUpdate = (point?: Point, polygon?: Polygon) => {
    if (point) setSelectedPoint(point);
    if (polygon) setSelectedPolygon(polygon);
    if (polygon) setIsDrawing(false);

    // Immediately notify parent of the selection
    onLocationSelect(point, polygon);
  };

  // Reset map rotation and tilt
  const handleResetView = (e: any) => {
    e?.preventDefault();
    if (window && (window as any).mapControls) {
      (window as any).mapControls.resetRotation();
      setRotation(0);
      setTilt(0);
    }
  };

  // Rotate map 45 degrees (for quick rotation)
  const handleRotate = (e: any) => {
    e?.preventDefault();
    if (window && (window as any).mapControls) {
      // Toggle between 0 and 45-degree rotation
      const newRotation = rotation === 0 ? Math.PI / 4 : 0;
      (window as any).mapControls.setRotation(newRotation);
      setRotation(newRotation);
    }
  };

  // Toggle tilt (for quick 3D-like view)
  const handleToggleTilt = (e: any) => {
    e?.preventDefault();
    if (window && (window as any).mapControls) {
      // Toggle between 0 and 30-degree tilt
      const newTilt = tilt === 0 ? 30 : 0;
      (window as any).mapControls.applyTilt(newTilt);
      setTilt(newTilt);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="p-3 border-b bg-background flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex items-center gap-4 flex-wrap">
          <ToggleGroup
            type="single"
            value={mapMode}
            onValueChange={handleModeSwitchChange}
            className="justify-start"
          >
            <ToggleGroupItem
              value="point"
              aria-label="Toggle point mode"
              className="text-xs sm:text-sm"
            >
              बिन्दु स्थान
            </ToggleGroupItem>
            <ToggleGroupItem
              value="polygon"
              aria-label="Toggle polygon mode"
              className="text-xs sm:text-sm"
            >
              क्षेत्र आकार
            </ToggleGroupItem>
          </ToggleGroup>

          <Button
            variant="outline"
            size="sm"
            className="text-xs sm:text-sm"
            onClick={(e) => {
              e.preventDefault();
              toggleView();
            }}
          >
            <MapIcon className="h-3 w-3 mr-1" />
            {isStreetView ? "उपग्रह दृश्य" : "सडक दृश्य"}
          </Button>

          <TooltipProvider>
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-9 h-9 p-0"
                    onClick={handleResetView}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Reset View</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-9 h-9 p-0"
                    onClick={handleRotate}
                  >
                    <Compass className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Toggle 45° Rotation</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-9 h-9 p-0"
                    onClick={handleToggleTilt}
                  >
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
                    >
                      <path d="M12 22l-9-4V6l9 4" />
                      <path d="M12 22V10" />
                      <path d="M12 22l9-4V6l-9 4" />
                    </svg>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Toggle 3D View</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </div>

        <div className="flex gap-2">
          {mapMode === "polygon" && !isDrawing && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleStartDrawing}
              className="text-xs sm:text-sm"
            >
              रेखाङ्कन सुरु
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={handleClearSelection}
            className="text-xs sm:text-sm"
          >
            <Trash2 className="h-3 w-3 mr-1" />
            सबै हटाउनुहोस्
          </Button>
        </div>
      </div>

      {/* Height increased for better UX */}
      <div className="w-full h-[750px] relative">
        <OpenLayersMap
          mapMode={mapMode}
          isDrawing={isDrawing}
          initialPoint={initialPoint}
          initialPolygon={initialPolygon}
          onUpdate={handleMapUpdate}
          startDrawing={isDrawing}
        />
      </div>

      <div className="p-3 border-t text-xs bg-muted/20 flex justify-between items-center">
        <div>
          {mapMode === "point"
            ? "नक्सामा बिन्दु चयन गर्नका लागि क्लिक गर्नुहोस्"
            : isDrawing
              ? "रेखाङ्कन गर्न बिन्दुहरू क्लिक गर्दै जानुहोस् र पहिलो बिन्दुमा क्लिक गरेर समाप्त गर्नुहोस्"
              : "क्षेत्र रेखाङ्कन गर्न माथिको बटन क्लिक गर्नुहोस्"}
        </div>
        <div className="text-muted-foreground">
          नक्सा घुमाउन <kbd className="px-1 rounded bg-muted">Shift</kbd> + माउस
          ड्र्याग प्रयोग गर्नुहोस्
        </div>
      </div>
    </div>
  );
}

export default LocationMapInput;
