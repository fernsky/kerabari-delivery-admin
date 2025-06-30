import { ChevronRight, Activity, Syringe, Shield, Clock } from "lucide-react";
import { api } from "@/trpc/server";
import Image from "next/image";
import { localizeNumber } from "@/lib/utils/localize-number";
import type { Metadata } from "next";
import Link from "next/link";

// Force dynamic rendering since we're using tRPC which relies on headers
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "केराबारी गाउँपालिका स्वास्थ्य अवस्था | डिजिटल प्रोफाइल",
  description:
    "केराबारी गाउँपालिकाको स्वास्थ्य सम्बन्धी तथ्याङ्क: खोप सेवा, स्वास्थ्य बीमा र स्वास्थ्य संस्थाको पहुँच सम्बन्धी विस्तृत विवरण।",
  keywords: [
    "केराबारी गाउँपालिका",
    "स्वास्थ्य अवस्था",
    "खोप सेवा",
    "स्वास्थ्य बीमा",
    "स्वास्थ्य संस्था पहुँच",
    "तथ्याङ्क",
  ],
  openGraph: {
    title: "केराबारी गाउँपालिका स्वास्थ्य अवस्था | डिजिटल प्रोफाइल",
    description:
      "केराबारी गाउँपालिकाको स्वास्थ्य सम्बन्धी तथ्याङ्क: खोप सेवा, स्वास्थ्य बीमा र स्वास्थ्य संस्थाको पहुँच सम्बन्धी विस्तृत विवरण।",
    type: "article",
    locale: "ne_NP",
    siteName: "केराबारी गाउँपालिका डिजिटल प्रोफाइल",
  },
};

const toc = [
  { level: 2, text: "परिचय", slug: "introduction" },
  { level: 2, text: "प्रमुख तथ्यहरू", slug: "key-facts" },
  {
    level: 2,
    text: "स्वास्थ्य सेवा श्रेणीहरू",
    slug: "health-service-categories",
  },
  { level: 2, text: "सुधारका रणनीतिहरू", slug: "improvement-strategies" },
];

const healthServiceCategories = [
  {
    title: "खोप सम्बन्धी विवरण",
    description:
      "केराबारी गाउँपालिकामा खोप सेवा र कभरेजको अवस्था, विभिन्न खोपहरूको प्रगति र खोप सेवाको गुणस्तरको विस्तृत विश्लेषण।",
    href: "/profile/health/immunization-indicators",
    icon: <Syringe className="h-5 w-5" />,
  },
  {
    title: "स्वास्थ्य बीमा गर्ने घरपरिवारको विवरण",
    description:
      "केराबारी गाउँपालिकामा स्वास्थ्य बीमा गरेका र नगरेका घरधुरीको वडागत विवरण र विश्लेषण।",
    href: "/profile/health/ward-wise-health-insured-households",
    icon: <Shield className="h-5 w-5" />,
  },
  {
    title: "नजिकको स्वास्थ्य संस्थासम्म पुग्न लाग्ने समय",
    description:
      "केराबारी गाउँपालिकामा घरपरिवारले नजिकको स्वास्थ्य संस्थासम्म पुग्न लाग्ने समयको वडागत विवरण र विश्लेषण।",
    href: "/profile/health/ward-wise-time-to-health-organization",
    icon: <Clock className="h-5 w-5" />,
  },
];

export default async function HealthPage() {
  // Fetch summary data for different health aspects
  let immunizationData = null;
  let healthInsuredData = null;
  let timeToHealthOrgData = null;

  try {
    // Try to fetch immunization data
    immunizationData = await api.profile.health.immunizationIndicators.getAll
      .query({
        fiscalYear: "FY_2079_2080",
      })
      .catch(() => null);

    // Try to fetch health insured households data
    healthInsuredData =
      await api.profile.health.wardWiseHealthInsuredHouseholds.getAll
        .query()
        .catch(() => null);

    // Try to fetch time to health organization data
    timeToHealthOrgData =
      await api.profile.health.wardWiseTimeToHealthOrganization.getAll
        .query()
        .catch(() => null);
  } catch (error) {
    console.error("Error fetching health data:", error);
  }

  // Calculate summary statistics if data is available
  const fullyImmunizedRate = immunizationData
    ? (() => {
        const fullyImmData = immunizationData.find(
          (item) => item.indicator === "FULLY_IMMUNIZED_NIP_SCHEDULE",
        );
        return fullyImmData ? fullyImmData.value : null;
      })()
    : null;

  const dpt3Coverage = immunizationData
    ? (() => {
        const dpt3Data = immunizationData.find(
          (item) => item.indicator === "DPT_HEPB_HIB3_COVERAGE",
        );
        return dpt3Data ? dpt3Data.value : null;
      })()
    : null;

  // Calculate insured household percentage
  const healthInsuranceRate = healthInsuredData
    ? (() => {
        let totalInsured = 0;
        let totalHouseholds = 0;

        healthInsuredData.forEach((item) => {
          totalInsured += item.insuredHouseholds || 0;
          totalHouseholds +=
            (item.insuredHouseholds || 0) + (item.nonInsuredHouseholds || 0);
        });

        return totalHouseholds > 0
          ? (totalInsured / totalHouseholds) * 100
          : null;
      })()
    : null;

  // Calculate quick access to health facility percentage
  const quickHealthAccessRate = timeToHealthOrgData
    ? (() => {
        let quickAccessHouseholds = 0;
        let totalHouseholds = 0;

        timeToHealthOrgData.forEach((item) => {
          totalHouseholds += item.households || 0;
          if (
            item.timeToHealthOrganization === "UNDER_15_MIN" ||
            item.timeToHealthOrganization === "UNDER_30_MIN"
          ) {
            quickAccessHouseholds += item.households || 0;
          }
        });

        return totalHouseholds > 0
          ? (quickAccessHouseholds / totalHouseholds) * 100
          : null;
      })()
    : null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-8">
        {/* Hero Section */}
        <div className="relative rounded-lg overflow-hidden">
          <Image
            src="/images/health-hero.svg"
            alt="केराबारी गाउँपालिका स्वास्थ्य अवस्था"
            width={1200}
            height={400}
            className="w-full h-[300px] object-cover"
            priority
          />
        </div>
        <div className="mt-6 px-2">
          <h1 className="text-4xl font-bold mb-3">
            केराबारी गाउँपालिकाको स्वास्थ्य अवस्था
          </h1>
        </div>

        {/* Introduction Section */}
        <section id="introduction">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p>
              स्वास्थ्य सम्बन्धी तथ्याङ्कहरू कुनै पनि समुदायको विकास र कल्याणका
              महत्वपूर्ण सूचकहरू हुन्। केराबारी गाउँपालिकाको स्वास्थ्य
              सम्बन्धी प्रोफाइलमा खोप सेवा, स्वास्थ्य बीमा र स्वास्थ्य संस्थाको
              पहुँच सम्बन्धी विस्तृत तथ्याङ्कहरू समेटिएका छन्। यी तथ्याङ्कहरूले
              पालिकाको स्वास्थ्य सेवाको अवस्था, उपलब्धता, पहुँच र गुणस्तरका
              बारेमा जानकारी प्रदान गर्दछन्। यसले स्वास्थ्य नीति निर्माण,
              कार्यक्रम सञ्चालन र स्रोत साधनको परिचालन गर्न महत्वपूर्ण आधार
              प्रदान गर्दछ।
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
              <h3 className="text-lg font-medium mb-2">पूर्ण खोप कभरेज</h3>
              <p className="text-3xl font-bold text-primary">
                {fullyImmunizedRate !== null
                  ? localizeNumber(`${fullyImmunizedRate.toFixed(1)}%`, "ne")
                  : "लोड हुँदैछ..."}
              </p>
            </div>

            <div className="bg-muted/20 border rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium mb-2">DPT-HepB-Hib3 कभरेज</h3>
              <p className="text-3xl font-bold text-primary">
                {dpt3Coverage !== null
                  ? localizeNumber(`${dpt3Coverage.toFixed(1)}%`, "ne")
                  : "लोड हुँदैछ..."}
              </p>
            </div>

            <div className="bg-muted/20 border rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium mb-2">स्वास्थ्य बीमा कभरेज</h3>
              <p className="text-3xl font-bold text-primary">
                {healthInsuranceRate !== null
                  ? localizeNumber(`${healthInsuranceRate.toFixed(1)}%`, "ne")
                  : "लोड हुँदैछ..."}
              </p>
            </div>

            <div className="bg-muted/20 border rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium mb-2">
                ३० मिनेटभित्र स्वास्थ्य संस्था पहुँच
              </h3>
              <p className="text-3xl font-bold text-primary">
                {quickHealthAccessRate !== null
                  ? localizeNumber(`${quickHealthAccessRate.toFixed(1)}%`, "ne")
                  : "लोड हुँदैछ..."}
              </p>
            </div>
          </div>
        </section>

        {/* Health Service Categories Section */}
        <section id="health-service-categories" className="my-8">
          <div className="prose prose-lg dark:prose-invert max-w-none mb-6">
            <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight border-b pb-2">
              स्वास्थ्य सेवा श्रेणीहरू
            </h2>
            <p>
              केराबारी गाउँपालिकाको स्वास्थ्य सेवा सम्बन्धी विस्तृत जानकारीका
              लागि तलका श्रेणीहरू हेर्नुहोस्। प्रत्येक श्रेणीमा विस्तृत
              तथ्याङ्क, चार्ट र विश्लेषण प्रस्तुत गरिएको छ।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {healthServiceCategories.map((category, i) => (
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
              केराबारी गाउँपालिकामा स्वास्थ्य सेवाको अवस्था सुधार गर्न निम्न
              रणनीतिहरू अपनाउन सकिन्छ:
            </p>

            <div className="pl-6 space-y-4 mt-4">
              <div className="flex">
                <span className="font-bold mr-2">१.</span>
                <div>
                  <strong>खोप सेवा सुदृढीकरण:</strong> पूर्ण खोप सुनिश्चितता
                  कायम राख्न नियमित खोप सेसन, ट्रेसर प्रणाली र अभिभावक शिक्षा
                  कार्यक्रमलाई प्रभावकारी बनाउने।
                </div>
              </div>

              <div className="flex">
                <span className="font-bold mr-2">२.</span>
                <div>
                  <strong>स्वास्थ्य बीमा प्रवर्द्धन:</strong> स्वास्थ्य बीमाको
                  महत्वबारे जागरण अभियान सञ्चालन गर्दै आर्थिक रूपमा कमजोर वर्गका
                  लागि सहुलियतपूर्ण बीमा योजना ल्याउने।
                </div>
              </div>

              <div className="flex">
                <span className="font-bold mr-2">३.</span>
                <div>
                  <strong>स्वास्थ्य संस्थाको पहुँच विस्तार:</strong> स्वास्थ्य
                  संस्था पहुँच कम भएका वडाहरूमा स्वास्थ्य इकाईहरू वा घुम्ती
                  स्वास्थ्य सेवा विस्तार गर्ने।
                </div>
              </div>

              <div className="flex">
                <span className="font-bold mr-2">४.</span>
                <div>
                  <strong>मातृ तथा शिशु स्वास्थ्य:</strong> गर्भवती सेवा,
                  संस्थागत प्रसूति र सुत्केरी जाँच सेवा बढाउन स्वास्थ्यकर्मीको
                  क्षमता विकास र समुदायमा जागरण बढाउने।
                </div>
              </div>

              <div className="flex">
                <span className="font-bold mr-2">५.</span>
                <div>
                  <strong>स्वास्थ्य सूचना प्रणाली सुदृढीकरण:</strong> डिजिटल
                  स्वास्थ्य रेकर्डिङ तथा रिपोर्टिङ प्रणालीको विकास गरी सही र
                  समयमै स्वास्थ्य सूचना उपलब्ध गराउने।
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
