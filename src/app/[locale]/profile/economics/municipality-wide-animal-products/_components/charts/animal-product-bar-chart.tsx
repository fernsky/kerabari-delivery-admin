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

interface AnimalProductBarChartProps {
  data: Array<{
    name: string;
    milk: number;
    meat: number;
    eggs: number;
    milk_products: number;
    other: number;
  }>;
}

export default function AnimalProductBarChart({
  data,
}: AnimalProductBarChartProps) {
  // Custom tooltip component for better presentation with Nepali numbers
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 border shadow-sm rounded-md">
          <p className="font-medium">{localizeNumber(label, "ne")} साल</p>
          <div className="space-y-1 mt-2">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: entry.color }}
                ></div>
                <span>
                  {entry.name === "milk"
                    ? "दुध"
                    : entry.name === "meat"
                      ? "मासु"
                      : entry.name === "eggs"
                        ? "अण्डा"
                        : entry.name === "milk_products"
                          ? "दुधजन्य वस्तु"
                          : "अन्य"}
                  :{" "}
                </span>
                <span className="font-medium">
                  {entry.name === "eggs"
                    ? `${localizeNumber(entry.value.toFixed(0), "ne")} संख्या`
                    : `${localizeNumber(entry.value.toFixed(2), "ne")} ${entry.name === "milk" || entry.name === "milk_products" ? "लिटर" : "किलो"}`}
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
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis
          tickFormatter={(value) => localizeNumber(value.toString(), "ne")}
          label={{
            value: "परिमाण",
            angle: -90,
            position: "insideLeft",
            style: { textAnchor: "middle" },
          }}
        />
        <Tooltip content={CustomTooltip} />
        <Legend
          formatter={(value) => {
            return value === "milk"
              ? "दुध"
              : value === "meat"
                ? "मासु"
                : value === "eggs"
                  ? "अण्डा"
                  : value === "milk_products"
                    ? "दुधजन्य वस्तु"
                    : "अन्य";
          }}
        />
        <Bar dataKey="milk" name="milk" fill="#3498DB" stackId="a" />
        <Bar dataKey="meat" name="meat" fill="#E74C3C" stackId="a" />
        <Bar dataKey="eggs" name="eggs" fill="#F1C40F" stackId="a" />
        <Bar
          dataKey="milk_products"
          name="milk_products"
          fill="#2ECC71"
          stackId="a"
        />
        <Bar dataKey="other" name="other" fill="#95A5A6" stackId="a" />
      </BarChart>
    </ResponsiveContainer>
  );
}
