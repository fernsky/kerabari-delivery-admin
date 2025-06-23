"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { localizeNumber } from "@/lib/utils/localize-number";

interface GenderDistributionPieChartProps {
  overallSummaryByGender: Array<{
    gender: string;
    genderName: string;
    population: number;
  }>;
  totalPopulation: number;
  GENDER_COLORS: Record<string, string>;
}

export default function GenderDistributionPieChart({
  overallSummaryByGender,
  totalPopulation,
  GENDER_COLORS,
}: GenderDistributionPieChartProps) {
  const pieData = overallSummaryByGender.map((item) => ({
    name: item.genderName,
    value: item.population,
    percentage: ((item.population / totalPopulation) * 100).toFixed(2),
  }));

  // Custom tooltip with Nepali digits
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const { name, value, payload: originalPayload } = payload[0];
      const percentage = originalPayload.percentage;
      return (
        <div className="bg-background p-3 border shadow-sm rounded-md">
          <p className="font-medium">{name}</p>
          <div className="flex justify-between gap-4 mt-1">
            <span className="text-sm">जनसंख्या:</span>
            <span className="font-medium">
              {localizeNumber(value.toLocaleString(), "ne")}
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-sm">प्रतिशत:</span>
            <span className="font-medium">
              {localizeNumber(percentage, "ne")}%
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
            >
              {overallSummaryByGender.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    GENDER_COLORS[
                      entry.gender as keyof typeof GENDER_COLORS
                    ] || "#888"
                  }
                />
              ))}
            </Pie>
            <Tooltip content={CustomTooltip} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Custom Legend with percentage bars */}
      <div className="mt-4">
        <div className="grid grid-cols-1 gap-2">
          {pieData.map((item, i) => {
            const percentage = parseFloat(item.percentage);
            const gender = overallSummaryByGender[i]?.gender || "";

            return (
              <div key={i} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor:
                      GENDER_COLORS[gender as keyof typeof GENDER_COLORS] ||
                      "#888",
                  }}
                ></div>
                <div className="flex-grow">
                  <div className="flex justify-between items-center text-xs">
                    <span className="truncate">{item.name}</span>
                    <span className="font-medium">
                      {localizeNumber(percentage.toFixed(1), "ne")}%
                    </span>
                  </div>
                  <div className="w-full bg-muted h-1.5 rounded-full mt-0.5 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor:
                          GENDER_COLORS[gender as keyof typeof GENDER_COLORS] ||
                          "#888",
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
