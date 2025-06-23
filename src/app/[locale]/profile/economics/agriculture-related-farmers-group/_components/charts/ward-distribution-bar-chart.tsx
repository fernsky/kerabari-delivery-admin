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
    wardNumber: number;
  }>;
  WARD_COLORS: Record<number, string>;
}

export default function WardDistributionBarChart({
  data,
  WARD_COLORS,
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

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
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
              fill={WARD_COLORS[entry.wardNumber] || "#95a5a6"}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
