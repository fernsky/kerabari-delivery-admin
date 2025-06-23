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

interface SkillLevelChartProps {
  skillLevelChartData: Array<{
    name: string;
    value: number;
    percentage: string;
  }>;
  SKILL_LEVEL_COLORS: Record<string, string>;
}

export default function SkillLevelChart({
  skillLevelChartData,
  SKILL_LEVEL_COLORS,
}: SkillLevelChartProps) {
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
  const total = skillLevelChartData.reduce((sum, item) => sum + item.value, 0);

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
          सीप स्तर अनुसार वितरण
        </text>
        <Pie
          data={skillLevelChartData}
          cx="50%"
          cy="55%"
          startAngle={180}
          endAngle={0}
          outerRadius={120}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="value"
        >
          {skillLevelChartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={SKILL_LEVEL_COLORS[entry.name] || "#c0c0c0"}
              stroke="var(--background)"
              strokeWidth={2}
            />
          ))}
          <Label
            content={({ viewBox }) => {
              const { cx, cy } = viewBox as { cx: number, cy: number };
              return (
                <g>
                  {skillLevelChartData.map((entry, index) => {
                    const angle = 180 - (index + 0.5) * (180 / skillLevelChartData.length);
                    const radian = (angle * Math.PI) / 180;
                    const x = cx + (115 * Math.cos(radian));
                    const y = cy - (25 + 115 * Math.sin(radian));
                    
                    return (
                      <text
                        key={`label-${index}`}
                        x={x}
                        y={y}
                        fill="var(--foreground)"
                        textAnchor="middle"
                        dominantBaseline="central"
                        className="font-medium text-sm"
                      >
                        {`${entry.name}: ${localizeNumber(entry.percentage, "ne")}%`}
                      </text>
                    );
                  })}
                </g>
              );
            }}
          />
        </Pie>
        
        {/* Descriptive bottom text for skill labels */}
        <text
          x="50%"
          y="85%"
          fill="var(--muted-foreground)"
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-xs"
        >
          दक्ष (उच्च सीपयुक्त कामदार) • अर्धदक्ष (माध्यमिक सीप) • अदक्ष (न्यून सीपयुक्त कामदार)
        </text>
        
        <Tooltip content={CustomTooltip} />
      </PieChart>
    </ResponsiveContainer>
  );
}
