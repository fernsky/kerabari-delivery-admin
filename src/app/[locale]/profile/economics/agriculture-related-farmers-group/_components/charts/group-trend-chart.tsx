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

interface GroupTrendChartProps {
  data: Array<{
    year: string;
    [key: string]: any;
  }>;
  wardNumbers: string[];
  WARD_COLORS: Record<number, string>;
}

export default function GroupTrendChart({
  data,
  wardNumbers,
  WARD_COLORS,
}: GroupTrendChartProps) {
  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 border shadow-sm rounded-md">
          <p className="font-medium">{label} साल</p>
          <div className="mt-2 space-y-1">
            {payload.map((entry: any, index: number) => {
              const wardNumber = parseInt(entry.dataKey.replace('वडा ', ''));
              return (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  ></div>
                  <span>{entry.dataKey}:</span>
                  <span className="font-medium">
                    {localizeNumber(entry.value.toString(), "ne")} समूह
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
      <LineChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <XAxis dataKey="year" />
        <YAxis tickFormatter={(value) => localizeNumber(value.toString(), "ne")} />
        <Tooltip content={CustomTooltip} />
        <Legend wrapperStyle={{ fontSize: "12px" }} />
        {wardNumbers.map((ward, index) => {
          const wardNumber = parseInt(ward.replace('वडा ', ''));
          return (
            <Line
              key={ward}
              type="monotone"
              dataKey={ward}
              stroke={WARD_COLORS[wardNumber] || `#${Math.floor(Math.random() * 16777215).toString(16)}`}
              strokeWidth={2}
              activeDot={{ r: 8 }}
              dot={{ r: 4 }}
            />
          );
        })}
      </LineChart>
    </ResponsiveContainer>
  );
}
