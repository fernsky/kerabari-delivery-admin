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
import { Point as OLPoint } from "ol/geom";

interface PetrolPumpMapProps {
  petrolPump: any;
}

export function PetrolPumpMap({ petrolPump }: PetrolPumpMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const { isStreetView, toggleView } = useMapViewStore();

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    // Create vector layer for location point
    const vectorSource = new VectorSource();

    // Style for the petrol pump point
    const pointStyle = new Style({
      image: new Circle({
        radius: 8,
        fill: new Fill({ color: "#ef4444" }),
        stroke: new Stroke({ color: "#ffffff", width: 2 }),
      }),
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: pointStyle,
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

    // Add point feature for the petrol pump location
    if (petrolPump.locationPoint) {
      try {
        const point = new OLPoint(
          fromLonLat(petrolPump.locationPoint.coordinates),
        );
        const feature = new Feature(point);
        vectorSource.addFeature(feature);

        // Center on the point
        mapRef.current
          .getView()
          .setCenter(fromLonLat(petrolPump.locationPoint.coordinates));
        mapRef.current.getView().setZoom(16);
      } catch (error) {
        console.error("Error adding location point:", error);
      }
    }

    // Cleanup
    return () => {
      if (mapRef.current) {
        mapRef.current.setTarget(undefined);
      }
    };
  }, [isStreetView, petrolPump]);

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

          {/* Location info */}
          <div className="absolute bottom-4 left-4 right-4 z-10 bg-black/50 text-white p-2 rounded text-xs">
            {petrolPump.name}
            {petrolPump.locality && <span> - {petrolPump.locality}</span>}
            {petrolPump.address && <span> - {petrolPump.address}</span>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
