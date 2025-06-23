"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Map as MapIcon, Eye } from "lucide-react";
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
import { Point as OLPoint, LineString as OLLineString } from "ol/geom";
import Overlay from "ol/Overlay";
import { useMapViewStore } from "@/store/map-view-store";
import { useMapLayersStore } from "@/store/map-layers-store";
import { Badge } from "@/components/ui/badge";
import { MapLayerControls } from "./map-layer-controls";

interface RoadItem {
  id: string;
  name: string;
  slug: string;
  type: string;
  condition?: string;
  widthInMeters?: number;
  length?: number;
  roadPath?: {
    type: string;
    coordinates: [number, number][];
  };
  representativePoint?: {
    type: string;
    coordinates: [number, number];
  };
  primaryMedia?: {
    mediaId: string;
    url: string;
    fileName?: string;
  };
}

interface MapViewProps {
  roads: RoadItem[];
  roadTypes: { value: string; label: string }[];
  isLoading?: boolean;
}

export function MapView({ roads, roadTypes, isLoading }: MapViewProps) {
  const router = useRouter();
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const overlayRef = useRef<Overlay | null>(null);
  const overlayContentRef = useRef<HTMLDivElement>(null);
  const tileLayerRef = useRef<TileLayer<any> | null>(null);
  const pointLayerRef = useRef<VectorLayer<VectorSource> | null>(null);
  const lineLayerRef = useRef<VectorLayer<VectorSource> | null>(null);
  const { isStreetView, toggleView } = useMapViewStore();
  const { showPoints, showLines } = useMapLayersStore();
  const [selectedRoad, setSelectedRoad] = useState<RoadItem | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    // Create separate vector sources for points and lines
    const pointSource = new VectorSource();
    const lineSource = new VectorSource();

    // Create vector layer for point features
    const pointLayer = new VectorLayer({
      source: pointSource,
      style: (feature) => {
        const condition = feature.get("condition");

        let fillColor = "#3b82f6"; // Default blue
        if (condition) {
          switch (condition) {
            case "EXCELLENT":
            case "GOOD":
              fillColor = "#10b981"; // Green
              break;
            case "FAIR":
              fillColor = "#f59e0b"; // Yellow
              break;
            case "POOR":
            case "VERY_POOR":
              fillColor = "#ef4444"; // Red
              break;
            case "UNDER_CONSTRUCTION":
              fillColor = "#6366f1"; // Indigo
              break;
          }
        }

        return new Style({
          image: new Circle({
            radius: 8,
            fill: new Fill({ color: fillColor }),
            stroke: new Stroke({ color: "#ffffff", width: 2 }),
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

    // Create vector layer for line features
    const lineLayer = new VectorLayer({
      source: lineSource,
      style: (feature) => {
        const condition = feature.get("condition");

        let strokeColor = "#3b82f6"; // Default blue
        if (condition) {
          switch (condition) {
            case "EXCELLENT":
            case "GOOD":
              strokeColor = "#10b981"; // Green
              break;
            case "FAIR":
              strokeColor = "#f59e0b"; // Yellow
              break;
            case "POOR":
            case "VERY_POOR":
              strokeColor = "#ef4444"; // Red
              break;
            case "UNDER_CONSTRUCTION":
              strokeColor = "#6366f1"; // Indigo
              break;
          }
        }

        return new Style({
          stroke: new Stroke({
            color: strokeColor,
            width: 4,
            lineCap: "round",
            lineJoin: "round",
          }),
        });
      },
      visible: showLines,
    });

    // Store references to layers
    pointLayerRef.current = pointLayer;
    lineLayerRef.current = lineLayer;

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
      layers: [tileLayer, lineLayer, pointLayer],
      view: new View({
        center: fromLonLat([84.0, 28.3]), // Default center of Nepal
        zoom: 7,
      }),
      overlays: [overlay],
    });

    // Add click handler for road selection
    mapRef.current.on("click", function (evt) {
      const feature = mapRef.current!.forEachFeatureAtPixel(
        evt.pixel,
        function (feature) {
          return feature;
        },
      );

      if (feature) {
        const roadId = feature.get("id");
        const road = roads.find((r) => r.id === roadId);
        if (road) {
          setSelectedRoad(road);

          // Position the overlay at the representative point or at one point along the line
          let coordinates;
          if (road.representativePoint) {
            coordinates = fromLonLat(road.representativePoint.coordinates);
          } else if (road.roadPath && road.roadPath.coordinates.length > 0) {
            // For lines, we'll use the middle point
            const middleIndex = Math.floor(
              road.roadPath.coordinates.length / 2,
            );
            coordinates = fromLonLat(road.roadPath.coordinates[middleIndex]);
          }

          if (coordinates && overlayRef.current) {
            overlayRef.current.setPosition(coordinates);
          }
        }
      } else {
        setSelectedRoad(null);
        if (overlayRef.current) {
          overlayRef.current.setPosition(undefined);
        }
      }
    });

    // Add features for all roads
    addRoadFeatures(pointSource, lineSource, roads);

    // Auto-fit to all road features
    fitMapToFeatures(lineSource, pointSource);

    // Cleanup function
    return () => {
      if (mapRef.current) {
        mapRef.current.setTarget(undefined);
        mapRef.current = null;
      }
    };
  }, []);

  // Update the map when roads change
  useEffect(() => {
    if (!mapRef.current || !pointLayerRef.current || !lineLayerRef.current)
      return;

    // Get the vector sources from the layers
    const pointSource = pointLayerRef.current.getSource();
    const lineSource = lineLayerRef.current.getSource();

    // Clear existing features
    pointSource?.clear();
    lineSource?.clear();

    // Add new features
    addRoadFeatures(pointSource, lineSource, roads);

    // Reset selection when roads change
    setSelectedRoad(null);
    if (overlayRef.current) {
      overlayRef.current.setPosition(undefined);
    }

    // Auto-fit to all road features
    fitMapToFeatures(lineSource, pointSource);
  }, [roads]);

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

  // Update layer visibility when showPoints or showLines change
  useEffect(() => {
    if (pointLayerRef.current) {
      pointLayerRef.current.setVisible(showPoints);
    }
  }, [showPoints]);

  useEffect(() => {
    if (lineLayerRef.current) {
      lineLayerRef.current.setVisible(showLines);
    }
  }, [showLines]);

  // Helper function to fit the map view to features
  const fitMapToFeatures = (
    lineSource: VectorSource | null,
    pointSource: VectorSource | null,
  ) => {
    if (!mapRef.current) return;

    // Try to fit to line features first
    if (lineSource && lineSource.getFeatures().length > 0) {
      const lineExtent = lineSource.getExtent();
      if (lineExtent[0] !== Infinity && lineExtent[1] !== Infinity) {
        mapRef.current.getView().fit(lineExtent, {
          padding: [50, 50, 50, 50],
          maxZoom: 14,
        });
        return;
      }
    }

    // If no line features, try to fit to point features
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
  const addRoadFeatures = (
    pointSource: VectorSource | null,
    lineSource: VectorSource | null,
    roads: RoadItem[],
  ) => {
    if (!pointSource || !lineSource) return;

    roads.forEach((road) => {
      // For roads with path geometry, add line feature
      if (road.roadPath && road.roadPath.coordinates.length > 0) {
        try {
          const coordinates = road.roadPath.coordinates.map((coord) =>
            fromLonLat(coord),
          );

          const line = new OLLineString(coordinates);
          console.log(line);
          const feature = new Feature({
            geometry: line,
            id: road.id,
            name: road.name,
            type: road.type,
            condition: road.condition,
          });
          lineSource.addFeature(feature);

          console.log(`Added road path for ${road.name}:`, road.roadPath);
        } catch (error) {
          console.error("Error adding road path for", road.id, error);
        }
      }

      // For representative point or along the path
      try {
        let coordinates;
        if (road.representativePoint) {
          coordinates = road.representativePoint.coordinates;
        } else if (road.roadPath && road.roadPath.coordinates.length > 0) {
          // If there's no representative point but there's a path, use the middle point
          const middleIndex = Math.floor(road.roadPath.coordinates.length / 2);
          coordinates = road.roadPath.coordinates[middleIndex];
        }

        // Add a point feature even if we have a line
        if (coordinates) {
          const point = new OLPoint(fromLonLat(coordinates));
          const feature = new Feature({
            geometry: point,
            id: road.id,
            name: road.name,
            type: road.type,
            condition: road.condition,
          });
          pointSource.addFeature(feature);

          console.log(`Added point for ${road.name}:`, coordinates);
        }
      } catch (error) {
        console.error("Error adding point for", road.id, error);
      }
    });

    console.log("Total roads:", roads.length);
    console.log("Total line features:", lineSource.getFeatures().length);
    console.log("Total point features:", pointSource.getFeatures().length);
  };

  // Function to view road details
  const handleViewRoad = () => {
    if (selectedRoad) {
      router.push(
        `/dashboard/digital-profile/institutions/transportation/roads/${selectedRoad.id}`,
      );
    }
  };

  const getRoadConditionLabel = (condition?: string) => {
    if (!condition) return "अज्ञात";

    const conditions = {
      EXCELLENT: "उत्कृष्ट",
      GOOD: "राम्रो",
      FAIR: "ठीकै",
      POOR: "खराब",
      VERY_POOR: "धेरै खराब",
      UNDER_CONSTRUCTION: "निर्माणाधीन",
    };
    return conditions[condition as keyof typeof conditions] || condition;
  };

  const getConditionColor = (condition?: string) => {
    if (!condition) return "bg-gray-100 text-gray-800";

    switch (condition) {
      case "EXCELLENT":
      case "GOOD":
        return "bg-green-100 text-green-800";
      case "FAIR":
        return "bg-yellow-100 text-yellow-800";
      case "POOR":
      case "VERY_POOR":
        return "bg-red-100 text-red-800";
      case "UNDER_CONSTRUCTION":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
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
          <div className="text-xs font-medium mb-1">सडकको अवस्था</div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-xs">उत्कृष्ट / राम्रो</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span className="text-xs">ठीकै</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-xs">खराब</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
              <span className="text-xs">निर्माणाधीन</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-xs">अज्ञात</span>
            </div>
          </div>
        </div>

        {/* Popup overlay */}
        <div ref={overlayContentRef} className="ol-popup">
          {selectedRoad && (
            <Card className="w-64 shadow-lg overflow-hidden">
              {selectedRoad.primaryMedia?.url && (
                <div className="w-full h-32">
                  <img
                    src={selectedRoad.primaryMedia.url}
                    alt={selectedRoad.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardContent className="p-3">
                <h3 className="font-medium">{selectedRoad.name}</h3>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-sm text-muted-foreground">
                    {roadTypes.find((t) => t.value === selectedRoad.type)
                      ?.label || selectedRoad.type}
                  </p>
                  <Badge className={getConditionColor(selectedRoad.condition)}>
                    {getRoadConditionLabel(selectedRoad.condition)}
                  </Badge>
                </div>

                {(selectedRoad.widthInMeters || selectedRoad.length) && (
                  <div className="mt-2 text-xs text-muted-foreground">
                    {selectedRoad.widthInMeters && (
                      <span className="mr-2">
                        चौडाई: {selectedRoad.widthInMeters} मि.
                      </span>
                    )}
                    {selectedRoad.length && (
                      <span>लम्बाई: {selectedRoad.length} मि.</span>
                    )}
                  </div>
                )}

                <div className="mt-2 flex justify-end">
                  <Button size="sm" variant="default" onClick={handleViewRoad}>
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
          transform: translate(-50%, -100%);
          pointer-events: auto;
        }
      `}</style>
    </>
  );
}
