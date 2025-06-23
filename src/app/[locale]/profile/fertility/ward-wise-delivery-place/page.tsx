import { Metadata } from "next";
import { DocsLayout } from "@/components/layout/DocsLayout";
import { TableOfContents } from "@/components/TableOfContents";
import Image from "next/image";
import { api } from "@/trpc/server";
import { localizeNumber } from "@/lib/utils/localize-number";
import WardWiseDeliveryPlaceCharts from "./_components/ward-wise-delivery-place-charts";
import WardWiseDeliveryPlaceAnalysisSection from "./_components/ward-wise-delivery-place-analysis-section";
import WardWiseDeliveryPlaceSEO from "./_components/ward-wise-delivery-place-seo";
import { deliveryPlaceOptions } from "@/server/api/routers/profile/fertility/ward-wise-delivery-place.schema";

// Delivery place categories with display names and colors
const DELIVERY_PLACE_CATEGORIES = {
  GOVERNMENTAL_HEALTH_INSTITUTION: {
    name: "सरकारी स्वास्थ्य संस्थामा",
    nameEn: "Government health institution",
    color: "#4285F4", // Blue
  },
  PRIVATE_HEALTH_INSTITUTION: {
    name: "नीजी स्वास्थ्य संस्थामा",
    nameEn: "Private health institution",
    color: "#34A853", // Green
  },
  HOUSE: {
    name: "घरमा",
    nameEn: "Home delivery",
    color: "#FBBC05", // Yellow
  },
  OTHER: {
    name: "अन्य",
    nameEn: "Other locations",
    color: "#EA4335", // Red
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
    const deliveryPlaceData =
      await api.profile.fertility.wardWiseDeliveryPlaces.getAll.query();
    const municipalityName = "गढवा गाउँपालिका"; // Khajura Rural Municipality
    console.log(deliveryPlaceData);
    // Group by ward number
    const wardGroups = deliveryPlaceData.reduce((acc: any, curr: any) => {
      acc[curr.wardNumber] = acc[curr.wardNumber] || [];
      acc[curr.wardNumber].push(curr);
      return acc;
    }, {});

    // Calculate totals and institutional delivery
    let totalDeliveries = 0;
    let institutionalDeliveries = 0;
    let homeDeliveries = 0;

    Object.values(wardGroups).forEach((wardData: any) => {
      wardData.forEach((item: any) => {
        totalDeliveries += item.population;
        if (
          item.deliveryPlace === "GOVERNMENTAL_HEALTH_INSTITUTION" ||
          item.deliveryPlace === "PRIVATE_HEALTH_INSTITUTION"
        ) {
          institutionalDeliveries += item.population;
        }
        if (item.deliveryPlace === "HOUSE") {
          homeDeliveries += item.population;
        }
      });
    });

    // Calculate percentages for SEO description
    const institutionalPercentage = (
      (institutionalDeliveries / totalDeliveries) *
      100
    ).toFixed(2);
    const homePercentage = ((homeDeliveries / totalDeliveries) * 100).toFixed(
      2,
    );

    // Create rich keywords
    const keywordsNP = [
      "गढवा गाउँपालिका प्रसूती स्थान",
      "संस्थागत प्रसूती",
      "वडागत प्रसूती स्थान तथ्याङ्क",
      "घरमा हुने प्रसूती दर",
      `संस्थागत प्रसूती दर ${institutionalPercentage}%`,
      "प्रसूती स्थान विश्लेषण",
    ];

    const keywordsEN = [
      "Khajura Rural Municipality childbirth places",
      "Institutional delivery",
      "Ward-wise delivery statistics",
      "Home delivery rate",
      `Institutional delivery rate ${institutionalPercentage}%`,
      "Childbirth location analysis",
    ];

    // Create description
    const descriptionNP = `गढवा गाउँपालिकामा प्रसूती स्थान सम्बन्धी विश्लेषण। कुल ${localizeNumber(totalDeliveries.toLocaleString(), "ne")} प्रसूती मध्ये ${localizeNumber(institutionalPercentage, "ne")}% (${localizeNumber(institutionalDeliveries.toLocaleString(), "ne")}) संस्थागत प्रसूती र ${localizeNumber(homePercentage, "ne")}% (${localizeNumber(homeDeliveries.toLocaleString(), "ne")}) घरमा भएका प्रसूती रहेका छन्।`;

    const descriptionEN = `Analysis of childbirth locations in Khajura Rural Municipality. Out of a total of ${totalDeliveries.toLocaleString()} deliveries, ${institutionalPercentage}% (${institutionalDeliveries.toLocaleString()}) were institutional deliveries and ${homePercentage}% (${homeDeliveries.toLocaleString()}) were home deliveries.`;

    return {
      title: `प्रसूती स्थानको अवस्था | ${municipalityName} डिजिटल प्रोफाइल`,
      description: descriptionNP,
      keywords: [...keywordsNP, ...keywordsEN],
      alternates: {
        canonical: "/profile/fertility/ward-wise-delivery-place",
        languages: {
          en: "/en/profile/fertility/ward-wise-delivery-place",
          ne: "/ne/profile/fertility/ward-wise-delivery-place",
        },
      },
      openGraph: {
        title: `प्रसूती स्थानको अवस्था | ${municipalityName}`,
        description: descriptionNP,
        type: "article",
        locale: "ne_NP",
        alternateLocale: "en_US",
        siteName: `${municipalityName} डिजिटल प्रोफाइल`,
      },
      twitter: {
        card: "summary_large_image",
        title: `प्रसूती स्थानको अवस्था | ${municipalityName}`,
        description: descriptionNP,
      },
    };
  } catch (error) {
    // Fallback metadata if data fetching fails
    return {
      title: "प्रसूती स्थानको अवस्था | गढवा गाउँपालिका डिजिटल प्रोफाइल",
      description: "वडा अनुसार प्रसूती स्थानको अवस्था र विश्लेषण।",
    };
  }
}

const toc = [
  { level: 2, text: "परिचय", slug: "introduction" },
  {
    level: 2,
    text: "प्रमुख तथ्यहरू",
    slug: "key-facts",
  },
  {
    level: 2,
    text: "प्रसूती स्थानको वितरण",
    slug: "distribution-of-delivery-places",
  },
  {
    level: 2,
    text: "वडा अनुसार प्रसूती स्थान",
    slug: "ward-wise-delivery-places",
  },
  {
    level: 2,
    text: "प्रसूती स्थानको विश्लेषण",
    slug: "delivery-places-analysis",
  },
  {
    level: 2,
    text: "संस्थागत प्रसूती प्रवर्धन रणनीति",
    slug: "institutional-delivery-promotion-strategy",
  },
];

export default async function WardWiseDeliveryPlacePage() {
  // Fetch all ward-wise delivery place data using tRPC
  const deliveryPlaceData =
    await api.profile.fertility.wardWiseDeliveryPlaces.getAll.query();
  console.log(deliveryPlaceData);

  // Try to fetch summary data
  let summaryData = null;
  try {
    summaryData =
      await api.profile.fertility.wardWiseDeliveryPlaces.summary.query();
  } catch (error) {
    console.error("Error fetching summary data:", error);
  }
  // Group by ward number
  const wardGroups = deliveryPlaceData.reduce((acc: any, curr: any) => {
    acc[curr.wardNumber] = acc[curr.wardNumber] || [];
    acc[curr.wardNumber].push(curr);
    return acc;
  }, {});

  // Create a mapping of deliveryPlace to its human-readable name
  const placeMap: Record<string, string> = {};
  deliveryPlaceOptions.forEach((option) => {
    placeMap[option.value] = option.label.split(" (")[0];
  });

  // Calculate totals by delivery place category
  let totalDeliveries = 0;
  const deliveryCategoryTotals: Record<string, number> = {
    GOVERNMENTAL_HEALTH_INSTITUTION: 0,
    PRIVATE_HEALTH_INSTITUTION: 0,
    HOUSE: 0,
    OTHER: 0,
  };

  // If summary data is available, use it to calculate totals
  if (summaryData && Array.isArray(summaryData)) {
    summaryData.forEach((item: any) => {
      const deliveryPlace = item.delivery_place;
      const population = parseInt(item.total_population) || 0;

      if (deliveryCategoryTotals[deliveryPlace] !== undefined) {
        deliveryCategoryTotals[deliveryPlace] = population;
      }

      totalDeliveries += population;
    });
  } else {
    // Fallback to calculating from ward data
    Object.values(wardGroups).forEach((wardData: any) => {
      wardData.forEach((item: any) => {
        // Add to total deliveries
        totalDeliveries += item.population;

        // Add to delivery category totals
        if (deliveryCategoryTotals[item.deliveryPlace] !== undefined) {
          deliveryCategoryTotals[item.deliveryPlace] += item.population;
        }
      });
    });
  }

  // Calculate percentages
  const deliveryCategoryPercentages: Record<string, number> = {};
  Object.keys(deliveryCategoryTotals).forEach((category) => {
    deliveryCategoryPercentages[category] =
      totalDeliveries > 0
        ? parseFloat(
            (
              (deliveryCategoryTotals[category] / totalDeliveries) *
              100
            ).toFixed(2),
          )
        : 0;
  });

  // Get unique ward numbers
  const wardNumbers = Object.keys(wardGroups)
    .map(Number)
    .sort((a, b) => a - b);

  // Process data for pie chart
  const pieChartData = Object.keys(DELIVERY_PLACE_CATEGORIES).map(
    (categoryKey) => {
      return {
        name: DELIVERY_PLACE_CATEGORIES[
          categoryKey as keyof typeof DELIVERY_PLACE_CATEGORIES
        ].name,
        nameEn:
          DELIVERY_PLACE_CATEGORIES[
            categoryKey as keyof typeof DELIVERY_PLACE_CATEGORIES
          ].nameEn,
        value: deliveryCategoryTotals[categoryKey],
        percentage: deliveryCategoryPercentages[categoryKey].toFixed(2),
        color:
          DELIVERY_PLACE_CATEGORIES[
            categoryKey as keyof typeof DELIVERY_PLACE_CATEGORIES
          ].color,
      };
    },
  );

  // Process data for ward-wise visualization
  const wardWiseData = wardNumbers
    .map((wardNumber) => {
      const wardData = wardGroups[wardNumber];

      if (!wardData) return null;

      const totalWardDeliveries = wardData.reduce(
        (sum: number, item: any) => sum + item.population,
        0,
      );

      // Calculate ward-level totals for each delivery place category
      const wardDeliveryCategories: Record<string, number> = {};
      Object.keys(DELIVERY_PLACE_CATEGORIES).forEach((categoryKey) => {
        const category =
          DELIVERY_PLACE_CATEGORIES[
            categoryKey as keyof typeof DELIVERY_PLACE_CATEGORIES
          ];
        const categoryTotal = wardData
          .filter((item: any) => item.deliveryPlace === categoryKey)
          .reduce((sum: number, item: any) => sum + item.population, 0);

        wardDeliveryCategories[category.name] = categoryTotal;
      });

      return {
        ward: `वडा ${wardNumber}`,
        wardNumber,
        ...wardDeliveryCategories,
        total: totalWardDeliveries,
      };
    })
    .filter(Boolean);

  // Calculate institutional delivery percentage (gov + private) for each ward
  const wardInstitutionalPercentages = wardWiseData.map((ward: any) => {
    const institutionalDeliveries =
      (ward[DELIVERY_PLACE_CATEGORIES.GOVERNMENTAL_HEALTH_INSTITUTION.name] ||
        0) +
      (ward[DELIVERY_PLACE_CATEGORIES.PRIVATE_HEALTH_INSTITUTION.name] || 0);
    const institutionalPercentage =
      (institutionalDeliveries / ward.total) * 100;
    return {
      wardNumber: ward.wardNumber,
      percentage: institutionalPercentage,
    };
  });

  const bestWard = [...wardInstitutionalPercentages].sort(
    (a, b) => b.percentage - a.percentage,
  )[0];
  const worstWard = [...wardInstitutionalPercentages].sort(
    (a, b) => a.percentage - b.percentage,
  )[0];

  // Calculate institutional delivery index (0-100, higher is better)
  const institutionalDeliveryIndex =
    deliveryCategoryPercentages.GOVERNMENTAL_HEALTH_INSTITUTION +
    deliveryCategoryPercentages.PRIVATE_HEALTH_INSTITUTION;

  return (
    <DocsLayout toc={<TableOfContents toc={toc} />}>
      {/* Add structured data for SEO */}
      <WardWiseDeliveryPlaceSEO
        deliveryPlaceData={deliveryPlaceData}
        totalDeliveries={totalDeliveries}
        deliveryCategoryTotals={deliveryCategoryTotals}
        deliveryCategoryPercentages={deliveryCategoryPercentages}
        bestWard={bestWard}
        worstWard={worstWard}
        DELIVERY_PLACE_CATEGORIES={DELIVERY_PLACE_CATEGORIES}
        wardNumbers={wardNumbers}
        institutionalDeliveryIndex={institutionalDeliveryIndex}
      />

      <div className="flex flex-col gap-8">
        <section>
          <div className="relative rounded-lg overflow-hidden mb-8">
            <Image
              src="/images/delivery-place-statistics.svg"
              width={1200}
              height={400}
              alt="प्रसूती स्थानको अवस्था - गढवा गाउँपालिका (Delivery Place Statistics - Khajura Rural Municipality)"
              className="w-full h-[250px] object-cover rounded-sm"
              priority
            />
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h1 className="scroll-m-20 tracking-tight mb-6">
              गढवा गाउँपालिकामा प्रसूती स्थानको अवस्था
            </h1>

            <h2 id="introduction" className="scroll-m-20">
              परिचय
            </h2>
            <p>
              प्रसूती स्थानको चयनले आमा र शिशुको स्वास्थ्य र सुरक्षामा
              महत्वपूर्ण भूमिका निर्वाह गर्दछ। संस्थागत प्रसूती (अस्पताल वा
              स्वास्थ्य केन्द्रमा हुने प्रसूती) ले मातृ तथा शिशु मृत्युदर कम
              गर्न मद्दत गर्दछ। यस खण्डमा गढवा गाउँपालिकाको विभिन्न वडाहरूमा
              प्रसूती स्थानको अवस्था र त्यसको विश्लेषण प्रस्तुत गरिएको छ।
            </p>
            <p>
              गढवा गाउँपालिकामा कुल{" "}
              {localizeNumber(totalDeliveries.toLocaleString(), "ne")} प्रसूती
              मध्ये
              {localizeNumber(
                deliveryCategoryPercentages.GOVERNMENTAL_HEALTH_INSTITUTION.toFixed(
                  2,
                ),
                "ne",
              )}
              % सरकारी स्वास्थ्य संस्थामा,
              {localizeNumber(
                deliveryCategoryPercentages.PRIVATE_HEALTH_INSTITUTION.toFixed(
                  2,
                ),
                "ne",
              )}
              % निजी स्वास्थ्य संस्थामा, र
              {localizeNumber(
                deliveryCategoryPercentages.HOUSE.toFixed(2),
                "ne",
              )}
              % घरमा भएका छन्।
            </p>

            <h2 id="key-facts" className="scroll-m-20 border-b pb-2">
              प्रमुख तथ्यहरू
            </h2>
            <p>
              गढवा गाउँपालिकामा प्रसूती स्थान सम्बन्धी महत्वपूर्ण तथ्यहरू:
            </p>
          </div>

          {/* Key statistics cards */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="border rounded-lg p-4 shadow-sm bg-card">
              <h3 className="text-sm font-medium text-muted-foreground">
                कुल प्रसूती
              </h3>
              <div className="mt-2">
                <p className="text-3xl font-bold">
                  {localizeNumber(totalDeliveries.toLocaleString(), "ne")}
                </p>
                <div className="mt-1 text-xs text-muted-foreground">
                  <span>पालिका भरिमा</span>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4 shadow-sm bg-card">
              <h3 className="text-sm font-medium text-muted-foreground">
                संस्थागत प्रसूती दर
              </h3>
              <div className="mt-2">
                <p className="text-3xl font-bold">
                  {localizeNumber(institutionalDeliveryIndex.toFixed(1), "ne")}%
                </p>
                <div className="mt-1 text-xs text-muted-foreground">
                  <span>सरकारी र निजी संस्थामा</span>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4 shadow-sm bg-card">
              <h3 className="text-sm font-medium text-muted-foreground">
                घरमा प्रसूती दर
              </h3>
              <div className="mt-2">
                <p className="text-3xl font-bold">
                  {localizeNumber(
                    deliveryCategoryPercentages.HOUSE.toFixed(1),
                    "ne",
                  )}
                  %
                </p>
                <div className="mt-1 text-xs text-muted-foreground">
                  <span>घरमा हुने प्रसूती</span>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4 shadow-sm bg-card">
              <h3 className="text-sm font-medium text-muted-foreground">
                वडा संख्या
              </h3>
              <div className="mt-2">
                <p className="text-3xl font-bold">
                  {localizeNumber(wardNumbers.length.toString(), "ne")}
                </p>
                <div className="mt-1 text-xs text-muted-foreground">
                  <span>कुल वडा संख्या</span>
                </div>
              </div>
            </div>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none mt-8">
            <h2
              id="distribution-of-delivery-places"
              className="scroll-m-20 border-b pb-2"
            >
              प्रसूती स्थानको वितरण
            </h2>
            <p>
              गढवा गाउँपालिकामा प्रसूती स्थानको वितरण निम्नानुसार रहेको छ:
            </p>
          </div>

          <WardWiseDeliveryPlaceCharts
            pieChartData={pieChartData}
            wardWiseData={wardWiseData}
            totalDeliveries={totalDeliveries}
            deliveryCategoryTotals={deliveryCategoryTotals}
            placeMap={placeMap}
            deliveryCategoryPercentages={deliveryCategoryPercentages}
            wardInstitutionalPercentages={wardInstitutionalPercentages}
            bestWard={bestWard}
            worstWard={worstWard}
            DELIVERY_PLACE_CATEGORIES={DELIVERY_PLACE_CATEGORIES}
            institutionalDeliveryIndex={institutionalDeliveryIndex}
          />

          <div className="prose prose-slate dark:prose-invert max-w-none mt-8">
            <h2
              id="delivery-places-analysis"
              className="scroll-m-20 border-b pb-2"
            >
              प्रसूती स्थानको विश्लेषण
            </h2>
            <p>
              गढवा गाउँपालिकामा प्रसूती स्थानको विश्लेषण गर्दा, समग्रमा
              {localizeNumber(
                (
                  deliveryCategoryPercentages.GOVERNMENTAL_HEALTH_INSTITUTION +
                  deliveryCategoryPercentages.PRIVATE_HEALTH_INSTITUTION
                ).toFixed(2),
                "ne",
              )}
              % प्रसूती संस्थागत रूपमा भएका छन्। वडागत रूपमा हेर्दा वडा नं.{" "}
              {localizeNumber(bestWard.wardNumber.toString(), "ne")} मा सबैभन्दा
              धेरै संस्थागत प्रसूती भएको छ, जहाँ{" "}
              {localizeNumber(bestWard.percentage.toFixed(2), "ne")}% प्रसूती
              संस्थागत रूपमा भएका छन्।
            </p>

            <WardWiseDeliveryPlaceAnalysisSection
              totalDeliveries={totalDeliveries}
              deliveryCategoryTotals={deliveryCategoryTotals}
              deliveryCategoryPercentages={deliveryCategoryPercentages}
              wardInstitutionalPercentages={wardInstitutionalPercentages}
              bestWard={bestWard}
              worstWard={worstWard}
              DELIVERY_PLACE_CATEGORIES={DELIVERY_PLACE_CATEGORIES}
              institutionalDeliveryIndex={institutionalDeliveryIndex}
            />

            <h2
              id="institutional-delivery-promotion-strategy"
              className="scroll-m-20 border-b pb-2 mt-12"
            >
              संस्थागत प्रसूती प्रवर्धन रणनीति
            </h2>

            <p>
              गढवा गाउँपालिकामा संस्थागत प्रसूती प्रवर्धनका लागि निम्न
              रणनीतिहरू अवलम्बन गर्न सकिन्छ:
            </p>

            <div className="pl-6 space-y-4">
              <div className="flex">
                <span className="font-bold mr-2">१.</span>
                <div>
                  <strong>जनचेतना अभिवृद्धि:</strong> घरमा प्रसूती गर्दा
                  हुनसक्ने जोखिमहरू बारे जनचेतना अभिवृद्धि गर्ने तथा संस्थागत
                  प्रसूतीका फाइदाहरू बारे प्रचार प्रसार गर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">२.</span>
                <div>
                  <strong>स्वास्थ्य संस्था सुदृढीकरण:</strong> वडा नं.{" "}
                  {localizeNumber(worstWard.wardNumber.toString(), "ne")} मा
                  संस्थागत प्रसूती दर कम देखिएकोले त्यहाँ थप प्रसूती सेवा
                  विस्तार र स्वास्थ्य संस्था सुदृढीकरण गर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">३.</span>
                <div>
                  <strong>यातायात सेवा:</strong> टाढाका वडाहरूमा गर्भवती
                  महिलाहरूलाई प्रसूती सेवाका लागि यातायात सेवा प्रदान गर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">४.</span>
                <div>
                  <strong>प्रोत्साहन कार्यक्रम:</strong> संस्थागत प्रसूतीका लागि
                  प्रोत्साहन स्वरूप नगद सहायता वा अन्य सुविधाहरू प्रदान गर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">५.</span>
                <div>
                  <strong>प्रसूती सेवा विकेन्द्रीकरण:</strong> दुर्गम क्षेत्रमा
                  बर्थिङ सेन्टरहरू स्थापना गरी गर्भवती महिलाहरूलाई नजिकैबाट सेवा
                  उपलब्ध गराउने।
                </div>
              </div>
            </div>

            <p className="mt-6">
              यसरी गढवा गाउँपालिकामा प्रसूती स्थानको अवस्थाको विश्लेषणले
              स्वास्थ्य सेवा विस्तार र मातृ शिशु स्वास्थ्य नीति निर्माणमा
              महत्वपूर्ण भूमिका खेल्दछ। वडागत आवश्यकता अनुसार लक्षित कार्यक्रम र
              सेवा विस्तार गरेर संस्थागत प्रसूती दरमा सुधार ल्याउन आवश्यक छ।
            </p>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
}
