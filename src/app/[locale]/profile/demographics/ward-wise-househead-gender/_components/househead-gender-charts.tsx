"use client";

import React from "react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { localizeNumber } from "@/lib/utils/localize-number";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

// Modern aesthetic color scheme for gender representation
const GENDER_COLORS = {
  MALE: "#4F46E5", // Indigo
  FEMALE: "#EC4899", // Pink
  OTHER: "#06B6D4", // Cyan
};

interface HouseheadGenderChartsProps {
  overallSummary: Array<{
    gender: string;
    genderName: string;
    population: number;
  }>;
  totalPopulation: number;
  pieChartData: Array<{
    name: string;
    value: number;
    percentage: string;
  }>;
  wardWiseData: Array<Record<string, any>>;
  wardNumbers: number[];
  genderData: Array<{
    id?: string;
    wardNumber: number;
    gender: string; // This should match schema field name
    population: number;
    updatedAt?: Date;
    createdAt?: Date;
  }>;
  GENDER_NAMES: Record<string, string>;
}

export default function HouseheadGenderCharts({
  overallSummary,
  totalPopulation,
  pieChartData,
  wardWiseData,
  wardNumbers,
  genderData,
  GENDER_NAMES,
}: HouseheadGenderChartsProps) {
  const [selectedTab, setSelectedTab] = useState<string>("pie");

  // Custom tooltip component for better presentation with Nepali numbers
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 border shadow-sm rounded-md">
          <p className="font-medium">{label}</p>
          <div className="space-y-1 mt-2">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: entry.color }}
                ></div>
                <span>{entry.name}: </span>
                <span className="font-medium">
                  {localizeNumber(entry.value?.toLocaleString() || "0", "ne")}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom tooltip component for pie chart
  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const { name, value, payload: originalPayload } = payload[0];
      const percentage = originalPayload.percentage;
      return (
        <div className="bg-background p-3 border shadow-sm rounded-md">
          <p className="font-medium">{name}</p>
          <div className="flex justify-between gap-4 mt-1">
            <span className="text-sm">जनसंख्या:</span>
            <span className="font-medium">
              {localizeNumber(value.toLocaleString(), "ne")}
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-sm">प्रतिशत:</span>
            <span className="font-medium">
              {localizeNumber(percentage, "ne")}%
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      {/* Overall gender distribution */}
      <div
        className="mb-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Household Head Gender Distribution in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content={`Gender distribution of household heads in Khajura with a total of ${totalPopulation} household heads`}
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            <strong>बुद्धशान्ति गाउँपालिका</strong>मा घरमूली लिङ्ग अनुसार वितरण
          </h3>
          <p className="text-sm text-muted-foreground">
            कुल घरमूली संख्या:{" "}
            {localizeNumber(totalPopulation.toLocaleString(), "ne")}
          </p>
        </div>

        <Tabs
          value={selectedTab}
          onValueChange={setSelectedTab}
          className="w-full"
        >
          <div className="border-b bg-muted/40">
            <div className="container">
              <TabsList className="h-10 bg-transparent">
                <TabsTrigger
                  value="pie"
                  className="data-[state=active]:bg-background"
                >
                  पाई चार्ट
                </TabsTrigger>
                <TabsTrigger
                  value="table"
                  className="data-[state=active]:bg-background"
                >
                  तालिका
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          <TabsContent value="pie" className="p-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={140}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieChartData.map((entry, index) => {
                          // Find the original gender key for color mapping
                          const genderKey =
                            Object.keys(GENDER_NAMES).find(
                              (key) => GENDER_NAMES[key] === entry.name,
                            ) || "OTHER";

                          return (
                            <Cell
                              key={`cell-${index}`}
                              fill={
                                GENDER_COLORS[
                                  genderKey as keyof typeof GENDER_COLORS
                                ] || "#94a3b8"
                              }
                            />
                          );
                        })}
                      </Pie>
                      <Tooltip content={<CustomPieTooltip />} />
                      <Legend formatter={(value) => value} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="space-y-4">
                  <h4 className="text-lg font-medium mb-4">
                    घरमूली लिङ्ग अनुपात
                  </h4>
                  <div className="space-y-3">
                    {overallSummary.map((item, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <div
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{
                            backgroundColor:
                              GENDER_COLORS[
                                item.gender as keyof typeof GENDER_COLORS
                              ] || "#94a3b8",
                          }}
                        ></div>
                        <div className="flex-grow">
                          <div className="flex justify-between items-center">
                            <span>{item.genderName}</span>
                            <span className="font-medium">
                              {localizeNumber(
                                (
                                  (item.population / totalPopulation) *
                                  100
                                ).toFixed(1),
                                "ne",
                              )}
                              %
                            </span>
                          </div>
                          <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${(item.population / totalPopulation) * 100}%`,
                                backgroundColor:
                                  GENDER_COLORS[
                                    item.gender as keyof typeof GENDER_COLORS
                                  ] || "#94a3b8",
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="table" className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted sticky top-0">
                    <th className="border p-2 text-left">क्र.सं.</th>
                    <th className="border p-2 text-left">लिङ्ग</th>
                    <th className="border p-2 text-right">घरमूली संख्या</th>
                    <th className="border p-2 text-right">प्रतिशत</th>
                  </tr>
                </thead>
                <tbody>
                  {overallSummary.map((item, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-muted/40" : ""}>
                      <td className="border p-2">
                        {localizeNumber((i + 1).toString(), "ne")}
                      </td>
                      <td className="border p-2">{item.genderName}</td>
                      <td className="border p-2 text-right">
                        {localizeNumber(item.population.toLocaleString(), "ne")}
                      </td>
                      <td className="border p-2 text-right">
                        {localizeNumber(
                          ((item.population / totalPopulation) * 100).toFixed(
                            2,
                          ),
                          "ne",
                        )}
                        %
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="font-semibold bg-muted/70">
                    <td className="border p-2" colSpan={2}>
                      जम्मा
                    </td>
                    <td className="border p-2 text-right">
                      {localizeNumber(totalPopulation.toLocaleString(), "ne")}
                    </td>
                    <td className="border p-2 text-right">
                      {localizeNumber("100.00", "ne")}%
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Ward-wise distribution */}
      <div
        className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Ward-wise Household Head Gender Distribution in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content="Gender distribution of household heads across wards in Khajura"
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            <strong>बुद्धशान्ति गाउँपालिका</strong>को वडा अनुसार घरमूली लिङ्ग
            वितरण
          </h3>
          <p className="text-sm text-muted-foreground">
            वडा र लिङ्ग अनुसार घरमूली वितरण
          </p>
        </div>

        <div className="p-6">
          <div className="h-[500px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={wardWiseData}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                barSize={20}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis
                  dataKey="ward"
                  scale="point"
                  padding={{ left: 10, right: 10 }}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  tickFormatter={(value) =>
                    localizeNumber(value.toString(), "ne")
                  }
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ paddingTop: 20 }}
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                />
                {Object.keys(GENDER_NAMES).map((gender) => (
                  <Bar
                    key={gender}
                    dataKey={GENDER_NAMES[gender]}
                    stackId="a"
                    name={GENDER_NAMES[gender]}
                    fill={
                      GENDER_COLORS[gender as keyof typeof GENDER_COLORS] ||
                      "#94a3b8"
                    }
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-6 border-t">
          <h4 className="text-lg font-medium mb-4">
            वडागत घरमूली लिङ्ग तालिका
          </h4>
          <div className="overflow-auto max-h-[600px]">
            <table className="w-full border-collapse min-w-[800px]">
              <thead className="sticky top-0 z-10">
                <tr className="bg-muted">
                  <th className="border p-2">वडा नं.</th>
                  {Object.values(GENDER_NAMES).map((name) => (
                    <React.Fragment key={name}>
                      <th className="border p-2 text-right">{name}</th>
                      <th className="border p-2 text-right">प्रतिशत</th>
                    </React.Fragment>
                  ))}
                  <th className="border p-2 text-right">जम्मा</th>
                </tr>
              </thead>
              <tbody>
                {wardNumbers.map((wardNumber, i) => {
                  const wardItems = genderData.filter(
                    (item) => item.wardNumber === wardNumber,
                  );
                  const wardTotal = wardItems.reduce(
                    (sum, item) => sum + (item.population || 0),
                    0,
                  );

                  return (
                    <tr key={i} className={i % 2 === 0 ? "bg-muted/50" : ""}>
                      <td className="border p-2">
                        वडा {localizeNumber(wardNumber.toString(), "ne")}
                      </td>
                      {Object.entries(GENDER_NAMES).map(
                        ([genderKey, genderName]) => {
                          const genderItem = wardItems.find(
                            (item) => item.gender === genderKey,
                          );
                          const genderPopulation = genderItem?.population || 0;
                          const genderPercentage =
                            wardTotal > 0
                              ? (genderPopulation / wardTotal) * 100
                              : 0;

                          return (
                            <React.Fragment key={genderKey}>
                              <td className="border p-2 text-right">
                                {localizeNumber(
                                  genderPopulation.toLocaleString(),
                                  "ne",
                                )}
                              </td>
                              <td className="border p-2 text-right">
                                {localizeNumber(
                                  genderPercentage.toFixed(2),
                                  "ne",
                                )}
                                %
                              </td>
                            </React.Fragment>
                          );
                        },
                      )}
                      <td className="border p-2 text-right font-medium">
                        {localizeNumber(wardTotal.toLocaleString(), "ne")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="font-semibold bg-muted/70">
                  <td className="border p-2">कुल</td>
                  {Object.entries(GENDER_NAMES).map(
                    ([genderKey, genderName]) => {
                      const genderTotal =
                        overallSummary.find((item) => item.gender === genderKey)
                          ?.population || 0;
                      const genderPercentage =
                        totalPopulation > 0
                          ? (genderTotal / totalPopulation) * 100
                          : 0;

                      return (
                        <React.Fragment key={genderKey}>
                          <td className="border p-2 text-right">
                            {localizeNumber(genderTotal.toLocaleString(), "ne")}
                          </td>
                          <td className="border p-2 text-right">
                            {localizeNumber(genderPercentage.toFixed(2), "ne")}%
                          </td>
                        </React.Fragment>
                      );
                    },
                  )}
                  <td className="border p-2 text-right">
                    {localizeNumber(totalPopulation.toLocaleString(), "ne")}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
