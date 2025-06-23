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
  AreaChart,
  Area,
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { localizeNumber } from "@/lib/utils/localize-number";

interface AgeWiseMaritalStatusChartProps {
  ageWiseMaritalData: Array<Record<string, any>>;
  MARITAL_STATUS_COLORS: Record<string, string>;
  MARITAL_STATUS_NAMES: Record<string, string>;
}

export default function AgeWiseMaritalStatusChart({
  ageWiseMaritalData,
  MARITAL_STATUS_COLORS,
  MARITAL_STATUS_NAMES,
}: AgeWiseMaritalStatusChartProps) {
  const [chartType, setChartType] = useState<string>("stacked");
  
  // Prepare data for stacked bar chart of age-wise marital status
  const stackedBarData = ageWiseMaritalData
    .map((item) => {
      const result: Record<string, any> = {
        ageGroup: item.ageGroupName,
      };

      Object.keys(MARITAL_STATUS_NAMES).forEach((status) => {
        if (item[status]) {
          result[MARITAL_STATUS_NAMES[status]] = item[status];
        }
      });

      return result;
    })
    // Sort data by age groups chronologically
    .sort((a, b) => {
      const ageOrder = [
        "१५ वर्ष भन्दा कम",
        "१५-१९ वर्ष",
        "२०-२४ वर्ष",
        "२५-२९ वर्ष",
        "३०-३४ वर्ष",
        "३५-३९ वर्ष",
        "४०-४४ वर्ष",
        "४५-४९ वर्ष",
        "५०-५४ वर्ष",
        "५५-५९ वर्ष",
        "६०-६४ वर्ष",
        "६५-६९ वर्ष",
        "७०-७४ वर्ष",
        "७५ वर्ष र माथि",
      ];
      return ageOrder.indexOf(a.ageGroup) - ageOrder.indexOf(b.ageGroup);
    });

  // Calculate percentage data for area chart
  const percentageData = stackedBarData.map((item) => {
    const result: Record<string, any> = {
      ageGroup: item.ageGroup,
    };
    
    let total = 0;
    // Calculate total for this age group
    Object.values(MARITAL_STATUS_NAMES).forEach(name => {
      total += item[name] || 0;
    });
    
    // Calculate percentages
    Object.values(MARITAL_STATUS_NAMES).forEach(name => {
      if (total > 0 && item[name]) {
        result[name] = (item[name] / total) * 100;
      } else {
        result[name] = 0;
      }
    });
    
    return result;
  });

  return (
    <div className="space-y-4">
      <Tabs value={chartType} onValueChange={setChartType}>
        <TabsList className="grid grid-cols-3 w-[400px] mx-auto mb-4">
          <TabsTrigger value="stacked">स्याक्ड बार</TabsTrigger>
          <TabsTrigger value="grouped">ग्रुप्ड बार</TabsTrigger>
          <TabsTrigger value="percentage">प्रतिशत</TabsTrigger>
        </TabsList>

        <TabsContent value="stacked" className="h-[450px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={stackedBarData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              barSize={30}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis 
                dataKey="ageGroup" 
                angle={-45} 
                textAnchor="end"
                height={80}
                interval={0}
                fontSize={12}
              />
              <YAxis tickFormatter={(value) => localizeNumber(value.toString(), "ne")} />
              <Tooltip 
                formatter={(value, name) => [localizeNumber(Number(value).toLocaleString(), "ne"), name]}
                labelFormatter={(label) => `उमेर समूह: ${label}`}
              />
              <Legend 
                wrapperStyle={{ paddingTop: 20 }}
                layout="horizontal"
                verticalAlign="bottom"
              />
              {Object.entries(MARITAL_STATUS_NAMES).map(([status, name]) => (
                <Bar
                  key={status}
                  dataKey={name}
                  stackId="a"
                  fill={
                    MARITAL_STATUS_COLORS[
                      status as keyof typeof MARITAL_STATUS_COLORS
                    ] || "#888"
                  }
                  name={name}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </TabsContent>

        <TabsContent value="grouped" className="h-[450px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={stackedBarData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              barSize={16}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis 
                dataKey="ageGroup" 
                angle={-45} 
                textAnchor="end"
                height={80}
                interval={0}
                fontSize={11}
              />
              <YAxis tickFormatter={(value) => localizeNumber(value.toString(), "ne")} />
              <Tooltip 
                formatter={(value, name) => [localizeNumber(Number(value).toLocaleString(), "ne"), name]}
                labelFormatter={(label) => `उमेर समूह: ${label}`}
              />
              <Legend 
                wrapperStyle={{ paddingTop: 20 }}
                layout="horizontal"
                verticalAlign="bottom"
              />
              {Object.entries(MARITAL_STATUS_NAMES).map(([status, name]) => (
                <Bar
                  key={status}
                  dataKey={name}
                  fill={
                    MARITAL_STATUS_COLORS[
                      status as keyof typeof MARITAL_STATUS_COLORS
                    ] || "#888"
                  }
                  name={name}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </TabsContent>

        <TabsContent value="percentage" className="h-[450px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={percentageData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis 
                dataKey="ageGroup" 
                angle={-45} 
                textAnchor="end"
                height={80}
                interval={0}
                fontSize={11}
              />
              <YAxis tickFormatter={(value) => `${localizeNumber(value.toString(), "ne")}%`} />
              <Tooltip 
                formatter={(value) => [`${localizeNumber(Number(value).toFixed(1), "ne")}%`]}
                labelFormatter={(label) => `उमेर समूह: ${label}`}
              />
              <Legend />
              {Object.entries(MARITAL_STATUS_NAMES).map(([status, name]) => (
                <Area
                  key={status}
                  type="monotone"
                  dataKey={name}
                  stackId="1"
                  stroke={
                    MARITAL_STATUS_COLORS[
                      status as keyof typeof MARITAL_STATUS_COLORS
                    ] || "#888"
                  }
                  fill={
                    MARITAL_STATUS_COLORS[
                      status as keyof typeof MARITAL_STATUS_COLORS
                    ] || "#888"
                  }
                  name={name}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </TabsContent>
      </Tabs>
    
    </div>
  );
}
