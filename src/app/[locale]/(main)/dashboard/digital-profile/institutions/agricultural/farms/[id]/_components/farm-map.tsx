"use client";

import { useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Map as MapIcon } from "lucide-react";
import { useMapViewStore } from "@/store/map-view-store";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { fromLonLat } from "ol/proj";
import { Style, Fill, Stroke, Circle } from "ol/style";
import { Feature } from "ol";
import { Point as OLPoint, Polygon as OLPolygon } from "ol/geom";

interface FarmMapProps {
  farm: any;
}

export function FarmMap({ farm }: FarmMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const { isStreetView, toggleView } = useMapViewStore();

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    // Create vector sources for location point and farm boundary
    const pointSource = new VectorSource();
    const polygonSource = new VectorSource();

    // Style for the location point
    const pointStyle = new Style({
      image: new Circle({
        radius: 8,
        fill: new Fill({ color: "#3b82f6" }), // Blue for farm
        stroke: new Stroke({ color: "#ffffff", width: 2 }),
      }),
    });

    // Style for the farm boundary polygon
    const polygonStyle = new Style({
      stroke: new Stroke({
        color: "#3b82f6",
        width: 3,
      }),
      fill: new Fill({
        color: "rgba(59, 130, 246, 0.2)", // Semi-transparent blue
      }),
    });

    // Create vector layers
    const pointLayer = new VectorLayer({
      source: pointSource,
      style: pointStyle,
      zIndex: 2,
    });

    const polygonLayer = new VectorLayer({
      source: polygonSource,
      style: polygonStyle,
      zIndex: 1,
    });

    // Create the tile layer based on the view preference
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

    // Create the map
    mapRef.current = new Map({
      target: mapContainer.current,
      layers: [tileLayer, polygonLayer, pointLayer],
      view: new View({
        center: fromLonLat([84.0, 28.3]), // Default center of Nepal
        zoom: 7,
      }),
    });

    // Add farm boundary if available
    if (farm.farmBoundary) {
      try {
        // Convert the coordinates from [long, lat] to OpenLayers format
        const coords = farm.farmBoundary.coordinates[0].map(
          (coord: [number, number]) => fromLonLat(coord),
        );

        const polygon = new OLPolygon([coords]);
        const feature = new Feature(polygon);
        polygonSource.addFeature(feature);

        // Fit the map to the polygon extent
        mapRef.current.getView().fit(polygon.getExtent(), {
          padding: [50, 50, 50, 50],
          maxZoom: 17,
        });
      } catch (error) {
        console.error("Error adding farm boundary:", error);
      }
    }

    // Add location point if available
    if (farm.locationPoint) {
      try {
        const point = new OLPoint(fromLonLat(farm.locationPoint.coordinates));
        const feature = new Feature(point);
        pointSource.addFeature(feature);

        // If no polygon, center on the point
        if (!farm.farmBoundary) {
          mapRef.current
            .getView()
            .setCenter(fromLonLat(farm.locationPoint.coordinates));
          mapRef.current.getView().setZoom(16);
        }
      } catch (error) {
        console.error("Error adding location point:", error);
      }
    }

    // If no geometry available, center to middle of Nepal as fallback
    if (!farm.locationPoint && !farm.farmBoundary) {
      mapRef.current.getView().setCenter(fromLonLat([84.0, 28.3]));
      mapRef.current.getView().setZoom(7);
    }

    // Cleanup
    return () => {
      if (mapRef.current) {
        mapRef.current.setTarget(undefined);
      }
    };
  }, [isStreetView, farm]);

  // Update the map when the view type changes
  useEffect(() => {
    if (!mapRef.current) return;

    const layers = mapRef.current.getLayers().getArray();
    const tileLayer = layers[0];

    if (tileLayer && "setSource" in tileLayer) {
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

      // Set the new source on the tile layer
      (tileLayer as TileLayer<any>).setSource(newSource);
    }
  }, [isStreetView]);

  // Get farm type label
  const getFarmTypeLabel = (type: string) => {
    const types = {
      CROP_FARM: "बाली फार्म",
      LIVESTOCK_FARM: "पशुपालन फार्म",
      MIXED_FARM: "मिश्रित फार्म",
      POULTRY_FARM: "पंक्षी फार्म",
      DAIRY_FARM: "डेरी फार्म",
      AQUACULTURE_FARM: "जलकृषि फार्म",
      HORTICULTURE_FARM: "बागवानी फार्म",
      APICULTURE_FARM: "मौरी पालन",
      SERICULTURE_FARM: "रेशम खेती",
      ORGANIC_FARM: "जैविक फार्म",
      COMMERCIAL_FARM: "व्यावसायिक फार्म",
      SUBSISTENCE_FARM: "जीविकोपार्जन फार्म",
      AGROFORESTRY: "कृषि वन",
      OTHER: "अन्य",
    };
    return types[type as keyof typeof types] || type;
  };

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <h3 className="font-medium text-lg flex items-center gap-2">
          <MapIcon className="h-5 w-5 text-primary" />
          फार्म स्थान
        </h3>
        <div className="flex gap-2">
          <Button
            variant={isStreetView ? "default" : "outline"}
            size="sm"
            onClick={() => toggleView()}
          >
            {isStreetView ? "स्याटेलाइट दृश्य" : "स्ट्रिट दृश्य"}
          </Button>
        </div>
      </div>

      {!farm.locationPoint && !farm.farmBoundary ? (
        <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
          <MapIcon className="h-12 w-12 opacity-20 mb-4" />
          <h4 className="text-lg font-medium mb-2">नक्सा डाटा उपलब्ध छैन</h4>
          <p className="max-w-md text-sm">
            यस फार्मको लागि कुनै स्थान डाटा अहिलेसम्म रेकर्ड गरिएको छैन।
          </p>
        </div>
      ) : (
        <CardContent className="p-0">
          <div
            ref={mapContainer}
            className="h-[500px] w-full"
            style={{ background: "#f3f4f6" }}
          />
        </CardContent>
      )}

      <div className="bg-muted/50 px-6 py-3 text-xs text-muted-foreground">
        <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
          <div>
            <span className="font-medium">फार्म प्रकार:</span>{" "}
            {getFarmTypeLabel(farm.farmType)}
            {farm.location && (
              <>
                {" "}
                | <span className="font-medium">स्थान:</span> {farm.location}
              </>
            )}
          </div>
          {farm.totalAreaInHectares && (
            <div>
              <span className="font-medium">क्षेत्रफल:</span>{" "}
              {farm.totalAreaInHectares} हेक्टर
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
