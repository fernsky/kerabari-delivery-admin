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
import { Style, Fill, Stroke, Circle, Icon } from "ol/style";
import { Feature } from "ol";
import {
  Point as OLPoint,
  LineString as OLLineString,
  MultiPoint as OLMultiPoint,
} from "ol/geom";

interface PublicTransportMapProps {
  transport: any;
}

export function PublicTransportMap({ transport }: PublicTransportMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const { isStreetView, toggleView } = useMapViewStore();

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    // Create vector sources for route path and stops
    const routeSource = new VectorSource();
    const stopSource = new VectorSource();

    // Style for route path (LineString)
    const routeStyle = new Style({
      stroke: new Stroke({
        color: "#3b82f6",
        width: 5,
        lineCap: "round",
        lineJoin: "round",
      }),
    });

    // Style for stops (Points)
    const stopStyle = new Style({
      image: new Circle({
        radius: 6,
        fill: new Fill({ color: "#f59e0b" }),
        stroke: new Stroke({ color: "#ffffff", width: 2 }),
      }),
    });

    // Create vector layers
    const routeLayer = new VectorLayer({
      source: routeSource,
      style: routeStyle,
      zIndex: 1,
    });

    const stopLayer = new VectorLayer({
      source: stopSource,
      style: stopStyle,
      zIndex: 2,
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
      layers: [tileLayer, routeLayer, stopLayer],
      view: new View({
        center: fromLonLat([84.0, 28.3]), // Default center of Nepal
        zoom: 7,
      }),
    });

    // Add route path if available
    if (transport.routePath) {
      try {
        const coordinates = transport.routePath.coordinates.map(
          (coord: [number, number]) => fromLonLat(coord),
        );
        const line = new OLLineString(coordinates);
        const feature = new Feature(line);
        routeSource.addFeature(feature);

        // Fit map to route extent with padding
        mapRef.current.getView().fit(line.getExtent(), {
          padding: [50, 50, 50, 50],
          maxZoom: 18,
        });
      } catch (error) {
        console.error("Error adding route path:", error);
      }
    }

    // Add stop points if available
    if (transport.stopPoints) {
      try {
        const stopCoordinates = transport.stopPoints.coordinates;

        // Add each stop as a separate feature
        stopCoordinates.forEach((coord: [number, number]) => {
          const point = new OLPoint(fromLonLat(coord));
          const feature = new Feature(point);
          stopSource.addFeature(feature);
        });

        // If there's no route path but there are stops, fit to stops
        if (!transport.routePath && stopCoordinates.length > 0) {
          const multiPoint = new OLMultiPoint(
            stopCoordinates.map((coord: [number, number]) => fromLonLat(coord)),
          );
          mapRef.current.getView().fit(multiPoint.getExtent(), {
            padding: [50, 50, 50, 50],
            maxZoom: 16,
          });
        }
      } catch (error) {
        console.error("Error adding stop points:", error);
      }
    }

    // If no geometry available, try to set view based on text description
    if (!transport.routePath && !transport.stopPoints) {
      // Center to middle of Nepal as fallback
      mapRef.current.getView().setCenter(fromLonLat([84.0, 28.3]));
      mapRef.current.getView().setZoom(7);
    }

    // Cleanup
    return () => {
      if (mapRef.current) {
        mapRef.current.setTarget(undefined);
      }
    };
  }, [isStreetView, transport]);

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
              <div className="w-4 h-1 bg-blue-500 rounded"></div>
              <span>यातायात मार्ग</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <span>बिसौनी</span>
            </div>
          </div>

          {/* Info about route */}
          <div className="absolute bottom-4 right-4 z-10 bg-black/50 text-white p-2 rounded max-w-xs text-xs">
            <p className="font-medium mb-1">{transport.name}</p>
            {transport.startPoint && transport.endPoint && (
              <p>
                {transport.startPoint} → {transport.endPoint}
              </p>
            )}
            {transport.routeName && <p>{transport.routeName}</p>}
            {transport.viaPoints && (
              <p className="text-gray-300 text-xs mt-1">
                {transport.viaPoints}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
