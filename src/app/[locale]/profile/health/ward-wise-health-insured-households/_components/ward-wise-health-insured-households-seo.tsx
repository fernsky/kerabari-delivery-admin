import Script from "next/script";
import { localizeNumber } from "@/lib/utils/localize-number";

interface WardWiseHealthInsuredHouseholdsSEOProps {
  healthInsuredData: any[];
  totalHouseholds: number;
  totalInsuredHouseholds: number;
  totalNonInsuredHouseholds: number;
  insuredPercentage: number;
  nonInsuredPercentage: number;
  bestInsuranceWard: {
    wardNumber: number;
    percentage: number;
  };
  worstInsuranceWard: {
    wardNumber: number;
    percentage: number;
  };
  wardInsuredPercentages: Array<{
    wardNumber: number;
    percentage: number;
  }>;
  insuranceCoverageIndex: number;
}

export default function WardWiseHealthInsuredHouseholdsSEO({
  healthInsuredData,
  totalHouseholds,
  totalInsuredHouseholds,
  totalNonInsuredHouseholds,
  insuredPercentage,
  nonInsuredPercentage,
  bestInsuranceWard,
  worstInsuranceWard,
  wardInsuredPercentages,
  insuranceCoverageIndex,
}: WardWiseHealthInsuredHouseholdsSEOProps) {
  // Create structured data for SEO
  const generateStructuredData = () => {
    // Convert ward-wise health insured households to structured data format
    const insuranceStats = wardInsuredPercentages.map((wardData) => {
      return {
        "@type": "Observation",
        name: `Health Insurance Statistics in Ward ${wardData.wardNumber} of Khajura Rural Municipality`,
        observationDate: new Date().toISOString().split("T")[0],
        measuredProperty: {
          "@type": "PropertyValue",
          name: "Health insurance rate",
          unitText: "percentage",
        },
        measuredValue: parseFloat(wardData.percentage.toFixed(2)),
        description: `In Ward ${wardData.wardNumber} of Khajura Rural Municipality, ${wardData.percentage.toFixed(2)}% of households have health insurance.`,
      };
    });

    return {
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: "Health Insurance Coverage in Khajura Rural Municipality (गढवा गाउँपालिका)",
      description: `Analysis of health insurance coverage across wards of Khajura Rural Municipality with a total of ${totalHouseholds.toLocaleString()} households. ${totalInsuredHouseholds.toLocaleString()} households (${insuredPercentage.toFixed(2)}%) have health insurance coverage. The highest coverage is in Ward ${bestInsuranceWard?.wardNumber || ""} with ${bestInsuranceWard?.percentage.toFixed(2) || ""}% insurance rate.`,
      keywords: [
        "Khajura Rural Municipality",
        "गढवा गाउँपालिका",
        "Health insurance",
        "स्वास्थ्य बीमा",
        "Ward-wise health insurance",
        "Health coverage",
        "Nepal health insurance",
        "Rural healthcare coverage",
        "Healthcare financing",
        "Health insurance rate",
        "Insurance coverage index",
      ],
      url: "https://digital.gadhawamun.gov.np/profile/health/ward-wise-health-insured-households",
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
          name: "Insured households",
          unitText: "households",
          value: totalInsuredHouseholds,
        },
        {
          "@type": "PropertyValue",
          name: "Non-insured households",
          unitText: "households",
          value: totalNonInsuredHouseholds,
        },
        {
          "@type": "PropertyValue",
          name: "Insurance coverage rate",
          unitText: "percentage",
          value: insuredPercentage,
        },
        {
          "@type": "PropertyValue",
          name: "Insurance Coverage Index",
          unitText: "index",
          value: insuranceCoverageIndex.toFixed(2),
        },
      ],
      observation: insuranceStats,
      about: [
        {
          "@type": "Thing",
          name: "Healthcare",
          description: "Health insurance coverage analysis",
        },
        {
          "@type": "Thing",
          name: "Health Insurance",
          description: "Status of households with health insurance",
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
        id="health-insured-households-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
    </>
  );
}
