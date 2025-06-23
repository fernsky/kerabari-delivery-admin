"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { localizeNumber } from "@/lib/utils/localize-number";

interface WardDistributionBarChartProps {
  data: Array<{
    name: string;
    value: number;
    percentage: string;
  }>;
}

export default function WardDistributionBarChart({ data }: WardDistributionBarChartProps) {
  // Custom tooltip component with Nepali numbers
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const { value, payload: originalPayload } = payload[0];
      const percentage = originalPayload.percentage;
      
      return (
        <div className="bg-background p-3 border shadow-sm rounded-md">
          <p className="font-medium">{label}</p>
          <div className="flex justify-between gap-4 mt-1">
            <span>सहकारी संख्या:</span>
            <span className="font-medium">
              {localizeNumber(value.toLocaleString(), "ne")}
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span>प्रतिशत:</span>
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
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
        <XAxis 
          dataKey="name" 
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={{ stroke: "#e0e0e0" }}
        />
        <YAxis
          tickFormatter={(value) => localizeNumber(value.toString(), "ne")}
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={{ stroke: "#e0e0e0" }}
        />
        <Tooltip content={CustomTooltip} cursor={{ fill: "rgba(0, 0, 0, 0.05)" }} />
        <Bar 
          dataKey="value" 
          fill="#3498db" 
          barSize={40}
          radius={[4, 4, 0, 0]}
          animationDuration={1500}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
