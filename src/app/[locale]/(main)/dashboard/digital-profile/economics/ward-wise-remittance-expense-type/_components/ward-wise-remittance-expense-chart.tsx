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
import { type RemittanceExpenseType } from "@/server/api/routers/profile/economics/ward-wise-remittance-expenses.schema";

interface WardWiseRemittanceExpenseData {
  id: string;
  wardNumber: number;
  remittanceExpense: RemittanceExpenseType;
  households: number;
  percentage?: number;
}

interface WardWiseRemittanceExpenseChartProps {
  data: WardWiseRemittanceExpenseData[];
}

export default function WardWiseRemittanceExpenseChart({
  data,
}: WardWiseRemittanceExpenseChartProps) {
  const [selectedWard, setSelectedWard] = useState<string>("all");
  const [selectedExpenseType, setSelectedExpenseType] = useState<string>("all");
  const [chartView, setChartView] = useState<string>("byWard"); // 'byWard' or 'byExpenseType'

  // Get unique wards
  const uniqueWards = useMemo(() => {
    return Array.from(
      new Set(data.map((item) => String(item.wardNumber))),
    ).sort((a, b) => parseInt(a) - parseInt(b));
  }, [data]);

  // Get unique expense types
  const uniqueExpenseTypes = useMemo(() => {
    return Array.from(
      new Set(data.map((item) => item.remittanceExpense)),
    ).sort();
  }, [data]);

  // Filter by selected ward and expense type
  const filteredData = useMemo(() => {
    let result = [...data];

    if (selectedWard !== "all") {
      result = result.filter(
        (item) => String(item.wardNumber) === selectedWard,
      );
    }

    if (selectedExpenseType !== "all") {
      result = result.filter(
        (item) => item.remittanceExpense === selectedExpenseType,
      );
    }

    return result;
  }, [data, selectedWard, selectedExpenseType]);

  // Get top 5 expense types by households
  const topExpenseTypes = useMemo(() => {
    const expenseTypeTotals = filteredData.reduce(
      (acc, item) => {
        if (!acc[item.remittanceExpense]) {
          acc[item.remittanceExpense] = 0;
        }
        acc[item.remittanceExpense] += item.households;
        return acc;
      },
      {} as Record<string, number>,
    );

    return Object.entries(expenseTypeTotals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([expenseType]) => expenseType);
  }, [filteredData]);

  // Prepare bar chart data based on the chartView
  const barChartData = useMemo(() => {
    if (chartView === "byWard") {
      // Group by ward
      return uniqueWards
        .filter((ward) => selectedWard === "all" || ward === selectedWard)
        .map((ward) => {
          const wardItems = filteredData.filter(
            (item) => String(item.wardNumber) === ward,
          );

          // Create an object with ward as key and expense type households
          const dataPoint: Record<string, any> = {
            ward: `वडा ${ward}`,
          };

          // If expense type filter is applied, just show that expense type
          if (selectedExpenseType !== "all") {
            const expenseTypeItem = wardItems.find(
              (item) => item.remittanceExpense === selectedExpenseType,
            );
            dataPoint[selectedExpenseType] = expenseTypeItem?.households || 0;
          } else {
            // Otherwise show top 5 expense types
            topExpenseTypes.forEach((expenseType) => {
              const expenseTypeItem = wardItems.find(
                (item) => item.remittanceExpense === expenseType,
              );
              dataPoint[expenseType] = expenseTypeItem?.households || 0;
            });
          }

          return dataPoint;
        });
    } else {
      // Group by expense type
      return uniqueExpenseTypes
        .filter(
          (expenseType) =>
            selectedExpenseType === "all" ||
            expenseType === selectedExpenseType,
        )
        .slice(0, 10) // Limit to top 10 expense types for readability
        .map((expenseType) => {
          const expenseTypeItems = filteredData.filter(
            (item) => item.remittanceExpense === expenseType,
          );

          // Create an object with expense type as key and ward households
          const dataPoint: Record<string, any> = {
            expenseType,
          };

          if (selectedWard !== "all") {
            const wardItem = expenseTypeItems.find(
              (item) => String(item.wardNumber) === selectedWard,
            );
            dataPoint[`वडा ${selectedWard}`] = wardItem?.households || 0;
          } else {
            // Show households for all wards
            uniqueWards.slice(0, 8).forEach((ward) => {
              // Limit to 8 wards for readability
              const wardItem = expenseTypeItems.find(
                (item) => String(item.wardNumber) === ward,
              );
              dataPoint[`वडा ${ward}`] = wardItem?.households || 0;
            });
          }

          return dataPoint;
        });
    }
  }, [
    filteredData,
    uniqueWards,
    uniqueExpenseTypes,
    chartView,
    selectedWard,
    selectedExpenseType,
    topExpenseTypes,
  ]);

  // Get chart keys based on the chartView
  const chartKeys = useMemo(() => {
    if (chartView === "byWard") {
      return selectedExpenseType !== "all"
        ? [selectedExpenseType]
        : topExpenseTypes;
    } else {
      return selectedWard !== "all"
        ? [`वडा ${selectedWard}`]
        : uniqueWards
            .slice(0, 8) // Limit to 8 wards for readability
            .map((ward) => `वडा ${ward}`);
    }
  }, [
    chartView,
    selectedExpenseType,
    topExpenseTypes,
    selectedWard,
    uniqueWards,
  ]);

  // Prepare pie chart data
  const pieChartData = useMemo(() => {
    if (selectedWard !== "all" && chartView === "byWard") {
      // Show expense type distribution for a specific ward
      const wardData = filteredData.filter(
        (item) => String(item.wardNumber) === selectedWard,
      );

      const totalWardHouseholds = wardData.reduce(
        (sum, item) => sum + item.households,
        0,
      );

      return wardData
        .map((item, index) => ({
          id: item.remittanceExpense,
          label: item.remittanceExpense,
          value: item.households,
          percentage:
            totalWardHouseholds > 0
              ? ((item.households / totalWardHouseholds) * 100).toFixed(1)
              : "0",
          color: `hsl(${index * 25}, 70%, 50%)`,
        }))
        .sort((a, b) => b.value - a.value);
    } else if (selectedExpenseType !== "all" && chartView === "byExpenseType") {
      // Show ward distribution for a specific expense type
      const expenseTypeData = filteredData.filter(
        (item) => item.remittanceExpense === selectedExpenseType,
      );

      return expenseTypeData
        .map((item, index) => ({
          id: `वडा ${item.wardNumber}`,
          label: `वडा ${item.wardNumber}`,
          value: item.households,
          color: `hsl(${index * 25}, 70%, 50%)`,
        }))
        .sort((a, b) => b.value - a.value);
    } else {
      // Show top expense types across all filtered data
      const expenseTypeTotals = filteredData.reduce(
        (acc, item) => {
          if (!acc[item.remittanceExpense]) {
            acc[item.remittanceExpense] = 0;
          }
          acc[item.remittanceExpense] += item.households;
          return acc;
        },
        {} as Record<string, number>,
      );

      const totalHouseholds = Object.values(expenseTypeTotals).reduce(
        (sum, value) => sum + value,
        0,
      );

      return Object.entries(expenseTypeTotals)
        .map(([expenseType, households], index) => ({
          id: expenseType,
          label: expenseType,
          value: households,
          percentage:
            totalHouseholds > 0
              ? ((households / totalHouseholds) * 100).toFixed(1)
              : "0",
          color: `hsl(${index * 25}, 70%, 50%)`,
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 8); // Limit to top 8 for readability
    }
  }, [filteredData, selectedWard, selectedExpenseType, chartView]);

  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">
          कुनै डाटा उपलब्ध छैन। पहिले वडा अनुसार रेमिट्यान्स खर्च प्रकार डाटा
          थप्नुहोस्।
        </p>
      </div>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>वडा अनुसार रेमिट्यान्स खर्च प्रकार विश्लेषण</CardTitle>
        <CardDescription>
          वडा अनुसार रेमिट्यान्स खर्च प्रकारको अनुपात हेर्नुहोस्
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
                <SelectItem value="byExpenseType">
                  खर्च प्रकार अनुसार
                </SelectItem>
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
                    वडा {wardId}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">
              खर्च प्रकार चयन गर्नुहोस्:
            </label>
            <Select
              value={selectedExpenseType}
              onValueChange={setSelectedExpenseType}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="खर्च प्रकार चयन गर्नुहोस्" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">सबै खर्च प्रकार</SelectItem>
                {uniqueExpenseTypes.map((expenseType) => (
                  <SelectItem key={expenseType} value={expenseType}>
                    {expenseType}
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
                indexBy={chartView === "byWard" ? "ward" : "expenseType"}
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
                  legend: chartView === "byWard" ? "वडा" : "खर्च प्रकार",
                  legendPosition: "middle",
                  legendOffset: 60,
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
                tooltip={({ datum }) => (
                  <div
                    style={{
                      background: "white",
                      padding: "9px 12px",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                    }}
                  >
                    {datum.label}: {datum.value}{" "}
                    {"percentage" in datum.data &&
                      `(${datum.data.percentage}%)`}
                  </div>
                )}
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
              {selectedExpenseType === "all"
                ? "मुख्य खर्च प्रकार"
                : selectedExpenseType}
            </div>
            <div className="flex flex-wrap gap-2 mt-1">
              {selectedExpenseType === "all" && topExpenseTypes.length > 0 && (
                <Badge variant="outline" className="px-2 py-1">
                  {topExpenseTypes[0]}
                </Badge>
              )}
              {selectedExpenseType !== "all" && (
                <div className="text-2xl font-bold">
                  {filteredData
                    .reduce((sum, item) => sum + item.households, 0)
                    .toLocaleString()}
                </div>
              )}
            </div>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
