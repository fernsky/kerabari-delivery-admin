import { Metadata } from "next";
import { DocsLayout } from "@/components/layout/DocsLayout";
import { TableOfContents } from "@/components/TableOfContents";
import Image from "next/image";
import { api } from "@/trpc/server";
import { localizeNumber } from "@/lib/utils/localize-number";
import BirthplaceHouseholdCharts from "./_components/birthplace-household-charts";
import BirthplaceHouseholdAnalysisSection from "./_components/birthplace-household-analysis-section";
import BirthplaceHouseholdSEO from "./_components/birthplace-household-seo";

// Force dynamic rendering since we're using tRPC which relies on headers
export const dynamic = "force-dynamic";

// Define the locales for which this page should be statically generated
export async function generateStaticParams() {
  // Generate the page for 'en' and 'ne' locales
  return [{ locale: "en" }];
}

// Optional: Add revalidation period if you want to update the static pages periodically
export const revalidate = 86400; // Revalidate once per day (in seconds)

// Define Nepali names for birthplaces
const BIRTH_PLACE_NAMES: Record<string, string> = {
  SAME_MUNICIPALITY: "यहि गापा/नपा",
  SAME_DISTRICT_ANOTHER_MUNICIPALITY: "यहि जिल्लाको अर्को गा.पा./न.पा",
  ANOTHER_DISTRICT: "अर्को जिल्ला",
  ABROAD: "विदेश",
};

// Define English names for birthplaces (for SEO)
const BIRTH_PLACE_NAMES_EN: Record<string, string> = {
  SAME_MUNICIPALITY: "Same Municipality",
  SAME_DISTRICT_ANOTHER_MUNICIPALITY: "Same District (Another Municipality)",
  ANOTHER_DISTRICT: "Another District",
  ABROAD: "Abroad",
};

// This function will generate metadata dynamically based on the actual data
export async function generateMetadata(): Promise<Metadata> {
  try {
    // Fetch data for SEO using tRPC
    const birthplaceData =
      await api.profile.demographics.wardWiseBirthplaceHouseholds.getAll.query();
    const municipalityName = "गढवा गाउँपालिका"; // Khajura Rural Municipality

    // Process data for SEO
    const totalHouseholds = birthplaceData.reduce(
      (sum, item) => sum + (item.households || 0),
      0,
    );

    // Group by birthplace and calculate totals
    const birthplaceHouseholdCounts: Record<string, number> = {};
    birthplaceData.forEach((item) => {
      if (!birthplaceHouseholdCounts[item.birthPlace])
        birthplaceHouseholdCounts[item.birthPlace] = 0;
      birthplaceHouseholdCounts[item.birthPlace] += item.households || 0;
    });

    // Find the most common birthplace
    let mostCommonBirthplace = "";
    let mostCommonCount = 0;
    Object.entries(birthplaceHouseholdCounts).forEach(([birthplace, count]) => {
      if (count > mostCommonCount) {
        mostCommonCount = count;
        mostCommonBirthplace = birthplace;
      }
    });

    const mostCommonPercentage =
      totalHouseholds > 0
        ? ((mostCommonCount / totalHouseholds) * 100).toFixed(2)
        : "0";

    // Create rich keywords with actual data
    const keywordsNP = [
      "गढवा गाउँपालिका घरपरिवारको जन्मस्थान",
      "गढवा परिवार जन्मस्थान वितरण",
      "वडा अनुसार जन्मस्थान विवरण",
      "घरपरिवारको जन्मस्थान विश्लेषण",
      "स्थानीय घरपरिवार गढवा",
      "जिल्ला बाहिरका घर परिवार",
      `गढवा घरपरिवार संख्या ${localizeNumber(totalHouseholds.toString(), "ne")}`,
    ];

    const keywordsEN = [
      "Khajura Rural Municipality birthplace households",
      "Khajura household birthplace distribution",
      "Ward-wise birthplace data",
      "Household birthplace analysis",
      "Local households in Khajura",
      "Inter-district migration",
      `Khajura total households ${totalHouseholds}`,
    ];

    // Create detailed description with actual data
    const descriptionNP = `गढवा गाउँपालिकाको वडा अनुसार घरपरिवारको जन्मस्थानको वितरण र विश्लेषण। कुल घरपरिवार संख्या ${localizeNumber(totalHouseholds.toString(), "ne")} मध्ये ${localizeNumber(mostCommonPercentage, "ne")}% (${localizeNumber(mostCommonCount.toString(), "ne")}) ${BIRTH_PLACE_NAMES[mostCommonBirthplace] || mostCommonBirthplace} बाट आएका देखिन्छ। विभिन्न वडाहरूमा घरपरिवारको जन्मस्थानको विस्तृत विश्लेषण।`;

    const descriptionEN = `Ward-wise distribution and analysis of household birthplaces in Khajura Rural Municipality. Out of a total of ${totalHouseholds} households, ${mostCommonPercentage}% (${mostCommonCount}) are from ${BIRTH_PLACE_NAMES_EN[mostCommonBirthplace] || mostCommonBirthplace}. Detailed analysis of household birthplaces across various wards.`;

    return {
      title: `घरपरिवारको जन्मस्थान | ${municipalityName} डिजिटल प्रोफाइल`,
      description: descriptionNP,
      keywords: [...keywordsNP, ...keywordsEN],
      alternates: {
        canonical: "/profile/demographics/ward-wise-birthplace-households",
        languages: {
          en: "/en/profile/demographics/ward-wise-birthplace-households",
          ne: "/ne/profile/demographics/ward-wise-birthplace-households",
        },
      },
      openGraph: {
        title: `घरपरिवारको जन्मस्थान | ${municipalityName}`,
        description: descriptionNP,
        type: "article",
        locale: "ne_NP",
        alternateLocale: "en_US",
        siteName: `${municipalityName} डिजिटल प्रोफाइल`,
      },
      twitter: {
        card: "summary_large_image",
        title: `घरपरिवारको जन्मस्थान | ${municipalityName}`,
        description: descriptionNP,
      },
    };
  } catch (error) {
    // Fallback metadata if data fetching fails
    return {
      title: "घरपरिवारको जन्मस्थान | गढवा गाउँपालिका डिजिटल प्रोफाइल",
      description: "वडा अनुसार घरपरिवारको जन्मस्थानको वितरण र विश्लेषण।",
    };
  }
}

const toc = [
  { level: 2, text: "परिचय", slug: "introduction" },
  { level: 2, text: "घरपरिवारको जन्मस्थान", slug: "household-birthplaces" },
  { level: 2, text: "वडा अनुसार जन्मस्थान", slug: "ward-wise-birthplaces" },
  { level: 2, text: "जन्मस्थान विश्लेषण", slug: "birthplace-analysis" },
];

export default async function WardWiseBirthplaceHouseholdsPage() {
  // Fetch all birthplace household data using tRPC
  const birthplaceData =
    await api.profile.demographics.wardWiseBirthplaceHouseholds.getAll.query();

  // Try to fetch summary data
  let summaryData = null;
  try {
    summaryData =
      await api.profile.demographics.wardWiseBirthplaceHouseholds.summary.query();
  } catch (error) {
    console.error("Could not fetch summary data", error);
  }

  // Process data for overall summary
  const overallSummary = Object.entries(
    birthplaceData.reduce((acc: Record<string, number>, item) => {
      if (!acc[item.birthPlace]) acc[item.birthPlace] = 0;
      acc[item.birthPlace] += item.households || 0;
      return acc;
    }, {}),
  )
    .map(([birthPlace, households]) => ({
      birthPlace,
      birthPlaceName:
        BIRTH_PLACE_NAMES[birthPlace as keyof typeof BIRTH_PLACE_NAMES] ||
        birthPlace,
      households,
    }))
    .sort((a, b) => b.households - a.households); // Sort by households descending

  // Calculate total households for percentages
  const totalHouseholds = overallSummary.reduce(
    (sum, item) => sum + item.households,
    0,
  );

  // Create data for pie chart
  const pieChartData = overallSummary.map((item) => ({
    name: item.birthPlaceName,
    value: item.households,
    percentage: ((item.households / totalHouseholds) * 100).toFixed(2),
  }));

  // Get unique ward numbers
  const wardNumbers = Array.from(
    new Set(birthplaceData.map((item) => item.wardNumber)),
  ).sort((a, b) => a - b); // Sort numerically

  // Process data for ward-wise visualization
  const wardWiseData = wardNumbers.map((wardNumber) => {
    const wardData = birthplaceData.filter(
      (item) => item.wardNumber === wardNumber,
    );

    const result: Record<string, any> = { ward: `वडा ${wardNumber}` };

    // Add birthplaces
    wardData.forEach((item) => {
      result[
        BIRTH_PLACE_NAMES[item.birthPlace as keyof typeof BIRTH_PLACE_NAMES] ||
          item.birthPlace
      ] = item.households;
    });

    return result;
  });

  // Calculate ward-wise birthplace analysis
  const wardWiseAnalysis = wardNumbers.map((wardNumber) => {
    const wardData = birthplaceData.filter(
      (item) => item.wardNumber === wardNumber,
    );

    const wardTotalHouseholds = wardData.reduce(
      (sum, item) => sum + (item.households || 0),
      0,
    );

    const mostCommonBirthplace = wardData.reduce(
      (prev, current) => {
        return (prev.households || 0) > (current.households || 0)
          ? prev
          : current;
      },
      { birthPlace: "", households: 0 },
    );

    return {
      wardNumber,
      totalHouseholds: wardTotalHouseholds,
      mostCommonBirthplace: mostCommonBirthplace.birthPlace,
      mostCommonBirthplaceHouseholds: mostCommonBirthplace.households || 0,
      mostCommonBirthplacePercentage:
        wardTotalHouseholds > 0
          ? (
              ((mostCommonBirthplace.households || 0) / wardTotalHouseholds) *
              100
            ).toFixed(2)
          : "0",
    };
  });

  return (
    <DocsLayout toc={<TableOfContents toc={toc} />}>
      {/* Add structured data for SEO */}
      <BirthplaceHouseholdSEO
        overallSummary={overallSummary}
        totalHouseholds={totalHouseholds}
        BIRTH_PLACE_NAMES={BIRTH_PLACE_NAMES}
        BIRTH_PLACE_NAMES_EN={BIRTH_PLACE_NAMES_EN}
        wardNumbers={wardNumbers}
      />

      <div className="flex flex-col gap-8">
        <section>
          <div className="relative rounded-lg overflow-hidden mb-8">
            <Image
              src="/images/birthplace-households.svg"
              width={1200}
              height={400}
              alt="घरपरिवारको जन्मस्थान - गढवा गाउँपालिका (Household Birthplaces - Khajura Rural Municipality)"
              className="w-full h-[250px] object-cover rounded-sm"
              priority
            />
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h1 className="scroll-m-20 tracking-tight mb-6">
              गढवा गाउँपालिकामा घरपरिवारको जन्मस्थान
            </h1>

            <h2 id="introduction" className="scroll-m-20">
              परिचय
            </h2>
            <p>
              घरपरिवारको जन्मस्थान सम्बन्धी तथ्याङ्कले गाउँपालिकामा बसोबास गर्ने
              परिवारहरूको मूल स्थान, आप्रवासन प्रवृत्ति र जनसंख्या गतिशीलताको
              विश्लेषण गर्न सहयोग गर्दछ। यस खण्डमा गढवा गाउँपालिकामा रहेका
              घरपरिवारको जन्मस्थान अनुसारको वितरण र वडागत विश्लेषण प्रस्तुत
              गरिएको छ।
            </p>
            <p>
              गढवा गाउँपालिकामा रहेका परिवारहरूको जन्मस्थानको तथ्याङ्क
              हेर्दा, कुल घरपरिवार{" "}
              {localizeNumber(totalHouseholds.toLocaleString(), "ne")}
              मध्ये सबैभन्दा बढी {overallSummary[0]?.birthPlaceName || ""}
              बाट{" "}
              {localizeNumber(
                (
                  ((overallSummary[0]?.households || 0) / totalHouseholds) *
                  100
                ).toFixed(1),
                "ne",
              )}
              % परिवारहरू रहेको देखिन्छ।
            </p>

            <h2
              id="household-birthplaces"
              className="scroll-m-20 border-b pb-2"
            >
              घरपरिवारको जन्मस्थान
            </h2>
            <p>
              गढवा गाउँपालिकामा रहेका परिवारहरूको जन्मस्थानको विवरण र वितरण
              निम्नानुसार रहेको छ:
            </p>
          </div>

          {/* Client component for charts */}
          <BirthplaceHouseholdCharts
            overallSummary={overallSummary}
            totalHouseholds={totalHouseholds}
            pieChartData={pieChartData}
            wardWiseData={wardWiseData}
            wardNumbers={wardNumbers}
            birthplaceData={birthplaceData}
            wardWiseAnalysis={wardWiseAnalysis}
            BIRTH_PLACE_NAMES={BIRTH_PLACE_NAMES}
          />

          <div className="prose prose-slate dark:prose-invert max-w-none mt-8">
            <h2 id="birthplace-analysis" className="scroll-m-20 border-b pb-2">
              जन्मस्थान विश्लेषण
            </h2>
            <p>
              गढवा गाउँपालिकामा रहेका परिवारहरूको जन्मस्थानको विश्लेषण
              गर्दा,
              {BIRTH_PLACE_NAMES[overallSummary[0]?.birthPlace || ""] ||
                overallSummary[0]?.birthPlace}
              बाट आएका परिवारहरू सबैभन्दा बढी
              {localizeNumber(
                (
                  ((overallSummary[0]?.households || 0) / totalHouseholds) *
                  100
                ).toFixed(2),
                "ne",
              )}
              % रहेको पाइन्छ।
            </p>

            {/* Client component for birthplace analysis section */}
            <BirthplaceHouseholdAnalysisSection
              overallSummary={overallSummary}
              totalHouseholds={totalHouseholds}
              wardWiseAnalysis={wardWiseAnalysis}
              BIRTH_PLACE_NAMES={BIRTH_PLACE_NAMES}
              BIRTH_PLACE_NAMES_EN={BIRTH_PLACE_NAMES_EN}
            />
          </div>
        </section>
      </div>
    </DocsLayout>
  );
}
