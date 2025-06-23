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

interface WardWiseHouseholdsOnLoanData {
  id: string;
  wardNumber: number;
  households: number;
}

interface WardWiseHouseholdsOnLoanChartProps {
  data: WardWiseHouseholdsOnLoanData[];
}

export default function WardWiseHouseholdsOnLoanChart({
  data,
}: WardWiseHouseholdsOnLoanChartProps) {
  const [selectedWard, setSelectedWard] = useState<string>("all");
  const [chartView, setChartView] = useState<string>("distribution");

  // Get unique wards
  const uniqueWards = useMemo(() => {
    return Array.from(
      new Set(data.map((item) => item.wardNumber.toString())),
    ).sort((a, b) => parseInt(a) - parseInt(b));
  }, [data]);

  // Get ward numbers for display
  const wardIdToNumber = useMemo(() => {
    return data.reduce(
      (acc, item) => {
        if (item.wardNumber) {
          acc[item.wardNumber.toString()] = item.wardNumber;
        }
        return acc;
      },
      {} as Record<string, number>,
    );
  }, [data]);

  // Filter by selected ward
  const filteredData = useMemo(() => {
    if (selectedWard === "all") {
      return data;
    }
    return data.filter((item) => item.wardNumber.toString() === selectedWard);
  }, [data, selectedWard]);

  // Prepare bar chart data
  const barChartData = useMemo(() => {
    return data
      .filter(
        (item) =>
          selectedWard === "all" || item.wardNumber.toString() === selectedWard,
      )
      .map((item) => ({
        ward: `वडा ${item.wardNumber}`,
        households: item.households || 0,
        householdsColor: `hsl(215, 70%, 50%)`,
      }))
      .sort((a, b) => {
        const aNum = parseInt(a.ward.replace(/\D/g, ""));
        const bNum = parseInt(b.ward.replace(/\D/g, ""));
        return aNum - bNum;
      });
  }, [data, selectedWard]);

  // Prepare pie chart data for distribution
  const pieChartData = useMemo(() => {
    if (selectedWard !== "all") {
      // Just show selected ward data
      const selectedWardData = data.find(
        (item) => item.wardNumber.toString() === selectedWard,
      );
      if (!selectedWardData) return [];

      // Show pie with households on loan vs total (we don't have total, so approximating)
      // This is just an example - in real app, you might want to get actual total households data
      const estimatedTotal = Math.max(selectedWardData.households * 2, 100);
      return [
        {
          id: "छ",
          label: "ऋण लिएका घरधुरीहरू",
          value: selectedWardData.households,
          color: "hsl(215, 70%, 50%)",
        },
        {
          id: "छैन",
          label: "ऋण नलिएका घरधुरीहरू",
          value: estimatedTotal - selectedWardData.households,
          color: "hsl(45, 70%, 50%)",
        },
      ];
    } else {
      // Show distribution across wards
      return data.map((item, index) => ({
        id: `वडा ${item.wardNumber}`,
        label: `वडा ${item.wardNumber}`,
        value: item.households || 0,
        color: `hsl(${index * 25}, 70%, 50%)`,
      }));
    }
  }, [data, selectedWard]);

  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">
          कुनै डाटा उपलब्ध छैन। पहिले वडा अनुसार ऋण लिएका घरधुरी डाटा थप्नुहोस्।
        </p>
      </div>
    );
  }

  // Calculate total households on loan
  const totalHouseholds = filteredData.reduce(
    (sum, item) => sum + (item.households || 0),
    0,
  );

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>वडा अनुसार ऋण लिएका घरधुरी विश्लेषण</CardTitle>
        <CardDescription>
          वडा अनुसार ऋण लिएका घरधुरीहरुको संख्या हेर्नुहोस्
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
                keys={["households"]}
                indexBy="ward"
                margin={{ top: 50, right: 130, bottom: 80, left: 60 }}
                padding={0.3}
                valueScale={{ type: "linear" }}
                indexScale={{ type: "band", round: true }}
                colors={{ scheme: "blues" }}
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
              कुल ऋण लिएका घरधुरी संख्या
            </div>
            <div className="text-2xl font-bold">
              {totalHouseholds.toLocaleString()}
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
              औसत प्रति वडा
            </div>
            <div className="text-2xl font-bold">
              {selectedWard === "all" && uniqueWards.length > 0
                ? Math.round(
                    totalHouseholds / uniqueWards.length,
                  ).toLocaleString()
                : totalHouseholds.toLocaleString()}
            </div>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
