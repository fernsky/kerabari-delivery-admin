"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Map as MapIcon, Eye } from "lucide-react";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { fromLonLat, toLonLat } from "ol/proj";
import { Style, Fill, Stroke, Circle, Text } from "ol/style";
import { Feature } from "ol";
import { Point as OLPoint, Polygon as OLPolygon } from "ol/geom";
import Overlay from "ol/Overlay";
import DragRotateAndZoom from "ol/interaction/DragRotateAndZoom";
import { defaults as defaultInteractions } from "ol/interaction";
import { useMapViewStore } from "@/store/map-view-store";

interface LocationItem {
  id: string;
  name: string;
  slug: string;
  type: string;
  pointGeometry?: {
    type: string;
    coordinates: [number, number];
  };
  polygonGeometry?: {
    type: string;
    coordinates: [number, number][][][];
  };
  centroid?: {
    type: string;
    coordinates: [number, number];
  };
  primaryMedia?: {
    mediaId: string;
    url: string;
    fileName?: string;
  };
}

interface MapViewProps {
  locations: LocationItem[];
  locationTypes: { value: string; label: string }[];
  isLoading?: boolean;
}

export function MapView({ locations, locationTypes, isLoading }: MapViewProps) {
  const router = useRouter();
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const overlayRef = useRef<Overlay | null>(null);
  const overlayContentRef = useRef<HTMLDivElement>(null);
  const tileLayerRef = useRef<TileLayer<any> | null>(null);
  const { isStreetView, toggleView } = useMapViewStore();
  const [selectedLocation, setSelectedLocation] = useState<LocationItem | null>(
    null,
  );

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    // Create a vector source for locations
    const locationSource = new VectorSource();

    // Create a vector layer for locations
    const locationLayer = new VectorLayer({
      source: locationSource,
      style: (feature) => {
        const isPoint = feature.getGeometry()?.getType() === "Point";

        if (isPoint) {
          return new Style({
            image: new Circle({
              radius: 8,
              fill: new Fill({ color: "#3b82f6" }),
              stroke: new Stroke({ color: "#ffffff", width: 2 }),
            }),
            text: new Text({
              text: feature.get("name"),
              offsetY: -15,
              font: "12px sans-serif",
              fill: new Fill({ color: "#000000" }),
              stroke: new Stroke({ color: "#ffffff", width: 3 }),
              textAlign: "center",
            }),
          });
        } else {
          return new Style({
            fill: new Fill({ color: "rgba(59, 130, 246, 0.2)" }),
            stroke: new Stroke({ color: "#3b82f6", width: 2 }),
          });
        }
      },
    });

    // Create the base tile layer based on the view preference
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

    tileLayerRef.current = tileLayer;

    // Create the popup overlay
    const overlay = new Overlay({
      element: overlayContentRef.current!,
      positioning: "bottom-center",
      offset: [0, -10],
      autoPan: true,
    });

    overlayRef.current = overlay;

    // Create the map
    mapRef.current = new Map({
      target: mapContainer.current,
      layers: [tileLayer, locationLayer],
      view: new View({
        center: fromLonLat([84.0, 28.3]), // Default center of Nepal
        zoom: 7,
        enableRotation: true,
      }),
      overlays: [overlay],
      interactions: defaultInteractions().extend([new DragRotateAndZoom()]),
    });

    // Add click handler for location selection
    mapRef.current.on("click", function (evt) {
      const feature = mapRef.current!.forEachFeatureAtPixel(
        evt.pixel,
        function (feature) {
          return feature;
        },
      );

      if (feature) {
        const locationId = feature.get("id");
        const location = locations.find((loc) => loc.id === locationId);
        if (location) {
          setSelectedLocation(location);

          // Position the overlay
          let coordinates;
          if (location.centroid) {
            coordinates = fromLonLat(location.centroid.coordinates);
          } else if (location.pointGeometry) {
            coordinates = fromLonLat(location.pointGeometry.coordinates);
          }

          if (coordinates && overlayRef.current) {
            overlayRef.current.setPosition(coordinates);
          }
        }
      } else {
        setSelectedLocation(null);
        if (overlayRef.current) {
          overlayRef.current.setPosition(undefined);
        }
      }
    });

    // Add features for all locations
    addLocationFeatures(locationSource, locations);

    // Auto-fit to all location features
    if (locations.length > 0 && locationSource.getFeatures().length > 0) {
      const extent = locationSource.getExtent();
      mapRef.current
        .getView()
        .fit(extent, { padding: [50, 50, 50, 50], maxZoom: 14 });
    }

    // Cleanup function
    return () => {
      if (mapRef.current) {
        mapRef.current.setTarget(undefined);
        mapRef.current = null;
      }
    };
  }, []);

  // Update the map when locations change
  useEffect(() => {
    if (!mapRef.current) return;

    // Get the vector source from the second layer (index 1)
    const layers = mapRef.current.getLayers().getArray();
    const vectorLayer = layers[1] as VectorLayer<VectorSource>;
    const source = vectorLayer.getSource();

    // Clear existing features
    source?.clear();

    // Add new features
    addLocationFeatures(source, locations);

    // Reset selection when locations change
    setSelectedLocation(null);
    if (overlayRef.current) {
      overlayRef.current.setPosition(undefined);
    }

    // Auto-fit to all location features
    if (locations.length > 0 && source?.getFeatures().length! > 0) {
      const extent = source?.getExtent()!;
      mapRef.current
        .getView()
        .fit(extent, { padding: [50, 50, 50, 50], maxZoom: 14 });
    }
  }, [locations]);

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
    }
  }, [isStreetView]);

  // Helper function to add features to the map
  const addLocationFeatures = (
    source: VectorSource | null,
    locations: LocationItem[],
  ) => {
    if (!source) return;

    locations.forEach((loc) => {
      // For locations with polygon geometry, add polygon feature
      if (loc.polygonGeometry) {
        try {
          const coordinates = loc.polygonGeometry.coordinates[0].map((ring) =>
            ring.map((coord) => fromLonLat(coord as [number, number])),
          );
          const polygon = new OLPolygon(coordinates);
          const feature = new Feature({
            geometry: polygon,
            id: loc.id,
            name: loc.name,
            type: loc.type,
          });
          source.addFeature(feature);
        } catch (error) {
          console.error("Error adding polygon for", loc.id, error);
        }
      }

      // For all locations, add a point feature (either from pointGeometry or centroid)
      try {
        let coordinates;
        if (loc.centroid) {
          coordinates = loc.centroid.coordinates;
        } else if (loc.pointGeometry) {
          coordinates = loc.pointGeometry.coordinates;
        }

        if (coordinates) {
          const point = new OLPoint(fromLonLat(coordinates));
          const feature = new Feature({
            geometry: point,
            id: loc.id,
            name: loc.name,
            type: loc.type,
          });
          source.addFeature(feature);
        }
      } catch (error) {
        console.error("Error adding point for", loc.id, error);
      }
    });
  };

  // Function to view location details
  const handleViewLocation = () => {
    if (selectedLocation) {
      router.push(
        `/dashboard/digital-profile/institutions/local-areas/${selectedLocation.id}`,
      );
    }
  };

  return (
    <>
      <div className="relative h-[600px] rounded-lg border overflow-hidden">
        <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />

        {/* Map controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <Button
            size="sm"
            className="bg-white text-black hover:bg-gray-100"
            onClick={() => toggleView()}
          >
            <MapIcon className="h-4 w-4 mr-2" />
            {isStreetView ? "उपग्रह दृश्य" : "सडक दृश्य"}
          </Button>
        </div>

        {/* Popup overlay */}
        <div ref={overlayContentRef} className="ol-popup">
          {selectedLocation && (
            <Card className="w-64 shadow-lg overflow-hidden">
              {selectedLocation.primaryMedia?.url && (
                <div className="w-full h-32">
                  <img
                    src={selectedLocation.primaryMedia.url}
                    alt={selectedLocation.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardContent className="p-3">
                <h3 className="font-medium">{selectedLocation.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {locationTypes.find((t) => t.value === selectedLocation.type)
                    ?.label || selectedLocation.type}
                </p>
                <div className="mt-2 flex justify-end">
                  <Button
                    size="sm"
                    variant="default"
                    onClick={handleViewLocation}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    हेर्नुहोस्
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-sm">नक्सा लोड हुँदैछ...</p>
          </div>
        </div>
      )}

      <style jsx>{`
        .ol-popup {
          position: absolute;
          transform: translate(-50%, -100%);
          pointer-events: auto;
        }
      `}</style>
    </>
  );
}
