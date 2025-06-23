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

interface PublicTransportItem {
  id: string;
  name: string;
  slug: string;
  type: string;
  operatorName?: string;
  routeName?: string;
  startPoint?: string;
  endPoint?: string;
  frequency?: string;
  vehicleCondition?: string;
  hasAirConditioning?: boolean;
  hasWifi?: boolean;
  isAccessible?: boolean;
  routePath?: {
    type: string;
    coordinates: [number, number][];
  };
  stopPoints?: {
    type: string;
    coordinates: [number, number][];
  };
  primaryMedia?: {
    mediaId: string;
    url: string;
    fileName?: string;
  };
}

interface MapViewProps {
  transports: PublicTransportItem[];
  transportTypes: { value: string; label: string }[];
  isLoading?: boolean;
}

export function MapView({
  transports,
  transportTypes,
  isLoading,
}: MapViewProps) {
  const router = useRouter();
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const overlayRef = useRef<Overlay | null>(null);
  const overlayContentRef = useRef<HTMLDivElement>(null);
  const tileLayerRef = useRef<TileLayer<any> | null>(null);
  const routeLayerRef = useRef<VectorLayer<VectorSource> | null>(null);
  const stopLayerRef = useRef<VectorLayer<VectorSource> | null>(null);
  const { isStreetView, toggleView } = useMapViewStore();
  const { showRoutes, showStops } = useMapLayersStore();
  const [selectedTransport, setSelectedTransport] =
    useState<PublicTransportItem | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    // Create separate vector sources for routes and stops
    const routeSource = new VectorSource();
    const stopSource = new VectorSource();

    // Create vector layer for route features
    const routeLayer = new VectorLayer({
      source: routeSource,
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
            case "UNDER_MAINTENANCE":
              strokeColor = "#6366f1"; // Indigo
              break;
          }
        }

        return new Style({
          stroke: new Stroke({
            color: strokeColor,
            width: 5,
            lineCap: "round",
            lineJoin: "round",
          }),
        });
      },
      visible: showRoutes,
    });

    // Create vector layer for stop features
    const stopLayer = new VectorLayer({
      source: stopSource,
      style: (feature) => {
        return new Style({
          image: new Circle({
            radius: 6,
            fill: new Fill({ color: "#f59e0b" }), // Amber color for stops
            stroke: new Stroke({ color: "#ffffff", width: 2 }),
          }),
        });
      },
      visible: showStops,
    });

    // Store references to layers
    routeLayerRef.current = routeLayer;
    stopLayerRef.current = stopLayer;

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
      layers: [tileLayer, routeLayer, stopLayer],
      view: new View({
        center: fromLonLat([84.0, 28.3]), // Default center of Nepal
        zoom: 7,
      }),
      overlays: [overlay],
    });

    // Add click handler for transport selection
    mapRef.current.on("click", function (evt) {
      const feature = mapRef.current!.forEachFeatureAtPixel(
        evt.pixel,
        function (feature) {
          return feature;
        },
      );

      if (feature) {
        const transportId = feature.get("id");
        const transport = transports.find((t) => t.id === transportId);
        if (transport) {
          setSelectedTransport(transport);

          // Position the overlay
          let coordinates;
          if (feature.getGeometry()?.getType() === "LineString") {
            // For routes, get the middle point of the line
            const lineGeom = feature.getGeometry() as OLLineString;
            const extent = lineGeom.getExtent();
            coordinates = [
              (extent[0] + extent[2]) / 2,
              (extent[1] + extent[3]) / 2,
            ];
          } else {
            // For stops, use the point coordinates
            coordinates = (feature.getGeometry() as OLPoint).getCoordinates();
          }

          if (coordinates && overlayRef.current) {
            overlayRef.current.setPosition(coordinates);
          }
        }
      } else {
        setSelectedTransport(null);
        if (overlayRef.current) {
          overlayRef.current.setPosition(undefined);
        }
      }
    });

    // Add features for all transports
    addTransportFeatures(routeSource, stopSource, transports);

    // Auto-fit to all features
    fitMapToFeatures(routeSource, stopSource);

    // Cleanup function
    return () => {
      if (mapRef.current) {
        mapRef.current.setTarget(undefined);
        mapRef.current = null;
      }
    };
  }, []);

  // Update the map when transports change
  useEffect(() => {
    if (!mapRef.current || !routeLayerRef.current || !stopLayerRef.current)
      return;

    // Get the vector sources from the layers
    const routeSource = routeLayerRef.current.getSource();
    const stopSource = stopLayerRef.current.getSource();

    // Clear existing features
    routeSource?.clear();
    stopSource?.clear();

    // Add new features
    addTransportFeatures(routeSource, stopSource, transports);

    // Reset selection when transports change
    setSelectedTransport(null);
    if (overlayRef.current) {
      overlayRef.current.setPosition(undefined);
    }

    // Auto-fit to all features
    fitMapToFeatures(routeSource, stopSource);
  }, [transports]);

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

  // Update layer visibility when showRoutes or showStops change
  useEffect(() => {
    if (routeLayerRef.current) {
      routeLayerRef.current.setVisible(showRoutes);
    }
  }, [showRoutes]);

  useEffect(() => {
    if (stopLayerRef.current) {
      stopLayerRef.current.setVisible(showStops);
    }
  }, [showStops]);

  // Helper function to fit the map view to features
  const fitMapToFeatures = (
    routeSource: VectorSource | null,
    stopSource: VectorSource | null,
  ) => {
    if (!mapRef.current) return;

    // Try to fit to route features first
    if (routeSource && routeSource.getFeatures().length > 0) {
      const routeExtent = routeSource.getExtent();
      if (routeExtent[0] !== Infinity && routeExtent[1] !== Infinity) {
        mapRef.current.getView().fit(routeExtent, {
          padding: [50, 50, 50, 50],
          maxZoom: 14,
        });
        return;
      }
    }

    // If no route features, try to fit to stop features
    if (stopSource && stopSource.getFeatures().length > 0) {
      const stopExtent = stopSource.getExtent();
      if (stopExtent[0] !== Infinity && stopExtent[1] !== Infinity) {
        mapRef.current.getView().fit(stopExtent, {
          padding: [50, 50, 50, 50],
          maxZoom: 14,
        });
      }
    }
  };

  // Helper function to add features to the map
  const addTransportFeatures = (
    routeSource: VectorSource | null,
    stopSource: VectorSource | null,
    transports: PublicTransportItem[],
  ) => {
    if (!routeSource || !stopSource) return;

    transports.forEach((transport) => {
      // For transports with route path, add line string feature
      if (transport.routePath && transport.routePath.coordinates.length > 1) {
        try {
          const coordinates = transport.routePath.coordinates.map((coord) =>
            fromLonLat(coord),
          );

          const lineString = new OLLineString(coordinates);
          const feature = new Feature({
            geometry: lineString,
            id: transport.id,
            name: transport.name,
            type: transport.type,
            condition: transport.vehicleCondition,
          });
          routeSource.addFeature(feature);
        } catch (error) {
          console.error("Error adding route path for", transport.id, error);
        }
      }

      // Add stop points if available
      if (transport.stopPoints && transport.stopPoints.coordinates.length > 0) {
        try {
          transport.stopPoints.coordinates.forEach((coord) => {
            const point = new OLPoint(fromLonLat(coord));
            const feature = new Feature({
              geometry: point,
              id: transport.id,
              name: transport.name,
              type: transport.type,
              condition: transport.vehicleCondition,
            });
            stopSource.addFeature(feature);
          });
        } catch (error) {
          console.error("Error adding stop points for", transport.id, error);
        }
      }

      // If there's no route path or stop points but we have start and end points as text,
      // we could add a placeholder point in the middle of Nepal with the transport info
    });
  };

  // Function to view transport details
  const handleViewTransport = () => {
    if (selectedTransport) {
      router.push(
        `/dashboard/digital-profile/institutions/transportation/public-transports/${selectedTransport.id}`,
      );
    }
  };

  const getTransportConditionLabel = (condition?: string) => {
    if (!condition) return "अज्ञात";

    const conditions = {
      EXCELLENT: "उत्कृष्ट",
      GOOD: "राम्रो",
      FAIR: "ठीकै",
      POOR: "खराब",
      VERY_POOR: "धेरै खराब",
      UNDER_MAINTENANCE: "मर्मत अधीन",
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
      case "UNDER_MAINTENANCE":
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
          <div className="text-xs font-medium mb-1">यातायातको अवस्था</div>
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
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-xs">अज्ञात</span>
            </div>
          </div>
          <div className="mt-2 border-t pt-1">
            <div className="flex items-center gap-1">
              <div className="w-8 h-1 bg-blue-500 rounded"></div>
              <span className="text-xs">यातायात मार्ग</span>
            </div>
            <div className="flex items-center gap-1 mt-1">
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <span className="text-xs">बिसौनी</span>
            </div>
          </div>
        </div>

        {/* Popup overlay */}
        <div ref={overlayContentRef} className="ol-popup">
          {selectedTransport && (
            <Card className="w-64 shadow-lg overflow-hidden">
              {selectedTransport.primaryMedia?.url && (
                <div className="w-full h-32">
                  <img
                    src={selectedTransport.primaryMedia.url}
                    alt={selectedTransport.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardContent className="p-3">
                <h3 className="font-medium">{selectedTransport.name}</h3>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-sm text-muted-foreground">
                    {transportTypes.find(
                      (t) => t.value === selectedTransport.type,
                    )?.label || selectedTransport.type}
                  </p>
                  {selectedTransport.vehicleCondition && (
                    <Badge
                      className={getConditionColor(
                        selectedTransport.vehicleCondition,
                      )}
                    >
                      {getTransportConditionLabel(
                        selectedTransport.vehicleCondition,
                      )}
                    </Badge>
                  )}
                </div>

                {(selectedTransport.startPoint ||
                  selectedTransport.endPoint) && (
                  <div className="mt-2 text-xs text-muted-foreground">
                    {selectedTransport.startPoint && (
                      <p>सुरुवात: {selectedTransport.startPoint}</p>
                    )}
                    {selectedTransport.endPoint && (
                      <p>अन्तिम: {selectedTransport.endPoint}</p>
                    )}
                  </div>
                )}

                {selectedTransport.operatorName && (
                  <div className="mt-1 text-xs text-muted-foreground">
                    <span>संचालक: {selectedTransport.operatorName}</span>
                  </div>
                )}

                <div className="mt-2 flex justify-end">
                  <Button
                    size="sm"
                    variant="default"
                    onClick={handleViewTransport}
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
