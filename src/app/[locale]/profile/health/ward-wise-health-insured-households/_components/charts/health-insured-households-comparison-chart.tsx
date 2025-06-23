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

interface HealthInsuredHouseholdsComparisonChartProps {
  wardInsuredPercentages: Array<{
    wardNumber: number;
    percentage: number;
  }>;
  bestInsuranceWard: {
    wardNumber: number;
    percentage: number;
  };
  worstInsuranceWard: {
    wardNumber: number;
    percentage: number;
  };
}

export default function HealthInsuredHouseholdsComparisonChart({
  wardInsuredPercentages,
  bestInsuranceWard,
  worstInsuranceWard,
}: HealthInsuredHouseholdsComparisonChartProps) {
  // Format data for the chart - compare insurance rates
  const chartData = wardInsuredPercentages.map((ward) => ({
    name: `वडा ${localizeNumber(ward.wardNumber, "ne")}`,
    "InsuranceRate": ward.percentage,
  })).sort((a, b) => 
    b["InsuranceRate"] - a["InsuranceRate"]
  );

  // Calculate average insurance rate
  const avgInsuranceRate =
    wardInsuredPercentages.reduce((sum, ward) => sum + ward.percentage, 0) / wardInsuredPercentages.length;

  // Custom tooltip for displaying percentages with Nepali numbers
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 border shadow-sm rounded-md">
          <p className="font-medium">{label}</p>
          <div className="space-y-1 mt-2">
            {payload.map((entry: any, index: number) => {
              let displayName = entry.name;
              if (entry.name === "InsuranceRate") {
                displayName = "बीमा दर";
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
          domain={[0, Math.max(Math.ceil(bestInsuranceWard?.percentage || 30), 30)]}
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
            if (value === "InsuranceRate") {
              return "बीमा दर";
            }
            return value;
          }}
        />
        <Bar
          dataKey="InsuranceRate"
          fill="#4285F4" // Blue color
          radius={[4, 4, 0, 0]}
        />
        <ReferenceLine
          y={avgInsuranceRate}
          stroke="#4285F4"
          strokeDasharray="3 3"
          label={{
            value: `औसत: ${localizeNumber(avgInsuranceRate.toFixed(2), "ne")}%`,
            position: "insideBottomRight",
            style: { fill: "#4285F4", fontSize: 12 },
          }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
