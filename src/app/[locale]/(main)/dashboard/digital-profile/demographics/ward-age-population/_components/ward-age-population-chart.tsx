"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsivePie } from "@nivo/pie";
import { ResponsiveFunnel } from "@nivo/funnel";
import { Badge } from "@/components/ui/badge";

type Gender = "MALE" | "FEMALE" | "OTHER";
type AgeGroup =
  | "AGE_0_4"
  | "AGE_5_9"
  | "AGE_10_14"
  | "AGE_15_19"
  | "AGE_20_24"
  | "AGE_25_29"
  | "AGE_30_34"
  | "AGE_35_39"
  | "AGE_40_44"
  | "AGE_45_49"
  | "AGE_50_54"
  | "AGE_55_59"
  | "AGE_60_64"
  | "AGE_65_69"
  | "AGE_70_74"
  | "AGE_75_AND_ABOVE";

type WardAgeWisePopulationData = {
  id: string;
  wardNumber: number;
  ageGroup: AgeGroup;
  gender: Gender;
  population: number;
};

interface WardAgeWisePopulationChartProps {
  data: WardAgeWisePopulationData[];
}

export default function WardAgeWisePopulationChart({
  data,
}: WardAgeWisePopulationChartProps) {
  const [selectedWard, setSelectedWard] = useState<string>("all");
  const [selectedChart, setSelectedChart] = useState<string>("pyramid");

  // Calculate unique wards for filtering
  const uniqueWards = useMemo(() => {
    return Array.from(new Set(data.map((item) => item.wardNumber))).sort(
      (a, b) => a - b,
    );
  }, [data]);

  // Filter the data
  const filteredData = useMemo(() => {
    return data.filter(
      (item) =>
        selectedWard === "all" || item.wardNumber === parseInt(selectedWard),
    );
  }, [data, selectedWard]);

  // Map age groups to more readable forms and create a sort order
  const ageGroupMap: Record<AgeGroup, { label: string; order: number }> = {
    AGE_0_4: { label: "०-४ वर्ष", order: 1 },
    AGE_5_9: { label: "५-९ वर्ष", order: 2 },
    AGE_10_14: { label: "१०-१४ वर्ष", order: 3 },
    AGE_15_19: { label: "१५-१९ वर्ष", order: 4 },
    AGE_20_24: { label: "२०-२४ वर्ष", order: 5 },
    AGE_25_29: { label: "२५-२९ वर्ष", order: 6 },
    AGE_30_34: { label: "३०-३४ वर्ष", order: 7 },
    AGE_35_39: { label: "३५-३९ वर्ष", order: 8 },
    AGE_40_44: { label: "४०-४४ वर्ष", order: 9 },
    AGE_45_49: { label: "४५-४९ वर्ष", order: 10 },
    AGE_50_54: { label: "५०-५४ वर्ष", order: 11 },
    AGE_55_59: { label: "५५-५९ वर्ष", order: 12 },
    AGE_60_64: { label: "६०-६४ वर्ष", order: 13 },
    AGE_65_69: { label: "६५-६९ वर्ष", order: 14 },
    AGE_70_74: { label: "७०-७४ वर्ष", order: 15 },
    AGE_75_AND_ABOVE: { label: "७५+ वर्ष", order: 16 },
  };

  // Pyramid chart data (Male vs Female by age group) - modified for funnel chart
  const pyramidData = useMemo(() => {
    const maleData: {
      id: string;
      label: string;
      value: number;
      color: string;
    }[] = [];

    const femaleData: {
      id: string;
      label: string;
      value: number;
      color: string;
    }[] = [];

    // Group data by age and gender
    const groupedByAge: Record<string, { male: number; female: number }> = {};

    filteredData.forEach((item) => {
      const ageGroup = item.ageGroup;
      if (!groupedByAge[ageGroup]) {
        groupedByAge[ageGroup] = { male: 0, female: 0 };
      }

      if (item.gender === "MALE") {
        groupedByAge[ageGroup].male += item.population;
      } else if (item.gender === "FEMALE") {
        groupedByAge[ageGroup].female += item.population;
      }
    });

    // Convert to array and sort by age group
    const sortedAgeGroups = Object.entries(groupedByAge).sort(([a], [b]) => {
      return (
        ageGroupMap[a as AgeGroup].order - ageGroupMap[b as AgeGroup].order
      );
    });

    // Create data formatted for funnel chart
    sortedAgeGroups.forEach(([ageGroup, counts]) => {
      const label = ageGroupMap[ageGroup as AgeGroup].label;

      maleData.push({
        id: `${label}-male`,
        label,
        value: counts.male,
        color: "#6ea1ff", // Male color
      });

      femaleData.push({
        id: `${label}-female`,
        label,
        value: counts.female,
        color: "#ff74b6", // Female color
      });
    });

    // For funnel chart, we need to combine male and female data
    const combinedData = [
      {
        id: "पुरुष",
        label: "पुरुष",
        value: Object.values(groupedByAge).reduce(
          (sum, count) => sum + count.male,
          0,
        ),
        color: "#6ea1ff",
      },
      {
        id: "महिला",
        label: "महिला",
        value: Object.values(groupedByAge).reduce(
          (sum, count) => sum + count.female,
          0,
        ),
        color: "#ff74b6",
      },
    ];

    return {
      pyramidData: sortedAgeGroups.map(([ageGroup, counts]) => ({
        ageGroup: ageGroupMap[ageGroup as AgeGroup].label,
        male: -counts.male, // Negative for left side
        female: counts.female, // Positive for right side
      })),
      funnelData: combinedData,
    };
  }, [filteredData]);

  // Bar chart data (Total population by age group)
  const barChartData = useMemo(() => {
    const aggregatedData: Record<
      string,
      {
        ageGroup: string;
        male: number;
        female: number;
        other: number;
        total: number;
      }
    > = {};

    filteredData.forEach((item) => {
      const ageGroupKey = item.ageGroup;
      if (!aggregatedData[ageGroupKey]) {
        aggregatedData[ageGroupKey] = {
          ageGroup: ageGroupMap[ageGroupKey].label,
          male: 0,
          female: 0,
          other: 0,
          total: 0,
        };
      }

      if (item.gender === "MALE") {
        aggregatedData[ageGroupKey].male += item.population;
        aggregatedData[ageGroupKey].total += item.population;
      } else if (item.gender === "FEMALE") {
        aggregatedData[ageGroupKey].female += item.population;
        aggregatedData[ageGroupKey].total += item.population;
      } else {
        aggregatedData[ageGroupKey].other += item.population;
        aggregatedData[ageGroupKey].total += item.population;
      }
    });

    // Convert to array and sort by age group order
    return Object.values(aggregatedData).sort((a, b) => {
      const aOrder =
        ageGroupMap[
          Object.keys(aggregatedData).find(
            (key) => aggregatedData[key] === a,
          ) as AgeGroup
        ]?.order || 0;
      const bOrder =
        ageGroupMap[
          Object.keys(aggregatedData).find(
            (key) => aggregatedData[key] === b,
          ) as AgeGroup
        ]?.order || 0;
      return aOrder - bOrder;
    });
  }, [filteredData]);

  // Pie chart data (Gender distribution)
  const pieChartData = useMemo(() => {
    const totals = {
      male: 0,
      female: 0,
      other: 0,
    };

    filteredData.forEach((item) => {
      if (item.gender === "MALE") {
        totals.male += item.population;
      } else if (item.gender === "FEMALE") {
        totals.female += item.population;
      } else {
        totals.other += item.population;
      }
    });

    const chartData = [
      {
        id: "पुरुष",
        label: "पुरुष",
        value: totals.male,
        color: "hsl(210, 70%, 50%)",
      },
      {
        id: "महिला",
        label: "महिला",
        value: totals.female,
        color: "hsl(340, 70%, 50%)",
      },
    ];

    if (totals.other > 0) {
      chartData.push({
        id: "अन्य",
        label: "अन्य",
        value: totals.other,
        color: "hsl(270, 70%, 50%)",
      });
    }

    return chartData;
  }, [filteredData]);

  // Calculate summary statistics
  const summary = useMemo(() => {
    let totalPopulation = 0;
    let malePopulation = 0;
    let femalePopulation = 0;
    let otherPopulation = 0;
    let childrenPopulation = 0; // 0-14
    let youthPopulation = 0; // 15-29
    let adultPopulation = 0; // 30-59
    let elderlyPopulation = 0; // 60+

    filteredData.forEach((item) => {
      const ageGroup = item.ageGroup;
      const population = item.population;

      totalPopulation += population;

      if (item.gender === "MALE") malePopulation += population;
      else if (item.gender === "FEMALE") femalePopulation += population;
      else otherPopulation += population;

      // Age group categories
      if (["AGE_0_4", "AGE_5_9", "AGE_10_14"].includes(ageGroup)) {
        childrenPopulation += population;
      } else if (["AGE_15_19", "AGE_20_24", "AGE_25_29"].includes(ageGroup)) {
        youthPopulation += population;
      } else if (
        [
          "AGE_30_34",
          "AGE_35_39",
          "AGE_40_44",
          "AGE_45_49",
          "AGE_50_54",
          "AGE_55_59",
        ].includes(ageGroup)
      ) {
        adultPopulation += population;
      } else {
        elderlyPopulation += population;
      }
    });

    // Calculate percentages
    const malePercent =
      totalPopulation > 0 ? (malePopulation / totalPopulation) * 100 : 0;
    const femalePercent =
      totalPopulation > 0 ? (femalePopulation / totalPopulation) * 100 : 0;
    const otherPercent =
      totalPopulation > 0 ? (otherPopulation / totalPopulation) * 100 : 0;

    const childrenPercent =
      totalPopulation > 0 ? (childrenPopulation / totalPopulation) * 100 : 0;
    const youthPercent =
      totalPopulation > 0 ? (youthPopulation / totalPopulation) * 100 : 0;
    const adultPercent =
      totalPopulation > 0 ? (adultPopulation / totalPopulation) * 100 : 0;
    const elderlyPercent =
      totalPopulation > 0 ? (elderlyPopulation / totalPopulation) * 100 : 0;

    const sexRatio =
      femalePopulation > 0 ? (malePopulation / femalePopulation) * 100 : 0;

    return {
      totalPopulation,
      malePopulation,
      femalePopulation,
      otherPopulation,
      childrenPopulation,
      youthPopulation,
      adultPopulation,
      elderlyPopulation,
      malePercent,
      femalePercent,
      otherPercent,
      childrenPercent,
      youthPercent,
      adultPercent,
      elderlyPercent,
      sexRatio,
    };
  }, [filteredData]);

  // No data handling
  if (data.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500">
        <p>कुनै डाटा उपलब्ध छैन। पहिले उमेर अनुसार जनसंख्या डाटा थप्नुहोस्।</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Chart controls */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">वडा छान्नुहोस्:</span>
          <Select value={selectedWard} onValueChange={setSelectedWard}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="सबै वडाहरू" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">सबै वडाहरू</SelectItem>
              {uniqueWards.map((ward) => (
                <SelectItem key={ward} value={ward.toString()}>
                  वडा {ward}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">चार्ट प्रकार:</span>
          <Tabs
            value={selectedChart}
            onValueChange={setSelectedChart}
            className="w-[400px]"
          >
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="pyramid">उमेर पिरामिड</TabsTrigger>
              <TabsTrigger value="bar">बार चार्ट</TabsTrigger>
              <TabsTrigger value="pie">पाइ चार्ट</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Summary statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">कुल जनसंख्या</span>
              <span className="text-2xl font-semibold">
                {summary.totalPopulation.toLocaleString()}
              </span>
              <div className="mt-2 flex items-center gap-2">
                <Badge variant="outline" className="bg-blue-50">
                  पुरुष: {summary.malePercent.toFixed(1)}%
                </Badge>
                <Badge variant="outline" className="bg-pink-50">
                  महिला: {summary.femalePercent.toFixed(1)}%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">लिङ्ग अनुपात</span>
              <span className="text-2xl font-semibold">
                {summary.sexRatio.toFixed(1)}
              </span>
              <span className="text-xs text-gray-500">
                प्रति १०० महिला पुरुष
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">०-१४ वर्ष</span>
              <span className="text-2xl font-semibold">
                {summary.childrenPopulation.toLocaleString()}
              </span>
              <span className="text-xs text-gray-500">
                {summary.childrenPercent.toFixed(1)}% जनसंख्याको
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">६० वर्ष माथि</span>
              <span className="text-2xl font-semibold">
                {summary.elderlyPopulation.toLocaleString()}
              </span>
              <span className="text-xs text-gray-500">
                {summary.elderlyPercent.toFixed(1)}% जनसंख्याको
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart visualizations */}
      <Card>
        <CardHeader className="pb-0">
          <CardTitle>
            उमेर समूह अनुसार जनसंख्या वितरण
            {selectedWard !== "all" && (
              <span className="ml-2">- वडा {selectedWard}</span>
            )}
          </CardTitle>
          <CardDescription>
            विभिन्न उमेर समूह र लिङ्ग अनुसार जनसंख्या वितरण
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[500px] mt-4">
            {selectedChart === "pyramid" && (
              <ResponsiveBar
                data={pyramidData.pyramidData}
                keys={["male", "female"]}
                indexBy="ageGroup"
                margin={{ top: 50, right: 130, bottom: 50, left: 130 }}
                padding={0.3}
                groupMode="grouped"
                layout="horizontal"
                valueScale={{ type: "linear" }}
                indexScale={{ type: "band", round: true }}
                colors={({ id, data }) =>
                  id === "male" ? "#6ea1ff" : "#ff74b6"
                }
                borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
                axisTop={null}
                axisRight={null}
                axisLeft={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: "उमेर समूह",
                  legendPosition: "middle",
                  legendOffset: -40,
                  truncateTickAt: 0,
                }}
                axisBottom={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: "जनसंख्या",
                  legendPosition: "middle",
                  legendOffset: 32,
                  format: (v) => Math.abs(Number(v)).toString(),
                }}
                labelSkipWidth={12}
                labelSkipHeight={12}
                labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
                legends={[
                  {
                    dataFrom: "keys",
                    anchor: "bottom-right",
                    direction: "column",
                    justify: false,
                    translateX: 120,
                    translateY: 0,
                    itemsSpacing: 2,
                    itemWidth: 100,
                    itemHeight: 20,
                    itemDirection: "left-to-right",
                    itemOpacity: 0.85,
                    symbolSize: 20,
                    effects: [
                      {
                        on: "hover",
                        style: {
                          itemOpacity: 1,
                        },
                      },
                    ],
                  },
                ]}
              />
            )}

            {selectedChart === "bar" && (
              <ResponsiveBar
                data={barChartData}
                keys={["male", "female", "other"]}
                indexBy="ageGroup"
                margin={{ top: 50, right: 130, bottom: 80, left: 60 }}
                padding={0.3}
                valueScale={{ type: "linear" }}
                indexScale={{ type: "band", round: true }}
                colors={["#6ea1ff", "#ff74b6", "#a34fff"]}
                borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 45,
                  legend: "उमेर समूह",
                  legendPosition: "middle",
                  legendOffset: 60,
                }}
                axisLeft={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: "जनसंख्या",
                  legendPosition: "middle",
                  legendOffset: -40,
                }}
                labelSkipWidth={12}
                labelSkipHeight={12}
                labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
                legends={[
                  {
                    dataFrom: "keys",
                    anchor: "bottom-right",
                    direction: "column",
                    justify: false,
                    translateX: 120,
                    translateY: 0,
                    itemsSpacing: 2,
                    itemWidth: 100,
                    itemHeight: 20,
                    itemDirection: "left-to-right",
                    itemOpacity: 0.85,
                    symbolSize: 20,
                    effects: [
                      {
                        on: "hover",
                        style: {
                          itemOpacity: 1,
                        },
                      },
                    ],
                  },
                ]}
              />
            )}

            {selectedChart === "pie" && (
              <ResponsivePie
                data={pieChartData}
                margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                innerRadius={0.5}
                padAngle={0.7}
                cornerRadius={3}
                activeOuterRadiusOffset={8}
                borderWidth={1}
                borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
                arcLinkLabelsSkipAngle={10}
                arcLinkLabelsTextColor="#333333"
                arcLinkLabelsThickness={2}
                arcLinkLabelsColor={{ from: "color" }}
                arcLabelsSkipAngle={10}
                arcLabelsTextColor={{
                  from: "color",
                  modifiers: [["darker", 2]],
                }}
                colors={{ scheme: "set2" }}
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
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
