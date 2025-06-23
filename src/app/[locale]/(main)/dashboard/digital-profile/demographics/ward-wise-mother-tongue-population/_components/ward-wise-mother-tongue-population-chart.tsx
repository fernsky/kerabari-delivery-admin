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
import { ResponsiveBar } from "@nivo/bar";
import { ResponsivePie } from "@nivo/pie";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface WardWiseMotherTonguePopulationData {
  id: string;
  wardId: string;
  wardNumber?: number;
  wardName?: string | null;
  languageType: string;
  languageName: string;
  population?: number | null;
  percentage?: string | null;
}

interface WardWiseMotherTonguePopulationChartProps {
  data: WardWiseMotherTonguePopulationData[];
}

export default function WardWiseMotherTonguePopulationChart({
  data,
}: WardWiseMotherTonguePopulationChartProps) {
  const [selectedMetric, setSelectedMetric] = useState<string>("population");
  const [selectedWard, setSelectedWard] = useState<string>("all");

  // Get unique wards
  const uniqueWards = useMemo(() => {
    return Array.from(new Set(data.map((item) => item.wardId))).sort();
  }, [data]);

  // Get ward numbers for display
  const wardIdToNumber = useMemo(() => {
    return data.reduce(
      (acc, item) => {
        if (item.wardId && item.wardNumber) {
          acc[item.wardId] = item.wardNumber;
        }
        return acc;
      },
      {} as Record<string, number>,
    );
  }, [data]);

  // Get unique languages
  const uniqueLanguages = useMemo(() => {
    return Array.from(new Set(data.map((item) => item.languageType))).sort();
  }, [data]);

  // Filter by selected ward
  const filteredData = useMemo(() => {
    if (selectedWard === "all") return data;
    return data.filter((item) => item.wardId === selectedWard);
  }, [data, selectedWard]);

  // Group by ward and aggregate languages for bar chart
  const barChartData = useMemo(() => {
    if (selectedWard !== "all") {
      // For a single ward, show all languages
      return filteredData
        .sort((a, b) => {
          // Handle percentage correctly by converting to number
          const valueA =
            selectedMetric === "percentage"
              ? parseFloat(a.percentage || "0")
              : (a[selectedMetric as keyof typeof a] as number) || 0;

          const valueB =
            selectedMetric === "percentage"
              ? parseFloat(b.percentage || "0")
              : (b[selectedMetric as keyof typeof b] as number) || 0;

          return valueB - valueA;
        })
        .map((item, index) => {
          // Generate consistent colors based on index
          const hue = (index * 137.5) % 360;
          return {
            language: item.languageType,
            [selectedMetric]:
              selectedMetric === "percentage"
                ? parseFloat(item.percentage || "0")
                : item[selectedMetric as keyof typeof item] || 0,
            color: `hsl(${hue}, 70%, 50%)`,
          };
        });
    } else {
      // For all wards, group by language instead of ward
      const languageGroups = uniqueLanguages.reduce(
        (acc, language) => {
          acc[language] = {
            totalValue: 0,
            count: 0,
          };
          return acc;
        },
        {} as Record<string, { totalValue: number; count: number }>,
      );

      // Calculate total for each language
      filteredData.forEach((item) => {
        if (item.languageType) {
          if (selectedMetric === "percentage") {
            if (item.percentage) {
              languageGroups[item.languageType].totalValue += parseFloat(
                item.percentage,
              );
              languageGroups[item.languageType].count++;
            }
          } else {
            languageGroups[item.languageType].totalValue +=
              (item[selectedMetric as keyof typeof item] as number) || 0;
            languageGroups[item.languageType].count++;
          }
        }
      });

      // Create chart data from language groups
      return Object.keys(languageGroups)
        .map((language, index) => {
          const hue = (index * 137.5) % 360;
          const value =
            selectedMetric === "percentage"
              ? languageGroups[language].count > 0
                ? languageGroups[language].totalValue /
                  languageGroups[language].count
                : 0
              : languageGroups[language].totalValue;

          return {
            language,
            [selectedMetric]: value,
            color: `hsl(${hue}, 70%, 50%)`,
          };
        })
        .sort((a, b) => Number(b[selectedMetric]) - Number(a[selectedMetric]));
    }
  }, [filteredData, selectedMetric, selectedWard, uniqueLanguages]);

  // Prepare pie chart data
  const pieChartData = useMemo(() => {
    const languageGroups = uniqueLanguages
      .map((languageName) => {
        const languageData = filteredData.filter(
          (item) => item.languageType === languageName,
        );
        const total = languageData.reduce(
          (sum, item) =>
            sum + ((item[selectedMetric as keyof typeof item] as number) || 0),
          0,
        );

        return {
          id: languageName,
          label: languageName,
          value: total,
          color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`,
        };
      })
      .filter((item) => item.value > 0);

    // Sort by value for better visualization
    return languageGroups.sort((a, b) => b.value - a.value);
  }, [filteredData, uniqueLanguages, selectedMetric]);

  // Define metrics options
  const metrics = [
    { value: "population", label: "जनसंख्या" },
    { value: "percentage", label: "प्रतिशत" },
  ];

  // Get human-readable metric name
  const getMetricLabel = () => {
    return (
      metrics.find((m) => m.value === selectedMetric)?.label || selectedMetric
    );
  };

  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">
          कुनै डाटा उपलब्ध छैन। पहिले वडा मातृभाषा जनसंख्या डाटा थप्नुहोस्।
        </p>
      </div>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>वडा अनुसार मातृभाषा जनसंख्या विश्लेषण</CardTitle>
        <CardDescription>
          वडा र मातृभाषा अनुसार जनसंख्या डाटा हेर्नुहोस्
        </CardDescription>

        <div className="flex flex-wrap gap-4 mt-4">
          <div>
            <label className="text-sm font-medium mb-1 block">
              मेट्रिक चयन गर्नुहोस्:
            </label>
            <Select value={selectedMetric} onValueChange={setSelectedMetric}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="मेट्रिक चयन गर्नुहोस्" />
              </SelectTrigger>
              <SelectContent>
                {metrics.map((metric) => (
                  <SelectItem key={metric.value} value={metric.value}>
                    {metric.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">
              वडा चयन गर्नुहोस्:
            </label>
            <Select value={selectedWard} onValueChange={setSelectedWard}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="वडा चयन गर्नुहोस्" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">सबै वडा</SelectItem>
                {uniqueWards.map((wardId) => (
                  <SelectItem key={wardId} value={wardId}>
                    वडा {wardIdToNumber[wardId] || wardId}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="bar" className="mt-2">
          <TabsList>
            <TabsTrigger value="bar">बार चार्ट</TabsTrigger>
            <TabsTrigger value="pie">पाई चार्ट</TabsTrigger>
          </TabsList>

          <TabsContent value="bar">
            <div className="h-96 border rounded-lg p-4 bg-white">
              <ResponsiveBar
                data={barChartData}
                keys={[selectedMetric]}
                indexBy="language"
                margin={{ top: 50, right: 130, bottom: 80, left: 60 }}
                padding={0.3}
                valueScale={{ type: "linear" }}
                indexScale={{ type: "band", round: true }}
                colors={({ data }) => String(data.color)}
                borderColor={{
                  from: "color",
                  modifiers: [["darker", 1.6]],
                }}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 45,
                  legend: "मातृभाषा",
                  legendPosition: "middle",
                  legendOffset: 50,
                  truncateTickAt: 0,
                }}
                axisLeft={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: getMetricLabel(),
                  legendPosition: "middle",
                  legendOffset: -40,
                  format: (value) =>
                    selectedMetric === "percentage"
                      ? `${value.toFixed(1)}%`
                      : value.toString(),
                }}
                labelFormat={(value) =>
                  selectedMetric === "percentage"
                    ? `${value}%`
                    : value.toString()
                }
                labelSkipWidth={12}
                labelSkipHeight={12}
                labelTextColor={{
                  from: "color",
                  modifiers: [["darker", 1.6]],
                }}
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
            </div>
          </TabsContent>

          <TabsContent value="pie">
            <div className="h-96 border rounded-lg p-4 bg-white">
              <ResponsivePie
                data={pieChartData}
                margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                innerRadius={0.5}
                padAngle={0.7}
                cornerRadius={3}
                activeOuterRadiusOffset={8}
                borderWidth={1}
                borderColor={{
                  from: "color",
                  modifiers: [["darker", 0.2]],
                }}
                arcLinkLabelsSkipAngle={10}
                arcLinkLabelsTextColor="#333333"
                arcLinkLabelsThickness={2}
                arcLinkLabelsColor={{ from: "color" }}
                arcLabelsSkipAngle={10}
                arcLabelsTextColor={{
                  from: "color",
                  modifiers: [["darker", 2]],
                }}
                defs={[
                  {
                    id: "dots",
                    type: "patternDots",
                    background: "inherit",
                    color: "rgba(255, 255, 255, 0.3)",
                    size: 4,
                    padding: 1,
                    stagger: true,
                  },
                  {
                    id: "lines",
                    type: "patternLines",
                    background: "inherit",
                    color: "rgba(255, 255, 255, 0.3)",
                    rotation: -45,
                    lineWidth: 6,
                    spacing: 10,
                  },
                ]}
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
                    effects: [
                      {
                        on: "hover",
                        style: {
                          itemTextColor: "#000",
                        },
                      },
                    ],
                  },
                ]}
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
