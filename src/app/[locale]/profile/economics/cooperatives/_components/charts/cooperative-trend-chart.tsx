"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { localizeNumber } from "@/lib/utils/localize-number";

interface CooperativeTrendChartProps {
  data: Array<Record<string, any>>;
  cooperativeTypes: string[];
  COOPERATIVE_TYPES: Record<string, string>;
  COOPERATIVE_COLORS: Record<string, string>;
}

export default function CooperativeTrendChart({
  data,
  cooperativeTypes,
  COOPERATIVE_TYPES,
  COOPERATIVE_COLORS,
}: CooperativeTrendChartProps) {
  // Custom tooltip component with Nepali numbers
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 border shadow-sm rounded-md">
          <p className="font-medium text-center mb-2">वर्ष {label}</p>
          <div className="space-y-1">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: entry.stroke }}
                  ></div>
                  <span>{COOPERATIVE_TYPES[entry.dataKey]}</span>
                </div>
                <span className="font-medium">
                  {localizeNumber(entry.value.toString(), "ne")}
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
      <LineChart
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 20,
          bottom: 30,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
        <XAxis
          dataKey="year"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={{ stroke: "#e0e0e0" }}
          padding={{ left: 10, right: 10 }}
        />
        <YAxis
          tickFormatter={(value) => localizeNumber(value.toString(), "ne")}
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={{ stroke: "#e0e0e0" }}
        />
        <Tooltip content={CustomTooltip} />
        <Legend
          formatter={(value) => COOPERATIVE_TYPES[value] || value}
          verticalAlign="bottom"
          wrapperStyle={{ paddingTop: "20px" }}
        />
        {cooperativeTypes.map((type, index) => (
          <Line
            key={type}
            type="monotone"
            dataKey={type}
            stroke={COOPERATIVE_COLORS[type] || "#95a5a6"}
            strokeWidth={2}
            activeDot={{ r: 6 }}
            dot={{ r: 4, strokeWidth: 2 }}
            animationDuration={1500 + index * 300}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
