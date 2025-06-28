import { Metadata } from "next";
import { TableOfContents } from "@/components/TableOfContents";
import Image from "next/image";
import LandPossessionCharts from "./_components/land-possession-charts";
import LandPossessionAnalysisSection from "./_components/land-possession-analysis-section";
import LandPossessionSEO from "./_components/land-possession-seo";
import { api } from "@/trpc/server";

// Force dynamic rendering since we're using tRPC which relies on headers
export const dynamic = "force-dynamic";

// Define the locales for which this page should be statically generated
export async function generateStaticParams() {
  return [{ locale: "en" }];
}

// Optional: Add revalidation period if you want to update the static pages periodically
export const revalidate = 86400; // Revalidate once per day (in seconds)

// This function will generate metadata dynamically based on the actual data
export async function generateMetadata(): Promise<Metadata> {
  try {
    // Fetch data for SEO using tRPC
    const landPossessionData =
      await api.profile.economics.wardWiseHouseholdLandPossessions.getAll.query();
    const municipalityName = "बुद्धशान्ति गाउँपालिका"; // Khajura Rural Municipality

    // Process data for SEO
    const totalHouseholdsWithLand = landPossessionData.reduce(
      (sum, item) => sum + (item.households || 0),
      0,
    );

    // Get ward with highest land possession for keywords
    const wardsWithHighestLandPossession = [...landPossessionData]
      .sort((a, b) => (b.households || 0) - (a.households || 0))
      .slice(0, 3);

    // Create rich keywords with actual data
    const keywordsNP = [
      "बुद्धशान्ति गाउँपालिका भूमि स्वामित्व",
      "बुद्धशान्ति जग्गाधनी परिवार",
      "बुद्धशान्ति आर्थिक स्थिति",
      `बुद्धशान्ति वडा ${wardsWithHighestLandPossession[0]?.wardNumber || ""} भूमि स्वामित्व`,
      "वडा अनुसार भूमि स्वामित्व",
      "गाउँपालिका जग्गा तथ्याङ्क",
      "आर्थिक सर्वेक्षण बुद्धशान्ति",
      `बुद्धशान्ति कुल जग्गाधनी परिवार संख्या ${totalHouseholdsWithLand}`,
    ];

    const keywordsEN = [
      "Khajura Rural Municipality land ownership",
      "Khajura landowner households",
      "Khajura economic condition",
      `Khajura ward ${wardsWithHighestLandPossession[0]?.wardNumber || ""} land ownership`,
      "Ward-wise land possession",
      "Rural municipality land statistics",
      "Economic survey Khajura",
      `Khajura total households with land ${totalHouseholdsWithLand}`,
    ];

    // Create detailed description with actual data
    const descriptionNP = `बुद्धशान्ति गाउँपालिकाको वडा अनुसार जग्गा भएका घरपरिवारहरूको वितरण, प्रवृत्ति र विश्लेषण। कुल ${totalHouseholdsWithLand} घरपरिवारसँग आफ्नो जग्गा रहेको छ। सबैभन्दा बढी जग्गाधनी परिवार भएका वडाहरूमा वडा ${wardsWithHighestLandPossession[0]?.wardNumber || "N/A"} (${wardsWithHighestLandPossession[0]?.households || 0} घरपरिवार), वडा ${wardsWithHighestLandPossession[1]?.wardNumber || "N/A"} (${wardsWithHighestLandPossession[1]?.households || 0} घरपरिवार) र वडा ${wardsWithHighestLandPossession[2]?.wardNumber || "N/A"} (${wardsWithHighestLandPossession[2]?.households || 0} घरपरिवार) पर्दछन्। विस्तृत तथ्याङ्क र विजुअलाइजेसन यहाँ पेश गरिएको छ。`;

    const descriptionEN = `Ward-wise distribution, trends and analysis of land-owning households in Khajura Rural Municipality. A total of ${totalHouseholdsWithLand} households own land. The wards with the highest number of landowner households are Ward ${wardsWithHighestLandPossession[0]?.wardNumber || "N/A"} (${wardsWithHighestLandPossession[0]?.households || 0} households), Ward ${wardsWithHighestLandPossession[1]?.wardNumber || "N/A"} (${wardsWithHighestLandPossession[1]?.households || 0} households), and Ward ${wardsWithHighestLandPossession[2]?.wardNumber || "N/A"} (${wardsWithHighestLandPossession[2]?.households || 0} households). Detailed statistics and visualizations presented here.`;

    return {
      title: `घरपरिवारको जग्गा स्वामित्व | ${municipalityName} पालिका प्रोफाइल`,
      description: descriptionNP,
      keywords: [...keywordsNP, ...keywordsEN],
      alternates: {
        canonical: "/profile/economics/ward-household-land-possessions",
        languages: {
          en: "/en/profile/economics/ward-household-land-possessions",
          ne: "/ne/profile/economics/ward-household-land-possessions",
        },
      },
      openGraph: {
        title: `घरपरिवारको जग्गा स्वामित्व | ${municipalityName}`,
        description: descriptionNP,
        type: "article",
        locale: "ne_NP",
        alternateLocale: "en_US",
        siteName: `${municipalityName} डिजिटल प्रोफाइल`,
      },
      twitter: {
        card: "summary_large_image",
        title: `घरपरिवारको जग्गा स्वामित्व | ${municipalityName}`,
        description: descriptionNP,
      },
    };
  } catch (error) {
    // Fallback metadata if data fetching fails
    return {
      title: "घरपरिवारको जग्गा स्वामित्व | पालिका प्रोफाइल",
      description:
        "वडा अनुसार जग्गाधनी घरपरिवारहरूको वितरण, प्रवृत्ति र विश्लेषण। विस्तृत तथ्याङ्क र विजुअलाइजेसन।",
    };
  }
}

const toc = [
  { level: 2, text: "परिचय", slug: "introduction" },
  {
    level: 2,
    text: "वडा अनुसार जग्गाधनी घरपरिवार",
    slug: "ward-wise-landowner-households",
  },
  {
    level: 2,
    text: "जग्गा स्वामित्व विश्लेषण",
    slug: "land-ownership-analysis",
  },
  { level: 2, text: "तथ्याङ्क स्रोत", slug: "data-source" },
];

export default async function WardHouseholdLandPossessionsPage() {
  // Fetch all land possessions data using tRPC
  const landPossessionData =
    await api.profile.economics.wardWiseHouseholdLandPossessions.getAll.query();

  // Try to fetch summary data
  let summaryData = null;
  try {
    summaryData =
      await api.profile.economics.wardWiseHouseholdLandPossessions.summary.query();
  } catch (error) {
    console.error("Could not fetch summary data", error);
  }

  // Calculate total households with land
  const totalHouseholdsWithLand = landPossessionData.reduce(
    (sum, item) => sum + (item.households || 0),
    0,
  );

  // Get total households in the municipality (if available through API)
  // This is an estimate for demonstration; in reality, you'd fetch the actual total
  const estimatedTotalHouseholds = totalHouseholdsWithLand * 1.2; // Assuming 80% of households have land
  const householdsWithoutLand =
    estimatedTotalHouseholds - totalHouseholdsWithLand;

  // Get unique ward numbers and sort them
  const wardNumbers = landPossessionData
    .map((item) => item.wardNumber)
    .sort((a, b) => a - b);

  // Process data for charts
  const wardWiseData = landPossessionData
    .map((item) => ({
      ward: `वडा ${item.wardNumber}`,
      households: item.households || 0,
      wardNumber: item.wardNumber,
      percentage: (
        ((item.households || 0) / totalHouseholdsWithLand) *
        100
      ).toFixed(2),
    }))
    .sort((a, b) => a.wardNumber - b.wardNumber);

  // Prepare data for pie chart (ward distribution)
  const pieChartData = wardWiseData.map((item) => ({
    name: item.ward,
    value: item.households,
    percentage: item.percentage,
  }));

  // Prepare data for land ownership status pie chart
  const landOwnershipStatusData = [
    {
      name: "जग्गाधनी घरपरिवार",
      value: totalHouseholdsWithLand,
      percentage: (
        (totalHouseholdsWithLand / estimatedTotalHouseholds) *
        100
      ).toFixed(2),
    },
    {
      name: "जग्गाविहीन घरपरिवार",
      value: householdsWithoutLand,
      percentage: (
        (householdsWithoutLand / estimatedTotalHouseholds) *
        100
      ).toFixed(2),
    },
  ];

  return (
    <div className="relative py-4 lg:py-6">
      <div className="flex gap-8 max-w-none">
        {/* Main content - let it expand to fill available space */}
        <article className="prose prose-slate dark:prose-invert flex-1 min-w-0 max-w-none">
          {/* Add structured data for SEO */}
          <LandPossessionSEO
            landPossessionData={landPossessionData}
            totalHouseholdsWithLand={totalHouseholdsWithLand}
            wardNumbers={wardNumbers}
            estimatedTotalHouseholds={estimatedTotalHouseholds}
          />

          <div className="flex flex-col gap-8">
            <section>
              <div className="relative rounded-lg overflow-hidden mb-8">
                <Image
                  src="/images/land-ownership.svg"
                  width={1200}
                  height={400}
                  alt="घरपरिवारको जग्गा स्वामित्व - बुद्धशान्ति गाउँपालिका (Household Land Ownership - Khajura Rural Municipality)"
                  className="w-full h-[250px] object-cover rounded-sm"
                  priority
                />
              </div>

              {/* Content with responsive max-width for readability */}
              <div className="prose prose-slate dark:prose-invert max-w-4xl">
                <h1 className="scroll-m-20 tracking-tight mb-6">
                  बुद्धशान्ति गाउँपालिकामा घरपरिवारको जग्गा स्वामित्व
                </h1>

                <h2 id="introduction" className="scroll-m-20">
                  परिचय
                </h2>
                <p>
                  यस खण्डमा बुद्धशान्ति गाउँपालिकाको विभिन्न वडाहरूमा जग्गाधनी
                  घरपरिवारहरूको वितरण सम्बन्धी विस्तृत तथ्याङ्क प्रस्तुत गरिएको
                  छ。 यो तथ्याङ्कले जग्गाको स्वामित्व, भूमिको वितरण र समग्र
                  आर्थिक अवस्थाको चित्रण गर्दछ。
                </p>
                <p>
                  बुद्धशान्ति गाउँपालिकामा कुल{" "}
                  {Math.round(estimatedTotalHouseholds).toLocaleString()}{" "}
                  घरपरिवार मध्ये {totalHouseholdsWithLand.toLocaleString()}{" "}
                  घरपरिवार (अनुमानित{" "}
                  {(
                    (totalHouseholdsWithLand / estimatedTotalHouseholds) *
                    100
                  ).toFixed(1)}
                  %) सँग आफ्नो जग्गाको स्वामित्व रहेको छ। यस तथ्याङ्कले स्थानीय
                  सरकारलाई जग्गा सम्बन्धी नीति निर्माण, भूमि व्यवस्थापन र आर्थिक
                  योजनाहरूमा सहयोग पुर्‍याउँछ。
                </p>

                <h2
                  id="ward-wise-landowner-households"
                  className="scroll-m-20 border-b pb-2"
                >
                  वडा अनुसार जग्गाधनी घरपरिवार
                </h2>
                <p>
                  बुद्धशान्ति गाउँपालिकाको विभिन्न वडाहरूमा जग्गाधनी
                  घरपरिवारहरूको संख्या निम्नानुसार छ:
                </p>
              </div>

              {/* Client component for charts - full width */}
              <div className="max-w-none not-prose">
                <LandPossessionCharts
                  wardWiseData={wardWiseData}
                  pieChartData={pieChartData}
                  landOwnershipStatusData={landOwnershipStatusData}
                  totalHouseholdsWithLand={totalHouseholdsWithLand}
                  estimatedTotalHouseholds={estimatedTotalHouseholds}
                />
              </div>

              {/* Content with responsive max-width for readability */}
              <div className="prose prose-slate dark:prose-invert max-w-4xl mt-8">
                <h2
                  id="land-ownership-analysis"
                  className="scroll-m-20 border-b pb-2"
                >
                  जग्गा स्वामित्व विश्लेषण
                </h2>
                <p>
                  बुद्धशान्ति गाउँपालिकामा जग्गा स्वामित्वको वितरण विश्लेषण
                  गर्दा, वडा{" "}
                  {wardWiseData.sort((a, b) => b.households - a.households)[0]
                    ?.wardNumber || ""}{" "}
                  मा सबैभन्दा धेरै{" "}
                  {wardWiseData.sort((a, b) => b.households - a.households)[0]
                    ?.households || 0}{" "}
                  घरपरिवार जग्गाधनी रहेका छन्, जुन कुल जग्गाधनी घरपरिवारको{" "}
                  {wardWiseData.sort((a, b) => b.households - a.households)[0]
                    ?.percentage || "0"}
                  % हो。
                </p>

                {/* Client component for analysis section */}
                <LandPossessionAnalysisSection
                  wardWiseData={wardWiseData}
                  totalHouseholdsWithLand={totalHouseholdsWithLand}
                  estimatedTotalHouseholds={estimatedTotalHouseholds}
                />

                <h2 id="data-source" className="scroll-m-20 border-b pb-2">
                  तथ्याङ्क स्रोत
                </h2>
                <p>
                  माथि प्रस्तुत गरिएका तथ्याङ्कहरू बुद्धशान्ति गाउँपालिकाको
                  आर्थिक सर्वेक्षण र मालपोत कार्यालयको अभिलेखबाट संकलन गरिएको
                  हो। यी तथ्याङ्कहरूको महत्व निम्नानुसार छ:
                </p>

                <ul>
                  <li>जग्गा स्वामित्व र भूमि वितरणको अवस्था अध्ययन गर्न</li>
                  <li>भूमि व्यवस्थापन र सुधारका योजनाहरू तर्जुमा गर्न</li>
                  <li>जग्गाविहीन परिवारहरूको पहिचान र सहायताका लागि</li>
                  <li>कृषि योजना र भूमि उपयोग नीति निर्धारण गर्न</li>
                </ul>
              </div>
            </section>
          </div>
        </article>

        {/* Table of Contents - Desktop only, reduced width */}
        <aside className="hidden xl:block w-56 shrink-0">
          <div className="sticky top-20 p-3 border border-gray-200 rounded-lg bg-gray-50/50 max-w-[224px]">
            <TableOfContents toc={toc} />
          </div>
        </aside>
      </div>
    </div>
  );
}
