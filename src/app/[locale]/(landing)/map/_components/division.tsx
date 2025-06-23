"use client";
import { motion, AnimatePresence } from "framer-motion";
import React, { useMemo, useState } from "react";
import SubDivision from "./sub-division";
import Checkbox from "./checkbox";
import { Minus, Plus, ChevronRight } from "lucide-react";
// Removed useTranslation import
import useStore from "../../_store/app-store";

interface DivisionProps {
  divisionName: string;
  subDivisions: { subDivisionId: string }[] | undefined;
  isLast: boolean;
  lng: string;
  divisionId: string;
}

const Division: React.FC<DivisionProps> = ({
  divisionName,
  subDivisions,
  isLast,
  lng,
  divisionId,
}) => {
  // Removed useTranslation hook
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const setShowMunicipalityBoundaries = useStore(
    (state) => state.setShowMunicipalityBoundaries,
  );
  const setShowHealth = useStore((state) => state.setShowHealth);
  const setShowMunicipalityOffices = useStore(
    (state) => state.setShowMunicipalityOffices,
  );
  const setShowPhysicalInfrastructures = useStore(
    (state) => state.setShowPhysicalInfrastructures,
  );
  const setShowTouristPlaces = useStore((state) => state.setShowTouristPlaces);
  const setShowWardBoundaries = useStore(
    (state) => state.setShowWardBoundaries,
  );
  const setShowWardOffices = useStore((state) => state.setShowWardOffices);
  const setShowSchools = useStore((state) => state.setShowSchools);
  const setShowAspect = useStore((state) => state.setShowAspect);
  const setShowElevation = useStore((state) => state.setShowElevation);
  const setShowHighway = useStore((state) => state.setShowHighway);
  const setShowLandUse = useStore((state) => state.setShowLandUse);

  const setShowSlope = useStore((state) => state.setShowSlope);
  const setShowSprings = useStore((state) => state.setShowSprings);
  const setShowVillages = useStore((state) => state.setShowVillages);
  const setShowRoads = useStore((state) => state.setShowRoads);

  // Sub Divisions
  const setShowAspectFlat = useStore((state) => state.setShowAspectFlat);
  const setShowAspectNorth = useStore((state) => state.setShowAspectNorth);
  const setShowAspectNorthEast = useStore(
    (state) => state.setShowAspectNorthEast,
  );
  const setShowAspectEast = useStore((state) => state.setShowAspectEast);
  const setShowAspectSouthEast = useStore(
    (state) => state.setShowAspectSouthEast,
  );
  const setShowAspectSouth = useStore((state) => state.setShowAspectSouth);
  const setShowAspectSouthWest = useStore(
    (state) => state.setShowAspectSouthWest,
  );
  const setShowAspectWest = useStore((state) => state.setShowAspectWest);
  const setShowAspectNorthWest = useStore(
    (state) => state.setShowAspectNorthWest,
  );

  const setShowElevation2100 = useStore((state) => state.setShowElevation2100);
  const setShowElevation2600 = useStore((state) => state.setShowElevation2600);
  const setShowElevation3100 = useStore((state) => state.setShowElevation3100);
  const setShowElevation3600 = useStore((state) => state.setShowElevation3600);
  const setShowElevation4257 = useStore((state) => state.setShowElevation4257);

  const setShowLandUseWaterbodies = useStore(
    (state) => state.setShowLandUseWaterbodies,
  );
  const setShowLandUseForest = useStore((state) => state.setShowLandUseForest);
  const setShowLandUseCultivation = useStore(
    (state) => state.setShowLandUseCultivation,
  );
  const setShowLandUseBushes = useStore((state) => state.setShowLandUseBushes);
  const setShowLandUseBuiltup = useStore(
    (state) => state.setShowLandUseBuiltup,
  );

  const setShowSlope15 = useStore((state) => state.setShowSlope15);
  const setShowSlope30 = useStore((state) => state.setShowSlope30);
  const setShowSlope45 = useStore((state) => state.setShowSlope45);
  const setShowSlope60 = useStore((state) => state.setShowSlope60);
  const setShowSlope72 = useStore((state) => state.setShowSlope72);

  const showMunicipalityBoundaries = useStore(
    (state) => state.showMunicipalityBoundaries,
  );
  const showHealth = useStore((state) => state.showHealth);
  const showMunicipalityOffices = useStore(
    (state) => state.showMunicipalityOffices,
  );
  const showPhysicalInfrastructures = useStore(
    (state) => state.showPhysicalInfrastructures,
  );
  const showTouristPlaces = useStore((state) => state.showTouristPlaces);
  const showWardBoundaries = useStore((state) => state.showWardBoundaries);
  const showWardOffices = useStore((state) => state.showWardOffices);
  const showSchools = useStore((state) => state.showSchools);
  const showAspect = useStore((state) => state.showAspect);
  const showElevation = useStore((state) => state.showElevation);
  const showHighway = useStore((state) => state.showHighway);
  const showLandUse = useStore((state) => state.showLandUse);
  const showSlope = useStore((state) => state.showSlope);
  const showSprings = useStore((state) => state.showSprings);
  const showVillages = useStore((state) => state.showVillages);
  const showRoads = useStore((state) => state.showRoads);

  const handleCheckboxChange = (checked: boolean) => {
    switch (divisionId) {
      case "municipalityBoundaries":
        setShowMunicipalityBoundaries(checked);
        break;
      case "health":
        setShowHealth(checked);
        break;
      case "municipalityOffices":
        setShowMunicipalityOffices(checked);
        break;
      case "physicalInfrastructures":
        setShowPhysicalInfrastructures(checked);
        break;
      case "touristPlaces":
        setShowTouristPlaces(checked);
        break;
      case "wardBoundaries":
        setShowWardBoundaries(checked);
        break;
      case "wardOffices":
        setShowWardOffices(checked);
        break;
      case "schools":
        setShowSchools(checked);
        break;
      case "aspect":
        setShowAspect(checked);
        setShowAspectFlat(checked);
        setShowAspectNorth(checked);
        setShowAspectNorthEast(checked);
        setShowAspectEast(checked);
        setShowAspectSouthEast(checked);
        setShowAspectSouth(checked);
        setShowAspectSouthWest(checked);
        setShowAspectWest(checked);
        setShowAspectNorthWest(checked);
        break;
      case "elevation":
        setShowElevation(checked);
        setShowElevation2100(checked);
        setShowElevation2600(checked);
        setShowElevation3100(checked);
        setShowElevation3600(checked);
        setShowElevation4257(checked);
        break;
      case "highway":
        setShowHighway(checked);
        break;
      case "landUse":
        setShowLandUse(checked);
        setShowLandUseWaterbodies(checked);
        setShowLandUseForest(checked);
        setShowLandUseCultivation(checked);
        setShowLandUseBushes(checked);
        setShowLandUseBuiltup(checked);
        break;
      case "slope":
        setShowSlope(checked);
        setShowSlope15(checked);
        setShowSlope30(checked);
        setShowSlope45(checked);
        setShowSlope60(checked);
        setShowSlope72(checked);
        break;
      case "springs":
        setShowSprings(checked);
        break;
      case "villages":
        setShowVillages(checked);
        break;
      case "roads":
        setShowRoads(checked);
        break;
      default:
        break;
    }
  };

  const checked = useMemo(() => {
    switch (divisionId) {
      case "municipalityBoundaries":
        return showMunicipalityBoundaries;
      case "health":
        return showHealth;
      case "municipalityOffices":
        return showMunicipalityOffices;
      case "physicalInfrastructures":
        return showPhysicalInfrastructures;
      case "touristPlaces":
        return showTouristPlaces;
      case "wardBoundaries":
        return showWardBoundaries;
      case "wardOffices":
        return showWardOffices;
      case "schools":
        return showSchools;
      case "aspect":
        return showAspect;
      case "elevation":
        return showElevation;
      case "highway":
        return showHighway;
      case "landUse":
        return showLandUse;
      case "slope":
        return showSlope;
      case "springs":
        return showSprings;
      case "villages":
        return showVillages;
      case "roads":
        return showRoads;
      default:
        return false;
    }
  }, [
    showMunicipalityBoundaries,
    showHealth,
    showMunicipalityOffices,
    showPhysicalInfrastructures,
    showTouristPlaces,
    showWardBoundaries,
    showWardOffices,
    showSchools,
    showAspect,
    showElevation,
    showHighway,
    showLandUse,
    showSlope,
    showSprings,
    showVillages,
    showRoads,
    divisionId,
  ]);

  return (
    <div className="border-b border-gray-100 last:border-none">
      <div
        className={`px-5 py-3.5 hover:bg-gradient-to-br hover:from-green-50/50 hover:to-transparent
        transition-all duration-200 cursor-pointer select-none group`}
        onClick={() => subDivisions && toggleExpanded()}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Checkbox onChange={handleCheckboxChange} checked={checked} />
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-tight text-gray-800  group-hover:text-gray-900">
                {divisionName}
              </span>
              {subDivisions && (
                <span className="text-xs text-gray-500 mt-0.5">
                  {subDivisions.length} वटा तहहरू उपलब्ध छन्
                </span>
              )}
            </div>
          </div>
          {subDivisions && (
            <motion.div
              animate={{ rotate: expanded ? 90 : 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="p-1.5 rounded-full group-hover:bg-white/80"
            >
              <ChevronRight className="w-4 h-4 text-gray-500" />
            </motion.div>
          )}
        </div>
      </div>
      <AnimatePresence>
        {expanded && subDivisions && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-gradient-to-r from-gray-50/80 to-transparent"
          >
            {subDivisions?.map((subDivision, index) => (
              <SubDivision
                subDivisionId={subDivision.subDivisionId}
                key={subDivision.subDivisionId}
                subDivisionName={getSubDivisionName(subDivision.subDivisionId)}
                isLast={index === subDivisions.length - 1}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Helper function to get direct Nepali text for subdivision names
function getSubDivisionName(subDivisionId: string): string {
  // Map of subdivision IDs to their Nepali names
  const nepaliNames: Record<string, string> = {
    // Add all necessary mappings here for the subdivisions
    aspectFlat: "सपाट",
    aspectNorth: "उत्तर",
    aspectNorthEast: "उत्तर-पूर्व",
    aspectEast: "पूर्व",
    aspectSouthEast: "दक्षिण-पूर्व",
    aspectSouth: "दक्षिण",
    aspectSouthWest: "दक्षिण-पश्चिम",
    aspectWest: "पश्चिम",
    aspectNorthWest: "उत्तर-पश्चिम",
    elevation2100: "२१०० मि.",
    elevation2600: "२६०० मि.",
    elevation3100: "३१०० मि.",
    elevation3600: "३६०० मि.",
    elevation4257: "४२५७ मि.",
    landUseWaterbodies: "जलाशयहरू",
    landUseForest: "वन",
    landUseCultivation: "खेती",
    landUseBushes: "झाडी",
    landUseBuiltup: "निर्मित क्षेत्र",
    slope15: "१५ डिग्री",
    slope30: "३० डिग्री",
    slope45: "४५ डिग्री",
    slope60: "६० डिग्री",
    slope72: "७२ डिग्री",
  };

  return nepaliNames[subDivisionId] || subDivisionId;
}

export default Division;
