import React from "react";
import Checkbox from "./checkbox";
import useStore from "../../_store/app-store";

interface SubDivisionProps {
  subDivisionId: string;
  subDivisionName: string;
  isLast: boolean;
}

const SubDivision: React.FC<SubDivisionProps> = ({
  subDivisionId,
  subDivisionName,
  isLast,
}) => {
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

  const showAspectFlat = useStore((state) => state.showAspectFlat);
  const showAspectNorth = useStore((state) => state.showAspectNorth);
  const showAspectNorthEast = useStore((state) => state.showAspectNorthEast);
  const showAspectEast = useStore((state) => state.showAspectEast);
  const showAspectSouthEast = useStore((state) => state.showAspectSouthEast);
  const showAspectSouth = useStore((state) => state.showAspectSouth);
  const showAspectSouthWest = useStore((state) => state.showAspectSouthWest);
  const showAspectWest = useStore((state) => state.showAspectWest);
  const showAspectNorthWest = useStore((state) => state.showAspectNorthWest);

  const showElevation2100 = useStore((state) => state.showElevation2100);
  const showElevation2600 = useStore((state) => state.showElevation2600);
  const showElevation3100 = useStore((state) => state.showElevation3100);
  const showElevation3600 = useStore((state) => state.showElevation3600);
  const showElevation4257 = useStore((state) => state.showElevation4257);

  const showLandUseWaterbodies = useStore(
    (state) => state.showLandUseWaterbodies,
  );
  const showLandUseForest = useStore((state) => state.showLandUseForest);
  const showLandUseCultivation = useStore(
    (state) => state.showLandUseCultivation,
  );
  const showLandUseBushes = useStore((state) => state.showLandUseBushes);
  const showLandUseBuiltup = useStore((state) => state.showLandUseBuiltup);

  const showSlope15 = useStore((state) => state.showSlope15);
  const showSlope30 = useStore((state) => state.showSlope30);
  const showSlope45 = useStore((state) => state.showSlope45);
  const showSlope60 = useStore((state) => state.showSlope60);
  const showSlope72 = useStore((state) => state.showSlope72);

  const handleCheckboxChange = (checked: boolean) => {
    switch (subDivisionId) {
      case "aspectFlat":
        setShowAspectFlat(checked);
        break;
      case "aspectNorth":
        setShowAspectNorth(checked);
        break;
      case "aspectNorthEast":
        setShowAspectNorthEast(checked);
        break;
      case "aspectEast":
        setShowAspectEast(checked);
        break;
      case "aspectSouthEast":
        setShowAspectSouthEast(checked);
        break;
      case "aspectSouth":
        setShowAspectSouth(checked);
        break;
      case "aspectSouthWest":
        setShowAspectSouthWest(checked);
        break;
      case "aspectWest":
        setShowAspectWest(checked);
        break;
      case "aspectNorthWest":
        setShowAspectNorthWest(checked);
        break;
      case "elevation2100":
        setShowElevation2100(checked);
        break;
      case "elevation2600":
        setShowElevation2600(checked);
        break;
      case "elevation3100":
        setShowElevation3100(checked);
        break;
      case "elevation3600":
        setShowElevation3600(checked);
        break;
      case "elevation4257":
        setShowElevation4257(checked);
        break;
      case "landUseWaterbodies":
        setShowLandUseWaterbodies(checked);
        break;
      case "landUseForest":
        setShowLandUseForest(checked);
        break;
      case "landUseCultivation":
        setShowLandUseCultivation(checked);
        break;
      case "landUseBushes":
        setShowLandUseBushes(checked);
        break;
      case "landUseBuiltup":
        setShowLandUseBuiltup(checked);
        break;
      case "slope15":
        setShowSlope15(checked);
        break;
      case "slope30":
        setShowSlope30(checked);
        break;
      case "slope45":
        setShowSlope45(checked);
        break;
      case "slope60":
        setShowSlope60(checked);
        break;
      case "slope72":
        setShowSlope72(checked);
        break;
      default:
        break;
    }
  };

  const checked = React.useMemo(() => {
    switch (subDivisionId) {
      case "aspectFlat":
        return showAspectFlat;
      case "aspectNorth":
        return showAspectNorth;
      case "aspectNorthEast":
        return showAspectNorthEast;
      case "aspectEast":
        return showAspectEast;
      case "aspectSouthEast":
        return showAspectSouthEast;
      case "aspectSouth":
        return showAspectSouth;
      case "aspectSouthWest":
        return showAspectSouthWest;
      case "aspectWest":
        return showAspectWest;
      case "aspectNorthWest":
        return showAspectNorthWest;
      case "elevation2100":
        return showElevation2100;
      case "elevation2600":
        return showElevation2600;
      case "elevation3100":
        return showElevation3100;
      case "elevation3600":
        return showElevation3600;
      case "elevation4257":
        return showElevation4257;
      case "landUseWaterbodies":
        return showLandUseWaterbodies;
      case "landUseForest":
        return showLandUseForest;
      case "landUseCultivation":
        return showLandUseCultivation;
      case "landUseBushes":
        return showLandUseBushes;
      case "landUseBuiltup":
        return showLandUseBuiltup;
      case "slope15":
        return showSlope15;
      case "slope30":
        return showSlope30;
      case "slope45":
        return showSlope45;
      case "slope60":
        return showSlope60;
      case "slope72":
        return showSlope72;
      default:
        return false;
    }
  }, [
    showAspectFlat,
    showAspectNorth,
    showAspectNorthEast,
    showAspectEast,
    showAspectSouthEast,
    showAspectSouth,
    showAspectSouthWest,
    showAspectWest,
    showAspectNorthWest,
    showElevation2100,
    showElevation2600,
    showElevation3100,
    showElevation3600,
    showElevation4257,
    showLandUseWaterbodies,
    showLandUseForest,
    showLandUseCultivation,
    showLandUseBushes,
    showLandUseBuiltup,
    showSlope15,
    showSlope30,
    showSlope45,
    showSlope60,
    showSlope72,
    subDivisionId,
  ]);

  return (
    <div
      className={`px-5 py-2.5 flex items-center gap-4 group hover:bg-gradient-to-br 
      hover:from-gray-50 hover:to-transparent transition-all duration-200
      ${!isLast ? "border-b border-gray-100" : ""}`}
    >
      <Checkbox onChange={handleCheckboxChange} checked={checked} />
      <span
        className="text-[13px] font-medium text-gray-600 group-hover:text-gray-900 
      tracking-tight transition-colors"
      >
        {subDivisionName}
      </span>
    </div>
  );
};

export default SubDivision;
