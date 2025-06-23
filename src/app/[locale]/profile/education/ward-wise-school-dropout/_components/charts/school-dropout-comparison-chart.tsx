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

interface SchoolDropoutComparisonChartProps {
  wardWiseEconomicDropout: Array<{
    wardNumber: number;
    percentage: number;
  }>;
  highestEconomicDropoutWard: {
    wardNumber: number;
    percentage: number;
  };
  lowestEconomicDropoutWard: {
    wardNumber: number;
    percentage: number;
  };
  DROPOUT_CAUSE_GROUPS: Record<string, {
    name: string;
    nameEn: string;
    color: string;
    causes: string[];
  }>;
}

export default function SchoolDropoutComparisonChart({
  wardWiseEconomicDropout,
  highestEconomicDropoutWard,
  lowestEconomicDropoutWard,
  DROPOUT_CAUSE_GROUPS,
}: SchoolDropoutComparisonChartProps) {
  // Format data for the chart - compare economic-related dropout rates
  const chartData = wardWiseEconomicDropout.map((ward) => ({
    name: `वडा ${ward.wardNumber}`,
    "Economic": ward.percentage,
  })).sort((a, b) => 
    b["Economic"] - a["Economic"]
  );

  // Calculate average economic-related dropout rate
  const avgEconomicDropoutRate =
    wardWiseEconomicDropout.reduce((sum, ward) => sum + ward.percentage, 0) / wardWiseEconomicDropout.length;

  // Custom tooltip for displaying percentages with Nepali numbers
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 border shadow-sm rounded-md">
          <p className="font-medium">{localizeNumber(label, "ne")}</p>
          <div className="space-y-1 mt-2">
            {payload.map((entry: any, index: number) => {
              let displayName = entry.name;
              if (entry.name === "Economic") {
                displayName = "आर्थिक सम्बन्धी";
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
              Math.ceil(highestEconomicDropoutWard?.percentage || 30),
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
            if (value === "Economic") {
              return "आर्थिक सम्बन्धी कारण";
            }
            return value;
          }}
        />
        <Bar
          dataKey="Economic"
          fill={DROPOUT_CAUSE_GROUPS.ECONOMIC.color}
          radius={[4, 4, 0, 0]}
        />
        <ReferenceLine
          y={avgEconomicDropoutRate}
          stroke={DROPOUT_CAUSE_GROUPS.ECONOMIC.color}
          strokeDasharray="3 3"
          label={{
            value: `औसत: ${localizeNumber(avgEconomicDropoutRate.toFixed(2), "ne")}%`,
            position: "insideBottomRight",
            style: {
              fill: DROPOUT_CAUSE_GROUPS.ECONOMIC.color,
              fontSize: 12,
            },
          }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
