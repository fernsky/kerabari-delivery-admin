import { Metadata } from "next";
import { DocsLayout } from "@/components/layout/DocsLayout";
import { TableOfContents } from "@/components/TableOfContents";
import Image from "next/image";
import { api } from "@/trpc/server";
import { localizeNumber } from "@/lib/utils/localize-number";
import ForeignEmploymentCountriesCharts from "./_components/foreign-employment-countries-charts";
import ForeignEmploymentAnalysisSection from "./_components/foreign-employment-analysis-section";
import ForeignEmploymentSEO from "./_components/foreign-employment-seo";
import { foreignEmploymentCountryOptions } from "@/server/api/routers/profile/economics/ward-wise-foreign-employment-countries.schema";

// Force dynamic rendering since we're using tRPC which relies on headers
export const dynamic = "force-dynamic";

// Define the locales for which this page should be statically generated
export async function generateStaticParams() {
  // Generate the page for 'en' and 'ne' locales
  return [{ locale: "en" }];
}

// Optional: Add revalidation period if you want to update the static pages periodically
export const revalidate = 86400; // Revalidate once per day (in seconds)

// Define English names for countries (for SEO)
const COUNTRY_NAMES_EN: Record<string, string> = {
  QATAR: "Qatar",
  SAUDI_ARABIA: "Saudi Arabia",
  UNITED_ARAB_EMIRATES: "United Arab Emirates",
  MALAYSIA: "Malaysia",
  KUWAIT: "Kuwait",
  INDIA: "India",
  JAPAN: "Japan",
  SOUTH_KOREA: "South Korea",
  AUSTRALIA: "Australia",
  CHINA: "China",
  CANADA: "Canada",
  UNITED_STATES_OF_AMERICA: "United States",
};

// Define Nepali names for countries
// Use the labels from foreignEmploymentCountryOptions for Nepali names
const COUNTRY_NAMES: Record<string, string> =
  foreignEmploymentCountryOptions.reduce(
    (acc, option) => ({
      ...acc,
      [option.value]: option.label,
    }),
    {},
  );

// Define colors for countries
const COUNTRY_COLORS: Record<string, string> = {
  QATAR: "#8e44ad", // Purple
  SAUDI_ARABIA: "#27ae60", // Green
  UNITED_ARAB_EMIRATES: "#e74c3c", // Red
  MALAYSIA: "#f39c12", // Orange
  KUWAIT: "#3498db", // Blue
  INDIA: "#e67e22", // Dark Orange
  JAPAN: "#c0392b", // Dark Red
  SOUTH_KOREA: "#16a085", // Teal
  AUSTRALIA: "#d35400", // Pumpkin
  CHINA: "#f1c40f", // Yellow
  UNITED_STATES_OF_AMERICA: "#2980b9", // Dark Blue
  CANADA: "#e74c3c", // Red
  OTHER: " #95a5a6", // Gray for other countries
};

// This function will generate metadata dynamically based on the actual data
export async function generateMetadata(): Promise<Metadata> {
  try {
    // Fetch data for SEO using tRPC
    const employmentData =
      await api.profile.economics.wardWiseForeignEmploymentCountries.getAll.query();
    const municipalityName = "बुद्धशान्ति गाउँपालिका"; // Khajura Rural Municipality

    // Process data for SEO
    const totalPopulation = employmentData.reduce(
      (sum, item) => sum + (item.population || 0),
      0,
    );

    // Group by country and calculate totals
    const countryCounts: Record<string, number> = {};
    employmentData.forEach((item) => {
      if (!countryCounts[item.country]) countryCounts[item.country] = 0;
      countryCounts[item.country] += item.population || 0;
    });

    // Find the most common destination country
    let mostCommonCountry = "";
    let mostCommonCount = 0;
    Object.entries(countryCounts).forEach(([country, count]) => {
      if (count > mostCommonCount) {
        mostCommonCount = count;
        mostCommonCountry = country;
      }
    });

    const mostCommonPercentage =
      totalPopulation > 0
        ? ((mostCommonCount / totalPopulation) * 100).toFixed(2)
        : "0";

    // Create rich keywords with actual data
    const keywordsNP = [
      "बुद्धशान्ति गाउँपालिका वैदेशिक रोजगारी",
      "बुद्धशान्ति वैदेशिक रोजगारीका गन्तव्य देशहरू",
      "वडा अनुसार वैदेशिक रोजगारी",
      "विदेशमा रोजगारीमा गएका बुद्धशान्तिवासीहरू",
      COUNTRY_NAMES[mostCommonCountry] || mostCommonCountry,
      `बुद्धशान्ति वैदेशिक रोजगारी संख्या ${localizeNumber(totalPopulation.toString(), "ne")}`,
      "वैदेशिक रोजगारीको प्रमुख गन्तव्य",
      "रेमिट्यान्स आम्दानी",
    ];

    const keywordsEN = [
      "Khajura Rural Municipality foreign employment",
      "Khajura foreign employment destinations",
      "Ward-wise foreign employment",
      "Foreign employment statistics Khajura",
      COUNTRY_NAMES_EN[mostCommonCountry] || mostCommonCountry,
      `Khajura migrant workers count ${totalPopulation}`,
      "Main destination countries for workers",
      "Remittance income",
    ];

    // Create detailed description with actual data
    const descriptionNP = `बुद्धशान्ति गाउँपालिकाको वडा अनुसार वैदेशिक रोजगारीमा गएका जनसंख्याको वितरण र विश्लेषण। कुल ${localizeNumber(totalPopulation.toString(), "ne")} जना वैदेशिक रोजगारीमा रहेका छन्, जसमध्ये ${localizeNumber(mostCommonPercentage, "ne")}% (${localizeNumber(mostCommonCount.toString(), "ne")}) ${COUNTRY_NAMES[mostCommonCountry] || mostCommonCountry} मा रहेका छन्। विभिन्न वडाहरूमा वैदेशिक रोजगारीको विस्तृत विश्लेषण।`;

    const descriptionEN = `Ward-wise distribution and analysis of foreign employment population in Khajura Rural Municipality. Out of a total of ${totalPopulation} migrant workers, ${mostCommonPercentage}% (${mostCommonCount}) are working in ${COUNTRY_NAMES_EN[mostCommonCountry] || mostCommonCountry}. Detailed analysis of foreign employment patterns across various wards.`;

    return {
      title: `वैदेशिक रोजगारीका गन्तव्य देशहरू | ${municipalityName} डिजिटल प्रोफाइल`,
      description: descriptionNP,
      keywords: [...keywordsNP, ...keywordsEN],
      alternates: {
        canonical: "/profile/economics/ward-wise-foreign-employment-countries",
        languages: {
          en: "/en/profile/economics/ward-wise-foreign-employment-countries",
          ne: "/ne/profile/economics/ward-wise-foreign-employment-countries",
        },
      },
      openGraph: {
        title: `वैदेशिक रोजगारीका गन्तव्य देशहरू | ${municipalityName}`,
        description: descriptionNP,
        type: "article",
        locale: "ne_NP",
        alternateLocale: "en_US",
        siteName: `${municipalityName} डिजिटल प्रोफाइल`,
      },
      twitter: {
        card: "summary_large_image",
        title: `वैदेशिक रोजगारीका गन्तव्य देशहरू | ${municipalityName}`,
        description: descriptionNP,
      },
    };
  } catch (error) {
    // Fallback metadata if data fetching fails
    return {
      title:
        "वैदेशिक रोजगारीका गन्तव्य देशहरू | बुद्धशान्ति गाउँपालिका डिजिटल प्रोफाइल",
      description:
        "वडा अनुसार वैदेशिक रोजगारीमा गएका जनसंख्याको वितरण र विश्लेषण।",
    };
  }
}

const toc = [
  { level: 2, text: "परिचय", slug: "introduction" },
  {
    level: 2,
    text: "प्रमुख गन्तव्य देशहरू",
    slug: "main-destination-countries",
  },
  {
    level: 2,
    text: "वडा अनुसार वैदेशिक रोजगारी",
    slug: "ward-wise-foreign-employment",
  },
  {
    level: 2,
    text: "क्षेत्रगत वैदेशिक रोजगारी प्रवृत्ति",
    slug: "regional-foreign-employment-trends",
  },
  {
    level: 2,
    text: "आर्थिक प्रभाव र रेमिट्यान्स",
    slug: "economic-impact-and-remittance",
  },
  {
    level: 2,
    text: "सीप विकास र फिर्ती रणनीति",
    slug: "skill-development-and-return-strategy",
  },
  {
    level: 2,
    text: "निष्कर्ष र सिफारिसहरू",
    slug: "conclusions-and-recommendations",
  },
];

export default async function WardWiseForeignEmploymentCountriesPage() {
  // Fetch all foreign employment countries data using tRPC
  const employmentData =
    await api.profile.economics.wardWiseForeignEmploymentCountries.getAll.query();

  // Try to fetch summary data
  let summaryData = null;
  try {
    summaryData =
      await api.profile.economics.wardWiseForeignEmploymentCountries.summary.query();
  } catch (error) {
    console.error("Could not fetch summary data", error);
  }

  // Process data for overall summary
  const overallSummary = Object.entries(
    employmentData.reduce((acc: Record<string, number>, item) => {
      if (!acc[item.country]) acc[item.country] = 0;
      acc[item.country] += item.population || 0;
      return acc;
    }, {}),
  )
    .map(([country, population]) => ({
      country,
      countryName: COUNTRY_NAMES[country] || country,
      population,
    }))
    .sort((a, b) => b.population - a.population); // Sort by population descending

  // Calculate total population for percentages
  const totalPopulation = overallSummary.reduce(
    (sum, item) => sum + item.population,
    0,
  );

  // Create data for pie chart
  const pieChartData = overallSummary.map((item) => ({
    name: item.countryName,
    value: item.population,
    percentage: ((item.population / totalPopulation) * 100).toFixed(2),
  }));

  // Get unique ward numbers
  const wardNumbers = Array.from(
    new Set(employmentData.map((item) => item.wardNumber)),
  ).sort((a, b) => a - b); // Sort numerically

  // Process data for ward-wise visualization
  const wardWiseData = wardNumbers.map((wardNumber) => {
    const wardData = employmentData.filter(
      (item) => item.wardNumber === wardNumber,
    );

    const result: Record<string, any> = { ward: `वडा ${wardNumber}` };

    // Add countries
    wardData.forEach((item) => {
      const countryName = COUNTRY_NAMES[item.country] || item.country;
      result[countryName] = item.population;
    });

    return result;
  });

  // Group countries by region for regional analysis
  const regionMapping: Record<string, string> = {
    QATAR: "खाडी मुलुक", // Gulf Nations
    SAUDI_ARABIA: "खाडी मुलुक",
    UNITED_ARAB_EMIRATES: "खाडी मुलुक",
    KUWAIT: "खाडी मुलुक",
    BAHRAIN: "खाडी मुलुक",
    OMAN: "खाडी मुलुक",

    MALAYSIA: "एसिया प्यासिफिक", // Asia Pacific
    JAPAN: "एसिया प्यासिफिक",
    SOUTH_KOREA: "एसिया प्यासिफिक",
    SINGAPORE: "एसिया प्यासिफिक",
    AUSTRALIA: "एसिया प्यासिफिक",
    THAILAND: "एसिया प्यासिफिक",
    HONG_KONG: "एसिया प्यासिफिक",
    NEW_ZEALAND: "एसिया प्यासिफिक",

    INDIA: "दक्षिण एसिया", // South Asia
    BANGLADESH: "दक्षिण एसिया",
    SRI_LANKA: "दक्षिण एसिया",
    PAKISTAN: "दक्षिण एसिया",
    NEPAL: "दक्षिण एसिया",
    BHUTAN: "दक्षिण एसिया",
    MALDIVES: "दक्षिण एसिया",

    UNITED_STATES_OF_AMERICA: "पश्चिमी देशहरू", // Western Countries
    CANADA: "पश्चिमी देशहरू",
    UNITED_KINGDOM_OF_GREAT_BRITAIN: "पश्चिमी देशहरू",
    GERMANY: "पश्चिमी देशहरू",
    FRANCE: "पश्चिमी देशहरू",
    ITALY: "पश्चिमी देशहरू",
    SPAIN: "पश्चिमी देशहरू",

    // Default to "अन्य देशहरू" (Other Countries) for those not explicitly mapped
  };

  // Calculate employment by region
  const regionData = employmentData.reduce(
    (acc: Record<string, number>, item) => {
      const region = regionMapping[item.country] || "अन्य देशहरू";
      if (!acc[region]) acc[region] = 0;
      acc[region] += item.population || 0;
      return acc;
    },
    {},
  );

  // Convert to array format for charting
  const regionChartData = Object.entries(regionData)
    .map(([region, population]) => ({
      name: region,
      value: population,
      percentage: ((population / totalPopulation) * 100).toFixed(2),
    }))
    .sort((a, b) => b.value - a.value);

  // Calculate ward-wise foreign employment rates
  const wardWiseAnalysis = wardNumbers
    .map((wardNumber) => {
      const wardData = employmentData.filter(
        (item) => item.wardNumber === wardNumber,
      );

      const wardTotalPopulation = wardData.reduce(
        (sum, item) => sum + (item.population || 0),
        0,
      );

      const mostCommonCountry = wardData.reduce(
        (prev, current) => {
          return (prev.population || 0) > (current.population || 0)
            ? prev
            : current;
        },
        { country: "", population: 0 },
      );

      // Calculate population in Gulf countries
      const gulfCountriesPopulation = wardData
        .filter((item) =>
          [
            "QATAR",
            "SAUDI_ARABIA",
            "UNITED_ARAB_EMIRATES",
            "KUWAIT",
            "BAHRAIN",
            "OMAN",
          ].includes(item.country),
        )
        .reduce((sum, item) => sum + (item.population || 0), 0);

      // Calculate population in Asia Pacific
      const asiaPacificPopulation = wardData
        .filter((item) =>
          [
            "MALAYSIA",
            "JAPAN",
            "SOUTH_KOREA",
            "SINGAPORE",
            "AUSTRALIA",
            "THAILAND",
          ].includes(item.country),
        )
        .reduce((sum, item) => sum + (item.population || 0), 0);

      // Calculate population in Western countries
      const westernCountriesPopulation = wardData
        .filter((item) =>
          [
            "UNITED_STATES_OF_AMERICA",
            "CANADA",
            "UNITED_KINGDOM_OF_GREAT_BRITAIN",
            "GERMANY",
            "ITALY",
          ].includes(item.country),
        )
        .reduce((sum, item) => sum + (item.population || 0), 0);

      const gulfPercentage =
        wardTotalPopulation > 0
          ? ((gulfCountriesPopulation / wardTotalPopulation) * 100).toFixed(2)
          : "0";

      const asiaPacificPercentage =
        wardTotalPopulation > 0
          ? ((asiaPacificPopulation / wardTotalPopulation) * 100).toFixed(2)
          : "0";

      const westernCountriesPercentage =
        wardTotalPopulation > 0
          ? ((westernCountriesPopulation / wardTotalPopulation) * 100).toFixed(
              2,
            )
          : "0";

      // Calculate diversity score (0-100) based on how spread out migrants are across different countries
      // Higher score means more diverse destinations
      const countryDistribution = wardData.reduce(
        (acc: Record<string, number>, item) => {
          acc[item.country] = (acc[item.country] || 0) + (item.population || 0);
          return acc;
        },
        {},
      );

      const uniqueCountries = Object.keys(countryDistribution).length;
      const diversityScore = Math.min(uniqueCountries * 10, 100); // 10 points per unique destination country, max 100

      return {
        wardNumber,
        totalPopulation: wardTotalPopulation,
        mostCommonCountry: mostCommonCountry.country,
        mostCommonCountryPopulation: mostCommonCountry.population || 0,
        mostCommonCountryPercentage:
          wardTotalPopulation > 0
            ? (
                ((mostCommonCountry.population || 0) / wardTotalPopulation) *
                100
              ).toFixed(2)
            : "0",
        gulfCountriesPopulation,
        gulfPercentage,
        asiaPacificPopulation,
        asiaPacificPercentage,
        westernCountriesPopulation,
        westernCountriesPercentage,
        diversityScore,
        uniqueCountries,
      };
    })
    .sort((a, b) => b.totalPopulation - a.totalPopulation); // Sort by total population

  // Calculate estimated annual remittance
  // Using average annual remittance of NPR 500,000 per person as an estimation
  const averageAnnualRemittancePerPerson = 500000; // in NPR
  const estimatedAnnualRemittance =
    totalPopulation * averageAnnualRemittancePerPerson;
  const formattedEstimatedAnnualRemittance = (
    estimatedAnnualRemittance / 10000000
  ).toFixed(2); // Convert to crores

  // Calculate employment trend by skill level (using destination countries as a proxy for skill level)
  const skillLevelMapping: Record<string, string> = {
    QATAR: "अर्धदक्ष", // Semi-skilled
    SAUDI_ARABIA: "अर्धदक्ष", // Semi-skilled
    UNITED_ARAB_EMIRATES: "अर्धदक्ष", // Semi-skilled
    KUWAIT: "अर्धदक्ष", // Semi-skilled
    BAHRAIN: "अर्धदक्ष", // Semi-skilled
    MALAYSIA: "अर्धदक्ष", // Semi-skilled

    JAPAN: "दक्ष", // Skilled
    SOUTH_KOREA: "दक्ष", // Skilled
    UNITED_STATES_OF_AMERICA: "दक्ष", // Skilled
    CANADA: "दक्ष", // Skilled
    UNITED_KINGDOM_OF_GREAT_BRITAIN: "दक्ष", // Skilled
    GERMANY: "दक्ष", // Skilled
    AUSTRALIA: "दक्ष", // Skilled
    NEW_ZEALAND: "दक्ष", // Skilled

    // Default to "अदक्ष" (Unskilled) for those not explicitly mapped
  };

  // Calculate employment by skill level
  const skillLevelData = employmentData.reduce(
    (acc: Record<string, number>, item) => {
      const skillLevel = skillLevelMapping[item.country] || "अदक्ष";
      if (!acc[skillLevel]) acc[skillLevel] = 0;
      acc[skillLevel] += item.population || 0;
      return acc;
    },
    {},
  );

  // Ensure all skill levels have entries
  const allSkillLevels = ["दक्ष", "अर्धदक्ष", "अदक्ष"];
  allSkillLevels.forEach((level) => {
    if (!skillLevelData[level]) skillLevelData[level] = 0;
  });

  // Convert to array format for charting
  const skillLevelChartData = Object.entries(skillLevelData)
    .map(([skillLevel, population]) => ({
      name: skillLevel,
      value: population,
      percentage: ((population / totalPopulation) * 100).toFixed(2),
    }))
    .sort((a, b) => b.value - a.value);

  return (
    <DocsLayout toc={<TableOfContents toc={toc} />}>
      {/* Add structured data for SEO */}
      <ForeignEmploymentSEO
        overallSummary={overallSummary}
        totalPopulation={totalPopulation}
        COUNTRY_NAMES={COUNTRY_NAMES}
        COUNTRY_NAMES_EN={COUNTRY_NAMES_EN}
        wardNumbers={wardNumbers}
        estimatedAnnualRemittance={estimatedAnnualRemittance}
      />

      <div className="flex flex-col gap-8">
        <section>
          <div className="relative rounded-lg overflow-hidden mb-8">
            <Image
              src="/images/foreign-employment.svg"
              width={1200}
              height={400}
              alt="वैदेशिक रोजगारीका गन्तव्य देशहरू - बुद्धशान्ति गाउँपालिका (Foreign Employment Destinations - Khajura Rural Municipality)"
              className="w-full h-[250px] object-cover rounded-sm"
              priority
            />
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h1 className="scroll-m-20 tracking-tight mb-6">
              बुद्धशान्ति गाउँपालिकामा वैदेशिक रोजगारीका गन्तव्य देशहरू
            </h1>

            <h2 id="introduction" className="scroll-m-20">
              परिचय
            </h2>
            <p>
              नेपालको अर्थतन्त्रमा वैदेशिक रोजगारीको महत्वपूर्ण भूमिका रहेको छ।
              वैदेशिक रोजगारीबाट प्राप्त रेमिट्यान्सले आर्थिक विकास, घरपरिवारको
              जीवनस्तर सुधार तथा गरिबी निवारणमा महत्वपूर्ण योगदान पुर्‍याएको छ।
              बुद्धशान्ति गाउँपालिकामा पनि यो क्षेत्र आर्थिक विकासको महत्वपूर्ण
              आधार बनेको छ।
            </p>
            <p>
              बुद्धशान्ति गाउँपालिकाको वैदेशिक रोजगारी सम्बन्धी तथ्याङ्क अनुसार,
              कुल {localizeNumber(totalPopulation.toLocaleString(), "ne")}
              जना विभिन्न देशहरूमा रोजगारीका लागि गएका छन्। यसमध्ये सबैभन्दा बढी{" "}
              {overallSummary[0]?.countryName || ""}
              मा{" "}
              {localizeNumber(
                (
                  ((overallSummary[0]?.population || 0) / totalPopulation) *
                  100
                ).toFixed(1),
                "ne",
              )}
              % अर्थात्{" "}
              {localizeNumber(
                (overallSummary[0]?.population || 0).toLocaleString(),
                "ne",
              )}{" "}
              जना रहेका छन्।
            </p>

            <h2
              id="main-destination-countries"
              className="scroll-m-20 border-b pb-2"
            >
              प्रमुख गन्तव्य देशहरू
            </h2>
            <p>
              बुद्धशान्ति गाउँपालिकाका वासिन्दाहरूको वैदेशिक रोजगारीका प्रमुख
              गन्तव्य देशहरू र त्यहाँ रहेको जनसंख्या निम्नानुसार रहेको छ:
            </p>

            <ul>
              {overallSummary.slice(0, 5).map((item, index) => (
                <li key={index}>
                  <strong>{item.countryName}</strong>: कुल{" "}
                  {localizeNumber(
                    ((item.population / totalPopulation) * 100).toFixed(1),
                    "ne",
                  )}
                  % ({localizeNumber(item.population.toLocaleString(), "ne")}{" "}
                  जना)
                </li>
              ))}
              <li>
                <strong>अन्य देशहरू</strong>: कुल{" "}
                {localizeNumber(
                  (
                    (overallSummary
                      .slice(5)
                      .reduce((sum, item) => sum + item.population, 0) /
                      totalPopulation) *
                    100
                  ).toFixed(1),
                  "ne",
                )}
                % (
                {localizeNumber(
                  overallSummary
                    .slice(5)
                    .reduce((sum, item) => sum + item.population, 0)
                    .toLocaleString(),
                  "ne",
                )}{" "}
                जना)
              </li>
            </ul>

            <p>
              क्षेत्रगत विश्लेषण गर्दा, बुद्धशान्ति गाउँपालिकाका{" "}
              {localizeNumber(
                (
                  (regionData["खाडी मुलुक"] / totalPopulation) * 100 || 0
                ).toFixed(1),
                "ne",
              )}
              % वैदेशिक रोजगारीमा गएकाहरू खाडी मुलुकहरूमा छन्, जसमा{" "}
              {overallSummary[0]?.countryName || ""},{" "}
              {overallSummary.find((s) => s.country === "SAUDI_ARABIA")
                ?.countryName || ""}{" "}
              र{" "}
              {overallSummary.find((s) => s.country === "UNITED_ARAB_EMIRATES")
                ?.countryName || ""}{" "}
              प्रमुख छन्।
            </p>

            <p>
              दक्ष र अर्धदक्ष कामदारहरूको सन्दर्भमा, लगभग{" "}
              {localizeNumber(
                (
                  parseInt(
                    skillLevelChartData.find((s) => s.name === "दक्ष")
                      ?.percentage || "0",
                  ) +
                  parseInt(
                    skillLevelChartData.find((s) => s.name === "अर्धदक्ष")
                      ?.percentage || "0",
                  )
                ).toFixed(1),
                "ne",
              )}
              % जनशक्ति दक्ष र अर्धदक्ष श्रमिकको रूपमा विदेशमा कार्यरत छन्।
            </p>
          </div>

          {/* Client component for charts */}
          <ForeignEmploymentCountriesCharts
            overallSummary={overallSummary}
            totalPopulation={totalPopulation}
            pieChartData={pieChartData}
            wardWiseData={wardWiseData}
            wardNumbers={wardNumbers}
            employmentData={employmentData}
            wardWiseAnalysis={wardWiseAnalysis}
            regionChartData={regionChartData}
            skillLevelChartData={skillLevelChartData}
            COUNTRY_NAMES={COUNTRY_NAMES}
            COUNTRY_COLORS={COUNTRY_COLORS}
            estimatedAnnualRemittance={estimatedAnnualRemittance}
            formattedEstimatedAnnualRemittance={
              formattedEstimatedAnnualRemittance
            }
          />

          <div className="prose prose-slate dark:prose-invert max-w-none mt-8">
            <h2
              id="economic-impact-and-remittance"
              className="scroll-m-20 border-b pb-2"
            >
              आर्थिक प्रभाव र रेमिट्यान्स
            </h2>
            <p>
              बुद्धशान्ति गाउँपालिकामा वैदेशिक रोजगारीबाट प्राप्त रेमिट्यान्सले
              स्थानीय अर्थतन्त्रमा महत्वपूर्ण योगदान पुर्‍याएको छ। अनुमानित
              हिसाबले वार्षिक रु.{" "}
              {localizeNumber(formattedEstimatedAnnualRemittance, "ne")} करोड
              रेमिट्यान्स पालिकामा भित्रिने अनुमान गरिएको छ।
            </p>

            <p>
              यो रकम घरपरिवारको जीवनस्तर उकास्न, शिक्षा र स्वास्थ्यमा लगानी
              गर्न, घरजग्गा खरिद गर्न तथा साना व्यवसाय सञ्चालन गर्न उपयोग
              भइरहेको छ। तर रेमिट्यान्सको उत्पादनशील क्षेत्रमा पर्याप्त लगानी
              भने हुन नसकेको अवस्था पनि छ।
            </p>

            <ForeignEmploymentAnalysisSection
              overallSummary={overallSummary}
              totalPopulation={totalPopulation}
              wardWiseAnalysis={wardWiseAnalysis}
              COUNTRY_NAMES={COUNTRY_NAMES}
              COUNTRY_NAMES_EN={COUNTRY_NAMES_EN}
              COUNTRY_COLORS={COUNTRY_COLORS}
              regionChartData={regionChartData}
              skillLevelChartData={skillLevelChartData}
              estimatedAnnualRemittance={estimatedAnnualRemittance}
              formattedEstimatedAnnualRemittance={
                formattedEstimatedAnnualRemittance
              }
            />

            <h2
              id="skill-development-and-return-strategy"
              className="scroll-m-20 border-b pb-2 mt-12"
            >
              सीप विकास र फिर्ती रणनीति
            </h2>

            <p>
              वैदेशिक रोजगारीबाट फर्किएका व्यक्तिहरूमा सीप, अनुभव र पुँजी हुने
              हुनाले स्थानीय विकासका लागि यो महत्वपूर्ण स्रोत हो। बुद्धशान्ति
              गाउँपालिकाले वैदेशिक रोजगारीमा जाने व्यक्तिहरूलाई गन्तव्य देश
              अनुसार सीपमूलक तालिम प्रदान गर्ने र फर्केर आउनेहरूलाई उद्यमशीलता
              विकासमा सहयोग गर्ने नीति लिएको छ।
            </p>

            <div className="bg-muted/50 p-4 rounded-lg my-6">
              <h3 className="text-xl font-medium mb-2">सीप विकास रणनीति</h3>
              <ul className="pl-5 space-y-1 list-disc">
                <li>वैदेशिक रोजगारीमा जानुअघि सीप परीक्षण र प्रमाणीकरण</li>
                <li>गन्तव्य मुलुकको आवश्यकता अनुसार तालिम प्याकेजहरू</li>
                <li>भाषा प्रशिक्षण र सांस्कृतिक अभिमुखीकरण</li>
                <li>वैदेशिक रोजगारीबाट फर्किएकाहरूको सीप अभिलेखीकरण र उपयोग</li>
                <li>उच्च प्रतिफल हुने क्षेत्रहरूमा उद्यमशीलता विकास</li>
              </ul>
            </div>

            <h2
              id="conclusions-and-recommendations"
              className="scroll-m-20 border-b pb-2 mt-12"
            >
              निष्कर्ष र सिफारिसहरू
            </h2>

            <p>
              बुद्धशान्ति गाउँपालिकामा वैदेशिक रोजगारीको अवस्था विश्लेषणबाट
              निम्न निष्कर्ष र सिफारिसहरू गर्न सकिन्छ:
            </p>

            <div className="pl-6 space-y-4">
              <div className="flex">
                <span className="font-bold mr-2">१.</span>
                <div>
                  <strong>गन्तव्य विविधिकरण:</strong> हाल{" "}
                  {localizeNumber(
                    (
                      (regionData["खाडी मुलुक"] / totalPopulation) * 100 || 0
                    ).toFixed(0),
                    "ne",
                  )}
                  % भन्दा बढी वैदेशिक रोजगारी खाडी मुलुकहरूमा केन्द्रित भएकाले
                  अधिक सुरक्षित र उच्च आम्दानी हुने मुलुकहरूमा रोजगारी
                  प्रवद्र्धन गर्नुपर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">२.</span>
                <div>
                  <strong>सीपमूलक तालिम:</strong> अदक्ष कामदारको रूपमा जाने
                  संख्या{" "}
                  {localizeNumber(
                    skillLevelChartData.find((s) => s.name === "अदक्ष")
                      ?.percentage || "0",
                    "ne",
                  )}
                  % रहेकोले दक्ष र अर्धदक्ष जनशक्ति उत्पादनका लागि लक्षित तालिम
                  कार्यक्रम सञ्चालन गर्नुपर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">३.</span>
                <div>
                  <strong>वडागत लक्षित कार्यक्रम:</strong>{" "}
                  {wardWiseAnalysis
                    .slice(0, 3)
                    .map((ward, i, arr) =>
                      i === arr.length - 1
                        ? `र वडा नं. ${localizeNumber(ward.wardNumber.toString(), "ne")}`
                        : `वडा नं. ${localizeNumber(ward.wardNumber.toString(), "ne")}, `,
                    )}
                  मा वैदेशिक रोजगारीमा जानेको संख्या बढी भएकाले यी वडाहरूमा
                  सुरक्षित वैदेशिक रोजगारी सम्बन्धी विशेष सूचना केन्द्रहरू
                  स्थापना गर्नुपर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">४.</span>
                <div>
                  <strong>उत्पादनशील क्षेत्रमा रेमिट्यान्स परिचालन:</strong>{" "}
                  अनुमानित वार्षिक रु.{" "}
                  {localizeNumber(formattedEstimatedAnnualRemittance, "ne")}{" "}
                  करोड रेमिट्यान्सलाई उत्पादनशील क्षेत्रमा लगानी गर्न
                  प्रोत्साहित गर्ने नीति र कार्यक्रम ल्याउनुपर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">५.</span>
                <div>
                  <strong>स्थानीय रोजगारी सिर्जना:</strong> दीर्घकालीन रूपमा
                  वैदेशिक रोजगारीमाथिको निर्भरता घटाउन स्थानीय रोजगारी सिर्जना
                  हुने क्षेत्रहरूमा लगानी बढाउनुपर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">६.</span>
                <div>
                  <strong>फिर्ती योजना:</strong> वैदेशिक रोजगारीबाट फिर्ता
                  आएकाहरूका लागि सीप रूपान्तरण र उद्यमशीलता विकास कार्यक्रम
                  सञ्चालन गर्नुपर्ने।
                </div>
              </div>
            </div>

            <p className="mt-6">
              बुद्धशान्ति गाउँपालिकामा वैदेशिक रोजगारीको वर्तमान अवस्था मध्यम
              स्तरको रहेको देखिन्छ। उच्च सीपयुक्त मानव संसाधन विकास, सुरक्षित
              वैदेशिक रोजगारी प्रवद्र्धन र रेमिट्यान्सको उत्पादनशील उपयोग गर्न
              तत्काल रणनीतिक योजना र कार्यक्रम कार्यान्वयन गर्नुपर्ने देखिन्छ।
            </p>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
}
