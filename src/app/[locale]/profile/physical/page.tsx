import {
  ChevronRight,
  Clock,
  ShoppingBag,
  Flame,
  Zap,
  Smartphone,
} from "lucide-react";
import { api } from "@/trpc/server";
import Image from "next/image";
import { localizeNumber } from "@/lib/utils/localize-number";
import type { Metadata } from "next";
import Link from "next/link";

// Force dynamic rendering since we're using tRPC which relies on headers
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "गढवा गाउँपालिका भौतिक पूर्वाधार | डिजिटल प्रोफाइल",
  description:
    "गढवा गाउँपालिकाको भौतिक पूर्वाधार सम्बन्धी तथ्याङ्क: सार्वजनिक यातायात, बजार केन्द्र पहुँच, खाना पकाउने इन्धन, विद्युत स्रोत र घरायसी सुविधाहरू सम्बन्धी विस्तृत विवरण।",
  keywords: [
    "गढवा गाउँपालिका",
    "भौतिक पूर्वाधार",
    "यातायात पहुँच",
    "बजार केन्द्र",
    "खाना पकाउने इन्धन",
    "विद्युत स्रोत",
    "घरायसी सुविधाहरू",
    "तथ्याङ्क",
  ],
  openGraph: {
    title: "गढवा गाउँपालिका भौतिक पूर्वाधार | डिजिटल प्रोफाइल",
    description:
      "गढवा गाउँपालिकाको भौतिक पूर्वाधार सम्बन्धी तथ्याङ्क: सार्वजनिक यातायात, बजार केन्द्र पहुँच, खाना पकाउने इन्धन, विद्युत स्रोत र घरायसी सुविधाहरू सम्बन्धी विस्तृत विवरण।",
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
    text: "भौतिक पूर्वाधार श्रेणीहरू",
    slug: "physical-infrastructure-categories",
  },
  { level: 2, text: "सुधारका रणनीतिहरू", slug: "improvement-strategies" },
];

const physicalInfrastructureCategories = [
  {
    title: "सार्वजनिक यातायातसम्मको पहुँचको अवस्था",
    description:
      "गढवा गाउँपालिकामा घरपरिवारले सार्वजनिक यातायातमा पुग्न लाग्ने समयको वडागत विवरण र विश्लेषण।",
    href: "/profile/physical/ward-wise-time-to-public-transport",
    icon: <Clock className="h-5 w-5" />,
  },
  {
    title:
      "आफु बसोबास गरेको स्थानबाट नजिकका बजार केन्द्रसम्म लाग्ने अनुमानित समय",
    description:
      "गढवा गाउँपालिकामा घरधुरीहरूले नजिकको बजार केन्द्रसम्म पुग्न लाग्ने समयको वडागत विवरण।",
    href: "/profile/physical/ward-wise-time-to-market-center",
    icon: <ShoppingBag className="h-5 w-5" />,
  },
  {
    title: "खाना पकाउने मुख्य इन्धनको आधारमा घरधुरी",
    description:
      "गढवा गाउँपालिकामा घरपरिवारले खाना पकाउन प्रयोग गर्ने इन्धनको प्रकार र त्यसको वडागत वितरण।",
    href: "/profile/physical/ward-wise-cooking-fuel",
    icon: <Flame className="h-5 w-5" />,
  },
  {
    title: "बत्ती बाल्ने इन्धनको प्रयोगको आधारमा",
    description:
      "गढवा गाउँपालिकामा घरपरिवारले बत्ती बाल्न प्रयोग गर्ने विद्युतको स्रोत र त्यसको वडागत वितरण।",
    href: "/profile/physical/ward-wise-electricity-source",
    icon: <Zap className="h-5 w-5" />,
  },
  {
    title: "आधुनिक सुविधामा पहुँच सम्बन्धी विवरण",
    description:
      "गढवा गाउँपालिकामा घरपरिवारको आधुनिक सुविधा तथा घरायसी उपकरणहरूमा पहुँचको वडागत विश्लेषण।",
    href: "/profile/physical/ward-wise-facilities",
    icon: <Smartphone className="h-5 w-5" />,
  },
];

export default async function PhysicalInfrastructurePage() {
  // Fetch summary data for different aspects of physical infrastructure
  let publicTransportData = null;
  let marketAccessData = null;
  let cookingFuelData = null;
  let electricitySourceData = null;
  let facilitiesData = null;

  try {
    // Try to fetch public transport access data
    publicTransportData =
      await api.profile.physical.wardWiseTimeToPublicTransport.getAll
        .query()
        .catch(() => null);

    // Try to fetch market center access data
    marketAccessData =
      await api.profile.physical.wardWiseTimeToMarketCenter.getAll
        .query()
        .catch(() => null);

    // Try to fetch cooking fuel data
    cookingFuelData = await api.profile.physical.wardWiseCookingFuel.getAll
      .query()
      .catch(() => null);

    // Try to fetch electricity source data
    electricitySourceData =
      await api.profile.physical.wardWiseElectricitySource.getAll
        .query()
        .catch(() => null);

    // Try to fetch facilities data
    facilitiesData = await api.profile.physical.wardWiseFacilities.getAll
      .query()
      .catch(() => null);
  } catch (error) {
    console.error("Error fetching physical infrastructure data:", error);
  }

  // Calculate summary statistics if data is available
  const quickPublicTransportAccess = publicTransportData
    ? publicTransportData
        .filter(
          (item) =>
            item.timeToPublicTransport === "UNDER_15_MIN" ||
            item.timeToPublicTransport === "UNDER_30_MIN",
        )
        .reduce((sum, item) => sum + (item.households || 0), 0)
    : null;

  const quickMarketAccess = marketAccessData
    ? marketAccessData
        .filter(
          (item) =>
            item.timeToMarketCenter === "UNDER_15_MIN" ||
            item.timeToMarketCenter === "UNDER_30_MIN",
        )
        .reduce((sum, item) => sum + (item.households || 0), 0)
    : null;

  const cleanCookingFuel = cookingFuelData
    ? cookingFuelData
        .filter(
          (item) =>
            item.cookingFuel === "LP_GAS" ||
            item.cookingFuel === "ELECTRICITY" ||
            item.cookingFuel === "BIOGAS",
        )
        .reduce((sum, item) => sum + (item.households || 0), 0)
    : null;

  const electricityAccess = electricitySourceData
    ? electricitySourceData
        .filter((item) => item.electricitySource === "ELECTRICITY")
        .reduce((sum, item) => sum + (item.households || 0), 0)
    : null;

  // For facilities, let's approximate unique households with internet access
  const internetAccess = facilitiesData
    ? (() => {
        const wardGroups = facilitiesData.reduce((acc: any, curr: any) => {
          acc[curr.wardNumber] = acc[curr.wardNumber] || [];
          acc[curr.wardNumber].push(curr);
          return acc;
        }, {});

        let internetHouseholds = 0;
        Object.values(wardGroups).forEach((wardData: any) => {
          const internetItem = wardData.find(
            (item: any) => item.facility === "INTERNET",
          );
          if (internetItem) internetHouseholds += internetItem.households;
        });

        return internetHouseholds;
      })()
    : null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-8">
        {/* Hero Section */}
        <div className="relative rounded-lg overflow-hidden">
          <Image
            src="/images/physical-infrastructure-hero.svg"
            alt="गढवा गाउँपालिका भौतिक पूर्वाधार"
            width={1200}
            height={400}
            className="w-full h-[300px] object-cover"
            priority
          />
        </div>
        <div className="mt-6 px-2">
          <h1 className="text-4xl font-bold mb-3">
            गढवा गाउँपालिकाको भौतिक पूर्वाधार
          </h1>
        </div>

        {/* Introduction Section */}
        <section id="introduction">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p>
              भौतिक पूर्वाधार सम्बन्धी तथ्याङ्कहरू पालिकाको विकास, जनताको
              जीवनस्तर र सेवा सुविधाको पहुँचको महत्त्वपूर्ण सूचकहरू हुन्।
              गढवा गाउँपालिकाको भौतिक पूर्वाधार सम्बन्धी प्रोफाइलमा
              सार्वजनिक यातायातमा पहुँच, बजार केन्द्रसम्मको दूरी, खाना पकाउने
              इन्धन, विद्युतको स्रोत तथा घरायसी सुविधाहरू सम्बन्धी विस्तृत
              तथ्याङ्कहरू समेटिएका छन्। यी तथ्याङ्कहरूले पालिकाभित्रका
              नागरिकहरूको भौतिक सुविधा, जीवनस्तर र विकासको अवस्था बुझ्न र
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
              <h3 className="text-lg font-medium mb-2">
                ३० मिनेटभित्र यातायात पहुँच भएका घरधुरी
              </h3>
              <p className="text-3xl font-bold text-primary">
                {quickPublicTransportAccess !== null
                  ? localizeNumber(
                      quickPublicTransportAccess.toLocaleString(),
                      "ne",
                    )
                  : "लोड हुँदैछ..."}
              </p>
            </div>

            <div className="bg-muted/20 border rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium mb-2">
                ३० मिनेटभित्र बजार पहुँच भएका घरधुरी
              </h3>
              <p className="text-3xl font-bold text-primary">
                {quickMarketAccess !== null
                  ? localizeNumber(quickMarketAccess.toLocaleString(), "ne")
                  : "लोड हुँदैछ..."}
              </p>
            </div>

            <div className="bg-muted/20 border rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium mb-2">
                स्वच्छ इन्धन प्रयोग गर्ने घरधुरी
              </h3>
              <p className="text-3xl font-bold text-primary">
                {cleanCookingFuel !== null
                  ? localizeNumber(cleanCookingFuel.toLocaleString(), "ne")
                  : "लोड हुँदैछ..."}
              </p>
            </div>

            <div className="bg-muted/20 border rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium mb-2">
                इन्टरनेट पहुँच भएका घरधुरी
              </h3>
              <p className="text-3xl font-bold text-primary">
                {internetAccess !== null
                  ? localizeNumber(internetAccess.toLocaleString(), "ne")
                  : "लोड हुँदैछ..."}
              </p>
            </div>
          </div>
        </section>

        {/* Physical Infrastructure Categories Section */}
        <section id="physical-infrastructure-categories" className="my-8">
          <div className="prose prose-lg dark:prose-invert max-w-none mb-6">
            <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight border-b pb-2">
              भौतिक पूर्वाधार श्रेणीहरू
            </h2>
            <p>
              गढवा गाउँपालिकाको भौतिक पूर्वाधार सम्बन्धी विस्तृत जानकारीका
              लागि तलका श्रेणीहरू हेर्नुहोस्। प्रत्येक श्रेणीमा विस्तृत
              तथ्याङ्क, चार्ट र विश्लेषण प्रस्तुत गरिएको छ।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {physicalInfrastructureCategories.map((category, i) => (
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
              गढवा गाउँपालिकामा भौतिक पूर्वाधारको अवस्था सुधार गर्न निम्न
              रणनीतिहरू अपनाउन सकिन्छ:
            </p>

            <div className="pl-6 space-y-4 mt-4">
              <div className="flex">
                <span className="font-bold mr-2">१.</span>
                <div>
                  <strong>सार्वजनिक यातायात विस्तार:</strong> यातायात पहुँच कम
                  भएका वडाहरूमा सार्वजनिक यातायातको पहुँच विस्तार गर्ने।
                </div>
              </div>

              <div className="flex">
                <span className="font-bold mr-2">२.</span>
                <div>
                  <strong>सडक पूर्वाधार सुधार:</strong> सबै वडा र बस्तीलाई बजार
                  केन्द्रसम्म जोड्ने सडक संजाल विकास र स्तरोन्नति गर्ने।
                </div>
              </div>

              <div className="flex">
                <span className="font-bold mr-2">३.</span>
                <div>
                  <strong>स्वच्छ इन्धन प्रवर्द्धन:</strong> दाउरा र गोबर
                  ग्याँसको प्रयोग कम गरी एलपी ग्याँस र विद्युतको प्रयोग बढाउने।
                </div>
              </div>

              <div className="flex">
                <span className="font-bold mr-2">४.</span>
                <div>
                  <strong>विद्युत आपूर्ति सुधार:</strong> केन्द्रीय विद्युत
                  प्रणालीबाट टाढा रहेका क्षेत्रमा वैकल्पिक ऊर्जा स्रोत विकास
                  गर्ने।
                </div>
              </div>

              <div className="flex">
                <span className="font-bold mr-2">५.</span>
                <div>
                  <strong>डिजिटल पहुँच विस्तार:</strong> इन्टरनेट र अन्य आधुनिक
                  सुविधाहरूमा पहुँच बढाउने गरी पूर्वाधार विकास गर्ने।
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
