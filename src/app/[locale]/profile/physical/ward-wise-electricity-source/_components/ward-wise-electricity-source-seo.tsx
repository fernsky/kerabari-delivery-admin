import Script from "next/script";
import { localizeNumber } from "@/lib/utils/localize-number";

interface WardWiseElectricitySourceSEOProps {
  electricitySourceData: any[];
  totalHouseholds: number;
  sourceTypeTotals: Record<string, number>;
  sourceTypePercentages: Record<string, number>;
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
  ELECTRICITY_SOURCE_CATEGORIES: Record<
    string,
    {
      name: string;
      nameEn: string;
      color: string;
    }
  >;
  wardNumbers: number[];
  electricityAccessIndex: number;
  modernSourcePercentage: number;
}

export default function WardWiseElectricitySourceSEO({
  electricitySourceData,
  totalHouseholds,
  sourceTypeTotals,
  sourceTypePercentages,
  bestWard,
  worstWard,
  ELECTRICITY_SOURCE_CATEGORIES,
  wardNumbers,
  electricityAccessIndex,
  modernSourcePercentage,
}: WardWiseElectricitySourceSEOProps) {
  // Create structured data for SEO
  const generateStructuredData = () => {
    // Convert ward-wise electricity source to structured data format
    const sourceStats = wardNumbers
      .map((wardNumber) => {
        const wardData = electricitySourceData.filter(
          (item) => item.wardNumber === wardNumber,
        );

        if (!wardData?.length) return null;

        const totalWardHouseholds = wardData.reduce(
          (sum, item) => sum + item.households,
          0,
        );

        // Calculate modern electricity sources (Grid, Solar) percentage for this ward
        const modernSourceTypes = ["ELECTRICITY", "SOLAR"];
        const modernSourceHouseholds = wardData
          .filter((item) => modernSourceTypes.includes(item.electricitySource))
          .reduce((sum, item) => sum + item.households, 0);

        const modernSourcePercent =
          totalWardHouseholds > 0
            ? ((modernSourceHouseholds / totalWardHouseholds) * 100).toFixed(2)
            : "0";

        return {
          "@type": "Observation",
          name: `Electricity Source Usage Statistics in Ward ${wardNumber} of Khajura Rural Municipality`,
          observationDate: new Date().toISOString().split("T")[0],
          measuredProperty: {
            "@type": "PropertyValue",
            name: "Modern electricity source usage rate",
            unitText: "percentage",
          },
          measuredValue: parseFloat(modernSourcePercent),
          description: `In Ward ${wardNumber} of Khajura Rural Municipality, ${modernSourceHouseholds.toLocaleString()} households (${modernSourcePercent}%) use modern electricity sources (Grid, Solar) out of a total of ${totalWardHouseholds.toLocaleString()} households.`,
        };
      })
      .filter(Boolean);

    // Calculate modern electricity source percentage
    const modernSources = ["ELECTRICITY", "SOLAR"];
    const modernSourceTotal = modernSources.reduce(
      (sum, source) => sum + (sourceTypeTotals[source] || 0),
      0,
    );
    const modernSourcePercentageValue = (
      (modernSourceTotal / totalHouseholds) *
      100
    ).toFixed(2);

    return {
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: "Electricity Source Usage in Khajura Rural Municipality (गढवा गाउँपालिका)",
      description: `Analysis of electricity source usage across ${wardNumbers.length} wards of Khajura Rural Municipality with a total of ${totalHouseholds.toLocaleString()} households. ${modernSourceTotal.toLocaleString()} households (${modernSourcePercentageValue}%) use modern electricity sources. The best adoption of modern sources is in Ward ${bestWard?.wardNumber || ""} with ${bestWard?.percentage.toFixed(2) || ""}% modern electricity source usage rate.`,
      keywords: [
        "Khajura Rural Municipality",
        "गढवा गाउँपालिका",
        "Electricity source",
        "Grid electricity",
        "Solar power",
        "Ward-wise electricity usage",
        "Kerosene usage",
        "Biogas usage",
        "Rural energy access",
        "Nepal electricity access",
        "Energy transition",
        "Rural electrification",
      ],
      url: "https://digital.gadhawamun.gov.np/profile/physical/ward-wise-electricity-source",
      creator: {
        "@type": "Organization",
        name: "Khajura Rural Municipality",
        url: "https://digital.gadhawamun.gov.np",
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
          name: "Grid Electricity usage",
          unitText: "households",
          value: sourceTypeTotals.ELECTRICITY || 0,
        },
        {
          "@type": "PropertyValue",
          name: "Solar Power usage",
          unitText: "households",
          value: sourceTypeTotals.SOLAR || 0,
        },
        {
          "@type": "PropertyValue",
          name: "Biogas usage",
          unitText: "households",
          value: sourceTypeTotals.BIOGAS || 0,
        },
        {
          "@type": "PropertyValue",
          name: "Kerosene usage",
          unitText: "households",
          value: sourceTypeTotals.KEROSENE || 0,
        },
        {
          "@type": "PropertyValue",
          name: "Other sources usage",
          unitText: "households",
          value: sourceTypeTotals.OTHER || 0,
        },
        {
          "@type": "PropertyValue",
          name: "Modern Electricity Source Usage Rate",
          unitText: "percentage",
          value: parseFloat(modernSourcePercentageValue),
        },
        {
          "@type": "PropertyValue",
          name: "Electricity Access Index",
          unitText: "index",
          value: electricityAccessIndex.toFixed(2),
        },
      ],
      observation: sourceStats,
      about: [
        {
          "@type": "Thing",
          name: "Electricity Source",
          description: "Types of electricity sources used in households",
        },
        {
          "@type": "Thing",
          name: "Energy Access",
          description:
            "Household access to different types of electricity sources",
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
        id="electricity-source-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
    </>
  );
}
