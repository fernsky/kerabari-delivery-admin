import {
  ChevronRight,
  Droplet,
  Waves,
  Bath,
  Trash2,
  Filter,
} from "lucide-react";
import { api } from "@/trpc/server";
import Image from "next/image";
import { localizeNumber } from "@/lib/utils/localize-number";
import type { Metadata } from "next";
import Link from "next/link";

// Force dynamic rendering since we're using tRPC which relies on headers
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "बुद्धशान्ति गाउँपालिका खानेपानी तथा सरसफाइ | डिजिटल प्रोफाइल",
  description:
    "बुद्धशान्ति गाउँपालिकाको खानेपानी तथा सरसफाइ सम्बन्धी तथ्याङ्क: खानेपानीको श्रोत, पानी शुद्धीकरण, शौचालयको प्रकार र फोहोरमैला व्यवस्थापन सम्बन्धी विस्तृत विवरण।",
  keywords: [
    "बुद्धशान्ति गाउँपालिका",
    "खानेपानी",
    "सरसफाइ",
    "खानेपानीको श्रोत",
    "पानी शुद्धीकरण",
    "शौचालय",
    "फोहोरमैला व्यवस्थापन",
    "तथ्याङ्क",
  ],
  openGraph: {
    title: "बुद्धशान्ति गाउँपालिका खानेपानी तथा सरसफाइ | डिजिटल प्रोफाइल",
    description:
      "बुद्धशान्ति गाउँपालिकाको खानेपानी तथा सरसफाइ सम्बन्धी तथ्याङ्क: खानेपानीको श्रोत, पानी शुद्धीकरण, शौचालयको प्रकार र फोहोरमैला व्यवस्थापन सम्बन्धी विस्तृत विवरण।",
    type: "article",
    locale: "ne_NP",
    siteName: "बुद्धशान्ति गाउँपालिका डिजिटल प्रोफाइल",
  },
};

const toc = [
  { level: 2, text: "परिचय", slug: "introduction" },
  { level: 2, text: "प्रमुख तथ्यहरू", slug: "key-facts" },
  {
    level: 2,
    text: "खानेपानी तथा सरसफाइ श्रेणीहरू",
    slug: "water-sanitation-categories",
  },
  { level: 2, text: "सुधारका रणनीतिहरू", slug: "improvement-strategies" },
];

const waterSanitationCategories = [
  {
    title: "खानेपानीको मुख्य श्रोतको आधारमा घरधुरी",
    description:
      "बुद्धशान्ति गाउँपालिकामा उपलब्ध खानेपानीको श्रोतहरू र ती श्रोतहरूको प्रयोग गर्ने घरधुरीहरूको वडागत विवरण।",
    href: "/profile/water-and-sanitation/ward-wise-drinking-water-source",
    icon: <Droplet className="h-5 w-5" />,
  },
  {
    title: "खानेपानी शुद्ध बनाउने तरिकाको आधारमा घरधुरी",
    description:
      "बुद्धशान्ति गाउँपालिकामा घरपरिवारले खानेपानी शुद्धीकरण गर्न अपनाउने विधिहरू र तिनको वितरण।",
    href: "/profile/water-and-sanitation/ward-wise-water-purification",
    icon: <Filter className="h-5 w-5" />,
  },
  {
    title: "परिवारले प्रयोग गर्ने चर्पीको प्रकारका आधारमा घरधुरी",
    description:
      "बुद्धशान्ति गाउँपालिकामा प्रयोग हुने विभिन्न प्रकारका शौचालयहरू र तिनको प्रयोग गर्ने घरपरिवारको वितरण।",
    href: "/profile/water-and-sanitation/ward-wise-toilet-type",
    icon: <Bath className="h-5 w-5" />,
  },
  {
    title: "फोहोरमैला व्यवस्थापन गर्ने स्थानको आधारमा घरधुरी",
    description:
      "बुद्धशान्ति गाउँपालिकामा फोहोरमैला व्यवस्थापनका विधिहरू र तिनको प्रयोग गर्ने घरधुरीहरूको वडागत विश्लेषण।",
    href: "/profile/water-and-sanitation/ward-wise-solid-waste-management",
    icon: <Trash2 className="h-5 w-5" />,
  },
];

export default async function WaterAndSanitationPage() {
  // Fetch summary data for different aspects of water and sanitation
  let drinkingWaterData = null;
  let toiletTypeData = null;
  let solidWasteData = null;
  let waterPurificationData = null;

  try {
    // Try to fetch drinking water source data
    drinkingWaterData =
      await api.profile.waterAndSanitation.wardWiseDrinkingWaterSource.getAll
        .query()
        .catch(() => null);

    // Try to fetch toilet type data
    toiletTypeData =
      await api.profile.waterAndSanitation.wardWiseToiletType.getAll
        .query()
        .catch(() => null);

    // Try to fetch solid waste management data
    solidWasteData =
      await api.profile.waterAndSanitation.wardWiseSolidWasteManagement.getAll
        .query()
        .catch(() => null);

    // Try to fetch water purification data
    waterPurificationData =
      await api.profile.waterAndSanitation.wardWiseWaterPurification.getAll
        .query()
        .catch(() => null);
  } catch (error) {
    console.error("Error fetching water and sanitation data:", error);
  }

  // Calculate summary statistics if data is available
  const pipedWaterHouseholds = drinkingWaterData
    ? drinkingWaterData
        .filter(
          (item) =>
            item.drinkingWaterSource === "TAP_INSIDE_HOUSE" ||
            item.drinkingWaterSource === "TAP_OUTSIDE_HOUSE",
        )
        .reduce((sum, item) => sum + (item.households || 0), 0)
    : null;

  const flushToiletHouseholds = toiletTypeData
    ? toiletTypeData
        .filter((item) => item.toiletType === "FLUSH_WITH_SEPTIC_TANK")
        .reduce((sum, item) => sum + (item.households || 0), 0)
    : null;

  const formalWasteCollectionHouseholds = solidWasteData
    ? solidWasteData
        .filter(
          (item) =>
            item.solidWasteManagement === "HOME_COLLECTION" ||
            item.solidWasteManagement === "WASTE_COLLECTING_PLACE",
        )
        .reduce((sum, item) => sum + (item.households || 0), 0)
    : null;

  const waterPurificationHouseholds = waterPurificationData
    ? waterPurificationData
        .filter((item) => item.waterPurificationMethod !== "NO_ANY_FILTERING")
        .reduce((sum, item) => sum + (item.households || 0), 0)
    : null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-8">
        {/* Hero Section */}
        <div className="relative rounded-lg overflow-hidden">
          <Image
            src="/images/water-sanitation-hero.svg"
            alt="बुद्धशान्ति गाउँपालिका खानेपानी तथा सरसफाइ"
            width={1200}
            height={400}
            className="w-full h-[300px] object-cover"
            priority
          />
        </div>
        <div className="mt-6 px-2">
          <h1 className="text-4xl font-bold mb-3">
            बुद्धशान्ति गाउँपालिकाको खानेपानी तथा सरसफाइ
          </h1>
        </div>

        {/* Introduction Section */}
        <section id="introduction">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p>
              खानेपानी तथा सरसफाइ सम्बन्धी तथ्याङ्कहरू स्वास्थ्य, वातावरण र
              जीवनस्तरको महत्त्वपूर्ण सूचकहरू हुन्। बुद्धशान्ति गाउँपालिकाको
              खानेपानी तथा सरसफाइ सम्बन्धी प्रोफाइलमा खानेपानीको स्रोत, पानी
              शुद्धीकरणका विधिहरू, शौचालयको प्रकार र प्रयोग, तथा फोहोरमैला
              व्यवस्थापन सम्बन्धी विस्तृत तथ्याङ्कहरू समेटिएका छन्। यी
              तथ्याङ्कहरूले पालिकाभित्रका नागरिकहरूको स्वास्थ्य, सरसफाइ र
              वातावरणीय अवस्था बुझ्न र सुधारका लागि योजना बनाउन महत्त्वपूर्ण
              भूमिका खेल्छन्।
            </p>
          </div>
        </section>

        {/* Key Facts Section */}
        <section id="key-facts">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight border-b pb-2 mb-6">
              प्रमुख तथ्यहरू
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Key stats cards */}
            <div className="bg-muted/20 border rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium mb-2">
                पाइप खानेपानी प्रयोग गर्ने घरधुरी
              </h3>
              <p className="text-3xl font-bold text-primary">
                {pipedWaterHouseholds !== null
                  ? localizeNumber(pipedWaterHouseholds.toLocaleString(), "ne")
                  : "लोड हुँदैछ..."}
              </p>
            </div>

            <div className="bg-muted/20 border rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium mb-2">
                पानी शुद्धीकरण गर्ने घरधुरी
              </h3>
              <p className="text-3xl font-bold text-primary">
                {waterPurificationHouseholds !== null
                  ? localizeNumber(
                      waterPurificationHouseholds.toLocaleString(),
                      "ne",
                    )
                  : "लोड हुँदैछ..."}
              </p>
            </div>

            <div className="bg-muted/20 border rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium mb-2">
                फ्लश टोइलेट प्रयोग गर्ने घरधुरी
              </h3>
              <p className="text-3xl font-bold text-primary">
                {flushToiletHouseholds !== null
                  ? localizeNumber(flushToiletHouseholds.toLocaleString(), "ne")
                  : "लोड हुँदैछ..."}
              </p>
            </div>

            <div className="bg-muted/20 border rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium mb-2">
                औपचारिक फोहोर संकलन प्रयोग गर्ने
              </h3>
              <p className="text-3xl font-bold text-primary">
                {formalWasteCollectionHouseholds !== null
                  ? localizeNumber(
                      formalWasteCollectionHouseholds.toLocaleString(),
                      "ne",
                    )
                  : "लोड हुँदैछ..."}
              </p>
            </div>
          </div>
        </section>

        {/* Water and Sanitation Categories Section */}
        <section id="water-sanitation-categories" className="my-8">
          <div className="prose prose-lg dark:prose-invert max-w-none mb-6">
            <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight border-b pb-2">
              खानेपानी तथा सरसफाइ श्रेणीहरू
            </h2>
            <p>
              बुद्धशान्ति गाउँपालिकाको खानेपानी तथा सरसफाइ सम्बन्धी विस्तृत
              जानकारीका लागि तलका श्रेणीहरू हेर्नुहोस्। प्रत्येक श्रेणीमा
              विस्तृत तथ्याङ्क, चार्ट र विश्लेषण प्रस्तुत गरिएको छ।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {waterSanitationCategories.map((category, i) => (
              <Link
                key={i}
                href={category.href}
                className="flex flex-col h-full group hover:shadow-md transition-all duration-200 bg-background border rounded-lg overflow-hidden"
              >
                <div className="p-6 flex-grow">
                  <div className="flex items-start gap-4">
                    <div className="mt-1 rounded-full bg-primary/10 p-2 text-primary">
                      {category.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                        {category.title}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {category.description}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="px-6 py-3 bg-muted/20 flex items-center justify-end">
                  <span className="text-sm text-primary font-medium flex items-center">
                    हेर्नुहोस् <ChevronRight className="h-4 w-4 ml-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Improvement Strategies Section */}
        <section id="improvement-strategies" className="my-8">
          <div className="prose prose-lg dark:prose-invert max-w-none mb-6">
            <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight border-b pb-2">
              सुधारका रणनीतिहरू
            </h2>
            <p>
              बुद्धशान्ति गाउँपालिकामा खानेपानी तथा सरसफाइको अवस्था सुधार गर्न
              निम्न रणनीतिहरू अपनाउन सकिन्छ:
            </p>

            <div className="pl-6 space-y-4 mt-4">
              <div className="flex">
                <span className="font-bold mr-2">१.</span>
                <div>
                  <strong>खानेपानीको पहुँच विस्तार:</strong> खानेपानीको पाइपलाइन
                  विस्तार गरी पाइप खानेपानीको पहुँच बढाउने।
                </div>
              </div>

              <div className="flex">
                <span className="font-bold mr-2">२.</span>
                <div>
                  <strong>पानी शुद्धीकरण अभिवृद्धि:</strong> घरायसी स्तरमा पानी
                  शुद्धीकरणका विधिहरू प्रवर्द्धन गर्ने।
                </div>
              </div>

              <div className="flex">
                <span className="font-bold mr-2">३.</span>
                <div>
                  <strong>सुरक्षित शौचालय निर्माण:</strong> सबै घरपरिवारमा
                  सुरक्षित शौचालयको पहुँच सुनिश्चित गर्ने।
                </div>
              </div>

              <div className="flex">
                <span className="font-bold mr-2">४.</span>
                <div>
                  <strong>फोहोरमैला व्यवस्थापन सुधार:</strong> फोहोरमैला संकलन,
                  वर्गीकरण र व्यवस्थापन प्रणालीमा सुधार ल्याउने।
                </div>
              </div>

              <div className="flex">
                <span className="font-bold mr-2">५.</span>
                <div>
                  <strong>जनचेतना अभिवृद्धि:</strong> खानेपानी तथा सरसफाइको
                  महत्त्व बारे समुदायमा जनचेतना बढाउने कार्यक्रम सञ्चालन गर्ने।
                </div>
              </div>
            </div>

            <p className="mt-6">
              विस्तृत तथ्याङ्क र विश्लेषणका लागि माथि उल्लेखित विभिन्न श्रेणीहरू
              अन्तर्गतका पृष्ठहरू हेर्नुहोस्।
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
