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

interface BusinessTrendChartProps {
  data: Array<{
    year: string;
    [key: string]: any;
  }>;
  businessTypes: string[];
  BUSINESS_TYPES: Record<string, string>;
  BUSINESS_COLORS: Record<string, string>;
}

export default function BusinessTrendChart({
  data,
  businessTypes,
  BUSINESS_TYPES,
  BUSINESS_COLORS,
}: BusinessTrendChartProps) {
  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 border shadow-sm rounded-md">
          <p className="font-medium">{label} साल</p>
          <div className="mt-2 space-y-1">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                ></div>
                <span>{BUSINESS_TYPES[entry.dataKey] || entry.dataKey}:</span>
                <span className="font-medium">
                  {localizeNumber(entry.value.toString(), "ne")} समूह
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
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <XAxis dataKey="year" />
        <YAxis tickFormatter={(value) => localizeNumber(value.toString(), "ne")} />
        <Tooltip content={CustomTooltip} />
        <Legend
          formatter={(value) => BUSINESS_TYPES[value] || value}
          wrapperStyle={{ fontSize: "12px" }}
        />
        {businessTypes.map((type, index) => (
          <Line
            key={type}
            type="monotone"
            dataKey={type}
            stroke={BUSINESS_COLORS[type] || `#${Math.floor(Math.random() * 16777215).toString(16)}`}
            strokeWidth={2}
            activeDot={{ r: 8 }}
            dot={{ r: 4 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
