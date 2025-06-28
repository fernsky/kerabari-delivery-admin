import Script from "next/script";
import { localizeNumber } from "@/lib/utils/localize-number";

interface WardWiseTimeToHealthOrganizationSEOProps {
  timeToHealthOrganizationData: any[];
  totalHouseholds: number;
  timeCategoryTotals: Record<string, number>;
  timeCategoryPercentages: Record<string, number>;
  bestAccessWard: {
    wardNumber: number;
    percentage: number;
  };
  worstAccessWard: {
    wardNumber: number;
    percentage: number;
  };
  TIME_CATEGORIES: Record<
    string,
    {
      name: string;
      nameEn: string;
      color: string;
    }
  >;
  wardNumbers: number[];
  accessibilityIndex: number;
}

export default function WardWiseTimeToHealthOrganizationSEO({
  timeToHealthOrganizationData,
  totalHouseholds,
  timeCategoryTotals,
  timeCategoryPercentages,
  bestAccessWard,
  worstAccessWard,
  TIME_CATEGORIES,
  wardNumbers,
  accessibilityIndex,
}: WardWiseTimeToHealthOrganizationSEOProps) {
  // Create structured data for SEO
  const generateStructuredData = () => {
    // Convert ward-wise time to health organization to structured data format
    const accessStats = wardNumbers
      .map((wardNumber) => {
        const wardData = timeToHealthOrganizationData.filter(
          (item) => item.wardNumber === wardNumber,
        );

        if (!wardData?.length) return null;

        const totalWardHouseholds = wardData.reduce(
          (sum, item) => sum + item.households,
          0,
        );

        // Calculate quick access (under 30 min) percentage for this ward
        const quickAccessCategories = ["UNDER_15_MIN", "UNDER_30_MIN"];
        const quickAccessHouseholds = wardData
          .filter((item) =>
            quickAccessCategories.includes(item.timeToHealthOrganization),
          )
          .reduce((sum, item) => sum + item.households, 0);

        const quickAccessPercent =
          totalWardHouseholds > 0
            ? ((quickAccessHouseholds / totalWardHouseholds) * 100).toFixed(2)
            : "0";

        return {
          "@type": "Observation",
          name: `Health Facility Access Statistics in Ward ${wardNumber} of Khajura Rural Municipality`,
          observationDate: new Date().toISOString().split("T")[0],
          measuredProperty: {
            "@type": "PropertyValue",
            name: "Quick access rate (under 30 minutes)",
            unitText: "percentage",
          },
          measuredValue: parseFloat(quickAccessPercent),
          description: `In Ward ${wardNumber} of Khajura Rural Municipality, ${quickAccessHouseholds.toLocaleString()} households (${quickAccessPercent}%) can access a health facility within 30 minutes out of a total of ${totalWardHouseholds.toLocaleString()} households.`,
        };
      })
      .filter(Boolean);

    // Calculate quick access percentage (under 30 min)
    const quickAccessTotal =
      timeCategoryTotals.UNDER_15_MIN + timeCategoryTotals.UNDER_30_MIN;
    const quickAccessPercentage = (
      (quickAccessTotal / totalHouseholds) *
      100
    ).toFixed(2);

    return {
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: "Time to Health Organization in Khajura Rural Municipality (बुद्धशान्ति गाउँपालिका)",
      description: `Analysis of time taken to reach health organizations across ${wardNumbers.length} wards of Khajura Rural Municipality with a total of ${totalHouseholds.toLocaleString()} households. ${quickAccessTotal.toLocaleString()} households (${quickAccessPercentage}%) can reach a health facility within 30 minutes. The best accessibility is in Ward ${bestAccessWard?.wardNumber || ""} with ${bestAccessWard?.percentage.toFixed(2) || ""}% quick access rate.`,
      keywords: [
        "Khajura Rural Municipality",
        "बुद्धशान्ति गाउँपालिका",
        "Health facility access",
        "Healthcare accessibility",
        "Ward-wise health access",
        "Rural healthcare",
        "Nepal healthcare",
        "Time to health organization",
        "Healthcare travel time",
        "Health facility distance",
        "Healthcare proximity",
        "Healthcare access index",
      ],
      url: "https://digital.buddhashantimun.gov.np/profile/health/ward-wise-time-to-health-organization",
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
          name: "Under 15 minutes access",
          unitText: "households",
          value: timeCategoryTotals.UNDER_15_MIN,
        },
        {
          "@type": "PropertyValue",
          name: "Under 30 minutes access",
          unitText: "households",
          value: timeCategoryTotals.UNDER_30_MIN,
        },
        {
          "@type": "PropertyValue",
          name: "Under 1 hour access",
          unitText: "households",
          value: timeCategoryTotals.UNDER_1_HOUR,
        },
        {
          "@type": "PropertyValue",
          name: "Over 1 hour access",
          unitText: "households",
          value: timeCategoryTotals["1_HOUR_OR_MORE"],
        },
        {
          "@type": "PropertyValue",
          name: "Quick Access Rate (under 30 minutes)",
          unitText: "percentage",
          value: parseFloat(quickAccessPercentage),
        },
        {
          "@type": "PropertyValue",
          name: "Health Accessibility Index",
          unitText: "index",
          value: accessibilityIndex.toFixed(2),
        },
      ],
      observation: accessStats,
      about: [
        {
          "@type": "Thing",
          name: "Healthcare",
          description: "Time to reach health organizations analysis",
        },
        {
          "@type": "Thing",
          name: "Health Facility Access",
          description:
            "Time it takes for households to reach health facilities",
        },
      ],
      isBasedOn: {
        "@type": "GovernmentService",
        name: "Municipality Health Survey",
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
        id="time-to-health-organization-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
    </>
  );
}
