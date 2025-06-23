import {
  ChevronRight,
  BarChart3,
  PieChart,
  Users,
  UserCheck,
  Activity,
  Skull,
  HeartPulse,
  Building,
  BabyIcon,
  Home,
  Clock,
} from "lucide-react";
import { api } from "@/trpc/server";
import Image from "next/image";
import { localizeNumber } from "@/lib/utils/localize-number";
import type { Metadata } from "next";
import Link from "next/link";

// Force dynamic rendering since we're using tRPC which relies on headers
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "गढवा गाउँपालिका जनसांख्यिकी तथ्याङ्क | डिजिटल प्रोफाइल",
  description:
    "गढवा गाउँपालिकाको जनसांख्यिकी तथ्याङ्क: जनसंख्या, उमेर, लिङ्ग, जात, धर्म, मातृभाषा र वैवाहिक स्थिति सम्बन्धी विस्तृत तथ्याङ्क र विश्लेषण।",
  keywords: [
    "गढवा गाउँपालिका",
    "जनसांख्यिकी",
    "जनगणना",
    "जनसंख्या",
    "जात",
    "धर्म",
    "मातृभाषा",
    "वैवाहिक स्थिति",
    "तथ्याङ्क",
  ],
  openGraph: {
    title: "गढवा गाउँपालिका जनसांख्यिकी तथ्याङ्क | डिजिटल प्रोफाइल",
    description:
      "गढवा गाउँपालिकाको जनसांख्यिकी तथ्याङ्क: जनसंख्या, उमेर, लिङ्ग, जात, धर्म, मातृभाषा र वैवाहिक स्थिति सम्बन्धी विस्तृत तथ्याङ्क र विश्लेषण।",
    type: "article",
    locale: "ne_NP",
    siteName: "गढवा गाउँपालिका डिजिटल प्रोफाइल",
  },
};

const toc = [
  { level: 2, text: "परिचय", slug: "introduction" },
  { level: 2, text: "प्रमुख जनसांख्यिकी तथ्यहरू", slug: "key-demographics" },
  { level: 2, text: "जनसांख्यिकी श्रेणीहरू", slug: "demographic-categories" },
  { level: 2, text: "जनसंख्या वितरण", slug: "population-distribution" },
];

const demographicCategories = [
  {
    title: "जनसंख्या सारांश",
    description:
      "गढवा गाउँपालिकाको समग्र जनसंख्या, लिङ्ग अनुपात र घरधुरी सम्बन्धी सारांश तथ्याङ्क।",
    href: "/profile/demographics/ward-wise-summary",
    icon: <BarChart3 className="h-5 w-5" />,
  },
  {
    title: "उमेर अनुसार जनसंख्या",
    description:
      "गढवा गाउँपालिकामा उमेर समूह अनुसार जनसंख्या वितरण र वडागत विश्लेषण।",
    href: "/profile/demographics/ward-age-wise-population",
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: "मातृभाषा अनुसार जनसंख्या",
    description:
      "गढवा गाउँपालिकामा बोलिने विभिन्न मातृभाषाहरू र तिनका वक्ताहरूको जनसंख्या।",
    href: "/profile/demographics/ward-wise-mother-tongue-population",
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: "धर्म अनुसार जनसंख्या",
    description:
      "गढवा गाउँपालिकामा मानिने विभिन्न धर्महरू र तिनका अनुयायीहरूको जनसंख्या।",
    href: "/profile/demographics/ward-wise-religion-population",
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: "जात/जनजाति अनुसार जनसंख्या",
    description:
      "गढवा गाउँपालिकामा विभिन्न जात र जनजातिको जनसंख्या र वितरण सम्बन्धी विस्तृत जानकारी।",
    href: "/profile/demographics/ward-wise-caste-population",
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: "घरमूली लिङ्ग अनुसार जनसंख्या",
    description:
      "गढवा गाउँपालिकामा वडागत घरमूली लिङ्ग वितरण र लैङ्गिक समानताको अवस्था।",
    href: "/profile/demographics/ward-wise-househead-gender",
    icon: <Home className="h-5 w-5" />,
  },
  {
    title: "वैवाहिक स्थिति अनुसार जनसंख्या",
    description:
      "गढवा गाउँपालिकामा उमेर अनुसार वैवाहिक स्थिति सम्बन्धी तथ्याङ्क र विवाह दर।",
    href: "/profile/demographics/ward-age-wise-marital-status",
    icon: <UserCheck className="h-5 w-5" />,
  },
  {
    title: "आर्थिक रुपले सक्रिय जनसंख्या",
    description:
      "गढवा गाउँपालिकामा उमेर समूह अनुसार आर्थिक रुपले सक्रिय जनसंख्याको विश्लेषण।",
    href: "/profile/demographics/ward-age-wise-economically-active-population",
    icon: <Activity className="h-5 w-5" />,
  },
  {
    title: "अपाङ्गता कारणका आधारमा जनसंख्या",
    description:
      "गढवा गाउँपालिकामा अपाङ्गताको कारण अनुसार जनसंख्याको वितरण र विश्लेषण।",
    href: "/profile/demographics/ward-wise-disability-cause",
    icon: <HeartPulse className="h-5 w-5" />,
  },
  {
    title: "जन्म स्थानको आधारमा घरधुरी",
    description:
      "गढवा गाउँपालिकामा घरपरिवारको जन्मस्थान अनुसार वितरण र बसाई सराईको प्रवृत्ति।",
    href: "/profile/demographics/ward-wise-birthplace-households",
    icon: <Building className="h-5 w-5" />,
  },
  {
    title: "बालबालिकाको जन्मदर्ताको आधारमा जनसंख्या",
    description:
      "गढवा गाउँपालिकामा पाँच वर्षमुनिका बालबालिकाहरूको जन्मदर्ता सम्बन्धी तथ्याङ्क।",
    href: "/profile/demographics/ward-wise-birth-certificate-population",
    icon: <BabyIcon className="h-5 w-5" />,
  },
  {
    title: "विगत १२ महिनामा मृत्यु भएकाको विवरण",
    description:
      "गढवा गाउँपालिकामा उमेर तथा लिङ्ग अनुसार मृत्यु विवरण र मृत्युदर विश्लेषण।",
    href: "/profile/demographics/ward-age-gender-wise-deceased-population",
    icon: <Clock className="h-5 w-5" />,
  },
  {
    title: "मृत्युको कारण अनुसार मृतकको संख्या",
    description:
      "गढवा गाउँपालिकामा मृत्युका विभिन्न कारणहरूको वितरण र विश्लेषण।",
    href: "/profile/demographics/ward-death-causes",
    icon: <Skull className="h-5 w-5" />,
  },
];

export default async function DemographicsPage() {
  // Fetch overall demographic summary for the municipality
  let summaryData;
  try {
    summaryData =
      await api.profile.demographics.wardWiseDemographicSummary.getAll.query();
  } catch (error) {
    console.error("Error fetching demographic summary:", error);
  }

  // Calculate municipality totals if data is available
  const municipalityStats = summaryData
    ? {
        totalPopulation: summaryData.reduce(
          (sum, ward) =>
            sum +
            (ward.totalPopulation ||
              (ward.populationMale || 0) +
                (ward.populationFemale || 0) +
                (ward.populationOther || 0)),
          0,
        ),
        totalHouseholds: summaryData.reduce(
          (sum, ward) => sum + (ward.totalHouseholds || 0),
          0,
        ),
        malePopulation: summaryData.reduce(
          (sum, ward) => sum + (ward.populationMale || 0),
          0,
        ),
        femalePopulation: summaryData.reduce(
          (sum, ward) => sum + (ward.populationFemale || 0),
          0,
        ),
      }
    : null;

  // Calculate sex ratio if data is available
  const sexRatio =
    municipalityStats && municipalityStats.malePopulation > 0
      ? (
          (municipalityStats.femalePopulation /
            municipalityStats.malePopulation) *
          100
        ).toFixed(2)
      : null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-8">
        {/* Hero Section */}
        <div className="relative rounded-lg overflow-hidden">
          <Image
            src="/images/demographics-hero.svg"
            alt="गढवा गाउँपालिका जनसांख्यिकी"
            width={1200}
            height={400}
            className="w-full h-[300px] object-cover"
            priority
          />
        </div>

        <div className="mt-6 px-2">
          <h1 className="text-4xl font-bold mb-3">
            गढवा गाउँपालिकाको जनसांख्यिक विवरण
          </h1>
        </div>
        {/* Introduction Section */}
        <section id="introduction">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p>
              जनसांख्यिकी तथ्याङ्क गाउँपालिका विकास, योजना र नीति निर्माणका लागि
              अत्यन्त महत्त्वपूर्ण हुन्छ। गढवा गाउँपालिकाको जनसांख्यिकी
              प्रोफाइलमा जनसंख्या, वडागत वितरण, लिङ्ग, उमेर, जात, धर्म,
              मातृभाषा, वैवाहिक स्थिति लगायतका तथ्याङ्कहरू समेटिएका छन्। यी
              तथ्याङ्कहरूले स्थानीय सरकारलाई स्रोत विनियोजन, विकास योजना तयारी र
              सेवा प्रवाहलाई लक्षित समुदायसम्म पुर्‍याउन सहयोग पुर्‍याउँछन्。
            </p>
          </div>
        </section>

        {/* Key Demographics Section */}
        <section id="key-demographics">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight border-b pb-2 mb-6">
              प्रमुख जनसांख्यिकी तथ्यहरू
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Key stats cards */}
            <div className="bg-muted/20 border rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium mb-2">कुल जनसंख्या</h3>
              <p className="text-3xl font-bold text-primary">
                {municipalityStats
                  ? localizeNumber(
                      municipalityStats.totalPopulation.toLocaleString(),
                      "ne",
                    )
                  : "लोड हुँदैछ..."}
              </p>
            </div>

            <div className="bg-muted/20 border rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium mb-2">कुल घरधुरी</h3>
              <p className="text-3xl font-bold text-primary">
                {municipalityStats
                  ? localizeNumber(
                      municipalityStats.totalHouseholds.toLocaleString(),
                      "ne",
                    )
                  : "लोड हुँदैछ..."}
              </p>
            </div>

            <div className="bg-muted/20 border rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium mb-2">लैङ्गिक अनुपात</h3>
              <p className="text-3xl font-bold text-primary">
                {sexRatio ? localizeNumber(sexRatio, "ne") : "लोड हुँदैछ..."}
              </p>
              <p className="text-sm text-muted-foreground">
                (प्रति १०० पुरुषमा महिला)
              </p>
            </div>

            <div className="bg-muted/20 border rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium mb-2">वडा संख्या</h3>
              <p className="text-3xl font-bold text-primary">८</p>
            </div>
          </div>
        </section>

        {/* Demographic Categories Section */}
        <section id="demographic-categories" className="my-8">
          <div className="prose prose-lg dark:prose-invert max-w-none mb-6">
            <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight border-b pb-2">
              जनसांख्यिकी श्रेणीहरू
            </h2>
            <p>
              गढवा गाउँपालिकाको जनसांख्यिकी सम्बन्धी विस्तृत जानकारीका लागि
              तलका श्रेणीहरू हेर्नुहोस्。 प्रत्येक श्रेणीमा विस्तृत तथ्याङ्क,
              चार्ट र विश्लेषण प्रस्तुत गरिएको छ。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {demographicCategories.map((category, i) => (
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

        {/* Population Distribution Section */}
        <section id="population-distribution" className="my-8">
          <div className="prose prose-lg dark:prose-invert max-w-none mb-6">
            <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight border-b pb-2">
              जनसंख्या वितरण
            </h2>
            <p>
              गढवा गाउँपालिकाको विस्तृत जनसंख्या वितरण, वडागत विश्लेषण,
              लैङ्गिक अनुपात लगायत अन्य महत्वपूर्ण तथ्याङ्कहरू हेर्न{" "}
              <Link
                href="/profile/demographics/ward-wise-summary"
                className="text-primary hover:text-primary/80 font-medium"
              >
                जनसंख्या सारांश
              </Link>{" "}
              मा जानुहोस्。
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
