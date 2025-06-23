import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { DocsLayout } from "@/components/layout/DocsLayout";
import { TableOfContents } from "@/components/TableOfContents";
import { api } from "@/trpc/server";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";
import RoadsListDisplay from "./_components/roads-list-display";

// Force dynamic rendering since we're using tRPC which relies on headers
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "पालिकाको सडक नेटवर्क | पालिका प्रोफाइल",
  description:
    "पालिकाका सडकहरूको विवरण, लम्बाई, चौडाई, अवस्था र अन्य विशेषताहरू। राजमार्ग, शहरी सडक, ग्रामीण सडक र अन्य सडकहरूको जानकारी।",
  keywords: [
    "सडक",
    "राजमार्ग",
    "शहरी सडक",
    "ग्रामीण सडक",
    "पूर्वाधार",
    "यातायात",
    "सडक नेटवर्क",
    "सडक अवस्था",
  ],
  openGraph: {
    title: "पालिकाको सडक नेटवर्क | पालिका प्रोफाइल",
    description:
      "पालिकाका सडकहरूको विवरण, लम्बाई, चौडाई, अवस्था र अन्य विशेषताहरू। राजमार्ग, शहरी सडक, ग्रामीण सडक र अन्य सडकहरूको जानकारी।",
    type: "article",
    locale: "ne_NP",
  },
};

// Define Nepali names for road types
const ROAD_TYPE_NAMES: Record<string, string> = {
  HIGHWAY: "राजमार्ग",
  URBAN: "शहरी सडक",
  RURAL: "ग्रामीण सडक",
  GRAVEL: "ग्राभेल सडक",
  EARTHEN: "कच्ची सडक",
  AGRICULTURAL: "कृषि सडक",
  ALLEY: "गल्ली",
  BRIDGE: "पुल",
};

const toc = [
  { level: 2, text: "परिचय", slug: "introduction" },
  { level: 2, text: "सडक प्रकार", slug: "road-types" },
  { level: 2, text: "प्रमुख सडकहरू", slug: "major-roads" },
  { level: 2, text: "तथ्याङ्कको स्रोत", slug: "data-source" },
];

export default async function RoadsPage() {
  // Fetch summary statistics if available
  let summaryData;
  try {
    summaryData = await api.profile.transportation.roads.summary.query();
  } catch (error) {
    console.error("Could not fetch summary data", error);
    summaryData = null;
  }

  // Fetch list of roads with pagination
  const roadsData = await api.profile.transportation.roads.getAll.query({
    page: 1,
    pageSize: 50,
    viewType: "grid",
    sortBy: "name",
    sortOrder: "asc",
  });

  // Group roads by type
  const roadsByType = roadsData.items.reduce(
    (acc: Record<string, any[]>, road) => {
      const type = road.type || "OTHER";
      if (!acc[type]) acc[type] = [];
      acc[type].push(road);
      return acc;
    },
    {},
  );

  return (
    <DocsLayout toc={<TableOfContents toc={toc} />}>
      <div className="flex flex-col gap-8">
        <section>
          <div className="relative rounded-lg overflow-hidden mb-8">
            <Image
              src="/images/roads-network.jpg"
              width={1200}
              height={400}
              alt="सडक नेटवर्क"
              className="w-full h-[250px] object-cover rounded-sm"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 flex items-center">
              <div className="p-6 text-white">
                <h1 className="text-3xl font-bold mb-2">
                  पालिकाको सडक नेटवर्क
                </h1>
                <p className="text-lg opacity-90 max-w-xl">
                  पालिकाका सडकहरूको विवरण, वर्गीकरण र अवस्था
                </p>
              </div>
            </div>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h2 id="introduction" className="scroll-m-20">
              परिचय
            </h2>
            <p>
              यस खण्डमा पालिकाको सडक नेटवर्क सम्बन्धी विस्तृत जानकारी प्रस्तुत
              गरिएको छ। पालिकाको आर्थिक, सामाजिक र भौतिक विकासमा सडक पूर्वाधारको
              महत्वपूर्ण भूमिका रहेको छ। यहाँ विभिन्न प्रकारका सडकहरू, तिनको
              लम्बाई, चौडाई, अवस्था र अन्य विशेषताहरूको बारेमा जानकारी पाउन
              सकिन्छ।
            </p>

            {/* Road stats overview */}
            {summaryData && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
                <Card>
                  <CardHeader className="py-4 px-5">
                    <CardTitle className="text-lg">कुल सडक लम्बाई</CardTitle>
                  </CardHeader>
                  <CardContent className="py-0 px-5">
                    <div className="text-3xl font-bold text-primary">
                      {summaryData.totalLength
                        ? `${summaryData.totalLength.toLocaleString()} कि.मि.`
                        : "तथ्याङ्क उपलब्ध छैन"}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="py-4 px-5">
                    <CardTitle className="text-lg">कुल सडक संख्या</CardTitle>
                  </CardHeader>
                  <CardContent className="py-0 px-5">
                    <div className="text-3xl font-bold text-primary">
                      {summaryData.totalRoads?.toLocaleString() ||
                        "तथ्याङ्क उपलब्ध छैन"}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="py-4 px-5">
                    <CardTitle className="text-lg">कालोपत्रे सडक</CardTitle>
                  </CardHeader>
                  <CardContent className="py-0 px-5">
                    <div className="text-3xl font-bold text-primary">
                      {summaryData.pavedRoadLength
                        ? `${summaryData.pavedRoadLength.toLocaleString()} कि.मि.`
                        : "तथ्याङ्क उपलब्ध छैन"}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="py-4 px-5">
                    <CardTitle className="text-lg">कच्ची सडक</CardTitle>
                  </CardHeader>
                  <CardContent className="py-0 px-5">
                    <div className="text-3xl font-bold text-primary">
                      {summaryData.earthenRoadLength
                        ? `${summaryData.earthenRoadLength.toLocaleString()} कि.मि.`
                        : "तथ्याङ्क उपलब्ध छैन"}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            <h2 id="road-types" className="scroll-m-20 border-b pb-2">
              सडक प्रकार
            </h2>
            <p>
              पालिकामा विभिन्न प्रकारका सडकहरू रहेका छन्, जसमा राजमार्ग, शहरी
              सडक, ग्रामीण सडक, ग्राभेल सडक, कच्ची सडक, कृषि सडक र अन्य सडकहरू
              समावेश छन्। यी सडकहरू सडकको प्राविधिक विशेषता, प्रयोजन र महत्वको
              आधारमा वर्गीकृत गरिएका छन्।
            </p>

            {/* Display road types in cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-6">
              {Object.entries(ROAD_TYPE_NAMES).map(([type, name]) => {
                const roadCount = roadsByType[type]?.length || 0;
                return (
                  <Card
                    key={type}
                    className={roadCount > 0 ? "" : "opacity-70"}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center justify-between">
                        {name}
                        <Badge variant="secondary">{roadCount}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                      {type === "HIGHWAY" && "राष्ट्रिय महत्वका प्रमुख सडकहरू"}
                      {type === "URBAN" &&
                        "शहरी क्षेत्रमा निर्माण गरिएका सडकहरू"}
                      {type === "RURAL" &&
                        "ग्रामीण क्षेत्रमा निर्माण गरिएका सडकहरू"}
                      {type === "GRAVEL" && "ग्राभेल बिछ्याइएका सडकहरू"}
                      {type === "EARTHEN" && "माटोले बनेका कच्ची सडकहरू"}
                      {type === "AGRICULTURAL" &&
                        "कृषि उत्पादन ढुवानीको लागि प्रयोग हुने सडकहरू"}
                      {type === "ALLEY" && "साँघुरा सहायक मार्गहरू"}
                      {type === "BRIDGE" &&
                        "नदी वा खोला माथि निर्माण गरिएका पुलहरू"}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          <RoadsListDisplay
            roadsData={roadsData}
            ROAD_TYPE_NAMES={ROAD_TYPE_NAMES}
          />

          <div className="prose prose-slate dark:prose-invert max-w-none mt-8">
            <h2 id="data-source" className="scroll-m-20 border-b pb-2">
              तथ्याङ्कको स्रोत
            </h2>
            <p>
              माथि प्रस्तुत गरिएका तथ्याङ्कहरू पालिकाको पूर्वाधार विकास शाखा,
              प्राविधिक कार्यालय र सडक विभागको प्रतिवेदनबाट संकलन गरिएका हुन्।
              यी तथ्याङ्कहरूको महत्व निम्न अनुसार छ:
            </p>

            <ul>
              <li>यातायात र पूर्वाधार विकासको योजना निर्माणमा सहयोग</li>
              <li>सडक स्तरोन्नति र मर्मत सम्भारका लागि प्राथमिकता निर्धारण</li>
              <li>सडक सुरक्षा व्यवस्थापन र सुधार</li>
              <li>आवागमन र ढुवानी सम्बन्धी नीति निर्माण</li>
            </ul>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
}
