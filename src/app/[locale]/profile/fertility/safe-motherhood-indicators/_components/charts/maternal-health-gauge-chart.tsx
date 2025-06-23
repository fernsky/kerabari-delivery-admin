"use client";

import React from "react";
import {
  PieChart,
  Pie,
  ResponsiveContainer,
  Cell,
  Tooltip,
} from "recharts";
import { localizeNumber } from "@/lib/utils/localize-number";

interface MaternalHealthGaugeChartProps {
  institutionalDeliveries: number;
  ancCheckups: number;
  pncVisits: number;
  newbornCare: number;
}

export default function MaternalHealthGaugeChart({
  institutionalDeliveries,
  ancCheckups,
  pncVisits,
  newbornCare,
}: MaternalHealthGaugeChartProps) {
  // Prepare data for gauges
  const data = [
    {
      name: "संस्थागत प्रसूति",
      nameEn: "Institutional Delivery",
      value: institutionalDeliveries,
      color: getColorByValue(institutionalDeliveries),
      description: "कुल प्रसूति मध्ये स्वास्थ्य संस्थामा भएको प्रसूति (%)"
    },
    {
      name: "नियमित गर्भवती जाँच",
      nameEn: "ANC Protocol",
      value: ancCheckups,
      color: getColorByValue(ancCheckups),
      description: "प्रोटोकल अनुसार ४ पटक गर्भवती जाँच (%)"
    },
    {
      name: "सुत्केरी सेवा",
      nameEn: "PNC Coverage",
      value: pncVisits,
      color: getColorByValue(pncVisits),
      description: "सुत्केरी पछिको २ पटक घरभेट (%)"
    },
    {
      name: "नवजात शिशु स्याहार",
      nameEn: "Newborn Care",
      value: newbornCare,
      color: getColorByValue(newbornCare),
      description: "जन्मेलगत्तै क्लोरहेक्जिडिन मलम प्रयोग गरिएका नवजात शिशु (%)"
    }
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
              {localizeNumber(data.value.toFixed(1), "ne")}%
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
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-full">
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
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
