import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { DocsLayout } from "@/components/layout/DocsLayout";
import { TableOfContents } from "@/components/TableOfContents";
import { api } from "@/trpc/server";
import { ClientRoadDetailDisplay } from "./_components/client-road-detail-display";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPinIcon,
  RulerIcon,
  Route,
  CalendarIcon,
  LightbulbIcon,
  DivideIcon,
  FootprintsIcon,
  Bike,
  DropletIcon,
} from "lucide-react";

// Force dynamic rendering since we're using tRPC which relies on headers
export const dynamic = "force-dynamic";

// Generate metadata dynamically based on the road data
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  try {
    // Get road data for metadata
    const road = await api.profile.transportation.roads.getBySlug.query(
      params.slug,
    );

    return {
      title: road.metaTitle || `${road.name} | पालिका सडक प्रोफाइल`,
      description:
        road.metaDescription ||
        `${road.name} सम्बन्धी विस्तृत जानकारी, तथ्याङ्क र विवरण। ${road.description?.substring(0, 150) || ""}`,
      keywords: road.keywords?.split(",") || [
        "सडक",
        "पालिका",
        "पूर्वाधार",
        "यातायात",
        "विकास",
        road.name,
        ROAD_TYPE_NAMES[road.type] || road.type,
      ],
      openGraph: {
        title: road.metaTitle || `${road.name} | पालिका सडक प्रोफाइल`,
        description:
          road.metaDescription ||
          `${road.name} सम्बन्धी विस्तृत जानकारी र विवरण।`,
        type: "article",
        locale: "ne_NP",
        images:
          road.media && road.media.length > 0 && road.media[0].url
            ? [
                {
                  url: road.media[0].url || "",
                  width: 1200,
                  height: 630,
                  alt: road.name,
                },
              ]
            : undefined,
      },
    };
  } catch (error) {
    return {
      title: "सडक विवरण | पालिका प्रोफाइल",
      description: "पालिकाको सडक सम्बन्धी विस्तृत जानकारी र विवरण।",
    };
  }
}

// Road type names in Nepali
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

// Road condition names in Nepali
const ROAD_CONDITION_NAMES: Record<string, string> = {
  EXCELLENT: "उत्कृष्ट",
  GOOD: "राम्रो",
  FAIR: "ठीकठाक",
  POOR: "कमजोर",
  VERY_POOR: "धेरै कमजोर",
  UNDER_CONSTRUCTION: "निर्माणाधीन",
};

// Drainage system names in Nepali
const DRAINAGE_SYSTEM_NAMES: Record<string, string> = {
  PROPER: "उत्तम",
  PARTIAL: "आंशिक",
  NONE: "छैन",
  BLOCKED: "अवरुद्ध",
};

export default async function RoadDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  try {
    // Get road data
    const road = await api.profile.transportation.roads.getBySlug.query(
      params.slug,
    );

    // Define Table of Contents
    const toc = [
      { level: 2, text: "परिचय", slug: "introduction" },
      { level: 2, text: "सडक विवरण", slug: "road-details" },
      { level: 2, text: "स्थान र नक्शा", slug: "location-and-map" },
      ...(road.media && road.media.length > 0
        ? [{ level: 2, text: "तस्वीरहरू", slug: "images" }]
        : []),
      {
        level: 2,
        text: "प्राविधिक विशेषताहरू",
        slug: "technical-specifications",
      },
    ];

    // Format the road details for display
    const roadTypeNepali = ROAD_TYPE_NAMES[road.type] || road.type;
    const roadConditionNepali = road.condition
      ? ROAD_CONDITION_NAMES[road.condition] || road.condition
      : "";
    const drainageSystemNepali = road.drainageSystem
      ? DRAINAGE_SYSTEM_NAMES[road.drainageSystem] || road.drainageSystem
      : "";

    // Determine background color based on road condition
    const getConditionColor = (condition: string | undefined) => {
      if (!condition) return "bg-gray-100 dark:bg-gray-800";

      switch (condition) {
        case "EXCELLENT":
          return "bg-green-100 dark:bg-green-900";
        case "GOOD":
          return "bg-emerald-100 dark:bg-emerald-900";
        case "FAIR":
          return "bg-yellow-100 dark:bg-yellow-900";
        case "POOR":
          return "bg-orange-100 dark:bg-orange-900";
        case "VERY_POOR":
          return "bg-red-100 dark:bg-red-900";
        case "UNDER_CONSTRUCTION":
          return "bg-blue-100 dark:bg-blue-900";
        default:
          return "bg-gray-100 dark:bg-gray-800";
      }
    };

    // Determine text color based on road condition
    const getConditionTextColor = (condition: string | undefined) => {
      if (!condition) return "text-gray-800 dark:text-gray-200";

      switch (condition) {
        case "EXCELLENT":
          return "text-green-800 dark:text-green-200";
        case "GOOD":
          return "text-emerald-800 dark:text-emerald-200";
        case "FAIR":
          return "text-yellow-800 dark:text-yellow-200";
        case "POOR":
          return "text-orange-800 dark:text-orange-200";
        case "VERY_POOR":
          return "text-red-800 dark:text-red-200";
        case "UNDER_CONSTRUCTION":
          return "text-blue-800 dark:text-blue-200";
        default:
          return "text-gray-800 dark:text-gray-200";
      }
    };

    // Get a featured image for the header
    const featuredImage =
      road.media && road.media.length > 0
        ? road.media[0].url
        : "/images/road-default.jpg";

    return (
      <DocsLayout toc={<TableOfContents toc={toc} />}>
        <div className="flex flex-col gap-8">
          <section>
            <div className="relative rounded-lg overflow-hidden mb-8">
              <Image
                src={featuredImage as string}
                width={1200}
                height={400}
                alt={road.name}
                className="w-full h-[250px] object-cover rounded-sm"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
                <div className="p-6 text-white">
                  <h1 className="text-3xl font-bold mb-1">{road.name}</h1>
                  <p className="text-lg opacity-90">{roadTypeNepali}</p>
                </div>
              </div>
            </div>

            <div className="prose prose-slate dark:prose-invert max-w-none">
              <h2 id="introduction" className="scroll-m-20">
                परिचय
              </h2>
              {road.description ? (
                <p>{road.description}</p>
              ) : (
                <p>
                  {road.name} पालिकाको एक महत्वपूर्ण सडक हो। यस सडकको विस्तृत
                  जानकारी यस पृष्ठमा प्रस्तुत गरिएको छ।
                </p>
              )}

              <h2 id="road-details" className="scroll-m-20 border-b pb-2">
                सडक विवरण
              </h2>
            </div>

            {/* Road overview - Server-side rendered for SEO */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>सडक विवरण</CardTitle>
                <CardDescription>सडकको आधारभूत जानकारी</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Road Type */}
                  <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg flex flex-col items-center justify-center text-center">
                    <Route className="h-8 w-8 text-blue-500 dark:text-blue-400 mb-2" />
                    <h3 className="text-sm font-medium text-muted-foreground">
                      सडक प्रकार
                    </h3>
                    <p className="text-xl font-semibold">{roadTypeNepali}</p>
                  </div>

                  {/* Road Length - Show only if available */}
                  {road.length && (
                    <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg flex flex-col items-center justify-center text-center">
                      <RulerIcon className="h-8 w-8 text-green-500 dark:text-green-400 mb-2" />
                      <h3 className="text-sm font-medium text-muted-foreground">
                        सडक लम्बाई
                      </h3>
                      <p className="text-xl font-semibold">
                        {road.length.toLocaleString()} मिटर
                      </p>
                    </div>
                  )}

                  {/* Road Condition - Show only if available */}
                  {road.condition && (
                    <div
                      className={`${getConditionColor(road.condition)} p-4 rounded-lg flex flex-col items-center justify-center text-center`}
                    >
                      <span
                        className={`text-2xl font-bold mb-1 ${getConditionTextColor(road.condition)}`}
                      >
                        {roadConditionNepali === "उत्कृष्ट"
                          ? "★★★★★"
                          : roadConditionNepali === "राम्रो"
                            ? "★★★★☆"
                            : roadConditionNepali === "ठीकठाक"
                              ? "★★★☆☆"
                              : roadConditionNepali === "कमजोर"
                                ? "★★☆☆☆"
                                : roadConditionNepali === "धेरै कमजोर"
                                  ? "★☆☆☆☆"
                                  : "🚧"}
                      </span>
                      <h3 className="text-sm font-medium text-muted-foreground">
                        सडक अवस्था
                      </h3>
                      <p
                        className={`text-xl font-semibold ${getConditionTextColor(road.condition)}`}
                      >
                        {roadConditionNepali}
                      </p>
                    </div>
                  )}
                </div>

                {/* Start and End Points - Show only if available */}
                {(road.startPoint || road.endPoint) && (
                  <div className="mt-4 space-y-4">
                    <h3 className="text-lg font-semibold">सडक मार्ग</h3>
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      {road.startPoint && (
                        <div className="flex items-start space-x-2">
                          <MapPinIcon className="h-5 w-5 text-green-600 dark:text-green-500 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm text-muted-foreground">
                              सुरु बिन्दु
                            </p>
                            <p className="font-medium">{road.startPoint}</p>
                          </div>
                        </div>
                      )}

                      {road.endPoint && (
                        <div className="flex items-start space-x-2">
                          <MapPinIcon className="h-5 w-5 text-red-600 dark:text-red-500 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm text-muted-foreground">
                              अन्तिम बिन्दु
                            </p>
                            <p className="font-medium">{road.endPoint}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Technical specifications - Only show if at least one of these values exists */}
                {(road.widthInMeters ||
                  road.maintenanceYear ||
                  road.drainageSystem) && (
                  <div id="technical-specifications">
                    <h3 className="text-lg font-semibold mb-4">
                      प्राविधिक विशेषताहरू
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* Width - Show only if available */}
                      {road.widthInMeters && (
                        <div className="flex items-start space-x-3">
                          <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-md">
                            <RulerIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-muted-foreground">
                              सडक चौडाई
                            </h4>
                            <p className="font-medium">
                              {road.widthInMeters} मिटर
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Maintenance Year - Show only if available */}
                      {road.maintenanceYear && (
                        <div className="flex items-start space-x-3">
                          <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-md">
                            <CalendarIcon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-muted-foreground">
                              मर्मत वर्ष
                            </h4>
                            <p className="font-medium">
                              {road.maintenanceYear}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Drainage System - Show only if available */}
                      {road.drainageSystem && (
                        <div className="flex items-start space-x-3">
                          <div className="p-2 bg-cyan-100 dark:bg-cyan-900/50 rounded-md">
                            <DropletIcon className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-muted-foreground">
                              पानी निकास प्रणाली
                            </h4>
                            <p className="font-medium">
                              {drainageSystemNepali}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Features - Only show the ones that are present */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                  {road.hasStreetLights && (
                    <div className="flex flex-col items-center gap-1 p-3 bg-muted/50 rounded-md">
                      <LightbulbIcon className="h-6 w-6 text-yellow-500" />
                      <p className="text-sm">सडक बत्ती</p>
                      <Badge variant="default">छ</Badge>
                    </div>
                  )}

                  {road.hasDivider && (
                    <div className="flex flex-col items-center gap-1 p-3 bg-muted/50 rounded-md">
                      <DivideIcon className="h-6 w-6 text-purple-500" />
                      <p className="text-sm">डिभाइडर</p>
                      <Badge variant="default">छ</Badge>
                    </div>
                  )}

                  {road.hasPedestrian && (
                    <div className="flex flex-col items-center gap-1 p-3 bg-muted/50 rounded-md">
                      <FootprintsIcon className="h-6 w-6 text-green-500" />
                      <p className="text-sm">पैदल मार्ग</p>
                      <Badge variant="default">छ</Badge>
                    </div>
                  )}

                  {road.hasBicycleLane && (
                    <div className="flex flex-col items-center gap-1 p-3 bg-muted/50 rounded-md">
                      <Bike className="h-6 w-6 text-blue-500" />
                      <p className="text-sm">साइकल लेन</p>
                      <Badge variant="default">छ</Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Client side interactive components */}
            <div className="mt-8">
              <ClientRoadDetailDisplay
                road={road}
                roadTypeNepali={roadTypeNepali}
                roadConditionNepali={roadConditionNepali}
                drainageSystemNepali={drainageSystemNepali}
              />
            </div>
          </section>
        </div>
      </DocsLayout>
    );
  } catch (error) {
    console.error("Error fetching road data:", error);
    notFound();
  }
}
