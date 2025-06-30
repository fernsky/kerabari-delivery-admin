import { Metadata } from "next";
import { DocsLayout } from "@/components/layout/DocsLayout";
import { TableOfContents } from "@/components/TableOfContents";
import Image from "next/image";
import { api } from "@/trpc/server";
import { localizeNumber } from "@/lib/utils/localize-number";
import MigratedHouseholdCharts from "./_components/migrated-household-charts";
import MigratedHouseholdAnalysisSection from "./_components/migrated-household-analysis-section";
import MigratedHouseholdSEO from "./_components/migrated-household-seo";

// Force dynamic rendering since we're using tRPC which relies on headers
export const dynamic = "force-dynamic";

// Define the locales for which this page should be statically generated
export async function generateStaticParams() {
  // Generate the page for 'en' and 'ne' locales
  return [{ locale: "en" }];
}

// Optional: Add revalidation period if you want to update the static pages periodically
export const revalidate = 86400; // Revalidate once per day (in seconds)

// Define Nepali names for migration origins
const MIGRATED_FROM_NAMES: Record<string, string> = {
  SAME_DISTRICT_ANOTHER_MUNICIPALITY: "यही जिल्लाको अर्को स्थानीय तह",
  ANOTHER_DISTRICT: "नेपालको अर्को जिल्ला",
  ABROAD: "विदेश",
};

// Define English names for migration origins (for SEO)
const MIGRATED_FROM_NAMES_EN: Record<string, string> = {
  SAME_DISTRICT_ANOTHER_MUNICIPALITY: "Same District (Another Municipality)",
  ANOTHER_DISTRICT: "Another District of Nepal",
  ABROAD: "Foreign Country",
};

// This function will generate metadata dynamically based on the actual data
export async function generateMetadata(): Promise<Metadata> {
  try {
    // Fetch data for SEO using tRPC
    const migratedData =
      await api.profile.demographics.wardWiseMigratedHouseholds.getAll.query();
    const municipalityName = "केराबारी गाउँपालिका"; // Khajura Rural Municipality

    // Process data for SEO
    const totalHouseholds = migratedData.reduce(
      (sum, item) => sum + (item.households || 0),
      0,
    );

    // Group by migration origin and calculate totals
    const migratedHouseholdCounts: Record<string, number> = {};
    migratedData.forEach((item) => {
      if (!migratedHouseholdCounts[item.migratedFrom])
        migratedHouseholdCounts[item.migratedFrom] = 0;
      migratedHouseholdCounts[item.migratedFrom] += item.households || 0;
    });

    // Find the most common migration origin
    let mostCommonMigratedFrom = "";
    let mostCommonCount = 0;
    Object.entries(migratedHouseholdCounts).forEach(([migratedFrom, count]) => {
      if (count > mostCommonCount) {
        mostCommonCount = count;
        mostCommonMigratedFrom = migratedFrom;
      }
    });

    const mostCommonPercentage =
      totalHouseholds > 0
        ? ((mostCommonCount / totalHouseholds) * 100).toFixed(2)
        : "0";

    // Create rich keywords with actual data
    const keywordsNP = [
      "केराबारी गाउँपालिका आप्रवासित घरपरिवार",
      "केराबारी बसाइँसराइ परिवार वितरण",
      "वडा अनुसार आप्रवासित परिवार विवरण",
      "घरपरिवारको आप्रवासन विश्लेषण",
      "स्थानांतरित परिवार केराबारी",
      "जिल्लान्तर आप्रवासन",
      `केराबारी आप्रवासित घरपरिवार संख्या ${localizeNumber(totalHouseholds.toString(), "ne")}`,
    ];

    const keywordsEN = [
      "Khajura Rural Municipality migrated households",
      "Khajura household migration distribution",
      "Ward-wise migration data",
      "Household migration analysis",
      "Migrated households in Khajura",
      "Inter-district migration",
      `Khajura total migrated households ${totalHouseholds}`,
    ];

    // Create detailed description with actual data
    const descriptionNP = `केराबारी गाउँपालिकाको वडा अनुसार आप्रवासित घरपरिवारको वितरण र विश्लेषण। कुल आप्रवासित घरपरिवार संख्या ${localizeNumber(totalHouseholds.toString(), "ne")} मध्ये ${localizeNumber(mostCommonPercentage, "ne")}% (${localizeNumber(mostCommonCount.toString(), "ne")}) ${MIGRATED_FROM_NAMES[mostCommonMigratedFrom] || mostCommonMigratedFrom} बाट आएका देखिन्छ। विभिन्न वडाहरूमा आप्रवासित घरपरिवारको विस्तृत विश्लेषण।`;

    const descriptionEN = `Ward-wise distribution and analysis of migrated households in Khajura Rural Municipality. Out of a total of ${totalHouseholds} migrated households, ${mostCommonPercentage}% (${mostCommonCount}) are from ${MIGRATED_FROM_NAMES_EN[mostCommonMigratedFrom] || mostCommonMigratedFrom}. Detailed analysis of migrated households across various wards.`;

    return {
      title: `आप्रवासित घरपरिवार | ${municipalityName} डिजिटल प्रोफाइल`,
      description: descriptionNP,
      keywords: [...keywordsNP, ...keywordsEN],
      alternates: {
        canonical: "/profile/demographics/ward-wise-migrated-households",
        languages: {
          en: "/en/profile/demographics/ward-wise-migrated-households",
          ne: "/ne/profile/demographics/ward-wise-migrated-households",
        },
      },
      openGraph: {
        title: `आप्रवासित घरपरिवार | ${municipalityName}`,
        description: descriptionNP,
        type: "article",
        locale: "ne_NP",
        alternateLocale: "en_US",
        siteName: `${municipalityName} डिजिटल प्रोफाइल`,
      },
      twitter: {
        card: "summary_large_image",
        title: `आप्रवासित घरपरिवार | ${municipalityName}`,
        description: descriptionNP,
      },
    };
  } catch (error) {
    // Fallback metadata if data fetching fails
    return {
      title: "आप्रवासित घरपरिवार | केराबारी गाउँपालिका डिजिटल प्रोफाइल",
      description: "वडा अनुसार आप्रवासित घरपरिवारको वितरण र विश्लेषण।",
    };
  }
}

const toc = [
  { level: 2, text: "परिचय", slug: "introduction" },
  { level: 2, text: "आप्रवासित घरपरिवार", slug: "migrated-households" },
  { level: 2, text: "वडा अनुसार आप्रवासन", slug: "ward-wise-migration" },
  { level: 2, text: "आप्रवासन विश्लेषण", slug: "migration-analysis" },
];

export default async function WardWiseMigratedHouseholdsPage() {
  // Fetch all migrated household data using tRPC
  const migratedData =
    await api.profile.demographics.wardWiseMigratedHouseholds.getAll.query();

  // Try to fetch summary data
  let summaryData = null;
  try {
    summaryData =
      await api.profile.demographics.wardWiseMigratedHouseholds.summary.query();
  } catch (error) {
    console.error("Could not fetch summary data", error);
  }

  // Process data for overall summary
  const overallSummary = Object.entries(
    migratedData.reduce((acc: Record<string, number>, item) => {
      if (!acc[item.migratedFrom]) acc[item.migratedFrom] = 0;
      acc[item.migratedFrom] += item.households || 0;
      return acc;
    }, {}),
  )
    .map(([migratedFrom, households]) => ({
      migratedFrom,
      migratedFromName:
        MIGRATED_FROM_NAMES[migratedFrom as keyof typeof MIGRATED_FROM_NAMES] ||
        migratedFrom,
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
    name: item.migratedFromName,
    value: item.households,
    percentage: ((item.households / totalHouseholds) * 100).toFixed(2),
  }));

  // Get unique ward numbers
  const wardNumbers = Array.from(
    new Set(migratedData.map((item) => item.wardNumber)),
  ).sort((a, b) => a - b); // Sort numerically

  // Process data for ward-wise visualization
  const wardWiseData = wardNumbers.map((wardNumber) => {
    const wardData = migratedData.filter(
      (item) => item.wardNumber === wardNumber,
    );

    const result: Record<string, any> = { ward: `वडा ${wardNumber}` };

    // Add migration origins
    wardData.forEach((item) => {
      result[
        MIGRATED_FROM_NAMES[
          item.migratedFrom as keyof typeof MIGRATED_FROM_NAMES
        ] || item.migratedFrom
      ] = item.households;
    });

    return result;
  });

  // Calculate ward-wise migrated analysis
  const wardWiseAnalysis = wardNumbers.map((wardNumber) => {
    const wardData = migratedData.filter(
      (item) => item.wardNumber === wardNumber,
    );

    const wardTotalHouseholds = wardData.reduce(
      (sum, item) => sum + (item.households || 0),
      0,
    );

    const mostCommonMigratedFrom = wardData.reduce(
      (prev, current) => {
        return (prev.households || 0) > (current.households || 0)
          ? prev
          : current;
      },
      { migratedFrom: "", households: 0 },
    );

    return {
      wardNumber,
      totalHouseholds: wardTotalHouseholds,
      mostCommonMigratedFrom: mostCommonMigratedFrom.migratedFrom,
      mostCommonMigratedFromHouseholds: mostCommonMigratedFrom.households || 0,
      mostCommonMigratedFromPercentage:
        wardTotalHouseholds > 0
          ? (
              ((mostCommonMigratedFrom.households || 0) / wardTotalHouseholds) *
              100
            ).toFixed(2)
          : "0",
    };
  });

  return (
    <DocsLayout toc={<TableOfContents toc={toc} />}>
      {/* Add structured data for SEO */}
      <MigratedHouseholdSEO
        overallSummary={overallSummary}
        totalHouseholds={totalHouseholds}
        MIGRATED_FROM_NAMES={MIGRATED_FROM_NAMES}
        MIGRATED_FROM_NAMES_EN={MIGRATED_FROM_NAMES_EN}
        wardNumbers={wardNumbers}
      />

      <div className="flex flex-col gap-8">
        <section>
          <div className="relative rounded-lg overflow-hidden mb-8">
            <Image
              src="/images/migrated-households.svg"
              width={1200}
              height={400}
              alt="आप्रवासित घरपरिवार - केराबारी गाउँपालिका (Migrated Households - Khajura Rural Municipality)"
              className="w-full h-[250px] object-cover rounded-sm"
              priority
            />
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h1 className="scroll-m-20 tracking-tight mb-6">
              केराबारी गाउँपालिकामा आप्रवासित घरपरिवार
            </h1>

            <h2 id="introduction" className="scroll-m-20">
              परिचय
            </h2>
            <p>
              आप्रवासित घरपरिवारको तथ्याङ्कले गाउँपालिकामा बसोबास गर्ने
              आप्रवासित परिवारहरूको मूल स्थान, आप्रवासन प्रवृत्ति र जनसंख्या
              गतिशीलताको विश्लेषण गर्न सहयोग गर्दछ। यस खण्डमा केराबारी
              गाउँपालिकामा रहेका आप्रवासित घरपरिवारको स्थान अनुसारको वितरण र
              वडागत विश्लेषण प्रस्तुत गरिएको छ।
            </p>
            <p>
              केराबारी गाउँपालिकामा रहेका आप्रवासित परिवारहरूको स्थानको
              तथ्याङ्क हेर्दा, कुल घरपरिवार{" "}
              {localizeNumber(totalHouseholds.toLocaleString(), "ne")}
              मध्ये सबैभन्दा बढी {overallSummary[0]?.migratedFromName || ""}
              बाट{" "}
              {localizeNumber(
                (
                  ((overallSummary[0]?.households || 0) / totalHouseholds) *
                  100
                ).toFixed(1),
                "ne",
              )}
              % परिवारहरू आप्रवासित भएका देखिन्छ।
            </p>

            <h2 id="migrated-households" className="scroll-m-20 border-b pb-2">
              आप्रवासित घरपरिवारको वितरण
            </h2>
            <p>
              केराबारी गाउँपालिकामा रहेका आप्रवासित परिवारहरूको वितरण
              निम्नानुसार रहेको छ:
            </p>
          </div>

          {/* Client component for charts */}
          <MigratedHouseholdCharts
            overallSummary={overallSummary}
            totalHouseholds={totalHouseholds}
            pieChartData={pieChartData}
            wardWiseData={wardWiseData}
            wardNumbers={wardNumbers}
            migratedData={migratedData}
            wardWiseAnalysis={wardWiseAnalysis}
            MIGRATED_FROM_NAMES={MIGRATED_FROM_NAMES}
          />

          <div className="prose prose-slate dark:prose-invert max-w-none mt-8">
            <h2 id="migration-analysis" className="scroll-m-20 border-b pb-2">
              आप्रवासन विश्लेषण
            </h2>
            <p>
              केराबारी गाउँपालिकामा रहेका आप्रवासित परिवारहरूको विश्लेषण
              गर्दा,
              {MIGRATED_FROM_NAMES[overallSummary[0]?.migratedFrom || ""] ||
                overallSummary[0]?.migratedFrom}
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

            {/* Client component for migrated analysis section */}
            <MigratedHouseholdAnalysisSection
              overallSummary={overallSummary}
              totalHouseholds={totalHouseholds}
              wardWiseAnalysis={wardWiseAnalysis}
              MIGRATED_FROM_NAMES={MIGRATED_FROM_NAMES}
              MIGRATED_FROM_NAMES_EN={MIGRATED_FROM_NAMES_EN}
            />
          </div>
        </section>
      </div>
    </DocsLayout>
  );
}
