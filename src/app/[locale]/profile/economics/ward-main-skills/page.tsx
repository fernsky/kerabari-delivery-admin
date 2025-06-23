import { Metadata } from "next";
import { DocsLayout } from "@/components/layout/DocsLayout";
import { TableOfContents } from "@/components/TableOfContents";
import Image from "next/image";
import SkillsCharts from "./_components/skills-charts";
import SkillsSEO from "./_components/skills-seo";
import SkillsAnalysisSection from "./_components/skills-analysis-section";
import { api } from "@/trpc/server";
import { localizeNumber } from "@/lib/utils/localize-number";
import {
  skillLabels,
  SkillType,
} from "@/server/api/routers/profile/economics/ward-wise-major-skills.schema";

// Force dynamic rendering since we're using tRPC which relies on headers
export const dynamic = "force-dynamic";

// Define the locales for which this page should be statically generated
export async function generateStaticParams() {
  return [{ locale: "en" }];
}

// Optional: Add revalidation period if you want to update the static pages periodically
export const revalidate = 86400; // Revalidate once per day (in seconds)

// Define English skill names for SEO
const SKILL_NAMES_EN: Record<string, string> = {
  TEACHING_RELATED: "Teaching Skills",
  PHOTOGRAPHY_RELATED: "Audio-Visual and Photography Skills",
  HANDICRAFT_RELATED: "Handicraft and Art Skills",
  MUSIC_DRAMA_RELATED: "Music, Drama, and Performance Arts",
  STONEWORK_WOODWORK: "Sculpture, Stone Art, and Wood Art",
  CARPENTERY_RELATED: "Carpentry and Masonry Skills",
  PLUMBING: "Plumbing Skills",
  HUMAN_HEALTH_RELATED: "Human Health Services",
  ANIMAL_HEALTH_RELATED: "Veterinary and Animal Health Services",
  ELECTRICITY_INSTALLMENT_RELATED: "Electrical Installation",
  HOTEL_RESTAURANT_RELATED: "Hotel & Restaurant Management",
  AGRICULTURE_RELATED: "Agriculture, Animal Husbandry, Fishery, and Beekeeping",
  PRINTING_RELATED: "Printing Skills",
  DRIVING_RELATED: "Driving Skills",
  MECHANICS_RELATED: "Mechanical Skills",
  FURNITURE_RELATED: "Furniture Making",
  SHOEMAKING_RELATED: "Shoe and Footwear Making",
  SEWING_RELATED: "Garment Making and Tailoring",
  JWELLERY_MAKING_RELATED: "Jewelry Making and Repair",
  BEUATICIAN_RELATED: "Hair Styling and Cosmetics",
  SELF_PROTECTION_RELATED: "Self-Defense and Physical Fitness",
  LAND_SURVEY_RELATED: "Land Surveying",
  COMPUTER_SCIENCE_RELATED: "Computer Science",
  ENGINEERING_DESIGN_RELATED: "Engineering Design",
  RADIO_TELEVISION_ELECTRICAL_REPAIR:
    "Radio, TV, Mobile and Electronic Device Repair",
  LITERARY_CREATION_RELATED: "Literary Creation",
  OTHER: "Other Skills",
  NONE: "No Specific Skills",
};

// This function will generate metadata dynamically based on the actual data
export async function generateMetadata(): Promise<Metadata> {
  try {
    // Fetch data for SEO using tRPC
    const skillsData =
      await api.profile.economics.wardWiseMajorSkills.getAll.query();
    const municipalityName = "गढवा गाउँपालिका"; // Khajura Rural Municipality

    // Process data for SEO
    const totalPopulation = skillsData.reduce(
      (sum, item) => sum + (item.population || 0),
      0,
    );

    // Group by skill type and calculate totals
    const skillCounts: Record<string, number> = {};
    skillsData.forEach((item) => {
      if (!skillCounts[item.skill]) skillCounts[item.skill] = 0;
      skillCounts[item.skill] += item.population || 0;
    });

    // Get top 3 skills for keywords
    const topSkills = Object.entries(skillCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([type]) => type);

    // Create rich keywords with actual data
    const keywordsNP = [
      "गढवा गाउँपालिका सीप र दक्षता",
      "गढवा स्थानीय सीप",
      `गढवा ${skillLabels[topSkills[0]]} जनसंख्या`,
      ...topSkills.map((s) => `${skillLabels[s]} सीप गढवा`),
      "वडा अनुसार सीप वितरण",
      "आर्थिक दक्षता तथ्याङ्क",
      "सीप सर्वेक्षण गढवा",
      `गढवा कुल दक्ष जनसंख्या ${localizeNumber(totalPopulation.toString(), "ne")}`,
    ];

    const keywordsEN = [
      "Khajura Rural Municipality skills and abilities",
      "Khajura local skills",
      `Khajura ${SKILL_NAMES_EN[topSkills[0]]} population`,
      ...topSkills.map((s) => `${SKILL_NAMES_EN[s]} in Khajura`),
      "Ward-wise skills distribution",
      "Economic skills statistics",
      "Skills survey Khajura",
      `Khajura total skilled population ${totalPopulation}`,
    ];

    // Create detailed description with actual data
    const descriptionNP = `गढवा गाउँपालिकाको वडा अनुसार प्रमुख सीप र दक्षताहरूको वितरण, प्रवृत्ति र विश्लेषण। कुल दक्ष जनसंख्या ${localizeNumber(totalPopulation.toString(), "ne")} मध्ये ${skillLabels[topSkills[0]]} (${localizeNumber(skillCounts[topSkills[0]].toString(), "ne")}) सबैभन्दा ठूलो समूह हो, त्यसपछि ${skillLabels[topSkills[1]]} (${localizeNumber(skillCounts[topSkills[1]].toString(), "ne")}) र ${skillLabels[topSkills[2]]} (${localizeNumber(skillCounts[topSkills[2]].toString(), "ne")})। विभिन्न सीपहरूको विस्तृत तथ्याङ्क र विजुअलाइजेसन।`;

    const descriptionEN = `Ward-wise major skills distribution, trends and analysis for Khajura Rural Municipality. Out of a total skilled population of ${totalPopulation}, ${SKILL_NAMES_EN[topSkills[0]]} (${skillCounts[topSkills[0]]}) is the largest group, followed by ${SKILL_NAMES_EN[topSkills[1]]} (${skillCounts[topSkills[1]]}) and ${SKILL_NAMES_EN[topSkills[2]]} (${skillCounts[topSkills[2]]})। Detailed statistics and visualizations of various skills.`;

    return {
      title: `प्रमुख सीप र दक्षता | ${municipalityName} पालिका प्रोफाइल`,
      description: descriptionNP,
      keywords: [...keywordsNP, ...keywordsEN],
      alternates: {
        canonical: "/profile/economics/ward-main-skills",
        languages: {
          en: "/en/profile/economics/ward-main-skills",
          ne: "/ne/profile/economics/ward-main-skills",
        },
      },
      openGraph: {
        title: `प्रमुख सीप र दक्षता | ${municipalityName}`,
        description: descriptionNP,
        type: "article",
        locale: "ne_NP",
        alternateLocale: "en_US",
        siteName: `${municipalityName} डिजिटल प्रोफाइल`,
      },
      twitter: {
        card: "summary_large_image",
        title: `प्रमुख सीप र दक्षता | ${municipalityName}`,
        description: descriptionNP,
      },
    };
  } catch (error) {
    // Fallback metadata if data fetching fails
    return {
      title: "प्रमुख सीप र दक्षता | पालिका प्रोफाइल",
      description:
        "वडा अनुसार प्रमुख सीप र दक्षताहरूको वितरण, प्रवृत्ति र विश्लेषण। विभिन्न सीपहरूको विस्तृत तथ्याङ्क र विजुअलाइजेसन।",
    };
  }
}

const toc = [
  { level: 2, text: "परिचय", slug: "introduction" },
  { level: 2, text: "सीप अनुसार जनसंख्या", slug: "skills-distribution" },
  { level: 2, text: "वडा अनुसार सीप विविधता", slug: "ward-wise-skills" },
  { level: 2, text: "प्रमुख सीपहरूको विश्लेषण", slug: "major-skills" },
  { level: 2, text: "तथ्याङ्क स्रोत", slug: "data-source" },
];

export default async function WardMainSkillsPage() {
  // Fetch all skills data using tRPC
  const skillsData =
    await api.profile.economics.wardWiseMajorSkills.getAll.query();

  // Try to fetch summary data
  let summaryData = null;
  try {
    summaryData =
      await api.profile.economics.wardWiseMajorSkills.summary.query();
  } catch (error) {
    console.error("Could not fetch summary data", error);
  }

  // Process data for overall summary
  const overallSummary = Object.entries(
    skillsData.reduce((acc: Record<string, number>, item) => {
      if (!acc[item.skill]) acc[item.skill] = 0;
      acc[item.skill] += item.population || 0;
      return acc;
    }, {}),
  )
    .map(([skill, population]) => ({
      skill,
      skillName: skillLabels[skill] || skill,
      population,
    }))
    .sort((a, b) => b.population - a.population);

  // Calculate total population for percentages
  const totalPopulation = overallSummary.reduce(
    (sum, item) => sum + item.population,
    0,
  );

  // Take top 10 skills for pie chart, group others
  const topSkills = overallSummary.slice(0, 10);
  const otherSkills = overallSummary.slice(10);

  const otherTotalPopulation = otherSkills.reduce(
    (sum, item) => sum + item.population,
    0,
  );

  let pieChartData = topSkills.map((item) => ({
    name: item.skillName,
    value: item.population,
    percentage: ((item.population / totalPopulation) * 100).toFixed(2),
  }));

  // Add "Other" category if there are more than 10 skills
  if (otherSkills.length > 0) {
    pieChartData.push({
      name: "अन्य",
      value: otherTotalPopulation,
      percentage: ((otherTotalPopulation / totalPopulation) * 100).toFixed(2),
    });
  }

  // Get unique ward numbers
  const wardNumbers = Array.from(
    new Set(skillsData.map((item) => item.wardNumber)),
  ).sort((a, b) => a - b); // Sort numerically

  // Process data for ward-wise visualization (top 5 skills per ward + others)
  const wardWiseData = wardNumbers.map((wardNumber) => {
    const wardData = skillsData.filter(
      (item) => item.wardNumber === wardNumber,
    );

    // Sort ward data by population
    wardData.sort((a, b) => (b.population || 0) - (a.population || 0));

    // Take top 5 skills for this ward
    const topWardSkills = wardData.slice(0, 5);
    const otherWardSkills = wardData.slice(5);
    const otherWardTotal = otherWardSkills.reduce(
      (sum, item) => sum + (item.population || 0),
      0,
    );

    const result: Record<string, any> = { ward: `वडा ${wardNumber}` };

    // Add top skills
    topWardSkills.forEach((item) => {
      result[skillLabels[item.skill] || item.skill] = item.population;
    });

    // Add "Other" category if needed
    if (otherWardSkills.length > 0) {
      result["अन्य"] = otherWardTotal;
    }

    return result;
  });

  return (
    <DocsLayout toc={<TableOfContents toc={toc} />}>
      {/* Add structured data for SEO */}
      <SkillsSEO
        overallSummary={overallSummary}
        totalPopulation={totalPopulation}
        skillLabels={skillLabels}
        SKILL_NAMES_EN={SKILL_NAMES_EN}
        wardNumbers={wardNumbers}
      />

      <div className="flex flex-col gap-8">
        <section>
          <div className="relative rounded-lg overflow-hidden mb-8">
            <Image
              src="/images/skills-diversity.svg"
              width={1200}
              height={400}
              alt="प्रमुख सीप र दक्षता - गढवा गाउँपालिका (Major Skills - Khajura Rural Municipality)"
              className="w-full h-[250px] object-cover rounded-sm"
              priority
            />
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h1 className="scroll-m-20 tracking-tight mb-6">
              गढवा गाउँपालिकामा प्रमुख सीप र दक्षता
            </h1>

            <h2 id="introduction" className="scroll-m-20">
              परिचय
            </h2>
            <p>
              यस खण्डमा गढवा गाउँपालिकाको विभिन्न वडाहरूमा रहेका नागरिकहरूको
              प्रमुख सीप र दक्षता सम्बन्धी विस्तृत तथ्याङ्क प्रस्तुत गरिएको छ।
              यो तथ्याङ्कले स्थानीय रोजगार क्षमता, आर्थिक अवसर र सामानजिक
              पूँजीको संरचनालाई प्रतिबिम्बित गर्दछ।
            </p>
            <p>
              गढवा गाउँपालिकामा विभिन्न प्रकारका सीप र दक्षता भएका नागरिकहरू
              बसोबास गर्दछन्। कुल जनसंख्या{" "}
              {localizeNumber(totalPopulation.toLocaleString(), "ne")} मध्ये{" "}
              {overallSummary[0]?.skillName || ""} क्षेत्रमा सीप भएका व्यक्तिहरू{" "}
              {localizeNumber(
                (
                  ((overallSummary[0]?.population || 0) / totalPopulation) *
                  100
                ).toFixed(1),
                "ne",
              )}
              % रहेका छन्। यस तथ्याङ्कले स्थानीय रोजगारी सृजना, सीप विकास
              कार्यक्रम र व्यावसायिक तालिमको दिशानिर्देशमा सहयोग पुर्‍याउँछ।
            </p>

            <h2 id="skills-distribution" className="scroll-m-20 border-b pb-2">
              सीप अनुसार जनसंख्या
            </h2>
            <p>
              गढवा गाउँपालिकामा विभिन्न सीप र दक्षता भएका नागरिकहरूको संख्या
              निम्नानुसार छ:
            </p>
          </div>

          {/* Client component for charts */}
          <SkillsCharts
            overallSummary={overallSummary}
            totalPopulation={totalPopulation}
            pieChartData={pieChartData}
            wardWiseData={wardWiseData}
            wardNumbers={wardNumbers}
            skillsData={skillsData}
            skillLabels={skillLabels}
            SKILL_NAMES_EN={SKILL_NAMES_EN}
          />

          <div className="prose prose-slate dark:prose-invert max-w-none mt-8">
            <h2 id="major-skills" className="scroll-m-20 border-b pb-2">
              प्रमुख सीपहरूको विश्लेषण
            </h2>
            <p>
              गढवा गाउँपालिकामा विभिन्न किसिमका सीपहरू उपलब्ध छन्। यी सीपहरू
              मध्ये{" "}
              {skillLabels[
                overallSummary[0]?.skill as keyof typeof skillLabels
              ] || "कृषि"}{" "}
              सम्बन्धी सीप सबैभन्दा धेरै नागरिकहरूसँग रहेको छ, जुन कुल दक्ष
              जनसंख्याको{" "}
              {localizeNumber(
                (
                  ((overallSummary[0]?.population || 0) / totalPopulation) *
                  100
                ).toFixed(2),
                "ne",
              )}
              % हो।
            </p>

            {/* Client component for skills analysis section */}
            <SkillsAnalysisSection
              overallSummary={overallSummary}
              totalPopulation={totalPopulation}
              skillLabels={skillLabels}
              SKILL_NAMES_EN={SKILL_NAMES_EN}
            />
          </div>
        </section>
      </div>
    </DocsLayout>
  );
}
