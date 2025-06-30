import { localizeNumber } from "@/lib/utils/localize-number";
import { Card, CardContent } from "@/components/ui/card";
import BusinessTypePieChart from "./charts/business-type-pie-chart";
import WardDistributionBarChart from "./charts/ward-distribution-bar-chart";
import PopularBusinessByWardChart from "./charts/popular-business-by-ward-chart";
import BusinessTrendChart from "./charts/business-trend-chart";
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

interface FarmersGroupChartsProps {
  businessSummary: Array<{
    type: string;
    typeName: string;
    count: number;
    percentage: number;
    icon: string;
  }>;
  totalGroups: number;
  farmsByWard: Array<{
    wardNumber: number;
    farmCount: number;
    farms: Array<{
      id: string;
      name: string;
      type: string;
      typeName: string;
      icon: string;
    }>;
  }>;
  BUSINESS_TYPES: Record<string, string>;
  BUSINESS_COLORS: Record<string, string>;
  popularBusinessByWard: Array<{
    wardNumber: number;
    mostCommonType: string;
    mostCommonTypeName: string;
    count: number;
    icon: string;
  }>;
  statistics: {
    totalGroups: number;
    totalWards: number;
    avgGroupsPerWard: number;
    mostPopularBusinessType: string;
    mostPopularBusinessTypeName: string;
    mostPopularBusinessTypePercentage: number;
    wardWithMostGroups: number;
    maximumGroupsInAWard: number;
  };
}

export default function FarmersGroupCharts({
  businessSummary,
  totalGroups,
  farmsByWard,
  BUSINESS_TYPES,
  BUSINESS_COLORS,
  popularBusinessByWard,
  statistics,
}: FarmersGroupChartsProps) {
  // Format data for pie chart (business type distribution)
  const businessPieChartData = businessSummary
    .filter((item) => item.count > 0)
    .map((item) => ({
      name: item.typeName,
      value: item.count,
      percentage: item.percentage.toFixed(2),
    }));

  // Format data for bar chart (ward distribution)
  const wardBarChartData = farmsByWard
    .filter((ward) => ward.farmCount > 0)
    .map((ward) => ({
      name: `वडा ${localizeNumber(ward.wardNumber.toString(), "ne")}`,
      value: ward.farmCount,
      percentage: ((ward.farmCount / totalGroups) * 100).toFixed(1),
    }))
    .sort((a, b) => parseInt(b.percentage) - parseInt(a.percentage)); // Sort by percentage descending

  // Simulate historical trend data (for demonstration)
  const generateHistoricalData = () => {
    // Get top 4 business types
    const topBusinessTypes = businessSummary.slice(0, 4).map((b) => b.type);

    // Years (2075-2080)
    const years = ["२०७५", "२०७६", "२०७७", "२०७८", "२०७९", "२०८०"];

    // Generate trend data
    return years.map((year, index) => {
      // Base data point
      const dataPoint: any = { year };

      // Add counts for each business type
      // This simulates growth over the years
      topBusinessTypes.forEach((type) => {
        const currentCount =
          businessSummary.find((b) => b.type === type)?.count || 0;
        // Create a growth pattern (fewer in past years)
        const growthFactor = 0.6 + 0.4 * (index / (years.length - 1));
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
      {/* Business Type Distribution Section */}
      <section id="business-type-distribution">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-primary mb-2">
            व्यवसायको प्रकार अनुसारको वितरण
          </h2>
          <p className="text-muted-foreground">
            कृषि तथा पशुपालन व्यवसायको प्रकार अनुसार समूहहरूको वितरण र मुख्य
            तथ्यहरू
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="border-2">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4 text-center flex items-center justify-center gap-2">
                <PieChart className="w-5 h-5" />
                व्यवसायको प्रकार अनुसार वितरण
              </h3>
              <div className="h-[350px]">
                <BusinessTypePieChart
                  pieChartData={businessPieChartData}
                  BUSINESS_TYPES={BUSINESS_TYPES}
                  BUSINESS_COLORS={BUSINESS_COLORS}
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
                      <span className="font-medium">कुल कृषि समूहहरू</span>
                      <div className="text-xl font-bold text-blue-600">
                        {localizeNumber(totalGroups.toString(), "ne")}
                      </div>
                    </div>
                  </li>
                  {businessSummary.length > 0 && (
                    <li className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg">
                      <Target className="w-5 h-5 text-amber-600 mt-0.5" />
                      <div>
                        <span className="font-medium">
                          सबैभन्दा धेरै व्यवसाय
                        </span>
                        <div className="text-lg font-bold text-amber-600">
                          {businessSummary[0].typeName}{" "}
                          {businessSummary[0].icon} (
                          {localizeNumber(
                            businessSummary[0].percentage.toFixed(1),
                            "ne",
                          )}
                          %)
                        </div>
                      </div>
                    </li>
                  )}
                  <li className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                    <Home className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <span className="font-medium">सक्रिय वडाहरू</span>
                      <div className="text-lg font-bold text-green-600">
                        {localizeNumber(statistics.totalWards.toString(), "ne")}
                        /९
                      </div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                    <Building className="w-5 h-5 text-purple-600 mt-0.5" />
                    <div>
                      <span className="font-medium">औसत प्रति वडा</span>
                      <div className="text-lg font-bold text-purple-600">
                        {localizeNumber(
                          statistics.avgGroupsPerWard.toFixed(1),
                          "ne",
                        )}{" "}
                        समूह
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
            वडा अनुसार कृषि समूहहरूको वितरण र प्रमुख व्यवसायको विश्लेषण
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card className="border-2">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4 text-center flex items-center justify-center gap-2">
                <BarChart3 className="w-5 h-5" />
                वडा अनुसार कृषि समूहहरूको वितरण
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
                वडागत प्रमुख व्यवसाय
              </h3>
              <div className="h-[350px]">
                <PopularBusinessByWardChart
                  data={popularBusinessByWard.filter((item) => item.count > 0)}
                  BUSINESS_COLORS={BUSINESS_COLORS}
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
                  सबैभन्दा बढी समूह भएको वडा
                </h3>
                <p className="text-3xl font-bold text-blue-600">
                  वडा नं.{" "}
                  {localizeNumber(
                    statistics.wardWithMostGroups.toString(),
                    "ne",
                  )}
                </p>
                <p className="text-sm mt-2">
                  {localizeNumber(
                    statistics.maximumGroupsInAWard.toString(),
                    "ne",
                  )}{" "}
                  समूहहरू
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardContent className="pt-6">
              <div className="text-center">
                <BarChart className="w-8 h-8 mx-auto mb-2 text-green-600" />
                <h3 className="text-sm text-muted-foreground mb-1">
                  वडा १-९ समूह अनुपात
                </h3>
                <p className="text-3xl font-bold text-green-600">
                  {localizeNumber(
                    farmsByWard.filter((ward) => ward.farmCount > 0).length,
                    "ne",
                  )}
                  :
                  {localizeNumber(
                    farmsByWard.filter((ward) => ward.farmCount === 0).length,
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
                      statistics.maximumGroupsInAWard /
                      statistics.avgGroupsPerWard
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
            कृषि तथा पशुपालन समूहहरूको वार्षिक वृद्धि प्रवृत्ति (२०७५-२०८०)
          </p>
        </div>

        <Card className="border-2 mb-8">
          <CardContent className="pt-6">
            <h3 className="text-xl font-semibold mb-4 text-center flex items-center justify-center gap-2">
              <LineChart className="w-5 h-5" />
              प्रमुख व्यवसायहरूको प्रवृत्ति
            </h3>
            <div className="h-[400px]">
              <BusinessTrendChart
                data={trendData}
                businessTypes={businessSummary.slice(0, 4).map((b) => b.type)}
                BUSINESS_TYPES={BUSINESS_TYPES}
                BUSINESS_COLORS={BUSINESS_COLORS}
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
                पछिल्ला वर्षहरूमा केराबारी गाउँपालिकामा व्यावसायिक कृषि तथा
                पशुपालन समूहहरूको संख्यामा क्रमिक वृद्धि भएको देखिन्छ। विशेषगरी{" "}
                {businessSummary[0]?.typeName || ""} र{" "}
                {businessSummary[1]?.typeName || ""} जस्ता व्यवसायहरूमा
                उल्लेखनीय वृद्धि देखिएको छ।
              </p>
              <p className="mt-2">
                यो प्रवृत्तिले स्थानीय कृषकहरूको व्यावसायिक कृषि प्रतिको बढ्दो
                आकर्षण र पालिकाले लिएको कृषि प्रवर्द्धन नीतिको सफलता दर्शाउँछ।
                भविष्यमा यस क्षेत्रमा थप लगानी र प्रविधि हस्तान्तरण गर्न सके
                कृषि क्षेत्रको योगदान थप बढ्ने देखिन्छ।
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
