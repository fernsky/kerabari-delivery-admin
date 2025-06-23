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

// Updated interface to match schema
interface WardWiseTrainedPopulationData {
  id: string;
  wardNumber: number;
  trainedPopulation: number;
}

interface WardWiseTrainedPopulationChartProps {
  data: WardWiseTrainedPopulationData[];
}

export default function WardWiseTrainedPopulationChart({
  data,
}: WardWiseTrainedPopulationChartProps) {
  const [selectedWard, setSelectedWard] = useState<string>("all");

  // Get unique wards
  const uniqueWards = useMemo(() => {
    return Array.from(
      new Set(data.map((item) => item.wardNumber.toString())),
    ).sort((a, b) => parseInt(a) - parseInt(b));
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

  // Calculate total trained population
  const totalTrainedPopulation = useMemo(() => {
    return filteredData.reduce(
      (sum, item) => sum + (item.trainedPopulation || 0),
      0,
    );
  }, [filteredData]);

  // Prepare bar chart data
  const barChartData = useMemo(() => {
    return data
      .filter(
        (item) =>
          selectedWard === "all" || item.wardNumber.toString() === selectedWard,
      )
      .sort((a, b) => a.wardNumber - b.wardNumber)
      .map((item) => ({
        ward: `वडा ${item.wardNumber}`,
        जनसंख्या: item.trainedPopulation,
        wardNumber: item.wardNumber,
      }));
  }, [data, selectedWard]);

  // Prepare pie chart data
  const pieChartData = useMemo(() => {
    return data
      .filter(
        (item) =>
          selectedWard === "all" || item.wardNumber.toString() === selectedWard,
      )
      .map((item, index) => ({
        id: `वडा ${item.wardNumber}`,
        label: `वडा ${item.wardNumber}`,
        value: item.trainedPopulation,
        color: `hsl(${index * 25}, 70%, 50%)`,
      }))
      .sort((a, b) => b.value - a.value);
  }, [data, selectedWard]);

  // Calculate ward with highest trained population
  const highestTrainedPopulationWard = useMemo(() => {
    if (data.length === 0) return null;

    return data.reduce(
      (max, item) =>
        item.trainedPopulation > (max?.trainedPopulation || 0) ? item : max,
      data[0],
    );
  }, [data]);

  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">
          कुनै डाटा उपलब्ध छैन। पहिले वडा अनुसार तालिम प्राप्त जनसंख्या डाटा
          थप्नुहोस्।
        </p>
      </div>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>वडा अनुसार तालिम प्राप्त जनसंख्या विश्लेषण</CardTitle>
        <CardDescription>
          वडा अनुसार तालिम प्राप्त जनसंख्याको अनुपात हेर्नुहोस्
        </CardDescription>

        <div className="flex flex-wrap gap-4 mt-4">
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
                {uniqueWards.map((wardNumber) => (
                  <SelectItem key={wardNumber} value={wardNumber}>
                    वडा {wardNumber}
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
                keys={["जनसंख्या"]}
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
                  legendOffset: 60,
                  truncateTickAt: 0,
                }}
                axisLeft={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: "तालिम प्राप्त जनसंख्या",
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
                    {datum.label}: {datum.value} जना
                    {totalTrainedPopulation > 0 && (
                      <div>
                        {((datum.value / totalTrainedPopulation) * 100).toFixed(
                          1,
                        )}
                        %
                      </div>
                    )}
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
                    itemWidth: 80,
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
              कुल तालिम प्राप्त जनसंख्या
            </div>
            <div className="text-2xl font-bold">
              {totalTrainedPopulation.toLocaleString()}
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
              सबैभन्दा बढी तालिम प्राप्त वडा
            </div>
            {highestTrainedPopulationWard && (
              <div className="flex flex-col">
                <div className="text-2xl font-bold">
                  वडा {highestTrainedPopulationWard.wardNumber}
                </div>
                <div className="text-sm mt-1">
                  {highestTrainedPopulationWard.trainedPopulation.toLocaleString()}{" "}
                  जना
                </div>
              </div>
            )}
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
