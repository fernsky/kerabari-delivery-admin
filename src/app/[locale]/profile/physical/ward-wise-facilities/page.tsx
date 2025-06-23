import { Metadata } from "next";
import { DocsLayout } from "@/components/layout/DocsLayout";
import { TableOfContents } from "@/components/TableOfContents";
import Image from "next/image";
import { api } from "@/trpc/server";
import { localizeNumber } from "@/lib/utils/localize-number";
import WardWiseFacilitiesCharts from "./_components/ward-wise-facilities-charts";
import WardWiseFacilitiesAnalysisSection from "./_components/ward-wise-facilities-analysis-section";
import WardWiseFacilitiesSEO from "./_components/ward-wise-facilities-seo";
import { facilityOptions } from "@/server/api/routers/profile/physical/ward-wise-facilities.schema";

// Facility categories with display names and colors
const FACILITY_CATEGORIES = {
  RADIO: {
    name: "रेडियो",
    nameEn: "Radio",
    color: "#1E88E5", // Blue
  },
  TELEVISION: {
    name: "टेलिभिजन",
    nameEn: "Television",
    color: "#F44336", // Red
  },
  COMPUTER: {
    name: "कम्प्युटर/ल्यापटप",
    nameEn: "Computer/Laptop",
    color: "#8E24AA", // Purple
  },
  INTERNET: {
    name: "इन्टरनेट सुविधा",
    nameEn: "Internet service",
    color: "#43A047", // Green
  },
  MOBILE_PHONE: {
    name: "मोबाइल फोन",
    nameEn: "Mobile phone",
    color: "#FB8C00", // Orange
  },
  CAR_JEEP: {
    name: "कार/जीप/भ्यान",
    nameEn: "Car/Jeep/Van",
    color: "#3949AB", // Indigo
  },
  MOTORCYCLE: {
    name: "मोटरसाइकल/स्कुटर",
    nameEn: "Motorcycle/Scooter",
    color: "#D81B60", // Pink
  },
  BICYCLE: {
    name: "साइकल",
    nameEn: "Bicycle",
    color: "#546E7A", // Blue Grey
  },
  REFRIGERATOR: {
    name: "रेफ्रिजेरेटर/फ्रिज",
    nameEn: "Refrigerator",
    color: "#00ACC1", // Cyan
  },
  WASHING_MACHINE: {
    name: "वासिङ मेसिन",
    nameEn: "Washing machine",
    color: "#7CB342", // Light Green
  },
  AIR_CONDITIONER: {
    name: "एयर कन्डिसनर",
    nameEn: "Air conditioner",
    color: "#FFC107", // Amber
  },
  ELECTRICAL_FAN: {
    name: "विद्युतीय पंखा",
    nameEn: "Electrical fan",
    color: "#5E35B1", // Deep Purple
  },
  MICROWAVE_OVEN: {
    name: "माइक्रोवेभ ओभन",
    nameEn: "Microwave oven",
    color: "#C0CA33", // Lime
  },
  DAILY_NATIONAL_NEWSPAPER_ACCESS: {
    name: "राष्ट्रिय दैनिक पत्रिकाको पहुँच",
    nameEn: "Daily national newspaper access",
    color: "#009688", // Teal
  },
  NONE: {
    name: "कुनै पनि नभएको",
    nameEn: "None",
    color: "#757575", // Grey
  },
};

// Force dynamic rendering since we're using tRPC which relies on headers
export const dynamic = "force-dynamic";

// Define the locales for which this page should be statically generated
export async function generateStaticParams() {
  return [{ locale: "en" }];
}

// Optional: Add revalidation period
export const revalidate = 86400; // Revalidate once per day

// Generate metadata dynamically based on data
export async function generateMetadata(): Promise<Metadata> {
  try {
    const facilitiesData =
      await api.profile.physical.wardWiseFacilities.getAll.query();
    const municipalityName = "गढवा गाउँपालिका"; // Khajura Rural Municipality

    // Group by facility type
    const facilityGroups = facilitiesData.reduce((acc: any, curr: any) => {
      acc[curr.facility] = acc[curr.facility] || [];
      acc[curr.facility].push(curr);
      return acc;
    }, {});

    // Calculate totals by facility type
    let totalHouseholds = 0;
    const facilityTypeTotals: Record<string, number> = {};
    const uniqueHouseholds = new Set();

    Object.entries(facilityGroups).forEach(
      ([facility, items]: [string, any]) => {
        if (facility === "NONE") return; // Skip NONE for total calculation

        const facilityTotal = items.reduce(
          (sum: number, item: any) => sum + item.households,
          0,
        );
        facilityTypeTotals[facility] = facilityTotal;

        // For unique households calculation, we need ward-level data
        items.forEach((item: any) => {
          uniqueHouseholds.add(`${item.wardNumber}`);
        });
      },
    );

    // Calculate total households (excluding NONE to avoid double counting)
    const noneTotal =
      facilityGroups.NONE?.reduce(
        (sum: number, item: any) => sum + item.households,
        0,
      ) || 0;

    // Find most common facilities
    const sortedFacilities = Object.entries(facilityTypeTotals).sort(
      ([, a]: [string, number], [, b]: [string, number]) => b - a,
    );

    const topFacilities = sortedFacilities
      .slice(0, 3)
      .map(([facility]) => facility);

    const mobilePercentage = facilityTypeTotals.MOBILE_PHONE
      ? (
          (facilityTypeTotals.MOBILE_PHONE / uniqueHouseholds.size) *
          100
        ).toFixed(2)
      : "0.00";
    const televisionPercentage = facilityTypeTotals.TELEVISION
      ? ((facilityTypeTotals.TELEVISION / uniqueHouseholds.size) * 100).toFixed(
          2,
        )
      : "0.00";
    const internetPercentage = facilityTypeTotals.INTERNET
      ? ((facilityTypeTotals.INTERNET / uniqueHouseholds.size) * 100).toFixed(2)
      : "0.00";

    // Create rich keywords
    const keywordsNP = [
      "गढवा गाउँपालिका घरायसी सुविधा",
      "वडागत घरायसी सुविधाको प्रयोग",
      "मोबाइल फोन प्रयोग दर",
      "टेलिभिजन प्रयोग दर",
      "ईन्टरनेट सुविधा पहुँच",
      "घरायसी उपकरणको प्रयोग विश्लेषण",
    ];

    const keywordsEN = [
      "Khajura Rural Municipality household facilities",
      "Ward-wise household facilities usage",
      "Mobile phone usage rate",
      "Television usage rate",
      "Internet access rate",
      "Household appliance usage analysis",
    ];

    // Create description
    const descriptionNP = `गढवा गाउँपालिकामा घरायसी सुविधाको प्रयोगको विश्लेषण। ${localizeNumber(mobilePercentage, "ne")}% घरहरूमा मोबाइल फोन, ${localizeNumber(televisionPercentage, "ne")}% घरहरूमा टेलिभिजन र ${localizeNumber(internetPercentage, "ne")}% घरहरूमा इन्टरनेट सुविधा रहेको छ।`;

    const descriptionEN = `Analysis of household facilities usage in Khajura Rural Municipality. ${mobilePercentage}% of households have mobile phones, ${televisionPercentage}% have television and ${internetPercentage}% have internet access.`;

    return {
      title: `घरायसी सुविधाको प्रयोगको अवस्था | ${municipalityName} डिजिटल प्रोफाइल`,
      description: descriptionNP,
      keywords: [...keywordsNP, ...keywordsEN],
      alternates: {
        canonical: "/profile/physical/ward-wise-facilities",
        languages: {
          en: "/en/profile/physical/ward-wise-facilities",
          ne: "/ne/profile/physical/ward-wise-facilities",
        },
      },
      openGraph: {
        title: `घरायसी सुविधाको प्रयोगको अवस्था | ${municipalityName}`,
        description: descriptionNP,
        type: "article",
        locale: "ne_NP",
        alternateLocale: "en_US",
        siteName: `${municipalityName} डिजिटल प्रोफाइल`,
      },
      twitter: {
        card: "summary_large_image",
        title: `घरायसी सुविधाको प्रयोगको अवस्था | ${municipalityName}`,
        description: descriptionNP,
      },
    };
  } catch (error) {
    // Fallback metadata if data fetching fails
    return {
      title:
        "घरायसी सुविधाको प्रयोगको अवस्था | गढवा गाउँपालिका डिजिटल प्रोफाइल",
      description: "वडा अनुसार घरायसी सुविधाको प्रयोगको अवस्था र विश्लेषण।",
    };
  }
}

const toc = [
  { level: 2, text: "परिचय", slug: "introduction" },
  {
    level: 2,
    text: "घरायसी सुविधाको वितरण",
    slug: "distribution-of-household-facilities",
  },
  {
    level: 2,
    text: "वडा अनुसार घरायसी सुविधाको प्रयोग",
    slug: "ward-wise-facilities-usage",
  },
  {
    level: 2,
    text: "घरायसी सुविधा प्रयोगको विश्लेषण",
    slug: "facilities-usage-analysis",
  },
  {
    level: 2,
    text: "घरायसी सुविधा विस्तार रणनीति",
    slug: "facilities-expansion-strategy",
  },
];

export default async function WardWiseFacilitiesPage() {
  // Fetch all ward-wise facilities data using tRPC
  const facilitiesData =
    await api.profile.physical.wardWiseFacilities.getAll.query();

  // Try to fetch summary data
  let summaryData = null;
  try {
    summaryData = await api.profile.physical.wardWiseFacilities.summary.query();
  } catch (error) {
    console.error("Could not fetch summary data", error);
  }

  // Group by ward number
  const wardGroups = facilitiesData.reduce((acc: any, curr: any) => {
    acc[curr.wardNumber] = acc[curr.wardNumber] || [];
    acc[curr.wardNumber].push(curr);
    return acc;
  }, {});

  // Group by facility type
  const facilityGroups = facilitiesData.reduce((acc: any, curr: any) => {
    acc[curr.facility] = acc[curr.facility] || [];
    acc[curr.facility].push(curr);
    return acc;
  }, {});

  // Create a mapping of facility to its human-readable name
  const facilityMap: Record<string, string> = {};
  facilityOptions.forEach((option) => {
    facilityMap[option.value] = option.label.split(" (")[0];
  });

  // Calculate totals by facility type
  const facilityTypeTotals: Record<string, number> = {};

  Object.entries(facilityGroups).forEach(([facility, items]: [string, any]) => {
    const facilityTotal = items.reduce(
      (sum: number, item: any) => sum + item.households,
      0,
    );
    facilityTypeTotals[facility] = facilityTotal;
  });

  // Calculate approximate total unique households
  // For this, we'll use the highest count per ward as an estimate
  let approximateUniqueHouseholds = 15530;
  // Object.values(wardGroups).forEach((wardData: any) => {
  //   const maxHouseholdsInWard = Math.max(...wardData.map((item: any) => item.households));
  //   approximateUniqueHouseholds += maxHouseholdsInWard;
  // });

  // Calculate percentages (based on estimated total households)
  const facilityTypePercentages: Record<string, number> = {};
  Object.keys(facilityTypeTotals).forEach((facility) => {
    facilityTypePercentages[facility] = parseFloat(
      (
        (facilityTypeTotals[facility] / approximateUniqueHouseholds) *
        100
      ).toFixed(2),
    );
  });

  // Get unique ward numbers
  const wardNumbers = Object.keys(wardGroups)
    .map(Number)
    .sort((a, b) => a - b);

  // Process data for pie chart - top 10 facilities by usage
  const pieChartData = Object.entries(FACILITY_CATEGORIES)
    .map(([categoryKey, category]) => {
      return {
        name: category.name,
        nameEn: category.nameEn,
        value: facilityTypeTotals[categoryKey] || 0,
        percentage: facilityTypePercentages[categoryKey]?.toFixed(2) || "0.00",
        color: category.color,
      };
    })
    .filter((item) => item.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 10); // Take top 10 most common facilities

  // Process data for ward-wise visualization
  const wardWiseData = wardNumbers
    .map((wardNumber) => {
      const wardData = wardGroups[wardNumber];

      if (!wardData) return null;

      // Find the total for this ward (use the MOBILE_PHONE or highest as a proxy for total households)
      const mobilePhoneItem = wardData.find(
        (item: any) => item.facility === "MOBILE_PHONE",
      );
      const totalWardHouseholds = mobilePhoneItem
        ? mobilePhoneItem.households
        : Math.max(...wardData.map((item: any) => item.households));

      // Calculate ward-level counts for each facility
      const wardFacilityCategories: Record<string, number> = {};
      Object.keys(FACILITY_CATEGORIES).forEach((categoryKey) => {
        const category =
          FACILITY_CATEGORIES[categoryKey as keyof typeof FACILITY_CATEGORIES];
        const facilityItem = wardData.find(
          (item: any) => item.facility === categoryKey,
        );
        wardFacilityCategories[category.name] = facilityItem
          ? facilityItem.households
          : 0;
      });

      return {
        ward: `वडा ${wardNumber}`,
        wardNumber,
        ...wardFacilityCategories,
        total: totalWardHouseholds,
      };
    })
    .filter(Boolean);

  // Group facilities into categories for analysis
  const facilityCategoriesForAnalysis = {
    communication: [
      "MOBILE_PHONE",
      "RADIO",
      "TELEVISION",
      "INTERNET",
      "DAILY_NATIONAL_NEWSPAPER_ACCESS",
    ],
    transportation: ["BICYCLE", "MOTORCYCLE", "CAR_JEEP"],
    appliances: [
      "REFRIGERATOR",
      "WASHING_MACHINE",
      "AIR_CONDITIONER",
      "ELECTRICAL_FAN",
      "MICROWAVE_OVEN",
    ],
    digital: ["COMPUTER", "INTERNET", "MOBILE_PHONE"],
  };

  // Calculate category totals and percentages
  const categoryStats: Record<string, { total: number; percentage: number }> =
    {};
  Object.entries(facilityCategoriesForAnalysis).forEach(
    ([category, facilityList]) => {
      const total = facilityList.reduce(
        (sum, facility) => sum + (facilityTypeTotals[facility] || 0),
        0,
      );
      const percentage =
        (total / (facilityList.length * approximateUniqueHouseholds)) * 100;
      categoryStats[category] = {
        total,
        percentage,
      };
    },
  );

  // Calculate Digital Access Index - weighted score based on digital facilities
  const digitalAccessIndex =
    (facilityTypePercentages.INTERNET || 0) * 0.4 +
    (facilityTypePercentages.COMPUTER || 0) * 0.3 +
    (facilityTypePercentages.MOBILE_PHONE || 0) * 0.2 +
    (facilityTypePercentages.TELEVISION || 0) * 0.1;

  // Find ward with best and worst digital access
  const wardDigitalAccess = wardWiseData.map((ward: any) => {
    const internetUsers = ward[FACILITY_CATEGORIES.INTERNET.name] || 0;
    const computerUsers = ward[FACILITY_CATEGORIES.COMPUTER.name] || 0;
    const mobileUsers = ward[FACILITY_CATEGORIES.MOBILE_PHONE.name] || 0;

    const digitalScore =
      (internetUsers / ward.total) * 100 * 0.5 +
      (computerUsers / ward.total) * 100 * 0.3 +
      (mobileUsers / ward.total) * 100 * 0.2;

    return {
      wardNumber: ward.wardNumber,
      score: digitalScore,
      internetPercentage: (internetUsers / ward.total) * 100,
      computerPercentage: (computerUsers / ward.total) * 100,
      mobilePercentage: (mobileUsers / ward.total) * 100,
    };
  });

  const bestDigitalWard = [...wardDigitalAccess].sort(
    (a, b) => b.score - a.score,
  )[0];
  const worstDigitalWard = [...wardDigitalAccess].sort(
    (a, b) => a.score - b.score,
  )[0];

  return (
    <DocsLayout toc={<TableOfContents toc={toc} />}>
      {/* Add structured data for SEO */}
      <WardWiseFacilitiesSEO
        facilitiesData={facilitiesData}
        approximateUniqueHouseholds={approximateUniqueHouseholds}
        facilityTypeTotals={facilityTypeTotals}
        facilityTypePercentages={facilityTypePercentages}
        bestDigitalWard={bestDigitalWard}
        worstDigitalWard={worstDigitalWard}
        FACILITY_CATEGORIES={FACILITY_CATEGORIES}
        wardNumbers={wardNumbers}
        digitalAccessIndex={digitalAccessIndex}
        categoryStats={categoryStats}
      />

      <div className="flex flex-col gap-8">
        <section>
          <div className="relative rounded-lg overflow-hidden mb-8">
            <Image
              src="/images/household-facilities.svg"
              width={1200}
              height={400}
              alt="घरायसी सुविधाको प्रयोगको अवस्था - गढवा गाउँपालिका (Household Facilities Usage - Khajura Rural Municipality)"
              className="w-full h-[250px] object-cover rounded-sm"
              priority
            />
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h1 className="scroll-m-20 tracking-tight mb-6">
              गढवा गाउँपालिकामा घरायसी सुविधाको प्रयोगको अवस्था
            </h1>

            <h2 id="introduction" className="scroll-m-20">
              परिचय
            </h2>
            <p>
              घरायसी सुविधाहरूको उपलब्धता र प्रयोगले समुदायको जीवनस्तर,
              आधुनिकीकरण र सामाजिक-आर्थिक विकासको अवस्थालाई प्रतिविम्बित गर्दछ।
              यी सुविधाहरूको पहुँचले परिवारको दैनिक जीवन, शिक्षा, सूचना
              प्रविधिको प्रयोग, यातायात र आरामदायी जीवनयापनमा प्रत्यक्ष प्रभाव
              पार्दछ। यस खण्डमा गढवा गाउँपालिकाको विभिन्न वडाहरूमा प्रयोग
              हुने घरायसी सुविधाहरूको विस्तृत विश्लेषण प्रस्तुत गरिएको छ।
            </p>
            <p>
              गढवा गाउँपालिकामा अनुमानित कुल{" "}
              {localizeNumber(
                approximateUniqueHouseholds.toLocaleString(),
                "ne",
              )}{" "}
              घरधुरी मध्ये
              {localizeNumber(
                facilityTypePercentages.MOBILE_PHONE?.toFixed(2) || "0.00",
                "ne",
              )}
              % घरहरूमा मोबाइल फोनको पहुँच,
              {localizeNumber(
                facilityTypePercentages.TELEVISION?.toFixed(2) || "0.00",
                "ne",
              )}
              % घरहरूमा टेलिभिजन, र
              {localizeNumber(
                facilityTypePercentages.INTERNET?.toFixed(2) || "0.00",
                "ne",
              )}
              % घरहरूमा इन्टरनेट सुविधा रहेको छ।
            </p>

            <h2
              id="distribution-of-household-facilities"
              className="scroll-m-20 border-b pb-2"
            >
              घरायसी सुविधाको वितरण
            </h2>
            <p>
              गढवा गाउँपालिकामा घरायसी सुविधाहरूको प्रयोगको वितरण
              निम्नानुसार रहेको छ:
            </p>
          </div>

          <WardWiseFacilitiesCharts
            pieChartData={pieChartData}
            wardWiseData={wardWiseData}
            approximateUniqueHouseholds={approximateUniqueHouseholds}
            facilityTypeTotals={facilityTypeTotals}
            facilityMap={facilityMap}
            facilityTypePercentages={facilityTypePercentages}
            wardDigitalAccess={wardDigitalAccess}
            bestDigitalWard={bestDigitalWard}
            worstDigitalWard={worstDigitalWard}
            FACILITY_CATEGORIES={FACILITY_CATEGORIES}
            digitalAccessIndex={digitalAccessIndex}
            categoryStats={categoryStats}
          />

          <div className="prose prose-slate dark:prose-invert max-w-none mt-8">
            <h2
              id="facilities-usage-analysis"
              className="scroll-m-20 border-b pb-2"
            >
              घरायसी सुविधाको प्रयोगको विश्लेषण
            </h2>
            <p>
              गढवा गाउँपालिकामा घरायसी सुविधाहरूको प्रयोगको विश्लेषण गर्दा,
              समग्रमा सञ्चार सम्बन्धी सुविधाहरू (मोबाइल फोन, टेलिभिजन, इन्टरनेट)
              को पहुँच
              {localizeNumber(
                categoryStats.communication.percentage.toFixed(2),
                "ne",
              )}
              % रहेको देखिन्छ। वडागत रूपमा हेर्दा वडा नं.{" "}
              {localizeNumber(bestDigitalWard.wardNumber.toString(), "ne")} मा
              डिजिटल सुविधाको पहुँच सबैभन्दा उच्च रहेको छ, जहाँ{" "}
              {localizeNumber(bestDigitalWard.score.toFixed(2), "ne")}% पहुँच
              रहेको देखिन्छ।
            </p>

            <WardWiseFacilitiesAnalysisSection
              approximateUniqueHouseholds={approximateUniqueHouseholds}
              facilityTypeTotals={facilityTypeTotals}
              facilityTypePercentages={facilityTypePercentages}
              wardDigitalAccess={wardDigitalAccess}
              bestDigitalWard={bestDigitalWard}
              worstDigitalWard={worstDigitalWard}
              FACILITY_CATEGORIES={FACILITY_CATEGORIES}
              digitalAccessIndex={digitalAccessIndex}
              categoryStats={categoryStats}
            />

            <h2
              id="facilities-expansion-strategy"
              className="scroll-m-20 border-b pb-2 mt-12"
            >
              घरायसी सुविधा विस्तार रणनीति
            </h2>

            <p>
              गढवा गाउँपालिकामा घरायसी सुविधाको प्रयोगको तथ्याङ्क
              विश्लेषणबाट निम्न रणनीतिहरू अवलम्बन गर्न सकिन्छ:
            </p>

            <div className="pl-6 space-y-4">
              <div className="flex">
                <span className="font-bold mr-2">१.</span>
                <div>
                  <strong>इन्टरनेट पहुँच विस्तार कार्यक्रम:</strong>{" "}
                  {localizeNumber(
                    (100 - facilityTypePercentages.INTERNET || 0).toFixed(2),
                    "ne",
                  )}
                  % घरधुरीहरूमा अझै इन्टरनेट पहुँच नभएकोले, विशेषगरी वडा नं.{" "}
                  {localizeNumber(worstDigitalWard.wardNumber.toString(), "ne")}{" "}
                  मा इन्टरनेट पहुँच विस्तार गर्न सार्वजनिक वाइफाई हट-स्पट
                  स्थापना र ब्रोडब्यान्ड विस्तारमा जोड दिने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">२.</span>
                <div>
                  <strong>डिजिटल साक्षरता कार्यक्रम:</strong> विशेषगरी
                  कम्प्युटरको पहुँच कम भएका वडाहरूमा डिजिटल साक्षरता कक्षा
                  सञ्चालन गरी आधारभूत कम्प्युटर सीप विकास गर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">३.</span>
                <div>
                  <strong>सामुदायिक सूचना केन्द्र स्थापना:</strong> प्रत्येक
                  वडामा एउटा सामुदायिक डिजिटल सूचना केन्द्र स्थापना गरी
                  इन्टरनेट, कम्प्युटर र सूचना सेवामा पहुँच बढाउने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">४.</span>
                <div>
                  <strong>नवीकरणीय ऊर्जा प्रवर्द्धन:</strong> सौर्य ऊर्जा
                  प्रणालीको प्रयोग बढाएर विद्युतीय उपकरणहरूको प्रयोगमा वृद्धि
                  गर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">५.</span>
                <div>
                  <strong>घरायसी उपकरण सहुलियत कार्यक्रम:</strong> आर्थिक रूपमा
                  कमजोर परिवारहरूका लागि आवश्यक घरायसी उपकरण (जस्तै: इलेक्ट्रिक
                  पंखा, मोबाइल फोन) खरिदमा सुलभ ऋण वा अनुदान प्रदान गर्ने।
                </div>
              </div>
            </div>

            <p className="mt-6">
              यसरी गढवा गाउँपालिकामा घरायसी सुविधाहरूको प्रयोगको विश्लेषणले
              पालिकाको सामाजिक-आर्थिक स्थिति र जीवनस्तरको अवस्था बुझ्न मद्दत
              गर्दछ। आधुनिक घरायसी सुविधाहरूको पहुँचमा वृद्धि गर्न लक्षित
              कार्यक्रम संचालन गरेर नागरिकहरूको सूचना, शिक्षा र स्वास्थ्यमा
              सुधार ल्याउन सकिन्छ, जसले समग्र पालिकाको विकासमा योगदान
              पुर्‍याउनेछ।
            </p>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
}
