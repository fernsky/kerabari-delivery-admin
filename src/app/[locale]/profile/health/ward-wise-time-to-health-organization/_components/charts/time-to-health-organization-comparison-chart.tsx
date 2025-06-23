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

interface TimeToHealthOrganizationComparisonChartProps {
  wardWiseQuickAccess: Array<{
    wardNumber: number;
    percentage: number;
  }>;
  bestAccessWard: {
    wardNumber: number;
    percentage: number;
  };
  worstAccessWard: {
    wardNumber: number;
    percentage: number;
  };
  TIME_CATEGORIES: Record<string, {
    name: string;
    nameEn: string;
    color: string;
  }>;
}

export default function TimeToHealthOrganizationComparisonChart({
  wardWiseQuickAccess,
  bestAccessWard,
  worstAccessWard,
  TIME_CATEGORIES,
}: TimeToHealthOrganizationComparisonChartProps) {
  // Format data for the chart - compare quick access (under 30 min) rates
  const chartData = wardWiseQuickAccess.map((ward) => ({
    name: `वडा ${localizeNumber(ward.wardNumber, "ne")}`,
    "QuickAccess": ward.percentage,
  })).sort((a, b) => 
    b["QuickAccess"] - a["QuickAccess"]
  );

  // Calculate average quick access rate
  const avgQuickAccessRate =
    wardWiseQuickAccess.reduce((sum, ward) => sum + ward.percentage, 0) / wardWiseQuickAccess.length;

  // Custom tooltip for displaying percentages with Nepali numbers
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 border shadow-sm rounded-md">
          <p className="font-medium">{localizeNumber(label, "ne")}</p>
          <div className="space-y-1 mt-2">
            {payload.map((entry: any, index: number) => {
              let displayName = entry.name;
              if (entry.name === "QuickAccess") {
                displayName = "छिटो पहुँच (३० मिनेटभित्र)";
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
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis
          tickFormatter={(value) => `${localizeNumber(value, "ne")}%`}
          domain={[0, Math.max(Math.ceil(bestAccessWard?.percentage || 30), 30)]}
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
            if (value === "QuickAccess") {
              return "छिटो पहुँच (३० मिनेटभित्र)";
            }
            return value;
          }}
        />
        <Bar
          dataKey="QuickAccess"
          fill={TIME_CATEGORIES.UNDER_30_MIN.color}
          radius={[4, 4, 0, 0]}
        />
        <ReferenceLine
          y={avgQuickAccessRate}
          stroke={TIME_CATEGORIES.UNDER_30_MIN.color}
          strokeDasharray="3 3"
          label={{
            value: `औसत: ${localizeNumber(avgQuickAccessRate.toFixed(2), "ne")}%`,
            position: "insideBottomRight",
            style: { fill: TIME_CATEGORIES.UNDER_30_MIN.color, fontSize: 12 },
          }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
