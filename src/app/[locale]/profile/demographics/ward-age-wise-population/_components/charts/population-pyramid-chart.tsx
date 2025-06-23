"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  Tooltip,
  Legend,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import { localizeNumber } from "@/lib/utils/localize-number";

interface PopulationPyramidChartProps {
  pyramidData: Array<{
    ageGroup: string;
    ageGroupName: string;
    male: number;
    female: number;
  }>;
  GENDER_COLORS: Record<string, string>;
}

export default function PopulationPyramidChart({
  pyramidData,
  GENDER_COLORS,
}: PopulationPyramidChartProps) {
  // Format pyramid data for display
  const { data, maxValue } = useMemo(() => {
    // Transform the data to make male values negative for proper pyramid display
    const transformedData = pyramidData.map((item) => ({
      ...item,
      male: -Math.abs(item.male), // Make male values negative
    }));

    // Calculate the maximum value considering absolute values
    const maxValue = Math.max(
      ...transformedData.flatMap((d) => [Math.abs(d.male), d.female]),
    );

    return { data: transformedData, maxValue };
  }, [pyramidData]);

  // Custom tooltip with Nepali digits
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 border shadow-sm rounded-md">
          <p className="font-medium">उमेर समूह: {label}</p>
          <div className="space-y-1 mt-2">
            {payload.map((entry: any, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  ></div>
                  <span>{entry.name}: </span>
                </div>
                <span className="font-medium">
                  {localizeNumber(Math.abs(entry.value).toLocaleString(), "ne")}
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
        data={data}
        margin={{ top: 20, right: 30, left: 30, bottom: 20 }}
        layout="vertical"
        barGap={0}
        barSize={20}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <XAxis
          type="number"
          domain={[-maxValue, maxValue]}
          tickFormatter={(value) =>
            localizeNumber(Math.abs(value).toString(), "ne")
          }
        />
        <YAxis
          type="category"
          dataKey="ageGroupName"
          width={80}
          tick={{ fontSize: 12 }}
        />
        <Tooltip content={CustomTooltip} />
        <Legend />
        <ReferenceLine x={0} stroke="#000" />
        <Bar
          dataKey="male"
          name="पुरुष"
          fill={GENDER_COLORS.MALE}
          // Remove stackId to prevent stacking
        />
        <Bar
          dataKey="female"
          name="महिला"
          fill={GENDER_COLORS.FEMALE}
          // Remove stackId to prevent stacking
        />
        <text
          x="25%"
          y={15}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-current text-sm font-medium"
        >
          पुरुष
        </text>
        <text
          x="75%"
          y={15}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-current text-sm font-medium"
        >
          महिला
        </text>
      </BarChart>
    </ResponsiveContainer>
  );
}
