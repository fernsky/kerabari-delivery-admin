"use client";

import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Users,
  Home,
  TrendingUp,
  Book,
  UserRound,
  UserRoundX,
  MapPin,
  Globe,
} from "lucide-react";
import { localizeNumber } from "@/lib/utils/localize-number";

interface DemographicSummaryReportProps {
  data: any;
  showCharts?: boolean;
  isPrintMode?: boolean;
}

export default function DemographicSummaryReport({
  data,
  showCharts = true,
  isPrintMode = false,
}: DemographicSummaryReportProps) {
  const params = useParams();
  const locale = (params.locale as string) || "en";

  if (!data) {
    return (
      <div className="text-center py-8 text-gray-500">
        कुनै जनसांख्यिकीय डाटा उपलब्ध छैन।
      </div>
    );
  }

  // Calculate percentages for population distribution
  const totalPop = data.totalPopulation || 0;
  const malePct = totalPop ? ((data.populationMale || 0) / totalPop) * 100 : 0;
  const femalePct = totalPop
    ? ((data.populationFemale || 0) / totalPop) * 100
    : 0;
  const otherPct = totalPop
    ? ((data.populationOther || 0) / totalPop) * 100
    : 0;

  // Calculate age group percentages
  const pop0to14Pct = totalPop
    ? ((data.population0To14 || 0) / totalPop) * 100
    : 0;
  const pop15to59Pct = totalPop
    ? ((data.population15To59 || 0) / totalPop) * 100
    : 0;
  const pop60PlusPct = totalPop
    ? ((data.population60AndAbove || 0) / totalPop) * 100
    : 0;

  return (
    <div className={`space-y-6 ${isPrintMode ? "print-mode" : ""}`}>
      {/* Report Header */}
      <div className="text-center border-b pb-6">
        <h1 className="text-3xl font-bold text-red-600 mb-2">
          जनसांख्यिकीय सारांश
        </h1>
        <p className="text-lg text-gray-600">
          बुद्धशान्ति गाउँपालिका - पूर्ण प्रतिवेदन
        </p>
        <p className="text-sm text-gray-500 mt-2">२०८१ मस्यौदा प्रतिवेदन</p>
      </div>

      {/* Executive Summary */}
      <Card className={isPrintMode ? "print-card" : ""}>
        <CardHeader>
          <CardTitle className="text-xl font-medium flex items-center">
            <Users className="mr-2 h-5 w-5" />
            कार्यकारी सारांश
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">
                {localizeNumber(data.totalPopulation || 0, locale)}
              </div>
              <div className="text-sm text-gray-600">कुल जनसंख्या</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600">
                {localizeNumber(data.totalHouseholds || 0, locale)}
              </div>
              <div className="text-sm text-gray-600">कुल घरधुरी</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600">
                {data.sexRatio || 0}
              </div>
              <div className="text-sm text-gray-600">लिङ्ग अनुपात</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-3xl font-bold text-orange-600">
                {data.averageHouseholdSize || 0}
              </div>
              <div className="text-sm text-gray-600">औसत परिवार आकार</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Population Statistics */}
      <Card className={isPrintMode ? "print-card" : ""}>
        <CardHeader>
          <CardTitle className="text-xl font-medium flex items-center">
            <Users className="mr-2 h-5 w-5" />
            जनसंख्या आँकडा
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Gender Distribution */}
            <div>
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <UserRound className="mr-2 h-4 w-4" />
                लिङ्ग वितरण
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>पुरुष</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">
                      {localizeNumber(data.populationMale || 0, locale)}
                    </span>
                    <Badge variant="secondary">{malePct.toFixed(1)}%</Badge>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>महिला</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">
                      {localizeNumber(data.populationFemale || 0, locale)}
                    </span>
                    <Badge variant="secondary">{femalePct.toFixed(1)}%</Badge>
                  </div>
                </div>
                {data.populationOther > 0 && (
                  <div className="flex justify-between items-center">
                    <span>अन्य</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">
                        {localizeNumber(data.populationOther, locale)}
                      </span>
                      <Badge variant="secondary">{otherPct.toFixed(1)}%</Badge>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Age Distribution */}
            <div>
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <UserRoundX className="mr-2 h-4 w-4" />
                उमेर समूह वितरण
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>०-१४ वर्ष</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">
                      {localizeNumber(data.population0To14 || 0, locale)}
                    </span>
                    <Badge variant="outline">{pop0to14Pct.toFixed(1)}%</Badge>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>१५-५९ वर्ष</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">
                      {localizeNumber(data.population15To59 || 0, locale)}
                    </span>
                    <Badge variant="outline">{pop15to59Pct.toFixed(1)}%</Badge>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>६०+ वर्ष</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">
                      {localizeNumber(data.population60AndAbove || 0, locale)}
                    </span>
                    <Badge variant="outline">{pop60PlusPct.toFixed(1)}%</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Geographic and Demographic Indicators */}
      <Card className={isPrintMode ? "print-card" : ""}>
        <CardHeader>
          <CardTitle className="text-xl font-medium flex items-center">
            <MapPin className="mr-2 h-5 w-5" />
            भौगोलिक र जनसांख्यिकीय सूचकांक
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center mb-2">
                <Globe className="mr-2 h-4 w-4 text-blue-500" />
                <span className="font-medium">भौगोलिक विवरण</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>कुल वडा संख्या:</span>
                  <span className="font-medium">{data.totalWards || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>कुल भूमि क्षेत्र:</span>
                  <span className="font-medium">
                    {data.totalLandArea || 0} वर्ग कि.मि.
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>जनसंख्या घनत्व:</span>
                  <span className="font-medium">
                    {data.populationDensity || 0} प्रति वर्ग कि.मि.
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center mb-2">
                <Home className="mr-2 h-4 w-4 text-green-500" />
                <span className="font-medium">घरधुरी विवरण</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>कुल घरधुरी:</span>
                  <span className="font-medium">
                    {localizeNumber(data.totalHouseholds || 0, locale)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>औसत परिवार आकार:</span>
                  <span className="font-medium">
                    {data.averageHouseholdSize || 0} व्यक्ति
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>लिङ्ग अनुपात:</span>
                  <span className="font-medium">
                    {data.sexRatio || 0} (प्रति १०० महिला)
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center mb-2">
                <TrendingUp className="mr-2 h-4 w-4 text-purple-500" />
                <span className="font-medium">विकास सूचकांक</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>जनसंख्या वृद्धि दर:</span>
                  <span className="font-medium">{data.growthRate || 0}%</span>
                </div>
                <div className="flex justify-between">
                  <span>१५+ साक्षरता दर:</span>
                  <span className="font-medium">
                    {data.literacyRateAbove15 || 0}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>१५-२४ साक्षरता दर:</span>
                  <span className="font-medium">
                    {data.literacyRate15To24 || 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Absentee Population */}
      {data.populationAbsenteeTotal > 0 && (
        <Card className={isPrintMode ? "print-card" : ""}>
          <CardHeader>
            <CardTitle className="text-xl font-medium flex items-center">
              <UserRoundX className="mr-2 h-5 w-5" />
              अनुपस्थित जनसंख्या
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {localizeNumber(data.populationAbsenteeTotal, locale)}
                </div>
                <div className="text-sm text-gray-600">कुल अनुपस्थित</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {localizeNumber(data.populationMaleAbsentee || 0, locale)}
                </div>
                <div className="text-sm text-gray-600">पुरुष अनुपस्थित</div>
              </div>
              <div className="text-center p-4 bg-pink-50 rounded-lg">
                <div className="text-2xl font-bold text-pink-600">
                  {localizeNumber(data.populationFemaleAbsentee || 0, locale)}
                </div>
                <div className="text-sm text-gray-600">महिला अनुपस्थित</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {localizeNumber(data.populationOtherAbsentee || 0, locale)}
                </div>
                <div className="text-sm text-gray-600">अन्य अनुपस्थित</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analysis and Insights */}
      <Card className={isPrintMode ? "print-card" : ""}>
        <CardHeader>
          <CardTitle className="text-xl font-medium flex items-center">
            <Book className="mr-2 h-5 w-5" />
            विश्लेषण र अन्तर्दृष्टि
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-lg mb-2">जनसंख्या संरचना</h4>
                <p className="text-gray-700">
                  बुद्धशान्ति गाउँपालिकामा कुल{" "}
                  {localizeNumber(data.totalPopulation || 0, locale)} जनसंख्या
                  छन्, जसमा {localizeNumber(data.populationMale || 0, locale)}{" "}
                  पुरुष ({malePct.toFixed(1)}%) र
                  {localizeNumber(data.populationFemale || 0, locale)} महिला (
                  {femalePct.toFixed(1)}%) समावेश छन्। लिङ्ग अनुपात{" "}
                  {data.sexRatio || 0} छ, जसले पुरुष र महिलाको सन्तुलित वितरण
                  देखाउँछ।
                </p>
              </div>

              <div>
                <h4 className="font-medium text-lg mb-2">उमेर संरचना</h4>
                <p className="text-gray-700">
                  जनसंख्याको {pop0to14Pct.toFixed(1)}% बालबालिका (०-१४ वर्ष),
                  {pop15to59Pct.toFixed(1)}% कामदार उमेर (१५-५९ वर्ष), र
                  {pop60PlusPct.toFixed(1)}% वृद्धवृद्धा (६०+ वर्ष) छन्। यो
                  संरचनाले युवा जनसंख्याको प्रधानता देखाउँछ।
                </p>
              </div>

              <div>
                <h4 className="font-medium text-lg mb-2">घरधुरी विश्लेषण</h4>
                <p className="text-gray-700">
                  कुल {localizeNumber(data.totalHouseholds || 0, locale)}{" "}
                  घरधुरीमा औसत {data.averageHouseholdSize || 0} व्यक्ति छन्।
                  जनसंख्या घनत्व {data.populationDensity || 0} प्रति वर्ग
                  किलोमिटर छ, जसले यस क्षेत्रको बसोबासको घनत्व देखाउँछ।
                </p>
              </div>

              {data.growthRate > 0 && (
                <div>
                  <h4 className="font-medium text-lg mb-2">विकास प्रवृत्ति</h4>
                  <p className="text-gray-700">
                    जनसंख्या वृद्धि दर {data.growthRate}% छ, जसले स्थिर विकासको
                    प्रवृत्ति देखाउँछ। साक्षरता दर पनि राम्रो अवस्थामा छ, विशेष
                    गरी युवा समूहमा।
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
