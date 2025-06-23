import { Layers, Map, CircleIcon } from "lucide-react";
import { useMapLayersStore } from "@/store/map-layers-store";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export function MapLayerControls() {
  const { showRoutes, showStops, setShowRoutes, setShowStops } =
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
            htmlFor="show-routes"
            className="flex items-center gap-2 cursor-pointer"
          >
            <Map className="h-4 w-4 text-primary" />
            <span>मार्ग देखाउनुहोस्</span>
          </Label>
          <Switch
            id="show-routes"
            checked={showRoutes}
            onCheckedChange={setShowRoutes}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label
            htmlFor="show-stops"
            className="flex items-center gap-2 cursor-pointer"
          >
            <CircleIcon className="h-4 w-4 text-primary" />
            <span>बिसौनी देखाउनुहोस्</span>
          </Label>
          <Switch
            id="show-stops"
            checked={showStops}
            onCheckedChange={setShowStops}
          />
        </div>
      </CardContent>
    </Card>
  );
}
