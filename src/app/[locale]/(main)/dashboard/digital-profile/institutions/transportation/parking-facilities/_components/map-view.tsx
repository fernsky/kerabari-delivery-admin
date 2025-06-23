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
import { Point as OLPoint, Polygon as OLPolygon } from "ol/geom";
import Overlay from "ol/Overlay";
import { useMapViewStore } from "@/store/map-view-store";
import { useMapLayersStore } from "@/store/map-layers-store";
import { Badge } from "@/components/ui/badge";
import { MapLayerControls } from "./map-layer-controls";

interface ParkingFacilityItem {
  id: string;
  name: string;
  slug: string;
  type: string;
  condition?: string;
  wardNumber?: number;
  location?: string;
  vehicleCapacity?: number;
  hasRoof?: boolean;
  hasToilet?: boolean;
  areaInSquareMeters?: number;
  locationPoint?: {
    type: string;
    coordinates: [number, number];
  };
  areaPolygon?: {
    type: string;
    coordinates: [number, number][][];
  };
  primaryMedia?: {
    mediaId: string;
    url: string;
    fileName?: string;
  };
}

interface MapViewProps {
  facilities: ParkingFacilityItem[];
  facilityTypes: { value: string; label: string }[];
  isLoading?: boolean;
}

export function MapView({
  facilities,
  facilityTypes,
  isLoading,
}: MapViewProps) {
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
  const [selectedFacility, setSelectedFacility] =
    useState<ParkingFacilityItem | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    // Create separate vector sources for points and polygons
    const pointSource = new VectorSource();
    const polygonSource = new VectorSource();

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

    // Create vector layer for polygon features
    const polygonLayer = new VectorLayer({
      source: polygonSource,
      style: (feature) => {
        const condition = feature.get("condition");

        let fillColor = "rgba(59, 130, 246, 0.3)"; // Default blue with transparency
        let strokeColor = "#3b82f6";

        if (condition) {
          switch (condition) {
            case "EXCELLENT":
            case "GOOD":
              fillColor = "rgba(16, 185, 129, 0.3)"; // Green with transparency
              strokeColor = "#10b981";
              break;
            case "FAIR":
              fillColor = "rgba(245, 158, 11, 0.3)"; // Yellow with transparency
              strokeColor = "#f59e0b";
              break;
            case "POOR":
            case "VERY_POOR":
              fillColor = "rgba(239, 68, 68, 0.3)"; // Red with transparency
              strokeColor = "#ef4444";
              break;
            case "UNDER_CONSTRUCTION":
              fillColor = "rgba(99, 102, 241, 0.3)"; // Indigo with transparency
              strokeColor = "#6366f1";
              break;
          }
        }

        return new Style({
          stroke: new Stroke({
            color: strokeColor,
            width: 2,
          }),
          fill: new Fill({
            color: fillColor,
          }),
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
      layers: [tileLayer, polygonLayer, pointLayer],
      view: new View({
        center: fromLonLat([84.0, 28.3]), // Default center of Nepal
        zoom: 7,
      }),
      overlays: [overlay],
    });

    // Add click handler for facility selection
    mapRef.current.on("click", function (evt) {
      const feature = mapRef.current!.forEachFeatureAtPixel(
        evt.pixel,
        function (feature) {
          return feature;
        },
      );

      if (feature) {
        const facilityId = feature.get("id");
        const facility = facilities.find((f) => f.id === facilityId);
        if (facility) {
          setSelectedFacility(facility);

          // Position the overlay at the location point
          let coordinates;
          if (facility.locationPoint) {
            coordinates = fromLonLat(facility.locationPoint.coordinates);
          } else if (
            facility.areaPolygon &&
            facility.areaPolygon.coordinates.length > 0
          ) {
            // For polygons, use the first point of the first ring
            coordinates = fromLonLat(facility.areaPolygon.coordinates[0][0]);
          }

          if (coordinates && overlayRef.current) {
            overlayRef.current.setPosition(coordinates);
          }
        }
      } else {
        setSelectedFacility(null);
        if (overlayRef.current) {
          overlayRef.current.setPosition(undefined);
        }
      }
    });

    // Add features for all facilities
    addParkingFeatures(pointSource, polygonSource, facilities);

    // Auto-fit to all features
    fitMapToFeatures(polygonSource, pointSource);

    // Cleanup function
    return () => {
      if (mapRef.current) {
        mapRef.current.setTarget(undefined);
        mapRef.current = null;
      }
    };
  }, []);

  // Update the map when facilities change
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
    addParkingFeatures(pointSource, polygonSource, facilities);

    // Reset selection when facilities change
    setSelectedFacility(null);
    if (overlayRef.current) {
      overlayRef.current.setPosition(undefined);
    }

    // Auto-fit to all features
    fitMapToFeatures(polygonSource, pointSource);
  }, [facilities]);

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
    polygonSource: VectorSource | null,
    pointSource: VectorSource | null,
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
  const addParkingFeatures = (
    pointSource: VectorSource | null,
    polygonSource: VectorSource | null,
    facilities: ParkingFacilityItem[],
  ) => {
    if (!pointSource || !polygonSource) return;

    facilities.forEach((facility) => {
      // For facilities with polygon geometry, add polygon feature
      if (facility.areaPolygon && facility.areaPolygon.coordinates.length > 0) {
        try {
          // For OL Polygon, we need coordinates in [[[x,y],[x,y],...]] format
          const coordinates = facility.areaPolygon.coordinates.map((ring) =>
            ring.map((coord) => fromLonLat(coord)),
          );

          const polygon = new OLPolygon(coordinates);
          const feature = new Feature({
            geometry: polygon,
            id: facility.id,
            name: facility.name,
            type: facility.type,
            condition: facility.condition,
          });
          polygonSource.addFeature(feature);
        } catch (error) {
          console.error("Error adding polygon for", facility.id, error);
        }
      }

      // Add point feature for location
      try {
        let coordinates;
        if (facility.locationPoint) {
          coordinates = facility.locationPoint.coordinates;
        } else if (
          facility.areaPolygon &&
          facility.areaPolygon.coordinates.length > 0
        ) {
          // If there's no location point but there's a polygon, use the first point of the first ring
          coordinates = facility.areaPolygon.coordinates[0][0];
        }

        // Add a point feature
        if (coordinates) {
          const point = new OLPoint(fromLonLat(coordinates));
          const feature = new Feature({
            geometry: point,
            id: facility.id,
            name: facility.name,
            type: facility.type,
            condition: facility.condition,
          });
          pointSource.addFeature(feature);
        }
      } catch (error) {
        console.error("Error adding point for", facility.id, error);
      }
    });
  };

  // Function to view facility details
  const handleViewFacility = () => {
    if (selectedFacility) {
      router.push(
        `/dashboard/digital-profile/institutions/transportation/parking-facilities/${selectedFacility.id}`,
      );
    }
  };

  const getFacilityConditionLabel = (condition?: string) => {
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
          <div className="text-xs font-medium mb-1">
            पार्किङ सुविधाको अवस्था
          </div>
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
          {selectedFacility && (
            <Card className="w-64 shadow-lg overflow-hidden">
              {selectedFacility.primaryMedia?.url && (
                <div className="w-full h-32">
                  <img
                    src={selectedFacility.primaryMedia.url}
                    alt={selectedFacility.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardContent className="p-3">
                <h3 className="font-medium">{selectedFacility.name}</h3>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-sm text-muted-foreground">
                    {facilityTypes.find(
                      (t) => t.value === selectedFacility.type,
                    )?.label || selectedFacility.type}
                  </p>
                  <Badge
                    className={getConditionColor(selectedFacility.condition)}
                  >
                    {getFacilityConditionLabel(selectedFacility.condition)}
                  </Badge>
                </div>

                {(selectedFacility.wardNumber || selectedFacility.location) && (
                  <div className="mt-2 text-xs text-muted-foreground">
                    {selectedFacility.wardNumber && (
                      <span className="mr-2">
                        वडा नं.: {selectedFacility.wardNumber}
                      </span>
                    )}
                    {selectedFacility.location && (
                      <span>स्थान: {selectedFacility.location}</span>
                    )}
                  </div>
                )}

                {selectedFacility.vehicleCapacity && (
                  <div className="mt-1 text-xs text-muted-foreground">
                    <span>
                      सवारी क्षमता: {selectedFacility.vehicleCapacity}
                    </span>
                  </div>
                )}

                <div className="mt-2 flex justify-end">
                  <Button
                    size="sm"
                    variant="default"
                    onClick={handleViewFacility}
                  >
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
