import { ChevronRight, GraduationCap, BookOpen, BookX } from "lucide-react";
import { api } from "@/trpc/server";
import Image from "next/image";
import { localizeNumber } from "@/lib/utils/localize-number";
import type { Metadata } from "next";
import Link from "next/link";

// Force dynamic rendering since we're using tRPC which relies on headers
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "केराबारी गाउँपालिका शैक्षिक अवस्था | डिजिटल प्रोफाइल",
  description:
    "केराबारी गाउँपालिकाको शैक्षिक अवस्था सम्बन्धी तथ्याङ्क: शैक्षिक स्तर, साक्षरता दर र विद्यालय छाड्ने कारणहरू सम्बन्धी विस्तृत विवरण।",
  keywords: [
    "केराबारी गाउँपालिका",
    "शैक्षिक अवस्था",
    "शैक्षिक स्तर",
    "साक्षरता दर",
    "विद्यालय छाड्ने कारणहरू",
    "शिक्षा तथ्याङ्क",
  ],
  openGraph: {
    title: "केराबारी गाउँपालिका शैक्षिक अवस्था | डिजिटल प्रोफाइल",
    description:
      "केराबारी गाउँपालिकाको शैक्षिक अवस्था सम्बन्धी तथ्याङ्क: शैक्षिक स्तर, साक्षरता दर र विद्यालय छाड्ने कारणहरू सम्बन्धी विस्तृत विवरण।",
    type: "article",
    locale: "ne_NP",
    siteName: "केराबारी गाउँपालिका डिजिटल प्रोफाइल",
  },
};

const toc = [
  { level: 2, text: "परिचय", slug: "introduction" },
  { level: 2, text: "प्रमुख तथ्यहरू", slug: "key-facts" },
  { level: 2, text: "शैक्षिक श्रेणीहरू", slug: "education-categories" },
  { level: 2, text: "सुधारका रणनीतिहरू", slug: "improvement-strategies" },
];

const educationCategories = [
  {
    title: "शैक्षिक स्तरको अवस्था",
    description:
      "केराबारी गाउँपालिकामा जनसंख्याको शैक्षिक स्तरको वडागत वितरण र विश्लेषण।",
    href: "/profile/education/ward-wise-educational-level",
    icon: <GraduationCap className="h-5 w-5" />,
  },
  {
    title: "साक्षरताको अवस्था",
    description:
      "केराबारी गाउँपालिकामा साक्षरताको अवस्थाको वडागत वितरण र विश्लेषण।",
    href: "/profile/education/ward-wise-literacy-status",
    icon: <BookOpen className="h-5 w-5" />,
  },
  {
    title: "विद्यालय छाड्ने कारणहरू",
    description:
      "केराबारी गाउँपालिकामा विद्यार्थीहरूले विद्यालय छाड्नुका कारणहरूको वडागत विश्लेषण।",
    href: "/profile/education/ward-wise-school-dropout",
    icon: <BookX className="h-5 w-5" />,
  },
];

export default async function EducationPage() {
  // Fetch summary data for different education aspects
  let educationalLevelData = null;
  let literacyStatusData = null;
  let schoolDropoutData = null;

  try {
    // Try to fetch educational level data
    educationalLevelData =
      await api.profile.education.wardWiseEducationalLevel.getAll
        .query()
        .catch(() => null);

    // Try to fetch literacy status data
    literacyStatusData =
      await api.profile.education.wardWiseLiteracyStatus.getAll
        .query()
        .catch(() => null);

    // Try to fetch school dropout data
    schoolDropoutData = await api.profile.education.wardWiseSchoolDropout.getAll
      .query()
      .catch(() => null);
  } catch (error) {
    console.error("Error fetching education data:", error);
  }

  // Calculate summary statistics if data is available
  // Higher education percentage
  const higherEducationRate = educationalLevelData
    ? (() => {
        // Group education levels
        const higherEducationLevels = [
          "BACHELOR_LEVEL",
          "MASTERS_LEVEL",
          "PHD_LEVEL",
        ];

        // Calculate total population and higher education population
        let totalPopulation = 0;
        let higherEducationPopulation = 0;
        educationalLevelData.forEach((item) => {
          totalPopulation += item.population;
          if (higherEducationLevels.includes(item.educationalLevelType)) {
            higherEducationPopulation += item.population;
          }
        });

        return totalPopulation > 0
          ? (higherEducationPopulation / totalPopulation) * 100
          : null;
      })()
    : null;

  // Literacy rate calculation
  const literacyRate = literacyStatusData
    ? (() => {
        let totalPopulation = 0;
        let literatePopulation = 0;

        literacyStatusData.forEach((item) => {
          totalPopulation += item.population;
          if (
            item.literacyType === "BOTH_READING_AND_WRITING" ||
            item.literacyType === "READING_ONLY"
          ) {
            literatePopulation += item.population;
          }
        });

        return totalPopulation > 0
          ? (literatePopulation / totalPopulation) * 100
          : null;
      })()
    : null;

  // Full literacy rate (both reading and writing)
  const fullLiteracyRate = literacyStatusData
    ? (() => {
        let totalPopulation = 0;
        let fullyLiteratePopulation = 0;

        literacyStatusData.forEach((item) => {
          totalPopulation += item.population;
          if (item.literacyType === "BOTH_READING_AND_WRITING") {
            fullyLiteratePopulation += item.population;
          }
        });

        return totalPopulation > 0
          ? (fullyLiteratePopulation / totalPopulation) * 100
          : null;
      })()
    : null;

  // Economic dropout reason percentage
  const economicDropoutRate = schoolDropoutData
    ? (() => {
        const economicReasons = ["EXPENSIVE", "HOUSE_HELP", "EMPLOYMENT"];
        let totalDropouts = 0;
        let economicDropouts = 0;

        schoolDropoutData.forEach((item) => {
          totalDropouts += item.population;
          if (economicReasons.includes(item.cause)) {
            economicDropouts += item.population;
          }
        });

        return totalDropouts > 0
          ? (economicDropouts / totalDropouts) * 100
          : null;
      })()
    : null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-8">
        {/* Hero Section */}
        <div className="relative rounded-lg overflow-hidden">
          <Image
            src="/images/education-hero.svg"
            alt="केराबारी गाउँपालिका शैक्षिक अवस्था"
            width={1200}
            height={400}
            className="w-full h-[300px] object-cover"
            priority
          />
        </div>
        <div className="mt-6 px-2">
          <h1 className="text-4xl font-bold mb-3">
            केराबारी गाउँपालिकाको शैक्षिक अवस्था
          </h1>
        </div>

        {/* Introduction Section */}
        <section id="introduction">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p>
              शिक्षा एक समाजको विकास र प्रगतिको महत्वपूर्ण मापदण्ड हो। शैक्षिक
              अवस्थाको अध्ययन र विश्लेषणले समुदायको साक्षरता, शिक्षामा पहुँच र
              गुणस्तरीय शिक्षाको अवस्थाका बारेमा महत्वपूर्ण जानकारी प्रदान
              गर्दछ। केराबारी गाउँपालिकाको शैक्षिक प्रोफाइलमा शैक्षिक स्तर,
              साक्षरताको अवस्था र विद्यालय छाड्ने कारणहरू सम्बन्धी विस्तृत
              तथ्याङ्कहरू समेटिएका छन्। यी तथ्याङ्कहरूले पालिकाभित्रको शैक्षिक
              स्थिति बुझ्न र सुधारका लागि नीति तथा कार्यक्रमहरू तर्जुमा गर्न
              महत्वपूर्ण भूमिका खेल्छन्।
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
              <h3 className="text-lg font-medium mb-2">साक्षरता दर</h3>
              <p className="text-3xl font-bold text-primary">
                {literacyRate !== null
                  ? localizeNumber(`${literacyRate.toFixed(1)}%`, "ne")
                  : "लोड हुँदैछ..."}
              </p>
            </div>

            <div className="bg-muted/20 border rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium mb-2">पूर्ण साक्षरता दर</h3>
              <p className="text-3xl font-bold text-primary">
                {fullLiteracyRate !== null
                  ? localizeNumber(`${fullLiteracyRate.toFixed(1)}%`, "ne")
                  : "लोड हुँदैछ..."}
              </p>
            </div>

            <div className="bg-muted/20 border rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium mb-2">
                उच्च शिक्षा हासिल जनसंख्या
              </h3>
              <p className="text-3xl font-bold text-primary">
                {higherEducationRate !== null
                  ? localizeNumber(`${higherEducationRate.toFixed(1)}%`, "ne")
                  : "लोड हुँदैछ..."}
              </p>
            </div>

            <div className="bg-muted/20 border rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium mb-2">
                आर्थिक कारणले विद्यालय छाड्ने
              </h3>
              <p className="text-3xl font-bold text-primary">
                {economicDropoutRate !== null
                  ? localizeNumber(`${economicDropoutRate.toFixed(1)}%`, "ne")
                  : "लोड हुँदैछ..."}
              </p>
            </div>
          </div>
        </section>

        {/* Education Categories Section */}
        <section id="education-categories" className="my-8">
          <div className="prose prose-lg dark:prose-invert max-w-none mb-6">
            <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight border-b pb-2">
              शैक्षिक श्रेणीहरू
            </h2>
            <p>
              केराबारी गाउँपालिकाको शैक्षिक अवस्था सम्बन्धी विस्तृत जानकारीका
              लागि तलका श्रेणीहरू हेर्नुहोस्। प्रत्येक श्रेणीमा विस्तृत
              तथ्याङ्क, चार्ट र विश्लेषण प्रस्तुत गरिएको छ।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {educationCategories.map((category, i) => (
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
              केराबारी गाउँपालिकामा शैक्षिक अवस्था सुधार गर्न निम्न रणनीतिहरू
              अपनाउन सकिन्छ:
            </p>

            <div className="pl-6 space-y-4 mt-4">
              <div className="flex">
                <span className="font-bold mr-2">१.</span>
                <div>
                  <strong>साक्षरता अभियान:</strong> पूर्ण साक्षरता प्राप्त गर्न
                  लक्षित वडाहरूमा विशेष साक्षरता अभियान संचालन गर्ने।
                </div>
              </div>

              <div className="flex">
                <span className="font-bold mr-2">२.</span>
                <div>
                  <strong>विद्यालय भर्ना कार्यक्रम:</strong> सबै बालबालिकालाई
                  विद्यालय भर्ना अभियान संचालन गरी विद्यालय बाहिर रहेका
                  बालबालिकालाई शिक्षामा समावेश गर्ने।
                </div>
              </div>

              <div className="flex">
                <span className="font-bold mr-2">३.</span>
                <div>
                  <strong>आर्थिक सहयोग कार्यक्रम:</strong> आर्थिक कारणले
                  विद्यालय छाड्ने समस्यालाई सम्बोधन गर्न छात्रवृत्ति, निःशुल्क
                  पाठ्यपुस्तक र दिवा खाजा जस्ता कार्यक्रमलाई प्रभावकारी बनाउने।
                </div>
              </div>

              <div className="flex">
                <span className="font-bold mr-2">४.</span>
                <div>
                  <strong>शिक्षाको गुणस्तर सुधार:</strong> शिक्षकको क्षमता
                  विकास, पूर्वाधार सुधार र आधुनिक शिक्षण विधि अपनाई शिक्षाको
                  गुणस्तर वृद्धि गर्ने।
                </div>
              </div>

              <div className="flex">
                <span className="font-bold mr-2">५.</span>
                <div>
                  <strong>उच्च शिक्षामा प्रोत्साहन:</strong> स्थानीय स्तरमा उच्च
                  शिक्षा र प्राविधिक शिक्षाको पहुँच बढाउन प्रोत्साहन कार्यक्रम
                  संचालन गर्ने।
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
