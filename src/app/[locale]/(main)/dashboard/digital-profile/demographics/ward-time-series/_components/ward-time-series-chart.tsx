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
import { ResponsiveLine } from "@nivo/line";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface WardTimeSeriesData {
  id: string;
  wardNumber: number;
  wardName?: string | null;
  year: number;
  totalPopulation?: number | null;
  malePopulation?: number | null;
  femalePopulation?: number | null;
  otherPopulation?: number | null;
  totalHouseholds?: number | null;
  literacyRate?: number | null;
  maleLiteracyRate?: number | null;
  femaleLiteracyRate?: number | null;
}

interface WardTimeSeriesChartProps {
  data: WardTimeSeriesData[];
}

export default function WardTimeSeriesChart({
  data,
}: WardTimeSeriesChartProps) {
  const [selectedMetric, setSelectedMetric] =
    useState<string>("totalPopulation");
  const [selectedView, setSelectedView] = useState<string>("byYear");

  // Get unique wards and years
  const uniqueWards = useMemo(() => {
    return Array.from(new Set(data.map((item) => item.wardNumber))).sort(
      (a, b) => a - b,
    );
  }, [data]);

  const uniqueYears = useMemo(() => {
    return Array.from(new Set(data.map((item) => item.year))).sort(
      (a, b) => a - b,
    );
  }, [data]);

  // Prepare data for the charts
  const barChartDataByYear = useMemo(() => {
    return uniqueYears.map((year) => {
      const yearData = data.filter((d) => d.year === year);
      const result: any = { year: year.toString() };

      uniqueWards.forEach((ward) => {
        const wardData = yearData.find((d) => d.wardNumber === ward);
        result[`वडा ${ward}`] = wardData
          ? (wardData as any)[selectedMetric] || 0
          : 0;
      });

      return result;
    });
  }, [data, uniqueWards, uniqueYears, selectedMetric]);

  const barChartDataByWard = useMemo(() => {
    return uniqueWards.map((ward) => {
      const wardData = data.filter((d) => d.wardNumber === ward);
      const result: any = { ward: `वडा ${ward}` };

      uniqueYears.forEach((year) => {
        const yearData = wardData.find((d) => d.year === year);
        result[`${year} वि.स.`] = yearData
          ? (yearData as any)[selectedMetric] || 0
          : 0;
      });

      return result;
    });
  }, [data, uniqueWards, uniqueYears, selectedMetric]);

  const lineChartData = useMemo(() => {
    return uniqueWards.map((ward) => {
      const wardData = data
        .filter((d) => d.wardNumber === ward)
        .sort((a, b) => a.year - b.year);

      return {
        id: `वडा ${ward}`,
        data: wardData.map((d) => ({
          x: d.year,
          y: (d as any)[selectedMetric] || 0,
        })),
      };
    });
  }, [data, uniqueWards, selectedMetric]);

  // Calculate maximum value for y-axis scaling
  const maxValue = useMemo(() => {
    let max = 0;
    data.forEach((item) => {
      const value = (item as any)[selectedMetric];
      if (value && value > max) max = value;
    });
    return max;
  }, [data, selectedMetric]);

  // Define metrics options
  const metrics = [
    { value: "totalPopulation", label: "कुल जनसंख्या" },
    { value: "malePopulation", label: "पुरुष जनसंख्या" },
    { value: "femalePopulation", label: "महिला जनसंख्या" },
    { value: "totalHouseholds", label: "कुल घरधुरी" },
    { value: "literacyRate", label: "साक्षरता दर" },
    { value: "maleLiteracyRate", label: "पुरुष साक्षरता दर" },
    { value: "femaleLiteracyRate", label: "महिला साक्षरता दर" },
  ];

  // Get human readable metric name
  const getMetricLabel = () => {
    return (
      metrics.find((m) => m.value === selectedMetric)?.label || selectedMetric
    );
  };

  const isPercentage =
    selectedMetric === "literacyRate" ||
    selectedMetric === "maleLiteracyRate" ||
    selectedMetric === "femaleLiteracyRate";

  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">
          कुनै डाटा उपलब्ध छैन। पहिले वडा जनसंख्या डाटा थप्नुहोस्।
        </p>
      </div>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>वडा जनसंख्या तथ्याङ्क विश्लेषण</CardTitle>
        <CardDescription>
          समय अनुसार वडा जनसंख्या डाटा हेर्नुहोस्
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
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="bar" className="mt-2">
          <TabsList>
            <TabsTrigger value="bar">बार चार्ट</TabsTrigger>
            <TabsTrigger value="line">लाइन चार्ट</TabsTrigger>
          </TabsList>

          <TabsContent value="bar" className="space-y-4">
            <div className="mb-4">
              <Tabs value={selectedView} onValueChange={setSelectedView}>
                <TabsList>
                  <TabsTrigger value="byYear">वर्ष अनुसार</TabsTrigger>
                  <TabsTrigger value="byWard">वडा अनुसार</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="h-96 border rounded-lg p-4 bg-white">
              {selectedView === "byYear" ? (
                <ResponsiveBar
                  data={barChartDataByYear}
                  keys={uniqueWards.map((ward) => `वडा ${ward}`)}
                  indexBy="year"
                  margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                  padding={0.3}
                  valueScale={{ type: "linear" }}
                  indexScale={{ type: "band", round: true }}
                  colors={{ scheme: "category10" }}
                  borderColor={{
                    from: "color",
                    modifiers: [["darker", 1.6]],
                  }}
                  axisTop={null}
                  axisRight={null}
                  axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: "वर्ष",
                    legendPosition: "middle",
                    legendOffset: 32,
                  }}
                  axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: getMetricLabel(),
                    legendPosition: "middle",
                    legendOffset: -40,
                    format: (value) => (isPercentage ? `${value}%` : value),
                  }}
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
              ) : (
                <ResponsiveBar
                  data={barChartDataByWard}
                  keys={uniqueYears.map((year) => `${year} वि.स.`)}
                  indexBy="ward"
                  margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                  padding={0.3}
                  groupMode="grouped"
                  valueScale={{ type: "linear" }}
                  indexScale={{ type: "band", round: true }}
                  colors={{ scheme: "category10" }}
                  borderColor={{
                    from: "color",
                    modifiers: [["darker", 1.6]],
                  }}
                  axisTop={null}
                  axisRight={null}
                  axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: "वडा",
                    legendPosition: "middle",
                    legendOffset: 32,
                  }}
                  axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: getMetricLabel(),
                    legendPosition: "middle",
                    legendOffset: -40,
                    format: (value) => (isPercentage ? `${value}%` : value),
                  }}
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
              )}
            </div>
          </TabsContent>

          <TabsContent value="line">
            <div className="h-96 border rounded-lg p-4 bg-white">
              <ResponsiveLine
                data={lineChartData}
                margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                xScale={{
                  type: "point",
                }}
                yScale={{
                  type: "linear",
                  min: 0,
                  max: isPercentage ? 100 : "auto",
                  stacked: false,
                }}
                yFormat={
                  isPercentage ? (value: number) => `${value}%` : undefined
                }
                axisTop={null}
                axisRight={null}
                axisBottom={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: "वर्ष",
                  legendOffset: 36,
                  legendPosition: "middle",
                }}
                axisLeft={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: getMetricLabel(),
                  legendOffset: -40,
                  legendPosition: "middle",
                  format: (value: number) =>
                    isPercentage ? `${value}%` : value,
                }}
                colors={{ scheme: "category10" }}
                pointSize={10}
                pointColor={{ theme: "background" }}
                pointBorderWidth={2}
                pointBorderColor={{ from: "serieColor" }}
                pointLabelYOffset={-12}
                useMesh={true}
                legends={[
                  {
                    anchor: "bottom-right",
                    direction: "column",
                    justify: false,
                    translateX: 100,
                    translateY: 0,
                    itemsSpacing: 0,
                    itemDirection: "left-to-right",
                    itemWidth: 80,
                    itemHeight: 20,
                    itemOpacity: 0.75,
                    symbolSize: 12,
                    symbolShape: "circle",
                    symbolBorderColor: "rgba(0, 0, 0, .5)",
                    effects: [
                      {
                        on: "hover",
                        style: {
                          itemBackground: "rgba(0, 0, 0, .03)",
                          itemOpacity: 1,
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
