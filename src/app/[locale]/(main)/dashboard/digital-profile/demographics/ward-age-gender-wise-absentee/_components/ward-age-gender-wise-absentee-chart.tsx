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

interface WardAgeGenderWiseAbsenteeData {
  id: string;
  wardNumber: number;
  ageGroup: string;
  gender: string;
  population: number;
}

interface WardAgeGenderWiseAbsenteeChartProps {
  data: WardAgeGenderWiseAbsenteeData[];
}

// Helper functions for display names
const getAgeGroupDisplayName = (ageGroup: string): string => {
  switch (ageGroup) {
    case "AGE_0_4":
      return "०-४ वर्ष";
    case "AGE_5_9":
      return "५-९ वर्ष";
    case "AGE_10_14":
      return "१०-१४ वर्ष";
    case "AGE_15_19":
      return "१५-१९ वर्ष";
    case "AGE_20_24":
      return "२०-२४ वर्ष";
    case "AGE_25_29":
      return "२५-२९ वर्ष";
    case "AGE_30_34":
      return "३०-३४ वर्ष";
    case "AGE_35_39":
      return "३५-३९ वर्ष";
    case "AGE_40_44":
      return "४०-४४ वर्ष";
    case "AGE_45_49":
      return "४५-४९ वर्ष";
    case "AGE_50_AND_ABOVE":
      return "५० वर्ष भन्दा माथि";
    default:
      return ageGroup;
  }
};

const getGenderDisplayName = (gender: string): string => {
  switch (gender) {
    case "MALE":
      return "पुरुष";
    case "FEMALE":
      return "महिला";
    case "OTHER":
      return "अन्य";
    default:
      return gender;
  }
};

export default function WardAgeGenderWiseAbsenteeChart({
  data,
}: WardAgeGenderWiseAbsenteeChartProps) {
  const [selectedGender, setSelectedGender] = useState<string>("all");
  const [selectedWard, setSelectedWard] = useState<string>("all");
  const [chartView, setChartView] = useState<string>("byAgeGroup"); // 'byAgeGroup' or 'byGender'

  // Get unique wards
  const uniqueWards = useMemo(() => {
    return Array.from(
      new Set(data.map((item) => item.wardNumber.toString())),
    ).sort((a, b) => parseInt(a) - parseInt(b));
  }, [data]);

  // Get unique age groups and genders
  const uniqueAgeGroups = useMemo(() => {
    return Array.from(new Set(data.map((item) => item.ageGroup))).sort();
  }, [data]);

  const uniqueGenders = useMemo(() => {
    return Array.from(new Set(data.map((item) => item.gender))).sort();
  }, [data]);

  // Filter by selected ward and gender
  const filteredData = useMemo(() => {
    let result = [...data];

    if (selectedWard !== "all") {
      result = result.filter(
        (item) => item.wardNumber.toString() === selectedWard,
      );
    }

    if (selectedGender !== "all") {
      result = result.filter((item) => item.gender === selectedGender);
    }

    return result;
  }, [data, selectedWard, selectedGender]);

  // Prepare bar chart data based on the chartView
  const barChartData = useMemo(() => {
    if (chartView === "byAgeGroup") {
      // Group by age group
      const ageGroupData = uniqueAgeGroups.map((ageGroup) => {
        const ageGroupItems = filteredData.filter(
          (item) => item.ageGroup === ageGroup,
        );

        // Create an object with age group as key and gender populations
        const dataPoint: Record<string, any> = {
          ageGroup: getAgeGroupDisplayName(ageGroup),
        };

        // If gender filter is applied, just show total
        if (selectedGender !== "all") {
          dataPoint[getGenderDisplayName(selectedGender)] =
            ageGroupItems.reduce(
              (sum, item) => sum + (item.population || 0),
              0,
            );
        } else {
          // Otherwise show all genders
          uniqueGenders.forEach((gender) => {
            const genderItems = ageGroupItems.filter(
              (item) => item.gender === gender,
            );
            dataPoint[getGenderDisplayName(gender)] = genderItems.reduce(
              (sum, item) => sum + (item.population || 0),
              0,
            );
          });
        }

        return dataPoint;
      });

      return ageGroupData;
    } else {
      // Group by gender
      const genderData = uniqueGenders.map((gender) => {
        const genderItems = filteredData.filter(
          (item) => item.gender === gender,
        );

        // Create an object with gender as key and age group populations
        const dataPoint: Record<string, any> = {
          gender: getGenderDisplayName(gender),
        };

        uniqueAgeGroups.forEach((ageGroup) => {
          const ageGroupItems = genderItems.filter(
            (item) => item.ageGroup === ageGroup,
          );
          dataPoint[getAgeGroupDisplayName(ageGroup)] = ageGroupItems.reduce(
            (sum, item) => sum + (item.population || 0),
            0,
          );
        });

        return dataPoint;
      });

      return genderData;
    }
  }, [filteredData, uniqueAgeGroups, uniqueGenders, chartView, selectedGender]);

  // Get chart keys based on the chartView
  const chartKeys = useMemo(() => {
    if (chartView === "byAgeGroup") {
      return selectedGender !== "all"
        ? [getGenderDisplayName(selectedGender)]
        : uniqueGenders.map((gender) => getGenderDisplayName(gender));
    } else {
      return uniqueAgeGroups.map((ageGroup) =>
        getAgeGroupDisplayName(ageGroup),
      );
    }
  }, [chartView, uniqueGenders, uniqueAgeGroups, selectedGender]);

  // Prepare pie chart data
  const pieChartData = useMemo(() => {
    if (chartView === "byAgeGroup") {
      // Create pie data grouped by age groups
      return uniqueAgeGroups
        .map((ageGroup, index) => {
          const ageGroupData = filteredData.filter(
            (item) => item.ageGroup === ageGroup,
          );
          const total = ageGroupData.reduce(
            (sum, item) => sum + (item.population || 0),
            0,
          );

          return {
            id: getAgeGroupDisplayName(ageGroup),
            label: getAgeGroupDisplayName(ageGroup),
            value: total,
            color: `hsl(${index * 40}, 70%, 50%)`,
          };
        })
        .filter((item) => item.value > 0);
    } else {
      // Create pie data grouped by gender
      return uniqueGenders
        .map((gender, index) => {
          const genderData = filteredData.filter(
            (item) => item.gender === gender,
          );
          const total = genderData.reduce(
            (sum, item) => sum + (item.population || 0),
            0,
          );

          return {
            id: getGenderDisplayName(gender),
            label: getGenderDisplayName(gender),
            value: total,
            color:
              gender === "MALE"
                ? "hsl(210, 70%, 50%)"
                : gender === "FEMALE"
                  ? "hsl(340, 70%, 50%)"
                  : "hsl(160, 70%, 50%)",
          };
        })
        .filter((item) => item.value > 0);
    }
  }, [filteredData, uniqueAgeGroups, uniqueGenders, chartView]);

  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">
          कुनै डाटा उपलब्ध छैन। पहिले वडा अनुसार उमेर र लिङ्ग प्रवासी डाटा
          थप्नुहोस्।
        </p>
      </div>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>वडा अनुसार उमेर र लिङ्ग प्रवासी विश्लेषण</CardTitle>
        <CardDescription>
          वडा, उमेर समूह र लिङ्ग अनुसार प्रवासी जनसंख्या डाटा हेर्नुहोस्
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
                <SelectItem value="byAgeGroup">उमेर समूह अनुसार</SelectItem>
                <SelectItem value="byGender">लिङ्ग अनुसार</SelectItem>
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

          <div>
            <label className="text-sm font-medium mb-1 block">
              लिङ्ग चयन गर्नुहोस्:
            </label>
            <Select value={selectedGender} onValueChange={setSelectedGender}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="लिङ्ग चयन गर्नुहोस्" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">सबै लिङ्ग</SelectItem>
                {uniqueGenders.map((gender) => (
                  <SelectItem key={gender} value={gender}>
                    {getGenderDisplayName(gender)}
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
                indexBy={chartView === "byAgeGroup" ? "ageGroup" : "gender"}
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
                  legend: chartView === "byAgeGroup" ? "उमेर समूह" : "लिङ्ग",
                  legendPosition: "middle",
                  legendOffset: 50,
                  truncateTickAt: 0,
                }}
                axisLeft={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: "प्रवासी जनसंख्या",
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
              कुल प्रवासी जनसंख्या
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
              {selectedGender === "all"
                ? "लिङ्ग अनुपात"
                : getGenderDisplayName(selectedGender)}
            </div>
            <div className="flex flex-wrap gap-2 mt-1">
              {selectedGender === "all" &&
                uniqueGenders.map((gender) => {
                  const genderCount = filteredData
                    .filter((item) => item.gender === gender)
                    .reduce((sum, item) => sum + item.population, 0);
                  const totalCount = filteredData.reduce(
                    (sum, item) => sum + item.population,
                    0,
                  );
                  const percentage =
                    totalCount > 0
                      ? ((genderCount / totalCount) * 100).toFixed(1)
                      : "0";

                  return (
                    <Badge key={gender} variant="outline" className="px-2 py-1">
                      {getGenderDisplayName(gender)}: {percentage}%
                    </Badge>
                  );
                })}
              {selectedGender !== "all" && (
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
