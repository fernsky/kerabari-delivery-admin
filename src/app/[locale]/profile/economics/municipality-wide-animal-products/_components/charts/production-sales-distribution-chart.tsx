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

interface ProductionSalesDistributionChartProps {
  productionSalesData: Array<{
    name: string;
    production: number;
    sales: number;
    selfConsumption: number;
    percentageSold: number;
    measurementUnit?: string;
  }>;
  totalProduction: number;
}

export default function ProductionSalesDistributionChart({
  productionSalesData,
  totalProduction,
}: ProductionSalesDistributionChartProps) {
  // Custom tooltip for detailed information
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;

      // Format the unit based on measurement unit
      let unitText = "मे.ट.";
      if (data.measurementUnit) {
        switch (data.measurementUnit) {
          case "COUNT":
            unitText = "संख्या";
            break;
          case "LITER":
            unitText = "लिटर";
            break;
          case "KG":
            unitText = "किलोग्राम";
            break;
        }
      }

      return (
        <div className="bg-background p-3 border shadow-sm rounded-md">
          <p className="font-medium">{data.name}</p>
          <div className="mt-2 space-y-1">
            <div className="flex justify-between gap-4">
              <span className="text-sm">कुल उत्पादन:</span>
              <span className="font-medium">
                {localizeNumber(data.production.toFixed(2), "ne")} {unitText}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-sm">बिक्री:</span>
              <span className="font-medium">
                {localizeNumber(data.sales.toFixed(2), "ne")} {unitText}
                {" ("}
                {localizeNumber(data.percentageSold.toFixed(2), "ne")}%)
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-sm">आन्तरिक उपभोग:</span>
              <span className="font-medium">
                {localizeNumber(data.selfConsumption.toFixed(2), "ne")}{" "}
                {unitText}
                {" ("}
                {localizeNumber((100 - data.percentageSold).toFixed(2), "ne")}%)
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
        data={productionSalesData}
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
          tickFormatter={(value) => localizeNumber(value.toFixed(0), "ne")}
          label={{
            value: "परिमाण",
            angle: -90,
            position: "insideLeft",
            style: { textAnchor: "middle" },
          }}
        />
        <Tooltip content={CustomTooltip} />
        <Legend />
        <Bar
          dataKey="sales"
          name="बिक्री"
          stackId="a"
          fill="#3498db"
          radius={[0, 0, 0, 0]}
        />
        <Bar
          dataKey="selfConsumption"
          name="आन्तरिक उपभोग"
          stackId="a"
          fill="#2ecc71"
          radius={[4, 4, 0, 0]}
        />
        <ReferenceLine
          y={totalProduction * 0.2}
          stroke="#e74c3c"
          strokeDasharray="3 3"
          label={{
            value: "न्युनतम उत्पादन सीमा",
            position: "insideBottomRight",
            style: { fill: "#e74c3c", fontSize: 10 },
          }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
