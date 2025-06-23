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
import { educationalLevelEnum } from "@/server/db/schema/profile/demographics/ward-wise-absentee-educational-level";

// Helper function to get display names for educational levels
const getEducationalLevelDisplay = (level: string): string => {
  const displayMap: Record<string, string> = {
    CHILD_DEVELOPMENT_CENTER: "बालविकास केन्द्र / मंटेस्वोरी",
    NURSERY: "नर्सरी/केजी",
    CLASS_1: "कक्षा १",
    CLASS_2: "कक्षा २",
    CLASS_3: "कक्षा ३",
    CLASS_4: "कक्षा ४",
    CLASS_5: "कक्षा ५",
    CLASS_6: "कक्षा ६",
    CLASS_7: "कक्षा ७",
    CLASS_8: "कक्षा ८",
    CLASS_9: "कक्षा ९",
    CLASS_10: "कक्षा १०",
    SLC_LEVEL: "एसईई/एसएलसी/सो सरह",
    CLASS_12_LEVEL: "कक्षा १२ वा PCL वा सो सरह",
    BACHELOR_LEVEL: "स्नातक वा सो सरह",
    MASTERS_LEVEL: "स्नातकोत्तर वा सो सरह",
    PHD_LEVEL: "पीएचडी वा सो सरह",
    OTHER: "अन्य",
    INFORMAL_EDUCATION: "अनौपचारिक शिक्षा",
    EDUCATED: "साक्षर",
    UNKNOWN: "थाहा नभएको",
  };

  return displayMap[level] || level;
};

interface WardWiseAbsenteeEducationalLevelData {
  id: string;
  wardNumber: number;
  educationalLevel: string;
  population: number;
}

interface WardWiseAbsenteeEducationalLevelChartProps {
  data: WardWiseAbsenteeEducationalLevelData[];
}

export default function WardWiseAbsenteeEducationalLevelChart({
  data,
}: WardWiseAbsenteeEducationalLevelChartProps) {
  const [selectedWard, setSelectedWard] = useState<string>("all");

  // Get unique wards
  const uniqueWards = useMemo(() => {
    return Array.from(new Set(data.map((item) => item.wardNumber))).sort(
      (a, b) => a - b,
    );
  }, [data]);

  // Get unique educational levels
  const uniqueEducationalLevels = useMemo(() => {
    return Array.from(
      new Set(data.map((item) => item.educationalLevel)),
    ).sort();
  }, [data]);

  // Filter by selected ward
  const filteredData = useMemo(() => {
    if (selectedWard === "all") return data;
    return data.filter((item) => item.wardNumber === parseInt(selectedWard));
  }, [data, selectedWard]);

  // Add display names to data
  const enhancedData = useMemo(() => {
    return filteredData.map((item) => ({
      ...item,
      educationalLevelDisplay: getEducationalLevelDisplay(
        item.educationalLevel,
      ),
    }));
  }, [filteredData]);

  // Group by ward and aggregate educational levels for bar chart
  const barChartData = useMemo(() => {
    if (selectedWard !== "all") {
      // For a single ward, show all educational levels
      return enhancedData
        .sort((a, b) => b.population - a.population)
        .map((item, index) => {
          // Generate consistent colors based on index
          const hue = (index * 137.5) % 360;
          return {
            educationLevel: getEducationalLevelDisplay(item.educationalLevel),
            population: item.population,
            color: `hsl(${hue}, 70%, 50%)`,
          };
        });
    } else {
      // For all wards, group by educational level instead of ward
      const levelGroups = uniqueEducationalLevels.reduce(
        (acc, level) => {
          acc[level] = {
            totalPopulation: 0,
            displayName: getEducationalLevelDisplay(level),
          };
          return acc;
        },
        {} as Record<string, { totalPopulation: number; displayName: string }>,
      );

      // Calculate total for each educational level
      enhancedData.forEach((item) => {
        if (item.educationalLevel) {
          levelGroups[item.educationalLevel].totalPopulation += item.population;
        }
      });

      // Create chart data from educational level groups
      return Object.keys(levelGroups)
        .map((level, index) => {
          const hue = (index * 137.5) % 360;
          return {
            educationLevel: levelGroups[level].displayName || level,
            population: levelGroups[level].totalPopulation,
            color: `hsl(${hue}, 70%, 50%)`,
          };
        })
        .sort((a, b) => b.population - a.population);
    }
  }, [enhancedData, selectedWard, uniqueEducationalLevels]);

  // Prepare pie chart data
  const pieChartData = useMemo(() => {
    const levelGroups = uniqueEducationalLevels
      .map((level) => {
        const levelData = enhancedData.filter(
          (item) => item.educationalLevel === level,
        );

        // Calculate total
        const total = levelData.reduce((sum, item) => sum + item.population, 0);
        const displayName = getEducationalLevelDisplay(level);

        return {
          id: displayName,
          label: displayName,
          value: total,
          color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`,
        };
      })
      .filter((item) => item.value > 0);

    // Sort by value for better visualization
    return levelGroups.sort((a, b) => b.value - a.value);
  }, [enhancedData, uniqueEducationalLevels]);

  // Get human-readable metric name
  const getMetricLabel = () => "अनुपस्थित जनसंख्या";

  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">
          कुनै डाटा उपलब्ध छैन। पहिले वडा अनुसार अनुपस्थित शैक्षिक स्तर डाटा
          थप्नुहोस्।
        </p>
      </div>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>वडा अनुसार अनुपस्थित शैक्षिक स्तर विश्लेषण</CardTitle>
        <CardDescription>
          वडा र शैक्षिक स्तर अनुसार अनुपस्थित जनसंख्या डाटा हेर्नुहोस्
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
                keys={["population"]}
                indexBy="educationLevel"
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
                  legend: "शैक्षिक स्तर",
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
      </CardContent>
    </Card>
  );
}
