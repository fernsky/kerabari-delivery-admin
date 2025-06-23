"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { Location } from "./HouseholdLocationMap";
import "leaflet/dist/leaflet.css";

// Import Leaflet modules directly
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

type ClientSideMapProps = {
  location: Location;
  familyHeadName?: string;
};

const ClientSideMap = ({ location, familyHeadName }: ClientSideMapProps) => {
  const [isStreetView, setIsStreetView] = useState(true);

  // Fix Leaflet marker icons
  useEffect(() => {
    // Fix issue with default marker icon
    delete (L.Icon.Default.prototype as any)._getIconUrl;

    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "/images/marker-icon-2x.png",
      iconUrl: "/images/marker-icon.png",
      shadowUrl: "/images/marker-shadow.png",
    });
  }, []);

  // Toggle between street and satellite view
  const toggleView = () => {
    setIsStreetView(!isStreetView);
  };

  // Ensure coordinates exist
  if (!location.latitude || !location.longitude) {
    return (
      <Card className="w-full h-[300px] flex items-center justify-center">
        <div className="text-center p-6">
          <p>No coordinates available</p>
        </div>
      </Card>
    );
  }

  const position: [number, number] = [location.latitude, location.longitude];

  return (
    <div className="w-full h-[400px] rounded-md overflow-hidden border relative">
      <div className="absolute top-3 left-10 z-[400]">
        <Button
          variant="secondary"
          size="sm"
          className="bg-white"
          onClick={toggleView}
        >
          <MapPin className="h-4 w-4 mr-2" />
          {isStreetView ? "Satellite View" : "Street View"}
        </Button>
      </div>

      <MapContainer
        center={position}
        zoom={15}
        style={{ width: "100%", height: "100%" }}
        zoomControl={true}
        scrollWheelZoom={false}
        className="z-20"
      >
        <TileLayer
          key={isStreetView ? "street" : "satellite"}
          attribution={
            isStreetView ? "© OpenStreetMap contributors" : "© Google Maps"
          }
          url={
            isStreetView
              ? "https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
              : "https://mt1.google.com/vt/lyrs=y,h&x={x}&y={y}&z={z}"
          }
        />
        <Marker position={position}>
          <Popup>
            <strong>{familyHeadName || "Household"}</strong>
            <br />
            {location.latitude}, {location.longitude}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default ClientSideMap;
