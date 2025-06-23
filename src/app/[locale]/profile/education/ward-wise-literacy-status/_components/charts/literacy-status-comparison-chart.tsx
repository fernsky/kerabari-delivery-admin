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

interface LiteracyStatusComparisonChartProps {
  wardWiseAnalysis: Array<{
    wardNumber: number;
    totalPopulation: number;
    bothReadingWritingPopulation: number;
    readingOnlyPopulation: number;
    illiteratePopulation: number;
    bothReadingWritingPercent: number;
    readingOnlyPercent: number;
    illiteratePercent: number;
    literacyPercent: number;
  }>;
  LITERACY_STATUS_TYPES: Record<string, {
    name: string;
    nameEn: string;
    color: string;
  }>;
}

export default function LiteracyStatusComparisonChart({
  wardWiseAnalysis,
  LITERACY_STATUS_TYPES,
}: LiteracyStatusComparisonChartProps) {
  // Format data for the chart - we'll focus on literacy vs illiteracy
  const chartData = wardWiseAnalysis.map((ward) => ({
    name: `वडा ${ward.wardNumber}`,
    [LITERACY_STATUS_TYPES.BOTH_READING_AND_WRITING.nameEn]: ward.bothReadingWritingPercent,
    [LITERACY_STATUS_TYPES.ILLITERATE.nameEn]: ward.illiteratePercent,
    "Literacy Rate": ward.literacyPercent,
  })).sort((a, b) => 
    b["Literacy Rate"] - a["Literacy Rate"]
  );

  // Calculate average literacy rate
  const avgLiteracyRate =
    wardWiseAnalysis.reduce((sum, ward) => sum + ward.literacyPercent, 0) / wardWiseAnalysis.length;

  // Custom tooltip for displaying percentages with Nepali numbers
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 border shadow-sm rounded-md">
          <p className="font-medium">{localizeNumber(label, "ne")}</p>
          <div className="space-y-1 mt-2">
            {payload.map((entry: any, index: number) => {
              let displayName = entry.name;
              if (entry.name === LITERACY_STATUS_TYPES.BOTH_READING_AND_WRITING.nameEn) {
                displayName = LITERACY_STATUS_TYPES.BOTH_READING_AND_WRITING.name;
              } else if (entry.name === LITERACY_STATUS_TYPES.ILLITERATE.nameEn) {
                displayName = LITERACY_STATUS_TYPES.ILLITERATE.name;
              } else if (entry.name === "Literacy Rate") {
                displayName = "साक्षरता दर";
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
            if (
              value === LITERACY_STATUS_TYPES.BOTH_READING_AND_WRITING.nameEn
            ) {
              return LITERACY_STATUS_TYPES.BOTH_READING_AND_WRITING.name;
            } else if (value === LITERACY_STATUS_TYPES.ILLITERATE.nameEn) {
              return LITERACY_STATUS_TYPES.ILLITERATE.name;
            } else if (value === "Literacy Rate") {
              return "साक्षरता दर";
            }
            return value;
          }}
        />
        <Bar
          dataKey={LITERACY_STATUS_TYPES.BOTH_READING_AND_WRITING.nameEn}
          fill={LITERACY_STATUS_TYPES.BOTH_READING_AND_WRITING.color}
        />
        <Bar
          dataKey={LITERACY_STATUS_TYPES.ILLITERATE.nameEn}
          fill={LITERACY_STATUS_TYPES.ILLITERATE.color}
        />
        <Bar dataKey="Literacy Rate" fill="#3498db" radius={[4, 4, 0, 0]} />
        <ReferenceLine
          y={avgLiteracyRate}
          stroke="#3498db"
          strokeDasharray="3 3"
          label={{
            value: `औसत: ${localizeNumber(avgLiteracyRate.toFixed(2), "ne")}%`,
            position: "insideBottomRight",
            style: { fill: "#3498db", fontSize: 12 },
          }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
