"use client";

import { TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { localizeNumber } from "@/lib/utils/localize-number";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  Tooltip,
  Legend,
  XAxis,
  YAxis,
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  Cell,
} from "recharts";

// Modern aesthetic color palette
const WARD_COLORS = [
  "#6366F1", // Indigo
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#F43F5E", // Rose
  "#10B981", // Emerald
  "#06B6D4", // Cyan
  "#3B82F6", // Blue
  "#F59E0B", // Amber
  "#84CC16", // Lime
  "#9333EA", // Fuchsia
  "#14B8A6", // Teal
  "#EF4444", // Red
];

// Custom formatter for Nepali numbers
const CustomTooltipFormatter = (value: number) => {
  return localizeNumber(value.toLocaleString(), "ne");
};

// Custom tooltip component for households
const CustomHouseholdTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background p-3 border shadow-sm rounded-md">
        <p className="font-medium mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex justify-between gap-4">
            <span className="text-sm">{entry.name}:</span>
            <span className="font-medium">
              {localizeNumber(entry.value.toLocaleString(), "ne")}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// Custom tooltip component for household size
const CustomHouseholdSizeTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background p-3 border shadow-sm rounded-md">
        <p className="font-medium mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex justify-between gap-4">
            <span className="text-sm">{entry.name}:</span>
            <span className="font-medium">
              {localizeNumber(entry.value.toFixed(2), "ne")}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

interface HouseholdChartsProps {
  householdTab: string;
  wardHouseholdData: Array<{
    ward: string;
    householdSize: number;
    households: number;
  }>;
  wardPopulationData: Array<{
    ward: string;
    population: number;
    malePopulation: number;
    femalePopulation: number;
    otherPopulation: number;
    percentage: string;
    households: number;
  }>;
  municipalityStats: {
    totalPopulation: number;
    malePopulation: number;
    femalePopulation: number;
    otherPopulation: number;
    totalHouseholds: number;
  };
  municipalityAverages: {
    averageHouseholdSize: number;
    sexRatio: number;
  };
}

export default function HouseholdCharts({
  householdTab,
  wardHouseholdData,
  wardPopulationData,
  municipalityStats,
  municipalityAverages,
}: HouseholdChartsProps) {
  return (
    <>
      <TabsContent value="bar" className="p-4">
        <div className="h-[500px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={wardHouseholdData}
              margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
              barSize={30}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis
                dataKey="ward"
                scale="point"
                padding={{ left: 10, right: 10 }}
              />
              <YAxis tickFormatter={CustomTooltipFormatter} />
              <Tooltip content={<CustomHouseholdTooltip />} />
              <Legend />
              <Bar
                dataKey="households"
                name="घरधुरी संख्या"
                radius={[4, 4, 0, 0]}
                aria-label="Bar chart showing household count across wards"
              >
                {wardHouseholdData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={WARD_COLORS[index % WARD_COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </TabsContent>

      <TabsContent value="household-size" className="p-4">
        <div className="h-[500px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={wardHouseholdData}
              margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis
                dataKey="ward"
                scale="point"
                padding={{ left: 10, right: 10 }}
              />
              <YAxis
                tickFormatter={(value) =>
                  localizeNumber(value.toFixed(1), "ne")
                }
              />
              <Tooltip content={<CustomHouseholdSizeTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="householdSize"
                name="औसत परिवार संख्या"
                stroke="#8B5CF6"
                strokeWidth={2}
                dot={{ r: 4, fill: "#8B5CF6" }}
                activeDot={{ r: 6, fill: "#6D28D9" }}
              />
              {/* Reference line for municipality average */}
              <ReferenceLine
                y={municipalityAverages.averageHouseholdSize}
                stroke="#6D28D9"
                strokeDasharray="3 3"
                label={{
                  value: `बुद्धशान्ति गाउँपालिका औसत: ${localizeNumber(municipalityAverages.averageHouseholdSize.toFixed(2), "ne")}`,
                  position: "insideBottomRight",
                  fill: "#4C1D95",
                  fontSize: 12,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </TabsContent>

      <TabsContent value="table" className="p-6">
        <div className="overflow-x-auto">
          <table
            className="w-full border-collapse"
            aria-label="Ward-wise household data table"
          >
            <thead>
              <tr className="bg-muted">
                <th className="border p-2 text-left">वडा</th>
                <th className="border p-2 text-right">घरधुरी संख्या</th>
                <th className="border p-2 text-right">औसत परिवार संख्या</th>
                <th className="border p-2 text-right">कुल जनसंख्या</th>
              </tr>
            </thead>
            <tbody>
              {wardHouseholdData.map((item, i) => {
                const population =
                  wardPopulationData.find((w) => w.ward === item.ward)
                    ?.population || 0;

                return (
                  <tr key={i} className={i % 2 === 0 ? "bg-muted/40" : ""}>
                    <td className="border p-2">{item.ward}</td>
                    <td className="border p-2 text-right">
                      {localizeNumber(item.households.toLocaleString(), "ne")}
                    </td>
                    <td className="border p-2 text-right">
                      {localizeNumber(item.householdSize.toFixed(2), "ne")}
                    </td>
                    <td className="border p-2 text-right">
                      {localizeNumber(population.toLocaleString(), "ne")}
                    </td>
                  </tr>
                );
              })}
              <tr className="font-semibold bg-muted/70">
                <td className="border p-2">जम्मा</td>
                <td className="border p-2 text-right">
                  {localizeNumber(
                    municipalityStats.totalHouseholds.toLocaleString(),
                    "ne",
                  )}
                </td>
                <td className="border p-2 text-right">
                  {localizeNumber(
                    municipalityAverages.averageHouseholdSize.toFixed(2),
                    "ne",
                  )}
                </td>
                <td className="border p-2 text-right">
                  {localizeNumber(
                    municipalityStats.totalPopulation.toLocaleString(),
                    "ne",
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </TabsContent>
    </>
  );
}
