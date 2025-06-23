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
import { Point as OLPoint, LineString as OLLineString } from "ol/geom";

interface RoadMapProps {
  road: any;
}

export function RoadMap({ road }: RoadMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const { isStreetView, toggleView } = useMapViewStore();

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    // Create vector layers for point and line
    const vectorSource = new VectorSource();

    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: function (feature) {
        const geometry = feature.getGeometry();
        const geomType = geometry?.getType();

        if (geomType === "Point") {
          return new Style({
            image: new Circle({
              radius: 8,
              fill: new Fill({ color: "#3b82f6" }),
              stroke: new Stroke({ color: "#ffffff", width: 2 }),
            }),
          });
        } else if (geomType === "LineString") {
          return new Style({
            stroke: new Stroke({
              color: "#3b82f6",
              width: 5,
              lineCap: "round",
              lineJoin: "round",
            }),
          });
        }
      },
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
      layers: [tileLayer, vectorLayer],
      view: new View({
        center: fromLonLat([84.0, 28.3]), // Default center of Nepal
        zoom: 7,
      }),
    });

    // Add features based on road data
    if (road.roadPath) {
      // Add line feature for road path
      try {
        const coordinates = road.roadPath.coordinates.map(
          (coord: [number, number]) => fromLonLat(coord),
        );
        const line = new OLLineString(coordinates);
        const feature = new Feature(line);
        vectorSource.addFeature(feature);

        // Fit map to line extent with padding
        mapRef.current.getView().fit(line.getExtent(), {
          padding: [50, 50, 50, 50],
          maxZoom: 18,
        });
      } catch (error) {
        console.error("Error adding road path:", error);
      }
    }

    // Add representative point if available and no road path
    if (road.representativePoint && !road.roadPath) {
      try {
        const point = new OLPoint(
          fromLonLat(road.representativePoint.coordinates),
        );
        const feature = new Feature(point);
        vectorSource.addFeature(feature);

        // Center on the point if no road path
        mapRef.current
          .getView()
          .setCenter(fromLonLat(road.representativePoint.coordinates));
        mapRef.current.getView().setZoom(15);
      } catch (error) {
        console.error("Error adding representative point:", error);
      }
    }

    // Cleanup
    return () => {
      if (mapRef.current) {
        mapRef.current.setTarget(undefined);
      }
    };
  }, [isStreetView, road]);

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

          {/* Info about road path */}
          <div className="absolute bottom-4 left-4 right-4 z-10 bg-black/50 text-white p-2 rounded text-xs">
            {road.startPoint && road.endPoint && (
              <p>
                {road.startPoint} बाट {road.endPoint} सम्म
              </p>
            )}
            {road.roadPath && (
              <p>
                सडक लम्बाई: {road.length ? `${road.length} मिटर` : "अज्ञात"} |
                बिन्दुहरू: {road.roadPath.coordinates.length}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
