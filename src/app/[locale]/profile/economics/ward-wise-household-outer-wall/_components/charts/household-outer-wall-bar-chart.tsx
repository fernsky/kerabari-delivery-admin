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

interface HouseholdOuterWallBarChartProps {
  wardWiseData: Array<Record<string, any>>;
  WALL_TYPE_COLORS: Record<string, string>;
  WALL_TYPE_NAMES: Record<string, string>;
}

export default function HouseholdOuterWallBarChart({
  wardWiseData,
  WALL_TYPE_COLORS,
  WALL_TYPE_NAMES,
}: HouseholdOuterWallBarChartProps) {
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

  // Get common wall types across all wards for consistent stacking order
  const commonWallTypes = Object.keys(
    wardWiseData.reduce(
      (acc, ward) => {
        Object.keys(ward).forEach((key) => {
          if (key !== "ward") acc[key] = true;
        });
        return acc;
      },
      {} as Record<string, boolean>,
    ),
  );

  // Sort wall types by most common to least common overall
  const wallTypeTotals = commonWallTypes.reduce((acc, wallType) => {
    acc[wallType] = wardWiseData.reduce((sum, ward) => {
      return sum + (ward[wallType] || 0);
    }, 0);
    return acc;
  }, {} as Record<string, number>);

  const sortedWallTypes = commonWallTypes.sort((a, b) => 
    wallTypeTotals[b] - wallTypeTotals[a]
  );

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={wardWiseData}
        margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
        barSize={40}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <XAxis
          dataKey="ward"
          scale="point"
          padding={{ left: 10, right: 10 }}
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => localizeNumber(value.toString(), "ne")}
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <YAxis tickFormatter={(value) => localizeNumber(value.toString(), "ne")} />
        <Tooltip content={CustomTooltip} />
        <Legend
          wrapperStyle={{ paddingTop: 20 }}
          layout="horizontal"
          verticalAlign="bottom"
          align="center"
          formatter={(value) => {
            // Truncate long names for better display in legend
            const maxLength = 20;
            return value.length > maxLength ? value.substring(0, maxLength) + '...' : value;
          }}
        />
        {/* Use the sorted wall types for consistent stacking order */}
        {sortedWallTypes.map((wallType, index) => {
          // Find the wall type key for color mapping
          const wallTypeKey =
            Object.keys(WALL_TYPE_NAMES).find(
              (key) => WALL_TYPE_NAMES[key] === wallType,
            ) || "OTHER";

          // Extract just the main part before parenthesis for better display in legend
          const displayName = wallType.split('(')[0].trim();

          return (
            <Bar
              key={wallType}
              dataKey={wallType}
              name={displayName}
              stackId="a"
              fill={
                WALL_TYPE_COLORS[
                  wallTypeKey as keyof typeof WALL_TYPE_COLORS
                ] || `#${Math.floor(Math.random() * 16777215).toString(16)}`
              }
            >
              {wardWiseData.map((entry, entryIndex) => (
                <Cell
                  key={`cell-${entryIndex}`}
                  fill={
                    WALL_TYPE_COLORS[wallTypeKey as keyof typeof WALL_TYPE_COLORS] ||
                    `#${Math.floor(Math.random() * 16777215).toString(16)}`
                  }
                  fillOpacity={0.8 + (0.2 * index) / sortedWallTypes.length}
                />
              ))}
            </Bar>
          );
        })}
      </BarChart>
    </ResponsiveContainer>
  );
}
