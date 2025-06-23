"use client";

import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { localizeNumber } from "@/lib/utils/localize-number";

interface RemittanceImpactChartProps {
  wardWiseAnalysis: Array<{
    wardNumber: number;
    totalSendingPopulation: number;
    estimatedAnnualRemittance: number;
  }>;
  totalSendingPopulation: number;
  totalEstimatedRemittance: number;
}

export default function RemittanceImpactChart({
  wardWiseAnalysis,
  totalSendingPopulation,
  totalEstimatedRemittance,
}: RemittanceImpactChartProps) {
  // Create formatted data for chart with total estimated remittance in lakhs
  const chartData = wardWiseAnalysis.map((ward) => ({
    ward: `वडा ${localizeNumber(ward.wardNumber.toString(), "ne")}`,
    remittance: Math.round(ward.estimatedAnnualRemittance / 100000) / 10, // Convert to lakhs
    population: ward.totalSendingPopulation,
  }));

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

  // Find maximum values for axis scaling
  const maxRemittance =
    Math.ceil(Math.max(...chartData.map((d) => d.remittance)) / 50) * 50;
  const maxPopulation =
    Math.ceil(Math.max(...chartData.map((d) => d.population)) / 100) * 100;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <XAxis
          dataKey="ward"
          tick={{ fontSize: 12 }}
          angle={-30}
          textAnchor="end"
          height={50}
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
        <Bar
          yAxisId="left"
          dataKey="remittance"
          name="रेमिट्यान्स (लाखमा)"
          fill="#8884d8"
          radius={[4, 4, 0, 0]}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="population"
          stroke="#82ca9d"
          name="जनसंख्या"
          strokeWidth={2}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
