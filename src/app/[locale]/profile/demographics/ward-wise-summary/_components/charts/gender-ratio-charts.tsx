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
  ReferenceLine,
  Line,
  LineChart,
  Cell,
} from "recharts";

// Modern aesthetic color scheme for gender representation
const GENDER_COLORS = {
  MALE: "#3B82F6", // Blue
  FEMALE: "#EC4899", // Pink
  OTHER: "#10B981", // Emerald
};

// Modern aesthetic color palette for wards
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

// Custom tooltip component for better presentation
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background p-3 border shadow-sm rounded-md">
        <p className="font-medium mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex justify-between gap-4">
            <span className="text-sm">{entry.name}:</span>
            <span className="font-medium">
              {localizeNumber(entry.value.toFixed(1), "ne")}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

interface GenderRatioChartsProps {
  genderTab: string;
  wardSexRatioData: Array<{
    ward: string;
    sexRatio: number;
    population: number;
  }>;
  wardPopulationData: Array<{
    ward: string;
    population: number;
    malePopulation: number;
    femalePopulation: number;
    otherPopulation: number;
    percentage: string;
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
  GENDER_NAMES: Record<string, string>;
}

export default function GenderRatioCharts({
  genderTab,
  wardSexRatioData,
  wardPopulationData,
  municipalityStats,
  municipalityAverages,
  GENDER_NAMES,
}: GenderRatioChartsProps) {
  return (
    <>
      <TabsContent value="bar" className="p-4">
        <div className="h-[500px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={wardSexRatioData}
              margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
              barSize={30}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis
                dataKey="ward"
                scale="point"
                padding={{ left: 10, right: 10 }}
              />
              <YAxis
                domain={[0, "auto"]}
                tickFormatter={CustomTooltipFormatter}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="sexRatio" name="लैङ्गिक अनुपात" fill="#FFB7B2">
                {wardSexRatioData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={WARD_COLORS[index % WARD_COLORS.length]}
                  />
                ))}
              </Bar>
              {/* Reference line for municipality average */}
              <ReferenceLine
                y={municipalityAverages.sexRatio}
                stroke="#D5D0E5"
                strokeDasharray="3 3"
                label={{
                  value: `बुद्धशान्ति गाउँपालिका औसत: ${localizeNumber(municipalityAverages.sexRatio.toFixed(1), "ne")}`,
                  position: "insideBottomRight",
                  fill: "#6c6684",
                  fontSize: 12,
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </TabsContent>

      <TabsContent value="stacked" className="p-4">
        <div className="h-[500px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={wardPopulationData}
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
              <Tooltip
                formatter={CustomTooltipFormatter}
                labelFormatter={(value) => `${value}`}
              />
              <Legend />
              <Bar
                dataKey="malePopulation"
                name={GENDER_NAMES.MALE}
                stackId="a"
                fill={GENDER_COLORS.MALE}
              />
              <Bar
                dataKey="femalePopulation"
                name={GENDER_NAMES.FEMALE}
                stackId="a"
                fill={GENDER_COLORS.FEMALE}
              />
              <Bar
                dataKey="otherPopulation"
                name={GENDER_NAMES.OTHER}
                stackId="a"
                fill={GENDER_COLORS.OTHER}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </TabsContent>

      <TabsContent value="table" className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted">
                <th className="border p-2 text-left">वडा</th>
                <th className="border p-2 text-right">पुरुष</th>
                <th className="border p-2 text-right">महिला</th>
                <th className="border p-2 text-right">अन्य</th>
                <th className="border p-2 text-right">लैङ्गिक अनुपात</th>
              </tr>
            </thead>
            <tbody>
              {wardPopulationData.map((item, i) => {
                const matchingSexRatio = wardSexRatioData.find(
                  (w) => w.ward === item.ward,
                );
                return (
                  <tr key={i} className={i % 2 === 0 ? "bg-muted/40" : ""}>
                    <td className="border p-2">{item.ward}</td>
                    <td className="border p-2 text-right">
                      {localizeNumber(
                        item.malePopulation.toLocaleString(),
                        "ne",
                      )}
                    </td>
                    <td className="border p-2 text-right">
                      {localizeNumber(
                        item.femalePopulation.toLocaleString(),
                        "ne",
                      )}
                    </td>
                    <td className="border p-2 text-right">
                      {localizeNumber(
                        item.otherPopulation.toLocaleString(),
                        "ne",
                      )}
                    </td>
                    <td className="border p-2 text-right">
                      {localizeNumber(
                        (matchingSexRatio?.sexRatio || 0).toFixed(2),
                        "ne",
                      )}
                    </td>
                  </tr>
                );
              })}
              <tr className="font-semibold bg-muted/70">
                <td className="border p-2">कुल</td>
                <td className="border p-2 text-right">
                  {localizeNumber(
                    municipalityStats.malePopulation.toLocaleString(),
                    "ne",
                  )}
                </td>
                <td className="border p-2 text-right">
                  {localizeNumber(
                    municipalityStats.femalePopulation.toLocaleString(),
                    "ne",
                  )}
                </td>
                <td className="border p-2 text-right">
                  {localizeNumber(
                    municipalityStats.otherPopulation.toLocaleString(),
                    "ne",
                  )}
                </td>
                <td className="border p-2 text-right">
                  {localizeNumber(
                    municipalityAverages.sexRatio.toFixed(2),
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
