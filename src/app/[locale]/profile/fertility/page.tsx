import { ChevronRight, Baby, Activity, Building } from "lucide-react";
import { api } from "@/trpc/server";
import Image from "next/image";
import { localizeNumber } from "@/lib/utils/localize-number";
import type { Metadata } from "next";
import Link from "next/link";

// Force dynamic rendering since we're using tRPC which relies on headers
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "गढवा गाउँपालिका प्रजनन् स्वास्थ्य | डिजिटल प्रोफाइल",
  description:
    "गढवा गाउँपालिकाको प्रजनन् स्वास्थ्य सम्बन्धी तथ्याङ्क: सुरक्षित मातृत्वको अवस्था, संस्थागत प्रसूति, गर्भवती स्वास्थ्य सेवा र सुत्केरी स्थान सम्बन्धी विस्तृत विवरण।",
  keywords: [
    "गढवा गाउँपालिका",
    "प्रजनन् स्वास्थ्य",
    "मातृ स्वास्थ्य",
    "सुरक्षित मातृत्व",
    "गर्भवती स्वास्थ्य",
    "संस्थागत प्रसूति",
    "सुत्केरी स्थान",
    "तथ्याङ्क",
  ],
  openGraph: {
    title: "गढवा गाउँपालिका प्रजनन् स्वास्थ्य | डिजिटल प्रोफाइल",
    description:
      "गढवा गाउँपालिकाको प्रजनन् स्वास्थ्य सम्बन्धी तथ्याङ्क: सुरक्षित मातृत्वको अवस्था, संस्थागत प्रसूति, गर्भवती स्वास्थ्य सेवा र सुत्केरी स्थान सम्बन्धी विस्तृत विवरण।",
    type: "article",
    locale: "ne_NP",
    siteName: "गढवा गाउँपालिका डिजिटल प्रोफाइल",
  },
};

const toc = [
  { level: 2, text: "परिचय", slug: "introduction" },
  { level: 2, text: "प्रमुख तथ्यहरू", slug: "key-facts" },
  {
    level: 2,
    text: "प्रजनन् स्वास्थ्य श्रेणीहरू",
    slug: "fertility-categories",
  },
  { level: 2, text: "सुधारका रणनीतिहरू", slug: "improvement-strategies" },
];

const fertilityCategories = [
  {
    title: "सुरक्षित मातृत्वको अवस्थाको विवरण",
    description:
      "गढवा गाउँपालिकामा गर्भवती जाँच, संस्थागत प्रसूति, सुत्केरी सेवा र नवजात शिशु स्वास्थ्य सम्बन्धी सूचकहरूको विस्तृत विवरण।",
    href: "/profile/fertility/safe-motherhood-indicators",
    icon: <Activity className="h-5 w-5" />,
  },
  {
    title: "सुत्केरी गराएको स्थान सम्बन्धी विवरण",
    description:
      "गढवा गाउँपालिकामा महिलाहरूले सुत्केरी गराउने स्थानको वडागत विवरण र विश्लेषण।",
    href: "/profile/fertility/ward-wise-delivery-place",
    icon: <Building className="h-5 w-5" />,
  },
];

export default async function FertilityPage() {
  // Fetch summary data for different aspects of fertility
  let safeMotherhoodData = null;
  let deliveryPlaceData = null;

  try {
    // Try to fetch safe motherhood indicators data
    safeMotherhoodData =
      await api.profile.fertility.safeMotherhoodIndicators.summary
        .query()
        .catch(() => null);

    // Try to fetch delivery place data
    deliveryPlaceData =
      await api.profile.fertility.wardWiseDeliveryPlaces.getAll
        .query()
        .catch(() => null);
  } catch (error) {
    console.error("Error fetching fertility data:", error);
  }

  // Calculate summary statistics if data is available
  const institutionalDeliveries = safeMotherhoodData
    ? safeMotherhoodData.delivery.find(
        (item) => item.indicator === "INSTITUTIONAL_DELIVERIES",
      )?.value
    : null;

  const ancCheckups = safeMotherhoodData
    ? safeMotherhoodData.antenatal.find(
        (item) =>
          item.indicator === "PREGNANT_WOMEN_FOUR_ANC_CHECKUPS_PROTOCOL",
      )?.value
    : null;

  const pncVisits = safeMotherhoodData
    ? safeMotherhoodData.postnatal.find(
        (item) => item.indicator === "POSTPARTUM_MOTHERS_TWO_PNC_HOME_VISITS",
      )?.value
    : null;

  // Calculate institutional delivery count from ward-wise data
  const institutionalDeliveryCount = deliveryPlaceData
    ? deliveryPlaceData
        .filter(
          (item) =>
            item.deliveryPlace === "GOVERNMENTAL_HEALTH_INSTITUTION" ||
            item.deliveryPlace === "PRIVATE_HEALTH_INSTITUTION",
        )
        .reduce((sum, item) => sum + (item.population || 0), 0)
    : null;

  // Calculate total deliveries from ward-wise data
  const totalDeliveries = deliveryPlaceData
    ? deliveryPlaceData.reduce((sum, item) => sum + (item.population || 0), 0)
    : null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-8">
        {/* Hero Section */}
        <div className="relative rounded-lg overflow-hidden">
          <Image
            src="/images/fertility-hero.svg"
            alt="गढवा गाउँपालिका प्रजनन् स्वास्थ्य"
            width={1200}
            height={400}
            className="w-full h-[300px] object-cover"
            priority
          />
        </div>
        <div className="mt-6 px-2">
          <h1 className="text-4xl font-bold mb-3">
            गढवा गाउँपालिकाको प्रजनन् स्वास्थ्य
          </h1>
        </div>

        {/* Introduction Section */}
        <section id="introduction">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p>
              प्रजनन् स्वास्थ्य, विशेषगरी मातृ तथा शिशु स्वास्थ्य सम्बन्धी
              तथ्याङ्कहरू पालिकाको स्वास्थ्य सेवा र जनस्वास्थ्यको महत्त्वपूर्ण
              सूचकहरू हुन्। गढवा गाउँपालिकाको प्रजनन् स्वास्थ्य सम्बन्धी
              प्रोफाइलमा सुरक्षित मातृत्वको अवस्था, गर्भावस्थाको स्वास्थ्य सेवा,
              संस्थागत प्रसूति दर, सुत्केरी पश्चातको स्याहार र सुत्केरी गराइने
              स्थान सम्बन्धी विस्तृत तथ्याङ्कहरू समेटिएका छन्। यी तथ्याङ्कहरूले
              पालिकाभित्रका महिलाहरूको प्रजनन् स्वास्थ्य अवस्था बुझ्न र सेवा
              सुधारका लागि योजना बनाउन महत्त्वपूर्ण भूमिका खेल्छन्।
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
              <h3 className="text-lg font-medium mb-2">संस्थागत प्रसूति दर</h3>
              <p className="text-3xl font-bold text-primary">
                {institutionalDeliveries !== null
                  ? localizeNumber(
                      `${Number(institutionalDeliveries).toFixed(1)}%`,
                      "ne",
                    )
                  : "लोड हुँदैछ..."}
              </p>
            </div>

            <div className="bg-muted/20 border rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium mb-2">
                नियमित गर्भवती जाँच दर
              </h3>
              <p className="text-3xl font-bold text-primary">
                {ancCheckups !== null
                  ? localizeNumber(`${Number(ancCheckups).toFixed(1)}%`, "ne")
                  : "लोड हुँदैछ..."}
              </p>
            </div>

            <div className="bg-muted/20 border rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium mb-2">
                सुत्केरी जाँच सेवा दर
              </h3>
              <p className="text-3xl font-bold text-primary">
                {pncVisits !== null
                  ? localizeNumber(`${Number(pncVisits).toFixed(1)}%`, "ne")
                  : "लोड हुँदैछ..."}
              </p>
            </div>

            <div className="bg-muted/20 border rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium mb-2">
                संस्थागत प्रसूतिको संख्या
              </h3>
              <p className="text-3xl font-bold text-primary">
                {institutionalDeliveryCount !== null && totalDeliveries !== null
                  ? localizeNumber(
                      institutionalDeliveryCount.toLocaleString(),
                      "ne",
                    )
                  : "लोड हुँदैछ..."}
              </p>
            </div>
          </div>
        </section>

        {/* Fertility Categories Section */}
        <section id="fertility-categories" className="my-8">
          <div className="prose prose-lg dark:prose-invert max-w-none mb-6">
            <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight border-b pb-2">
              प्रजनन् स्वास्थ्य श्रेणीहरू
            </h2>
            <p>
              गढवा गाउँपालिकाको प्रजनन् स्वास्थ्य सम्बन्धी विस्तृत जानकारीका
              लागि तलका श्रेणीहरू हेर्नुहोस्। प्रत्येक श्रेणीमा विस्तृत
              तथ्याङ्क, चार्ट र विश्लेषण प्रस्तुत गरिएको छ।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {fertilityCategories.map((category, i) => (
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
              गढवा गाउँपालिकामा प्रजनन् स्वास्थ्यको अवस्था सुधार गर्न निम्न
              रणनीतिहरू अपनाउन सकिन्छ:
            </p>

            <div className="pl-6 space-y-4 mt-4">
              <div className="flex">
                <span className="font-bold mr-2">१.</span>
                <div>
                  <strong>संस्थागत प्रसूति प्रवर्द्धन:</strong> घरमा हुने
                  प्रसूति दर घटाई संस्थागत प्रसूति बढाउन प्रोत्साहन कार्यक्रम
                  सञ्चालन गर्ने।
                </div>
              </div>

              <div className="flex">
                <span className="font-bold mr-2">२.</span>
                <div>
                  <strong>गर्भवती जाँच सेवा सुदृढीकरण:</strong> नियमित चार पटक
                  गर्भवती जाँच पुर्‍याउन स्वास्थ्य संस्थाहरूको क्षमता विकास र
                  महिला स्वास्थ्य स्वयंसेविका परिचालन गर्ने।
                </div>
              </div>

              <div className="flex">
                <span className="font-bold mr-2">३.</span>
                <div>
                  <strong>सुत्केरी जाँच सेवा विस्तार:</strong> सुत्केरी पश्चात्
                  नियमित घरभेट कार्यक्रम र जाँच सेवा सुनिश्चित गर्ने।
                </div>
              </div>

              <div className="flex">
                <span className="font-bold mr-2">४.</span>
                <div>
                  <strong>बर्थिङ सेन्टर विस्तार:</strong> वडा स्तरमा बर्थिङ
                  सेन्टरहरू स्थापना र सुदृढीकरण गरी सेवा पहुँच बढाउने।
                </div>
              </div>

              <div className="flex">
                <span className="font-bold mr-2">५.</span>
                <div>
                  <strong>जनचेतना अभिवृद्धि:</strong> प्रजनन् स्वास्थ्य,
                  सुरक्षित मातृत्व र संस्थागत प्रसूतिको महत्व बारे समुदायमा
                  जनचेतना बढाउने कार्यक्रम सञ्चालन गर्ने।
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
