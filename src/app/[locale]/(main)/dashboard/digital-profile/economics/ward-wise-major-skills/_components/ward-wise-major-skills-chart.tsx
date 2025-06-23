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
import { skillTypeEnum } from "@/server/api/routers/profile/economics/ward-wise-major-skills.schema";

interface WardWiseMajorSkillsData {
  id: string;
  wardNumber: number;
  skill: string;
  population: number;
}

interface WardWiseMajorSkillsChartProps {
  data: WardWiseMajorSkillsData[];
}

export default function WardWiseMajorSkillsChart({
  data,
}: WardWiseMajorSkillsChartProps) {
  const [selectedWard, setSelectedWard] = useState<string>("all");
  const [selectedSkill, setSelectedSkill] = useState<string>("all");
  const [chartView, setChartView] = useState<string>("byWard"); // 'byWard' or 'bySkill'

  // Get unique wards
  const uniqueWards = useMemo(() => {
    return Array.from(
      new Set(data.map((item) => item.wardNumber.toString())),
    ).sort((a, b) => parseInt(a) - parseInt(b));
  }, [data]);

  // Get unique skills
  const uniqueSkills = useMemo(() => {
    return Array.from(new Set(data.map((item) => item.skill))).sort();
  }, [data]);

  // Helper function to format skill name for display
  const formatSkillName = (skill: string) => {
    return skill
      .split("_")
      .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
      .join(" ");
  };

  // Filter by selected ward and skill
  const filteredData = useMemo(() => {
    let result = [...data];

    if (selectedWard !== "all") {
      result = result.filter(
        (item) => item.wardNumber.toString() === selectedWard,
      );
    }

    if (selectedSkill !== "all") {
      result = result.filter((item) => item.skill === selectedSkill);
    }

    return result;
  }, [data, selectedWard, selectedSkill]);

  // Get top 5 skills by population
  const topSkills = useMemo(() => {
    const skillTotals = filteredData.reduce(
      (acc, item) => {
        if (!acc[item.skill]) {
          acc[item.skill] = 0;
        }
        acc[item.skill] += item.population;
        return acc;
      },
      {} as Record<string, number>,
    );

    return Object.entries(skillTotals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([skill]) => skill);
  }, [filteredData]);

  // Prepare bar chart data based on the chartView
  const barChartData = useMemo(() => {
    if (chartView === "byWard") {
      // Group by ward
      return uniqueWards
        .filter((wardNum) => selectedWard === "all" || wardNum === selectedWard)
        .map((wardNum) => {
          const wardItems = filteredData.filter(
            (item) => item.wardNumber.toString() === wardNum,
          );

          // Create an object with ward as key and skill populations
          const dataPoint: Record<string, any> = {
            ward: `वडा ${wardNum}`,
          };

          // If skill filter is applied, just show that skill
          if (selectedSkill !== "all") {
            const skillItem = wardItems.find(
              (item) => item.skill === selectedSkill,
            );
            dataPoint[formatSkillName(selectedSkill)] =
              skillItem?.population || 0;
          } else {
            // Otherwise show top 5 skills
            topSkills.forEach((skill) => {
              const skillItem = wardItems.find((item) => item.skill === skill);
              dataPoint[formatSkillName(skill)] = skillItem?.population || 0;
            });
          }

          return dataPoint;
        });
    } else {
      // Group by skill
      return uniqueSkills
        .filter((skill) => selectedSkill === "all" || skill === selectedSkill)
        .slice(0, 10) // Limit to top 10 skills for readability
        .map((skill) => {
          const skillItems = filteredData.filter(
            (item) => item.skill === skill,
          );

          // Create an object with skill as key and ward populations
          const dataPoint: Record<string, any> = {
            skill: formatSkillName(skill),
          };

          if (selectedWard !== "all") {
            const wardItem = skillItems.find(
              (item) => item.wardNumber.toString() === selectedWard,
            );
            dataPoint[`वडा ${selectedWard}`] = wardItem?.population || 0;
          } else {
            // Show populations for all wards
            uniqueWards.slice(0, 8).forEach((wardNum) => {
              // Limit to 8 wards for readability
              const wardItem = skillItems.find(
                (item) => item.wardNumber.toString() === wardNum,
              );
              dataPoint[`वडा ${wardNum}`] = wardItem?.population || 0;
            });
          }

          return dataPoint;
        });
    }
  }, [
    filteredData,
    uniqueWards,
    uniqueSkills,
    chartView,
    selectedWard,
    selectedSkill,
    topSkills,
  ]);

  // Get chart keys based on the chartView
  const chartKeys = useMemo(() => {
    if (chartView === "byWard") {
      return selectedSkill !== "all"
        ? [formatSkillName(selectedSkill)]
        : topSkills.map((skill) => formatSkillName(skill));
    } else {
      return selectedWard !== "all"
        ? [`वडा ${selectedWard}`]
        : uniqueWards
            .slice(0, 8) // Limit to 8 wards for readability
            .map((wardNum) => `वडा ${wardNum}`);
    }
  }, [chartView, selectedSkill, topSkills, selectedWard, uniqueWards]);

  // Prepare pie chart data
  const pieChartData = useMemo(() => {
    if (selectedWard !== "all" && chartView === "byWard") {
      // Show skill distribution for a specific ward
      const wardData = filteredData.filter(
        (item) => item.wardNumber.toString() === selectedWard,
      );

      const totalWardPopulation = wardData.reduce(
        (sum, item) => sum + item.population,
        0,
      );

      return wardData
        .map((item, index) => ({
          id: formatSkillName(item.skill),
          label: formatSkillName(item.skill),
          value: item.population,
          percentage:
            totalWardPopulation > 0
              ? ((item.population / totalWardPopulation) * 100).toFixed(1)
              : "0",
          color: `hsl(${index * 25}, 70%, 50%)`,
        }))
        .sort((a, b) => b.value - a.value);
    } else if (selectedSkill !== "all" && chartView === "bySkill") {
      // Show ward distribution for a specific skill
      const skillData = filteredData.filter(
        (item) => item.skill === selectedSkill,
      );

      return skillData
        .map((item, index) => ({
          id: `वडा ${item.wardNumber}`,
          label: `वडा ${item.wardNumber}`,
          value: item.population,
          color: `hsl(${index * 25}, 70%, 50%)`,
        }))
        .sort((a, b) => b.value - a.value);
    } else {
      // Show top skills across all filtered data
      const skillTotals = filteredData.reduce(
        (acc, item) => {
          if (!acc[item.skill]) {
            acc[item.skill] = 0;
          }
          acc[item.skill] += item.population;
          return acc;
        },
        {} as Record<string, number>,
      );

      const totalPopulation = Object.values(skillTotals).reduce(
        (sum, value) => sum + value,
        0,
      );

      return Object.entries(skillTotals)
        .map(([skill, population], index) => ({
          id: formatSkillName(skill),
          label: formatSkillName(skill),
          value: population,
          percentage:
            totalPopulation > 0
              ? ((population / totalPopulation) * 100).toFixed(1)
              : "0",
          color: `hsl(${index * 25}, 70%, 50%)`,
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 8); // Limit to top 8 for readability
    }
  }, [filteredData, selectedWard, selectedSkill, chartView]);

  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">
          कुनै डाटा उपलब्ध छैन। पहिले वडा अनुसार प्रमुख सीप डाटा थप्नुहोस्।
        </p>
      </div>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>वडा अनुसार प्रमुख सीप विश्लेषण</CardTitle>
        <CardDescription>
          वडा अनुसार प्रमुख सीपको अनुपात हेर्नुहोस्
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
                <SelectItem value="bySkill">सीप प्रकार अनुसार</SelectItem>
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
                {uniqueWards.map((wardNum) => (
                  <SelectItem key={wardNum} value={wardNum}>
                    वडा {wardNum}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">
              सीप प्रकार चयन गर्नुहोस्:
            </label>
            <Select value={selectedSkill} onValueChange={setSelectedSkill}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="सीप प्रकार चयन गर्नुहोस्" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">सबै सीप प्रकार</SelectItem>
                {uniqueSkills.map((skill) => (
                  <SelectItem key={skill} value={skill}>
                    {formatSkillName(skill)}
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
                indexBy={chartView === "byWard" ? "ward" : "skill"}
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
                  legend: chartView === "byWard" ? "वडा" : "सीप प्रकार",
                  legendPosition: "middle",
                  legendOffset: 60,
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
              {selectedSkill === "all"
                ? "मुख्य सीप प्रकार"
                : formatSkillName(selectedSkill)}
            </div>
            <div className="flex flex-wrap gap-2 mt-1">
              {selectedSkill === "all" && topSkills.length > 0 && (
                <Badge variant="outline" className="px-2 py-1">
                  {formatSkillName(topSkills[0])}
                </Badge>
              )}
              {selectedSkill !== "all" && (
                <div className="text-2xl font-bold">
                  {filteredData
                    .reduce((sum, item) => sum + item.population, 0)
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
