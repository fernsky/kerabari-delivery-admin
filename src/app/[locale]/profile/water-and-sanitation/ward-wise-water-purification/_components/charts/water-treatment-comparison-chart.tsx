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

interface WaterTreatmentComparisonChartProps {
  wardWiseAnalysis: Array<{
    wardNumber: number;
    totalHouseholds: number;
    mostCommonMethod: string;
    mostCommonMethodName: string;
    mostCommonMethodHouseholds: number;
    mostCommonMethodPercentage: string;
    treatingHouseholds: number;
    treatingPercentage: string;
    methodPercentages: Record<string, string>;
  }>;
  highestTreatmentWard?: {
    wardNumber: number;
    treatingPercentage: string;
  };
  lowestTreatmentWard?: {
    wardNumber: number;
    treatingPercentage: string;
  };
  WATER_PURIFICATION_COLORS: Record<string, string>;
}

export default function WaterTreatmentComparisonChart({
  wardWiseAnalysis,
  highestTreatmentWard,
  lowestTreatmentWard,
  WATER_PURIFICATION_COLORS,
}: WaterTreatmentComparisonChartProps) {
  // Format data for the chart - compare water treatment rates
  const chartData = [...wardWiseAnalysis]
    .map((ward) => ({
      name: `वडा ${ward.wardNumber}`,
      "TreatmentRate": parseFloat(ward.treatingPercentage),
      untreatedRate: 100 - parseFloat(ward.treatingPercentage),
      wardNumber: ward.wardNumber,
    }))
    .sort((a, b) => b.TreatmentRate - a.TreatmentRate);

  // Calculate average treatment rate
  const avgTreatmentRate =
    wardWiseAnalysis.reduce((sum, ward) => sum + parseFloat(ward.treatingPercentage), 0) / 
    wardWiseAnalysis.length;

  // Custom tooltip for displaying percentages with Nepali numbers
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 border shadow-sm rounded-md">
          <p className="font-medium">{localizeNumber(label, "ne")}</p>
          <div className="space-y-1 mt-2">
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: "#3498DB" }}
              ></div>
              <span>पानी उपचार दर: </span>
              <span className="font-medium">
                {localizeNumber(payload[0]?.value.toFixed(2), "ne")}%
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: "#95A5A6" }}
              ></div>
              <span>उपचार नगर्ने दर: </span>
              <span className="font-medium">
                {localizeNumber((100 - payload[0]?.value).toFixed(2), "ne")}%
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
            if (value === "TreatmentRate") {
              return "पानी उपचार दर";
            }
            return value;
          }}
        />
        <Bar
          dataKey="TreatmentRate"
          name="TreatmentRate"
          fill="#3498DB"
          radius={[4, 4, 0, 0]}
        />
        <ReferenceLine
          y={avgTreatmentRate}
          stroke="#3498DB"
          strokeDasharray="3 3"
          label={{
            value: `औसत: ${localizeNumber(avgTreatmentRate.toFixed(2), "ne")}%`,
            position: "insideBottomRight",
            style: {
              fill: "#3498DB",
              fontSize: 12,
            },
          }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
