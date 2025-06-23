import { Metadata } from "next";
import { DocsLayout } from "@/components/layout/DocsLayout";
import { TableOfContents } from "@/components/TableOfContents";
import Image from "next/image";
import { api } from "@/trpc/server";
import { localizeNumber } from "@/lib/utils/localize-number";
import WardWiseCookingFuelCharts from "./_components/ward-wise-cooking-fuel-charts";
import WardWiseCookingFuelAnalysisSection from "./_components/ward-wise-cooking-fuel-analysis-section";
import WardWiseCookingFuelSEO from "./_components/ward-wise-cooking-fuel-seo";
import { cookingFuelOptions } from "@/server/api/routers/profile/physical/ward-wise-cooking-fuel.schema";

// Cooking fuel categories with display names and colors
const COOKING_FUEL_CATEGORIES = {
  WOOD: {
    name: "दाउरा/काठ/कोइला",
    nameEn: "Wood/Firewood/Coal",
    color: "#A52A2A", // Brown
  },
  LP_GAS: {
    name: "एल.पी. ग्याँस",
    nameEn: "LP Gas",
    color: "#1E88E5", // Blue
  },
  KEROSENE: {
    name: "मट्टितेल",
    nameEn: "Kerosene",
    color: "#FFA000", // Amber
  },
  ELECTRICITY: {
    name: "विद्युत",
    nameEn: "Electricity",
    color: "#43A047", // Green
  },
  BIOGAS: {
    name: "गोबर ग्याँस",
    nameEn: "Biogas",
    color: "#8E24AA", // Purple
  },
  DUNGCAKE: {
    name: "गोबर/गुँइठा",
    nameEn: "Dung cake",
    color: "#6D4C41", // Brown
  },
  OTHER: {
    name: "अन्य",
    nameEn: "Other",
    color: "#757575", // Gray
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
    const cookingFuelData =
      await api.profile.physical.wardWiseCookingFuel.getAll.query();
    const municipalityName = "गढवा गाउँपालिका"; // Khajura Rural Municipality

    // Group by cooking fuel type
    const fuelGroups = cookingFuelData.reduce((acc: any, curr: any) => {
      acc[curr.cookingFuel] = acc[curr.cookingFuel] || [];
      acc[curr.cookingFuel].push(curr);
      return acc;
    }, {});

    // Calculate totals by fuel type and grand total
    let totalHouseholds = 0;
    const fuelTypeTotals: Record<string, number> = {};

    Object.entries(fuelGroups).forEach(([fuel, items]: [string, any]) => {
      const fuelTotal = items.reduce(
        (sum: number, item: any) => sum + item.households,
        0,
      );
      fuelTypeTotals[fuel] = fuelTotal;
      totalHouseholds += fuelTotal;
    });

    // Find most common and cleanest fuel types
    const mostCommonFuel = Object.entries(fuelTypeTotals).sort(
      ([, a]: [string, number], [, b]: [string, number]) => b - a,
    )[0][0];

    const cleanFuels = ["LP_GAS", "ELECTRICITY", "BIOGAS"];
    const cleanFuelTotal = cleanFuels.reduce(
      (sum, fuel) => sum + (fuelTypeTotals[fuel] || 0),
      0,
    );
    const cleanFuelPercentage = (
      (cleanFuelTotal / totalHouseholds) *
      100
    ).toFixed(2);

    // Create rich keywords
    const keywordsNP = [
      "गढवा गाउँपालिका खाना पकाउने इन्धन",
      "वडागत खाना पकाउने इन्धन प्रयोग",
      "दाउरा प्रयोग दर",
      "एलपी ग्यास प्रयोग दर",
      `स्वच्छ इन्धन प्रयोग ${cleanFuelPercentage}%`,
      "खाना पकाउने इन्धन विश्लेषण",
    ];

    const keywordsEN = [
      "Khajura Rural Municipality cooking fuel",
      "Ward-wise cooking fuel usage",
      "Firewood usage rate",
      "LP Gas usage rate",
      `Clean fuel usage ${cleanFuelPercentage}%`,
      "Cooking fuel usage analysis",
    ];

    // Create description
    const descriptionNP = `गढवा गाउँपालिकामा खाना पकाउने इन्धन प्रयोगको विश्लेषण। कुल ${localizeNumber(totalHouseholds.toLocaleString(), "ne")} घरधुरी मध्ये ${localizeNumber(cleanFuelPercentage, "ne")}% घरधुरीले स्वच्छ इन्धन (एल.पी. ग्याँस, विद्युत, गोबर ग्याँस) प्रयोग गर्दछन्।`;

    const descriptionEN = `Analysis of cooking fuel usage in Khajura Rural Municipality. Out of a total of ${totalHouseholds.toLocaleString()} households, ${cleanFuelPercentage}% use clean fuels (LP Gas, Electricity, Biogas).`;

    return {
      title: `खाना पकाउने इन्धन प्रयोगको अवस्था | ${municipalityName} डिजिटल प्रोफाइल`,
      description: descriptionNP,
      keywords: [...keywordsNP, ...keywordsEN],
      alternates: {
        canonical: "/profile/physical/ward-wise-cooking-fuel",
        languages: {
          en: "/en/profile/physical/ward-wise-cooking-fuel",
          ne: "/ne/profile/physical/ward-wise-cooking-fuel",
        },
      },
      openGraph: {
        title: `खाना पकाउने इन्धन प्रयोगको अवस्था | ${municipalityName}`,
        description: descriptionNP,
        type: "article",
        locale: "ne_NP",
        alternateLocale: "en_US",
        siteName: `${municipalityName} डिजिटल प्रोफाइल`,
      },
      twitter: {
        card: "summary_large_image",
        title: `खाना पकाउने इन्धनको प्रयोगको अवस्था | ${municipalityName}`,
        description: descriptionNP,
      },
    };
  } catch (error) {
    // Fallback metadata if data fetching fails
    return {
      title:
        "खाना पकाउने इन्धनको प्रयोगको अवस्था | गढवा गाउँपालिका डिजिटल प्रोफाइल",
      description: "वडा अनुसार खाना पकाउने इन्धनको प्रयोगको अवस्था र विश्लेषण।",
    };
  }
}

const toc = [
  { level: 2, text: "परिचय", slug: "introduction" },
  {
    level: 2,
    text: "खाना पकाउने इन्धनको वितरण",
    slug: "distribution-of-cooking-fuel",
  },
  {
    level: 2,
    text: "वडा अनुसार खाना पकाउने इन्धनको प्रयोग",
    slug: "ward-wise-cooking-fuel-usage",
  },
  {
    level: 2,
    text: "इन्धन प्रयोगको विश्लेषण",
    slug: "cooking-fuel-usage-analysis",
  },
  {
    level: 2,
    text: "स्वच्छ इन्धन प्रवर्द्धन रणनीति",
    slug: "clean-fuel-promotion-strategy",
  },
];

export default async function WardWiseCookingFuelPage() {
  // Fetch all ward-wise cooking fuel data using tRPC
  const cookingFuelData =
    await api.profile.physical.wardWiseCookingFuel.getAll.query();

  // Try to fetch summary data
  let summaryData = null;
  try {
    summaryData =
      await api.profile.physical.wardWiseCookingFuel.summary.query();
  } catch (error) {
    console.error("Could not fetch summary data", error);
  }

  // Group by ward number
  const wardGroups = cookingFuelData.reduce((acc: any, curr: any) => {
    acc[curr.wardNumber] = acc[curr.wardNumber] || [];
    acc[curr.wardNumber].push(curr);
    return acc;
  }, {});

  // Group by cooking fuel type
  const fuelGroups = cookingFuelData.reduce((acc: any, curr: any) => {
    acc[curr.cookingFuel] = acc[curr.cookingFuel] || [];
    acc[curr.cookingFuel].push(curr);
    return acc;
  }, {});

  // Create a mapping of cookingFuel to its human-readable name
  const fuelMap: Record<string, string> = {};
  cookingFuelOptions.forEach((option) => {
    fuelMap[option.value] = option.label.split(" (")[0];
  });

  // Calculate totals by fuel type
  let totalHouseholds = 0;
  const fuelTypeTotals: Record<string, number> = {};

  Object.entries(fuelGroups).forEach(([fuel, items]: [string, any]) => {
    const fuelTotal = items.reduce(
      (sum: number, item: any) => sum + item.households,
      0,
    );
    fuelTypeTotals[fuel] = fuelTotal;
    totalHouseholds += fuelTotal;
  });

  // Calculate percentages
  const fuelTypePercentages: Record<string, number> = {};
  Object.keys(fuelTypeTotals).forEach((fuel) => {
    fuelTypePercentages[fuel] = parseFloat(
      ((fuelTypeTotals[fuel] / totalHouseholds) * 100).toFixed(2),
    );
  });

  // Get unique ward numbers
  const wardNumbers = Object.keys(wardGroups)
    .map(Number)
    .sort((a, b) => a - b);

  // Process data for pie chart
  const pieChartData = Object.entries(COOKING_FUEL_CATEGORIES)
    .map(([categoryKey, category]) => {
      return {
        name: category.name,
        nameEn: category.nameEn,
        value: fuelTypeTotals[categoryKey] || 0,
        percentage: fuelTypePercentages[categoryKey]?.toFixed(2) || "0.00",
        color: category.color,
      };
    })
    .filter((item) => item.value > 0);

  // Process data for ward-wise visualization
  const wardWiseData = wardNumbers
    .map((wardNumber) => {
      const wardData = wardGroups[wardNumber];

      if (!wardData) return null;

      const totalWardHouseholds = wardData.reduce(
        (sum: number, item: any) => sum + item.households,
        0,
      );

      // Calculate ward-level totals for each cooking fuel type
      const wardFuelCategories: Record<string, number> = {};
      Object.keys(COOKING_FUEL_CATEGORIES).forEach((categoryKey) => {
        const category =
          COOKING_FUEL_CATEGORIES[
            categoryKey as keyof typeof COOKING_FUEL_CATEGORIES
          ];
        const categoryTotal = wardData
          .filter((item: any) => item.cookingFuel === categoryKey)
          .reduce((sum: number, item: any) => sum + item.households, 0);

        wardFuelCategories[category.name] = categoryTotal;
      });

      return {
        ward: `वडा ${wardNumber}`,
        wardNumber,
        ...wardFuelCategories,
        total: totalWardHouseholds,
      };
    })
    .filter(Boolean);

  // Clean fuels: LP_GAS, ELECTRICITY, BIOGAS
  const cleanFuels = ["LP_GAS", "ELECTRICITY", "BIOGAS"];
  const traditionalFuels = ["WOOD", "DUNGCAKE"];

  // Find the ward with highest and lowest percentages of households that use clean cooking fuels
  const wardCleanFuelPercentages = wardWiseData.map((ward: any) => {
    const cleanFuelHouseholds = cleanFuels.reduce((sum, fuel) => {
      const fuelName =
        COOKING_FUEL_CATEGORIES[fuel as keyof typeof COOKING_FUEL_CATEGORIES]
          .name;
      return sum + (ward[fuelName] || 0);
    }, 0);

    const cleanFuelPercentage = (cleanFuelHouseholds / ward.total) * 100;
    return {
      wardNumber: ward.wardNumber,
      percentage: cleanFuelPercentage,
      households: cleanFuelHouseholds,
    };
  });

  const bestWard = [...wardCleanFuelPercentages].sort(
    (a, b) => b.percentage - a.percentage,
  )[0];
  const worstWard = [...wardCleanFuelPercentages].sort(
    (a, b) => a.percentage - b.percentage,
  )[0];

  // Calculate clean fuel usage index (0-100, higher is better)
  const cleanFuelTotal = cleanFuels.reduce(
    (sum, fuel) => sum + (fuelTypeTotals[fuel] || 0),
    0,
  );
  const traditionalFuelTotal = traditionalFuels.reduce(
    (sum, fuel) => sum + (fuelTypeTotals[fuel] || 0),
    0,
  );
  const cleanFuelPercentage = (cleanFuelTotal / totalHouseholds) * 100;

  // Clean Fuel Index - weighted score based on the types of fuels used
  const cleanFuelIndex =
    (fuelTypePercentages.LP_GAS || 0) * 1.0 +
    (fuelTypePercentages.ELECTRICITY || 0) * 1.0 +
    (fuelTypePercentages.BIOGAS || 0) * 0.9 +
    (fuelTypePercentages.KEROSENE || 0) * 0.5 +
    (fuelTypePercentages.WOOD || 0) * 0.2 +
    (fuelTypePercentages.DUNGCAKE || 0) * 0.1 +
    (fuelTypePercentages.OTHER || 0) * 0.3;

  return (
    <DocsLayout toc={<TableOfContents toc={toc} />}>
      {/* Add structured data for SEO */}
      <WardWiseCookingFuelSEO
        cookingFuelData={cookingFuelData}
        totalHouseholds={totalHouseholds}
        fuelTypeTotals={fuelTypeTotals}
        fuelTypePercentages={fuelTypePercentages}
        bestWard={bestWard}
        worstWard={worstWard}
        COOKING_FUEL_CATEGORIES={COOKING_FUEL_CATEGORIES}
        wardNumbers={wardNumbers}
        cleanFuelIndex={cleanFuelIndex}
        cleanFuelPercentage={cleanFuelPercentage}
      />

      <div className="flex flex-col gap-8">
        <section>
          <div className="relative rounded-lg overflow-hidden mb-8">
            <Image
              src="/images/cooking-fuel.svg"
              width={1200}
              height={400}
              alt="खाना पकाउने इन्धनको प्रयोगको अवस्था - गढवा गाउँपालिका (Cooking Fuel Usage - Khajura Rural Municipality)"
              className="w-full h-[250px] object-cover rounded-sm"
              priority
            />
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h1 className="scroll-m-20 tracking-tight mb-6">
              गढवा गाउँपालिकामा खाना पकाउने इन्धनको प्रयोगको अवस्था
            </h1>

            <h2 id="introduction" className="scroll-m-20">
              परिचय
            </h2>
            <p>
              खाना पकाउने इन्धनको प्रयोग एक महत्वपूर्ण भौतिक सूचक हो जसले
              समुदायको जीवनस्तर, वातावरणीय स्वास्थ्य र स्वच्छ ऊर्जामा पहुँचको
              अवस्थालाई दर्शाउँछ। खाना पकाउनको लागि प्रयोग गरिने इन्धनको
              प्रकारले स्वास्थ्यमा प्रत्यक्ष प्रभाव पार्नुका साथै वातावरणीय
              दिगोपना र आर्थिक-सामाजिक अवस्थाको पनि संकेत गर्दछ। यस खण्डमा
              गढवा गाउँपालिकाको विभिन्न वडाहरूमा प्रयोग हुने खाना पकाउने
              इन्धनको विस्तृत विश्लेषण प्रस्तुत गरिएको छ।
            </p>
            <p>
              गढवा गाउँपालिकामा कुल{" "}
              {localizeNumber(totalHouseholds.toLocaleString(), "ne")} घरधुरी
              मध्ये
              {localizeNumber(
                fuelTypePercentages.LP_GAS?.toFixed(2) || "0.00",
                "ne",
              )}
              % घरधुरीले एल.पी. ग्याँस,
              {localizeNumber(
                fuelTypePercentages.WOOD?.toFixed(2) || "0.00",
                "ne",
              )}
              % घरधुरीले दाउरा/काठ/कोइला, र
              {localizeNumber(
                fuelTypePercentages.BIOGAS?.toFixed(2) || "0.00",
                "ne",
              )}
              % घरधुरीले गोबर ग्याँसको प्रयोग गर्दछन्।
            </p>

            <h2
              id="distribution-of-cooking-fuel"
              className="scroll-m-20 border-b pb-2"
            >
              खाना पकाउने इन्धनको वितरण
            </h2>
            <p>
              गढवा गाउँपालिकामा खाना पकाउने इन्धनको प्रयोगको वितरण
              निम्नानुसार रहेको छ:
            </p>
          </div>

          <WardWiseCookingFuelCharts
            pieChartData={pieChartData}
            wardWiseData={wardWiseData}
            totalHouseholds={totalHouseholds}
            fuelTypeTotals={fuelTypeTotals}
            fuelMap={fuelMap}
            fuelTypePercentages={fuelTypePercentages}
            wardCleanFuelPercentages={wardCleanFuelPercentages}
            bestWard={bestWard}
            worstWard={worstWard}
            COOKING_FUEL_CATEGORIES={COOKING_FUEL_CATEGORIES}
            cleanFuelIndex={cleanFuelIndex}
            cleanFuels={cleanFuels}
            traditionalFuels={traditionalFuels}
            cleanFuelPercentage={cleanFuelPercentage}
          />

          <div className="prose prose-slate dark:prose-invert max-w-none mt-8">
            <h2
              id="cooking-fuel-usage-analysis"
              className="scroll-m-20 border-b pb-2"
            >
              खाना पकाउने इन्धनको प्रयोगको विश्लेषण
            </h2>
            <p>
              गढवा गाउँपालिकामा खाना पकाउने इन्धनको प्रयोगको विश्लेषण गर्दा,
              समग्रमा
              {localizeNumber(cleanFuelPercentage.toFixed(2), "ne")}% घरधुरीले
              स्वच्छ इन्धन (एल.पी. ग्याँस, विद्युत, गोबर ग्याँस) प्रयोग गर्दछन्।
              वडागत रूपमा हेर्दा वडा नं.{" "}
              {localizeNumber(bestWard.wardNumber.toString(), "ne")} मा सबैभन्दा
              बढी स्वच्छ इन्धन प्रयोग गरिएको छ, जहाँ{" "}
              {localizeNumber(bestWard.percentage.toFixed(2), "ne")}%
              घरधुरीहरूले स्वच्छ इन्धन प्रयोग गर्दछन्।
            </p>

            <WardWiseCookingFuelAnalysisSection
              totalHouseholds={totalHouseholds}
              fuelTypeTotals={fuelTypeTotals}
              fuelTypePercentages={fuelTypePercentages}
              wardCleanFuelPercentages={wardCleanFuelPercentages}
              bestWard={bestWard}
              worstWard={worstWard}
              COOKING_FUEL_CATEGORIES={COOKING_FUEL_CATEGORIES}
              cleanFuelIndex={cleanFuelIndex}
              cleanFuels={cleanFuels}
              traditionalFuels={traditionalFuels}
              cleanFuelPercentage={cleanFuelPercentage}
            />

            <h2
              id="clean-fuel-promotion-strategy"
              className="scroll-m-20 border-b pb-2 mt-12"
            >
              स्वच्छ इन्धन प्रवर्द्धन रणनीति
            </h2>

            <p>
              गढवा गाउँपालिकामा खाना पकाउने इन्धनको प्रयोगको तथ्याङ्क
              विश्लेषणबाट निम्न रणनीतिहरू अवलम्बन गर्न सकिन्छ:
            </p>

            <div className="pl-6 space-y-4">
              <div className="flex">
                <span className="font-bold mr-2">१.</span>
                <div>
                  <strong>स्वच्छ इन्धन सब्सिडी कार्यक्रम:</strong>{" "}
                  {localizeNumber((100 - cleanFuelPercentage).toFixed(2), "ne")}
                  % घरधुरीहरूले अझै परम्परागत इन्धन प्रयोग गर्ने हुनाले त्यस्ता
                  घरधुरीहरूलाई एल.पी. ग्याँस, विद्युतीय चुल्हो, वा बायोग्यास
                  जडानमा अनुदान तथा सहुलियत उपलब्ध गराउने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">२.</span>
                <div>
                  <strong>सुधारिएको चुल्हो कार्यक्रम विस्तार:</strong> वडा नं.{" "}
                  {localizeNumber(worstWard.wardNumber.toString(), "ne")} मा
                  स्वच्छ इन्धनको प्रयोग अत्यन्त न्यून भएकोले त्यस क्षेत्रमा
                  सुधारिएको चुल्हो वितरण र प्रशिक्षण कार्यक्रम संचालन गर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">३.</span>
                <div>
                  <strong>बायोग्यास प्रवर्द्धन:</strong> पशुपालन गर्ने
                  घरधुरीहरूमा बायोग्यास प्लान्ट जडान गर्न प्राविधिक र आर्थिक
                  सहयोग उपलब्ध गराई स्वच्छ इन्धनको प्रयोगलाई बढावा दिने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">४.</span>
                <div>
                  <strong>विद्युतीय चुल्हो प्रवर्द्धन:</strong> विद्युत पहुँच
                  भएका तर अझै परम्परागत इन्धन प्रयोग गर्ने घरधुरीहरूमा विद्युतीय
                  चुल्हो प्रयोगको लाभ, सुरक्षित प्रयोग विधि र महत्व बारे जनचेतना
                  अभिवृद्धि गर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">५.</span>
                <div>
                  <strong>नवीकरणीय ऊर्जा प्रवर्द्धन:</strong> सौर्य ऊर्जा, वायु
                  ऊर्जा आदि नवीकरणीय स्रोतहरूको विकास र विस्तारमा लगानी बढाई
                  स्थानीय स्तरमा विद्युत उत्पादन र वितरण प्रणाली सुदृढ गर्न
                  सहयोग गर्ने।
                </div>
              </div>
            </div>

            <p className="mt-6">
              यसरी गढवा गाउँपालिकामा खाना पकाउने इन्धनको प्रयोगको विश्लेषणले
              पालिकामा स्वच्छ र वातावरणमैत्री इन्धनको पहुँच र प्रयोग बढाउनका
              लागि लक्षित कार्यक्रम संचालन गर्न आवश्यक सूचना उपलब्ध गराउँछ। यसले
              घरभित्रको वायु प्रदूषण कम गरी महिला तथा बालबालिकाको स्वास्थ्य
              सुधार, वन विनाश कम गर्ने र समग्र पर्यावरणीय सन्तुलन कायम गर्न
              सहयोग पुर्‍याउँछ।
            </p>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
}
