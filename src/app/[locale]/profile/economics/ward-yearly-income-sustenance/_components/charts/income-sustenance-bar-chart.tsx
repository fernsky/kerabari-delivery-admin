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
} from "recharts";

interface IncomeSustenanceBarChartProps {
  wardWiseData: Array<Record<string, any>>;
  MONTHS_SUSTAINED_COLORS: Record<string, string>;
  MONTHS_SUSTAINED_NAMES: Record<string, string>;
}

export default function IncomeSustenanceBarChart({
  wardWiseData,
  MONTHS_SUSTAINED_COLORS,
  MONTHS_SUSTAINED_NAMES,
}: IncomeSustenanceBarChartProps) {
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
        <YAxis />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="bg-background p-3 border shadow-sm rounded-md">
                  <p className="font-medium">{payload[0].payload.ward}</p>
                  <div className="space-y-1 mt-2">
                    {payload.map((entry, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div
                          className="w-2 h-2"
                          style={{ backgroundColor: entry.color }}
                        ></div>
                        <span>{entry.name}: </span>
                        <span className="font-medium">
                          {entry.value?.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }
            return null;
          }}
        />
        <Legend
          wrapperStyle={{ paddingTop: 20 }}
          layout="horizontal"
          verticalAlign="bottom"
          align="center"
        />
        {/* Dynamically generate bars based on available months categories in wardWiseData */}
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
        ).map((monthsCategory) => {
          // Find the months sustained key for color mapping
          const monthsKey =
            Object.keys(MONTHS_SUSTAINED_NAMES).find(
              (key) => MONTHS_SUSTAINED_NAMES[key] === monthsCategory,
            ) || "UPTO_THREE_MONTHS"; // Default to shortest period if not found

          return (
            <Bar
              key={monthsCategory}
              dataKey={monthsCategory}
              name={monthsCategory}
              stackId="a"
              fill={
                MONTHS_SUSTAINED_COLORS[monthsKey as keyof typeof MONTHS_SUSTAINED_COLORS] ||
                `#${Math.floor(Math.random() * 16777215).toString(16)}`
              }
            />
          );
        })}
      </BarChart>
    </ResponsiveContainer>
  );
}
