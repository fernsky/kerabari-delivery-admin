"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { localizeNumber } from "@/lib/utils/localize-number";

interface NewbornHealthChartProps {
  newbornHealthData: any[];
  indicatorLabels: Record<string, string>;
}

export default function NewbornHealthChart({
  newbornHealthData,
  indicatorLabels,
}: NewbornHealthChartProps) {
  // Split data into positive indicators and challenges
  const positiveIndicators = [
    "NEWBORNS_CHX_APPLIED_AFTER_BIRTH",
    "NEWBORNS_CHECKUP_24HRS_BIRTH",
    "NEONATES_FOUR_CHECKUPS_PNC_PROTOCOL",
  ];
  const challengeIndicators = [
    "NEWBORNS_LOW_BIRTH_WEIGHT",
    "NEONATES_BIRTH_ASPHYXIA",
    "PRETERM_BIRTH",
    "STILL_BIRTHS",
    "NEONATES_CONGENITAL_ANOMALIES",
    "NEONATAL_MORTALITY_HEALTH_FACILITY",
  ];

  // Prepare data for chart, distinguishing between positive indicators and challenges
  const chartData = newbornHealthData
    .filter((item) => item.value !== null && item.value !== undefined)
    .map((item) => {
      // Use proper label from indicatorLabels or create a clean fallback
      const displayName = indicatorLabels[item.indicator]
        ? indicatorLabels[item.indicator].split(" ").slice(0, 4).join(" ")
        : item.indicator
            .replace("NEWBORNS_", "")
            .replace("NEONATES_", "")
            .replace(/_/g, " ")
            .split(" ")
            .slice(0, 4)
            .join(" ");

      const isPositive = positiveIndicators.includes(item.indicator);

      return {
        name: displayName,
        fullName: indicatorLabels[item.indicator] || item.indicator,
        value: parseFloat(item.value) || 0,
        indicator: item.indicator,
        isPositive,
      };
    });

  // Get color based on value and indicator type
  function getBarColor(value: number, isPositive: boolean): string {
    if (isPositive) {
      // For positive indicators (higher is better)
      if (value >= 90) return "#10b981"; // Emerald
      if (value >= 80) return "#14b8a6"; // Teal
      if (value >= 70) return "#06b6d4"; // Cyan
      return "#ef4444"; // Red
    } else {
      // For challenges (lower is better)
      if (value <= 1) return "#10b981"; // Emerald
      if (value <= 3) return "#14b8a6"; // Teal
      if (value <= 5) return "#06b6d4"; // Cyan
      return "#ef4444"; // Red
    }
  }

  // Sort data by type (positive indicators first, then challenges)
  const sortedChartData = [...chartData].sort((a, b) => {
    if (a.isPositive && !b.isPositive) return -1;
    if (!a.isPositive && b.isPositive) return 1;
    return 0;
  });

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;

      return (
        <div className="bg-background p-3 border shadow-sm rounded-md">
          <p className="text-sm font-medium mb-2">{data.fullName}</p>
          <div className="flex justify-between gap-4">
            <span>{data.isPositive ? "कभरेज:" : "दर:"}</span>
            <span className="font-medium">
              {localizeNumber(data.value.toFixed(1), "ne")}%
            </span>
          </div>
          {!data.isPositive && (
            <p className="text-xs mt-1 text-muted-foreground">
              {data.value <= 5 ? "राम्रो अवस्था" : "सुधार्नु पर्ने"}
            </p>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={sortedChartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="name"
          tick={(props) => {
            const { x, y, payload } = props;
            return (
              <g transform={`translate(${x},${y})`}>
                <text
                  x={0}
                  y={0}
                  dy={16}
                  textAnchor="end"
                  fill="#666"
                  fontSize={12}
                  transform="rotate(-45)"
                >
                  {payload.value}
                </text>
              </g>
            );
          }}
          height={80}
        />
        <YAxis
          tickFormatter={(value) =>
            `${localizeNumber(value.toString(), "ne")}%`
          }
          domain={[0, 100]}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar
          dataKey="value"
          name="नवजात शिशु स्वास्थ्य"
          isAnimationActive={true}
          animationDuration={800}
          maxBarSize={60}
        >
          {sortedChartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={getBarColor(entry.value, entry.isPositive)}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
