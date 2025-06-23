"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LabelList,
  ReferenceLine,
} from "recharts";
import { localizeNumber } from "@/lib/utils/localize-number";

interface RemittanceImpactChartProps {
  wardWiseAnalysis: Array<{
    wardNumber: number;
    totalSendingPopulation: number;
    averageRemittance: number;
    estimatedAnnualRemittance: number;
    prosperityIndex: number;
  }>;
  totalSendingPopulation: number;
  totalEstimatedRemittance: number;
}

export default function RemittanceImpactChart({
  wardWiseAnalysis,
  totalSendingPopulation,
  totalEstimatedRemittance,
}: RemittanceImpactChartProps) {
  // Calculate estimated remittance per ward
  const chartData = wardWiseAnalysis
    .map((ward) => {
      const remittanceInLakhs = ward.estimatedAnnualRemittance / 100000;

      return {
        name: `वडा ${ward.wardNumber}`,
        remittance: remittanceInLakhs.toFixed(1),
        population: ward.totalSendingPopulation,
      };
    })
    .sort((a, b) => parseFloat(b.remittance) - parseFloat(a.remittance));

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 border shadow-sm rounded-md">
          <p className="font-medium">{label}</p>
          <div className="flex justify-between gap-4 mt-1">
            <span className="text-sm">अनुमानित वार्षिक रेमिट्यान्स:</span>
            <span className="font-medium">
              रु. {localizeNumber(payload[0].value, "ne")} लाख
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-sm">कार्यरत जनसंख्या:</span>
            <span className="font-medium">
              {localizeNumber(payload[1].value.toString(), "ne")} जना
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  const averageRemittance =
    chartData.reduce((sum, item) => sum + parseFloat(item.remittance), 0) /
    chartData.length;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="name"
          tickFormatter={(value) => {
            // Extract ward number and convert to Nepali
            const wardNumber = value.replace(/वडा\s+/, "");
            return localizeNumber(wardNumber, "ne");
          }}
        />
        <YAxis
          yAxisId="left"
          orientation="left"
          stroke="#8884d8"
          label={{
            value: "रेमिट्यान्स (लाखमा)",
            angle: -90,
            position: "insideLeft",
            style: { textAnchor: "middle" },
          }}
          tickFormatter={(value) => localizeNumber(value.toString(), "ne")}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          stroke="#82ca9d"
          label={{
            value: "जनसंख्या",
            angle: 90,
            position: "insideRight",
            style: { textAnchor: "middle" },
          }}
          tickFormatter={(value) => localizeNumber(value.toString(), "ne")}
        />
        <Tooltip content={CustomTooltip} />
        <Legend
          wrapperStyle={{ paddingTop: 10 }}
          payload={[
            {
              value: "अनुमानित वार्षिक रेमिट्यान्स (लाखमा)",
              type: "rect",
              color: "#8884d8",
            },
            {
              value: "रेमिट्यान्स पठाउने जनसंख्या",
              type: "rect",
              color: "#82ca9d",
            },
          ]}
        />
        <ReferenceLine
          yAxisId="left"
          y={averageRemittance}
          stroke="#ff7300"
          strokeDasharray="3 3"
          label={{
            position: "insideBottomRight",
            value: "औसत",
            fill: "#ff7300",
            fontSize: 12,
          }}
        />
        <Bar
          yAxisId="left"
          dataKey="remittance"
          fill="#8884d8"
          radius={[4, 4, 0, 0]}
        >
          <LabelList
            dataKey="remittance"
            position="top"
            formatter={(value: string) => localizeNumber(value, "ne")}
          />
        </Bar>
        <Bar
          yAxisId="right"
          dataKey="population"
          fill="#82ca9d"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
