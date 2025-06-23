"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  MapIcon,
  Eye,
  Database,
  Droplet,
  Sprout,
  Leaf,
  UtilityPole,
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

interface AgricZoneItem {
  id: string;
  name: string;
  slug: string;
  type: string;
  wardNumber?: number;
  location?: string;
  address?: string;
  areaInHectares?: number;
  soilQuality?: string;
  irrigationSystem?: string;
  majorCrops?: string;
  seasonalAvailability?: string;
  hasStorage?: boolean;
  hasProcessingUnit?: boolean;
  hasFarmersCooperative?: boolean;
  locationPoint?: {
    type: string;
    coordinates: [number, number];
  };
  areaPolygon?: {
    type: string;
    coordinates: Array<Array<[number, number]>>;
  };
  primaryMedia?: {
    mediaId: string;
    url: string;
    fileName?: string;
  };
}

interface MapViewProps {
  zones: AgricZoneItem[];
  zoneTypes: { value: string; label: string }[];
  isLoading?: boolean;
}

export function MapView({ zones, zoneTypes, isLoading }: MapViewProps) {
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
  const [selectedZone, setSelectedZone] = useState<AgricZoneItem | null>(null);

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
        const zoneType = feature.get("type");
        const soilQuality = feature.get("soilQuality");

        let fillColor = "#10b981"; // Default green for agricultural areas

        // Color based on zone type
        switch (zoneType) {
          case "PULSES":
            fillColor = "#10b981"; // Green
            break;
          case "OILSEEDS":
            fillColor = "#f59e0b"; // Yellow
            break;
          case "COMMERCIAL_FLOWER":
            fillColor = "#ec4899"; // Pink
            break;
          case "SEASONAL_CROPS":
            fillColor = "#3b82f6"; // Blue
            break;
          case "SUPER_ZONE":
            fillColor = "#8b5cf6"; // Purple
            break;
          case "POCKET_AREA":
            fillColor = "#6366f1"; // Indigo
            break;
          case "MIXED":
            fillColor = "#d97706"; // Amber
            break;
        }

        // Different style based on soil quality
        let strokeWidth = 2;
        if (soilQuality) {
          if (soilQuality === "EXCELLENT" || soilQuality === "GOOD") {
            strokeWidth = 3; // Better soil quality gets thicker border
          }
        }

        return new Style({
          image: new Circle({
            radius: 8,
            fill: new Fill({ color: fillColor }),
            stroke: new Stroke({ color: "#ffffff", width: strokeWidth }),
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
        const zoneType = feature.get("type");
        let fillColor = "rgba(16, 185, 129, 0.2)"; // Default light green
        let strokeColor = "#10b981"; // Default green

        // Color based on zone type
        switch (zoneType) {
          case "PULSES":
            fillColor = "rgba(16, 185, 129, 0.2)"; // Light green
            strokeColor = "#10b981"; // Green
            break;
          case "OILSEEDS":
            fillColor = "rgba(245, 158, 11, 0.2)"; // Light yellow
            strokeColor = "#f59e0b"; // Yellow
            break;
          case "COMMERCIAL_FLOWER":
            fillColor = "rgba(236, 72, 153, 0.2)"; // Light pink
            strokeColor = "#ec4899"; // Pink
            break;
          case "SEASONAL_CROPS":
            fillColor = "rgba(59, 130, 246, 0.2)"; // Light blue
            strokeColor = "#3b82f6"; // Blue
            break;
          case "SUPER_ZONE":
            fillColor = "rgba(139, 92, 246, 0.2)"; // Light purple
            strokeColor = "#8b5cf6"; // Purple
            break;
          case "POCKET_AREA":
            fillColor = "rgba(99, 102, 241, 0.2)"; // Light indigo
            strokeColor = "#6366f1"; // Indigo
            break;
          case "MIXED":
            fillColor = "rgba(217, 119, 6, 0.2)"; // Light amber
            strokeColor = "#d97706"; // Amber
            break;
        }

        return new Style({
          fill: new Fill({ color: fillColor }),
          stroke: new Stroke({ color: strokeColor, width: 2 }),
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

    // Add click handler for zone selection
    mapRef.current.on("click", function (evt) {
      const feature = mapRef.current!.forEachFeatureAtPixel(
        evt.pixel,
        function (feature) {
          return feature;
        },
      );

      if (feature) {
        const zoneId = feature.get("id");
        const zone = zones.find((z) => z.id === zoneId);
        if (zone) {
          setSelectedZone(zone);

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
        setSelectedZone(null);
        if (overlayRef.current) {
          overlayRef.current.setPosition(undefined);
        }
      }
    });

    // Add features for all agricultural zones
    addAgricZoneFeatures(pointSource, polygonSource, zones);

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

  // Update the map when zones change
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
    addAgricZoneFeatures(pointSource, polygonSource, zones);

    // Reset selection when zones change
    setSelectedZone(null);
    if (overlayRef.current) {
      overlayRef.current.setPosition(undefined);
    }

    // Auto-fit to all features
    fitMapToFeatures(pointSource, polygonSource);
  }, [zones]);

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
  const addAgricZoneFeatures = (
    pointSource: VectorSource | null,
    polygonSource: VectorSource | null,
    zones: AgricZoneItem[],
  ) => {
    if (!pointSource || !polygonSource) return;

    zones.forEach((zone) => {
      // Add point feature for location
      if (zone.locationPoint) {
        try {
          const coordinates = zone.locationPoint.coordinates;
          const point = new OLPoint(fromLonLat(coordinates));
          const feature = new Feature({
            geometry: point,
            id: zone.id,
            name: zone.name,
            type: zone.type,
            soilQuality: zone.soilQuality,
          });
          pointSource.addFeature(feature);
        } catch (error) {
          console.error("Error adding point for", zone.id, error);
        }
      }

      // Add polygon feature for area boundary
      if (zone.areaPolygon) {
        try {
          const coordinates = zone.areaPolygon.coordinates[0].map((coord) =>
            fromLonLat(coord),
          );

          const polygon = new OLPolygon([coordinates]);
          const feature = new Feature({
            geometry: polygon,
            id: zone.id,
            name: zone.name,
            type: zone.type,
            soilQuality: zone.soilQuality,
          });
          polygonSource.addFeature(feature);
        } catch (error) {
          console.error("Error adding polygon for", zone.id, error);
        }
      }
    });
  };

  // Function to view zone details
  const handleViewZone = () => {
    if (selectedZone) {
      router.push(
        `/dashboard/digital-profile/institutions/agricultural/agric-zones/${selectedZone.id}`,
      );
    }
  };

  // Helper function to get zone type label
  const getZoneTypeLabel = (type: string) => {
    const found = zoneTypes.find((t) => t.value === type);
    return found ? found.label : type;
  };

  // Soil quality label helper
  const getSoilQualityLabel = (quality?: string) => {
    if (!quality) return "";
    const labels: Record<string, string> = {
      EXCELLENT: "उत्तम",
      GOOD: "राम्रो",
      AVERAGE: "औसत",
      POOR: "कमजोर",
      VERY_POOR: "धेरै कमजोर",
    };
    return labels[quality] || quality;
  };

  // Irrigation system label helper
  const getIrrigationSystemLabel = (system?: string) => {
    if (!system) return "";
    const labels: Record<string, string> = {
      CANAL: "नहर/कुलो",
      SPRINKLER: "स्प्रिंकलर सिंचाई",
      DRIP: "थोपा सिंचाई",
      GROUNDWATER: "भूमिगत पानी",
      RAINWATER_HARVESTING: "वर्षाको पानी संकलन",
      SEASONAL_RIVER: "मौसमी खोला/नदी",
      NONE: "सिंचाई छैन",
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
          <div className="text-xs font-medium mb-1">कृषि क्षेत्र प्रकार</div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-xs">दलहन</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span className="text-xs">तेलहन</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-pink-500"></div>
              <span className="text-xs">फूल खेती</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-xs">मौसमी बाली</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              <span className="text-xs">सुपर जोन</span>
            </div>
          </div>
        </div>

        {/* Popup overlay */}
        <div ref={overlayContentRef} className="ol-popup">
          {selectedZone && (
            <Card className="w-64 shadow-lg overflow-hidden">
              {selectedZone.primaryMedia?.url && (
                <div className="w-full h-32">
                  <img
                    src={selectedZone.primaryMedia.url}
                    alt={selectedZone.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardContent className="p-3">
                <h3 className="font-medium">{selectedZone.name}</h3>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-sm text-muted-foreground">
                    {getZoneTypeLabel(selectedZone.type)}
                  </p>
                  {selectedZone.areaInHectares && (
                    <Badge variant="outline">
                      {selectedZone.areaInHectares} हेक्टर
                    </Badge>
                  )}
                </div>

                {(selectedZone.wardNumber || selectedZone.location) && (
                  <div className="mt-2 text-xs text-muted-foreground">
                    {selectedZone.wardNumber && (
                      <span className="mr-2">
                        वडा नं.: {selectedZone.wardNumber}
                      </span>
                    )}
                    {selectedZone.location && (
                      <span>{selectedZone.location}</span>
                    )}
                  </div>
                )}

                {selectedZone.majorCrops && (
                  <div className="mt-1 text-xs">
                    <span className="font-medium">बालीहरू:</span>{" "}
                    {selectedZone.majorCrops}
                  </div>
                )}

                {selectedZone.soilQuality && (
                  <div className="mt-1 text-xs text-muted-foreground">
                    <span>माटो:</span>{" "}
                    {getSoilQualityLabel(selectedZone.soilQuality)}
                  </div>
                )}

                {selectedZone.irrigationSystem && (
                  <div className="mt-1 text-xs text-muted-foreground flex items-center">
                    <Droplet className="h-3 w-3 mr-1" />
                    <span>
                      {getIrrigationSystemLabel(selectedZone.irrigationSystem)}
                    </span>
                  </div>
                )}

                <div className="flex flex-wrap gap-1 mt-2">
                  {selectedZone.hasStorage && (
                    <Badge variant="outline" className="text-xs">
                      <Database className="h-3 w-3 mr-1" />
                      भण्डारण
                    </Badge>
                  )}
                  {selectedZone.hasProcessingUnit && (
                    <Badge variant="outline" className="text-xs">
                      प्रशोधन
                    </Badge>
                  )}
                  {selectedZone.hasFarmersCooperative && (
                    <Badge variant="outline" className="text-xs">
                      सहकारी
                    </Badge>
                  )}
                </div>

                <div className="mt-2 flex justify-end">
                  <Button size="sm" variant="default" onClick={handleViewZone}>
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
