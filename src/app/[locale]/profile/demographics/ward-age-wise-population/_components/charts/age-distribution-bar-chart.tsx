"use client";

import {
  BarChart,
  Bar,
  ResponsiveContainer,
  Tooltip,
  Legend,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { localizeNumber } from "@/lib/utils/localize-number";

interface AgeDistributionBarChartProps {
  overallSummaryByAge: Array<{
    ageGroup: string;
    ageGroupName: string;
    total: number;
    male: number;
    female: number;
    other: number;
  }>;
  GENDER_NAMES: Record<string, string>;
  GENDER_COLORS: Record<string, string>;
}

export default function AgeDistributionBarChart({
  overallSummaryByAge,
  GENDER_NAMES,
  GENDER_COLORS,
}: AgeDistributionBarChartProps) {
  // Custom tooltip component with Nepali numbers
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 border shadow-sm rounded-md">
          <p className="font-medium">उमेर समूह: {label}</p>
          <div className="space-y-1 mt-2">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  ></div>
                  <span>{entry.name}: </span>
                </div>
                <span className="font-medium">
                  {localizeNumber(Math.abs(entry.value).toLocaleString(), "ne")}
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
        data={overallSummaryByAge}
        layout="vertical"
        margin={{ top: 20, right: 30, left: 80, bottom: 10 }}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <XAxis
          type="number"
          tickFormatter={(value) => localizeNumber(value.toString(), "ne")}
        />
        <YAxis
          dataKey="ageGroupName"
          type="category"
          tick={{ fontSize: 12 }}
          width={70}
        />
        <Tooltip content={CustomTooltip} />
        <Legend />
        <Bar
          dataKey="male"
          name={GENDER_NAMES["MALE"]}
          fill={GENDER_COLORS["MALE"]}
          stackId="a"
        />
        <Bar
          dataKey="female"
          name={GENDER_NAMES["FEMALE"]}
          fill={GENDER_COLORS["FEMALE"]}
          stackId="a"
        />
        <Bar
          dataKey="other"
          name={GENDER_NAMES["OTHER"]}
          fill={GENDER_COLORS["OTHER"]}
          stackId="a"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
