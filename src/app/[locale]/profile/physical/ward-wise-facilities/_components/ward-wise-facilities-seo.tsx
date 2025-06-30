import Script from "next/script";
import { localizeNumber } from "@/lib/utils/localize-number";

interface WardWiseFacilitiesSEOProps {
  facilitiesData: any[];
  approximateUniqueHouseholds: number;
  facilityTypeTotals: Record<string, number>;
  facilityTypePercentages: Record<string, number>;
  bestDigitalWard: {
    wardNumber: number;
    score: number;
    internetPercentage: number;
    computerPercentage: number;
    mobilePercentage: number;
  };
  worstDigitalWard: {
    wardNumber: number;
    score: number;
    internetPercentage: number;
    computerPercentage: number;
    mobilePercentage: number;
  };
  FACILITY_CATEGORIES: Record<
    string,
    {
      name: string;
      nameEn: string;
      color: string;
    }
  >;
  wardNumbers: number[];
  digitalAccessIndex: number;
  categoryStats: Record<
    string,
    {
      total: number;
      percentage: number;
    }
  >;
}

export default function WardWiseFacilitiesSEO({
  facilitiesData,
  approximateUniqueHouseholds,
  facilityTypeTotals,
  facilityTypePercentages,
  bestDigitalWard,
  worstDigitalWard,
  FACILITY_CATEGORIES,
  wardNumbers,
  digitalAccessIndex,
  categoryStats,
}: WardWiseFacilitiesSEOProps) {
  // Create structured data for SEO
  const generateStructuredData = () => {
    // Convert ward-wise facilities to structured data format
    const facilityStats = wardNumbers
      .map((wardNumber) => {
        const wardData = facilitiesData.filter(
          (item) => item.wardNumber === wardNumber,
        );

        if (!wardData?.length) return null;

        // Find the mobile phone data for this ward as proxy for total households
        const mobilePhoneItem = wardData.find(
          (item) => item.facility === "MOBILE_PHONE",
        );
        const maxHouseholdsItem = wardData.reduce(
          (max, item) => (item.households > max.households ? item : max),
          { households: 0 },
        );
        const totalWardHouseholds = mobilePhoneItem
          ? mobilePhoneItem.households
          : maxHouseholdsItem.households;

        // Calculate internet access percentage for this ward
        const internetItem = wardData.find(
          (item) => item.facility === "INTERNET",
        );
        const internetPercentage =
          internetItem && totalWardHouseholds > 0
            ? ((internetItem.households / totalWardHouseholds) * 100).toFixed(2)
            : "0";

        return {
          "@type": "Observation",
          name: `Household Facilities Statistics in Ward ${wardNumber} of Khajura Rural Municipality`,
          observationDate: new Date().toISOString().split("T")[0],
          measuredProperty: {
            "@type": "PropertyValue",
            name: "Internet access rate",
            unitText: "percentage",
          },
          measuredValue: parseFloat(internetPercentage),
          description: `In Ward ${wardNumber} of Khajura Rural Municipality, ${internetItem?.households || 0} households (${internetPercentage}%) have internet access out of approximately ${totalWardHouseholds} households.`,
        };
      })
      .filter(Boolean);

    // Calculate key metrics
    const internetPercentage =
      facilityTypePercentages.INTERNET?.toFixed(2) || "0.00";
    const mobilePercentage =
      facilityTypePercentages.MOBILE_PHONE?.toFixed(2) || "0.00";
    const computerPercentage =
      facilityTypePercentages.COMPUTER?.toFixed(2) || "0.00";
    const televisionPercentage =
      facilityTypePercentages.TELEVISION?.toFixed(2) || "0.00";

    return {
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: "Household Facilities Usage in Khajura Rural Municipality (केराबारी गाउँपालिका)",
      description: `Analysis of household facilities usage across ${wardNumbers.length} wards of Khajura Rural Municipality with approximately ${approximateUniqueHouseholds.toLocaleString()} households. ${facilityTypeTotals.MOBILE_PHONE?.toLocaleString() || 0} households (${mobilePercentage}%) have mobile phones, ${facilityTypeTotals.INTERNET?.toLocaleString() || 0} households (${internetPercentage}%) have internet access. The best digital access is in Ward ${bestDigitalWard?.wardNumber || ""} with ${bestDigitalWard?.score.toFixed(2) || ""}% digital access score.`,
      keywords: [
        "Khajura Rural Municipality",
        "केराबारी गाउँपालिका",
        "Household facilities",
        "Mobile phone access",
        "Internet access",
        "Television usage",
        "Computer usage",
        "Ward-wise facilities",
        "Digital access",
        "Nepal household facilities",
        "Rural development",
        "Domestic appliances",
      ],
      url: "https://digital.buddhashantimun.gov.np/profile/physical/ward-wise-facilities",
      creator: {
        "@type": "Organization",
        name: "Khajura Rural Municipality",
        url: "https://digital.buddhashantimun.gov.np",
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
          name: "Mobile phone usage",
          unitText: "households",
          value: facilityTypeTotals.MOBILE_PHONE || 0,
        },
        {
          "@type": "PropertyValue",
          name: "Internet access",
          unitText: "households",
          value: facilityTypeTotals.INTERNET || 0,
        },
        {
          "@type": "PropertyValue",
          name: "Television ownership",
          unitText: "households",
          value: facilityTypeTotals.TELEVISION || 0,
        },
        {
          "@type": "PropertyValue",
          name: "Computer/laptop usage",
          unitText: "households",
          value: facilityTypeTotals.COMPUTER || 0,
        },
        {
          "@type": "PropertyValue",
          name: "Digital Access Index",
          unitText: "index",
          value: digitalAccessIndex.toFixed(2),
        },
        {
          "@type": "PropertyValue",
          name: "Mobile Phone Access Rate",
          unitText: "percentage",
          value: parseFloat(mobilePercentage),
        },
        {
          "@type": "PropertyValue",
          name: "Internet Access Rate",
          unitText: "percentage",
          value: parseFloat(internetPercentage),
        },
      ],
      observation: facilityStats,
      about: [
        {
          "@type": "Thing",
          name: "Household Facilities",
          description:
            "Types of facilities and appliances available in households",
        },
        {
          "@type": "Thing",
          name: "Digital Access",
          description:
            "Access to digital technologies like internet, computers and mobile phones",
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
        id="facilities-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
    </>
  );
}
