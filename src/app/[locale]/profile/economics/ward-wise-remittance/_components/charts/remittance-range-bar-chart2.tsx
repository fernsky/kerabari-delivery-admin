"use client";

import {
  BarChart,
  Bar,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
} from "recharts";
import { localizeNumber } from "@/lib/utils/localize-number";

interface RemittanceRangeBarChartProps {
  remittanceRangeData: Array<{
    name: string;
    value: number;
    amountGroup: string;
    label: string;
    percentage: string;
    color: string;
  }>;
}

export default function RemittanceRangeBarChart({
  remittanceRangeData,
}: RemittanceRangeBarChartProps) {
  // Format X-axis labels to use Nepali currency terms (हजार, लाख)
  const formatAxisLabel = (value: string) => {
    // Replace numeric ranges with Nepali numerals and appropriate units
    let formattedValue = value;

    // Replace ranges with हजार (thousand) and लाख (hundred thousand) format
    formattedValue = formattedValue
      .replace(/(\d+)k-(\d+)k/g, (_, min, max) => {
        const minValue = parseInt(min);
        const maxValue = parseInt(max);

        // Format based on value range
        if (minValue < 100 && maxValue < 100) {
          // Format as thousands (हजार)
          return `${localizeNumber(minValue.toString(), "ne")}-${localizeNumber(maxValue.toString(), "ne")} हजार`;
        } else if (minValue >= 100 || maxValue >= 100) {
          // Format as lakhs (लाख)
          const minLakh = minValue / 100;
          const maxLakh = maxValue / 100;
          return `${localizeNumber(minLakh.toString(), "ne")}-${localizeNumber(maxLakh.toString(), "ne")} लाख`;
        }
        return `${localizeNumber(minValue.toString(), "ne")}-${localizeNumber(maxValue.toString(), "ne")}`;
      })
      .replace(/(\d+)k\+/g, (_, value) => {
        const numValue = parseInt(value);
        if (numValue >= 100) {
          const lakhValue = numValue / 100;
          return `${localizeNumber(lakhValue.toString(), "ne")} लाख+`;
        }
        return `${localizeNumber(value, "ne")} हजार+`;
      });

    // Add Rs. (रू.) prefix if not already present
    if (!formattedValue.includes("रू.")) {
      formattedValue = "रू. " + formattedValue;
    }

    return formattedValue;
  };

  // Custom tooltip component for better presentation with Nepali numbers
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const { name, value, payload: originalPayload } = payload[0];
      const percentage = originalPayload.percentage;
      const label = originalPayload.label;

      return (
        <div className="bg-background p-3 border shadow-sm rounded-md">
          <p className="font-medium">{label}</p>
          <div className="flex justify-between gap-4 mt-1">
            <span className="text-sm">जनसंख्या:</span>
            <span className="font-medium">
              {localizeNumber(value.toLocaleString(), "ne")} जना
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-sm">प्रतिशत:</span>
            <span className="font-medium">
              {localizeNumber(percentage, "ne")}%
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={remittanceRangeData}
        margin={{ top: 10, right: 30, left: 20, bottom: 70 }}
        barSize={50}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <XAxis
          dataKey="name"
          angle={-30}
          textAnchor="end"
          height={70}
          tick={{ fontSize: 12 }}
          interval={0}
          tickFormatter={formatAxisLabel}
        />
        <YAxis
          tickFormatter={(value) => localizeNumber(value.toString(), "ne")}
        />
        <Tooltip content={CustomTooltip} />
        <Bar dataKey="value" name="जनसंख्या">
          {remittanceRangeData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
