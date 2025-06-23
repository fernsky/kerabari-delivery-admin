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

interface SolidWasteManagementComparisonChartProps {
  wardWiseHomeCollectionPercentage: Array<{
    wardNumber: number;
    percentage: number;
  }>;
  highestHomeCollectionWard: {
    wardNumber: number;
    percentage: number;
  };
  lowestHomeCollectionWard: {
    wardNumber: number;
    percentage: number;
  };
  WASTE_MANAGEMENT_COLORS: Record<string, string>;
}

export default function SolidWasteManagementComparisonChart({
  wardWiseHomeCollectionPercentage,
  highestHomeCollectionWard,
  lowestHomeCollectionWard,
  WASTE_MANAGEMENT_COLORS,
}: SolidWasteManagementComparisonChartProps) {
  // Format data for the chart - compare home waste collection rates
  const chartData = wardWiseHomeCollectionPercentage.map((ward) => ({
    name: `वडा ${ward.wardNumber}`,
    "Home": ward.percentage,
  })).sort((a, b) => 
    b["Home"] - a["Home"]
  );

  // Calculate average home collection rate
  const avgHomeCollectionRate =
    wardWiseHomeCollectionPercentage.reduce((sum, ward) => sum + ward.percentage, 0) / wardWiseHomeCollectionPercentage.length;

  // Custom tooltip for displaying percentages with Nepali numbers
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 border shadow-sm rounded-md">
          <p className="font-medium">{localizeNumber(label, "ne")}</p>
          <div className="space-y-1 mt-2">
            {payload.map((entry: any, index: number) => {
              let displayName = entry.name;
              if (entry.name === "Home") {
                displayName = "घरमै संकलन";
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
              Math.ceil(highestHomeCollectionWard?.percentage || 30),
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
            if (value === "Home") {
              return "घरमै फोहोर संकलन दर";
            }
            return value;
          }}
        />
        <Bar
          dataKey="Home"
          fill={WASTE_MANAGEMENT_COLORS["HOME_COLLECTION"]}
          radius={[4, 4, 0, 0]}
        />
        <ReferenceLine
          y={avgHomeCollectionRate}
          stroke={WASTE_MANAGEMENT_COLORS["HOME_COLLECTION"]}
          strokeDasharray="3 3"
          label={{
            value: `औसत: ${localizeNumber(avgHomeCollectionRate.toFixed(2), "ne")}%`,
            position: "insideBottomRight",
            style: {
              fill: WASTE_MANAGEMENT_COLORS["HOME_COLLECTION"],
              fontSize: 12,
            },
          }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
