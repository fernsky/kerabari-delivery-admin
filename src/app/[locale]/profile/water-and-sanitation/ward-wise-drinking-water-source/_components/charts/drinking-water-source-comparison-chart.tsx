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

interface DrinkingWaterSourceComparisonChartProps {
  wardWisePipedWaterPercentage: Array<{
    wardNumber: number;
    percentage: number;
  }>;
  highestPipedWaterWard: {
    wardNumber: number;
    percentage: number;
  };
  lowestPipedWaterWard: {
    wardNumber: number;
    percentage: number;
  };
  WATER_SOURCE_GROUPS: Record<string, {
    name: string;
    nameEn: string;
    color: string;
    sources: string[];
  }>;
}

export default function DrinkingWaterSourceComparisonChart({
  wardWisePipedWaterPercentage,
  highestPipedWaterWard,
  lowestPipedWaterWard,
  WATER_SOURCE_GROUPS,
}: DrinkingWaterSourceComparisonChartProps) {
  // Format data for the chart - compare piped water access rates
  const chartData = wardWisePipedWaterPercentage.map((ward) => ({
    name: `वडा ${ward.wardNumber}`,
    "Piped": ward.percentage,
  })).sort((a, b) => 
    b["Piped"] - a["Piped"]
  );

  // Calculate average piped water access rate
  const avgPipedWaterRate =
    wardWisePipedWaterPercentage.reduce((sum, ward) => sum + ward.percentage, 0) / wardWisePipedWaterPercentage.length;

  // Custom tooltip for displaying percentages with Nepali numbers
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 border shadow-sm rounded-md">
          <p className="font-medium">{localizeNumber(label, "ne")}</p>
          <div className="space-y-1 mt-2">
            {payload.map((entry: any, index: number) => {
              let displayName = entry.name;
              if (entry.name === "Piped") {
                displayName = "पाइपको पानी";
              }
              
              return (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  ></div>
                  <span>{displayName}: </span>
                  <span className="font-medium">
                    {localizeNumber(entry.value.toFixed(2), "ne")}%
                  </span>
                </div>
              );
            })}
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
          tickFormatter={(value) => `${localizeNumber(value, "ne")}`}
        />
        <YAxis
          tickFormatter={(value) => `${localizeNumber(value, "ne")}%`}
          domain={[
            0,
            Math.max(
              Math.ceil(highestPipedWaterWard?.percentage || 30),
              30,
            ),
          ]}
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
            if (value === "Piped") {
              return "पाइपको पानीको पहुँच दर";
            }
            return value;
          }}
        />
        <Bar
          dataKey="Piped"
          fill={WATER_SOURCE_GROUPS.PIPED_WATER.color}
          radius={[4, 4, 0, 0]}
        />
        <ReferenceLine
          y={avgPipedWaterRate}
          stroke={WATER_SOURCE_GROUPS.PIPED_WATER.color}
          strokeDasharray="3 3"
          label={{
            value: `औसत: ${localizeNumber(avgPipedWaterRate.toFixed(2), "ne")}%`,
            position: "insideBottomRight",
            style: {
              fill: WATER_SOURCE_GROUPS.PIPED_WATER.color,
              fontSize: 12,
            },
          }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
