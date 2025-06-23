import { Layers, MapPin, Square } from "lucide-react";
import { useMapLayersStore } from "@/store/map-layers-store";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export function MapLayerControls() {
  const { showPoints, showPolygons, setShowPoints, setShowPolygons } =
    useMapLayersStore();

  return (
    <Card className="w-56 bg-white/90 backdrop-blur-sm shadow-md">
      <CardHeader className="p-3 pb-1">
        <CardTitle className="text-sm flex items-center gap-2">
          <Layers className="h-4 w-4" />
          नक्सा तहहरू
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-0 space-y-3">
        <div className="flex items-center justify-between">
          <Label
            htmlFor="show-points"
            className="flex items-center gap-2 cursor-pointer"
          >
            <MapPin className="h-4 w-4 text-primary" />
            <span>बिन्दुहरू देखाउनुहोस्</span>
          </Label>
          <Switch
            id="show-points"
            checked={showPoints}
            onCheckedChange={setShowPoints}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label
            htmlFor="show-polygons"
            className="flex items-center gap-2 cursor-pointer"
          >
            <Square className="h-4 w-4 text-primary" />
            <span>क्षेत्रहरू देखाउनुहोस्</span>
          </Label>
          <Switch
            id="show-polygons"
            checked={showPolygons}
            onCheckedChange={setShowPolygons}
          />
        </div>
      </CardContent>
    </Card>
  );
}
