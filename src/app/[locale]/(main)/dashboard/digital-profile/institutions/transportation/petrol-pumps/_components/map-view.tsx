"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Map as MapIcon, Eye, Zap } from "lucide-react";
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
import { Point as OLPoint } from "ol/geom";
import Overlay from "ol/Overlay";
import { useMapViewStore } from "@/store/map-view-store";
import { useMapLayersStore } from "@/store/map-layers-store";
import { Badge } from "@/components/ui/badge";
import { MapLayerControls } from "./map-layer-controls";

interface PetrolPumpItem {
  id: string;
  name: string;
  slug: string;
  type: string;
  wardNumber?: number;
  locality?: string;
  address?: string;
  hasEVCharging?: boolean;
  hasCarWash?: boolean;
  hasConvenienceStore?: boolean;
  operatingHours?: string;
  locationPoint?: {
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
  pumps: PetrolPumpItem[];
  pumpTypes: { value: string; label: string }[];
  isLoading?: boolean;
}

export function MapView({ pumps, pumpTypes, isLoading }: MapViewProps) {
  const router = useRouter();
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const overlayRef = useRef<Overlay | null>(null);
  const overlayContentRef = useRef<HTMLDivElement>(null);
  const tileLayerRef = useRef<TileLayer<any> | null>(null);
  const pointLayerRef = useRef<VectorLayer<VectorSource> | null>(null);
  const { isStreetView, toggleView } = useMapViewStore();
  const { showPoints } = useMapLayersStore();
  const [selectedPump, setSelectedPump] = useState<PetrolPumpItem | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    // Create vector source for points
    const pointSource = new VectorSource();

    // Create vector layer for point features
    const pointLayer = new VectorLayer({
      source: pointSource,
      style: (feature) => {
        const pumpType = feature.get("type");
        const hasEVCharging = feature.get("hasEVCharging");

        let fillColor = "#3b82f6"; // Default blue

        // Color based on pump type
        switch (pumpType) {
          case "PETROL":
            fillColor = "#10b981"; // Green
            break;
          case "DIESEL":
            fillColor = "#f59e0b"; // Yellow/amber
            break;
          case "PETROL_DIESEL":
            fillColor = "#3b82f6"; // Blue
            break;
          case "CNG":
            fillColor = "#8b5cf6"; // Purple
            break;
          case "EV_CHARGING":
            fillColor = "#6366f1"; // Indigo
            break;
          case "MULTIPURPOSE":
            fillColor = "#d97706"; // Amber
            break;
        }

        // If has EV charging, add a different style
        if (hasEVCharging) {
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
        } else {
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
        }
      },
      visible: showPoints,
    });

    // Store references to layers
    pointLayerRef.current = pointLayer;

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
      layers: [tileLayer, pointLayer],
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
        const pumpId = feature.get("id");
        const pump = pumps.find((p) => p.id === pumpId);
        if (pump) {
          setSelectedPump(pump);

          // Position the overlay at the location point
          if (pump.locationPoint) {
            const coordinates = fromLonLat(pump.locationPoint.coordinates);

            if (overlayRef.current) {
              overlayRef.current.setPosition(coordinates);
            }
          }
        }
      } else {
        setSelectedPump(null);
        if (overlayRef.current) {
          overlayRef.current.setPosition(undefined);
        }
      }
    });

    // Add features for all petrol pumps
    addPetrolPumpFeatures(pointSource, pumps);

    // Auto-fit to all features
    fitMapToFeatures(pointSource);

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
    if (!mapRef.current || !pointLayerRef.current) return;

    // Get the vector source from the layer
    const pointSource = pointLayerRef.current.getSource();

    // Clear existing features
    pointSource?.clear();

    // Add new features
    addPetrolPumpFeatures(pointSource, pumps);

    // Reset selection when pumps change
    setSelectedPump(null);
    if (overlayRef.current) {
      overlayRef.current.setPosition(undefined);
    }

    // Auto-fit to all features
    fitMapToFeatures(pointSource);
  }, [pumps]);

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

  // Update layer visibility when showPoints changes
  useEffect(() => {
    if (pointLayerRef.current) {
      pointLayerRef.current.setVisible(showPoints);
    }
  }, [showPoints]);

  // Helper function to fit the map view to features
  const fitMapToFeatures = (pointSource: VectorSource | null) => {
    if (!mapRef.current) return;

    // If there are point features, fit to them
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
  const addPetrolPumpFeatures = (
    pointSource: VectorSource | null,
    pumps: PetrolPumpItem[],
  ) => {
    if (!pointSource) return;

    pumps.forEach((pump) => {
      // Add point feature for location
      try {
        if (pump.locationPoint) {
          const coordinates = pump.locationPoint.coordinates;

          const point = new OLPoint(fromLonLat(coordinates));
          const feature = new Feature({
            geometry: point,
            id: pump.id,
            name: pump.name,
            type: pump.type,
            hasEVCharging: pump.hasEVCharging,
          });
          pointSource.addFeature(feature);
        }
      } catch (error) {
        console.error("Error adding point for", pump.id, error);
      }
    });
  };

  // Function to view pump details
  const handleViewPump = () => {
    if (selectedPump) {
      router.push(
        `/dashboard/digital-profile/institutions/transportation/petrol-pumps/${selectedPump.id}`,
      );
    }
  };

  const getPumpTypeLabel = (type: string) => {
    const found = pumpTypes.find((t) => t.value === type);
    return found ? found.label : type;
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
          <div className="text-xs font-medium mb-1">पेट्रोल पम्प प्रकार</div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-xs">पेट्रोल</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span className="text-xs">डिजल</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-xs">पेट्रोल र डिजल</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              <span className="text-xs">सीएनजी</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
              <span className="text-xs">इलेक्ट्रिक चार्जिंग</span>
            </div>
          </div>
        </div>

        {/* Popup overlay */}
        <div ref={overlayContentRef} className="ol-popup">
          {selectedPump && (
            <Card className="w-64 shadow-lg overflow-hidden">
              {selectedPump.primaryMedia?.url && (
                <div className="w-full h-32">
                  <img
                    src={selectedPump.primaryMedia.url}
                    alt={selectedPump.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardContent className="p-3">
                <h3 className="font-medium">{selectedPump.name}</h3>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-sm text-muted-foreground">
                    {getPumpTypeLabel(selectedPump.type)}
                  </p>
                  {selectedPump.hasEVCharging && (
                    <Badge className="bg-blue-100 text-blue-800">
                      <Zap className="h-3 w-3 mr-1" />
                      इ-चार्जिंग
                    </Badge>
                  )}
                </div>

                {(selectedPump.wardNumber || selectedPump.locality) && (
                  <div className="mt-2 text-xs text-muted-foreground">
                    {selectedPump.wardNumber && (
                      <span className="mr-2">
                        वडा नं.: {selectedPump.wardNumber}
                      </span>
                    )}
                    {selectedPump.locality && (
                      <span>{selectedPump.locality}</span>
                    )}
                  </div>
                )}

                {selectedPump.address && (
                  <div className="mt-1 text-xs text-muted-foreground">
                    <span>ठेगाना: {selectedPump.address}</span>
                  </div>
                )}

                {selectedPump.operatingHours && (
                  <div className="mt-1 text-xs text-muted-foreground">
                    <span>संचालन समय: {selectedPump.operatingHours}</span>
                  </div>
                )}

                <div className="mt-2 flex justify-end">
                  <Button size="sm" variant="default" onClick={handleViewPump}>
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
