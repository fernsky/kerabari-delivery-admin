import { localizeNumber } from "@/lib/utils/localize-number";
import { Card, CardContent } from "@/components/ui/card";
import VegetableFruitDiseaseBarChart from "./charts/vegetable-fruit-disease-bar-chart";
import VegetableFruitDiseasePieChart from "./charts/vegetable-fruit-disease-pie-chart";
import VegetableFruitDiseasePestComparisonChart from "./charts/vegetable-fruit-disease-pest-comparison-chart";
import {
  Bug,
  Pill,
  AlertTriangle,
  BarChart3,
  PieChart,
  TrendingUp,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Target,
  Award,
  Activity,
  Apple,
} from "lucide-react";

interface VegetableFruitDiseaseChartsProps {
  vegetableFruitSummary: Array<{
    crop: string;
    cropName: string;
    pestsCount: number;
    diseasesCount: number;
    totalIssues: number;
    majorPests: string[];
    majorDiseases: string[];
  }>;
  totalVegetableFruits: number;
  totalPests: number;
  totalDiseases: number;
  totalIssues: number;
  VEGETABLE_FRUIT_TYPES: Record<string, string>;
  VEGETABLE_FRUIT_COLORS: Record<string, string>;
  mostAffectedVegetableFruit: any;
  avgIssuesPerCrop: number;
}

export default function VegetableFruitDiseaseCharts({
  vegetableFruitSummary,
  totalVegetableFruits,
  totalPests,
  totalDiseases,
  totalIssues,
  VEGETABLE_FRUIT_TYPES,
  VEGETABLE_FRUIT_COLORS,
  mostAffectedVegetableFruit,
  avgIssuesPerCrop,
}: VegetableFruitDiseaseChartsProps) {
  // Format data for pie charts
  const diseasesPieData = vegetableFruitSummary.map((item) => ({
    name: item.cropName,
    value: item.diseasesCount,
    percentage: ((item.diseasesCount / totalDiseases) * 100).toFixed(2),
  }));

  const pestsPieData = vegetableFruitSummary.map((item) => ({
    name: item.cropName,
    value: item.pestsCount,
    percentage: ((item.pestsCount / totalPests) * 100).toFixed(2),
  }));

  // Format data for comparison chart
  const comparisonData = vegetableFruitSummary.map((item) => ({
    name: item.cropName,
    diseases: item.diseasesCount,
    pests: item.pestsCount,
    total: item.totalIssues,
  }));

  return (
    <div className="mt-12 space-y-16">
      {/* Vegetable/Fruit Issues Distribution Section */}
      <section id="vegetable-fruit-issues-distribution">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-primary mb-2">
            तरकारी र फलफूलमा रोग र कीट वितरण विश्लेषण
          </h2>
          <p className="text-muted-foreground">
            तरकारी र फलफूल अनुसार रोग र कीटको वितरण र मुख्य तथ्यहरू
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card className="border-2">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4 text-center flex items-center justify-center gap-2">
                <Pill className="w-5 h-5 text-red-600" />
                रोगहरूको वितरण
              </h3>
              <div className="h-[350px]">
                <VegetableFruitDiseasePieChart
                  pieChartData={diseasesPieData}
                  VEGETABLE_FRUIT_TYPES={VEGETABLE_FRUIT_TYPES}
                  VEGETABLE_FRUIT_COLORS={VEGETABLE_FRUIT_COLORS}
                  dataType="रोग"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4 text-center flex items-center justify-center gap-2">
                <Bug className="w-5 h-5 text-green-600" />
                कीटपतंगहरूको वितरण
              </h3>
              <div className="h-[350px]">
                <VegetableFruitDiseasePieChart
                  pieChartData={pestsPieData}
                  VEGETABLE_FRUIT_TYPES={VEGETABLE_FRUIT_TYPES}
                  VEGETABLE_FRUIT_COLORS={VEGETABLE_FRUIT_COLORS}
                  dataType="कीट"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-2">
            <CardContent className="pt-6">
              <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5" />
                प्रमुख तथ्यहरू
              </h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <Apple className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <span className="font-medium">कुल तरकारी/फलफूल</span>
                    <div className="text-xl font-bold text-blue-600">
                      {localizeNumber(totalVegetableFruits.toString(), "ne")}
                    </div>
                  </div>
                </li>
                <li className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                  <Pill className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <span className="font-medium">कुल रोगहरू</span>
                    <div className="text-xl font-bold text-red-600">
                      {localizeNumber(totalDiseases.toString(), "ne")}
                    </div>
                  </div>
                </li>
                <li className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                  <Bug className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <span className="font-medium">कुल कीटहरू</span>
                    <div className="text-xl font-bold text-green-600">
                      {localizeNumber(totalPests.toString(), "ne")}
                    </div>
                  </div>
                </li>
                <li className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-purple-600 mt-0.5" />
                  <div>
                    <span className="font-medium">सबैभन्दा प्रभावित</span>
                    <div className="text-lg font-bold text-purple-600">
                      {mostAffectedVegetableFruit?.cropName || ""}
                    </div>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardContent className="pt-6">
              <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Target className="w-5 h-5" />
                गम्भीरता स्तर
              </h4>
              <div className="space-y-4">
                {vegetableFruitSummary.slice(0, 4).map((crop, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-sm">
                        {crop.cropName}
                      </span>
                      <span className="font-bold text-primary">
                        {localizeNumber(crop.totalIssues.toString(), "ne")}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${(crop.totalIssues / Math.max(...vegetableFruitSummary.map((c) => c.totalIssues))) * 100}%`,
                          backgroundColor: VEGETABLE_FRUIT_COLORS[crop.crop] || "#3498DB",
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardContent className="pt-6">
              <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                औसत विश्लेषण
              </h4>
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">🥬</div>
                <p className="text-3xl font-bold text-primary">
                  {localizeNumber(avgIssuesPerCrop.toFixed(1), "ne")}
                </p>
                <p className="text-sm text-muted-foreground">
                  औसत समस्या प्रति तरकारी/फलफूल
                </p>
              </div>
              <div className="text-sm">
                <p>
                  प्रत्येक तरकारी/फलफूलमा औसतमा{" "}
                  {localizeNumber(avgIssuesPerCrop.toFixed(1), "ne")}
                  प्रकारका रोग र कीटका समस्याहरू रहेका छन्।
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Disease vs Pests Comparison */}
      <section id="diseases-vs-pests">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-primary mb-2">
            तरकारी र फलफूलमा रोग र कीटपतंगको तुलनात्मक विश्लेषण
          </h2>
          <p className="text-muted-foreground">
            विभिन्न तरकारी र फलफूलहरूमा रोग र कीटपतंगको तुलनात्मक अध्ययन
          </p>
        </div>

        <Card className="border-2 mb-8">
          <CardContent className="pt-6">
            <h3 className="text-xl font-semibold mb-4 text-center flex items-center justify-center gap-2">
              <TrendingUp className="w-5 h-5" />
              रोग र कीटपतंगको तुलनात्मक चार्ट
            </h3>
            <div className="h-[400px]">
              <VegetableFruitDiseasePestComparisonChart data={comparisonData} />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="border-2">
            <CardContent className="pt-6">
              <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                रोग बनाम कीट अनुपात
              </h4>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium flex items-center gap-2">
                      <Pill className="w-4 h-4 text-red-600" />
                      रोगहरू
                    </span>
                    <span className="font-bold text-red-600">
                      {localizeNumber(
                        ((totalDiseases / totalIssues) * 100).toFixed(1),
                        "ne",
                      )}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full"
                      style={{
                        width: `${(totalDiseases / totalIssues) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium flex items-center gap-2">
                      <Bug className="w-4 h-4 text-green-600" />
                      कीटपतंगहरू
                    </span>
                    <span className="font-bold text-green-600">
                      {localizeNumber(
                        ((totalPests / totalIssues) * 100).toFixed(1),
                        "ne",
                      )}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full"
                      style={{
                        width: `${(totalPests / totalIssues) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardContent className="pt-6">
              <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Award className="w-5 h-5" />
                सबैभन्दा प्रभावित तरकारी/फलफूल
              </h4>
              {mostAffectedVegetableFruit && (
                <div className="text-center">
                  <div className="text-4xl mb-2">🍅</div>
                  <p className="text-2xl font-bold text-primary">
                    {mostAffectedVegetableFruit.cropName}
                  </p>
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      {localizeNumber(
                        mostAffectedVegetableFruit.diseasesCount.toString(),
                        "ne",
                      )}{" "}
                      रोग +{" "}
                      {localizeNumber(
                        mostAffectedVegetableFruit.pestsCount.toString(),
                        "ne",
                      )}{" "}
                      कीट ={" "}
                      {localizeNumber(
                        mostAffectedVegetableFruit.totalIssues.toString(),
                        "ne",
                      )}{" "}
                      कुल समस्या
                    </p>
                  </div>
                  <div className="mt-4 space-y-3">
                    <div className="p-3 bg-red-50 rounded-lg">
                      <p className="text-sm font-medium text-red-700 mb-1 flex items-center gap-2">
                        <Pill className="w-4 h-4" />
                        प्रमुख रोगहरू:
                      </p>
                      <p className="text-sm text-red-600">
                        {mostAffectedVegetableFruit.majorDiseases.slice(0, 2).join(", ")}
                      </p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-sm font-medium text-green-700 mb-1 flex items-center gap-2">
                        <Bug className="w-4 h-4" />
                        प्रमुख कीटहरू:
                      </p>
                      <p className="text-sm text-green-600">
                        {mostAffectedVegetableFruit.majorPests.slice(0, 2).join(", ")}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Severity Analysis */}
      <section id="severity-analysis">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-primary mb-2">
            गम्भीरता विश्लेषण
          </h2>
          <p className="text-muted-foreground">
            तरकारी र फलफूलहरूमा रोग र कीटका समस्याहरूको गम्भीरता स्तरको विश्लेषण
          </p>
        </div>

        <Card className="border-2 mb-8">
          <CardContent className="pt-6">
            <h3 className="text-xl font-semibold mb-4 text-center flex items-center justify-center gap-2">
              <BarChart3 className="w-5 h-5" />
              गम्भीरता स्तर चार्ट
            </h3>
            <div className="h-[400px]">
              <VegetableFruitDiseaseBarChart
                data={comparisonData}
                VEGETABLE_FRUIT_COLORS={VEGETABLE_FRUIT_COLORS}
                vegetableFruitSummary={vegetableFruitSummary}
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-8">
          <Card className="border-2">
            <CardContent className="pt-6">
              <h4 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                गम्भीरता वर्गीकरण
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-red-50 rounded-lg border-2 border-red-200">
                  <div className="flex justify-center mb-2">
                    <ShieldAlert className="w-12 h-12 text-red-600" />
                  </div>
                  <h5 className="text-lg font-semibold text-red-700 mb-2">
                    उच्च जोखिम
                  </h5>
                  <p className="text-3xl font-bold text-red-600">
                    {localizeNumber(
                      vegetableFruitSummary
                        .filter((c) => c.totalIssues >= 6)
                        .length.toString(),
                      "ne",
                    )}
                  </p>
                  <p className="text-sm text-red-600 mt-1">६+ समस्या</p>
                  <div className="mt-3 text-xs text-red-500">
                    तत्काल ध्यान आवश्यक
                  </div>
                </div>
                <div className="text-center p-6 bg-yellow-50 rounded-lg border-2 border-yellow-200">
                  <div className="flex justify-center mb-2">
                    <Shield className="w-12 h-12 text-yellow-600" />
                  </div>
                  <h5 className="text-lg font-semibold text-yellow-700 mb-2">
                    मध्यम जोखिम
                  </h5>
                  <p className="text-3xl font-bold text-yellow-600">
                    {localizeNumber(
                      vegetableFruitSummary
                        .filter((c) => c.totalIssues >= 3 && c.totalIssues < 6)
                        .length.toString(),
                      "ne",
                    )}
                  </p>
                  <p className="text-sm text-yellow-600 mt-1">३-५ समस्या</p>
                  <div className="mt-3 text-xs text-yellow-500">
                    नियमित निगरानी
                  </div>
                </div>
                <div className="text-center p-6 bg-green-50 rounded-lg border-2 border-green-200">
                  <div className="flex justify-center mb-2">
                    <ShieldCheck className="w-12 h-12 text-green-600" />
                  </div>
                  <h5 className="text-lg font-semibold text-green-700 mb-2">
                    कम जोखिम
                  </h5>
                  <p className="text-3xl font-bold text-green-600">
                    {localizeNumber(
                      vegetableFruitSummary
                        .filter((c) => c.totalIssues < 3)
                        .length.toString(),
                      "ne",
                    )}
                  </p>
                  <p className="text-sm text-green-600 mt-1">३ भन्दा कम</p>
                  <div className="mt-3 text-xs text-green-500">
                    स्थिर अवस्था
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
