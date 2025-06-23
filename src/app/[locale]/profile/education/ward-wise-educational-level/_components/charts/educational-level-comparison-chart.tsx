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

interface EducationalLevelComparisonChartProps {
  wardWiseHigherEducation: Array<{
    wardNumber: number;
    percentage: number;
  }>;
  bestEducatedWard: {
    wardNumber: number;
    percentage: number;
  };
  leastEducatedWard: {
    wardNumber: number;
    percentage: number;
  };
  EDUCATIONAL_LEVEL_GROUPS: Record<string, {
    name: string;
    nameEn: string;
    color: string;
    levels: string[];
  }>;
}

export default function EducationalLevelComparisonChart({
  wardWiseHigherEducation,
  bestEducatedWard,
  leastEducatedWard,
  EDUCATIONAL_LEVEL_GROUPS,
}: EducationalLevelComparisonChartProps) {
  // Format data for the chart - compare higher education rates
  const chartData = wardWiseHigherEducation.map((ward) => ({
    name: `वडा ${ward.wardNumber}`,
    "Higher Education": ward.percentage,
  })).sort((a, b) => 
    b["Higher Education"] - a["Higher Education"]
  );

  // Calculate average higher education rate
  const avgHigherEducationRate =
    wardWiseHigherEducation.reduce((sum, ward) => sum + ward.percentage, 0) / wardWiseHigherEducation.length;

  // Custom tooltip for displaying percentages with Nepali numbers
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 border shadow-sm rounded-md">
          <p className="font-medium">{localizeNumber(label, "ne")}</p>
          <div className="space-y-1 mt-2">
            {payload.map((entry: any, index: number) => {
              let displayName = entry.name;
              if (entry.name === "Higher Education") {
                displayName = "उच्च शिक्षा";
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
            Math.max(Math.ceil(bestEducatedWard?.percentage || 30), 30),
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
            if (value === "Higher Education") {
              return "उच्च शिक्षा दर";
            }
            return value;
          }}
        />
        <Bar
          dataKey="Higher Education"
          fill={EDUCATIONAL_LEVEL_GROUPS.HIGHER_EDUCATION.color}
          radius={[4, 4, 0, 0]}
        />
        <ReferenceLine
          y={avgHigherEducationRate}
          stroke={EDUCATIONAL_LEVEL_GROUPS.HIGHER_EDUCATION.color}
          strokeDasharray="3 3"
          label={{
            value: `औसत: ${localizeNumber(avgHigherEducationRate.toFixed(2), "ne")}%`,
            position: "insideBottomRight",
            style: {
              fill: EDUCATIONAL_LEVEL_GROUPS.HIGHER_EDUCATION.color,
              fontSize: 12,
            },
          }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
