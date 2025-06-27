"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Users,
  Home,
  TrendingUp,
  Book,
  UserRound,
  UserRoundX,
} from "lucide-react";
import { ResponsivePie } from "@nivo/pie";
import { ResponsiveBar } from "@nivo/bar";

export default function DemographicVisualization({ data }: { data: any }) {
  if (!data) {
    return (
      <div className="text-center py-8 text-gray-500">
        कुनै जनसांख्यिकीय डाटा उपलब्ध छैन। फारम प्रयोग गरी पहिले डाटा थप्नुहोस्।
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

  // Data for gender pie chart
  const genderData = [
    {
      id: "पुरुष",
      label: "पुरुष",
      value: data.populationMale || 0,
      color: "hsl(215, 70%, 50%)",
    },
    {
      id: "महिला",
      label: "महिला",
      value: data.populationFemale || 0,
      color: "hsl(340, 70%, 50%)",
    },
  ];

  if (data.populationOther && data.populationOther > 0) {
    genderData.push({
      id: "अन्य",
      label: "अन्य",
      value: data.populationOther,
      color: "hsl(170, 70%, 50%)",
    });
  }

  // Data for age groups bar chart
  const ageData = [
    {
      age: "०-१४ वर्ष",
      value: data.population0To14 || 0,
      valueColor: "hsl(120, 70%, 50%)",
    },
    {
      age: "१५-५९ वर्ष",
      value: data.population15To59 || 0,
      valueColor: "hsl(200, 70%, 50%)",
    },
    {
      age: "६०+ वर्ष",
      value: data.population60AndAbove || 0,
      valueColor: "hsl(30, 70%, 50%)",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Summary cards */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-medium flex items-center">
            <Users className="mr-2 h-5 w-5" />
            जनसंख्या आँकडा
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">कुल जनसंख्या</span>
              <span className="text-2xl font-bold">
                {data.totalPopulation?.toLocaleString() || 0}
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-sm text-gray-500">कुल घरधुरी</span>
              <span className="text-2xl font-bold">
                {data.totalHouseholds?.toLocaleString() || 0}
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-sm text-gray-500">लिङ्ग अनुपात</span>
              <span className="text-2xl font-bold">{data.sexRatio || 0}</span>
              <span className="text-xs text-gray-500">प्रति १०० महिला</span>
            </div>

            <div className="flex flex-col">
              <span className="text-sm text-gray-500">औसत परिवार आकार</span>
              <span className="text-2xl font-bold">
                {data.averageHouseholdSize || 0}
              </span>
              <span className="text-xs text-gray-500">
                व्यक्ति प्रति घरधुरी
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-sm text-gray-500">जनसंख्या घनत्व</span>
              <span className="text-2xl font-bold">
                {data.populationDensity || 0}
              </span>
              <span className="text-xs text-gray-500">प्रति वर्ग कि.मि.</span>
            </div>

            <div className="flex flex-col">
              <span className="text-sm text-gray-500">जनसंख्या वृद्धि दर</span>
              <span className="text-2xl font-bold">
                {data.growthRate || 0}%
              </span>
              <span className="text-xs text-gray-500">वार्षिक</span>
            </div>

            <div className="flex flex-col">
              <span className="text-sm text-gray-500">कुल वडा संख्या</span>
              <span className="text-2xl font-bold">
                {data.totalWards || 0}
              </span>
              <span className="text-xs text-gray-500">वडा</span>
            </div>

            <div className="flex flex-col">
              <span className="text-sm text-gray-500">कुल भूमि क्षेत्र</span>
              <span className="text-2xl font-bold">
                {data.totalLandArea || 0}
              </span>
              <span className="text-xs text-gray-500">वर्ग कि.मि.</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gender distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-medium flex items-center">
            <UserRound className="mr-2 h-5 w-5" />
            लिङ्ग वितरण
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsivePie
              data={genderData}
              margin={{ top: 20, right: 20, bottom: 80, left: 20 }}
              innerRadius={0.5}
              padAngle={0.7}
              cornerRadius={3}
              activeOuterRadiusOffset={8}
              colors={{ scheme: "category10" }}
              borderWidth={1}
              borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
              arcLinkLabelsSkipAngle={10}
              arcLinkLabelsTextColor="#333333"
              arcLinkLabelsThickness={2}
              arcLinkLabelsColor={{ from: "color" }}
              arcLabelsSkipAngle={10}
              arcLabelsTextColor={{ from: "color", modifiers: [["darker", 2]] }}
              legends={[
                {
                  anchor: "bottom",
                  direction: "row",
                  justify: false,
                  translateX: 0,
                  translateY: 56,
                  itemsSpacing: 0,
                  itemWidth: 100,
                  itemHeight: 18,
                  itemTextColor: "#999",
                  itemDirection: "left-to-right",
                  itemOpacity: 1,
                  symbolSize: 18,
                  symbolShape: "circle",
                },
              ]}
            />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">पुरुष</span>
                <span className="text-sm text-gray-500">
                  {malePct.toFixed(1)}%
                </span>
              </div>
              <Progress value={malePct} className="mt-2" />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">महिला</span>
                <span className="text-sm text-gray-500">
                  {femalePct.toFixed(1)}%
                </span>
              </div>
              <Progress value={femalePct} className="mt-2" />
            </div>
            {data.populationOther > 0 && (
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">अन्य</span>
                  <span className="text-sm text-gray-500">
                    {otherPct.toFixed(1)}%
                  </span>
                </div>
                <Progress value={otherPct} className="mt-2" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Age distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-medium flex items-center">
            <UserRoundX className="mr-2 h-5 w-5" />
            उमेर समूह वितरण
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveBar
              data={ageData}
              keys={["value"]}
              indexBy="age"
              margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
              padding={0.3}
              valueScale={{ type: "linear" }}
              colors={{ scheme: "paired" }}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: "उमेर समूह",
                legendPosition: "middle",
                legendOffset: 40,
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: "जनसंख्या",
                legendPosition: "middle",
                legendOffset: -50,
              }}
              labelSkipWidth={12}
              labelSkipHeight={12}
              labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
              animate={true}
            />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">०-१४ वर्ष</span>
                <span className="text-sm text-gray-500">
                  {pop0to14Pct.toFixed(1)}%
                </span>
              </div>
              <Progress value={pop0to14Pct} className="mt-2" />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">१५-५९ वर्ष</span>
                <span className="text-sm text-gray-500">
                  {pop15to59Pct.toFixed(1)}%
                </span>
              </div>
              <Progress value={pop15to59Pct} className="mt-2" />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">६०+ वर्ष</span>
                <span className="text-sm text-gray-500">
                  {pop60PlusPct.toFixed(1)}%
                </span>
              </div>
              <Progress value={pop60PlusPct} className="mt-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Literacy rates */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-medium flex items-center">
            <Book className="mr-2 h-5 w-5" />
            साक्षरता दर
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-base font-medium">१५+ साक्षरता दर</span>
                <span className="text-base font-bold text-green-600">
                  {data.literacyRateAbove15 || 0}%
                </span>
              </div>
              <Progress value={data.literacyRateAbove15 || 0} className="h-3" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-base font-medium">१५-२४ साक्षरता दर</span>
                <span className="text-base font-bold text-green-600">
                  {data.literacyRate15To24 || 0}%
                </span>
              </div>
              <Progress value={data.literacyRate15To24 || 0} className="h-3" />
            </div>
          </div>

          <Separator className="my-6" />

          <div className="mt-6">
            <h3 className="font-medium mb-4">अनुपस्थित जनसंख्या</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">कुल अनुपस्थित</span>
                <span className="text-xl font-bold">
                  {data.populationAbsenteeTotal?.toLocaleString() || 0}
                </span>
                <span className="text-xs text-gray-500">
                  (
                  {totalPop
                    ? (
                        ((data.populationAbsenteeTotal || 0) / totalPop) *
                        100
                      ).toFixed(1)
                    : 0}
                  % कुल जनसंख्याको)
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-sm text-gray-500">पुरुष अनुपस्थित</span>
                <span className="text-xl font-bold">
                  {data.populationMaleAbsentee?.toLocaleString() || 0}
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-sm text-gray-500">महिला अनुपस्थित</span>
                <span className="text-xl font-bold">
                  {data.populationFemaleAbsentee?.toLocaleString() || 0}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
