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
  Cell
} from "recharts";
import { localizeNumber } from "@/lib/utils/localize-number";

interface WardDistributionBarChartProps {
  data: Array<{
    name: string;
    value: number;
    percentage: string;
  }>;
}

export default function WardDistributionBarChart({
  data,
}: WardDistributionBarChartProps) {
  // Custom tooltip component for better presentation with Nepali numbers
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 border shadow-sm rounded-md">
          <p className="font-medium">{label}</p>
          <div className="space-y-1 mt-2">
            <div className="flex justify-between gap-4">
              <span className="text-sm">समूह संख्या:</span>
              <span className="font-medium">
                {localizeNumber(payload[0].value.toString(), "ne")}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-sm">प्रतिशत:</span>
              <span className="font-medium">
                {localizeNumber(
                  payload[0].payload.percentage.toString(),
                  "ne"
                )}%
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Create gradient colors for the bar
  const getGradientColor = (value: number, max: number) => {
    const percentage = (value / max) * 100;
    if (percentage >= 75) return "url(#colorHighest)";
    if (percentage >= 50) return "url(#colorHigh)";
    if (percentage >= 25) return "url(#colorMedium)";
    return "url(#colorLow)";
  };

  const maxValue = Math.max(...data.map((item) => item.value));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <defs>
          <linearGradient id="colorHighest" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3498db" stopOpacity={0.9} />
            <stop offset="100%" stopColor="#3498db" stopOpacity={0.7} />
          </linearGradient>
          <linearGradient id="colorHigh" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2980b9" stopOpacity={0.9} />
            <stop offset="100%" stopColor="#2980b9" stopOpacity={0.7} />
          </linearGradient>
          <linearGradient id="colorMedium" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2c3e50" stopOpacity={0.9} />
            <stop offset="100%" stopColor="#2c3e50" stopOpacity={0.7} />
          </linearGradient>
          <linearGradient id="colorLow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7f8c8d" stopOpacity={0.9} />
            <stop offset="100%" stopColor="#7f8c8d" stopOpacity={0.7} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis
          tickFormatter={(value) => localizeNumber(value.toString(), "ne")}
          label={{
            value: "समूह संख्या",
            angle: -90,
            position: "insideLeft",
            style: { textAnchor: "middle" },
          }}
        />
        <Tooltip content={CustomTooltip} />
        <Legend />
        <Bar
          dataKey="value"
          name="समूह संख्या"
          radius={[4, 4, 0, 0]}
          fill="#3498db"
          stroke="#2980b9"
          strokeWidth={1}
          fillOpacity={0.8}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={getGradientColor(entry.value, maxValue)}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
