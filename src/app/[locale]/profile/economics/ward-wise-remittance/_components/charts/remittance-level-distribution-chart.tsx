"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  Label,
} from "recharts";
import { localizeNumber } from "@/lib/utils/localize-number";

interface RemittanceLevelDistributionChartProps {
  remittanceLevelData: Array<{
    level: string;
    levelLabel: string;
    population: number;
    percentage: string;
    color: string;
  }>;
}

export default function RemittanceLevelDistributionChart({
  remittanceLevelData,
}: RemittanceLevelDistributionChartProps) {
  // Custom tooltip component
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const { name, value, payload: originalPayload } = payload[0];
      const percentage = originalPayload.percentage;
      
      return (
        <div className="bg-background p-3 border shadow-sm rounded-md">
          <p className="font-medium">{name}</p>
          <div className="flex justify-between gap-4 mt-1">
            <span className="text-sm">जनसंख्या:</span>
            <span className="font-medium">
              {localizeNumber(value.toLocaleString(), "ne")}
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-sm">प्रतिशत:</span>
            <span className="font-medium">
              {localizeNumber(percentage, "ne")}%
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  // Calculate total for various statistics
  const total = remittanceLevelData.reduce((sum, item) => sum + item.population, 0);

  // Data for visualization
  const data = remittanceLevelData.map(item => ({
    name: item.levelLabel,
    value: item.population,
    percentage: item.percentage,
    color: item.color
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <text
          x="50%"
          y="20"
          fill="var(--foreground)"
          textAnchor="middle"
          dominantBaseline="middle"
          className="font-medium text-lg"
        >
          रेमिट्यान्स स्तर अनुसार वितरण
        </text>
        <Pie
          data={data}
          cx="50%"
          cy="55%"
          innerRadius={70}
          outerRadius={120}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="value"
          labelLine={false}
          label={({ name, percentage }) => `${name}: ${localizeNumber(percentage, "ne")}%`}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.color}
              stroke="var(--background)"
              strokeWidth={2}
            />
          ))}
          <Label
            content={({ viewBox }) => {
              const { cx, cy } = viewBox as { cx: number, cy: number };
              return (
                <text 
                  x={cx} 
                  y={cy}
                  textAnchor="middle" 
                  dominantBaseline="central"
                  className="text-base font-medium fill-current"
                >
                  <tspan x={cx} dy="-0.5em" className="text-xl font-semibold">
                    {localizeNumber(total.toLocaleString(), "ne")}
                  </tspan>
                  <tspan x={cx} dy="1.5em" className="text-sm fill-muted-foreground">
                    कुल जनसंख्या
                  </tspan>
                </text>
              );
            }}
          />
        </Pie>
        <Tooltip content={CustomTooltip} />
      </PieChart>
    </ResponsiveContainer>
  );
}
