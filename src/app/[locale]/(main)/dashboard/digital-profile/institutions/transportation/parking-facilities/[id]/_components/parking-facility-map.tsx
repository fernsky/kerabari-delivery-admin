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

interface ParkingFacilityMapProps {
  facility: any;
}

export function ParkingFacilityMap({ facility }: ParkingFacilityMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const { isStreetView, toggleView } = useMapViewStore();

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    // Create vector layers for point and polygon
    const vectorSource = new VectorSource();

    // Style for the parking facility point
    const pointStyle = new Style({
      image: new Circle({
        radius: 8,
        fill: new Fill({ color: "#ef4444" }),
        stroke: new Stroke({ color: "#ffffff", width: 2 }),
      }),
    });

    // Style for the parking area polygon
    const polygonStyle = new Style({
      stroke: new Stroke({
        color: "#3b82f6",
        width: 2,
        lineCap: "round",
        lineJoin: "round",
      }),
      fill: new Fill({
        color: "rgba(59, 130, 246, 0.2)",
      }),
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: function (feature) {
        const geometry = feature.getGeometry();
        const geomType = geometry?.getType();

        if (geomType === "Point") {
          return pointStyle;
        } else if (geomType === "Polygon") {
          return polygonStyle;
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

    // Add features based on facility data
    if (facility.areaPolygon) {
      // Add polygon feature for parking area boundary
      try {
        // For Polygon, we need coordinates in [[[x,y],[x,y],...]] format
        const coordinates = facility.areaPolygon.coordinates.map((ring: any) =>
          ring.map((coord: any) => fromLonLat(coord)),
        );

        const polygon = new OLPolygon(coordinates);
        const feature = new Feature(polygon);
        vectorSource.addFeature(feature);

        // Fit map to polygon extent with padding
        mapRef.current.getView().fit(polygon.getExtent(), {
          padding: [50, 50, 50, 50],
          maxZoom: 18,
        });
      } catch (error) {
        console.error("Error adding parking area polygon:", error);
      }
    }

    // Add point feature for the facility location
    if (facility.locationPoint) {
      try {
        const point = new OLPoint(
          fromLonLat(facility.locationPoint.coordinates),
        );
        const feature = new Feature(point);
        vectorSource.addFeature(feature);

        // If there's no polygon, center on the point
        if (!facility.areaPolygon) {
          mapRef.current
            .getView()
            .setCenter(fromLonLat(facility.locationPoint.coordinates));
          mapRef.current.getView().setZoom(16);
        }
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
  }, [isStreetView, facility]);

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
            {facility.name}
            {facility.location && <span> - {facility.location}</span>}
            {facility.address && <span> - {facility.address}</span>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
