"use client";
import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { X, Layers, Search } from "lucide-react";
// Removed useTranslation import
import useStore from "../../_store/app-store";
import Division from "./division";

const sampleData = [
  {
    divisionId: "municipalityBoundaries",
  },
  {
    divisionId: "health",
  },
  {
    divisionId: "municipalityOffices",
  },
  {
    divisionId: "physicalInfrastructures",
  },
  {
    divisionId: "touristPlaces",
  },
  {
    divisionId: "wardBoundaries",
  },
  {
    divisionId: "wardOffices",
  },
  {
    divisionId: "schools",
  },
  {
    divisionId: "roads",
  },
  {
    divisionId: "aspect",
    subDivisions: [
      {
        subDivisionId: "aspectFlat",
      },
      {
        subDivisionId: "aspectNorth",
      },
      {
        subDivisionId: "aspectNorthEast",
      },
      {
        subDivisionId: "aspectEast",
      },
      {
        subDivisionId: "aspectSouthEast",
      },
      {
        subDivisionId: "aspectSouth",
      },
      {
        subDivisionId: "aspectSouthWest",
      },
      {
        subDivisionId: "aspectWest",
      },
      {
        subDivisionId: "aspectNorthWest",
      },
    ],
  },
  {
    divisionId: "elevation",
    subDivisions: [
      {
        subDivisionId: "elevation2100",
      },
      {
        subDivisionId: "elevation2600",
      },
      {
        subDivisionId: "elevation3100",
      },
      {
        subDivisionId: "elevation3600",
      },
      {
        subDivisionId: "elevation4257",
      },
    ],
  },
  {
    divisionId: "highway",
  },
  {
    divisionId: "landUse",
    subDivisions: [
      {
        subDivisionId: "landUseWaterbodies",
      },
      {
        subDivisionId: "landUseForest",
      },
      {
        subDivisionId: "landUseCultivation",
      },
      {
        subDivisionId: "landUseBushes",
      },
      {
        subDivisionId: "landUseBuiltup",
      },
    ],
  },
  {
    divisionId: "slope",
    subDivisions: [
      {
        subDivisionId: "slope15",
      },
      {
        subDivisionId: "slope30",
      },
      {
        subDivisionId: "slope45",
      },
      {
        subDivisionId: "slope60",
      },
      {
        subDivisionId: "slope72",
      },
    ],
  },
  { divisionId: "springs" },
  { divisionId: "villages" },
];

// Map of division IDs to Nepali names
const divisionNames: Record<string, string> = {
  municipalityBoundaries: "गाउँपालिका सीमा",
  health: "स्वास्थ्य केन्द्र",
  municipalityOffices: "गाउँपालिका कार्यालय",
  physicalInfrastructures: "भौतिक पूर्वाधार",
  touristPlaces: "पर्यटकीय स्थल",
  wardBoundaries: "वडा सीमाना",
  wardOffices: "वडा कार्यालय",
  schools: "विद्यालय",
  roads: "सडक",
  aspect: "पक्ष",
  elevation: "उचाइ",
  highway: "राजमार्ग",
  landUse: "भू-उपयोग",
  slope: "भिरालोपन",
  springs: "पानीका मुहान",
  villages: "गाउँ",
};

interface SidebarProps {
  lng: string;
}

const Sidebar: React.FC<SidebarProps> = ({ lng }) => {
  const [searchQuery, setSearchQuery] = useState("");
  // Removed useTranslation hook
  const setMapSidebarOpen = useStore((state) => state.setMapSidebarOpen);

  const filteredData = useMemo(() => {
    if (!searchQuery) return sampleData;
    return sampleData.filter((d) =>
      getDivisionName(d.divisionId)
        .toLowerCase()
        .includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery]);

  // Helper function to get division name in Nepali
  function getDivisionName(divisionId: string): string {
    return divisionNames[divisionId] || divisionId;
  }

  return (
    <motion.div
      initial={{ x: 300 }}
      animate={{ x: 0 }}
      exit={{ x: 300 }}
      transition={{ type: "spring", damping: 20 }}
      className="w-[300px] sm:w-[380px] h-full bg-white/95 backdrop-blur-lg shadow-2xl 
      border-l border-gray-200 flex flex-col rounded-tl-2xl overflow-hidden"
    >
      <div className="p-5 border-b bg-gradient-to-br from-green-50 to-emerald-50 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 
        text-white shadow-lg shadow-green-500/20"
            >
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 tracking-wide leading-none mb-1">
                तहहरू
              </h2>
              <p className="text-xs text-gray-500 tracking-wide">
                तहहरू टगल गर्नुहोस्
              </p>
            </div>
          </div>
          <button
            onClick={() => setMapSidebarOpen(false)}
            className="p-2 hover:bg-white/50 rounded-lg transition-colors"
          >
            <X className="w-4 ह-4 text-gray-600" />
          </button>
        </div>
        <div className="relative group mt-4">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 
        group-focus-within:text-green-500 transition-colors"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="तहहरू खोज्नुहोस्..."
            className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 
        focus:ring-green-500/20 focus:border-green-500 bg-white/80 backdrop-blur-sm
        transition-all duration-200 text-xs tracking-wide placeholder:text-gray-400 
        font-medium"
          />
        </div>
      </div>
      <div className="overflow-y-auto flex-grow custom-scrollbar">
        {filteredData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-12 px-6 text-center">
            <Search className="w-12 h-12 text-gray-300 mb-4" />
            <p className="text-gray-500 text-[15px] font-medium">
              खोज अनुरूप कुनै तह फेला परेन
            </p>
          </div>
        ) : (
          filteredData.map((division, index) => (
            <Division
              lng={lng}
              key={division.divisionId}
              divisionName={getDivisionName(division.divisionId)}
              divisionId={division.divisionId}
              subDivisions={division?.subDivisions}
              isLast={index === filteredData.length - 1}
            />
          ))
        )}
      </div>
    </motion.div>
  );
};

export default Sidebar;
