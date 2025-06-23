"use client";

import React from "react";
import {
  PieChart,
  Pie,
  ResponsiveContainer,
  Cell,
  Legend,
  Tooltip,
} from "recharts";
import { localizeNumber } from "@/lib/utils/localize-number";

interface KeyIndicatorsGaugeChartProps {
  fullyImmunizedValue: number;
  dpt3Value: number;
  dptDropoutRate: number;
}

export default function KeyIndicatorsGaugeChart({
  fullyImmunizedValue,
  dpt3Value,
  dptDropoutRate,
}: KeyIndicatorsGaugeChartProps) {
  // Calculate a dropout indicator that displays in the right direction
  // (lower dropout is better, so we transform it to show as a positive indicator)
  const dptDropoutIndicator = Math.max(0, Math.min(100, 100 - dptDropoutRate * 5)); 
  
  // Prepare data for gauges
  const data = [
    {
      name: "पूर्ण खोप कभरेज",
      nameEn: "Full Immunization",
      value: fullyImmunizedValue,
      color: getColorByValue(fullyImmunizedValue),
      description: "बच्चाहरूमा पूर्ण खोप कभरेज (%)"
    },
    {
      name: "DPT-HepB-Hib3 कभरेज",
      nameEn: "DPT3 Coverage",
      value: dpt3Value,
      color: getColorByValue(dpt3Value),
      description: "एक वर्षमुनिका बालबालिकामा DPT-HepB-Hib3 कभरेज (%)"
    },
    {
      name: "ड्रपआउट प्रभावकारिता",
      nameEn: "Dropout Effectiveness",
      value: dptDropoutIndicator,
      color: getColorByValue(dptDropoutIndicator),
      description: `DPT ड्रपआउट दर: ${localizeNumber(dptDropoutRate.toFixed(1), "ne")}% (कम = राम्रो)`
    },
  ];

  // Get color based on the value
  function getColorByValue(value: number): string {
    if (value >= 90) return "#4CAF50"; // Green
    if (value >= 80) return "#2196F3"; // Blue
    if (value >= 70) return "#FFC107"; // Amber
    return "#F44336"; // Red
  }

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      
      return (
        <div className="bg-background p-3 border shadow-sm rounded-md">
          <p className="text-sm font-medium mb-1">{data.name}</p>
          <div className="flex justify-between gap-4">
            <span>मान:</span>
            <span className="font-medium">
              {localizeNumber(data.value.toFixed(1), "ne")}
            </span>
          </div>
          <p className="text-xs mt-2 text-muted-foreground">
            {data.description}
          </p>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
      {data.map((item, index) => (
        <div key={index} className="relative flex flex-col items-center">
          <h4 className="text-center text-sm mb-3 font-medium">{item.name}</h4>
          <div className="h-[150px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: item.name, value: item.value },
                    { name: "remainder", value: Math.max(0, 100 - item.value) }
                  ]}
                  cx="50%"
                  cy="50%"
                  startAngle={180}
                  endAngle={0}
                  innerRadius="65%"
                  outerRadius="90%"
                  paddingAngle={0}
                  dataKey="value"
                  cornerRadius={5}
                >
                  <Cell fill={item.color} />
                  <Cell fill="#e0e0e0" />
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-20 left-0 right-0 text-center">
              <p className="text-2xl font-bold">
                {localizeNumber(item.value.toFixed(1), "ne")}
                <span className="text-sm ml-1">%</span>
              </p>
              {index === 2 && (
                <p className="text-xs mt-1 text-muted-foreground">
                  {localizeNumber(dptDropoutRate.toFixed(1), "ne")}% ड्रपआउट
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
