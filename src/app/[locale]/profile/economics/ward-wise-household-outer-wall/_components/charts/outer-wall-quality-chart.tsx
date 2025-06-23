"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, Label } from "recharts";
import { localizeNumber } from "@/lib/utils/localize-number";

interface OuterWallQualityChartProps {
  qualityData: Array<{
    name: string;
    value: number;
    percentage: string;
    color: string;
  }>;
}

export default function OuterWallQualityChart({
  qualityData,
}: OuterWallQualityChartProps) {
  // Custom tooltip component with Nepali numbers
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const { name, value, payload: originalPayload } = payload[0];
      const percentage = originalPayload.percentage;

      return (
        <div className="bg-background p-3 border shadow-sm rounded-md">
          <p className="font-medium">{name}</p>
          <div className="flex justify-between gap-4 mt-1">
            <span className="text-sm">घरधुरी:</span>
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

  // Calculate total for accurate percentage in legend
  const total = qualityData.reduce((sum, item) => sum + item.value, 0);

  // Create custom legend with colorful boxes and percentages
  const renderCustomizedLegend = (props: any) => {
    const { payload } = props;
    
    return (
      <div className="flex justify-center mt-4 flex-wrap">
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center mx-4 mb-2">
            <div 
              className="w-4 h-4 mr-2" 
              style={{ backgroundColor: entry.color }}
            ></div>
            <span className="text-sm">
              {entry.value} ({localizeNumber(
                ((qualityData[index]?.value || 0) / total * 100).toFixed(1), 
                "ne"
              )}%)
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={qualityData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={120}
          paddingAngle={2}
          dataKey="value"
        >
          {qualityData.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={entry.color}
              stroke="#fff" 
              strokeWidth={1}
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
                    कुल घरधुरी
                  </tspan>
                </text>
              );
            }}
          />
        </Pie>
        <Tooltip content={CustomTooltip} />
        <Legend 
          content={renderCustomizedLegend}
          layout="horizontal"
          verticalAlign="bottom"
          align="center"
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
