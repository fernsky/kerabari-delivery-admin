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
import { Point as OLPoint, Polygon as OLPolygon } from "ol/geom";
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

type Polygon = {
  type: "Polygon";
  coordinates: Array<Array<[number, number]>>;
};

interface AgricZoneLocationMapProps {
  onGeometrySelect: (locationPoint?: Point, areaPolygon?: Polygon) => void;
  initialLocationPoint?: Point;
  initialAreaPolygon?: Polygon;
}

export function AgricZoneLocationMap({
  onGeometrySelect,
  initialLocationPoint,
  initialAreaPolygon,
}: AgricZoneLocationMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const viewRef = useRef<View | null>(null);
  const pointSourceRef = useRef<VectorSource>(new VectorSource());
  const polygonSourceRef = useRef<VectorSource>(new VectorSource());
  const drawInteractionRef = useRef<Draw | null>(null);
  const modifyInteractionRef = useRef<Modify | null>(null);
  const { isStreetView, toggleView } = useMapViewStore();
  const [isPointDrawing, setIsPointDrawing] = useState(false);
  const [isPolygonDrawing, setIsPolygonDrawing] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    // Create vector layers
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

    const polygonVectorLayer = new VectorLayer({
      source: polygonSourceRef.current,
      style: new Style({
        fill: new Fill({ color: "rgba(128, 159, 255, 0.2)" }),
        stroke: new Stroke({ color: "#3366ff", width: 2 }),
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
      layers: [tileLayer, polygonVectorLayer, pointVectorLayer],
      view: view,
    });

    // Load initial geometries if provided
    if (initialLocationPoint) {
      const point = new OLPoint(fromLonLat(initialLocationPoint.coordinates));
      const feature = new Feature(point);
      pointSourceRef.current.addFeature(feature);
    }

    if (initialAreaPolygon) {
      try {
        const coords = initialAreaPolygon.coordinates[0].map((coord) =>
          fromLonLat(coord),
        );
        const polygon = new OLPolygon([coords]);
        const feature = new Feature(polygon);
        polygonSourceRef.current.addFeature(feature);

        // If we have a polygon but no point, let's center on the polygon
        if (!initialLocationPoint) {
          view.fit(polygon, { padding: [50, 50, 50, 50], maxZoom: 15 });
        }
      } catch (error) {
        console.error("Error loading initial polygon:", error);
      }
    }

    // If we have a location point, center on it
    if (initialLocationPoint) {
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
  const startDrawingPoint = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (!mapRef.current) return;

    // Clear previous point
    pointSourceRef.current.clear();

    // Remove existing draw interactions
    if (drawInteractionRef.current) {
      mapRef.current.removeInteraction(drawInteractionRef.current);
      drawInteractionRef.current = null;
    }

    if (modifyInteractionRef.current) {
      mapRef.current.removeInteraction(modifyInteractionRef.current);
      modifyInteractionRef.current = null;
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

      // Get existing polygon if any
      let areaPolygon: Polygon | undefined = undefined;
      const polygonFeatures = polygonSourceRef.current.getFeatures();
      if (polygonFeatures.length > 0) {
        const polygonGeometry = polygonFeatures[0].getGeometry() as OLPolygon;
        const polygonCoordinates = polygonGeometry
          .getCoordinates()[0]
          .map((coord) => toLonLat(coord) as [number, number]);

        areaPolygon = {
          type: "Polygon",
          coordinates: [polygonCoordinates],
        };
      }

      // Update state
      onGeometrySelect(
        {
          type: "Point",
          coordinates: coordinate,
        },
        areaPolygon,
      );

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
    setIsPolygonDrawing(false);
  };

  // Start drawing area polygon
  const startDrawingPolygon = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (!mapRef.current) return;

    // Clear previous polygon
    polygonSourceRef.current.clear();

    // Remove existing draw interactions
    if (drawInteractionRef.current) {
      mapRef.current.removeInteraction(drawInteractionRef.current);
      drawInteractionRef.current = null;
    }

    if (modifyInteractionRef.current) {
      mapRef.current.removeInteraction(modifyInteractionRef.current);
      modifyInteractionRef.current = null;
    }

    // Create draw interaction for Polygon
    drawInteractionRef.current = new Draw({
      source: polygonSourceRef.current,
      type: "Polygon",
    });

    // Add the interaction to the map
    mapRef.current.addInteraction(drawInteractionRef.current);

    // Set up drawing complete handler
    drawInteractionRef.current.on("drawend", (event) => {
      // Get the polygon geometry
      const geometry = event.feature.getGeometry() as OLPolygon;

      // Convert to GeoJSON format
      const polygonCoordinates = geometry
        .getCoordinates()[0]
        .map((coord) => toLonLat(coord) as [number, number]);

      // Get existing point if any
      let locationPoint: Point | undefined = undefined;
      const pointFeatures = pointSourceRef.current.getFeatures();
      if (pointFeatures.length > 0) {
        const pointGeometry = pointFeatures[0].getGeometry() as OLPoint;
        const pointCoordinate = toLonLat(pointGeometry.getCoordinates()) as [
          number,
          number,
        ];

        locationPoint = {
          type: "Point",
          coordinates: pointCoordinate,
        };
      }

      // Update state
      onGeometrySelect(locationPoint, {
        type: "Polygon",
        coordinates: [polygonCoordinates],
      });

      // Remove draw interaction when finished
      if (mapRef.current && drawInteractionRef.current) {
        mapRef.current.removeInteraction(drawInteractionRef.current);
        drawInteractionRef.current = null;
      }

      // Add modify interaction
      addModifyInteraction();

      setIsPolygonDrawing(false);
    });

    setIsPolygonDrawing(true);
    setIsPointDrawing(false);
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

    // Create modify interaction for the polygon
    const polygonModify = new Modify({
      source: polygonSourceRef.current,
    });

    // Add interactions to the map
    mapRef.current.addInteraction(pointModify);
    mapRef.current.addInteraction(polygonModify);

    // Store reference to one of them for cleanup
    modifyInteractionRef.current = pointModify;

    // Set up event handlers for point modify interaction
    pointModify.on("modifyend", () => {
      updateGeometries();
    });

    // Set up event handlers for polygon modify interaction
    polygonModify.on("modifyend", () => {
      updateGeometries();
    });
  };

  // Update geometries after modification
  const updateGeometries = () => {
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

    // Get updated polygon
    let updatedPolygon: Polygon | undefined;
    const polygonFeatures = polygonSourceRef.current.getFeatures();
    if (polygonFeatures.length > 0) {
      const geometry = polygonFeatures[0].getGeometry() as OLPolygon;
      const polygonCoordinates = geometry
        .getCoordinates()[0]
        .map((coord) => toLonLat(coord) as [number, number]);

      updatedPolygon = {
        type: "Polygon",
        coordinates: [polygonCoordinates],
      };
    }

    // Update state with updated geometries
    onGeometrySelect(updatedPoint, updatedPolygon);
  };

  // Clear all geometries
  const clearAll = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    pointSourceRef.current.clear();
    polygonSourceRef.current.clear();

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
    setIsPolygonDrawing(false);
    onGeometrySelect(undefined, undefined);
  };

  // Reset map view
  const resetView = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
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
            onClick={(e) => startDrawingPoint(e)}
          >
            स्थान थप्नुहोस्
          </Button>

          <Button
            variant={isPolygonDrawing ? "default" : "outline"}
            size="sm"
            onClick={(e) => startDrawingPolygon(e)}
          >
            क्षेत्र सीमा थप्नुहोस्
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              toggleView();
            }}
          >
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
                  onClick={(e) => resetView(e)}
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

        <Button variant="outline" size="sm" onClick={(e) => clearAll(e)}>
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
          <p>स्थान राख्न नक्सामा क्लिक गर्नुहोस्</p>
        ) : isPolygonDrawing ? (
          <p>
            क्षेत्र सीमाङ्कन गर्न नक्सामा क्लिक गर्नुहोस् र बन्द गर्न डबल क्लिक
            गर्नुहोस्
          </p>
        ) : (
          <p>
            कृषि क्षेत्रको स्थान वा क्षेत्र अंकन गर्न माथिको बटन क्लिक गर्नुहोस्
          </p>
        )}
      </div>
    </div>
  );
}
