"use client";
import React, { useState, useEffect } from "react";
import SidebarWrapper from "./sidebar-wrapper";
import useStore from "../../_store/app-store";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Leaflet = dynamic(() => import("./leaflet"), {
  ssr: false,
  loading: () => null, // Remove default loading
});

const LoadingScreen = ({ progress }: { progress: number }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.6 }}
    className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50/30 backdrop-blur-sm"
  >
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="flex flex-col items-center px-4 text-center"
    >
      <div className="relative">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full bg-green-400/20"
        />
        <div className="relative p-4 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/25">
          <Loader2 className="w-8 h-8 animate-spin text-white" />
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-8 space-y-2"
      >
        <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          भूगोल डेटा लोड हुँदैछ
        </h3>
        <p className="text-base text-gray-600 max-w-sm mx-auto leading-relaxed">
          <span className="font-medium text-green-600">बुद्धशान्ति</span> को
          विस्तृत नक्सा र स्थानिक जानकारी तयार गर्दै
        </p>
      </motion.div>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5 }}
        className="w-48 h-1 mt-8 bg-green-500 rounded-full"
      />
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-3 text-sm text-gray-500"
      >
        {progress}% पूरा
      </motion.p>
    </motion.div>
  </motion.div>
);

interface MapClientProps {
  params: {
    lng: string;
  };
}

const MapClient: React.FC<MapClientProps> = ({ params }) => {
  const { lng } = params;
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  // Store hooks
  const {
    addMunicipalityBoundaries,
    addHealths,
    addMunicipalityOffices,
    addPhysicalInfrastructures,
    addTouristPlaces,
    addWardBoundaries,
    addWardOffices,
    addSchools,
    addAspects,
    addElevations,
    addHighways,
    addLandUses,
    addSlopes,
    addSprings,
    addVillages,
    addRoads,
  } = useStore();

  // Fetch functions
  const fetchData = async (endpoint: string) => {
    const response = await fetch(`/api/${endpoint}`);
    return response.json();
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLoading) {
      timer = setInterval(() => {
        setProgress((prev) => Math.min(prev + 2, 90)); // Slowly increase to 90%
      }, 50);
    }
    return () => clearInterval(timer);
  }, [isLoading]);

  useEffect(() => {
    const loadAllData = async () => {
      setIsLoading(true);
      const startTime = Date.now();

      try {
        const [
          roads,
          municipalityBoundaries,
          healths,
          municipalityOffices,
          physicalInfrastructures,
          touristPlaces,
          wardBoundaries,
          wardOffices,
          schools,
          aspects,
          elevations,
          highways,
          landUses,
          slopes,
          springs,
          villages,
        ] = await Promise.all([
          fetchData("roads"),
          fetchData("municipalityBoundaries"),
          fetchData("health"),
          fetchData("municipalityOffices"),
          fetchData("physicalInfrastructures"),
          fetchData("touristPlaces"),
          fetchData("wardBoundaries"),
          fetchData("wardOffices"),
          fetchData("schools"),
          fetchData("aspect"),
          fetchData("elevation"),
          fetchData("highway"),
          fetchData("landUse"),
          fetchData("slope"),
          fetchData("springs"),
          fetchData("villages"),
        ]);

        // Update store with fetched data
        addRoads(roads);
        addMunicipalityBoundaries(municipalityBoundaries);
        addHealths(healths);
        addMunicipalityOffices(municipalityOffices);
        addPhysicalInfrastructures(physicalInfrastructures);
        addTouristPlaces(touristPlaces);
        addWardBoundaries(wardBoundaries);
        addWardOffices(wardOffices);
        addSchools(schools);
        addAspects(aspects);
        addElevations(elevations);
        addHighways(highways);
        addLandUses(landUses);
        addSlopes(slopes);
        addSprings(springs);
        addVillages(villages);

        // Ensure minimum loading time of 3.5 seconds
        const elapsedTime = Date.now() - startTime;
        const minimumTime = 3500;

        if (elapsedTime < minimumTime) {
          await new Promise((resolve) =>
            setTimeout(resolve, minimumTime - elapsedTime),
          );
        }

        setProgress(100); // Complete the progress
        await new Promise((resolve) => setTimeout(resolve, 400)); // Show 100% briefly
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading map data:", error);
        setIsLoading(false);
      }
    };

    loadAllData();
  }, [
    addMunicipalityBoundaries,
    addHealths,
    addMunicipalityOffices,
    addPhysicalInfrastructures,
    addTouristPlaces,
    addWardBoundaries,
    addWardOffices,
    addSchools,
    addAspects,
    addElevations,
    addHighways,
    addLandUses,
    addSlopes,
    addSprings,
    addVillages,
    addRoads,
  ]);

  return (
    <div className="h-full w-full relative overflow-hidden">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <LoadingScreen key="loading" progress={progress} />
        ) : (
          <motion.div
            key="map"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="h-full w-full"
          >
            <Leaflet />
            <SidebarWrapper lng={lng} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MapClient;
