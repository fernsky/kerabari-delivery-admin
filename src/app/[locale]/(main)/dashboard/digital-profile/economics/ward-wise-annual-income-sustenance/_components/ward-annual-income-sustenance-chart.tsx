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
import { Badge } from "@/components/ui/badge";
import { monthsSustainedLabels } from "@/server/api/routers/profile/economics/ward-wise-annual-income-sustenance.schema";

interface WardAnnualIncomeSustenanceData {
  id: string;
  wardNumber: number;
  monthsSustained: string;
  households: number;
}

interface WardAnnualIncomeSustenanceChartProps {
  data: WardAnnualIncomeSustenanceData[];
}

export default function WardAnnualIncomeSustenanceChart({
  data,
}: WardAnnualIncomeSustenanceChartProps) {
  const [selectedWard, setSelectedWard] = useState<string>("all");
  const [chartView, setChartView] = useState<string>("byMonthsSustained");

  // Helper function to get months sustained display names
  const getMonthsSustainedDisplayName = (monthsSustained: string): string => {
    return (
      monthsSustainedLabels[
        monthsSustained as keyof typeof monthsSustainedLabels
      ] || monthsSustained
    );
  };

  // Get unique wards
  const uniqueWards = useMemo(() => {
    return Array.from(
      new Set(data.map((item) => item.wardNumber.toString())),
    ).sort((a, b) => parseInt(a) - parseInt(b));
  }, [data]);

  // Get unique months sustained categories
  const uniqueMonthsSustained = useMemo(() => {
    return Array.from(new Set(data.map((item) => item.monthsSustained))).sort();
  }, [data]);

  // Filter by selected ward
  const filteredData = useMemo(() => {
    let result = [...data];

    if (selectedWard !== "all") {
      result = result.filter(
        (item) => item.wardNumber.toString() === selectedWard,
      );
    }

    return result;
  }, [data, selectedWard]);

  // Prepare bar chart data
  const barChartData = useMemo(() => {
    // Group by months sustained for all wards or a specific ward
    if (chartView === "byMonthsSustained") {
      return uniqueMonthsSustained.map((monthsSustained) => {
        const monthsSustainedItems = filteredData.filter(
          (item) => item.monthsSustained === monthsSustained,
        );

        // Create an object with months sustained as key and households
        return {
          monthsSustained: getMonthsSustainedDisplayName(monthsSustained),
          households: monthsSustainedItems.reduce(
            (sum, item) => sum + (item.households || 0),
            0,
          ),
        };
      });
    }
    // Group by ward for all months sustained categories
    else {
      return uniqueWards
        .filter((ward) => selectedWard === "all" || ward === selectedWard)
        .map((ward) => {
          const wardItems = filteredData.filter(
            (item) => item.wardNumber.toString() === ward,
          );

          // Create an object with ward as key
          const dataPoint: Record<string, any> = {
            ward: `वडा ${ward}`,
          };

          // Add each months sustained category as a property
          uniqueMonthsSustained.forEach((monthsSustained) => {
            const monthsSustainedItems = wardItems.filter(
              (item) => item.monthsSustained === monthsSustained,
            );
            dataPoint[getMonthsSustainedDisplayName(monthsSustained)] =
              monthsSustainedItems.reduce(
                (sum, item) => sum + (item.households || 0),
                0,
              );
          });

          return dataPoint;
        });
    }
  }, [
    filteredData,
    uniqueMonthsSustained,
    uniqueWards,
    chartView,
    selectedWard,
  ]);

  // Get chart keys based on the chartView
  const chartKeys = useMemo(() => {
    if (chartView === "byMonthsSustained") {
      return ["households"];
    } else {
      return uniqueMonthsSustained.map((monthsSustained) =>
        getMonthsSustainedDisplayName(monthsSustained),
      );
    }
  }, [chartView, uniqueMonthsSustained]);

  // Prepare pie chart data
  const pieChartData = useMemo(() => {
    if (chartView === "byMonthsSustained") {
      // Create pie data grouped by months sustained categories
      return uniqueMonthsSustained
        .map((monthsSustained, index) => {
          const monthsSustainedData = filteredData.filter(
            (item) => item.monthsSustained === monthsSustained,
          );
          const total = monthsSustainedData.reduce(
            (sum, item) => sum + (item.households || 0),
            0,
          );

          return {
            id: getMonthsSustainedDisplayName(monthsSustained),
            label: getMonthsSustainedDisplayName(monthsSustained),
            value: total,
            color: `hsl(${index * 40}, 70%, 50%)`,
          };
        })
        .filter((item) => item.value > 0);
    } else {
      // Create pie data grouped by wards
      return uniqueWards
        .filter((ward) => selectedWard === "all" || ward === selectedWard)
        .map((ward, index) => {
          const wardData = filteredData.filter(
            (item) => item.wardNumber.toString() === ward,
          );
          const total = wardData.reduce(
            (sum, item) => sum + (item.households || 0),
            0,
          );

          return {
            id: `वडा ${ward}`,
            label: `वडा ${ward}`,
            value: total,
            color: `hsl(${index * 40}, 70%, 50%)`,
          };
        })
        .filter((item) => item.value > 0);
    }
  }, [
    filteredData,
    uniqueMonthsSustained,
    uniqueWards,
    chartView,
    selectedWard,
  ]);

  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">
          कुनै डाटा उपलब्ध छैन। पहिले वडा अनुसार वार्षिक आम्दानी हुने महिनाको
          विवरण डाटा थप्नुहोस्।
        </p>
      </div>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>
          वडा अनुसार वार्षिक आम्दानी हुने महिनाको विवरण विश्लेषण
        </CardTitle>
        <CardDescription>
          वडा र महिनाको अवधि अनुसार वार्षिक आम्दानी हुने महिनाको विवरण डाटा
          हेर्नुहोस्
        </CardDescription>

        <div className="flex flex-wrap gap-4 mt-4">
          <div>
            <label className="text-sm font-medium mb-1 block">
              प्रस्तुतिकरण:
            </label>
            <Select value={chartView} onValueChange={setChartView}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="प्रस्तुतिकरण चयन गर्नुहोस्" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="byMonthsSustained">
                  महिनाको अवधि अनुसार
                </SelectItem>
                <SelectItem value="byWard">वडा अनुसार</SelectItem>
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
                {uniqueWards.map((ward) => (
                  <SelectItem key={ward} value={ward}>
                    वडा {ward}
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
                keys={chartKeys}
                indexBy={
                  chartView === "byMonthsSustained" ? "monthsSustained" : "ward"
                }
                margin={{ top: 50, right: 130, bottom: 80, left: 60 }}
                padding={0.3}
                groupMode="grouped"
                valueScale={{ type: "linear" }}
                indexScale={{ type: "band", round: true }}
                colors={{ scheme: "nivo" }}
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
                  legend:
                    chartView === "byMonthsSustained"
                      ? "महिनाको अवधि श्रेणी"
                      : "वडाहरू",
                  legendPosition: "middle",
                  legendOffset: 50,
                  truncateTickAt: 0,
                }}
                axisLeft={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: "घरपरिवार संख्या",
                  legendPosition: "middle",
                  legendOffset: -40,
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

        {/* Summary stats */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="text-sm font-medium text-muted-foreground mb-1">
              कुल घरपरिवार संख्या
            </div>
            <div className="text-2xl font-bold">
              {filteredData
                .reduce((sum, item) => sum + item.households, 0)
                .toLocaleString()}
            </div>
          </Card>

          <Card className="p-4">
            <div className="text-sm font-medium text-muted-foreground mb-1">
              वडा संख्या
            </div>
            <div className="text-2xl font-bold">
              {(selectedWard === "all" ? uniqueWards.length : 1).toString()}
            </div>
          </Card>

          <Card className="p-4">
            <div className="text-sm font-medium text-muted-foreground mb-1">
              महिनाको अवधि अनुसार वितरण
            </div>
            <div className="flex flex-wrap gap-2 mt-1">
              {uniqueMonthsSustained.map((monthsSustained) => {
                const monthsSustainedCount = filteredData
                  .filter((item) => item.monthsSustained === monthsSustained)
                  .reduce((sum, item) => sum + item.households, 0);
                const totalCount = filteredData.reduce(
                  (sum, item) => sum + item.households,
                  0,
                );
                const percentage =
                  totalCount > 0
                    ? ((monthsSustainedCount / totalCount) * 100).toFixed(1)
                    : "0";

                if (monthsSustainedCount > 0) {
                  return (
                    <Badge
                      key={monthsSustained}
                      variant="outline"
                      className="px-2 py-1"
                    >
                      {getMonthsSustainedDisplayName(monthsSustained)}:{" "}
                      {percentage}%
                    </Badge>
                  );
                }
                return null;
              })}
            </div>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
