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

interface AgricZoneMapProps {
  agricZone: any;
}

export function AgricZoneMap({ agricZone }: AgricZoneMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const { isStreetView, toggleView } = useMapViewStore();

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    // Create vector sources for location point and area polygon
    const pointSource = new VectorSource();
    const polygonSource = new VectorSource();

    // Style for the location point
    const pointStyle = new Style({
      image: new Circle({
        radius: 8,
        fill: new Fill({ color: "#10b981" }), // Green for agricultural
        stroke: new Stroke({ color: "#ffffff", width: 2 }),
      }),
    });

    // Style for the area polygon
    const polygonStyle = new Style({
      stroke: new Stroke({
        color: "#10b981",
        width: 3,
      }),
      fill: new Fill({
        color: "rgba(16, 185, 129, 0.2)", // Semi-transparent green
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

    // Add area polygon if available
    if (agricZone.areaPolygon) {
      try {
        // Convert the coordinates from [long, lat] to OpenLayers format
        const coords = agricZone.areaPolygon.coordinates[0].map(
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
        console.error("Error adding area polygon:", error);
      }
    }

    // Add location point if available
    if (agricZone.locationPoint) {
      try {
        const point = new OLPoint(
          fromLonLat(agricZone.locationPoint.coordinates),
        );
        const feature = new Feature(point);
        pointSource.addFeature(feature);

        // If no polygon, center on the point
        if (!agricZone.areaPolygon) {
          mapRef.current
            .getView()
            .setCenter(fromLonLat(agricZone.locationPoint.coordinates));
          mapRef.current.getView().setZoom(16);
        }
      } catch (error) {
        console.error("Error adding location point:", error);
      }
    }

    // If no geometry available, center to middle of Nepal as fallback
    if (!agricZone.locationPoint && !agricZone.areaPolygon) {
      mapRef.current.getView().setCenter(fromLonLat([84.0, 28.3]));
      mapRef.current.getView().setZoom(7);
    }

    // Cleanup
    return () => {
      if (mapRef.current) {
        mapRef.current.setTarget(undefined);
      }
    };
  }, [isStreetView, agricZone]);

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

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="relative h-[600px]">
          <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />

          {/* Map controls */}
          <div className="absolute top-4 right-4 z-10">
            <Button
              size="sm"
              className="bg-white text-black hover:bg-gray-100"
              onClick={() => toggleView()}
            >
              <MapIcon className="h-4 w-4 mr-2" />
              {isStreetView ? "उपग्रह दृश्य" : "सडक दृश्य"}
            </Button>
          </div>

          {/* Map legend */}
          <div className="absolute bottom-4 left-4 z-10 bg-white px-3 py-2 rounded-md shadow-md text-xs">
            <div className="font-medium mb-1">नक्सा प्रतीकहरू</div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-4 h-4 rounded-full bg-green-500"></div>
              <span>मुख्य स्थान</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-2 bg-green-500 rounded"></div>
              <span>कृषि क्षेत्र सीमाना</span>
            </div>
          </div>

          {/* Location info */}
          <div className="absolute bottom-4 right-4 z-10 bg-black/50 text-white p-2 rounded max-w-xs text-xs">
            <p className="font-medium mb-1">{agricZone.name}</p>
            <p>
              {agricZone.location ? `${agricZone.location}, ` : ""}
              {agricZone.wardNumber ? `वडा नं ${agricZone.wardNumber}` : ""}
            </p>
            {agricZone.areaInHectares && (
              <p className="mt-1">
                {agricZone.areaInHectares} हेक्टर क्षेत्रफल
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
