"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Layers, MapPin, DraftingCompass } from "lucide-react";
import { useMapLayersStore } from "@/store/map-layers-store";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";

export function MapLayerControls() {
  const { showPoints, showPolygons, setShowPoints, setShowPolygons } =
    useMapLayersStore();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="relative">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="outline"
              className="bg-white"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <Layers className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>तहहरू व्यवस्थापन</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {isExpanded && (
        <Card className="absolute left-0 top-[calc(100%+10px)] p-4 w-[200px] bg-white/90 backdrop-blur-sm z-10">
          <div className="space-y-3">
            <h4 className="text-sm font-medium">नक्सा तहहरू</h4>

            <div className="flex items-center space-x-2">
              <Switch
                id="show-points"
                checked={showPoints}
                onCheckedChange={setShowPoints}
              />
              <Label htmlFor="show-points" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>मूल स्थानहरू</span>
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="show-polygons"
                checked={showPolygons}
                onCheckedChange={setShowPolygons}
              />
              <Label
                htmlFor="show-polygons"
                className="flex items-center gap-2"
              >
                <DraftingCompass className="h-4 w-4" />
                <span>कृषि क्षेत्रहरू</span>
              </Label>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
