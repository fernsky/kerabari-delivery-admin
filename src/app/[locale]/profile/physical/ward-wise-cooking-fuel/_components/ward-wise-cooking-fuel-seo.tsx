import Script from "next/script";
import { localizeNumber } from "@/lib/utils/localize-number";

interface WardWiseCookingFuelSEOProps {
  cookingFuelData: any[];
  totalHouseholds: number;
  fuelTypeTotals: Record<string, number>;
  fuelTypePercentages: Record<string, number>;
  bestWard: {
    wardNumber: number;
    percentage: number;
    households: number;
  };
  worstWard: {
    wardNumber: number;
    percentage: number;
    households: number;
  };
  COOKING_FUEL_CATEGORIES: Record<
    string,
    {
      name: string;
      nameEn: string;
      color: string;
    }
  >;
  wardNumbers: number[];
  cleanFuelIndex: number;
  cleanFuelPercentage: number;
}

export default function WardWiseCookingFuelSEO({
  cookingFuelData,
  totalHouseholds,
  fuelTypeTotals,
  fuelTypePercentages,
  bestWard,
  worstWard,
  COOKING_FUEL_CATEGORIES,
  wardNumbers,
  cleanFuelIndex,
  cleanFuelPercentage,
}: WardWiseCookingFuelSEOProps) {
  // Create structured data for SEO
  const generateStructuredData = () => {
    // Convert ward-wise cooking fuel to structured data format
    const fuelStats = wardNumbers
      .map((wardNumber) => {
        const wardData = cookingFuelData.filter(
          (item) => item.wardNumber === wardNumber,
        );

        if (!wardData?.length) return null;

        const totalWardHouseholds = wardData.reduce(
          (sum, item) => sum + item.households,
          0,
        );

        // Calculate clean fuel (LP Gas, Electricity, Biogas) percentage for this ward
        const cleanFuelTypes = ["LP_GAS", "ELECTRICITY", "BIOGAS"];
        const cleanFuelHouseholds = wardData
          .filter((item) => cleanFuelTypes.includes(item.cookingFuel))
          .reduce((sum, item) => sum + item.households, 0);

        const cleanFuelPercent =
          totalWardHouseholds > 0
            ? ((cleanFuelHouseholds / totalWardHouseholds) * 100).toFixed(2)
            : "0";

        return {
          "@type": "Observation",
          name: `Cooking Fuel Usage Statistics in Ward ${wardNumber} of Khajura Rural Municipality`,
          observationDate: new Date().toISOString().split("T")[0],
          measuredProperty: {
            "@type": "PropertyValue",
            name: "Clean fuel usage rate",
            unitText: "percentage",
          },
          measuredValue: parseFloat(cleanFuelPercent),
          description: `In Ward ${wardNumber} of Khajura Rural Municipality, ${cleanFuelHouseholds.toLocaleString()} households (${cleanFuelPercent}%) use clean cooking fuels (LP Gas, Electricity, Biogas) out of a total of ${totalWardHouseholds.toLocaleString()} households.`,
        };
      })
      .filter(Boolean);

    // Calculate clean fuel percentage
    const cleanFuels = ["LP_GAS", "ELECTRICITY", "BIOGAS"];
    const cleanFuelTotal = cleanFuels.reduce(
      (sum, fuel) => sum + (fuelTypeTotals[fuel] || 0),
      0,
    );
    const cleanFuelPercentageValue = (
      (cleanFuelTotal / totalHouseholds) *
      100
    ).toFixed(2);

    return {
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: "Cooking Fuel Usage in Khajura Rural Municipality (गढवा गाउँपालिका)",
      description: `Analysis of cooking fuel usage across ${wardNumbers.length} wards of Khajura Rural Municipality with a total of ${totalHouseholds.toLocaleString()} households. ${cleanFuelTotal.toLocaleString()} households (${cleanFuelPercentageValue}%) use clean cooking fuels. The best adoption of clean fuel is in Ward ${bestWard?.wardNumber || ""} with ${bestWard?.percentage.toFixed(2) || ""}% clean fuel usage rate.`,
      keywords: [
        "Khajura Rural Municipality",
        "गढवा गाउँपालिका",
        "Cooking fuel",
        "Clean energy",
        "Ward-wise energy usage",
        "LPG usage",
        "Firewood usage",
        "Biogas usage",
        "Rural energy access",
        "Nepal cooking fuel",
        "Energy transition",
        "Indoor air pollution",
      ],
      url: "https://digital.khajuramun.gov.np/profile/physical/ward-wise-cooking-fuel",
      creator: {
        "@type": "Organization",
        name: "Khajura Rural Municipality",
        url: "https://digital.khajuramun.gov.np",
      },
      temporalCoverage: "2021/2023",
      spatialCoverage: {
        "@type": "Place",
        name: "Khajura Rural Municipality, Banke, Nepal",
        geo: {
          "@type": "GeoCoordinates",
          latitude: "28.1356",
          longitude: "81.6314",
        },
      },
      variableMeasured: [
        {
          "@type": "PropertyValue",
          name: "LP Gas usage",
          unitText: "households",
          value: fuelTypeTotals.LP_GAS || 0,
        },
        {
          "@type": "PropertyValue",
          name: "Firewood usage",
          unitText: "households",
          value: fuelTypeTotals.WOOD || 0,
        },
        {
          "@type": "PropertyValue",
          name: "Biogas usage",
          unitText: "households",
          value: fuelTypeTotals.BIOGAS || 0,
        },
        {
          "@type": "PropertyValue",
          name: "Electricity usage",
          unitText: "households",
          value: fuelTypeTotals.ELECTRICITY || 0,
        },
        {
          "@type": "PropertyValue",
          name: "Kerosene usage",
          unitText: "households",
          value: fuelTypeTotals.KEROSENE || 0,
        },
        {
          "@type": "PropertyValue",
          name: "Dung cake usage",
          unitText: "households",
          value: fuelTypeTotals.DUNGCAKE || 0,
        },
        {
          "@type": "PropertyValue",
          name: "Clean Fuel Usage Rate",
          unitText: "percentage",
          value: parseFloat(cleanFuelPercentageValue),
        },
        {
          "@type": "PropertyValue",
          name: "Clean Fuel Index",
          unitText: "index",
          value: cleanFuelIndex.toFixed(2),
        },
      ],
      observation: fuelStats,
      about: [
        {
          "@type": "Thing",
          name: "Cooking Fuel",
          description: "Types of fuels used for cooking",
        },
        {
          "@type": "Thing",
          name: "Energy Access",
          description: "Household access to different types of cooking fuels",
        },
      ],
      isBasedOn: {
        "@type": "GovernmentService",
        name: "Municipality Household Survey",
        provider: {
          "@type": "GovernmentOrganization",
          name: "Khajura Rural Municipality",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Khajura",
            addressRegion: "Banke",
            addressCountry: "Nepal",
          },
        },
      },
    };
  };

  const structuredData = generateStructuredData();

  return (
    <>
      <Script
        id="cooking-fuel-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
    </>
  );
}
