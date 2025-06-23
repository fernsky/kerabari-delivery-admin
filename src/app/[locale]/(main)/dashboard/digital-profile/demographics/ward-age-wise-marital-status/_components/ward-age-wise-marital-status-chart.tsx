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
import {
  AgeGroupEnum,
  MaritalStatusEnum,
  getAgeGroupDisplayName,
  getMaritalStatusDisplayName,
} from "@/server/api/routers/profile/demographics/ward-age-wise-marital-status.schema";

interface AgeWiseMaritalStatusData {
  id: string;
  wardNumber: number;
  ageGroup: string;
  maritalStatus: string;
  population: number;
  malePopulation?: number | null;
  femalePopulation?: number | null;
  otherPopulation?: number | null;
}

interface AgeWiseMaritalStatusChartProps {
  data: AgeWiseMaritalStatusData[];
}

export default function AgeWiseMaritalStatusChart({
  data,
}: AgeWiseMaritalStatusChartProps) {
  const [selectedWard, setSelectedWard] = useState<string>("all");
  const [selectedView, setSelectedView] = useState<string>("maritalStatus");

  // Get unique wards
  const uniqueWards = useMemo(() => {
    return Array.from(new Set(data.map((item) => item.wardNumber))).sort(
      (a, b) => a - b,
    );
  }, [data]);

  // Filter by selected ward
  const filteredData = useMemo(() => {
    if (selectedWard === "all") return data;
    return data.filter((item) => item.wardNumber === parseInt(selectedWard));
  }, [data, selectedWard]);

  // Prepare chart data based on selected view
  const chartData = useMemo(() => {
    if (selectedView === "maritalStatus") {
      // Group by marital status
      const statusGroups = Object.values(MaritalStatusEnum._def.values).reduce(
        (acc, status) => {
          acc[status] = {
            id: status,
            label: getMaritalStatusDisplayName(status as any),
            value: 0,
            maleValue: 0,
            femaleValue: 0,
            otherValue: 0,
          };
          return acc;
        },
        {} as Record<
          string,
          {
            id: string;
            label: string;
            value: number;
            maleValue: number;
            femaleValue: number;
            otherValue: number;
          }
        >,
      );

      // Sum up values for each marital status
      filteredData.forEach((item) => {
        if (item.maritalStatus && statusGroups[item.maritalStatus]) {
          statusGroups[item.maritalStatus].value += item.population || 0;
          statusGroups[item.maritalStatus].maleValue +=
            item.malePopulation || 0;
          statusGroups[item.maritalStatus].femaleValue +=
            item.femalePopulation || 0;
          statusGroups[item.maritalStatus].otherValue +=
            item.otherPopulation || 0;
        }
      });

      // Convert to array and sort by value
      return Object.values(statusGroups)
        .filter((status) => status.value > 0)
        .sort((a, b) => b.value - a.value);
    } else {
      // Group by age group
      const ageGroups = Object.values(AgeGroupEnum._def.values).reduce(
        (acc, age) => {
          acc[age] = {
            id: age,
            label: getAgeGroupDisplayName(age as any),
            value: 0,
            maleValue: 0,
            femaleValue: 0,
            otherValue: 0,
          };
          return acc;
        },
        {} as Record<
          string,
          {
            id: string;
            label: string;
            value: number;
            maleValue: number;
            femaleValue: number;
            otherValue: number;
          }
        >,
      );

      // Sum up values for each age group
      filteredData.forEach((item) => {
        if (item.ageGroup && ageGroups[item.ageGroup]) {
          ageGroups[item.ageGroup].value += item.population || 0;
          ageGroups[item.ageGroup].maleValue += item.malePopulation || 0;
          ageGroups[item.ageGroup].femaleValue += item.femalePopulation || 0;
          ageGroups[item.ageGroup].otherValue += item.otherPopulation || 0;
        }
      });

      // Convert to array and sort by age group order
      return Object.values(ageGroups).filter((age) => age.value > 0);
    }
  }, [filteredData, selectedView]);

  // Prepare data for Bar chart
  const barChartData = useMemo(() => {
    return chartData.map((item, index) => {
      const hue = (index * 137.5) % 360;
      return {
        category: item.label,
        जम्मा: item.value,
        पुरुष: item.maleValue,
        महिला: item.femaleValue,
        अन्य: item.otherValue,
        color: `hsl(${hue}, 70%, 50%)`,
      };
    });
  }, [chartData]);

  // Prepare data for Pie chart
  const pieChartData = useMemo(() => {
    return chartData.map((item, index) => {
      const hue = (index * 137.5) % 360;
      return {
        id: item.label,
        label: item.label,
        value: item.value,
        color: `hsl(${hue}, 70%, 50%)`,
      };
    });
  }, [chartData]);

  // Get total population
  const totalPopulation = useMemo(() => {
    return filteredData.reduce((sum, item) => sum + (item.population || 0), 0);
  }, [filteredData]);

  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">
          कुनै डाटा उपलब्ध छैन। पहिले वडा वैवाहिक स्थिति डाटा थप्नुहोस्।
        </p>
      </div>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>वडा अनुसार उमेर र वैवाहिक स्थितिको विश्लेषण</CardTitle>
        <CardDescription>
          वडा, उमेर समूह र वैवाहिक स्थिति अनुसार जनसंख्या डाटा हेर्नुहोस्
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
                {uniqueWards.map((ward) => (
                  <SelectItem key={ward} value={ward.toString()}>
                    वडा {ward}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">
              श्रेणी चयन गर्नुहोस्:
            </label>
            <Select value={selectedView} onValueChange={setSelectedView}>
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="श्रेणी चयन गर्नुहोस्" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="maritalStatus">
                  वैवाहिक स्थिति अनुसार
                </SelectItem>
                <SelectItem value="ageGroup">उमेर समूह अनुसार</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="text-sm mt-2">
          जम्मा जनसंख्या: <strong>{totalPopulation.toLocaleString()}</strong>
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
                keys={["पुरुष", "महिला", "अन्य"]}
                indexBy="category"
                margin={{ top: 50, right: 130, bottom: 100, left: 60 }}
                padding={0.3}
                groupMode="grouped"
                valueScale={{ type: "linear" }}
                indexScale={{ type: "band", round: true }}
                colors={["#2563eb", "#db2777", "#65a30d"]}
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
                    selectedView === "maritalStatus"
                      ? "वैवाहिक स्थिति"
                      : "उमेर समूह",
                  legendPosition: "middle",
                  legendOffset: 80,
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
                margin={{ top: 40, right: 80, bottom: 100, left: 80 }}
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
      </CardContent>
    </Card>
  );
}
