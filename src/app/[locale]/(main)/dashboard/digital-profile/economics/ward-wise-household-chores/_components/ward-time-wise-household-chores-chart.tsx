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
import { timeSpentLabels } from "@/server/api/routers/profile/economics/ward-time-wise-household-chores.schema";

interface WardTimeWiseHouseholdChoresData {
  id: string;
  wardNumber: number;
  timeSpent: string;
  population: number;
}

interface WardTimeWiseHouseholdChoresChartProps {
  data: WardTimeWiseHouseholdChoresData[];
}

export default function WardTimeWiseHouseholdChoresChart({
  data,
}: WardTimeWiseHouseholdChoresChartProps) {
  const [selectedWard, setSelectedWard] = useState<string>("all");
  const [chartView, setChartView] = useState<string>("byTimeSpent");

  // Helper function to get time spent display names
  const getTimeSpentDisplayName = (timeSpent: string): string => {
    return (
      timeSpentLabels[timeSpent as keyof typeof timeSpentLabels] || timeSpent
    );
  };

  // Get unique wards
  const uniqueWards = useMemo(() => {
    return Array.from(
      new Set(data.map((item) => item.wardNumber.toString())),
    ).sort((a, b) => parseInt(a) - parseInt(b));
  }, [data]);

  // Get unique time spent categories
  const uniqueTimeSpent = useMemo(() => {
    return Array.from(new Set(data.map((item) => item.timeSpent))).sort();
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
    // Group by time spent for all wards or a specific ward
    if (chartView === "byTimeSpent") {
      return uniqueTimeSpent.map((timeSpent) => {
        const timeSpentItems = filteredData.filter(
          (item) => item.timeSpent === timeSpent,
        );

        // Create an object with time spent as key and population
        return {
          timeSpent: getTimeSpentDisplayName(timeSpent),
          population: timeSpentItems.reduce(
            (sum, item) => sum + (item.population || 0),
            0,
          ),
        };
      });
    }
    // Group by ward for all time spent categories
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

          // Add each time spent category as a property
          uniqueTimeSpent.forEach((timeSpent) => {
            const timeSpentItems = wardItems.filter(
              (item) => item.timeSpent === timeSpent,
            );
            dataPoint[getTimeSpentDisplayName(timeSpent)] =
              timeSpentItems.reduce(
                (sum, item) => sum + (item.population || 0),
                0,
              );
          });

          return dataPoint;
        });
    }
  }, [filteredData, uniqueTimeSpent, uniqueWards, chartView, selectedWard]);

  // Get chart keys based on the chartView
  const chartKeys = useMemo(() => {
    if (chartView === "byTimeSpent") {
      return ["population"];
    } else {
      return uniqueTimeSpent.map((timeSpent) =>
        getTimeSpentDisplayName(timeSpent),
      );
    }
  }, [chartView, uniqueTimeSpent]);

  // Prepare pie chart data
  const pieChartData = useMemo(() => {
    if (chartView === "byTimeSpent") {
      // Create pie data grouped by time spent categories
      return uniqueTimeSpent
        .map((timeSpent, index) => {
          const timeSpentData = filteredData.filter(
            (item) => item.timeSpent === timeSpent,
          );
          const total = timeSpentData.reduce(
            (sum, item) => sum + (item.population || 0),
            0,
          );

          return {
            id: getTimeSpentDisplayName(timeSpent),
            label: getTimeSpentDisplayName(timeSpent),
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
            (sum, item) => sum + (item.population || 0),
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
  }, [filteredData, uniqueTimeSpent, uniqueWards, chartView, selectedWard]);

  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">
          कुनै डाटा उपलब्ध छैन। पहिले वडा अनुसार घरायसी कामको समय विवरण डाटा
          थप्नुहोस्।
        </p>
      </div>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>वडा अनुसार घरायसी कामको समय विवरण विश्लेषण</CardTitle>
        <CardDescription>
          वडा र समय अनुसार घरायसी कामको विवरण डाटा हेर्नुहोस्
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
                <SelectItem value="byTimeSpent">समय अनुसार</SelectItem>
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
                indexBy={chartView === "byTimeSpent" ? "timeSpent" : "ward"}
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
                  legend: chartView === "byTimeSpent" ? "समय श्रेणी" : "वडाहरू",
                  legendPosition: "middle",
                  legendOffset: 50,
                  truncateTickAt: 0,
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
              कुल जनसंख्या
            </div>
            <div className="text-2xl font-bold">
              {filteredData
                .reduce((sum, item) => sum + item.population, 0)
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
              समय श्रेणी अनुसार वितरण
            </div>
            <div className="flex flex-wrap gap-2 mt-1">
              {uniqueTimeSpent.map((timeSpent) => {
                const timeSpentCount = filteredData
                  .filter((item) => item.timeSpent === timeSpent)
                  .reduce((sum, item) => sum + item.population, 0);
                const totalCount = filteredData.reduce(
                  (sum, item) => sum + item.population,
                  0,
                );
                const percentage =
                  totalCount > 0
                    ? ((timeSpentCount / totalCount) * 100).toFixed(1)
                    : "0";

                if (timeSpentCount > 0) {
                  return (
                    <Badge
                      key={timeSpent}
                      variant="outline"
                      className="px-2 py-1"
                    >
                      {getTimeSpentDisplayName(timeSpent)}: {percentage}%
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
