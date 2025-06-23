"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Map as MapIcon, RotateCcw, Compass } from "lucide-react";
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
import { Point as OLPoint, LineString as OLLineString } from "ol/geom";
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

type LineString = {
  type: "LineString";
  coordinates: [number, number][];
};

interface RoadMapInputProps {
  onRoadGeometrySelect: (
    roadPath?: LineString,
    representativePoint?: Point,
  ) => void;
  initialRoadPath?: LineString;
  initialRepresentativePoint?: Point;
}

export function RoadMapInput({
  onRoadGeometrySelect,
  initialRoadPath,
  initialRepresentativePoint,
}: RoadMapInputProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const viewRef = useRef<View | null>(null);
  const roadSourceRef = useRef<VectorSource>(new VectorSource());
  const pointSourceRef = useRef<VectorSource>(new VectorSource());
  const drawInteractionRef = useRef<Draw | null>(null);
  const modifyInteractionRef = useRef<Modify | null>(null);
  const { isStreetView, toggleView } = useMapViewStore();
  const [isDrawing, setIsDrawing] = useState(false);
  const [isPointDrawing, setIsPointDrawing] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    // Create vector layers for road and point
    const roadVectorLayer = new VectorLayer({
      source: roadSourceRef.current,
      style: new Style({
        stroke: new Stroke({
          color: "#3b82f6",
          width: 4,
        }),
      }),
    });

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
      layers: [tileLayer, roadVectorLayer, pointVectorLayer],
      view: view,
    });

    // Load initial data if provided
    if (initialRoadPath) {
      const coords = initialRoadPath.coordinates.map((coord) =>
        fromLonLat(coord),
      );
      const lineString = new OLLineString(coords);
      const feature = new Feature(lineString);
      roadSourceRef.current.addFeature(feature);

      // Center the map on the initial line
      view.fit(lineString.getExtent(), {
        padding: [50, 50, 50, 50],
        maxZoom: 18,
      });
    }

    if (initialRepresentativePoint) {
      const point = new OLPoint(
        fromLonLat(initialRepresentativePoint.coordinates),
      );
      const feature = new Feature(point);
      pointSourceRef.current.addFeature(feature);

      if (!initialRoadPath) {
        // Only center on point if we don't have a road path
        view.setCenter(fromLonLat(initialRepresentativePoint.coordinates));
        view.setZoom(15);
      }
    }

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

  // Start drawing line for road path
  const startDrawingRoad = () => {
    if (!mapRef.current) return;

    // Clear previous drawings
    roadSourceRef.current.clear();

    // Remove existing interactions
    if (drawInteractionRef.current) {
      mapRef.current.removeInteraction(drawInteractionRef.current);
    }

    if (modifyInteractionRef.current) {
      mapRef.current.removeInteraction(modifyInteractionRef.current);
    }

    // Create draw interaction for LineString
    drawInteractionRef.current = new Draw({
      source: roadSourceRef.current,
      type: "LineString",
    });

    // Add the interaction to the map
    mapRef.current.addInteraction(drawInteractionRef.current);

    // Set up drawing complete handler
    drawInteractionRef.current.on("drawend", (event) => {
      // Get the line geometry
      const geometry = event.feature.getGeometry() as OLLineString;

      // Convert to GeoJSON format
      const coordinates = geometry
        .getCoordinates()
        .map((coord) => toLonLat(coord) as [number, number]);

      // Update state
      onRoadGeometrySelect({
        type: "LineString",
        coordinates: coordinates,
      });

      // Remove draw interaction when finished
      if (mapRef.current && drawInteractionRef.current) {
        mapRef.current.removeInteraction(drawInteractionRef.current);
        drawInteractionRef.current = null;
      }

      // Add modify interaction
      addModifyInteraction();

      setIsDrawing(false);
    });

    setIsDrawing(true);
    setIsPointDrawing(false);
  };

  // Start drawing point for representative point
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
      onRoadGeometrySelect(undefined, {
        type: "Point",
        coordinates: coordinate,
      });

      // Remove draw interaction when finished
      if (mapRef.current && drawInteractionRef.current) {
        mapRef.current.removeInteraction(drawInteractionRef.current);
        drawInteractionRef.current = null;
      }

      setIsPointDrawing(false);
    });

    setIsPointDrawing(true);
    setIsDrawing(false);
  };

  // Add modify interaction for existing geometries
  const addModifyInteraction = () => {
    if (!mapRef.current) return;

    // Remove existing modify interactions
    if (modifyInteractionRef.current) {
      mapRef.current.removeInteraction(modifyInteractionRef.current);
      modifyInteractionRef.current = null;
    }

    // Create modify interaction for the road path
    const roadModify = new Modify({
      source: roadSourceRef.current,
    });

    // Create modify interaction for the point
    const pointModify = new Modify({
      source: pointSourceRef.current,
    });

    // Add both interactions to the map
    mapRef.current.addInteraction(roadModify);
    mapRef.current.addInteraction(pointModify);

    // Store reference to the first one (we'll need to keep track of both if we want to remove them later)
    modifyInteractionRef.current = roadModify;

    // Set up event handlers for both interactions
    const handleModifyEnd = () => {
      // Get updated road path
      let updatedRoadPath: LineString | undefined;
      const roadFeatures = roadSourceRef.current.getFeatures();
      if (roadFeatures.length > 0) {
        const geometry = roadFeatures[0].getGeometry() as OLLineString;
        const coordinates = geometry
          .getCoordinates()
          .map((coord) => toLonLat(coord) as [number, number]);

        updatedRoadPath = {
          type: "LineString",
          coordinates: coordinates,
        };
      }

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

      // Update state
      onRoadGeometrySelect(updatedRoadPath, updatedPoint);
    };

    roadModify.on("modifyend", handleModifyEnd);
    pointModify.on("modifyend", handleModifyEnd);
  };

  // Clear all geometries
  const clearAll = () => {
    roadSourceRef.current.clear();
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

    setIsDrawing(false);
    setIsPointDrawing(false);
    onRoadGeometrySelect(undefined, undefined);
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
            variant={isDrawing ? "default" : "outline"}
            size="sm"
            onClick={startDrawingRoad}
            disabled={isPointDrawing}
          >
            सडकको रेखा कोर्नुहोस्
          </Button>

          <Button
            variant={isPointDrawing ? "default" : "outline"}
            size="sm"
            onClick={startDrawingPoint}
            disabled={isDrawing}
          >
            प्रतिनिधि बिन्दु थप्नुहोस्
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
        {isDrawing ? (
          <p>
            सडक रेखाङ्कन गर्न नक्सामा क्लिक गर्दै जानुहोस् र अन्त्यमा डबल क्लिक
            गरेर समाप्त गर्नुहोस्
          </p>
        ) : isPointDrawing ? (
          <p>प्रतिनिधि बिन्दु राख्न नक्सामा क्लिक गर्नुहोस्</p>
        ) : (
          <p>रेखाङ्कन सुरु गर्न माथिको बटन क्लिक गर्नुहोस्</p>
        )}
      </div>
    </div>
  );
}
