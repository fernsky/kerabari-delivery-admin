import { Button } from "@/components/ui/button";
import { LayoutGrid, List, MapPin } from "lucide-react";

interface ViewSelectorProps {
  currentView: "table" | "grid" | "map";
  onViewChange: (view: "table" | "grid" | "map") => void;
}

export function ViewSelector({ currentView, onViewChange }: ViewSelectorProps) {
  return (
    <div className="flex gap-1 border rounded-md">
      <Button
        variant={currentView === "table" ? "default" : "ghost"}
        size="sm"
        onClick={() => onViewChange("table")}
        className="rounded-none rounded-l-md"
      >
        <List className="h-4 w-4 mr-2" />
        तालिका
      </Button>
      <Button
        variant={currentView === "grid" ? "default" : "ghost"}
        size="sm"
        onClick={() => onViewChange("grid")}
        className="rounded-none"
      >
        <LayoutGrid className="h-4 w-4 mr-2" />
        ग्रिड
      </Button>
      <Button
        variant={currentView === "map" ? "default" : "ghost"}
        size="sm"
        onClick={() => onViewChange("map")}
        className="rounded-none rounded-r-md"
      >
        <MapPin className="h-4 w-4 mr-2" />
        नक्सा
      </Button>
    </div>
  );
}
