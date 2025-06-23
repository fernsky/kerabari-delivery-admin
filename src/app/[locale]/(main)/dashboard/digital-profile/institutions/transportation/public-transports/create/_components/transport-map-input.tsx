"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Map as MapIcon, RotateCcw, Layers } from "lucide-react";
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
import {
  Point as OLPoint,
  LineString as OLLineString,
  MultiPoint as OLMultiPoint,
} from "ol/geom";
import Draw from "ol/interaction/Draw";
import Modify from "ol/interaction/Modify";
import { useMapViewStore } from "@/store/map-view-store";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type LineString = {
  type: "LineString";
  coordinates: [number, number][];
};

type MultiPoint = {
  type: "MultiPoint";
  coordinates: [number, number][];
};

interface TransportMapInputProps {
  onTransportGeometrySelect: (
    routePath?: LineString,
    stopPoints?: MultiPoint,
  ) => void;
  initialRoutePath?: LineString;
  initialStopPoints?: MultiPoint;
}

export function TransportMapInput({
  onTransportGeometrySelect,
  initialRoutePath,
  initialStopPoints,
}: TransportMapInputProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const viewRef = useRef<View | null>(null);
  const routeSourceRef = useRef<VectorSource>(new VectorSource());
  const stopSourceRef = useRef<VectorSource>(new VectorSource());
  const drawInteractionRef = useRef<Draw | null>(null);
  const modifyInteractionRef = useRef<Modify | null>(null);
  const { isStreetView, toggleView } = useMapViewStore();
  const [isLineDrawing, setIsLineDrawing] = useState(false);
  const [isStopDrawing, setIsStopDrawing] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    // Create vector layer for route and stops
    const routeVectorLayer = new VectorLayer({
      source: routeSourceRef.current,
      style: new Style({
        stroke: new Stroke({
          color: "#3b82f6",
          width: 4,
        }),
      }),
    });

    const stopVectorLayer = new VectorLayer({
      source: stopSourceRef.current,
      style: new Style({
        image: new Circle({
          radius: 7,
          fill: new Fill({ color: "#f59e0b" }),
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
      layers: [tileLayer, routeVectorLayer, stopVectorLayer],
      view: view,
    });

    // Load initial data if provided
    if (initialRoutePath) {
      const coords = initialRoutePath.coordinates.map((coord) =>
        fromLonLat(coord),
      );
      const lineString = new OLLineString(coords);
      const feature = new Feature(lineString);
      routeSourceRef.current.addFeature(feature);

      // Center the map on the initial line
      view.fit(lineString.getExtent(), {
        padding: [50, 50, 50, 50],
        maxZoom: 18,
      });
    }

    if (initialStopPoints) {
      const coords = initialStopPoints.coordinates.map((coord) =>
        fromLonLat(coord),
      );
      const multiPoint = new OLMultiPoint(coords);

      // Add each point as a separate feature for better styling and interaction
      coords.forEach((coord) => {
        const point = new OLPoint(coord);
        const feature = new Feature(point);
        stopSourceRef.current.addFeature(feature);
      });

      if (!initialRoutePath) {
        // Only center on points if we don't have a route
        view.fit(multiPoint.getExtent(), {
          padding: [50, 50, 50, 50],
          maxZoom: 15,
        });
      }
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

  // Start drawing line for route
  const startDrawingRoute = () => {
    if (!mapRef.current) return;

    // Clear previous drawings
    routeSourceRef.current.clear();

    // Remove existing interactions
    if (drawInteractionRef.current) {
      mapRef.current.removeInteraction(drawInteractionRef.current);
    }

    if (modifyInteractionRef.current) {
      mapRef.current.removeInteraction(modifyInteractionRef.current);
    }

    // Create draw interaction for LineString
    drawInteractionRef.current = new Draw({
      source: routeSourceRef.current,
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
      onTransportGeometrySelect({
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

      setIsLineDrawing(false);
    });

    setIsLineDrawing(true);
    setIsStopDrawing(false);
  };

  // Start drawing points for stops
  const startDrawingStops = () => {
    if (!mapRef.current) return;

    // Remove existing interactions
    if (drawInteractionRef.current) {
      mapRef.current.removeInteraction(drawInteractionRef.current);
    }

    // Create draw interaction for Point
    drawInteractionRef.current = new Draw({
      source: stopSourceRef.current,
      type: "Point",
    });

    // Add the interaction to the map
    mapRef.current.addInteraction(drawInteractionRef.current);

    // Set up drawing complete handler
    drawInteractionRef.current.on("drawend", (event) => {
      // Get all stops including the new one
      const features = stopSourceRef.current.getFeatures();
      const coordinates = features.map((feature) => {
        const geometry = feature.getGeometry() as OLPoint;
        return toLonLat(geometry.getCoordinates()) as [number, number];
      });

      // Update state
      onTransportGeometrySelect(undefined, {
        type: "MultiPoint",
        coordinates: coordinates,
      });

      // Keep the draw interaction active so user can add more stops
      // but don't remove the existing interaction

      setIsStopDrawing(true);
    });

    setIsStopDrawing(true);
    setIsLineDrawing(false);
  };

  // Add modify interaction for existing geometries
  const addModifyInteraction = () => {
    if (!mapRef.current) return;

    // Remove existing modify interactions
    if (modifyInteractionRef.current) {
      mapRef.current.removeInteraction(modifyInteractionRef.current);
      modifyInteractionRef.current = null;
    }

    // Create modify interaction for the routes
    const routeModify = new Modify({
      source: routeSourceRef.current,
    });

    // Create modify interaction for the stops
    const stopModify = new Modify({
      source: stopSourceRef.current,
    });

    // Add both interactions to the map
    mapRef.current.addInteraction(routeModify);
    mapRef.current.addInteraction(stopModify);

    // Store reference to the first one (we'll need to keep track of both if we want to remove them later)
    modifyInteractionRef.current = routeModify;

    // Set up event handlers for both interactions
    const handleModifyEnd = () => {
      // Get updated route
      let updatedRoutePath: LineString | undefined;
      const routeFeatures = routeSourceRef.current.getFeatures();
      if (routeFeatures.length > 0) {
        const geometry = routeFeatures[0].getGeometry() as OLLineString;
        const coordinates = geometry
          .getCoordinates()
          .map((coord) => toLonLat(coord) as [number, number]);

        updatedRoutePath = {
          type: "LineString",
          coordinates: coordinates,
        };
      }

      // Get updated stops
      let updatedStopPoints: MultiPoint | undefined;
      const stopFeatures = stopSourceRef.current.getFeatures();
      if (stopFeatures.length > 0) {
        const coordinates = stopFeatures.map((feature) => {
          const geometry = feature.getGeometry() as OLPoint;
          return toLonLat(geometry.getCoordinates()) as [number, number];
        });

        updatedStopPoints = {
          type: "MultiPoint",
          coordinates: coordinates,
        };
      }

      // Update state
      onTransportGeometrySelect(updatedRoutePath, updatedStopPoints);
    };

    routeModify.on("modifyend", handleModifyEnd);
    stopModify.on("modifyend", handleModifyEnd);
  };

  // Clear all geometries
  const clearAll = () => {
    routeSourceRef.current.clear();
    stopSourceRef.current.clear();

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

    setIsLineDrawing(false);
    setIsStopDrawing(false);
    onTransportGeometrySelect(undefined, undefined);
  };

  // Clear only stops
  const clearStops = () => {
    stopSourceRef.current.clear();

    // If we were in stop drawing mode, exit it
    if (isStopDrawing && mapRef.current && drawInteractionRef.current) {
      mapRef.current.removeInteraction(drawInteractionRef.current);
      drawInteractionRef.current = null;
      setIsStopDrawing(false);
    }

    // Update parent with empty stops but keep route
    const routeFeatures = routeSourceRef.current.getFeatures();
    if (routeFeatures.length > 0) {
      const geometry = routeFeatures[0].getGeometry() as OLLineString;
      const coordinates = geometry
        .getCoordinates()
        .map((coord) => toLonLat(coord) as [number, number]);

      onTransportGeometrySelect(
        {
          type: "LineString",
          coordinates: coordinates,
        },
        undefined,
      );
    } else {
      onTransportGeometrySelect(undefined, undefined);
    }

    // Add modify interaction back
    addModifyInteraction();
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

  // Finish stop drawing mode
  const finishStopDrawing = () => {
    if (mapRef.current && drawInteractionRef.current) {
      mapRef.current.removeInteraction(drawInteractionRef.current);
      drawInteractionRef.current = null;
      setIsStopDrawing(false);

      // Add modify interaction back
      addModifyInteraction();
    }
  };

  return (
    <div className="flex flex-col">
      <div className="p-3 border-b bg-background flex flex-wrap gap-3 justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={isLineDrawing || isStopDrawing ? "bg-muted" : ""}
              >
                <Layers className="h-4 w-4 mr-2" />
                कोर्नुहोस्
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={startDrawingRoute}>
                मार्गको रेखा कोर्नुहोस्
              </DropdownMenuItem>
              <DropdownMenuItem onClick={startDrawingStops}>
                बिसौनीहरू थप्नुहोस्
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

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

        <div className="flex gap-2">
          {isStopDrawing && (
            <Button variant="secondary" size="sm" onClick={finishStopDrawing}>
              बिसौनी थप्न अन्त्य गर्नुहोस्
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={clearStops}>
            बिसौनीहरू मेटाउनुहोस्
          </Button>
          <Button variant="outline" size="sm" onClick={clearAll}>
            सबै मेटाउनुहोस्
          </Button>
        </div>
      </div>

      <div className="w-full h-[600px]">
        <div
          ref={mapContainer}
          style={{ width: "100%", height: "100%" }}
          className="relative"
        />
      </div>

      <div className="p-3 border-t bg-muted/20 text-xs">
        {isLineDrawing ? (
          <p>
            मार्ग रेखाङ्कन गर्न नक्सामा क्लिक गर्दै जानुहोस् र अन्त्यमा डबल
            क्लिक गरेर समाप्त गर्नुहोस्
          </p>
        ) : isStopDrawing ? (
          <p>
            बिसौनी थप्न नक्सामा क्लिक गर्दै जानुहोस् र पूरा भएपछि माथि "बिसौनी
            थप्न अन्त्य गर्नुहोस्" बटन क्लिक गर्नुहोस्
          </p>
        ) : (
          <p>मार्ग वा बिसौनी कोर्न "कोर्नुहोस्" मेनु प्रयोग गर्नुहोस्</p>
        )}
      </div>
    </div>
  );
}
