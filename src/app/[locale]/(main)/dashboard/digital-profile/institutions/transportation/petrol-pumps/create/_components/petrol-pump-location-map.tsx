"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { MapIcon, RotateCcw, Compass } from "lucide-react";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { fromLonLat, toLonLat } from "ol/proj";
import { Style, Fill, Stroke, Circle } from "ol/style";
import { Feature } from "ol";
import { Point as OLPoint } from "ol/geom";
import Draw from "ol/interaction/Draw";
import Modify from "ol/interaction/Modify";
import { useMapViewStore } from "@/store/map-view-store";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Point = {
  type: "Point";
  coordinates: [number, number];
};

interface PetrolPumpLocationMapProps {
  onGeometrySelect: (locationPoint?: Point) => void;
  initialLocationPoint?: Point;
}

export function PetrolPumpLocationMap({
  onGeometrySelect,
  initialLocationPoint,
}: PetrolPumpLocationMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const viewRef = useRef<View | null>(null);
  const pointSourceRef = useRef<VectorSource>(new VectorSource());
  const drawInteractionRef = useRef<Draw | null>(null);
  const modifyInteractionRef = useRef<Modify | null>(null);
  const { isStreetView, toggleView } = useMapViewStore();
  const [isPointDrawing, setIsPointDrawing] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    // Create vector layer for point
    const pointVectorLayer = new VectorLayer({
      source: pointSourceRef.current,
      style: new Style({
        image: new Circle({
          radius: 7,
          fill: new Fill({ color: "#ef4444" }),
          stroke: new Stroke({ color: "#ffffff", width: 2 }),
        }),
      }),
    });

    // Create the initial tile layer based on the view preference
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

    // Create a view with rotation enabled
    const view = new View({
      center: fromLonLat([84.0, 28.3]), // Default center of Nepal
      zoom: 7,
      enableRotation: true,
    });

    viewRef.current = view;

    // Create the map
    mapRef.current = new Map({
      target: mapContainer.current,
      layers: [tileLayer, pointVectorLayer],
      view: view,
    });

    // Load initial point if provided
    if (initialLocationPoint) {
      const point = new OLPoint(fromLonLat(initialLocationPoint.coordinates));
      const feature = new Feature(point);
      pointSourceRef.current.addFeature(feature);

      // Center the map on the initial point
      view.setCenter(fromLonLat(initialLocationPoint.coordinates));
      view.setZoom(15);
    }

    // Add modify interaction for existing geometries
    addModifyInteraction();

    // Cleanup
    return () => {
      if (mapRef.current) {
        mapRef.current.setTarget(undefined);
      }
    };
  }, []);

  // Update the tile layer when view type changes
  useEffect(() => {
    if (!mapRef.current) return;

    const layers = mapRef.current.getLayers().getArray();
    const tileLayer = layers[0];

    if (tileLayer && "setSource" in tileLayer) {
      const newSource = isStreetView
        ? new XYZ({
            url: "https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
            maxZoom: 19,
          })
        : new XYZ({
            url: "https://mt1.google.com/vt/lyrs=y,h&x={x}&y={y}&z={z}",
            maxZoom: 19,
          });

      (tileLayer as TileLayer<any>).setSource(newSource);
    }
  }, [isStreetView]);

  // Start drawing location point
  const startDrawingPoint = () => {
    if (!mapRef.current) return;

    // Clear previous point
    pointSourceRef.current.clear();

    // Remove existing interactions
    if (drawInteractionRef.current) {
      mapRef.current.removeInteraction(drawInteractionRef.current);
    }

    if (modifyInteractionRef.current) {
      mapRef.current.removeInteraction(modifyInteractionRef.current);
    }

    // Create draw interaction for Point
    drawInteractionRef.current = new Draw({
      source: pointSourceRef.current,
      type: "Point",
    });

    // Add the interaction to the map
    mapRef.current.addInteraction(drawInteractionRef.current);

    // Set up drawing complete handler
    drawInteractionRef.current.on("drawend", (event) => {
      // Get the point geometry
      const geometry = event.feature.getGeometry() as OLPoint;

      // Convert to GeoJSON format
      const coordinate = toLonLat(geometry.getCoordinates()) as [
        number,
        number,
      ];

      // Update state
      onGeometrySelect({
        type: "Point",
        coordinates: coordinate,
      });

      // Remove draw interaction when finished
      if (mapRef.current && drawInteractionRef.current) {
        mapRef.current.removeInteraction(drawInteractionRef.current);
        drawInteractionRef.current = null;
      }

      // Add modify interaction
      addModifyInteraction();

      setIsPointDrawing(false);
    });

    setIsPointDrawing(true);
  };

  // Add modify interaction for existing geometries
  const addModifyInteraction = () => {
    if (!mapRef.current) return;

    // Remove existing modify interactions
    if (modifyInteractionRef.current) {
      mapRef.current.removeInteraction(modifyInteractionRef.current);
      modifyInteractionRef.current = null;
    }

    // Create modify interaction for the point
    const pointModify = new Modify({
      source: pointSourceRef.current,
    });

    // Add interaction to the map
    mapRef.current.addInteraction(pointModify);

    // Store reference
    modifyInteractionRef.current = pointModify;

    // Set up event handlers for modify interaction
    pointModify.on("modifyend", () => {
      // Get updated point
      let updatedPoint: Point | undefined;
      const pointFeatures = pointSourceRef.current.getFeatures();
      if (pointFeatures.length > 0) {
        const geometry = pointFeatures[0].getGeometry() as OLPoint;
        const coordinate = toLonLat(geometry.getCoordinates()) as [
          number,
          number,
        ];

        updatedPoint = {
          type: "Point",
          coordinates: coordinate,
        };
      }

      // Update state with updated point
      onGeometrySelect(updatedPoint);
    });
  };

  // Clear all geometries
  const clearAll = () => {
    pointSourceRef.current.clear();

    if (mapRef.current) {
      if (drawInteractionRef.current) {
        mapRef.current.removeInteraction(drawInteractionRef.current);
        drawInteractionRef.current = null;
      }

      if (modifyInteractionRef.current) {
        mapRef.current.removeInteraction(modifyInteractionRef.current);
        modifyInteractionRef.current = null;
      }
    }

    setIsPointDrawing(false);
    onGeometrySelect(undefined);
  };

  // Reset map view
  const resetView = () => {
    if (viewRef.current) {
      viewRef.current.animate({
        rotation: 0,
        duration: 250,
      });
    }
  };

  return (
    <div className="flex flex-col">
      <div className="p-3 border-b bg-background flex flex-wrap gap-3 justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant={isPointDrawing ? "default" : "outline"}
            size="sm"
            onClick={startDrawingPoint}
          >
            पेट्रोल पम्पको स्थान थप्नुहोस्
          </Button>

          <Button variant="outline" size="sm" onClick={() => toggleView()}>
            <MapIcon className="h-4 w-4 mr-1" />
            {isStreetView ? "उपग्रह दृश्य" : "सडक दृश्य"}
          </Button>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={resetView}
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>नक्सा रिसेट गर्नुहोस्</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <Button variant="outline" size="sm" onClick={clearAll}>
          सबै हटाउनुहोस्
        </Button>
      </div>

      <div className="w-full h-[600px]">
        <div
          ref={mapContainer}
          style={{ width: "100%", height: "100%" }}
          className="relative"
        />
      </div>

      <div className="p-3 border-t bg-muted/20 text-xs">
        {isPointDrawing ? (
          <p>पेट्रोल पम्पको स्थान राख्न नक्सामा क्लिक गर्नुहोस्</p>
        ) : (
          <p>पेट्रोल पम्पको स्थान अंकन गर्न माथिको बटन क्लिक गर्नुहोस्</p>
        )}
      </div>
    </div>
  );
}
