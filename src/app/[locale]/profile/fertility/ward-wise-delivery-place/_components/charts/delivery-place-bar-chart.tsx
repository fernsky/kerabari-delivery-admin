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
import { localizeNumber } from "@/lib/utils/localize-number";

interface DeliveryPlaceBarChartProps {
  wardWiseData: Array<Record<string, any>>;
  DELIVERY_PLACE_CATEGORIES: Record<
    string,
    {
      name: string;
      nameEn: string;
      color: string;
    }
  >;
}

export default function DeliveryPlaceBarChart({
  wardWiseData,
  DELIVERY_PLACE_CATEGORIES,
}: DeliveryPlaceBarChartProps) {
  // Custom tooltip component for better presentation with Nepali numbers
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 border shadow-sm rounded-md">
          <p className="font-medium mb-2">{label}</p>
          <div className="space-y-1">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: entry.color }}
                ></div>
                <span className="text-sm">{entry.name}: </span>
                <span className="text-sm font-medium">
                  {localizeNumber(entry.value?.toLocaleString() || "0", "ne")}
                </span>
              </div>
            ))}
            {payload.length >= 2 && (
              <div className="flex items-center gap-2 pt-1 mt-1 border-t">
                <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                <span className="text-sm">जम्मा: </span>
                <span className="text-sm font-medium">
                  {localizeNumber(
                    payload
                      .reduce(
                        (sum: number, entry: any) => sum + (entry.value || 0),
                        0,
                      )
                      .toLocaleString(),
                    "ne",
                  )}
                </span>
              </div>
            )}
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
          tickFormatter={(value) => localizeNumber(value, "ne")}
        />
        <YAxis
          tickFormatter={(value) => localizeNumber(value.toString(), "ne")}
          label={{
            value: "प्रसूती संख्या",
            angle: -90,
            position: "insideLeft",
            style: { textAnchor: "middle" },
          }}
        />
        <Tooltip content={CustomTooltip} />
        <Legend
          wrapperStyle={{ paddingTop: 20 }}
          layout="horizontal"
          verticalAlign="bottom"
          align="center"
        />
        {Object.values(DELIVERY_PLACE_CATEGORIES).map(
          (category, index, arr) => (
            <Bar
              key={category.name}
              dataKey={category.name}
              name={category.name}
              stackId="a"
              fill={category.color}
              radius={index === arr.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
              isAnimationActive={true}
              animationDuration={800}
            />
          ),
        )}
      </BarChart>
    </ResponsiveContainer>
  );
}
