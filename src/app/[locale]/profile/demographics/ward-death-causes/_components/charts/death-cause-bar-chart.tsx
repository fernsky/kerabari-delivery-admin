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
  Cell,
} from "recharts";
import { localizeNumber } from "@/lib/utils/localize-number";

// Define a color palette for consistency
const DEATH_CAUSE_COLOR_PALETTE = [
  "#FF5733", // Red-orange
  "#FFC300", // Yellow
  "#36A2EB", // Blue
  "#4BC0C0", // Cyan
  "#9966FF", // Purple
  "#3CB371", // Green
  "#FF6384", // Pink
  "#FFCE56", // Light orange
  "#607D8B", // Grey
  "#E91E63", // Magenta
  "#8BC34A", // Light green
  "#FF9F40", // Orange
];

interface DeathCauseBarChartProps {
  wardWiseData: Array<Record<string, any>>;
  DEATH_CAUSE_COLORS: Record<string, string>;
  deathCauseLabels: Record<string, string>;
}

export default function DeathCauseBarChart({
  wardWiseData,
  DEATH_CAUSE_COLORS,
  deathCauseLabels,
}: DeathCauseBarChartProps) {
  // Custom tooltip component for better presentation with Nepali numbers
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 border shadow-sm rounded-md">
          <p className="font-medium">{localizeNumber(label, "ne")}</p>
          <div className="space-y-1 mt-2">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: entry.color }}
                ></div>
                <span>{entry.name}: </span>
                <span className="font-medium">
                  {localizeNumber(entry.value?.toLocaleString() || "0", "ne")}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={wardWiseData}
        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        barSize={20}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <XAxis
          dataKey="ward"
          scale="point"
          padding={{ left: 10, right: 10 }}
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => localizeNumber(value.toString(), "ne")}
        />
        <YAxis tickFormatter={(value) => localizeNumber(value.toString(), "ne")} />
        <Tooltip content={CustomTooltip} />
        <Legend
          wrapperStyle={{ paddingTop: 20 }}
          layout="horizontal"
          verticalAlign="bottom"
          align="center"
        />
        {/* Dynamically generate bars based on available death causes in wardWiseData */}
        {Object.keys(
          wardWiseData.reduce(
            (acc, ward) => {
              Object.keys(ward).forEach((key) => {
                if (key !== "ward") acc[key] = true;
              });
              return acc;
            },
            {} as Record<string, boolean>,
          ),
        ).map((deathCause, index) => {
          // Find the death cause key for color mapping
          const deathCauseKey =
            Object.keys(deathCauseLabels).find(
              (key) => deathCauseLabels[key] === deathCause,
            ) || "OTHER";

          return (
            <Bar
              key={deathCause}
              dataKey={deathCause}
              name={deathCause}
              stackId="a"
              fill={
                DEATH_CAUSE_COLORS[
                  deathCauseKey as keyof typeof DEATH_CAUSE_COLORS
                ] || DEATH_CAUSE_COLOR_PALETTE[index % DEATH_CAUSE_COLOR_PALETTE.length]
              }
            >
              {wardWiseData.map((entry, entryIndex) => (
                <Cell
                  key={`cell-${entryIndex}`}
                  fill={
                    DEATH_CAUSE_COLORS[deathCauseKey as keyof typeof DEATH_CAUSE_COLORS] ||
                    DEATH_CAUSE_COLOR_PALETTE[index % DEATH_CAUSE_COLOR_PALETTE.length]
                  }
                  fillOpacity={0.8 + (0.2 * index) / Object.keys(deathCauseLabels).length}
                />
              ))}
            </Bar>
          );
        })}
      </BarChart>
    </ResponsiveContainer>
  );
}
