"use client";

import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LabelList,
} from "recharts";

interface TrainedPopulationBarChartProps {
  barChartData: Array<{
    ward: string;
    trainedPopulation: number;
  }>;
}

export default function TrainedPopulationBarChart({
  barChartData,
}: TrainedPopulationBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={barChartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
        <XAxis
          dataKey="ward"
          tickMargin={10}
          axisLine={{ strokeWidth: 1 }}
          tickLine={false}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tickFormatter={(value) => value.toLocaleString()}
        />
        <Tooltip
          formatter={(value) => [
            value.toLocaleString(),
            "तालिम प्राप्त जनसंख्या",
          ]}
          labelFormatter={(label) => `${label}`}
          cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
        />
        <Bar
          dataKey="trainedPopulation"
          fill="#4C9AFF"
          radius={[4, 4, 0, 0]}
          barSize={30}
        >
          <LabelList
            dataKey="trainedPopulation"
            position="top"
            formatter={(value: number) => value.toLocaleString()}
            style={{ fontSize: "12px", fill: "#333" }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
