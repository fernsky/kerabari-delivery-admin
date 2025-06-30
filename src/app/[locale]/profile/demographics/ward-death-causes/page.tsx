import { Metadata } from "next";
import { DocsLayout } from "@/components/layout/DocsLayout";
import { TableOfContents } from "@/components/TableOfContents";
import Image from "next/image";
import DeathCauseCharts from "./_components/death-cause-charts";
import DeathCauseAnalysisSection from "./_components/death-cause-analysis-section";
import DeathCauseSEO from "./_components/death-cause-seo";
import { api } from "@/trpc/server";
import {
  DeathCauseType,
  deathCauseLabels,
} from "@/server/api/routers/profile/demographics/ward-wise-death-cause.schema";
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

// Define English names for death causes (for SEO)
const DEATH_CAUSE_NAMES_EN: Record<string, string> = {
  NOT_STATED: "Not Stated",
  HAIJA: "Cholera/Diarrhea",
  PNEUMONIA: "Pneumonia",
  FLU: "Cold/Flu",
  TUBERCULOSIS: "Tuberculosis",
  LEPROSY: "Leprosy",
  JAUNDICE_HEPATITIS: "Jaundice (Hepatitis)",
  TYPHOID: "Typhoid",
  VIRAL_INFLUENZA: "Viral Influenza",
  ENCEPHALITIS: "Encephalitis",
  MENINGITIS: "Meningitis",
  HEPATITIS: "Hepatitis",
  MALARIA: "Malaria",
  KALA_AZAR: "Kala-azar",
  HIV_AIDS: "HIV/AIDS",
  OTHER_SEXUALLY_TRANSMITTED_DISEASES: "Other STDs",
  MEASLES: "Measles",
  SCABIES: "Scabies",
  RABIES: "Rabies",
  COVID19_CORONAVIRUS: "COVID-19 (Coronavirus)",
  OTHER_INFECTIOUS_DISEASES: "Other Infectious Diseases",
  HEART_RELATED_DISEASES: "Heart-related Diseases",
  RESPIRATORY_DISEASES: "Respiratory Diseases",
  ASTHMA: "Asthma",
  EPILEPSY: "Epilepsy",
  CANCER: "Cancer",
  DIABETES: "Diabetes",
  KIDNEY_RELATED_DISEASES: "Kidney-related Diseases",
  LIVER_RELATED_DISEASES: "Liver-related Diseases",
  BRAIN_RELATED: "Brain-related (Brain Hemorrhage)",
  BLOOD_PRESSURE: "Blood Pressure (High or Low)",
  GASTRIC_ULCER_INTESTINAL_DISEASE: "Gastric Ulcer/Intestinal Disease",
  REPRODUCTIVE_OR_OBSTETRIC_CAUSES: "Reproductive or Obstetric Causes",
  TRAFFIC_ACCIDENT: "Traffic Accident",
  OTHER_ACCIDENTS: "Other Accidents",
  SUICIDE: "Suicide",
  NATURAL_DISASTER: "Natural Disaster",
  DEATH_BY_OLD_AGE: "Death by Old Age",
  OTHER: "Other Causes",
};

// This function will generate metadata dynamically based on the actual data
export async function generateMetadata(): Promise<Metadata> {
  try {
    // Fetch data for SEO using tRPC
    const deathCauseData =
      await api.profile.demographics.wardWiseDeathCause.getAll.query();
    const municipalityName = "केराबारी गाउँपालिका"; // Khajura Rural Municipality

    // Process data for SEO
    const totalDeaths = deathCauseData.reduce(
      (sum, item) => sum + (item.population || 0),
      0,
    );

    // Group by death cause and calculate totals
    const deathCauseCounts: Record<string, number> = {};
    deathCauseData.forEach((item) => {
      if (!deathCauseCounts[item.deathCause])
        deathCauseCounts[item.deathCause] = 0;
      deathCauseCounts[item.deathCause] += item.population || 0;
    });

    // Get top 3 death causes for keywords
    const topDeathCauses = Object.entries(deathCauseCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([type]) => type);

    // Create rich keywords with actual data
    const keywordsNP = [
      "केराबारी गाउँपालिका मृत्युका कारणहरू",
      "केराबारी मृत्युदर विश्लेषण",
      `केराबारी ${deathCauseLabels[topDeathCauses[0] as DeathCauseType]} मृत्यु संख्या`,
      ...topDeathCauses.map(
        (r) =>
          `${deathCauseLabels[r as DeathCauseType]} मृत्युको कारण केराबारी`,
      ),
      "वडा अनुसार मृत्युका कारणहरू",
      "स्वास्थ्य तथ्याङ्क केराबारी",
      "मृत्यु कारण सर्वेक्षण केराबारी",
      `केराबारी कुल मृत्यु संख्या ${localizeNumber(totalDeaths.toString(), "ne")}`,
    ];

    const keywordsEN = [
      "Khajura Rural Municipality causes of death",
      "Khajura mortality analysis",
      `Khajura ${DEATH_CAUSE_NAMES_EN[topDeathCauses[0] as DeathCauseType]} deaths`,
      ...topDeathCauses.map(
        (r) => `${DEATH_CAUSE_NAMES_EN[r as DeathCauseType]} deaths in Khajura`,
      ),
      "Ward-wise death cause distribution",
      "Health statistics Khajura",
      "Mortality survey Khajura",
      `Khajura total deaths ${totalDeaths}`,
    ];

    // Create detailed description with actual data
    const descriptionNP = `केराबारी गाउँपालिकाको वडा अनुसार मृत्युका प्रमुख कारण, प्रवृत्ति र विश्लेषण। कुल मृत्यु संख्या ${localizeNumber(totalDeaths.toString(), "ne")} मध्ये ${deathCauseLabels[topDeathCauses[0] as DeathCauseType]} (${localizeNumber(deathCauseCounts[topDeathCauses[0]].toString(), "ne")}) सबैभन्दा ठूलो कारण हो, त्यसपछि ${deathCauseLabels[topDeathCauses[1] as DeathCauseType]} (${localizeNumber(deathCauseCounts[topDeathCauses[1]].toString(), "ne")}) र ${deathCauseLabels[topDeathCauses[2] as DeathCauseType]} (${localizeNumber(deathCauseCounts[topDeathCauses[2]].toString(), "ne")})। विभिन्न मृत्युका कारणहरूको विस्तृत तथ्याङ्क र विजुअलाइजेसन।`;

    const descriptionEN = `Ward-wise main causes of death, trends and analysis for Khajura Rural Municipality. Out of a total deaths of ${totalDeaths}, ${DEATH_CAUSE_NAMES_EN[topDeathCauses[0] as DeathCauseType]} (${deathCauseCounts[topDeathCauses[0]]}) is the leading cause, followed by ${DEATH_CAUSE_NAMES_EN[topDeathCauses[1] as DeathCauseType]} (${deathCauseCounts[topDeathCauses[1]]}) and ${DEATH_CAUSE_NAMES_EN[topDeathCauses[2] as DeathCauseType]} (${deathCauseCounts[topDeathCauses[2]]})। Detailed statistics and visualizations of various causes of mortality.`;

    return {
      title: `मृत्युका प्रमुख कारणहरू | ${municipalityName} डिजिटल प्रोफाइल`,
      description: descriptionNP,
      keywords: [...keywordsNP, ...keywordsEN],
      alternates: {
        canonical: "/profile/demographics/ward-death-causes",
        languages: {
          en: "/en/profile/demographics/ward-death-causes",
          ne: "/ne/profile/demographics/ward-death-causes",
        },
      },
      openGraph: {
        title: `मृत्युका प्रमुख कारणहरू | ${municipalityName}`,
        description: descriptionNP,
        type: "article",
        locale: "ne_NP",
        alternateLocale: "en_US",
        siteName: `${municipalityName} डिजिटल प्रोफाइल`,
      },
      twitter: {
        card: "summary_large_image",
        title: `मृत्युका प्रमुख कारणहरू | ${municipalityName}`,
        description: descriptionNP,
      },
    };
  } catch (error) {
    // Fallback metadata if data fetching fails
    return {
      title: "मृत्युका प्रमुख कारणहरू | केराबारी गाउँपालिका डिजिटल प्रोफाइल",
      description:
        "वडा अनुसार मृत्युका प्रमुख कारणहरू, प्रवृत्ति र विश्लेषण। विभिन्न मृत्युका कारणहरूको विस्तृत तथ्याङ्क र विजुअलाइजेसन।",
    };
  }
}

const toc = [
  { level: 2, text: "परिचय", slug: "introduction" },
  {
    level: 2,
    text: "मृत्युका कारण अनुसार जनसंख्या",
    slug: "death-cause-distribution",
  },
  {
    level: 2,
    text: "वडा अनुसार मृत्युका कारणहरू",
    slug: "ward-wise-death-causes",
  },
  {
    level: 2,
    text: "प्रमुख मृत्युका कारणहरूको विश्लेषण",
    slug: "major-death-causes",
  },
];

export default async function WardDeathCausesPage() {
  // Fetch all death cause data using tRPC
  const deathCauseData =
    await api.profile.demographics.wardWiseDeathCause.getAll.query();

  // Try to fetch summary data
  let summaryData = null;
  try {
    summaryData =
      await api.profile.demographics.wardWiseDeathCause.summary.query();
  } catch (error) {
    console.error("Could not fetch summary data", error);
  }

  // Process data for overall summary
  const overallSummary = Object.entries(
    deathCauseData.reduce((acc: Record<string, number>, item) => {
      if (!acc[item.deathCause]) acc[item.deathCause] = 0;
      acc[item.deathCause] += item.population || 0;
      return acc;
    }, {}),
  )
    .map(([deathCause, population]) => ({
      deathCause,
      deathCauseName:
        deathCauseLabels[deathCause as keyof typeof deathCauseLabels] ||
        deathCause,
      population,
    }))
    .sort((a, b) => b.population - a.population);

  // Calculate total deaths for percentages
  const totalDeaths = overallSummary.reduce(
    (sum, item) => sum + item.population,
    0,
  );

  // Take top 7 death causes for pie chart, group others
  const topDeathCauses = overallSummary.slice(0, 7);
  const otherDeathCauses = overallSummary.slice(7);

  const otherTotalDeaths = otherDeathCauses.reduce(
    (sum, item) => sum + item.population,
    0,
  );

  let pieChartData = topDeathCauses.map((item) => ({
    name: item.deathCauseName,
    value: item.population,
    percentage: ((item.population / totalDeaths) * 100).toFixed(2),
  }));

  // Add "Other" category if there are more than 7 death causes
  if (otherDeathCauses.length > 0) {
    pieChartData.push({
      name: "अन्य",
      value: otherTotalDeaths,
      percentage: ((otherTotalDeaths / totalDeaths) * 100).toFixed(2),
    });
  }

  // Get unique ward numbers
  const wardNumbers = Array.from(
    new Set(deathCauseData.map((item) => item.wardNumber)),
  ).sort((a, b) => a - b); // Sort numerically

  // Process data for ward-wise visualization (top 5 death causes per ward + others)
  const wardWiseData = wardNumbers.map((wardNumber) => {
    const wardData = deathCauseData.filter(
      (item) => item.wardNumber === wardNumber,
    );

    // Sort ward data by population
    wardData.sort((a, b) => (b.population || 0) - (a.population || 0));

    // Take top 5 death causes for this ward
    const topWardDeathCauses = wardData.slice(0, 5);
    const otherWardDeathCauses = wardData.slice(5);
    const otherWardTotal = otherWardDeathCauses.reduce(
      (sum, item) => sum + (item.population || 0),
      0,
    );

    const result: Record<string, any> = { ward: `वडा ${wardNumber}` };

    // Add top death causes
    topWardDeathCauses.forEach((item) => {
      result[
        deathCauseLabels[item.deathCause as keyof typeof deathCauseLabels] ||
          item.deathCause
      ] = item.population;
    });

    // Add "Other" category if needed
    if (otherWardDeathCauses.length > 0) {
      result["अन्य"] = otherWardTotal;
    }

    return result;
  });

  return (
    <DocsLayout toc={<TableOfContents toc={toc} />}>
      {/* Add structured data for SEO */}
      <DeathCauseSEO
        overallSummary={overallSummary}
        totalDeaths={totalDeaths}
        deathCauseLabels={deathCauseLabels}
        DEATH_CAUSE_NAMES_EN={DEATH_CAUSE_NAMES_EN}
        wardNumbers={wardNumbers}
      />

      <div className="flex flex-col gap-8">
        <section>
          <div className="relative rounded-lg overflow-hidden mb-8">
            <Image
              src="/images/death-causes.svg"
              width={1200}
              height={400}
              alt="मृत्युका प्रमुख कारणहरू - केराबारी गाउँपालिका (Main Causes of Death - Khajura Rural Municipality)"
              className="w-full h-[250px] object-cover rounded-sm"
              priority
            />
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h1 className="scroll-m-20 tracking-tight mb-6">
              केराबारी गाउँपालिकामा मृत्युका प्रमुख कारणहरू
            </h1>

            <h2 id="introduction" className="scroll-m-20">
              परिचय
            </h2>
            <p>
              यस खण्डमा केराबारी गाउँपालिकाको विभिन्न वडाहरूमा मृत्युका
              प्रमुख कारणहरू सम्बन्धी विस्तृत तथ्याङ्क प्रस्तुत गरिएको छ। यो
              तथ्याङ्कले स्वास्थ्य सेवाको अवस्था, रोगको प्रकोप र स्वास्थ्य
              चुनौतीहरूलाई प्रतिबिम्बित गर्दछ।
            </p>
            <p>
              केराबारी गाउँपालिकामा विभिन्न प्रकारका कारणहरूले मृत्यु हुने
              गरेको देखिन्छ। कुल मृत्यु संख्या{" "}
              {localizeNumber(totalDeaths.toLocaleString(), "ne")} मध्ये{" "}
              {overallSummary[0]?.deathCauseName || ""} का कारणले{" "}
              {localizeNumber(
                (
                  ((overallSummary[0]?.population || 0) / totalDeaths) *
                  100
                ).toFixed(1),
                "ne",
              )}
              % मृत्यु भएको देखिन्छ। यस तथ्याङ्कले स्वास्थ्य सेवाको सुधार, रोग
              नियन्त्रण र स्वास्थ्य शिक्षाका लागि महत्वपूर्ण जानकारी प्रदान
              गर्दछ।
            </p>

            <h2
              id="death-cause-distribution"
              className="scroll-m-20 border-b pb-2"
            >
              मृत्युका कारण अनुसार जनसंख्या
            </h2>
            <p>
              केराबारी गाउँपालिकामा विभिन्न कारणहरूले हुने मृत्युको संख्या
              निम्नानुसार छ:
            </p>
          </div>

          {/* Client component for charts */}
          <DeathCauseCharts
            overallSummary={overallSummary}
            totalDeaths={totalDeaths}
            pieChartData={pieChartData}
            wardWiseData={wardWiseData}
            wardNumbers={wardNumbers}
            deathCauseData={deathCauseData}
            deathCauseLabels={deathCauseLabels}
          />

          <div className="prose prose-slate dark:prose-invert max-w-none mt-8">
            <h2 id="major-death-causes" className="scroll-m-20 border-b pb-2">
              प्रमुख मृत्युका कारणहरूको विश्लेषण
            </h2>
            <p>
              केराबारी गाउँपालिकामा निम्न मृत्युका कारणहरू प्रमुख रूपमा
              देखिन्छन्। यी कारणहरू मध्ये{" "}
              {deathCauseLabels[
                overallSummary[0]?.deathCause as keyof typeof deathCauseLabels
              ] || "अन्य कारण"}{" "}
              सबैभन्दा धेरै व्यक्तिहरूको मृत्युको प्रमुख कारण हो, जसमा कुल
              मृत्युको{" "}
              {localizeNumber(
                (
                  ((overallSummary[0]?.population || 0) / totalDeaths) *
                  100
                ).toFixed(2),
                "ne",
              )}
              % रहेको छ।
            </p>

            {/* Client component for death cause analysis section */}
            <DeathCauseAnalysisSection
              overallSummary={overallSummary}
              totalDeaths={totalDeaths}
              deathCauseLabels={deathCauseLabels}
              DEATH_CAUSE_NAMES_EN={DEATH_CAUSE_NAMES_EN}
            />
          </div>
        </section>
      </div>
    </DocsLayout>
  );
}
