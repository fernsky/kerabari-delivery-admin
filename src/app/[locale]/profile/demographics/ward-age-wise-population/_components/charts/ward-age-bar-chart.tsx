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

interface WardAgeBarChartProps {
  wardWiseData: Array<Record<string, any>>;
  AGE_CATEGORY_COLORS: Record<string, string>;
}

export default function WardAgeBarChart({
  wardWiseData,
  AGE_CATEGORY_COLORS,
}: WardAgeBarChartProps) {
  // Custom tooltip with Nepali digits
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 border shadow-sm rounded-md">
          <p className="font-medium">{label}</p>
          <div className="space-y-1 mt-2">
            {payload.map((entry: any, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  ></div>
                  <span>{entry.name}: </span>
                </div>
                <span className="font-medium">
                  {localizeNumber(entry.value.toLocaleString(), "ne")}
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
        data={wardWiseData}
        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        barSize={20}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <XAxis
          dataKey="ward"
          scale="point"
          padding={{ left: 10, right: 10 }}
          tick={{ fontSize: 12 }}
        />
        <YAxis tickFormatter={(value) => localizeNumber(value.toString(), "ne")} />
        <Tooltip content={CustomTooltip} />
        <Legend
          wrapperStyle={{ paddingTop: 20 }}
          layout="horizontal"
          verticalAlign="bottom"
          align="center"
        />
        {/* Dynamically generate bars for age categories */}
        {Object.keys(AGE_CATEGORY_COLORS).map((category) => (
          <Bar
            key={category}
            dataKey={category}
            name={category}
            fill={
              AGE_CATEGORY_COLORS[
                category as keyof typeof AGE_CATEGORY_COLORS
              ]
            }
            stackId="a"
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
