"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { localizeNumber } from "@/lib/utils/localize-number";

interface VegetableFruitDiseasePestComparisonChartProps {
  data: Array<{
    name: string;
    diseases: number;
    pests: number;
    total: number;
  }>;
}

export default function VegetableFruitDiseasePestComparisonChart({
  data,
}: VegetableFruitDiseasePestComparisonChartProps) {
  // Calculate average total issues
  const avgTotal =
    data.reduce((sum, item) => sum + item.total, 0) / data.length;

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const itemData = data.find((d) => d.name === label);

      return (
        <div className="bg-background p-3 border shadow-sm rounded-md">
          <p className="font-medium">{label}</p>
          <div className="mt-2 space-y-1">
            <div className="flex justify-between gap-4">
              <span className="text-sm">रोगहरू:</span>
              <span className="font-medium">
                {localizeNumber(itemData?.diseases.toString() || "0", "ne")}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-sm">कीटपतंगहरू:</span>
              <span className="font-medium">
                {localizeNumber(itemData?.pests.toString() || "0", "ne")}
              </span>
            </div>
            <div className="flex justify-between gap-4 border-t pt-1">
              <span className="text-sm font-medium">कुल समस्या:</span>
              <span className="font-bold">
                {localizeNumber(itemData?.total.toString() || "0", "ne")}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-sm">रोग/कीट अनुपात:</span>
              <span className="font-medium">
                {itemData?.diseases && itemData?.pests
                  ? `${localizeNumber((itemData.diseases / itemData.pests).toFixed(1), "ne")}:1`
                  : "N/A"}
              </span>
            </div>
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
        margin={{
          top: 10,
          right: 30,
          left: 20,
          bottom: 10,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis
          tickFormatter={(value) => localizeNumber(value.toString(), "ne")}
          label={{
            value: "संख्या",
            angle: -90,
            position: "insideLeft",
            style: { textAnchor: "middle" },
          }}
        />
        <Tooltip content={CustomTooltip} />
        <Legend />
        <Bar
          dataKey="diseases"
          name="रोग"
          stackId="a"
          fill="#e74c3c"
          radius={[0, 0, 0, 0]}
        />
        <Bar
          dataKey="pests"
          name="कीट"
          stackId="a"
          fill="#2ecc71"
          radius={[4, 4, 0, 0]}
        />
        <ReferenceLine
          y={avgTotal}
          stroke="#3498db"
          strokeDasharray="3 3"
          label={{
            value: `औसत: ${localizeNumber(avgTotal.toFixed(1), "ne")}`,
            position: "insideTopRight",
            style: { fill: "#3498db", fontSize: 12 },
          }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
