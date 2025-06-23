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

interface AgricultureHouseholdsComparisonChartProps {
  wardWiseAnalysis: Array<{
    wardNumber: number;
    totalHouseholds: number;
    involvedHouseholds: number;
    nonInvolvedHouseholds: number;
    involvedPercentage: number;
    nonInvolvedPercentage: number;
  }>;
  AGRICULTURE_STATUS: {
    INVOLVED: { name: string; nameEn: string; color: string; };
    NOT_INVOLVED: { name: string; nameEn: string; color: string; };
  };
}

export default function AgricultureHouseholdsComparisonChart({
  wardWiseAnalysis,
  AGRICULTURE_STATUS,
}: AgricultureHouseholdsComparisonChartProps) {
  // Format data for the chart
  const chartData = wardWiseAnalysis.map((ward) => ({
    name: `वडा ${ward.wardNumber}`,
    [AGRICULTURE_STATUS.INVOLVED.name]: ward.involvedPercentage,
    [AGRICULTURE_STATUS.NOT_INVOLVED.name]: ward.nonInvolvedPercentage,
  }));

  // Calculate average involvement rate
  const avgInvolvementRate =
    wardWiseAnalysis.reduce((sum, ward) => sum + ward.involvedPercentage, 0) / wardWiseAnalysis.length;

  // Custom tooltip for displaying percentages with Nepali numbers
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 border shadow-sm rounded-md">
          <p className="font-medium">{label}</p>
          <div className="space-y-1 mt-2">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: entry.color }}
                ></div>
                <span>{entry.name}: </span>
                <span className="font-medium">
                  {localizeNumber(entry.value.toFixed(2), "ne")}%
                </span>
              </div>
            ))}
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
          domain={[0, 100]}
          label={{
            value: "प्रतिशत",
            angle: -90,
            position: "insideLeft",
            style: { textAnchor: "middle" },
          }}
        />
        <Tooltip content={CustomTooltip} />
        <Legend />
        <Bar
          dataKey={AGRICULTURE_STATUS.INVOLVED.name}
          fill={AGRICULTURE_STATUS.INVOLVED.color}
          radius={[4, 4, 0, 0]}
        />
        <ReferenceLine
          y={avgInvolvementRate}
          stroke="#8884d8"
          strokeDasharray="3 3"
          label={{
            value: `औसत: ${localizeNumber(avgInvolvementRate.toFixed(2), "ne")}%`,
            position: "insideBottomRight",
            style: { fill: "#8884d8", fontSize: 12 },
          }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
