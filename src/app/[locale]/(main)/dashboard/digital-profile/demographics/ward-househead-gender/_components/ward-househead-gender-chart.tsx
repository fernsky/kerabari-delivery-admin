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

type Gender = "MALE" | "FEMALE" | "OTHER";

interface WardWiseHouseHeadGenderData {
  id: string;
  wardNumber: number;
  wardName?: string | null;
  gender: Gender;
  population: number;
}

interface WardWiseHouseHeadGenderChartProps {
  data: WardWiseHouseHeadGenderData[];
}

export default function WardWiseHouseHeadGenderChart({
  data,
}: WardWiseHouseHeadGenderChartProps) {
  const [selectedWard, setSelectedWard] = useState<string>("all");

  // Get unique wards
  const uniqueWards = useMemo(() => {
    return Array.from(new Set(data.map((item) => item.wardNumber))).sort(
      (a, b) => a - b,
    );
  }, [data]);

  // Filter data by ward if selected
  const filteredData = useMemo(() => {
    if (selectedWard === "all") {
      return data;
    }
    return data.filter((d) => d.wardNumber === parseInt(selectedWard));
  }, [data, selectedWard]);

  // Calculate total proportions by gender
  const genderTotals = useMemo(() => {
    const totals = { MALE: 0, FEMALE: 0, OTHER: 0 };
    filteredData.forEach((item) => {
      totals[item.gender] += item.population;
    });
    return totals;
  }, [filteredData]);

  // Data for pie chart
  const pieChartData = useMemo(() => {
    return [
      {
        id: "पुरुष",
        label: "पुरुष",
        value: genderTotals.MALE,
        color: "hsl(210, 70%, 50%)",
      },
      {
        id: "महिला",
        label: "महिला",
        value: genderTotals.FEMALE,
        color: "hsl(340, 70%, 50%)",
      },
      {
        id: "अन्य",
        label: "अन्य",
        value: genderTotals.OTHER,
        color: "hsl(170, 70%, 50%)",
      },
    ].filter((item) => item.value > 0);
  }, [genderTotals]);

  // Data for bar chart by ward
  const barChartData = useMemo(() => {
    // Group by ward and calculate for each gender
    const wardData: {
      [key: number]: {
        ward: string;
        पुरुष: number;
        महिला: number;
        अन्य: number;
      };
    } = {};

    uniqueWards.forEach((ward) => {
      wardData[ward] = {
        ward: `वडा ${ward}`,
        पुरुष: 0,
        महिला: 0,
        अन्य: 0,
      };
    });

    // Populate with actual data
    data.forEach((item) => {
      if (item.gender === "MALE") {
        wardData[item.wardNumber].पुरुष = item.population;
      } else if (item.gender === "FEMALE") {
        wardData[item.wardNumber].महिला = item.population;
      } else {
        wardData[item.wardNumber].अन्य = item.population;
      }
    });

    return Object.values(wardData);
  }, [data, uniqueWards]);

  const totalHouseholds =
    genderTotals.MALE + genderTotals.FEMALE + genderTotals.OTHER;

  const getGenderPercentage = (gender: "MALE" | "FEMALE" | "OTHER") => {
    if (totalHouseholds === 0) return "0%";
    return `${((genderTotals[gender] / totalHouseholds) * 100).toFixed(1)}%`;
  };

  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">
          कुनै डाटा उपलब्ध छैन। पहिले घरमूली लिङ्ग डाटा थप्नुहोस्।
        </p>
      </div>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>घरमूली लिङ्ग वितरण</CardTitle>
        <CardDescription>
          वडा अनुसार घरमूली लिङ्ग वितरण हेर्नुहोस्
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
                <SelectItem value="all">सबै वडाहरू</SelectItem>
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
        <Tabs defaultValue="pie" className="mt-2">
          <TabsList>
            <TabsTrigger value="pie">पाई चार्ट</TabsTrigger>
            <TabsTrigger value="bar">बार चार्ट</TabsTrigger>
          </TabsList>

          <TabsContent value="pie" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800 font-medium">
                  पुरुष घरमूली
                </p>
                <p className="text-3xl font-bold text-blue-700">
                  {genderTotals.MALE.toLocaleString()}
                </p>
                <p className="text-sm text-blue-600">
                  {getGenderPercentage("MALE")}
                </p>
              </div>

              <div className="bg-pink-50 p-4 rounded-lg">
                <p className="text-sm text-pink-800 font-medium">
                  महिला घरमूली
                </p>
                <p className="text-3xl font-bold text-pink-700">
                  {genderTotals.FEMALE.toLocaleString()}
                </p>
                <p className="text-sm text-pink-600">
                  {getGenderPercentage("FEMALE")}
                </p>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-purple-800 font-medium">
                  अन्य घरमूली
                </p>
                <p className="text-3xl font-bold text-purple-700">
                  {genderTotals.OTHER.toLocaleString()}
                </p>
                <p className="text-sm text-purple-600">
                  {getGenderPercentage("OTHER")}
                </p>
              </div>
            </div>

            <div className="h-96 border rounded-lg p-4 bg-white">
              <ResponsivePie
                data={pieChartData}
                margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                innerRadius={0.5}
                padAngle={0.7}
                cornerRadius={3}
                colors={{ scheme: "category10" }}
                borderWidth={1}
                borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
                animate={true}
                legends={[
                  {
                    anchor: "bottom",
                    direction: "row",
                    translateY: 56,
                    itemWidth: 100,
                    itemHeight: 18,
                    itemTextColor: "#999",
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

          <TabsContent value="bar" className="space-y-4">
            <div className="h-96 border rounded-lg p-4 bg-white">
              <ResponsiveBar
                data={barChartData}
                keys={["पुरुष", "महिला", "अन्य"]}
                indexBy="ward"
                margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                padding={0.3}
                groupMode="grouped"
                valueScale={{ type: "linear" }}
                indexScale={{ type: "band", round: true }}
                colors={{ scheme: "category10" }}
                borderColor={{
                  from: "color",
                  modifiers: [["darker", 1.6]],
                }}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: "वडा",
                  legendPosition: "middle",
                  legendOffset: 32,
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
                animate={true}
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
