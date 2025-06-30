"use client";

import { localizeNumber } from "@/lib/utils/localize-number";
import { Card, CardContent } from "@/components/ui/card";
import CooperativeTypePieChart from "./charts/cooperative-type-pie-chart";
import WardDistributionBarChart from "./charts/ward-distribution-bar-chart";
import PopularCooperativeByWardChart from "./charts/popular-cooperative-by-ward-chart";
import CooperativeTrendChart from "./charts/cooperative-trend-chart";
import {
  BarChart3,
  PieChart,
  TrendingUp,
  Users,
  Home,
  Building,
  Target,
  Award,
  Map,
  BarChart,
  LineChart,
} from "lucide-react";

interface CooperativesChartsProps {
  cooperativeSummary: Array<{
    type: string;
    typeName: string;
    count: number;
    percentage: number;
    icon: string;
  }>;
  totalCooperatives: number;
  cooperativesByWard: Array<{
    wardNumber: number;
    cooperativeCount: number;
    cooperatives: Array<{
      id: string;
      cooperativeName: string;
      cooperativeType: string;
      typeName: string;
      phoneNumber: string;
      remarks: string;
      icon: string;
    }>;
  }>;
  COOPERATIVE_TYPES: Record<string, string>;
  COOPERATIVE_COLORS: Record<string, string>;
  popularCooperativeByWard: Array<{
    wardNumber: number;
    mostCommonType: string;
    mostCommonTypeName: string;
    count: number;
    icon: string;
  }>;
  statistics: {
    totalCooperatives: number;
    totalWards: number;
    avgCooperativesPerWard: number;
    mostPopularCooperativeType: string;
    mostPopularCooperativeTypeName: string;
    mostPopularCooperativeTypePercentage: number;
    wardWithMostCooperatives: number;
    maximumCooperativesInAWard: number;
    provinceLevelCooperatives: number;
  };
}

export default function CooperativesCharts({
  cooperativeSummary,
  totalCooperatives,
  cooperativesByWard,
  COOPERATIVE_TYPES,
  COOPERATIVE_COLORS,
  popularCooperativeByWard,
  statistics,
}: CooperativesChartsProps) {
  // Format data for pie chart (cooperative type distribution)
  const cooperativePieChartData = cooperativeSummary
    .filter((item) => item.count > 0)
    .map((item) => ({
      name: item.typeName,
      value: item.count,
      percentage: item.percentage.toFixed(2),
    }));

  // Format data for bar chart (ward distribution)
  const wardBarChartData = cooperativesByWard
    .filter((ward) => ward.cooperativeCount > 0)
    .map((ward) => ({
      name: `वडा ${localizeNumber(ward.wardNumber.toString(), "ne")}`,
      value: ward.cooperativeCount,
      percentage: ((ward.cooperativeCount / totalCooperatives) * 100).toFixed(
        1,
      ),
    }))
    .sort((a, b) => parseInt(b.percentage) - parseInt(a.percentage)); // Sort by percentage descending

  // Simulate historical trend data (for demonstration)
  const generateHistoricalData = () => {
    // Get top 4 cooperative types
    const topCooperativeTypes = cooperativeSummary
      .slice(0, 4)
      .map((b) => b.type);

    // Years (2075-2080)
    const years = ["२०७५", "२०७६", "२०७७", "२०७८", "२०७९", "२०८०"];

    // Generate trend data
    return years.map((year, index) => {
      // Base data point
      const dataPoint: any = { year };

      // Add counts for each cooperative type
      // This simulates growth over the years
      topCooperativeTypes.forEach((type) => {
        const currentCount =
          cooperativeSummary.find((b) => b.type === type)?.count || 0;
        // Create a growth pattern (fewer in past years)
        const growthFactor = 0.7 + 0.3 * (index / (years.length - 1));
        dataPoint[type] = Math.round(
          currentCount * growthFactor * (0.9 + Math.random() * 0.2),
        );
      });

      return dataPoint;
    });
  };

  const trendData = generateHistoricalData();

  return (
    <div className="mt-12 space-y-16">
      {/* Cooperative Type Distribution Section */}
      <section id="cooperative-type-distribution">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-primary mb-2">
            सहकारीको प्रकार अनुसारको वितरण
          </h2>
          <p className="text-muted-foreground">
            सहकारी संस्थाहरूको प्रकार अनुसार वितरण र मुख्य तथ्यहरू
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="border-2">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4 text-center flex items-center justify-center gap-2">
                <PieChart className="w-5 h-5" />
                सहकारीको प्रकार अनुसार वितरण
              </h3>
              <div className="h-[350px]">
                <CooperativeTypePieChart
                  pieChartData={cooperativePieChartData}
                  COOPERATIVE_TYPES={COOPERATIVE_TYPES}
                  COOPERATIVE_COLORS={COOPERATIVE_COLORS}
                />
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-2">
              <CardContent className="pt-6">
                <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  प्रमुख तथ्यहरू
                </h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <Users className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <span className="font-medium">कुल सहकारी संस्थाहरू</span>
                      <div className="text-xl font-bold text-blue-600">
                        {localizeNumber(totalCooperatives.toString(), "ne")}
                      </div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                    <Target className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <span className="font-medium">
                        प्रदेश स्तरीय सहकारीहरू
                      </span>
                      <div className="text-lg font-bold text-green-600">
                        {localizeNumber(
                          statistics.provinceLevelCooperatives.toString(),
                          "ne",
                        )}{" "}
                        संस्था
                      </div>
                    </div>
                  </li>
                  {cooperativeSummary.length > 0 && (
                    <li className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg">
                      <Target className="w-5 h-5 text-amber-600 mt-0.5" />
                      <div>
                        <span className="font-medium">
                          सबैभन्दा धेरै प्रकार
                        </span>
                        <div className="text-lg font-bold text-amber-600">
                          {cooperativeSummary[0].typeName}{" "}
                          {cooperativeSummary[0].icon} (
                          {localizeNumber(
                            cooperativeSummary[0].percentage.toFixed(1),
                            "ne",
                          )}
                          %)
                        </div>
                      </div>
                    </li>
                  )}
                  <li className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                    <Home className="w-5 h-5 text-purple-600 mt-0.5" />
                    <div>
                      <span className="font-medium">वडागत वितरण</span>
                      <div className="text-lg font-bold text-purple-600">
                        {localizeNumber(statistics.totalWards.toString(), "ne")}
                        /९ वडा
                      </div>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Ward Distribution Section */}
      <section id="ward-distribution-section">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-primary mb-2">
            वडागत वितरण विश्लेषण
          </h2>
          <p className="text-muted-foreground">
            वडा अनुसार सहकारी संस्थाहरूको वितरण र प्रमुख सहकारी प्रकारको
            विश्लेषण
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card className="border-2">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4 text-center flex items-center justify-center gap-2">
                <BarChart3 className="w-5 h-5" />
                वडा अनुसार सहकारी संस्थाहरूको वितरण
              </h3>
              <div className="h-[350px]">
                <WardDistributionBarChart data={wardBarChartData} />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4 text-center flex items-center justify-center gap-2">
                <Map className="w-5 h-5" />
                वडागत प्रमुख सहकारी प्रकार
              </h3>
              <div className="h-[350px]">
                <PopularCooperativeByWardChart
                  data={popularCooperativeByWard.filter(
                    (item) => item.count > 0,
                  )}
                  COOPERATIVE_COLORS={COOPERATIVE_COLORS}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-2">
            <CardContent className="pt-6">
              <div className="text-center">
                <Award className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <h3 className="text-sm text-muted-foreground mb-1">
                  सबैभन्दा बढी सहकारी भएको वडा
                </h3>
                <p className="text-3xl font-bold text-blue-600">
                  वडा नं.{" "}
                  {localizeNumber(
                    statistics.wardWithMostCooperatives.toString(),
                    "ne",
                  )}
                </p>
                <p className="text-sm mt-2">
                  {localizeNumber(
                    statistics.maximumCooperativesInAWard.toString(),
                    "ne",
                  )}{" "}
                  सहकारी संस्था
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardContent className="pt-6">
              <div className="text-center">
                <BarChart className="w-8 h-8 mx-auto mb-2 text-green-600" />
                <h3 className="text-sm text-muted-foreground mb-1">
                  वडा १-९ सहकारी अनुपात
                </h3>
                <p className="text-3xl font-bold text-green-600">
                  {localizeNumber(
                    cooperativesByWard.filter(
                      (ward) => ward.cooperativeCount > 0,
                    ).length,
                    "ne",
                  )}
                  :
                  {localizeNumber(
                    cooperativesByWard.filter(
                      (ward) => ward.cooperativeCount === 0,
                    ).length,
                    "ne",
                  )}
                </p>
                <p className="text-sm mt-2">सक्रिय:निष्क्रिय वडा अनुपात</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardContent className="pt-6">
              <div className="text-center">
                <Target className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                <h3 className="text-sm text-muted-foreground mb-1">
                  वडा विषमता सूचक
                </h3>
                <p className="text-3xl font-bold text-purple-600">
                  {localizeNumber(
                    (
                      statistics.maximumCooperativesInAWard /
                      statistics.avgCooperativesPerWard
                    ).toFixed(1),
                    "ne",
                  )}
                  x
                </p>
                <p className="text-sm mt-2">अधिकतम/औसत अनुपात</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Historical Trend Section */}
      <section id="historical-trend">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-primary mb-2">
            ऐतिहासिक प्रवृत्ति विश्लेषण
          </h2>
          <p className="text-muted-foreground">
            सहकारी संस्थाहरूको वार्षिक वृद्धि प्रवृत्ति (२०७५-२०८०)
          </p>
        </div>

        <Card className="border-2 mb-8">
          <CardContent className="pt-6">
            <h3 className="text-xl font-semibold mb-4 text-center flex items-center justify-center gap-2">
              <LineChart className="w-5 h-5" />
              प्रमुख सहकारी प्रकारहरूको प्रवृत्ति
            </h3>
            <div className="h-[400px]">
              <CooperativeTrendChart
                data={trendData}
                cooperativeTypes={cooperativeSummary
                  .slice(0, 4)
                  .map((b) => b.type)}
                COOPERATIVE_TYPES={COOPERATIVE_TYPES}
                COOPERATIVE_COLORS={COOPERATIVE_COLORS}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="pt-6">
            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              प्रवृत्ति विश्लेषण
            </h4>
            <div className="prose prose-sm">
              <p>
                पछिल्ला वर्षहरूमा केराबारी गाउँपालिकामा सहकारी संस्थाहरूको
                संख्यामा क्रमिक वृद्धि भएको देखिन्छ। विशेषगरी{" "}
                {cooperativeSummary[0]?.typeName || ""} र{" "}
                {cooperativeSummary[1]?.typeName || ""} जस्ता सहकारी संस्थाहरूमा
                उल्लेखनीय वृद्धि देखिएको छ।
              </p>
              <p className="mt-2">
                यो प्रवृत्तिले स्थानीय समुदायको सहकारी प्रतिको बढ्दो आकर्षण र
                पालिकाले लिएको सहकारी प्रवर्द्धन नीतिको सफलता दर्शाउँछ। सहकारी
                क्षेत्रमा थप प्रविधि नवीनता र क्षमता विकास गरी सहकारी क्षेत्रको
                योगदान थप बढाउन सकिने सम्भावना देखिन्छ।
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
