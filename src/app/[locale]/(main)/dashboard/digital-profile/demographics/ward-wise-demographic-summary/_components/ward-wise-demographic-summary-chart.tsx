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

interface WardWiseDemographicSummaryData {
  id: string;
  wardNumber: number;
  wardName?: string | null;
  totalPopulation?: number | null;
  populationMale?: number | null;
  populationFemale?: number | null;
  populationOther?: number | null;
  totalHouseholds?: number | null;
  averageHouseholdSize?: string | null;
  sexRatio?: string | null;
}

interface WardWiseDemographicSummaryChartProps {
  data: WardWiseDemographicSummaryData[];
}

export default function WardWiseDemographicSummaryChart({
  data,
}: WardWiseDemographicSummaryChartProps) {
  const [selectedMetric, setSelectedMetric] =
    useState<string>("totalPopulation");
  const [selectedWard, setSelectedWard] = useState<string>("all");

  // Get unique wards
  const uniqueWards = useMemo(() => {
    return Array.from(new Set(data.map((item) => item.wardNumber))).sort(
      (a, b) => a - b,
    );
  }, [data]);

  // Prepare data for charts
  const barChartData = useMemo(() => {
    return data
      .sort((a, b) => a.wardNumber - b.wardNumber)
      .map((ward) => {
        const value = ward[selectedMetric as keyof typeof ward];
        return {
          ward: `वडा ${ward.wardNumber}`,
          [selectedMetric]: value || 0,
          wardColor: `hsl(${ward.wardNumber * 30}, 70%, 50%)`,
        };
      });
  }, [data, selectedMetric]);

  // Filter by selected ward
  const filteredData = useMemo(() => {
    if (selectedWard === "all") return data;
    return data.filter((item) => item.wardNumber === parseInt(selectedWard));
  }, [data, selectedWard]);

  // Gender distribution for pie chart
  const genderDistributionData = useMemo(() => {
    // Calculate total male, female, and other across all wards or selected ward
    const totalMale = filteredData.reduce(
      (sum, ward) => sum + (ward.populationMale || 0),
      0,
    );
    const totalFemale = filteredData.reduce(
      (sum, ward) => sum + (ward.populationFemale || 0),
      0,
    );
    const totalOther = filteredData.reduce(
      (sum, ward) => sum + (ward.populationOther || 0),
      0,
    );

    return [
      {
        id: "पुरुष",
        label: "पुरुष",
        value: totalMale,
        color: "hsl(210, 70%, 50%)",
      },
      {
        id: "महिला",
        label: "महिला",
        value: totalFemale,
        color: "hsl(350, 70%, 50%)",
      },
      {
        id: "अन्य",
        label: "अन्य",
        value: totalOther,
        color: "hsl(120, 70%, 50%)",
      },
    ].filter((item) => item.value > 0); // Only include non-zero values
  }, [filteredData]);

  // Population vs Households comparison
  const populationVsHouseholdsData = useMemo(() => {
    return filteredData
      .sort((a, b) => a.wardNumber - b.wardNumber)
      .map((ward) => ({
        ward: `वडा ${ward.wardNumber}`,
        जनसंख्या: ward.totalPopulation || 0,
        घरधुरी: ward.totalHouseholds || 0,
      }));
  }, [filteredData]);

  // Define metrics options
  const metrics = [
    { value: "totalPopulation", label: "कुल जनसंख्या" },
    { value: "populationMale", label: "पुरुष जनसंख्या" },
    { value: "populationFemale", label: "महिला जनसंख्या" },
    { value: "populationOther", label: "अन्य जनसंख्या" },
    { value: "totalHouseholds", label: "कुल घरधुरी" },
    { value: "averageHouseholdSize", label: "औसत घरधुरी आकार" },
    { value: "sexRatio", label: "लिङ्ग अनुपात" },
  ];

  // Get human-readable metric name
  const getMetricLabel = () => {
    return (
      metrics.find((m) => m.value === selectedMetric)?.label || selectedMetric
    );
  };

  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">
          कुनै डाटा उपलब्ध छैन। पहिले वडा जनसांख्यिकी डाटा थप्नुहोस्।
        </p>
      </div>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>वडा जनसांख्यिकी विश्लेषण</CardTitle>
        <CardDescription>
          वडा अनुसार जनसांख्यिकी डाटा हेर्नुहोस्
        </CardDescription>

        <div className="flex flex-wrap gap-4 mt-4">
          <div>
            <label className="text-sm font-medium mb-1 block">
              मेट्रिक चयन गर्नुहोस्:
            </label>
            <Select value={selectedMetric} onValueChange={setSelectedMetric}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="मेट्रिक चयन गर्नुहोस्" />
              </SelectTrigger>
              <SelectContent>
                {metrics.map((metric) => (
                  <SelectItem key={metric.value} value={metric.value}>
                    {metric.label}
                  </SelectItem>
                ))}
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
            <TabsTrigger value="pie">लिङ्ग अनुपात</TabsTrigger>
            <TabsTrigger value="comparison">जनसंख्या vs घरधुरी</TabsTrigger>
          </TabsList>

          <TabsContent value="bar">
            <div className="h-96 border rounded-lg p-4 bg-white">
              <ResponsiveBar
                data={
                  selectedWard === "all"
                    ? barChartData
                    : barChartData.filter(
                        (item) => item.ward === `वडा ${selectedWard}`,
                      )
                }
                keys={[selectedMetric]}
                indexBy="ward"
                margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                padding={0.3}
                valueScale={{ type: "linear" }}
                indexScale={{ type: "band", round: true }}
                colors={({ id, data }) => String(data.wardColor)}
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
                  legend: getMetricLabel(),
                  legendPosition: "middle",
                  legendOffset: -40,
                  format: (value) =>
                    selectedMetric === "averageHouseholdSize" ||
                    selectedMetric === "sexRatio"
                      ? parseFloat(value.toString()).toFixed(2)
                      : value,
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
                data={genderDistributionData}
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

          <TabsContent value="comparison">
            <div className="h-96 border rounded-lg p-4 bg-white">
              <ResponsiveBar
                data={populationVsHouseholdsData}
                keys={["जनसंख्या", "घरधुरी"]}
                indexBy="ward"
                margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                padding={0.3}
                groupMode="grouped"
                valueScale={{ type: "linear" }}
                indexScale={{ type: "band", round: true }}
                colors={{ scheme: "paired" }}
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
                  legend: "संख्या",
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
        </Tabs>
      </CardContent>
    </Card>
  );
}
