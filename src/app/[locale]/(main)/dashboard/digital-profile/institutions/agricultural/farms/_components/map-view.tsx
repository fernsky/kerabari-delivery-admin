"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  MapIcon,
  Eye,
  Tractor,
  Milk,
  Leaf,
  Database,
  Home,
  Route,
} from "lucide-react";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { fromLonLat } from "ol/proj";
import { Style, Fill, Stroke, Circle, Text } from "ol/style";
import { Feature } from "ol";
import { Point as OLPoint, Polygon as OLPolygon } from "ol/geom";
import Overlay from "ol/Overlay";
import { useMapViewStore } from "@/store/map-view-store";
import { useMapLayersStore } from "@/store/map-layers-store";
import { Badge } from "@/components/ui/badge";
import { MapLayerControls } from "./map-layer-controls";

interface FarmItem {
  id: string;
  name: string;
  slug: string;
  farmType: string;
  farmingSystem?: string;
  wardNumber?: number;
  location?: string;
  address?: string;
  totalAreaInHectares?: number;
  cultivatedAreaInHectares?: number;
  ownerName?: string;
  hasLivestock?: boolean;
  livestockTypes?: string;
  mainCrops?: string;
  isVerified?: boolean;
  locationPoint?: {
    type: string;
    coordinates: [number, number];
  };
  farmBoundary?: {
    type: string;
    coordinates: Array<Array<[number, number]>>;
  };
  primaryMedia?: {
    mediaId: string;
    url: string;
    fileName?: string;
    mimeType?: string;
  };
  hasStorage?: boolean;
  hasFarmHouse?: boolean;
  hasRoadAccess?: boolean;
}

interface MapViewProps {
  farms: FarmItem[];
  farmTypes: { value: string; label: string }[];
  isLoading?: boolean;
}

export function MapView({ farms, farmTypes, isLoading }: MapViewProps) {
  const router = useRouter();
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const overlayRef = useRef<Overlay | null>(null);
  const overlayContentRef = useRef<HTMLDivElement>(null);
  const tileLayerRef = useRef<TileLayer<any> | null>(null);
  const pointLayerRef = useRef<VectorLayer<VectorSource> | null>(null);
  const polygonLayerRef = useRef<VectorLayer<VectorSource> | null>(null);
  const { isStreetView, toggleView } = useMapViewStore();
  const { showPoints, showPolygons } = useMapLayersStore();
  const [selectedFarm, setSelectedFarm] = useState<FarmItem | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    // Create vector sources for points and polygons
    const pointSource = new VectorSource();
    const polygonSource = new VectorSource();

    // Create vector layer for point features
    const pointLayer = new VectorLayer({
      source: pointSource,
      style: (feature) => {
        const farmType = feature.get("farmType");
        const hasLivestock = feature.get("hasLivestock");
        const isVerified = feature.get("isVerified");

        let fillColor = "#10b981"; // Default green for crop farms

        // Color based on farm type
        switch (farmType) {
          case "CROP_FARM":
            fillColor = "#10b981"; // Green
            break;
          case "LIVESTOCK_FARM":
            fillColor = "#f59e0b"; // Yellow
            break;
          case "MIXED_FARM":
            fillColor = "#3b82f6"; // Blue
            break;
          case "POULTRY_FARM":
            fillColor = "#f97316"; // Orange
            break;
          case "DAIRY_FARM":
            fillColor = "#06b6d4"; // Cyan
            break;
          case "AQUACULTURE_FARM":
            fillColor = "#6366f1"; // Indigo
            break;
          case "HORTICULTURE_FARM":
            fillColor = "#10b981"; // Green
            break;
          case "APICULTURE_FARM":
            fillColor = "#eab308"; // Yellow
            break;
          case "SERICULTURE_FARM":
            fillColor = "#a855f7"; // Purple
            break;
          case "ORGANIC_FARM":
            fillColor = "#84cc16"; // Lime
            break;
          case "COMMERCIAL_FARM":
            fillColor = "#ef4444"; // Red
            break;
          case "SUBSISTENCE_FARM":
            fillColor = "#0ea5e9"; // Sky
            break;
          case "AGROFORESTRY":
            fillColor = "#14b8a6"; // Teal
            break;
          default:
            fillColor = "#6b7280"; // Gray
            break;
        }

        // Different style for verified farms
        let strokeColor = "#ffffff";
        let strokeWidth = isVerified ? 3 : 2;

        return new Style({
          image: new Circle({
            radius: 8,
            fill: new Fill({ color: fillColor }),
            stroke: new Stroke({ color: strokeColor, width: strokeWidth }),
          }),
          text: new Text({
            text: feature.get("name"),
            offsetY: -15,
            font: "12px sans-serif",
            fill: new Fill({ color: "#000000" }),
            stroke: new Stroke({ color: "#ffffff", width: 3 }),
            textAlign: "center",
          }),
        });
      },
      visible: showPoints,
    });

    // Create vector layer for polygon features
    const polygonLayer = new VectorLayer({
      source: polygonSource,
      style: (feature) => {
        const farmType = feature.get("farmType");
        const isVerified = feature.get("isVerified");

        let fillColor = "rgba(16, 185, 129, 0.2)"; // Default light green
        let strokeColor = "#10b981"; // Default green

        // Color based on farm type
        switch (farmType) {
          case "CROP_FARM":
            fillColor = "rgba(16, 185, 129, 0.2)"; // Light green
            strokeColor = "#10b981"; // Green
            break;
          case "LIVESTOCK_FARM":
            fillColor = "rgba(245, 158, 11, 0.2)"; // Light amber
            strokeColor = "#f59e0b"; // Amber
            break;
          case "MIXED_FARM":
            fillColor = "rgba(59, 130, 246, 0.2)"; // Light blue
            strokeColor = "#3b82f6"; // Blue
            break;
          case "POULTRY_FARM":
            fillColor = "rgba(249, 115, 22, 0.2)"; // Light orange
            strokeColor = "#f97316"; // Orange
            break;
          case "DAIRY_FARM":
            fillColor = "rgba(6, 182, 212, 0.2)"; // Light cyan
            strokeColor = "#06b6d4"; // Cyan
            break;
          case "AQUACULTURE_FARM":
            fillColor = "rgba(99, 102, 241, 0.2)"; // Light indigo
            strokeColor = "#6366f1"; // Indigo
            break;
          case "HORTICULTURE_FARM":
            fillColor = "rgba(16, 185, 129, 0.2)"; // Light emerald
            strokeColor = "#10b981"; // Emerald
            break;
          case "APICULTURE_FARM":
            fillColor = "rgba(234, 179, 8, 0.2)"; // Light yellow
            strokeColor = "#eab308"; // Yellow
            break;
          case "SERICULTURE_FARM":
            fillColor = "rgba(168, 85, 247, 0.2)"; // Light purple
            strokeColor = "#a855f7"; // Purple
            break;
          case "ORGANIC_FARM":
            fillColor = "rgba(132, 204, 22, 0.2)"; // Light lime
            strokeColor = "#84cc16"; // Lime
            break;
          case "COMMERCIAL_FARM":
            fillColor = "rgba(239, 68, 68, 0.2)"; // Light red
            strokeColor = "#ef4444"; // Red
            break;
          case "SUBSISTENCE_FARM":
            fillColor = "rgba(14, 165, 233, 0.2)"; // Light sky
            strokeColor = "#0ea5e9"; // Sky
            break;
          case "AGROFORESTRY":
            fillColor = "rgba(20, 184, 166, 0.2)"; // Light teal
            strokeColor = "#14b8a6"; // Teal
            break;
          default:
            fillColor = "rgba(107, 114, 128, 0.2)"; // Light gray
            strokeColor = "#6b7280"; // Gray
            break;
        }

        // Different style for verified farms
        let strokeWidth = isVerified ? 3 : 2;

        return new Style({
          fill: new Fill({ color: fillColor }),
          stroke: new Stroke({ color: strokeColor, width: strokeWidth }),
        });
      },
      visible: showPolygons,
    });

    // Store references to layers
    pointLayerRef.current = pointLayer;
    polygonLayerRef.current = polygonLayer;

    // Create the base tile layer based on the view preference
    const tileLayer = new TileLayer({
      source: isStreetView
        ? new XYZ({
            url: "https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
            maxZoom: 19,
          })
        : new XYZ({
            url: "https://mt1.google.com/vt/lyrs=y,h&x={x}&y={y}&z={z}",
            maxZoom: 19,
          }),
    });

    tileLayerRef.current = tileLayer;

    // Create the popup overlay
    const overlay = new Overlay({
      element: overlayContentRef.current!,
      positioning: "bottom-center",
      offset: [0, -10],
      autoPan: true,
    });

    overlayRef.current = overlay;

    // Create the map
    mapRef.current = new Map({
      target: mapContainer.current,
      layers: [tileLayer, polygonLayer, pointLayer], // Order matters for rendering
      view: new View({
        center: fromLonLat([84.0, 28.3]), // Default center of Nepal
        zoom: 7,
      }),
      overlays: [overlay],
    });

    // Add click handler for farm selection
    mapRef.current.on("click", function (evt) {
      const feature = mapRef.current!.forEachFeatureAtPixel(
        evt.pixel,
        function (feature) {
          return feature;
        },
      );

      if (feature) {
        const farmId = feature.get("id");
        const farm = farms.find((f) => f.id === farmId);
        if (farm) {
          setSelectedFarm(farm);

          // Position the overlay
          let coordinates;
          if (feature.getGeometry()?.getType() === "Point") {
            coordinates = (feature.getGeometry() as OLPoint).getCoordinates();
          } else if (feature.getGeometry()?.getType() === "Polygon") {
            // For polygons, get the centroid
            const polyGeom = feature.getGeometry() as OLPolygon;
            const extent = polyGeom.getExtent();
            coordinates = [
              (extent[0] + extent[2]) / 2,
              (extent[1] + extent[3]) / 2,
            ];
          }

          if (coordinates && overlayRef.current) {
            overlayRef.current.setPosition(coordinates);
          }
        }
      } else {
        setSelectedFarm(null);
        if (overlayRef.current) {
          overlayRef.current.setPosition(undefined);
        }
      }
    });

    // Add features for all farms
    addFarmFeatures(pointSource, polygonSource, farms);

    // Auto-fit to all features
    fitMapToFeatures(pointSource, polygonSource);

    // Cleanup function
    return () => {
      if (mapRef.current) {
        mapRef.current.setTarget(undefined);
        mapRef.current = null;
      }
    };
  }, []);

  // Update the map when farms change
  useEffect(() => {
    if (!mapRef.current || !pointLayerRef.current || !polygonLayerRef.current)
      return;

    // Get the vector sources from the layers
    const pointSource = pointLayerRef.current.getSource();
    const polygonSource = polygonLayerRef.current.getSource();

    // Clear existing features
    pointSource?.clear();
    polygonSource?.clear();

    // Add new features
    addFarmFeatures(pointSource, polygonSource, farms);

    // Reset selection when farms change
    setSelectedFarm(null);
    if (overlayRef.current) {
      overlayRef.current.setPosition(undefined);
    }

    // Auto-fit to all features
    fitMapToFeatures(pointSource, polygonSource);
  }, [farms]);

  // Update the tile layer when view type changes
  useEffect(() => {
    if (!mapRef.current) return;

    // Create a new tile source based on the current view setting
    const newSource = isStreetView
      ? new XYZ({
          url: "https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
          maxZoom: 19,
        })
      : new XYZ({
          url: "https://mt1.google.com/vt/lyrs=y,h&x={x}&y={y}&z={z}",
          maxZoom: 19,
        });

    // If we have a tile layer reference, update its source
    if (tileLayerRef.current) {
      tileLayerRef.current.setSource(newSource);
    }
  }, [isStreetView]);

  // Update layer visibility when showPoints or showPolygons change
  useEffect(() => {
    if (pointLayerRef.current) {
      pointLayerRef.current.setVisible(showPoints);
    }
  }, [showPoints]);

  useEffect(() => {
    if (polygonLayerRef.current) {
      polygonLayerRef.current.setVisible(showPolygons);
    }
  }, [showPolygons]);

  // Helper function to fit the map view to features
  const fitMapToFeatures = (
    pointSource: VectorSource | null,
    polygonSource: VectorSource | null,
  ) => {
    if (!mapRef.current) return;

    // Try to fit to polygon features first
    if (polygonSource && polygonSource.getFeatures().length > 0) {
      const polygonExtent = polygonSource.getExtent();
      if (polygonExtent[0] !== Infinity && polygonExtent[1] !== Infinity) {
        mapRef.current.getView().fit(polygonExtent, {
          padding: [50, 50, 50, 50],
          maxZoom: 14,
        });
        return;
      }
    }

    // If no polygon features, try to fit to point features
    if (pointSource && pointSource.getFeatures().length > 0) {
      const pointExtent = pointSource.getExtent();
      if (pointExtent[0] !== Infinity && pointExtent[1] !== Infinity) {
        mapRef.current.getView().fit(pointExtent, {
          padding: [50, 50, 50, 50],
          maxZoom: 14,
        });
      }
    }
  };

  // Helper function to add features to the map
  const addFarmFeatures = (
    pointSource: VectorSource | null,
    polygonSource: VectorSource | null,
    farms: FarmItem[],
  ) => {
    if (!pointSource || !polygonSource) return;

    farms.forEach((farm) => {
      // Add point feature for location
      if (farm.locationPoint) {
        try {
          const coordinates = farm.locationPoint.coordinates;
          const point = new OLPoint(fromLonLat(coordinates));
          const feature = new Feature({
            geometry: point,
            id: farm.id,
            name: farm.name,
            farmType: farm.farmType,
            hasLivestock: farm.hasLivestock,
            isVerified: farm.isVerified,
          });
          pointSource.addFeature(feature);
        } catch (error) {
          console.error("Error adding point for", farm.id, error);
        }
      }

      // Add polygon feature for farm boundary
      if (farm.farmBoundary) {
        try {
          const coordinates = farm.farmBoundary.coordinates[0].map((coord) =>
            fromLonLat(coord),
          );

          const polygon = new OLPolygon([coordinates]);
          const feature = new Feature({
            geometry: polygon,
            id: farm.id,
            name: farm.name,
            farmType: farm.farmType,
            hasLivestock: farm.hasLivestock,
            isVerified: farm.isVerified,
          });
          polygonSource.addFeature(feature);
        } catch (error) {
          console.error("Error adding polygon for", farm.id, error);
        }
      }
    });
  };

  // Function to view farm details
  const handleViewFarm = () => {
    if (selectedFarm) {
      router.push(
        `/dashboard/digital-profile/institutions/agricultural/farms/${selectedFarm.id}`,
      );
    }
  };

  // Helper function to get farm type label
  const getFarmTypeLabel = (type: string) => {
    const found = farmTypes.find((t) => t.value === type);
    return found ? found.label : type;
  };

  // Farming system label helper
  const getFarmingSystemLabel = (system?: string) => {
    if (!system) return "";
    const labels: Record<string, string> = {
      CONVENTIONAL: "परम्परागत",
      ORGANIC: "जैविक",
      INTEGRATED: "एकीकृत",
      CONSERVATION: "संरक्षण",
      HYDROPONIC: "हाइड्रोपोनिक",
      PERMACULTURE: "पर्माकल्चर",
      BIODYNAMIC: "जैव-गतिशील",
      TRADITIONAL: "पारम्परिक",
      MIXED: "मिश्रित",
    };
    return labels[system] || system;
  };

  return (
    <>
      <div className="relative h-[600px] rounded-lg border overflow-hidden">
        <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />

        {/* Map controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <Button
            size="sm"
            className="bg-white text-black hover:bg-gray-100"
            onClick={() => toggleView()}
          >
            <MapIcon className="h-4 w-4 mr-2" />
            {isStreetView ? "उपग्रह दृश्य" : "सडक दृश्य"}
          </Button>
        </div>

        {/* Map layer controls */}
        <div className="absolute top-4 left-4">
          <MapLayerControls />
        </div>

        {/* Map legend */}
        <div className="absolute bottom-4 left-4 bg-white p-2 rounded-md shadow-md">
          <div className="text-xs font-medium mb-1">फार्म प्रकार</div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-xs">बाली फार्म</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span className="text-xs">पशु फार्म</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-xs">मिश्रित फार्म</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <span className="text-xs">कुखुरा फार्म</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
              <span className="text-xs">डेरी फार्म</span>
            </div>
          </div>
        </div>

        {/* Popup overlay */}
        <div ref={overlayContentRef} className="ol-popup">
          {selectedFarm && (
            <Card className="w-64 shadow-lg overflow-hidden">
              {selectedFarm.primaryMedia?.url && (
                <div className="w-full h-32">
                  <img
                    src={selectedFarm.primaryMedia.url}
                    alt={selectedFarm.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardContent className="p-3">
                <h3 className="font-medium">{selectedFarm.name}</h3>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-sm text-muted-foreground">
                    {getFarmTypeLabel(selectedFarm.farmType)}
                  </p>
                  {selectedFarm.totalAreaInHectares && (
                    <Badge variant="outline">
                      {selectedFarm.totalAreaInHectares} हेक्टर
                    </Badge>
                  )}
                </div>

                {(selectedFarm.wardNumber || selectedFarm.location) && (
                  <div className="mt-2 text-xs text-muted-foreground">
                    {selectedFarm.wardNumber && (
                      <span className="mr-2">
                        वडा नं.: {selectedFarm.wardNumber}
                      </span>
                    )}
                    {selectedFarm.location && (
                      <span>{selectedFarm.location}</span>
                    )}
                  </div>
                )}

                {selectedFarm.mainCrops && (
                  <div className="mt-1 text-xs">
                    <span className="font-medium">बालीहरू:</span>{" "}
                    {selectedFarm.mainCrops}
                  </div>
                )}

                {selectedFarm.farmingSystem && (
                  <div className="mt-1 text-xs text-muted-foreground">
                    <span>खेती प्रणाली:</span>{" "}
                    {getFarmingSystemLabel(selectedFarm.farmingSystem)}
                  </div>
                )}

                {selectedFarm.hasLivestock && selectedFarm.livestockTypes && (
                  <div className="mt-1 text-xs text-muted-foreground flex items-center">
                    <Milk className="h-3 w-3 mr-1" />
                    <span>{selectedFarm.livestockTypes}</span>
                  </div>
                )}

                <div className="flex flex-wrap gap-1 mt-2">
                  {selectedFarm.hasStorage && (
                    <Badge variant="outline" className="text-xs">
                      <Database className="h-3 w-3 mr-1" />
                      भण्डारण
                    </Badge>
                  )}
                  {selectedFarm.hasFarmHouse && (
                    <Badge variant="outline" className="text-xs">
                      <Home className="h-3 w-3 mr-1" />
                      फार्म हाउस
                    </Badge>
                  )}
                  {selectedFarm.hasRoadAccess && (
                    <Badge variant="outline" className="text-xs">
                      <Route className="h-3 w-3 mr-1" />
                      सडक पहुँच
                    </Badge>
                  )}
                </div>

                <div className="mt-2 flex justify-end">
                  <Button size="sm" variant="default" onClick={handleViewFarm}>
                    <Eye className="h-4 w-4 mr-2" />
                    हेर्नुहोस्
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-sm">नक्सा लोड हुँदैछ...</p>
          </div>
        </div>
      )}

      <style jsx>{`
        .ol-popup {
          position: absolute;
          pointer-events: auto;
        }
      `}</style>
    </>
  );
}
