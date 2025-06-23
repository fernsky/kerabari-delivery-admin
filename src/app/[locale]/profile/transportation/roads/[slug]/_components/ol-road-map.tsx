"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Map as MapIcon } from "lucide-react";

// OpenLayers imports
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
import { Point as OLPoint, LineString as OLLineString } from "ol/geom";

interface OlRoadMapProps {
  road: any;
}

export default function OlRoadMap({ road }: OlRoadMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const [viewType, setViewType] = useState("street");

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    // Create vector source for road features
    const vectorSource = new VectorSource();

    // Define styles
    const lineStyle = new Style({
      stroke: new Stroke({
        color: "#3b82f6",
        width: 5,
        lineCap: "round",
        lineJoin: "round",
      }),
    });

    const pointStyle = new Style({
      image: new Circle({
        radius: 8,
        fill: new Fill({ color: "#ef4444" }),
        stroke: new Stroke({ color: "#ffffff", width: 2 }),
      }),
    });

    // Create vector layer for road features
    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: function (feature) {
        const geometry = feature.getGeometry();
        const geomType = geometry?.getType();

        if (geomType === "Point") {
          return pointStyle;
        } else if (geomType === "LineString") {
          return lineStyle;
        }
        return undefined;
      },
    });

    // Create the base tile layer based on the view preference
    const tileLayer = new TileLayer({
      source: new XYZ({
        url:
          viewType === "street"
            ? "https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
            : "https://mt1.google.com/vt/lyrs=y,h&x={x}&y={y}&z={z}",
        maxZoom: 19,
      }),
    });

    // Create the map
    const map = new Map({
      target: mapContainer.current,
      layers: [tileLayer, vectorLayer],
      view: new View({
        center: fromLonLat([84.0, 28.3]), // Default center of Nepal
        zoom: 7,
      }),
    });

    mapRef.current = map;

    // Add road features based on road data
    if (road.roadPath && road.roadPath.coordinates) {
      try {
        // Add LineString feature for road path
        const coordinates = road.roadPath.coordinates.map(
          (coord: [number, number]) => fromLonLat(coord),
        );
        const line = new OLLineString(coordinates);
        const lineFeature = new Feature(line);
        vectorSource.addFeature(lineFeature);

        // Fit map to line extent
        map.getView().fit(line.getExtent(), {
          padding: [50, 50, 50, 50],
          maxZoom: 18,
        });
      } catch (error) {
        console.error("Error adding road path:", error);
      }
    }

    // Add representative point if available
    if (road.representativePoint && road.representativePoint.coordinates) {
      try {
        const point = new OLPoint(
          fromLonLat(road.representativePoint.coordinates),
        );
        const pointFeature = new Feature(point);
        vectorSource.addFeature(pointFeature);

        // If no road path, center on the point
        if (!road.roadPath) {
          map
            .getView()
            .setCenter(fromLonLat(road.representativePoint.coordinates));
          map.getView().setZoom(15);
        }
      } catch (error) {
        console.error("Error adding representative point:", error);
      }
    }

    // Cleanup function
    return () => {
      if (mapRef.current) {
        mapRef.current.setTarget(undefined);
        mapRef.current = null;
      }
    };
  }, [road, viewType]);

  // Toggle map view type (street vs satellite)
  const toggleView = () => {
    setViewType((prev) => (prev === "street" ? "satellite" : "street"));
  };

  return (
    <div className="relative h-[500px]">
      <div ref={mapContainer} className="w-full h-full rounded-md" />

      {/* Map controls */}
      <div className="absolute top-4 right-4 z-10">
        <Button
          size="sm"
          className="bg-white text-black hover:bg-gray-100"
          onClick={toggleView}
        >
          <MapIcon className="h-4 w-4 mr-2" />
          {viewType === "street" ? "उपग्रह दृश्य" : "सडक दृश्य"}
        </Button>
      </div>

      {/* Route information */}
      {(road.startPoint || road.endPoint || road.roadPath) && (
        <div className="absolute bottom-4 left-4 right-4 z-10 bg-black/50 text-white p-3 rounded text-sm">
          {road.startPoint && road.endPoint && (
            <p>
              सडक मार्ग: {road.startPoint} देखि {road.endPoint} सम्म
            </p>
          )}
          {road.length && (
            <p>सडक लम्बाई: {road.length.toLocaleString()} मिटर</p>
          )}
        </div>
      )}
    </div>
  );
}
