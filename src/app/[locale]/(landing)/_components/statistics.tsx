"use client";
import { useInView } from "react-intersection-observer";
import { motion, AnimatePresence } from "framer-motion";
import CountUp from "react-countup";
import {
  MapPinned,
  Users,
  Home,
  Trees,
  TrendingUp,
  UserX,
  ChevronRight,
  House,
  HomeIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Script from "next/script";
import { localizeNumber } from "@/lib/utils/localize-number";
import WardAgeBarChart from "../../profile/demographics/ward-age-wise-population/_components/charts/ward-age-bar-chart";

interface StatisticsProps {
  demographicData?: {
    totalWards?: number | null;
    totalLandArea?: number | null;
    totalPopulation?: number | null;
    totalHouseholds?: number | null;
    areaSqKm?: string | null;
    populationDensity?: string | null;
    populationMale?: number | null;
    populationFemale?: number | null;
    sexRatio?: string | null;
    literacyRateAbove15?: string | null;
    growthRate?: string | null;
    populationAbsenteeTotal?: number | null;
    averageHouseholdSize?: string | null;
  } | null;
  isLoading: boolean;
  municipalityName: string;
}

const Statistics = ({
  demographicData,
  isLoading,
  municipalityName,
}: StatisticsProps) => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  // Define stats based on the demographic data
  const stats = [
    {
      label: "कुल क्षेत्रफल",
      value: demographicData?.totalLandArea || "N/A",
      suffix: "वर्ग कि.मि.",
      icon: <MapPinned className="w-5 h-5" />,
      description: "कुल भूमि क्षेत्रफल",
      color: "from-[#123772] to-[#0b1f42]",
    },
    {
      label: "जनसंख्या",
      value: demographicData?.totalPopulation || 5534,
      suffix: "+",
      icon: <Users className="w-5 h-5" />,
      description: " जनसंख्या",
      color: "from-[#1a4894] to-[#123772]",
    },
    {
      label: "घरधुरी",
      value: demographicData?.totalHouseholds || 1268,
      suffix: "",
      icon: <Home className="w-5 h-5" />,
      description: `प्रति घर ${localizeNumber(parseFloat(demographicData?.averageHouseholdSize as string)?.toFixed(1) || "4.4", "ne")} व्यक्ति`,
      color: "from-[#0b1f42] to-[#123772]",
    },
    {
      label: "वडाको संख्या",
      value: demographicData?.totalWards || "N/A",
      suffix: "",
      icon: <HomeIcon className="w-5 h-5" />,
      description: "वडाहरुको संख्या",
      color: "from-[#123772] to-[#0b1f42]",
    },
  ];

  // Generate JSON-LD structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: `${municipalityName} जनसांख्यिकीय तथ्याङ्क`,
    description:
      "बुद्धशान्ति गाउँपालिकाको प्रमुख जनसांख्यिकीय तथ्याङ्क, जनगणना अनुसार",
    url: "https://digital.buddhashantimun.gov.np",
    keywords: [
      "बुद्धशान्ति गाउँपालिका जनसंख्या",
      "Khajura Rural Municipality demographics",
      "बुद्धशान्ति जनगणना",
      "झापा जनसंख्या",
      "नेपालको जनसंख्या",
    ],
    variableMeasured: [
      {
        "@type": "PropertyValue",
        name: "कुल जनसंख्या",
        value: demographicData?.totalPopulation || "उपलब्ध छैन",
      },
      {
        "@type": "PropertyValue",
        name: "कुल घरधुरी",
        value: demographicData?.totalHouseholds || "उपलब्ध छैन",
      },
      {
        "@type": "PropertyValue",
        name: "क्षेत्रफल",
        value: demographicData?.areaSqKm || "उपलब्ध छैन",
        unitText: "square kilometers",
      },
      {
        "@type": "PropertyValue",
        name: "पुरुष उपस्थित जनसंख्या",
        value: demographicData?.populationMale || "उपलब्ध छैन",
      },
      {
        "@type": "PropertyValue",
        name: "महिला उपस्थित जनसंख्या",
        value: demographicData?.populationFemale || "उपलब्ध छैन",
      },
      {
        "@type": "PropertyValue",
        name: "प्रवासी जनसंख्या",
        value: demographicData?.populationAbsenteeTotal || "उपलब्ध छैन",
      },
      {
        "@type": "PropertyValue",
        name: "लैङ्गिक अनुपात",
        value: demographicData?.sexRatio || "उपलब्ध छैन",
      },
      {
        "@type": "PropertyValue",
        name: "साक्षरता दर",
        value: demographicData?.literacyRateAbove15 || "उपलब्ध छैन",
        unitText: "percentage",
      },
    ],
  };

  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <>
      {/* Add structured data for SEO */}
      <Script
        id="demographics-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <section
        ref={ref}
        className="relative overflow-hidden"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <div className="py-16 relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12 space-y-3"
          >
            <Badge
              variant="outline"
              className="mb-2 px-3 py-1 bg-white/80 backdrop-blur-sm border-[#123772]/20 shadow-sm inline-flex items-center"
            >
              <TrendingUp className="w-3 h-3 mr-1 text-[#1a4894]" />
              <span className="text-xs text-[#0b1f42] font-medium">
                गाउँपालिका अवलोकन
              </span>
            </Badge>

            <h2
              className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#0b1f42] to-[#1a4894] bg-clip-text text-transparent"
              itemProp="name"
            >
              प्रमुख जनसांख्यिकी
            </h2>

            <p
              className="text-gray-600 max-w-2xl mx-auto text-xs md:text-sm"
              itemProp="description"
            >
              हाम्रो स्थानीय शासन र समुदाय विकासलाई परिभाषित गर्ने आवश्यक आँकडा
              र तथ्याङ्क
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="relative"
              >
                <Card className="border-0 overflow-hidden group hover:shadow-md transition-all duration-300 bg-white/95 backdrop-blur-sm">
                  <div className="relative h-full">
                    {/* Gradient header - updated to blue style */}
                    <div
                      className={`p-2 bg-gradient-to-r ${stat.color} relative`}
                    >
                      <div className="absolute inset-0 bg-[url('/patterns/topography.svg')] opacity-10"></div>
                      <div className="relative z-10 flex items-center">
                        <div className="p-1.5 rounded-full bg-white/20 text-white">
                          {stat.icon}
                        </div>
                        <h3 className="ml-2 font-bold text-white text-sm">
                          {stat.label}
                        </h3>
                      </div>
                    </div>

                    <CardContent className="p-4">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-baseline gap-1">
                          {isLoading ? (
                            <Skeleton className="h-8 w-24" />
                          ) : (
                            <>
                              <span
                                className="text-3xl font-bold text-gray-900"
                                itemProp="value"
                              >
                                {inView && (
                                  <CountUp
                                    end={parseFloat(stat.value as string)}
                                    duration={2}
                                    decimals={
                                      stat.label === "कुल क्षेत्रफल" ? 2 : 0
                                    }
                                    formattingFn={(value) =>
                                      localizeNumber(value.toString(), "ne")
                                    }
                                  />
                                )}
                              </span>
                              <span className="text-sm font-medium text-[#123772]">
                                {stat.suffix}
                              </span>
                            </>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {stat.description}
                        </p>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {!isLoading && demographicData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mt-8"
            >
              <div className="overflow-hidden rounded-xl shadow-sm bg-white/90 backdrop-blur-sm">
                <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-[#123772]/10">
                  <div className="p-4 bg-gradient-to-br from-white to-[#123772]/5">
                    <p className="text-xs text-[#123772] font-medium mb-1 flex items-center">
                      <Users className="w-3 h-3 mr-1 opacity-70" />
                      पुरुष उपस्थित जनसंख्या
                    </p>
                    <p className="text-xl font-bold text-gray-900">
                      {demographicData.populationMale
                        ? localizeNumber(
                            demographicData.populationMale.toString(),
                            "ne",
                          )
                        : "N/A"}
                    </p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-white to-[#123772]/5">
                    <p className="text-xs text-[#123772] font-medium mb-1 flex items-center">
                      <Users className="w-3 h-3 mr-1 opacity-70" />
                      महिला उपस्थित जनसंख्या
                    </p>
                    <p className="text-xl font-bold text-gray-900">
                      {demographicData.populationFemale
                        ? localizeNumber(
                            demographicData.populationFemale.toString(),
                            "ne",
                          )
                        : "N/A"}
                    </p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-white to-[#123772]/5">
                    <p className="text-xs text-[#123772] font-medium mb-1 flex items-center">
                      <ChevronRight className="w-3 h-3 mr-1 opacity-70" />
                      लैङ्गिक अनुपात
                    </p>
                    <p className="text-xl font-bold text-gray-900">
                      {demographicData.sexRatio
                        ? localizeNumber(
                            parseFloat(demographicData.sexRatio).toFixed(2),
                            "ne",
                          )
                        : "N/A"}
                    </p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-white to-[#123772]/5">
                    <p className="text-xs text-[#123772] font-medium mb-1 flex items-center">
                      <TrendingUp className="w-3 h-3 mr-1 opacity-70" />
                      साक्षरता दर
                    </p>
                    {/* <p className="text-xl font-bold text-gray-900">
                      {demographicData.literacyRateAbove15
                        ? `${localizeNumber(parseFloat(demographicData.literacyRateAbove15).toFixed(1), "ne")}%`
                        : "७९.२%"}
                    </p> */}
                    <p className="text-xl font-bold text-gray-900">७९.४%</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
};

export default Statistics;
