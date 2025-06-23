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

interface RegionalDistributionChartProps {
  regionChartData: Array<{
    name: string;
    value: number;
    percentage: string;
  }>;
  REGION_COLORS: Record<string, string>;
}

export default function RegionalDistributionChart({
  regionChartData,
  REGION_COLORS,
}: RegionalDistributionChartProps) {
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
  const total = regionChartData.reduce((sum, item) => sum + item.value, 0);

  // Custom legend to add percentages
  const renderCustomLegend = (props: any) => {
    const { payload } = props;
    
    return (
      <ul className="flex justify-center flex-wrap">
        {payload.map((entry: any, index: number) => (
          <li key={`item-${index}`} className="flex items-center mx-4 mb-2">
            <div
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: entry.color }}
            ></div>
            <span>{entry.value} ({localizeNumber(regionChartData[index]?.percentage || "0", "ne")}%)</span>
          </li>
        ))}
      </ul>
    );
  };

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
          क्षेत्रगत वितरण
        </text>
        <Pie
          data={regionChartData}
          cx="50%"
          cy="55%"
          innerRadius={60}
          outerRadius={120}
          fill="#8884d8"
          paddingAngle={2}
          dataKey="value"
        >
          {regionChartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={REGION_COLORS[entry.name as keyof typeof REGION_COLORS] || "#c0c0c0"}
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
        <Legend content={renderCustomLegend} layout="horizontal" verticalAlign="bottom" align="center" />
      </PieChart>
    </ResponsiveContainer>
  );
}
