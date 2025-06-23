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
import { loanUseLabels } from "@/server/api/routers/profile/economics/ward-wise-households-loan-use.schema";

interface WardWiseHouseholdsLoanUseData {
  id: string;
  wardNumber: number;
  loanUse: string;
  households: number;
}

interface WardWiseHouseholdsLoanUseChartProps {
  data: WardWiseHouseholdsLoanUseData[];
}

// Helper function to get loan use display name
const getLoanUseDisplayName = (loanUse: string): string => {
  return loanUseLabels[loanUse as keyof typeof loanUseLabels] || loanUse;
};

export default function WardWiseHouseholdsLoanUseChart({
  data,
}: WardWiseHouseholdsLoanUseChartProps) {
  const [selectedWard, setSelectedWard] = useState<string>("all");
  const [chartView, setChartView] = useState<string>("byWard"); // 'byWard' or 'byLoanUse'

  // Get unique wards
  const uniqueWards = useMemo(() => {
    return Array.from(
      new Set(data.map((item) => item.wardNumber.toString())),
    ).sort((a, b) => parseInt(a) - parseInt(b));
  }, [data]);

  // Get unique loan uses
  const uniqueLoanUses = useMemo(() => {
    return Array.from(new Set(data.map((item) => item.loanUse))).sort();
  }, [data]);

  // Filter by selected ward
  const filteredData = useMemo(() => {
    if (selectedWard === "all") {
      return data;
    }
    return data.filter((item) => item.wardNumber.toString() === selectedWard);
  }, [data, selectedWard]);

  // Prepare bar chart data based on the chartView
  const barChartData = useMemo(() => {
    if (chartView === "byWard") {
      // Group by ward
      return uniqueWards
        .filter((ward) => selectedWard === "all" || ward === selectedWard)
        .map((ward) => {
          const wardItems = filteredData.filter(
            (item) => item.wardNumber.toString() === ward,
          );

          // Create an object with ward as key and loan use households
          const dataPoint: Record<string, any> = {
            ward: `वडा ${ward}`,
            wardNumber: parseInt(ward),
          };

          uniqueLoanUses.forEach((loanUse) => {
            const loanUseItem = wardItems.find(
              (item) => item.loanUse === loanUse,
            );
            dataPoint[getLoanUseDisplayName(loanUse)] =
              loanUseItem?.households || 0;
          });

          return dataPoint;
        });
    } else {
      // Group by loan use
      return uniqueLoanUses.map((loanUse) => {
        const loanUseItems = filteredData.filter(
          (item) => item.loanUse === loanUse,
        );

        // Create an object with loan use as key
        const dataPoint: Record<string, any> = {
          loanUse: getLoanUseDisplayName(loanUse),
        };

        if (selectedWard !== "all") {
          // If a specific ward is selected, just show that ward
          const wardItem = loanUseItems.find(
            (item) => item.wardNumber.toString() === selectedWard,
          );
          dataPoint[`वडा ${selectedWard}`] = wardItem?.households || 0;
        } else {
          // Otherwise show total across all wards
          dataPoint["कुल घरधुरी"] = loanUseItems.reduce(
            (sum, item) => sum + (item.households || 0),
            0,
          );
        }

        return dataPoint;
      });
    }
  }, [filteredData, uniqueLoanUses, uniqueWards, chartView, selectedWard]);

  // Get chart keys based on the chartView
  const chartKeys = useMemo(() => {
    if (chartView === "byWard") {
      return uniqueLoanUses.map((loanUse) => getLoanUseDisplayName(loanUse));
    } else {
      if (selectedWard !== "all") {
        return [`वडा ${selectedWard}`];
      } else {
        return ["कुल घरधुरी"];
      }
    }
  }, [chartView, uniqueLoanUses, selectedWard]);

  // Prepare pie chart data
  const pieChartData = useMemo(() => {
    if (chartView === "byWard" && selectedWard !== "all") {
      // Create pie data for a specific ward showing loan use distribution
      const wardItems = filteredData.filter(
        (item) => item.wardNumber.toString() === selectedWard,
      );

      return uniqueLoanUses
        .map((loanUse, index) => {
          const item = wardItems.find((item) => item.loanUse === loanUse);

          return {
            id: getLoanUseDisplayName(loanUse),
            label: getLoanUseDisplayName(loanUse),
            value: item?.households || 0,
            color: `hsl(${index * 40}, 70%, 50%)`,
          };
        })
        .filter((item) => item.value > 0);
    } else {
      // Create pie data showing total households by loan use across all wards
      return uniqueLoanUses
        .map((loanUse, index) => {
          const total = filteredData
            .filter((item) => item.loanUse === loanUse)
            .reduce((sum, item) => sum + (item.households || 0), 0);

          return {
            id: getLoanUseDisplayName(loanUse),
            label: getLoanUseDisplayName(loanUse),
            value: total,
            color: `hsl(${index * 40}, 70%, 50%)`,
          };
        })
        .filter((item) => item.value > 0);
    }
  }, [filteredData, uniqueLoanUses, chartView, selectedWard]);

  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">
          कुनै डाटा उपलब्ध छैन। पहिले वडा अनुसार ऋणको उपयोग डाटा थप्नुहोस्।
        </p>
      </div>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>वडा अनुसार ऋणको उपयोग विश्लेषण</CardTitle>
        <CardDescription>
          वडा र ऋणको उपयोग अनुसार घरधुरी डाटा हेर्नुहोस्
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
                <SelectItem value="byWard">वडा अनुसार</SelectItem>
                <SelectItem value="byLoanUse">ऋणको उपयोग अनुसार</SelectItem>
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
                indexBy={chartView === "byWard" ? "ward" : "loanUse"}
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
                  legend: chartView === "byWard" ? "वडा" : "ऋणको उपयोग",
                  legendPosition: "middle",
                  legendOffset: 50,
                  truncateTickAt: 0,
                }}
                axisLeft={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: "घरधुरी संख्या",
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
              कुल घरधुरी संख्या
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
              मुख्य ऋणको उपयोगहरू
            </div>
            <div className="flex flex-wrap gap-2 mt-1">
              {uniqueLoanUses.map((loanUse) => {
                const loanUseCount = filteredData
                  .filter((item) => item.loanUse === loanUse)
                  .reduce((sum, item) => sum + item.households, 0);
                const totalCount = filteredData.reduce(
                  (sum, item) => sum + item.households,
                  0,
                );
                const percentage =
                  totalCount > 0
                    ? ((loanUseCount / totalCount) * 100).toFixed(1)
                    : "0";

                // Only show top 3 loan uses
                if (percentage === "0") return null;

                return (
                  <Badge key={loanUse} variant="outline" className="px-2 py-1">
                    {getLoanUseDisplayName(loanUse)}: {percentage}%
                  </Badge>
                );
              })}
            </div>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
