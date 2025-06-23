"use client";

import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from "recharts";
import { localizeNumber } from "@/lib/utils/localize-number";

interface SanitationComparisonChartProps {
  wardWiseAnalysis: Array<{
    wardNumber: number;
    totalHouseholds: number;
    mostCommonType: string;
    mostCommonTypeName: string;
    mostCommonTypeHouseholds: number;
    mostCommonTypePercentage: string;
    sanitationHouseholds: number;
    sanitationPercentage: string;
    modernToiletsPercentage: string;
    noToiletsPercentage: string;
    typePercentages: Record<string, string>;
  }>;
  highestSanitationWard?: {
    wardNumber: number;
    sanitationPercentage: string;
  };
  lowestSanitationWard?: {
    wardNumber: number;
    sanitationPercentage: string;
  };
  TOILET_TYPE_COLORS: Record<string, string>;
}

export default function SanitationComparisonChart({
  wardWiseAnalysis,
  highestSanitationWard,
  lowestSanitationWard,
  TOILET_TYPE_COLORS,
}: SanitationComparisonChartProps) {
  // Format data for the chart - compare sanitation rates
  const chartData = [...wardWiseAnalysis]
    .map((ward) => ({
      name: `वडा ${ward.wardNumber}`,
      "SanitationRate": parseFloat(ward.sanitationPercentage),
      noToiletRate: parseFloat(ward.noToiletsPercentage),
      wardNumber: ward.wardNumber,
    }))
    .sort((a, b) => b.SanitationRate - a.SanitationRate);

  // Calculate average sanitation rate
  const avgSanitationRate =
    wardWiseAnalysis.reduce((sum, ward) => sum + parseFloat(ward.sanitationPercentage), 0) / 
    wardWiseAnalysis.length;

  // Custom tooltip for displaying percentages with Nepali numbers
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 border shadow-sm rounded-md">
          <p className="font-medium">{label}</p>
          <div className="space-y-1 mt-2">
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: "#27AE60" }}
              ></div>
              <span>शौचालय उपलब्धता दर: </span>
              <span className="font-medium">
                {localizeNumber(payload[0]?.value.toFixed(2), "ne")}%
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: "#E74C3C" }}
              ></div>
              <span>शौचालय नभएका: </span>
              <span className="font-medium">
                {localizeNumber((payload[1]?.value || 0).toFixed(2), "ne")}%
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        barGap={0}
        barCategoryGap="15%"
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => localizeNumber(value, "ne")}
        />
        <YAxis
          tickFormatter={(value) => `${localizeNumber(value, "ne")}%`}
          domain={[0, 100]}
          label={{
            value: "प्रतिशत",
            angle: -90,
            position: "insideLeft",
            style: { textAnchor: "middle" },
          }}
        />
        <Tooltip content={CustomTooltip} />
        <Legend
          formatter={(value) => {
            if (value === "SanitationRate") {
              return "शौचालय उपलब्धता दर";
            } else if (value === "noToiletRate") {
              return "शौचालय नभएका घरधुरी";
            }
            return value;
          }}
        />
        <Bar
          dataKey="SanitationRate"
          name="SanitationRate"
          fill="#27AE60"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="noToiletRate"
          name="noToiletRate"
          fill="#E74C3C"
          radius={[4, 4, 0, 0]}
        />
        <ReferenceLine
          y={avgSanitationRate}
          stroke="#27AE60"
          strokeDasharray="3 3"
          label={{
            value: `औसत: ${localizeNumber(avgSanitationRate.toFixed(2), "ne")}%`,
            position: "insideBottomRight",
            style: {
              fill: "#27AE60",
              fontSize: 12,
            },
          }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
