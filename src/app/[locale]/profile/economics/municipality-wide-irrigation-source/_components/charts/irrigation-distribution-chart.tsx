"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { localizeNumber } from "@/lib/utils/localize-number";

interface IrrigationDistributionChartProps {
  distributionData: Array<{
    name: string;
    value: number;
    percentage: string;
    color: string;
  }>;
  totalCoverage: number;
}

export default function IrrigationDistributionChart({
  distributionData,
  totalCoverage,
}: IrrigationDistributionChartProps) {
  // Custom tooltip for detailed information
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background p-3 border shadow-sm rounded-md">
          <p className="font-medium">{data.name}</p>
          <div className="mt-2 space-y-1">
            <div className="flex justify-between gap-4">
              <span className="text-sm">क्षेत्रफल:</span>
              <span className="font-medium">
                {localizeNumber(data.value.toFixed(2), "ne")} हेक्टर
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-sm">प्रतिशत:</span>
              <span className="font-medium">
                {localizeNumber(data.percentage, "ne")}%
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
        data={distributionData}
        margin={{
          top: 10,
          right: 30,
          left: 20,
          bottom: 10,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis
          tickFormatter={(value) => localizeNumber(value.toFixed(2), "ne")}
          label={{
            value: "हेक्टर",
            angle: -90,
            position: "insideLeft",
            style: { textAnchor: "middle" },
          }}
        />
        <Tooltip content={CustomTooltip} />
        <Legend />
        {distributionData.map((entry, index) => (
          <Bar
            key={index}
            dataKey="value"
            name={entry.name}
            fill={entry.color}
            radius={[4, 4, 0, 0]}
            barSize={45}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
