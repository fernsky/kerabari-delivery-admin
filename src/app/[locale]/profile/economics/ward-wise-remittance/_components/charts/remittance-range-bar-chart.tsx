"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
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
  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background p-3 border shadow-sm rounded-md">
          <p className="font-medium">{data.label}</p>
          <div className="flex justify-between gap-4 mt-1">
            <span className="text-sm">जनसंख्या:</span>
            <span className="font-medium">
              {localizeNumber(data.value.toLocaleString(), "ne")}
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-sm">प्रतिशत:</span>
            <span className="font-medium">{localizeNumber(data.percentage, "ne")}%</span>
          </div>
        </div>
      );
    }
    return null;
  };
  
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
      })
      .replace(/(\d+)k/g, (_, value) => {
        const numValue = parseInt(value);
        if (numValue >= 100) {
          const lakhValue = numValue / 100;
          return `${localizeNumber(lakhValue.toString(), "ne")} लाख`;
        }
        return `${localizeNumber(value, "ne")} हजार`;
      });
      
    // Convert any remaining numbers to Nepali numerals
    const numericValues = formattedValue.match(/\d+/g);
    if (numericValues && numericValues.length > 0) {
      numericValues.forEach((num) => {
        formattedValue = formattedValue.replace(num, localizeNumber(num, "ne"));
      });
    }
    
    // Add Rs. (रू.) prefix if not already present
    if (!formattedValue.includes("रू.") && !formattedValue.includes("<")) {
      formattedValue = "रू. " + formattedValue;
    }
    
    return formattedValue;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={remittanceRangeData}
        margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
        barSize={40}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <XAxis
          dataKey="name"
          scale="point"
          padding={{ left: 10, right: 10 }}
          tick={{ fontSize: 12 }}
          angle={-45}
          textAnchor="end"
          height={60}
          tickFormatter={formatAxisLabel}
        />
        <YAxis
          tickFormatter={(value) => localizeNumber(value.toString(), "ne")}
          label={{
            value: "जनसंख्या",
            angle: -90,
            position: "insideLeft",
            style: { textAnchor: "middle" },
          }}
        />
        <Tooltip content={CustomTooltip} />
        <Bar dataKey="value" fill="#8884d8">
          {remittanceRangeData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
