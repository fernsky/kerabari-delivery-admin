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

interface CasteBarChartProps {
  wardWiseData: Array<Record<string, any>>;
  CASTE_COLORS: Record<string, string>;
  CASTE_NAMES: Record<string, string>;
}

export default function CasteBarChart({
  wardWiseData,
  CASTE_COLORS,
  CASTE_NAMES,
}: CasteBarChartProps) {
  // Helper function to get proper display name for caste type
  const getCasteDisplayName = (casteType: string): string => {
    if (CASTE_NAMES[casteType]) {
      return CASTE_NAMES[casteType];
    }
    return casteType === "OTHER" ? "अन्य" : casteType;
  };

  // Custom tooltip component with Nepali display names
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 border shadow-sm rounded-md">
          <p className="font-medium">{label}</p>
          <div className="space-y-1 mt-2">
            {payload.map((entry: any, index: number) => {
              // Get proper display name for the caste
              const displayName = getCasteDisplayName(entry.dataKey);

              return (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  ></div>
                  <span>{displayName}: </span>
                  <span className="font-medium">
                    {localizeNumber(entry.value?.toLocaleString() || "0", "ne")}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    return null;
  };

  // Helper function to get consistent color for a caste
  const getCasteColor = (casteName: string): string => {
    // First try to find the caste key by looking up the display name in CASTE_NAMES
    const casteKey = Object.entries(CASTE_NAMES).find(
      ([key, value]) => value === casteName,
    )?.[0];

    // If found and there's a matching color, use it
    if (casteKey && CASTE_COLORS[casteKey]) {
      return CASTE_COLORS[casteKey];
    }

    // Otherwise, try direct lookup in CASTE_COLORS for casteType keys
    if (CASTE_COLORS[casteName]) {
      return CASTE_COLORS[casteName];
    }

    // Fall back to a default color
    return CASTE_COLORS.OTHER || "#64748B";
  };

  // Create a color mapping for all caste names in the data
  const casteColorMap: Record<string, string> = {};

  // Create a mapping for display names
  const casteDisplayMap: Record<string, string> = {};

  // Populate both maps
  wardWiseData.forEach((ward) => {
    Object.keys(ward).forEach((key) => {
      if (key !== "ward" && !casteColorMap[key]) {
        casteColorMap[key] = getCasteColor(key);
        casteDisplayMap[key] = getCasteDisplayName(key);
      }
    });
  });

  // Get unique caste names across all wards (excluding 'ward')
  const uniqueCasteNames = Object.keys(
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
        />
        <YAxis tickFormatter={(value) => localizeNumber(value.toString(), "ne")} />
        <Tooltip content={CustomTooltip} />
        <Legend
          wrapperStyle={{ paddingTop: 20 }}
          layout="horizontal"
          verticalAlign="bottom"
          align="center"
          formatter={(value, entry) => {
            // Return proper display name for legend items
            const dataKey = entry?.dataKey?.toString();
            return casteDisplayMap[dataKey as string] || value;
          }}
        />

        {/* Create bars for each caste type with consistent colors and proper names */}
        {uniqueCasteNames.map((casteName) => (
          <Bar
            key={casteName}
            dataKey={casteName}
            stackId="a"
            name={casteDisplayMap[casteName]}
            fill={casteColorMap[casteName]}
          >
            {/* Apply consistent colors across all ward instances of this caste */}
            {wardWiseData.map((_, index) => (
              <Cell
                key={`cell-${casteName}-${index}`}
                fill={casteColorMap[casteName]}
              />
            ))}
          </Bar>
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
