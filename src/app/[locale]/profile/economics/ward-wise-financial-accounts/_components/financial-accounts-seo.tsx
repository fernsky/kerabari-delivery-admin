import Script from "next/script";
import { localizeNumber } from "@/lib/utils/localize-number";

interface FinancialAccountsSEOProps {
  financialAccountsData: any[];
  totalHouseholds: number;
  bankTotal: number;
  financeTotal: number;
  microfinanceTotal: number;
  cooperativeTotal: number;
  noAccountTotal: number;
  bankPercentage: number;
  financePercentage: number;
  microfinancePercentage: number;
  cooperativePercentage: number;
  noAccountPercentage: number;
  bestInclusionWard: any;
  worstInclusionWard: any;
  FINANCIAL_ACCOUNT_TYPES: {
    BANK: { name: string; nameEn: string; color: string };
    FINANCE: { name: string; nameEn: string; color: string };
    MICRO_FINANCE: { name: string; nameEn: string; color: string };
    COOPERATIVE: { name: string; nameEn: string; color: string };
    NONE: { name: string; nameEn: string; color: string };
  };
  wardNumbers: number[];
}

export default function FinancialAccountsSEO({
  financialAccountsData,
  totalHouseholds,
  bankTotal,
  financeTotal,
  microfinanceTotal,
  cooperativeTotal,
  noAccountTotal,
  bankPercentage,
  financePercentage,
  microfinancePercentage,
  cooperativePercentage,
  noAccountPercentage,
  bestInclusionWard,
  worstInclusionWard,
  FINANCIAL_ACCOUNT_TYPES,
  wardNumbers,
}: FinancialAccountsSEOProps) {
  // Create structured data for SEO
  const generateStructuredData = () => {
    // Convert ward-wise financial accounts stats to structured data format
    const financialAccountStats = wardNumbers
      .map((wardNumber) => {
        const wardData = financialAccountsData.filter(
          (item) => item.wardNumber === wardNumber,
        );

        if (!wardData?.length) return null;

        const totalWardHouseholds = wardData.reduce(
          (sum, item) => sum + item.households,
          0,
        );
        const bankAccount =
          wardData.find((item) => item.financialAccountType === "BANK")
            ?.households || 0;
        const bankAccountPercent =
          totalWardHouseholds > 0
            ? ((bankAccount / totalWardHouseholds) * 100).toFixed(2)
            : "0";

        return {
          "@type": "Observation",
          name: `Financial Account Statistics in Ward ${wardNumber} of Khajura Rural Municipality`,
          observationDate: new Date().toISOString().split("T")[0],
          measuredProperty: {
            "@type": "PropertyValue",
            name: "Bank account ownership rate",
            unitText: "percentage",
          },
          measuredValue: parseFloat(bankAccountPercent),
          description: `In Ward ${wardNumber} of Khajura Rural Municipality, ${bankAccount.toLocaleString()} households (${bankAccountPercent}%) have bank accounts out of a total of ${totalWardHouseholds.toLocaleString()} households.`,
        };
      })
      .filter(Boolean);

    // Calculate financial inclusion (anything other than no account)
    const financialInclusionRate = (100 - noAccountPercentage).toFixed(2);

    // Calculate financial inclusion index (0-100)
    const financialInclusionIndex =
      (bankPercentage * 1.0 +
        financePercentage * 0.9 +
        cooperativePercentage * 0.8 +
        microfinancePercentage * 0.7 +
        noAccountPercentage * 0.0) /
      100;

    return {
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: "Financial Account Distribution in Khajura Rural Municipality (गढवा गाउँपालिका)",
      description: `Analysis of financial accounts across ${wardNumbers.length} wards of Khajura Rural Municipality with a total of ${totalHouseholds.toLocaleString()} households. ${bankTotal.toLocaleString()} households (${bankPercentage.toFixed(2)}%) have bank accounts, while ${noAccountTotal.toLocaleString()} households (${noAccountPercentage.toFixed(2)}%) have no financial accounts. The best financial inclusion is in Ward ${bestInclusionWard?.wardNumber || ""} with ${bestInclusionWard?.accountPercent.toFixed(2) || ""}% of households having financial accounts.`,
      keywords: [
        "Khajura Rural Municipality",
        "गढवा गाउँपालिका",
        "Financial accounts",
        "Bank accounts",
        "Financial inclusion",
        "Ward-wise financial accounts",
        "Rural banking",
        "Nepal financial inclusion",
        "Financial account distribution",
        "Bank account ownership",
        "Financial services",
        "Financial inclusion index",
      ],
      url: "https://digital.khajuramun.gov.np/profile/economics/ward-wise-financial-accounts",
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
          name: "Households with bank accounts",
          unitText: "households",
          value: bankTotal,
        },
        {
          "@type": "PropertyValue",
          name: "Households with finance company accounts",
          unitText: "households",
          value: financeTotal,
        },
        {
          "@type": "PropertyValue",
          name: "Households with microfinance accounts",
          unitText: "households",
          value: microfinanceTotal,
        },
        {
          "@type": "PropertyValue",
          name: "Households with cooperative accounts",
          unitText: "households",
          value: cooperativeTotal,
        },
        {
          "@type": "PropertyValue",
          name: "Households without financial accounts",
          unitText: "households",
          value: noAccountTotal,
        },
        {
          "@type": "PropertyValue",
          name: "Financial Inclusion Rate",
          unitText: "percentage",
          value: parseFloat(financialInclusionRate),
        },
        {
          "@type": "PropertyValue",
          name: "Financial Inclusion Index",
          unitText: "index",
          value: financialInclusionIndex.toFixed(2),
        },
      ],
      observation: financialAccountStats,
      about: [
        {
          "@type": "Thing",
          name: "Financial Inclusion",
          description:
            "Access to affordable financial products and services that meet needs of households and businesses",
        },
        {
          "@type": "Thing",
          name: "Financial Accounts",
          description:
            "Savings, checking or other types of financial accounts held by households at different financial institutions",
        },
      ],
      isBasedOn: {
        "@type": "GovernmentService",
        name: "Municipality Financial Accounts Survey",
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
        id="financial-accounts-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
    </>
  );
}
