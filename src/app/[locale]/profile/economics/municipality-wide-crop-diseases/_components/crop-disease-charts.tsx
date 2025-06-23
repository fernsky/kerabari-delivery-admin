import { localizeNumber } from "@/lib/utils/localize-number";
import { Card, CardContent } from "@/components/ui/card";
import CropDiseaseBarChart from "./charts/crop-disease-bar-chart";
import CropDiseasePieChart from "./charts/crop-disease-pie-chart";
import DiseasePestComparisonChart from "./charts/disease-pest-comparison-chart";
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
} from "lucide-react";

interface CropDiseaseChartsProps {
  cropSummary: Array<{
    crop: string;
    cropName: string;
    pestsCount: number;
    diseasesCount: number;
    totalIssues: number;
    majorPests: string[];
    majorDiseases: string[];
  }>;
  totalCrops: number;
  totalPests: number;
  totalDiseases: number;
  totalIssues: number;
  CROP_TYPES: Record<string, string>;
  CROP_COLORS: Record<string, string>;
  mostAffectedCrop: any;
  avgIssuesPerCrop: number;
}

export default function CropDiseaseCharts({
  cropSummary,
  totalCrops,
  totalPests,
  totalDiseases,
  totalIssues,
  CROP_TYPES,
  CROP_COLORS,
  mostAffectedCrop,
  avgIssuesPerCrop,
}: CropDiseaseChartsProps) {
  // Format data for pie charts
  const diseasesPieData = cropSummary.map((item) => ({
    name: item.cropName,
    value: item.diseasesCount,
    percentage: ((item.diseasesCount / totalDiseases) * 100).toFixed(2),
  }));

  const pestsPieData = cropSummary.map((item) => ({
    name: item.cropName,
    value: item.pestsCount,
    percentage: ((item.pestsCount / totalPests) * 100).toFixed(2),
  }));

  // Format data for comparison chart
  const comparisonData = cropSummary.map((item) => ({
    name: item.cropName,
    diseases: item.diseasesCount,
    pests: item.pestsCount,
    total: item.totalIssues,
  }));

  return (
    <div className="mt-12 space-y-16">
      {/* Crop Issues Distribution Section */}
      <section id="crop-issues-distribution">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-primary mb-2">
            रोग र कीट वितरण विश्लेषण
          </h2>
          <p className="text-muted-foreground">
            बाली अनुसार रोग र कीटको वितरण र मुख्य तथ्यहरू
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
                <CropDiseasePieChart
                  pieChartData={diseasesPieData}
                  CROP_TYPES={CROP_TYPES}
                  CROP_COLORS={CROP_COLORS}
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
                <CropDiseasePieChart
                  pieChartData={pestsPieData}
                  CROP_TYPES={CROP_TYPES}
                  CROP_COLORS={CROP_COLORS}
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
                  <BarChart3 className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <span className="font-medium">कुल बालीहरू</span>
                    <div className="text-xl font-bold text-blue-600">
                      {localizeNumber(totalCrops.toString(), "ne")}
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
                      {mostAffectedCrop?.cropName || ""}
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
                {cropSummary.slice(0, 4).map((crop, index) => (
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
                          width: `${(crop.totalIssues / Math.max(...cropSummary.map((c) => c.totalIssues))) * 100}%`,
                          backgroundColor: CROP_COLORS[crop.crop] || "#3498DB",
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
                <div className="text-4xl mb-2">📊</div>
                <p className="text-3xl font-bold text-primary">
                  {localizeNumber(avgIssuesPerCrop.toFixed(1), "ne")}
                </p>
                <p className="text-sm text-muted-foreground">
                  औसत समस्या प्रति बाली
                </p>
              </div>
              <div className="text-sm">
                <p>
                  प्रत्येक बालीमा औसतमा{" "}
                  {localizeNumber(avgIssuesPerCrop.toFixed(1), "ne")}
                  प्रकारका रोग र कीटका समस्याहरू रहेका छन्。
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
            रोग र कीटपतंगको तुलनात्मक विश्लेषण
          </h2>
          <p className="text-muted-foreground">
            विभिन्न बालीहरूमा रोग र कीटपतंगको तुलनात्मक अध्ययन
          </p>
        </div>

        <Card className="border-2 mb-8">
          <CardContent className="pt-6">
            <h3 className="text-xl font-semibold mb-4 text-center flex items-center justify-center gap-2">
              <TrendingUp className="w-5 h-5" />
              रोग र कीटपतंगको तुलनात्मक चार्ट
            </h3>
            <div className="h-[400px]">
              <DiseasePestComparisonChart data={comparisonData} />
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
                सबैभन्दा प्रभावित बाली
              </h4>
              {mostAffectedCrop && (
                <div className="text-center">
                  <div className="text-4xl mb-2">🌾</div>
                  <p className="text-2xl font-bold text-primary">
                    {mostAffectedCrop.cropName}
                  </p>
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      {localizeNumber(
                        mostAffectedCrop.diseasesCount.toString(),
                        "ne",
                      )}{" "}
                      रोग +{" "}
                      {localizeNumber(
                        mostAffectedCrop.pestsCount.toString(),
                        "ne",
                      )}{" "}
                      कीट ={" "}
                      {localizeNumber(
                        mostAffectedCrop.totalIssues.toString(),
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
                        {mostAffectedCrop.majorDiseases.slice(0, 3).join(", ")}
                      </p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-sm font-medium text-green-700 mb-1 flex items-center gap-2">
                        <Bug className="w-4 h-4" />
                        प्रमुख कीटहरू:
                      </p>
                      <p className="text-sm text-green-600">
                        {mostAffectedCrop.majorPests.slice(0, 3).join(", ")}
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
            बालीहरूमा रोग र कीटका समस्याहरूको गम्भीरता स्तरको विश्लेषण
          </p>
        </div>

        <Card className="border-2 mb-8">
          <CardContent className="pt-6">
            <h3 className="text-xl font-semibold mb-4 text-center flex items-center justify-center gap-2">
              <BarChart3 className="w-5 h-5" />
              गम्भीरता स्तर चार्ट
            </h3>
            <div className="h-[400px]">
              <CropDiseaseBarChart
                data={comparisonData}
                CROP_COLORS={CROP_COLORS}
                cropSummary={cropSummary}
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
                      cropSummary
                        .filter((c) => c.totalIssues >= 8)
                        .length.toString(),
                      "ne",
                    )}
                  </p>
                  <p className="text-sm text-red-600 mt-1">८+ समस्या</p>
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
                      cropSummary
                        .filter((c) => c.totalIssues >= 4 && c.totalIssues < 8)
                        .length.toString(),
                      "ne",
                    )}
                  </p>
                  <p className="text-sm text-yellow-600 mt-1">४-७ समस्या</p>
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
                      cropSummary
                        .filter((c) => c.totalIssues < 4)
                        .length.toString(),
                      "ne",
                    )}
                  </p>
                  <p className="text-sm text-green-600 mt-1">४ भन्दा कम</p>
                  <div className="mt-3 text-xs text-green-500">
                    स्थिर अवस्था
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardContent className="pt-6">
              <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Target className="w-5 h-5" />
                सिफारिशहरू
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h5 className="font-medium text-red-700 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    उच्च जोखिममा रहेका बालीहरू:
                  </h5>
                  <ul className="space-y-2">
                    {cropSummary
                      .filter((c) => c.totalIssues >= 8)
                      .slice(0, 3)
                      .map((crop, index) => (
                        <li
                          key={index}
                          className="flex items-center gap-2 text-sm"
                        >
                          <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                          <span>{crop.cropName}</span>
                          <span className="text-red-600 font-medium">
                            ({localizeNumber(crop.totalIssues.toString(), "ne")}{" "}
                            समस्या)
                          </span>
                        </li>
                      ))}
                  </ul>
                </div>
                <div className="space-y-3">
                  <h5 className="font-medium text-green-700 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" />
                    राम्रो अवस्थामा रहेका बालीहरू:
                  </h5>
                  <ul className="space-y-2">
                    {cropSummary
                      .filter((c) => c.totalIssues < 4)
                      .slice(0, 3)
                      .map((crop, index) => (
                        <li
                          key={index}
                          className="flex items-center gap-2 text-sm"
                        >
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          <span>{crop.cropName}</span>
                          <span className="text-green-600 font-medium">
                            ({localizeNumber(crop.totalIssues.toString(), "ne")}{" "}
                            समस्या)
                          </span>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
