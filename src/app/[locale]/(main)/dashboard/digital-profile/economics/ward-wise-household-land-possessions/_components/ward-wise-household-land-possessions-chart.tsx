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

interface WardWiseHouseholdLandPossessionsData {
  id: string;
  wardNumber: number;
  households: number;
}

interface WardWiseHouseholdLandPossessionsChartProps {
  data: WardWiseHouseholdLandPossessionsData[];
}

export default function WardWiseHouseholdLandPossessionsChart({
  data,
}: WardWiseHouseholdLandPossessionsChartProps) {
  const [selectedView, setSelectedView] = useState<string>("all");

  // Get unique wards
  const uniqueWards = useMemo(() => {
    return Array.from(
      new Set(data.map((item) => item.wardNumber.toString())),
    ).sort((a, b) => parseInt(a) - parseInt(b));
  }, [data]);

  // Filter by selected view
  const filteredData = useMemo(() => {
    if (selectedView === "all") {
      return data;
    }
    return data.filter((item) => item.wardNumber.toString() === selectedView);
  }, [data, selectedView]);

  // Prepare bar chart data
  const barChartData = useMemo(() => {
    return uniqueWards
      .filter((ward) => selectedView === "all" || ward === selectedView)
      .map((ward) => {
        const wardItem = data.find(
          (item) => item.wardNumber.toString() === ward,
        );
        return {
          wardNumber: parseInt(ward),
          ward: `वडा ${ward}`,
          households: wardItem?.households || 0,
        };
      })
      .sort((a, b) => a.wardNumber - b.wardNumber);
  }, [data, uniqueWards, selectedView]);

  // Prepare pie chart data
  const pieChartData = useMemo(() => {
    return barChartData.map((item, index) => ({
      id: item.ward,
      label: item.ward,
      value: item.households,
      color: `hsl(${index * 40}, 70%, 50%)`,
    }));
  }, [barChartData]);

  // Calculate total households
  const totalHouseholds = useMemo(() => {
    return filteredData.reduce((sum, item) => sum + (item.households || 0), 0);
  }, [filteredData]);

  // Calculate average households per ward
  const averageHouseholds = useMemo(() => {
    if (filteredData.length === 0) return 0;
    return totalHouseholds / filteredData.length;
  }, [filteredData, totalHouseholds]);

  // Find ward with highest households
  const highestHouseholdsWard = useMemo(() => {
    if (filteredData.length === 0) return null;
    const highest = [...filteredData].sort(
      (a, b) => b.households - a.households,
    )[0];
    return {
      wardNumber: highest.wardNumber,
      households: highest.households,
    };
  }, [filteredData]);

  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">
          कुनै डाटा उपलब्ध छैन। पहिले वडा अनुसार घरधुरी जग्गा स्वामित्व डाटा
          थप्नुहोस्।
        </p>
      </div>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>वडा अनुसार घरधुरी जग्गा स्वामित्व विश्लेषण</CardTitle>
        <CardDescription>
          वडा अनुसार जग्गा भएका घरधुरी डाटा हेर्नुहोस्
        </CardDescription>

        <div className="flex flex-wrap gap-4 mt-4">
          <div>
            <label className="text-sm font-medium mb-1 block">
              वडा चयन गर्नुहोस्:
            </label>
            <Select value={selectedView} onValueChange={setSelectedView}>
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
                keys={["households"]}
                indexBy="ward"
                margin={{ top: 50, right: 130, bottom: 80, left: 60 }}
                padding={0.3}
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
                  legend: "वडा",
                  legendPosition: "middle",
                  legendOffset: 50,
                  truncateTickAt: 0,
                }}
                axisLeft={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: "जग्गा भएका घरधुरी संख्या",
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
              कुल जग्गा भएका घरधुरी संख्या
            </div>
            <div className="text-2xl font-bold">
              {totalHouseholds.toLocaleString()}
            </div>
          </Card>

          <Card className="p-4">
            <div className="text-sm font-medium text-muted-foreground mb-1">
              औसत घरधुरी प्रति वडा
            </div>
            <div className="text-2xl font-bold">
              {Math.round(averageHouseholds).toLocaleString()}
            </div>
          </Card>

          <Card className="p-4">
            <div className="text-sm font-medium text-muted-foreground mb-1">
              सबैभन्दा बढी घरधुरी भएको वडा
            </div>
            <div className="text-2xl font-bold flex items-center gap-2">
              {highestHouseholdsWard ? (
                <>
                  <Badge variant="outline" className="text-lg h-8 px-2">
                    {highestHouseholdsWard.wardNumber}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    ({highestHouseholdsWard.households.toLocaleString()} घरधुरी)
                  </span>
                </>
              ) : (
                "-"
              )}
            </div>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
