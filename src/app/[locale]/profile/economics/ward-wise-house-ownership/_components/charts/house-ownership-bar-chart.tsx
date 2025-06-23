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

interface HouseOwnershipBarChartProps {
  wardWiseData: Array<Record<string, any>>;
  OWNERSHIP_TYPE_COLORS: Record<string, string>;
  OWNERSHIP_TYPE_NAMES: Record<string, string>;
}

export default function HouseOwnershipBarChart({
  wardWiseData,
  OWNERSHIP_TYPE_COLORS,
  OWNERSHIP_TYPE_NAMES,
}: HouseOwnershipBarChartProps) {
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
        barSize={40}
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
        {/* Dynamically generate bars based on available ownership types in wardWiseData */}
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
        ).map((ownershipType, index) => {
          // Find the ownership type key for color mapping
          const ownershipTypeKey =
            Object.keys(OWNERSHIP_TYPE_NAMES).find(
              (key) => OWNERSHIP_TYPE_NAMES[key] === ownershipType,
            ) || "OTHER";

          return (
            <Bar
              key={ownershipType}
              dataKey={ownershipType}
              name={ownershipType}
              stackId="a"
              fill={
                OWNERSHIP_TYPE_COLORS[
                  ownershipTypeKey as keyof typeof OWNERSHIP_TYPE_COLORS
                ] || `#${Math.floor(Math.random() * 16777215).toString(16)}`
              }
            >
              {wardWiseData.map((entry, entryIndex) => (
                <Cell
                  key={`cell-${entryIndex}`}
                  fill={
                    OWNERSHIP_TYPE_COLORS[ownershipTypeKey as keyof typeof OWNERSHIP_TYPE_COLORS] ||
                    `#${Math.floor(Math.random() * 16777215).toString(16)}`
                  }
                  fillOpacity={0.8 + (0.2 * index) / Object.keys(OWNERSHIP_TYPE_NAMES).length}
                />
              ))}
            </Bar>
          );
        })}
      </BarChart>
    </ResponsiveContainer>
  );
}
