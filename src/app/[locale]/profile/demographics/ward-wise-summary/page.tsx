import { Metadata } from "next";
import { DocsLayout } from "@/components/layout/DocsLayout";
import { TableOfContents } from "@/components/TableOfContents";
import { api } from "@/trpc/server";
import Image from "next/image";
import WardWiseCharts from "./_components/ward-wise-charts";
import WardWiseDemographicsAnalysis from "./_components/ward-wise-demographics-analysis";
import WardWiseSEO from "./_components/ward-wise-seo";
import { localizeNumber } from "@/lib/utils/localize-number";

// Force dynamic rendering since we're using tRPC which relies on headers
export const dynamic = "force-dynamic";

// Define the locales for which this page should be statically generated
export async function generateStaticParams() {
  // Generate the page for 'en' and 'ne' locales
  return [{ locale: "en" }];
}

// Optional: Add revalidation period if you want to update the static pages periodically
export const revalidate = 86400; // Revalidate once per day (in seconds)

// This function will generate metadata dynamically based on the actual data
export async function generateMetadata(): Promise<Metadata> {
  try {
    // Fetch data for SEO using tRPC
    const wardData =
      await api.profile.demographics.wardWiseDemographicSummary.getAll.query();
    const municipalityName = "केराबारी गाउँपालिका"; // Khajura Rural Municipality

    // Process data for SEO
    const totalPopulation = wardData.reduce(
      (sum, ward) =>
        sum +
        (ward.totalPopulation ||
          (ward.populationMale || 0) +
            (ward.populationFemale || 0) +
            (ward.populationOther || 0)),
      0,
    );

    const totalHouseholds = wardData.reduce(
      (sum, ward) => sum + (ward.totalHouseholds || 0),
      0,
    );

    const wardCount = new Set(wardData.map((ward) => ward.wardNumber)).size;

    // Calculate average values for additional SEO data
    const malePopulation = wardData.reduce(
      (sum, ward) => sum + (ward.populationMale || 0),
      0,
    );

    const femalePopulation = wardData.reduce(
      (sum, ward) => sum + (ward.populationFemale || 0),
      0,
    );

    // Calculate overall sex ratio
    const overallSexRatio =
      malePopulation > 0
        ? ((femalePopulation / malePopulation) * 100).toFixed(2)
        : "0";

    // Calculate average household size
    const averageHouseholdSize =
      totalHouseholds > 0
        ? (totalPopulation / totalHouseholds).toFixed(2)
        : "0";

    // Find the ward with highest and lowest population
    const sortedByPopulation = [...wardData].sort((a, b) => {
      const popA =
        a.totalPopulation ||
        (a.populationMale || 0) +
          (a.populationFemale || 0) +
          (a.populationOther || 0);
      const popB =
        b.totalPopulation ||
        (b.populationMale || 0) +
          (b.populationFemale || 0) +
          (b.populationOther || 0);
      return popB - popA;
    });

    const highestPopulationWard = sortedByPopulation[0];
    const lowestPopulationWard =
      sortedByPopulation[sortedByPopulation.length - 1];

    // Get highest population ward number and value
    const highestWardNumber = highestPopulationWard?.wardNumber || 1;
    const highestPopulation =
      highestPopulationWard?.totalPopulation ||
      (highestPopulationWard?.populationMale || 0) +
        (highestPopulationWard?.populationFemale || 0) +
        (highestPopulationWard?.populationOther || 0);

    // Create rich keywords with actual data
    const keywordsNP = [
      "केराबारी गाउँपालिका वडागत जनसंख्या",
      "केराबारी गाउँपालिका वडा विवरण",
      "केराबारी गाउँपालिका जनसांख्यिकी तथ्याङ्क",
      "केराबारी गाउँपालिका घरधुरी विवरण",
      `केराबारी गाउँपालिका जनसंख्या ${localizeNumber(totalPopulation, "ne")}`,
      `केराबारी गाउँपालिका घरधुरी ${localizeNumber(totalHouseholds, "ne")}`,
      "केराबारी गाउँपालिका लैङ्गिक अनुपात",
      "केराबारी गाउँपालिका वडागत विश्लेषण",
      `केराबारी गाउँपालिका वडा ${localizeNumber(highestWardNumber, "ne")} जनसंख्या ${localizeNumber(highestPopulation, "ne")}`,
      `केराबारी पुरुष जनसंख्या ${localizeNumber(malePopulation, "ne")}`,
      `केराबारी महिला जनसंख्या ${localizeNumber(femalePopulation, "ne")}`,
      `केराबारी औसत परिवार संख्या ${localizeNumber(averageHouseholdSize, "ne")}`,
    ];

    const keywordsEN = [
      "Khajura Rural Municipality ward-wise population",
      "Khajura Rural Municipality ward details",
      "Khajura demographics statistics",
      "Khajura household details",
      `Khajura total population ${totalPopulation.toLocaleString()}`,
      `Khajura total households ${totalHouseholds.toLocaleString()}`,
      "Khajura gender ratio",
      "Khajura ward analysis",
      `Khajura Ward ${highestWardNumber} population ${highestPopulation.toLocaleString()}`,
      `Khajura male population ${malePopulation.toLocaleString()}`,
      `Khajura female population ${femalePopulation.toLocaleString()}`,
      `Khajura average family size ${averageHouseholdSize}`,
    ];

    // Create detailed description with actual data
    const descriptionNP = `केराबारी गाउँपालिकाको वडागत जनसांख्यिकी सारांश। कुल जनसंख्या ${localizeNumber(totalPopulation, "ne")} (पुरुष: ${localizeNumber(malePopulation, "ne")}, महिला: ${localizeNumber(femalePopulation, "ne")}) र कुल घरधुरी ${localizeNumber(totalHouseholds, "ne")} रहेको छ। केराबारी गाउँपालिकाका ${localizeNumber(wardCount, "ne")} वडाहरूमध्ये वडा ${localizeNumber(highestWardNumber, "ne")} मा सबैभन्दा बढी जनसंख्या (${localizeNumber(highestPopulation, "ne")}) रहेको छ। केराबारी गाउँपालिकाको समग्र लैङ्गिक अनुपात ${localizeNumber(overallSexRatio, "ne")} र औसत परिवार संख्या ${localizeNumber(averageHouseholdSize, "ne")} रहेको छ। सबै वडाहरूको जनसंख्या वितरण, लैङ्गिक अनुपात, घरधुरी र परिवार संख्याको विस्तृत विश्लेषण प्रस्तुत गरिएको छ।`;

    const descriptionEN = `Ward-wise demographic summary for Khajura Rural Municipality. Total population of ${totalPopulation.toLocaleString()} (Male: ${malePopulation.toLocaleString()}, Female: ${femalePopulation.toLocaleString()}) and total households of ${totalHouseholds.toLocaleString()}. Among ${wardCount} wards of Khajura, Ward ${highestWardNumber} has the highest population (${highestPopulation.toLocaleString()}). The Khajura municipality's overall gender ratio is ${overallSexRatio} and average family size is ${averageHouseholdSize}. Detailed analysis of population distribution, gender ratio, households and family size across all wards of Khajura Rural Municipality.`;

    return {
      title: `केराबारी गाउँपालिका | वडागत जनसांख्यिकी सारांश | डिजिटल प्रोफाइल`,
      description: descriptionNP,
      keywords: [...keywordsNP, ...keywordsEN],
      alternates: {
        canonical: "/profile/demographics/ward-wise-summary",
        languages: {
          en: "/en/profile/demographics/ward-wise-summary",
          ne: "/ne/profile/demographics/ward-wise-summary",
        },
      },
      openGraph: {
        title: `केराबारी गाउँपालिका | वडागत जनसांख्यिकी सारांश`,
        description: descriptionNP,
        type: "article",
        locale: "ne_NP",
        alternateLocale: "en_US",
        siteName: `केराबारी गाउँपालिका डिजिटल प्रोफाइल`,
      },
      twitter: {
        card: "summary_large_image",
        title: `केराबारी गाउँपालिका | वडागत जनसांख्यिकी सारांश`,
        description: descriptionNP,
      },
    };
  } catch (error) {
    // Fallback metadata if data fetching fails
    return {
      title:
        "केराबारी गाउँपालिका | वडागत जनसांख्यिकी सारांश | डिजिटल प्रोफाइल",
      description:
        "केराबारी गाउँपालिकाको प्रत्येक वडाको जनसांख्यिकी विवरण, लिङ्ग अनुपात, घरधुरी र जनसंख्या वितरणको विश्लेषण।",
    };
  }
}

const toc = [
  { level: 2, text: "परिचय", slug: "introduction" },
  {
    level: 2,
    text: "वडागत जनसंख्या वितरण",
    slug: "ward-population-distribution",
  },
  { level: 2, text: "वडागत लिङ्ग अनुपात", slug: "gender-ratio" },
  { level: 2, text: "वडागत घरधुरी र परिवार संख्या", slug: "household-size" },
  { level: 2, text: "वडागत विश्लेषण", slug: "ward-analysis" },
  { level: 2, text: "तथ्याङ्क स्रोत", slug: "data-source" },
];

// Define Nepali names for gender
const GENDER_NAMES: Record<string, string> = {
  MALE: "पुरुष",
  FEMALE: "महिला",
  OTHER: "अन्य",
};

export default async function WardWiseSummaryPage() {
  // Fetch all ward-wise demographic data from tRPC route
  const wardData =
    await api.profile.demographics.wardWiseDemographicSummary.getAll.query();

  // Process ward data for display
  const processedWardData = wardData.map((ward) => {
    // Calculate total population from components if not directly provided
    const totalPopulation =
      ward.totalPopulation ||
      (ward.populationMale || 0) +
        (ward.populationFemale || 0) +
        (ward.populationOther || 0);

    // Calculate sex ratio if not provided
    const sexRatio = ward.sexRatio
      ? parseFloat(ward.sexRatio.toString())
      : ward.populationMale && ward.populationFemale && ward.populationMale > 0
        ? (ward.populationFemale / ward.populationMale) * 100
        : 0;

    // Calculate average household size if not provided
    const averageHouseholdSize = ward.averageHouseholdSize
      ? parseFloat(ward.averageHouseholdSize.toString())
      : ward.totalHouseholds && ward.totalHouseholds > 0
        ? totalPopulation / ward.totalHouseholds
        : 0;

    return {
      wardNumber: ward.wardNumber,
      wardName: ward.wardName || `वडा ${ward.wardNumber}`,
      totalPopulation,
      malePopulation: ward.populationMale || 0,
      femalePopulation: ward.populationFemale || 0,
      otherPopulation: ward.populationOther || 0,
      totalHouseholds: ward.totalHouseholds || 0,
      averageHouseholdSize: parseFloat(averageHouseholdSize.toFixed(2)),
      sexRatio: parseFloat(sexRatio.toFixed(2)),
    };
  });

  // Calculate municipality totals
  const municipalityStats = {
    totalPopulation: processedWardData.reduce(
      (sum, ward) => sum + ward.totalPopulation,
      0,
    ),
    malePopulation: processedWardData.reduce(
      (sum, ward) => sum + ward.malePopulation,
      0,
    ),
    femalePopulation: processedWardData.reduce(
      (sum, ward) => sum + ward.femalePopulation,
      0,
    ),
    otherPopulation: processedWardData.reduce(
      (sum, ward) => sum + ward.otherPopulation,
      0,
    ),
    totalHouseholds: processedWardData.reduce(
      (sum, ward) => sum + ward.totalHouseholds,
      0,
    ),
  };

  // Calculate municipality averages
  const municipalityAverages = {
    averageHouseholdSize:
      municipalityStats.totalPopulation > 0 &&
      municipalityStats.totalHouseholds > 0
        ? parseFloat(
            (
              municipalityStats.totalPopulation /
              municipalityStats.totalHouseholds
            ).toFixed(2),
          )
        : 0,
    sexRatio:
      municipalityStats.malePopulation > 0
        ? parseFloat(
            (
              (municipalityStats.femalePopulation /
                municipalityStats.malePopulation) *
              100
            ).toFixed(2),
          )
        : 0,
  };

  // Format data for ward-wise sex ratio comparison
  const wardSexRatioData = processedWardData.map((ward) => ({
    ward: `वडा ${localizeNumber(ward.wardNumber, "ne")}`,
    sexRatio: ward.sexRatio,
    population: ward.totalPopulation,
  }));

  // Format data for ward-wise household size comparison
  const wardHouseholdData = processedWardData.map((ward) => ({
    ward: `वडा ${localizeNumber(ward.wardNumber, "ne")}`,
    householdSize: ward.averageHouseholdSize,
    households: ward.totalHouseholds,
  }));

  // Format data for ward-wise population distribution
  const wardPopulationData = processedWardData.map((ward) => ({
    ward: `वडा ${localizeNumber(ward.wardNumber, "ne")}`,
    population: ward.totalPopulation,
    malePopulation: ward.malePopulation,
    femalePopulation: ward.femalePopulation,
    otherPopulation: ward.otherPopulation,
    percentage: (
      (ward.totalPopulation / municipalityStats.totalPopulation) *
      100
    ).toFixed(2),
    households: ward.totalHouseholds,
  }));

  return (
    <DocsLayout toc={<TableOfContents toc={toc} />}>
      {/* Add structured data for SEO */}
      <WardWiseSEO
        //@ts-ignore
        processedWardData={processedWardData}
        municipalityStats={municipalityStats}
        municipalityAverages={municipalityAverages}
      />

      <div className="flex flex-col gap-8">
        <section>
          <div className="relative rounded-lg overflow-hidden mb-8">
            <Image
              src="/images/ward-demographics.svg"
              width={1200}
              height={400}
              alt="केराबारी गाउँपालिका | वडागत जनसांख्यिकी सारांश (Khajura Rural Municipality Ward Demographics Summary)"
              className="w-full h-[250px] object-cover rounded-sm"
              priority
            />
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h1 className="scroll-m-20 tracking-tight mb-6">
              केराबारी गाउँपालिका | वडागत जनसांख्यिकी सारांश
            </h1>

            <h2 id="introduction" className="scroll-m-20">
              परिचय
            </h2>
            <p>
              यस खण्डमा केराबारी गाउँपालिकाको प्रत्येक वडाको जनसांख्यिकी
              विवरण प्रस्तुत गरिएको छ। वडागत जनसंख्या वितरण, लिङ्ग अनुपात,
              घरधुरी विवरण र अन्य महत्त्वपूर्ण जनसांख्यिकी सूचकहरू यहाँ विश्लेषण
              गरिएको छ।
            </p>
            <p>
              वडागत विश्लेषणले केराबारी गाउँपालिकाभित्र रहेका विविधता र
              असमानताहरू पहिचान गर्न मद्दत गर्दछ। यी तथ्याङ्कहरूले वडागत विकास
              योजना तर्जुमा, स्रोत साधन विनियोजन तथा अनुगमन मूल्याङ्कनमा
              महत्त्वपूर्ण भूमिका निर्वाह गर्दछन्।
            </p>

            <h2
              id="ward-population-distribution"
              className="scroll-m-20 border-b pb-2"
            >
              केराबारी गाउँपालिकाको वडागत जनसंख्या वितरण
            </h2>
            <p>
              केराबारी गाउँपालिकाको कुल जनसंख्या{" "}
              {localizeNumber(
                municipalityStats.totalPopulation.toLocaleString(),
                "ne",
              )}{" "}
              रहेको छ, जसमध्ये{" "}
              {localizeNumber(
                municipalityStats.malePopulation.toLocaleString(),
                "ne",
              )}{" "}
              पुरुष,{" "}
              {localizeNumber(
                municipalityStats.femalePopulation.toLocaleString(),
                "ne",
              )}{" "}
              महिला र{" "}
              {localizeNumber(
                municipalityStats.otherPopulation.toLocaleString(),
                "ne",
              )}{" "}
              अन्य लिङ्गका व्यक्तिहरू रहेका छन्। केराबारी गाउँपालिकाका
              प्रत्येक वडाको जनसंख्या वितरण निम्नानुसार छ:
            </p>
          </div>

          {/* Client component for charts */}
          <WardWiseCharts
            wardPopulationData={wardPopulationData}
            wardSexRatioData={wardSexRatioData}
            wardHouseholdData={wardHouseholdData}
            municipalityStats={municipalityStats}
            municipalityAverages={municipalityAverages}
            GENDER_NAMES={GENDER_NAMES}
          />

          <div className="prose prose-slate dark:prose-invert max-w-none mt-8">
            <h2 id="ward-analysis" className="scroll-m-20 border-b pb-2">
              वडागत विश्लेषण
            </h2>
            <p>
              केराबारी गाउँपालिकाको प्रत्येक वडाको जनसांख्यिकीय संरचनाको
              विश्लेषणबाट निम्न सूचकहरू प्राप्त हुन्छन्:
            </p>

            {/* Client component for ward-wise analysis */}
            <WardWiseDemographicsAnalysis
              wardData={processedWardData}
              municipalityStats={municipalityStats}
              municipalityAverages={municipalityAverages}
            />
          </div>
        </section>
      </div>
    </DocsLayout>
  );
}
