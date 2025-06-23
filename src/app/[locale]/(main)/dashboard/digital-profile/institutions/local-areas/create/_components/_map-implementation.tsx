"use client";

import React, { useEffect, useRef, useState } from "react";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import XYZ from "ol/source/XYZ";
import { fromLonLat, toLonLat } from "ol/proj";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Point as OLPoint, Polygon as OLPolygon } from "ol/geom";
import { Feature } from "ol";
import { Style, Fill, Stroke, Circle } from "ol/style";
import DrawInteraction from "ol/interaction/Draw";
import DragRotateAndZoom from "ol/interaction/DragRotateAndZoom";
import { defaults as defaultInteractions } from "ol/interaction";
import { useMapViewStore } from "@/store/map-view-store";

// Define the types
type Point = {
  type: "Point";
  coordinates: [number, number];
};

type Polygon = {
  type: "Polygon";
  coordinates: [number, number][][];
};

interface OpenLayersMapProps {
  mapMode: "point" | "polygon";
  isDrawing: boolean;
  initialPoint?: Point;
  initialPolygon?: Polygon;
  startDrawing: boolean;
  onUpdate: (point?: Point, polygon?: Polygon) => void;
}

export function OpenLayersMap({
  mapMode,
  isDrawing,
  initialPoint,
  initialPolygon,
  startDrawing,
  onUpdate,
}: OpenLayersMapProps) {
  // Get isStreetView directly from the store instead of props
  const { isStreetView } = useMapViewStore();
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const viewRef = useRef<View | null>(null);
  const pointSourceRef = useRef<VectorSource>(new VectorSource());
  const polygonSourceRef = useRef<VectorSource>(new VectorSource());
  const drawInteractionRef = useRef<DrawInteraction | null>(null);
  const tileLayerRef = useRef<TileLayer<any> | null>(null);
  const [rotation, setRotation] = useState(0);
  const [tilt, setTilt] = useState(0); // Pseudo-tilt for UI feedback

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    // Create vector layers for point and polygon
    const pointVectorLayer = new VectorLayer({
      source: pointSourceRef.current,
      style: new Style({
        image: new Circle({
          radius: 8,
          fill: new Fill({ color: "#3b82f6" }),
          stroke: new Stroke({ color: "#ffffff", width: 2 }),
        }),
      }),
    });

    const polygonVectorLayer = new VectorLayer({
      source: polygonSourceRef.current,
      style: new Style({
        fill: new Fill({ color: "rgba(59, 130, 246, 0.2)" }),
        stroke: new Stroke({ color: "#3b82f6", width: 2 }),
      }),
    });

    // Create the initial tile layer based on the view preference
    const initialTileLayer = new TileLayer({
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

    tileLayerRef.current = initialTileLayer;

    // Create a view with rotation enabled
    const view = new View({
      center: fromLonLat([84.0, 28.3]), // Default center of Nepal
      zoom: 6,
      rotation: 0, // Initial rotation
      enableRotation: true, // Enable rotation
    });

    viewRef.current = view;

    // Create the map with DragRotateAndZoom interaction
    mapRef.current = new Map({
      target: mapContainer.current,
      layers: [initialTileLayer, polygonVectorLayer, pointVectorLayer],
      view: view,
      interactions: defaultInteractions().extend([
        new DragRotateAndZoom(), // Add drag rotate and zoom interaction
      ]),
    });

    // Add click handler for point selection
    mapRef.current.on("click", (event) => {
      if (mapMode === "point" && !isDrawing) {
        const coordinates = toLonLat(event.coordinate);
        addPointFeature(coordinates as [number, number]);
      }
    });

    // Listen for view rotation changes
    view.on("change:rotation", () => {
      if (viewRef.current) {
        setRotation(viewRef.current.getRotation());
      }
    });

    // Initialize with existing data if provided
    if (initialPoint) {
      addPointFeature(initialPoint.coordinates);
    }

    if (initialPolygon) {
      addPolygonFeature(initialPolygon.coordinates);
    }

    // Cleanup function
    return () => {
      if (mapRef.current) {
        mapRef.current.setTarget(undefined);
        mapRef.current = null;
      }
    };
  }, []);

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
    } else {
      // If for some reason the tile layer reference is lost, create a new one
      const newTileLayer = new TileLayer({ source: newSource });
      tileLayerRef.current = newTileLayer;

      // Insert it at the bottom of the layer stack
      if (mapRef.current.getLayers().getLength() > 0) {
        mapRef.current.getLayers().removeAt(0);
        mapRef.current.getLayers().insertAt(0, newTileLayer);
      } else {
        mapRef.current.addLayer(newTileLayer);
      }
    }
  }, [isStreetView]);

  // Handle map mode changes and drawing state
  useEffect(() => {
    if (!mapRef.current) return;

    // Clean up previous drawing interactions
    if (drawInteractionRef.current) {
      mapRef.current.removeInteraction(drawInteractionRef.current);
      drawInteractionRef.current = null;
    }

    // Start drawing polygon if needed
    if (mapMode === "polygon" && startDrawing) {
      startDrawingPolygon();
    }
  }, [mapMode, startDrawing]);

  // Set map rotation
  const setMapRotation = (angle: number) => {
    if (viewRef.current) {
      viewRef.current.animate({
        rotation: angle,
        duration: 250,
      });
    }
  };

  // Reset rotation and tilt
  const resetRotationAndTilt = (e: any) => {
    e?.preventDefault();
    if (viewRef.current) {
      viewRef.current.animate({
        rotation: 0,
        duration: 250,
      });
      setTilt(0);
    }
  };

  // Apply tilt effect (pseudo-3D)
  const applyTilt = (tiltValue: number) => {
    setTilt(tiltValue);

    // Apply a slight rotation based on tilt to give a 3D illusion
    if (viewRef.current && mapRef.current) {
      // Scale the view slightly based on tilt to give a perspective effect
      const scaleFactor = 1 + tiltValue / 20;

      // Apply CSS 3D transform to the map container for a tilt effect
      const mapElement = mapRef.current.getTargetElement();
      if (mapElement) {
        // Apply a subtle perspective transformation
        mapElement.style.transform = `perspective(1000px) rotateX(${tiltValue}deg)`;
        mapElement.style.transformOrigin = "center bottom";
      }
    }
  };

  // Add a point feature to the map
  const addPointFeature = (coordinates: [number, number]) => {
    if (!pointSourceRef.current) return;

    // Clear previous points
    pointSourceRef.current.clear();

    // Create a new point feature
    const point = new Feature(new OLPoint(fromLonLat(coordinates)));
    pointSourceRef.current.addFeature(point);

    // Update state
    onUpdate(
      {
        type: "Point",
        coordinates: coordinates,
      },
      undefined,
    );
  };

  // Add a polygon feature to the map
  const addPolygonFeature = (coordinates: [number, number][][]) => {
    if (!polygonSourceRef.current) return;

    // Clear previous polygons
    polygonSourceRef.current.clear();

    // Convert coordinates to OpenLayers format
    const olCoords = coordinates[0].map((coord) => fromLonLat(coord));

    // Create a new polygon feature
    const polygon = new Feature(new OLPolygon([olCoords]));
    polygonSourceRef.current.addFeature(polygon);

    // Update state
    onUpdate(undefined, {
      type: "Polygon",
      coordinates: coordinates,
    });
  };

  const startDrawingPolygon = () => {
    if (!mapRef.current) return;

    // Clear existing polygon
    polygonSourceRef.current.clear();

    // Create draw interaction
    drawInteractionRef.current = new DrawInteraction({
      source: polygonSourceRef.current,
      type: "Polygon",
    });

    // Add drawing complete handler
    drawInteractionRef.current.on("drawend", (event) => {
      // Get the polygon geometry
      const geometry = event.feature.getGeometry() as OLPolygon;

      // Convert to GeoJSON format
      const coordinates = geometry
        .getCoordinates()[0]
        .map((coord) => toLonLat(coord) as [number, number]);

      // Store the polygon
      onUpdate(undefined, {
        type: "Polygon",
        coordinates: [coordinates],
      });

      // Remove the draw interaction when finished
      if (mapRef.current && drawInteractionRef.current) {
        mapRef.current.removeInteraction(drawInteractionRef.current);
        drawInteractionRef.current = null;
      }
    });

    // Add the interaction to the map
    mapRef.current.addInteraction(drawInteractionRef.current);
  };

  // Expose rotation and tilt controls to the parent
  React.useEffect(() => {
    if (window) {
      (window as any).mapControls = {
        setRotation: setMapRotation,
        resetRotation: resetRotationAndTilt,
        applyTilt,
      };
    }

    return () => {
      if (window && (window as any).mapControls) {
        delete (window as any).mapControls;
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />

      {/* Map overlay controls for rotation and tilt */}
      <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-md p-2 opacity-80 hover:opacity-100 transition-opacity">
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 items-center">
            <span className="text-xs">Rotate:</span>
            <input
              type="range"
              min="-3.14"
              max="3.14"
              step="0.01"
              value={rotation}
              onChange={(e) => setMapRotation(parseFloat(e.target.value))}
              className="w-24"
            />
          </div>

          <div className="flex gap-2 items-center">
            <span className="text-xs">Tilt:</span>
            <input
              type="range"
              min="0"
              max="45"
              value={tilt}
              onChange={(e) => applyTilt(parseInt(e.target.value))}
              className="w-24"
            />
          </div>

          <button
            onClick={resetRotationAndTilt}
            className="text-xs bg-primary text-white px-2 py-1 rounded hover:bg-primary/80 mt-1"
          >
            Reset View
          </button>
        </div>
      </div>
    </div>
  );
}
