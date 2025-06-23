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
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { localizeNumber } from "@/lib/utils/localize-number";

// Define gender colors for consistency
const GENDER_COLORS = {
  male: "#36A2EB", // Blue
  female: "#FF6384", // Pink/Red
  other: "#FFCD56", // Yellow
};

interface GenderMaritalStatusChartProps {
  genderWiseData: Array<{
    status: string;
    statusName: string;
    male: number;
    female: number;
    other: number;
    total: number;
  }>;
}

export default function GenderMaritalStatusChart({
  genderWiseData,
}: GenderMaritalStatusChartProps) {
  const [chartType, setChartType] = useState<string>("horizontal");

  // Sort data by total population
  const sortedData = [...genderWiseData]
    .sort((a, b) => b.total - a.total);

  // Prepare gender distribution data for pie charts
  const maleDistribution = genderWiseData.map(item => ({
    name: item.statusName,
    value: item.male,
  }));
  
  const femaleDistribution = genderWiseData.map(item => ({
    name: item.statusName,
    value: item.female,
  }));
  
  const otherDistribution = genderWiseData.map(item => ({
    name: item.statusName,
    value: item.other,
  }));

  // Calculate totals for percentages
  const totalMale = genderWiseData.reduce((sum, item) => sum + item.male, 0);
  const totalFemale = genderWiseData.reduce((sum, item) => sum + item.female, 0);
  const totalOther = genderWiseData.reduce((sum, item) => sum + item.other, 0);

  return (
    <div className="space-y-4">
      <Tabs value={chartType} onValueChange={setChartType}>
        <TabsList className="grid grid-cols-3 w-[400px] mx-auto mb-4">
          <TabsTrigger value="horizontal">क्षैतिज बार</TabsTrigger>
          <TabsTrigger value="vertical">ठाडो बार</TabsTrigger>
          <TabsTrigger value="gender-dist">लैंगिक वितरण</TabsTrigger>
        </TabsList>

        <TabsContent value="horizontal" className="h-[550px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={sortedData}
              margin={{ top: 20, right: 30, left: 30, bottom: 40 }}
              barSize={30}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="statusName" />
              <YAxis tickFormatter={(value) => localizeNumber(value.toString(), "ne")} />
              <Tooltip formatter={(value) => localizeNumber(Number(value).toLocaleString(), "ne")} />
              <Legend />
              <Bar
                dataKey="male"
                name="पुरुष"
                fill={GENDER_COLORS.male}
              />
              <Bar
                dataKey="female"
                name="महिला"
                fill={GENDER_COLORS.female}
              />
              <Bar
                dataKey="other"
                name="अन्य"
                fill={GENDER_COLORS.other}
              />
            </BarChart>
          </ResponsiveContainer>
        </TabsContent>

        <TabsContent value="vertical" className="h-[550px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={sortedData}
              margin={{ top: 20, right: 30, left: 120, bottom: 40 }}
              layout="vertical"
              barSize={25}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} horizontal={false} />
              <XAxis type="number" tickFormatter={(value) => localizeNumber(value.toString(), "ne")} />
              <YAxis 
                dataKey="statusName" 
                type="category" 
                width={100} 
                tick={{ fontSize: 12 }}
              />
              <Tooltip formatter={(value) => localizeNumber(Number(value).toLocaleString(), "ne")} />
              <Legend layout="horizontal" verticalAlign="bottom" align="center" />
              <Bar
                dataKey="male"
                name="पुरुष"
                stackId="a"
                fill={GENDER_COLORS.male}
              />
              <Bar
                dataKey="female"
                name="महिला"
                stackId="a"
                fill={GENDER_COLORS.female}
              />
              <Bar
                dataKey="other"
                name="अन्य"
                stackId="a"
                fill={GENDER_COLORS.other}
              />
            </BarChart>
          </ResponsiveContainer>
        </TabsContent>

        <TabsContent value="gender-dist" >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="text-center font-medium mb-2">पुरुष</h4>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={maleDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                    >
                      {maleDistribution.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={`hsl(210, ${80 - (index * 5)}%, ${40 + (index * 5)}%)`} 
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => [
                        `${localizeNumber(value.toLocaleString(), "ne")} (${totalMale > 0 ? localizeNumber(((value / totalMale) * 100).toFixed(1), "ne") : 0}%)`,
                        "पुरुष"
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              {/* Legend section with progress bars */}
              <div className="mt-2">
                <div className="grid grid-cols-1 gap-2">
                  {maleDistribution.map((item, i) => {
                    const percentage = totalMale > 0 ? (item.value / totalMale) * 100 : 0;
                    
                    return (
                      <div key={i} className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{
                            backgroundColor: `hsl(210, ${80 - (i * 5)}%, ${40 + (i * 5)}%)`
                          }}
                        ></div>
                        <div className="flex-grow">
                          <div className="flex justify-between items-center text-xs">
                            <span className="truncate">{item.name}</span>
                            <span className="font-medium">
                              {localizeNumber(percentage.toFixed(1), "ne")}%
                            </span>
                          </div>
                          <div className="w-full bg-muted h-1.5 rounded-full mt-0.5 overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${percentage}%`,
                                backgroundColor: `hsl(210, ${80 - (i * 5)}%, ${40 + (i * 5)}%)`
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-center font-medium mb-2">महिला</h4>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={femaleDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                    >
                      {femaleDistribution.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={`hsl(350, ${80 - (index * 5)}%, ${40 + (index * 5)}%)`} 
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => [
                        `${localizeNumber(value.toLocaleString(), "ne")} (${totalFemale > 0 ? localizeNumber(((value / totalFemale) * 100).toFixed(1), "ne") : 0}%)`,
                        "महिला"
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              {/* Legend section with progress bars */}
              <div className="mt-2">
                <div className="grid grid-cols-1 gap-2">
                  {femaleDistribution.map((item, i) => {
                    const percentage = totalFemale > 0 ? (item.value / totalFemale) * 100 : 0;
                    
                    return (
                      <div key={i} className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{
                            backgroundColor: `hsl(350, ${80 - (i * 5)}%, ${40 + (i * 5)}%)`
                          }}
                        ></div>
                        <div className="flex-grow">
                          <div className="flex justify-between items-center text-xs">
                            <span className="truncate">{item.name}</span>
                            <span className="font-medium">
                              {localizeNumber(percentage.toFixed(1), "ne")}%
                            </span>
                          </div>
                          <div className="w-full bg-muted h-1.5 rounded-full mt-0.5 overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${percentage}%`,
                                backgroundColor: `hsl(350, ${80 - (i * 5)}%, ${40 + (i * 5)}%)`
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-center font-medium mb-2">अन्य</h4>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={otherDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                    >
                      {otherDistribution.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={`hsl(45, ${80 - (index * 5)}%, ${40 + (index * 5)}%)`} 
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => [
                        `${localizeNumber(value.toLocaleString(), "ne")} (${totalOther > 0 ? localizeNumber(((value / totalOther) * 100).toFixed(1), "ne") : 0}%)`,
                        "अन्य"
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              {/* Legend section with progress bars */}
              <div className="mt-2">
                <div className="grid grid-cols-1 gap-2">
                  {otherDistribution.map((item, i) => {
                    const percentage = totalOther > 0 ? (item.value / totalOther) * 100 : 0;
                    
                    return (
                      <div key={i} className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{
                            backgroundColor: `hsl(45, ${80 - (i * 5)}%, ${40 + (i * 5)}%)`
                          }}
                        ></div>
                        <div className="flex-grow">
                          <div className="flex justify-between items-center text-xs">
                            <span className="truncate">{item.name}</span>
                            <span className="font-medium">
                              {localizeNumber(percentage.toFixed(1), "ne")}%
                            </span>
                          </div>
                          <div className="w-full bg-muted h-1.5 rounded-full mt-0.5 overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${percentage}%`,
                                backgroundColor: `hsl(45, ${80 - (i * 5)}%, ${40 + (i * 5)}%)`
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <p className="text-sm text-muted-foreground text-center">
        लिङ्ग अनुसार वैवाहिक स्थितिको वितरण चार्ट
      </p>
    </div>
  );
}
