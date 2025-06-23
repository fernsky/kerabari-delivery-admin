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

interface DisabilityCauseBarChartProps {
  wardWiseData: Array<Record<string, any>>;
  DISABILITY_CAUSE_COLORS: Record<string, string>;
  DISABILITY_CAUSE_NAMES: Record<string, string>;
}

export default function DisabilityCauseBarChart({
  wardWiseData,
  DISABILITY_CAUSE_COLORS,
  DISABILITY_CAUSE_NAMES,
}: DisabilityCauseBarChartProps) {
  // Helper function to get proper display name for disability cause
  const getDisabilityCauseDisplayName = (disabilityCause: string): string => {
    if (DISABILITY_CAUSE_NAMES[disabilityCause]) {
      return DISABILITY_CAUSE_NAMES[disabilityCause];
    }
    return disabilityCause === "OTHER" ? "अन्य" : disabilityCause;
  };

  // Custom tooltip component with Nepali display names
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 border shadow-sm rounded-md">
          <p className="font-medium">{label}</p>
          <div className="space-y-1 mt-2">
            {payload.map((entry: any, index: number) => {
              // Get proper display name for the disability cause
              const displayName = getDisabilityCauseDisplayName(entry.dataKey);

              return (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  ></div>
                  <span>{displayName}: </span>
                  <span className="font-medium">
                    {localizeNumber(entry.value?.toLocaleString() || "0", "ne")}{" "}
                    व्यक्ति
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

  // Helper function to get consistent color for a disability cause
  const getDisabilityCauseColor = (disabilityCauseName: string): string => {
    // First try to find the disability cause key by looking up the display name in DISABILITY_CAUSE_NAMES
    const disabilityCauseKey = Object.entries(DISABILITY_CAUSE_NAMES).find(
      ([key, value]) => value === disabilityCauseName,
    )?.[0];

    // If found and there's a matching color, use it
    if (disabilityCauseKey && DISABILITY_CAUSE_COLORS[disabilityCauseKey]) {
      return DISABILITY_CAUSE_COLORS[disabilityCauseKey];
    }

    // Otherwise, try direct lookup in DISABILITY_CAUSE_COLORS for disability cause keys
    if (DISABILITY_CAUSE_COLORS[disabilityCauseName]) {
      return DISABILITY_CAUSE_COLORS[disabilityCauseName];
    }

    // Fall back to a default color
    return DISABILITY_CAUSE_COLORS.OTHER || "#64748B";
  };

  // Create a color mapping for all disability cause names in the data
  const disabilityCauseColorMap: Record<string, string> = {};

  // Create a mapping for display names
  const disabilityCauseDisplayMap: Record<string, string> = {};

  // Populate both maps
  wardWiseData.forEach((ward) => {
    Object.keys(ward).forEach((key) => {
      if (key !== "ward" && !disabilityCauseColorMap[key]) {
        disabilityCauseColorMap[key] = getDisabilityCauseColor(key);
        disabilityCauseDisplayMap[key] = getDisabilityCauseDisplayName(key);
      }
    });
  });

  // Get unique disability cause names across all wards (excluding 'ward')
  const uniqueDisabilityCauseNames = Object.keys(
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
        <YAxis
          tickFormatter={(value) => localizeNumber(value.toString(), "ne")}
        />
        <Tooltip content={CustomTooltip} />
        <Legend
          wrapperStyle={{ paddingTop: 20 }}
          layout="horizontal"
          verticalAlign="bottom"
          align="center"
          formatter={(value, entry) => {
            // Return proper display name for legend items
            const dataKey = entry?.dataKey?.toString();
            return disabilityCauseDisplayMap[dataKey as string] || value;
          }}
        />

        {/* Create bars for each disability cause type with consistent colors and proper names */}
        {uniqueDisabilityCauseNames.map((disabilityCauseName) => (
          <Bar
            key={disabilityCauseName}
            dataKey={disabilityCauseName}
            stackId="a"
            name={disabilityCauseDisplayMap[disabilityCauseName]}
            fill={disabilityCauseColorMap[disabilityCauseName]}
          >
            {/* Apply consistent colors across all ward instances of this disability cause */}
            {wardWiseData.map((_, index) => (
              <Cell
                key={`cell-${disabilityCauseName}-${index}`}
                fill={disabilityCauseColorMap[disabilityCauseName]}
              />
            ))}
          </Bar>
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
