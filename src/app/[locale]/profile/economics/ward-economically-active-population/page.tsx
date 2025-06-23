import { Metadata } from "next";
import { DocsLayout } from "@/components/layout/DocsLayout";
import { TableOfContents } from "@/components/TableOfContents";
import Image from "next/image";
import EconomicallyActiveCharts from "./_components/economically-active-charts";
import EconomicallyActiveAnalysisSection from "./_components/economically-active-analysis-section";
import EconomicallyActiveSEO from "./_components/economically-active-seo";
import { api } from "@/trpc/server";
import {
  EconomicallyActiveAgeGroup,
  Gender,
} from "@/server/api/routers/profile/economics/ward-age-gender-wise-economically-active-population.schema";

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
    const economicallyActiveData =
      await api.profile.economics.wardAgeGenderWiseEconomicallyActivePopulation.getAll.query();
    const municipalityName = "गढवा गाउँपालिका"; // Khajura Rural Municipality

    // Process data for SEO
    const totalPopulation = economicallyActiveData.reduce(
      (sum, item) => sum + (item.population || 0),
      0,
    );

    // Group by age group and calculate totals
    const ageGroupCounts: Record<string, number> = {};
    economicallyActiveData.forEach((item) => {
      if (!ageGroupCounts[item.ageGroup]) ageGroupCounts[item.ageGroup] = 0;
      ageGroupCounts[item.ageGroup] += item.population || 0;
    });

    // Group by gender and calculate totals
    const genderCounts: Record<string, number> = {};
    economicallyActiveData.forEach((item) => {
      if (!genderCounts[item.gender]) genderCounts[item.gender] = 0;
      genderCounts[item.gender] += item.population || 0;
    });

    // Define age group and gender names in both languages
    const AGE_GROUP_NAMES_NP: Record<string, string> = {
      AGE_0_TO_14: "०-१४ वर्ष",
      AGE_15_TO_59: "१५-५९ वर्ष",
      AGE_60_PLUS: "६० वर्ष माथि",
    };

    const AGE_GROUP_NAMES_EN: Record<string, string> = {
      AGE_0_TO_14: "0-14 years",
      AGE_15_TO_59: "15-59 years",
      AGE_60_PLUS: "60+ years",
    };

    const GENDER_NAMES_NP: Record<string, string> = {
      MALE: "पुरुष",
      FEMALE: "महिला",
      OTHER: "अन्य",
    };

    const GENDER_NAMES_EN: Record<string, string> = {
      MALE: "Male",
      FEMALE: "Female",
      OTHER: "Other",
    };

    // Calculate working age population (15-59)
    const workingAgePopulation = ageGroupCounts["AGE_15_TO_59"] || 0;
    const workingAgePercentage =
      totalPopulation > 0
        ? ((workingAgePopulation / totalPopulation) * 100).toFixed(2)
        : "0";

    // Create rich keywords with actual data
    const keywordsNP = [
      "गढवा गाउँपालिका आर्थिक रूपमा सक्रिय जनसंख्या",
      "गढवा वडागत आर्थिक जनसंख्या",
      "जनसांख्यिकी वर्गीकरण गढवा",
      "कार्यसक्षम उमेर समूह",
      "लिङ्ग अनुसार आर्थिक जनसंख्या",
      "आर्थिक सक्रियता विश्लेषण",
      "१५-५९ वर्ष उमेर जनसंख्या",
      `गढवा कुल आर्थिक जनसंख्या ${totalPopulation}`,
    ];

    const keywordsEN = [
      "Khajura Rural Municipality economically active population",
      "Khajura ward-wise economic demographics",
      "Demographic classification Khajura",
      "Working age group",
      "Gender-wise economic population",
      "Economic activity analysis",
      "15-59 age group population",
      `Khajura total economically active population ${totalPopulation}`,
    ];

    // Create detailed description with actual data
    const descriptionNP = `गढवा गाउँपालिकाको वडा अनुसार आर्थिक रूपमा सक्रिय जनसंख्या वितरण, उमेर र लिङ्ग अनुसार वर्गीकरण तथा विश्लेषण। कुल ${totalPopulation} जनसंख्या मध्ये कार्यसक्षम उमेर समूह (१५-५९ वर्ष) ${workingAgePopulation} जना (${workingAgePercentage}%) छन्। लिङ्ग अनुसार ${GENDER_NAMES_NP["MALE"]} ${genderCounts["MALE"] || 0}, ${GENDER_NAMES_NP["FEMALE"]} ${genderCounts["FEMALE"] || 0}, र ${GENDER_NAMES_NP["OTHER"]} ${genderCounts["OTHER"] || 0} रहेका छन्। विस्तृत तथ्याङ्क र विजुअलाइजेसन सहित।`;

    const descriptionEN = `Ward-wise economically active population distribution, age and gender classification, and analysis for Khajura Rural Municipality. Out of a total ${totalPopulation} population, the working-age group (15-59 years) comprises ${workingAgePopulation} people (${workingAgePercentage}%). Gender distribution shows ${GENDER_NAMES_EN["MALE"]} ${genderCounts["MALE"] || 0}, ${GENDER_NAMES_EN["FEMALE"]} ${genderCounts["FEMALE"] || 0}, and ${GENDER_NAMES_EN["OTHER"]} ${genderCounts["OTHER"] || 0}. Includes detailed statistics and visualizations.`;

    return {
      title: `आर्थिक रूपमा सक्रिय जनसंख्या | ${municipalityName} पालिका प्रोफाइल`,
      description: descriptionNP,
      keywords: [...keywordsNP, ...keywordsEN],
      alternates: {
        canonical: "/profile/economics/ward-economically-active-population",
        languages: {
          en: "/en/profile/economics/ward-economically-active-population",
          ne: "/ne/profile/economics/ward-economically-active-population",
        },
      },
      openGraph: {
        title: `आर्थिक रूपमा सक्रिय जनसंख्या | ${municipalityName}`,
        description: descriptionNP,
        type: "article",
        locale: "ne_NP",
        alternateLocale: "en_US",
        siteName: `${municipalityName} डिजिटल प्रोफाइल`,
      },
      twitter: {
        card: "summary_large_image",
        title: `आर्थिक रूपमा सक्रिय जनसंख्या | ${municipalityName}`,
        description: descriptionNP,
      },
    };
  } catch (error) {
    // Fallback metadata if data fetching fails
    return {
      title: "आर्थिक रूपमा सक्रिय जनसंख्या | पालिका प्रोफाइल",
      description:
        "वडा अनुसार आर्थिक रूपमा सक्रिय जनसंख्या वितरण, उमेर र लिङ्ग अनुसार वर्गीकरण तथा विश्लेषण। कार्यसक्षम उमेर समूह र लिङ्ग अनुसारको विस्तृत तथ्याङ्क र विजुअलाइजेसन।",
    };
  }
}

const toc = [
  { level: 2, text: "परिचय", slug: "introduction" },
  { level: 2, text: "उमेर समूह अनुसार वितरण", slug: "age-group-distribution" },
  { level: 2, text: "लिङ्ग अनुसार वितरण", slug: "gender-distribution" },
  { level: 2, text: "वडा अनुसार वितरण", slug: "ward-wise-distribution" },
  { level: 2, text: "विश्लेषण", slug: "analysis" },
  { level: 2, text: "तथ्याङ्क स्रोत", slug: "data-source" },
];

// Define Nepali names for age groups and genders
const AGE_GROUP_NAMES: Record<string, string> = {
  AGE_0_TO_14: "०-१४ वर्ष",
  AGE_15_TO_59: "१५-५९ वर्ष",
  AGE_60_PLUS: "६० वर्ष माथि",
};

const GENDER_NAMES: Record<string, string> = {
  MALE: "पुरुष",
  FEMALE: "महिला",
  OTHER: "अन्य",
};

export default async function WardEconomicallyActivePopulationPage() {
  // Fetch all economically active population data using tRPC
  const economicallyActiveData =
    await api.profile.economics.wardAgeGenderWiseEconomicallyActivePopulation.getAll.query();

  // Try to fetch summary data
  let summaryData = null;
  try {
    summaryData =
      await api.profile.economics.wardAgeGenderWiseEconomicallyActivePopulation.summary.query();
  } catch (error) {
    console.error("Could not fetch summary data", error);
  }

  // Process data for overall summary by age group
  const ageGroupSummary = Object.entries(
    economicallyActiveData.reduce((acc: Record<string, number>, item) => {
      if (!acc[item.ageGroup]) acc[item.ageGroup] = 0;
      acc[item.ageGroup] += item.population || 0;
      return acc;
    }, {}),
  )
    .map(([ageGroup, population]) => ({
      ageGroup,
      ageGroupName: AGE_GROUP_NAMES[ageGroup] || ageGroup,
      population,
    }))
    .sort((a, b) => {
      // Custom sort to maintain the age group order
      const order = ["AGE_0_TO_14", "AGE_15_TO_59", "AGE_60_PLUS"];
      return order.indexOf(a.ageGroup) - order.indexOf(b.ageGroup);
    });

  // Process data for overall summary by gender
  const genderSummary = Object.entries(
    economicallyActiveData.reduce((acc: Record<string, number>, item) => {
      if (!acc[item.gender]) acc[item.gender] = 0;
      acc[item.gender] += item.population || 0;
      return acc;
    }, {}),
  )
    .map(([gender, population]) => ({
      gender,
      genderName: GENDER_NAMES[gender] || gender,
      population,
    }))
    .sort((a, b) => b.population - a.population);

  // Calculate total population for percentages
  const totalPopulation = ageGroupSummary.reduce(
    (sum, item) => sum + item.population,
    0,
  );

  // Prepare data for age group pie chart
  const ageGroupPieChartData = ageGroupSummary.map((item) => ({
    name: item.ageGroupName,
    value: item.population,
    percentage: ((item.population / totalPopulation) * 100).toFixed(2),
  }));

  // Prepare data for gender pie chart
  const genderPieChartData = genderSummary.map((item) => ({
    name: item.genderName,
    value: item.population,
    percentage: ((item.population / totalPopulation) * 100).toFixed(2),
  }));

  // Get unique ward numbers
  const wardNumbers = Array.from(
    new Set(economicallyActiveData.map((item) => item.wardNumber)),
  ).sort((a, b) => a - b); // Sort numerically

  // Create ward-wise data for visualization
  const wardWiseData = wardNumbers.map((wardNumber) => {
    const wardItems = economicallyActiveData.filter(
      (item) => item.wardNumber === wardNumber,
    );

    const result: Record<string, any> = { ward: `वडा ${wardNumber}` };

    // Calculate totals by age group for this ward
    const wardAgeGroupSummary = Object.entries(
      wardItems.reduce((acc: Record<string, number>, item) => {
        if (!acc[item.ageGroup]) acc[item.ageGroup] = 0;
        acc[item.ageGroup] += item.population || 0;
        return acc;
      }, {}),
    ).map(([ageGroup, population]) => ({
      ageGroup,
      ageGroupName: AGE_GROUP_NAMES[ageGroup] || ageGroup,
      population,
    }));

    // Add age group populations to result
    wardAgeGroupSummary.forEach((item) => {
      result[item.ageGroupName] = item.population;
    });

    return result;
  });

  // Process data for ward-wise gender visualization
  const wardWiseGenderData = wardNumbers.map((wardNumber) => {
    const wardItems = economicallyActiveData.filter(
      (item) => item.wardNumber === wardNumber,
    );

    const result: Record<string, any> = { ward: `वडा ${wardNumber}` };

    // Calculate totals by gender for this ward
    const wardGenderSummary = Object.entries(
      wardItems.reduce((acc: Record<string, number>, item) => {
        if (!acc[item.gender]) acc[item.gender] = 0;
        acc[item.gender] += item.population || 0;
        return acc;
      }, {}),
    ).map(([gender, population]) => ({
      gender,
      genderName: GENDER_NAMES[gender] || gender,
      population,
    }));

    // Add gender populations to result
    wardGenderSummary.forEach((item) => {
      result[item.genderName] = item.population;
    });

    return result;
  });

  // Calculate dependency ratio (ratio of non-working age to working age population)
  const workingAgePopulation =
    ageGroupSummary.find((item) => item.ageGroup === "AGE_15_TO_59")
      ?.population || 0;

  const nonWorkingAgePopulation = ageGroupSummary.reduce(
    (sum, item) =>
      item.ageGroup === "AGE_0_TO_14" || item.ageGroup === "AGE_60_PLUS"
        ? sum + item.population
        : sum,
    0,
  );

  const dependencyRatio =
    workingAgePopulation > 0
      ? ((nonWorkingAgePopulation / workingAgePopulation) * 100).toFixed(2)
      : "0";

  return (
    <DocsLayout toc={<TableOfContents toc={toc} />}>
      {/* Add structured data for SEO */}
      <EconomicallyActiveSEO
        ageGroupSummary={ageGroupSummary}
        genderSummary={genderSummary}
        totalPopulation={totalPopulation}
        AGE_GROUP_NAMES={AGE_GROUP_NAMES}
        GENDER_NAMES={GENDER_NAMES}
        wardNumbers={wardNumbers}
        dependencyRatio={dependencyRatio}
      />

      <div className="flex flex-col gap-8">
        <section>
          <div className="relative rounded-lg overflow-hidden mb-8">
            <Image
              src="/images/economically-active.svg"
              width={1200}
              height={400}
              alt="आर्थिक रूपमा सक्रिय जनसंख्या - गढवा गाउँपालिका (Economically Active Population - Khajura Rural Municipality)"
              className="w-full h-[250px] object-cover rounded-sm"
              priority
            />
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h1 className="scroll-m-20 tracking-tight mb-6">
              गढवा गाउँपालिकामा आर्थिक रूपमा सक्रिय जनसंख्या
            </h1>

            <h2 id="introduction" className="scroll-m-20">
              परिचय
            </h2>
            <p>
              यस खण्डमा गढवा गाउँपालिकाको विभिन्न वडाहरूमा आर्थिक रूपमा
              सक्रिय जनसंख्याको वितरण, उमेर समूह र लिङ्ग अनुसारको विश्लेषण
              प्रस्तुत गरिएको छ। आर्थिक रूपमा सक्रिय जनसंख्या भन्नाले त्यस्तो
              जनसंख्या हो जो आर्थिक गतिविधिहरूमा संलग्न हुने उमेर समूहमा पर्दछ।
            </p>
            <p>
              कुल {totalPopulation.toLocaleString()} आर्थिक रूपमा सक्रिय
              जनसंख्या मध्ये कार्यसक्षम उमेर समूह (१५-५९ वर्ष){" "}
              {workingAgePopulation.toLocaleString()} जना रहेको छ, जुन कुल
              जनसंख्याको{" "}
              {((workingAgePopulation / totalPopulation) * 100).toFixed(1)}% हो।
              निर्भरता अनुपात {dependencyRatio}% रहेको छ, जसको अर्थ हरेक १००
              कार्यसक्षम उमेरका व्यक्तिले {dependencyRatio} जना आश्रित
              (बालबालिका र वृद्ध) लाई आर्थिक रूपमा सहयोग गर्नुपर्ने स्थिति छ।
            </p>

            <h2
              id="age-group-distribution"
              className="scroll-m-20 border-b pb-2"
            >
              उमेर समूह अनुसार वितरण
            </h2>
            <p>
              गढवा गाउँपालिकामा उमेर समूह अनुसार आर्थिक रूपमा सक्रिय
              जनसंख्याको वितरण निम्नानुसार छ:
            </p>
          </div>

          {/* Client component for charts */}
          <EconomicallyActiveCharts
            ageGroupSummary={ageGroupSummary}
            genderSummary={genderSummary}
            totalPopulation={totalPopulation}
            ageGroupPieChartData={ageGroupPieChartData}
            genderPieChartData={genderPieChartData}
            wardWiseData={wardWiseData}
            wardWiseGenderData={wardWiseGenderData}
            wardNumbers={wardNumbers}
            economicallyActiveData={economicallyActiveData}
            AGE_GROUP_NAMES={AGE_GROUP_NAMES}
            GENDER_NAMES={GENDER_NAMES}
            dependencyRatio={dependencyRatio}
          />

          <div className="prose prose-slate dark:prose-invert max-w-none mt-8">
            <h2 id="analysis" className="scroll-m-20 border-b pb-2">
              विश्लेषण
            </h2>
            <p>
              गढवा गाउँपालिकामा आर्थिक रूपमा सक्रिय जनसंख्याको अवस्था
              निम्नानुसार छ। मुख्य रूपमा नेपालका अन्य पालिकाहरू जस्तै, यहाँ पनि
              कार्यसक्षम उमेर समूह (१५-५९ वर्ष) ले कुल जनसंख्याको ठूलो हिस्सा{" "}
              {((workingAgePopulation / totalPopulation) * 100).toFixed(2)}%
              ओगटेको छ।
            </p>

            {/* Client component for analysis section */}
            <EconomicallyActiveAnalysisSection
              ageGroupSummary={ageGroupSummary}
              genderSummary={genderSummary}
              totalPopulation={totalPopulation}
              AGE_GROUP_NAMES={AGE_GROUP_NAMES}
              GENDER_NAMES={GENDER_NAMES}
              dependencyRatio={dependencyRatio}
              wardNumbers={wardNumbers}
              economicallyActiveData={economicallyActiveData}
            />

            <h2 id="data-source" className="scroll-m-20 border-b pb-2">
              तथ्याङ्क स्रोत
            </h2>
            <p>
              माथि प्रस्तुत गरिएका तथ्याङ्कहरू नेपालको राष्ट्रिय जनगणना र
              गढवा गाउँपालिकाको आफ्नै सर्वेक्षणबाट संकलन गरिएको हो। यी
              तथ्याङ्कहरूको महत्व निम्न अनुसार छ:
            </p>

            <ul>
              <li>आर्थिक नीति निर्माण र रोजगारी प्रवर्द्धन गर्न</li>
              <li>श्रम बजार विश्लेषण र रोजगारी सिर्जनामा सहयोग गर्न</li>
              <li>आर्थिक विकास योजना निर्माण गर्न</li>
              <li>
                सामाजिक सुरक्षा र पेन्सन प्रणालीको दीर्घकालीन योजना तयार गर्न
              </li>
            </ul>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
}
