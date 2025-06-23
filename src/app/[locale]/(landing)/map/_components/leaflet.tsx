"use client";
import React from "react";
import { MapContainer, TileLayer, GeoJSON, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { LatLngExpression } from "leaflet";
import L from "leaflet";
import useStore from "../../_store/app-store";
import dynamic from "next/dynamic";

// Add color constants
const COLORS = {
  municipalityBoundaries: "#FF5733",
  wardBoundaries: "#33FF57",
  aspect: {
    Flat: "#C0C0C0",
    North: "#4169E1",
    NorthEast: "#6495ED",
    East: "#98FB98",
    SouthEast: "#F0E68C",
    South: "#FF6B6B",
    SouthWest: "#FFA07A",
    West: "#DDA0DD",
    NorthWest: "#87CEEB",
  },
  elevation: {
    "2100": "#90EE90",
    "2600": "#7CCD7C",
    "3100": "#548B54",
    "3600": "#2E8B57",
    "4257": "#006400",
  },
  landUse: {
    Waterbodies: "#4169E1",
    Forest: "#228B22",
    Cultivation: "#DAA520",
    Bushes: "#556B2F",
    Builtup: "#8B4513",
  },
  slope: {
    "15": "#FFE4B5",
    "30": "#DEB887",
    "45": "#D2691E",
    "60": "#8B4513",
    "72": "#800000",
  },
};

// Add SVG icons
const icons = {
  health: L.divIcon({
    html: `<svg width="24" height="24" viewBox="0 0 24 24" fill="red">
      <path d="M3 3h18v18H3V3zm9 14v-4H8v-2h4V7h2v4h4v2h-4v4h-2z"/>
    </svg>`,
    className: "svg-icon",
    iconSize: [24, 24],
  }),
  school: L.divIcon({
    html: `<svg width="24" height="24" viewBox="0 0 24 24" fill="#4169E1">
      <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
    </svg>`,
    className: "svg-icon",
    iconSize: [24, 24],
  }),
  office: L.divIcon({
    html: `<svg width="24" height="24" viewBox="0 0 24 24" fill="#FFD700">
      <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2z"/>
    </svg>`,
    className: "svg-icon",
    iconSize: [24, 24],
  }),
  tourist: L.divIcon({
    html: `<svg width="24" height="24" viewBox="0 0 24 24" fill="#32CD32">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
    </svg>`,
    className: "svg-icon",
    iconSize: [24, 24],
  }),
  spring: L.divIcon({
    html: `<svg width="24" height="24" viewBox="0 0 24 24" fill="#00CED1">
      <circle cx="12" cy="12" r="8"/>
    </svg>`,
    className: "svg-icon",
    iconSize: [24, 24],
  }),
  village: L.divIcon({
    html: `<svg width="24" height="24" viewBox="0 0 24 24" fill="#8B4513">
      <path d="M12 3L4 9v12h16V9l-8-6z"/>
    </svg>`,
    className: "svg-icon",
    iconSize: [24, 24],
  }),
  infrastructure: L.divIcon({
    html: `<svg width="24" height="24" viewBox="0 0 24 24" fill="#808080">
      <path d="M12 2L8 6h3v6H8l4 4 4-4h-3V6h3L12 2zm-1 14v4h2v-4h-2z"/>
    </svg>`,
    className: "svg-icon",
    iconSize: [24, 24],
  }),
};

const Leaflet: React.FC = () => {
  const municipalityBoundaries = useStore(
    (state) => state.municipalityBoundaries,
  );
  const healthData = useStore((state) => state.health);
  const municipalityOffices = useStore((state) => state.municipalityOffices);
  const physicalInfrastructures = useStore(
    (state) => state.physicalInfrastructures,
  );
  const touristPlaces = useStore((state) => state.touristPlaces);
  const wardBoundaries = useStore((state) => state.wardBoundaries);
  const wardOffices = useStore((state) => state.wardOffices);
  const schools = useStore((state) => state.schools);
  const aspectFlat = useStore((state) =>
    state.aspects.find((aspect) => aspect.type_en === "Flat"),
  );
  const aspectNorth = useStore((state) => state.aspectNorth);
  const aspectNorthEast = useStore((state) => state.aspectNorthEast);
  const aspectNorthWest = useStore((state) => state.aspectNorthWest);
  const aspectWest = useStore((state) => state.aspectWest);
  const aspectSouthWest = useStore((state) => state.aspectSouthWest);
  const aspectSouth = useStore((state) => state.aspectSouth);
  const aspectSouthEast = useStore((state) => state.aspectSouthEast);
  const aspectEast = useStore((state) => state.aspectEast);

  const elevation2100 = useStore((state) => state.elevation2100);
  const elevation2600 = useStore((state) => state.elevation2600);
  const elevation3100 = useStore((state) => state.elevation3100);
  const elevation3600 = useStore((state) => state.elevation3600);
  const elevation4257 = useStore((state) => state.elevation4257);

  const highway = useStore((state) => state.highways);
  const landUseWaterbodies = useStore((state) => state.waterBodies);
  const landUseForest = useStore((state) => state.forest);
  const landUseCultivation = useStore((state) => state.cultivation);
  const landUseBushes = useStore((state) => state.bushes);
  const landUseBuiltup = useStore((state) =>
    state.landUses.find((landUse) => landUse.land_use_en === "Builtup"),
  );
  const slope15 = useStore((state) => state.slope15);
  const slope30 = useStore((state) => state.slope30);
  const slope45 = useStore((state) => state.slope45);
  const slope60 = useStore((state) => state.slope60);
  const slope72 = useStore((state) => state.slope72);

  const springs = useStore((state) => state.springs);
  const villages = useStore((state) => state.villages);
  const roads = useStore((state) => state.roads);

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
  const showSchools = useStore((state) => state.showSchools);
  const showTouristPlaces = useStore((state) => state.showTouristPlaces);
  const showWardBoundaries = useStore((state) => state.showWardBoundaries);
  const showWardOffices = useStore((state) => state.showWardOffices);
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
  const showHighways = useStore((state) => state.showHighway);
  const showLandUseWaterbodies = useStore(
    (state) => state.showLandUseWaterbodies,
  );
  const showLandUseForest = useStore((state) => state.showLandUseForest);
  const showLandUseCultivation = useStore(
    (state) => state.showLandUseCultivation,
  );
  const showLandUseBushes = useStore((state) => state.showLandUseBushes);
  const showLandUseBuiltup = useStore((state) => state.showLandUseBuiltup);
  const showRoads = useStore((state) => state.showRoads);
  const showSlope15 = useStore((state) => state.showSlope15);
  const showSlope30 = useStore((state) => state.showSlope30);
  const showSlope45 = useStore((state) => state.showSlope45);
  const showSlope60 = useStore((state) => state.showSlope60);
  const showSlope72 = useStore((state) => state.showSlope72);
  const showSprings = useStore((state) => state.showSprings);
  const showVillages = useStore((state) => state.showVillages);

  console.log(showWardBoundaries, wardBoundaries);

  const center: LatLngExpression = [27.585824952374573, 86.38607538043387];

  type AspectType = keyof typeof COLORS.aspect;
  type ElevationType = keyof typeof COLORS.elevation;
  type LandUseType = keyof typeof COLORS.landUse;
  type SlopeType = keyof typeof COLORS.slope;
  const getPolygonStyle = (type: string) => {
    let color;

    if (type in COLORS.aspect) color = COLORS.aspect[type as AspectType];
    else if (type in COLORS.elevation)
      color = COLORS.elevation[type as ElevationType];
    else if (type in COLORS.landUse)
      color = COLORS.landUse[type as LandUseType];
    else if (type in COLORS.slope) color = COLORS.slope[type as SlopeType];
    else if (type === "municipality") color = COLORS.municipalityBoundaries;
    else if (type === "ward") {
      color = COLORS.wardBoundaries;
      // Add random variation to the color
      const randomVariation = () => Math.floor(Math.random() * 50) - 25;
      const adjustColor = (color: string) => {
        const r = Math.min(
          255,
          Math.max(0, parseInt(color.slice(1, 3), 16) + randomVariation()),
        );
        const g = Math.min(
          255,
          Math.max(0, parseInt(color.slice(3, 5), 16) + randomVariation()),
        );
        const b = Math.min(
          255,
          Math.max(0, parseInt(color.slice(5, 7), 16) + randomVariation()),
        );
        return `#${r.toString(16).padStart(2, "0")}${g
          .toString(16)
          .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
      };

      if (color) {
        color = adjustColor(color);
      }
    }
    return {
      fillColor: color || "#808080",
      color: color || "#808080",
      weight: 2,
      opacity: 1,
      fillOpacity: 0.5,
    };
  };

  return (
    <MapContainer
      style={{ height: "100%", width: "100%" }}
      center={center}
      zoom={13}
      zoomControl={false}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {showMunicipalityBoundaries &&
        municipalityBoundaries?.map((boundary) => (
          <GeoJSON
            key={boundary.id}
            data={JSON.parse(boundary.geometry as unknown as string)}
            style={() => getPolygonStyle("municipality")}
          />
        ))}

      {showHealth &&
        healthData?.map((health) => (
          <GeoJSON
            key={health.id}
            data={JSON.parse(health.geometry as unknown as string)}
            pointToLayer={(feature, latlng) =>
              L.marker(latlng, { icon: icons.health })
            }
            onEachFeature={(feature, layer) => {
              layer.bindTooltip(health.name_ne || health.name_en, {
                permanent: true,
                direction: "auto",
                className: "health-label",
              });
            }}
          >
            <Popup>{health.name_ne || health.name_en}</Popup>
          </GeoJSON>
        ))}
      {showPhysicalInfrastructures &&
        physicalInfrastructures?.map((infrastructure) => (
          <GeoJSON
            key={infrastructure.id}
            data={JSON.parse(infrastructure.geometry as unknown as string)}
            pointToLayer={(feature, latlng) =>
              L.marker(latlng, { icon: icons.infrastructure })
            }
            onEachFeature={(feature, layer) => {
              layer.bindTooltip(
                infrastructure.name_ne || infrastructure.name_en,
                {
                  permanent: true,
                  direction: "auto",
                  className: "infrastructure-label",
                },
              );
            }}
          />
        ))}

      {showTouristPlaces &&
        touristPlaces?.map((place) => (
          <GeoJSON
            key={place.id}
            data={JSON.parse(place.geometry as unknown as string)}
            pointToLayer={(feature, latlng) =>
              L.marker(latlng, { icon: icons.tourist })
            }
            onEachFeature={(feature, layer) => {
              layer.bindTooltip(place.name_ne || place.name_en, {
                permanent: true,
                direction: "auto",
                className: "tourist-label",
              });
            }}
          >
            <Popup>{place.name_ne || place.name_en}</Popup>
          </GeoJSON>
        ))}
      {showWardBoundaries &&
        wardBoundaries?.map((boundary) => (
          <GeoJSON
            key={boundary.id}
            data={JSON.parse(boundary.geometry as unknown as string)}
            style={() => getPolygonStyle("ward")}
            onEachFeature={(feature, layer) => {
              layer.bindTooltip(boundary.name_ne || boundary.name_en, {
                permanent: true,
                direction: "center",
                className: "ward-label",
              });
            }}
          />
        ))}

      {showAspectFlat && aspectFlat && (
        <GeoJSON
          key={aspectFlat.id}
          data={JSON.parse(aspectFlat.geometry as unknown as string)}
          style={() => getPolygonStyle("Flat")}
        />
      )}
      {showAspectNorth && aspectNorth && (
        <GeoJSON
          key={aspectNorth.id}
          data={JSON.parse(aspectNorth.geometry as unknown as string)}
          style={() => getPolygonStyle("North")}
        />
      )}
      {showAspectNorthEast && aspectNorthEast && (
        <GeoJSON
          key={aspectNorthEast.id}
          data={JSON.parse(aspectNorthEast.geometry as unknown as string)}
          style={() => getPolygonStyle("NorthEast")}
        />
      )}
      {showAspectEast && aspectEast && (
        <GeoJSON
          key={aspectEast.id}
          data={JSON.parse(aspectEast.geometry as unknown as string)}
          style={() => getPolygonStyle("East")}
        />
      )}
      {showAspectSouthEast && aspectSouthEast && (
        <GeoJSON
          key={aspectSouthEast.id}
          data={JSON.parse(aspectSouthEast.geometry as unknown as string)}
          style={() => getPolygonStyle("SouthEast")}
        />
      )}
      {showAspectSouth && aspectSouth && (
        <GeoJSON
          key={aspectSouth.id}
          data={JSON.parse(aspectSouth.geometry as unknown as string)}
          style={() => getPolygonStyle("South")}
        />
      )}
      {showAspectSouthWest && aspectSouthWest && (
        <GeoJSON
          key={aspectSouthWest.id}
          data={JSON.parse(aspectSouthWest.geometry as unknown as string)}
          style={() => getPolygonStyle("SouthWest")}
        />
      )}
      {showAspectWest && aspectWest && (
        <GeoJSON
          key={aspectWest.id}
          data={JSON.parse(aspectWest.geometry as unknown as string)}
          style={() => getPolygonStyle("West")}
        />
      )}
      {showAspectNorthWest && aspectNorthWest && (
        <GeoJSON
          key={aspectNorthWest.id}
          data={JSON.parse(aspectNorthWest.geometry as unknown as string)}
          style={() => getPolygonStyle("NorthWest")}
        />
      )}
      {showElevation2100 && elevation2100 && (
        <GeoJSON
          key="elevation2100.id"
          data={JSON.parse(elevation2100.geometry as unknown as string)}
          style={() => getPolygonStyle("2100")}
        />
      )}
      {showElevation2600 && elevation2600 && (
        <GeoJSON
          key={elevation2600.id}
          data={JSON.parse(elevation2600.geometry as unknown as string)}
          style={() => getPolygonStyle("2600")}
        />
      )}
      {showElevation3100 && elevation3100 && (
        <GeoJSON
          key={elevation3100.id}
          data={JSON.parse(elevation3100.geometry as unknown as string)}
          style={() => getPolygonStyle("3100")}
        />
      )}
      {showElevation3600 && elevation3600 && (
        <GeoJSON
          key={elevation3600.id}
          data={JSON.parse(elevation3600.geometry as unknown as string)}
          style={() => getPolygonStyle("3600")}
        />
      )}
      {showElevation4257 && elevation4257 && (
        <GeoJSON
          key={elevation4257.id}
          data={JSON.parse(elevation4257.geometry as unknown as string)}
          style={() => getPolygonStyle("4257")}
        />
      )}
      {showHighways &&
        highway?.map((road) => (
          <GeoJSON
            key={road.id}
            data={JSON.parse(road.geometry as unknown as string)}
          />
        ))}
      {showLandUseWaterbodies && landUseWaterbodies && (
        <GeoJSON
          key={landUseWaterbodies.id}
          data={JSON.parse(landUseWaterbodies.geometry as unknown as string)}
          style={() => getPolygonStyle("Waterbodies")}
        />
      )}
      {showLandUseForest && landUseForest && (
        <GeoJSON
          key={landUseForest.id}
          data={JSON.parse(landUseForest.geometry as unknown as string)}
          style={() => getPolygonStyle("Forest")}
        />
      )}
      {showLandUseCultivation && landUseCultivation && (
        <GeoJSON
          key={landUseCultivation.id}
          data={JSON.parse(landUseCultivation.geometry as unknown as string)}
          style={() => getPolygonStyle("Cultivation")}
        />
      )}
      {showLandUseBushes && landUseBushes && (
        <GeoJSON
          key={landUseBushes.id}
          data={JSON.parse(landUseBushes.geometry as unknown as string)}
          style={() => getPolygonStyle("Bushes")}
        />
      )}
      {showLandUseBuiltup && landUseBuiltup && (
        <GeoJSON
          key={landUseBuiltup.id}
          data={JSON.parse(landUseBuiltup.geometry as unknown as string)}
          style={() => getPolygonStyle("Builtup")}
        />
      )}

      {showSlope15 && slope15 && (
        <GeoJSON
          key={slope15.id}
          data={JSON.parse(slope15.geometry as unknown as string)}
          style={() => getPolygonStyle("15")}
        />
      )}
      {showSlope30 && slope30 && (
        <GeoJSON
          key={slope30.id}
          data={JSON.parse(slope30.geometry as unknown as string)}
          style={() => getPolygonStyle("30")}
        />
      )}
      {showSlope45 && slope45 && (
        <GeoJSON
          key={slope45.id}
          data={JSON.parse(slope45.geometry as unknown as string)}
          style={() => getPolygonStyle("45")}
        />
      )}
      {showSlope60 && slope60 && (
        <GeoJSON
          key={slope60.id}
          data={JSON.parse(slope60.geometry as unknown as string)}
          style={() => getPolygonStyle("60")}
        />
      )}
      {showSlope72 && slope72 && (
        <GeoJSON
          key={slope72.id}
          data={JSON.parse(slope72.geometry as unknown as string)}
          style={() => getPolygonStyle("72")}
        />
      )}

      {showVillages &&
        villages?.map((village) => (
          <GeoJSON
            key={village.id}
            data={JSON.parse(village.geometry as unknown as string)}
            pointToLayer={(feature, latlng) =>
              L.marker(latlng, { icon: icons.village })
            }
            onEachFeature={(feature, layer) => {
              layer.bindTooltip(village.name_en, {
                permanent: true,
                direction: "auto",
                className: "village-label",
              });
            }}
          >
            <Popup>{village.name_en}</Popup>
          </GeoJSON>
        ))}
    </MapContainer>
  );
};

export default dynamic(() => Promise.resolve(Leaflet), { ssr: false });
