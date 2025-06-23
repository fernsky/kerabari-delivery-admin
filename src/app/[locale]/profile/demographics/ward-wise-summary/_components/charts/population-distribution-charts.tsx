"use client";

import { TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { localizeNumber } from "@/lib/utils/localize-number";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  XAxis,
  YAxis,
  CartesianGrid,
  Label,
} from "recharts";

// Modern aesthetic color palette
const WARD_COLORS = [
  "#6366F1", // Indigo
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#F43F5E", // Rose
  "#10B981", // Emerald
  "#06B6D4", // Cyan
  "#3B82F6", // Blue
  "#F59E0B", // Amber
  "#84CC16", // Lime
  "#9333EA", // Fuchsia
  "#14B8A6", // Teal
  "#EF4444", // Red
];

// Create a custom formatter for Recharts tooltips that uses localizeNumber
const CustomTooltipFormatter = (value: number) => {
  return localizeNumber(value.toLocaleString(), "ne");
};

// Customize the label for pie chart to use Nepali numbers
const renderCustomizedPieLabel = ({
  ward,
  percentage,
}: {
  ward: string;
  percentage: string;
}) => {
  return `${ward}: ${localizeNumber(percentage, "ne")}%`;
};

// Custom tooltip component for better presentation
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background p-3 border shadow-sm rounded-md">
        <p className="font-medium mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex justify-between gap-4">
            <span className="text-sm">{entry.name}:</span>
            <span className="font-medium">
              {localizeNumber(entry.value.toLocaleString(), "ne")}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// Custom tooltip component for pie chart
const CustomPieTooltip = ({ active, payload, totalPopulation }: any) => {
  if (active && payload && payload.length) {
    const { name, value } = payload[0];
    const percentage = ((value / totalPopulation) * 100).toFixed(1);

    return (
      <div className="bg-background p-3 border shadow-sm rounded-md">
        <p className="font-medium">{name}</p>
        <div className="flex items-center justify-between gap-4 mt-1">
          <span>जनसंख्या:</span>
          <span className="font-medium">
            {localizeNumber(value.toLocaleString(), "ne")} ({localizeNumber(percentage, "ne")}%)
          </span>
        </div>
      </div>
    );
  }
  return null;
};

interface PopulationDistributionChartsProps {
  selectedTab: string;
  wardPopulationData: Array<{
    ward: string;
    population: number;
    malePopulation: number;
    femalePopulation: number;
    otherPopulation: number;
    percentage: string;
    households: number;
  }>;
  municipalityStats: {
    totalPopulation: number;
    malePopulation: number;
    femalePopulation: number;
    otherPopulation: number;
    totalHouseholds: number;
  };
  municipalityAverages: {
    averageHouseholdSize: number;
    sexRatio: number;
  };
}

export default function PopulationDistributionCharts({
  selectedTab,
  wardPopulationData,
  municipalityStats,
  municipalityAverages,
}: PopulationDistributionChartsProps) {
  // Calculate total population for percentage calculations
  const totalPopulation = municipalityStats.totalPopulation;
  
  return (
    <>
      <TabsContent value="bar" className="p-4">
        <div className="h-[500px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={wardPopulationData}
              margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
              barSize={30}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis
                dataKey="ward"
                scale="point"
                padding={{ left: 10, right: 10 }}
                tick={{ fontSize: 12 }}
              />
              <YAxis tickFormatter={CustomTooltipFormatter}>
                <Label
                  value="जनसंख्या"
                  angle={-90}
                  position="insideLeft"
                  style={{ textAnchor: "middle" }}
                />
              </YAxis>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar
                dataKey="population"
                name="जनसंख्या"
                fill="#B5EAD7"
                radius={[4, 4, 0, 0]}
              >
                {wardPopulationData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={WARD_COLORS[index % WARD_COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </TabsContent>

      <TabsContent value="pie" className="p-4">
        <div className="h-[500px] flex flex-col">
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={wardPopulationData}
                  cx="50%"
                  cy="50%"
                  outerRadius={140}
                  innerRadius={30}
                  fill="#8884d8"
                  dataKey="population"
                  nameKey="ward"
                >
                  {wardPopulationData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={WARD_COLORS[index % WARD_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip totalPopulation={totalPopulation} />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          {/* Custom Legend with percentage bars */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 overflow-y-auto max-h-[150px] px-4">
            {wardPopulationData.map((item, i) => {
              const percentage = (item.population / totalPopulation) * 100;
              
              return (
                <div key={i} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor: WARD_COLORS[i % WARD_COLORS.length]
                    }}
                  ></div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-center text-xs">
                      <span className="truncate">{item.ward}</span>
                      <span className="font-medium">
                        {localizeNumber(percentage.toFixed(1), "ne")}%
                      </span>
                    </div>
                    <div className="w-full bg-muted h-1.5 rounded-full mt-0.5 overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: WARD_COLORS[i % WARD_COLORS.length]
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </TabsContent>

      <TabsContent value="table" className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted">
                <th className="border p-2 text-left">वडा</th>
                <th className="border p-2 text-right">जनसंख्या</th>
                <th className="border p-2 text-right">प्रतिशत</th>
                <th className="border p-2 text-right">पुरुष</th>
                <th className="border p-2 text-right">महिला</th>
                <th className="border p-2 text-right">अन्य</th>
              </tr>
            </thead>
            <tbody>
              {wardPopulationData.map((item, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-muted/40" : ""}>
                  <td className="border p-2">{item.ward}</td>
                  <td className="border p-2 text-right">
                    {localizeNumber(item.population.toLocaleString(), "ne")}
                  </td>
                  <td className="border p-2 text-right">
                    {localizeNumber(item.percentage, "ne")}%
                  </td>
                  <td className="border p-2 text-right">
                    {localizeNumber(item.malePopulation.toLocaleString(), "ne")}
                  </td>
                  <td className="border p-2 text-right">
                    {localizeNumber(
                      item.femalePopulation.toLocaleString(),
                      "ne",
                    )}
                  </td>
                  <td className="border p-2 text-right">
                    {localizeNumber(
                      item.otherPopulation.toLocaleString(),
                      "ne",
                    )}
                  </td>
                </tr>
              ))}
              <tr className="font-semibold bg-muted/70">
                <td className="border p-2">जम्मा</td>
                <td className="border p-2 text-right">
                  {localizeNumber(
                    municipalityStats.totalPopulation.toLocaleString(),
                    "ne",
                  )}
                </td>
                <td className="border p-2 text-right">
                  {localizeNumber("100.00", "ne")}%
                </td>
                <td className="border p-2 text-right">
                  {localizeNumber(
                    municipalityStats.malePopulation.toLocaleString(),
                    "ne",
                  )}
                </td>
                <td className="border p-2 text-right">
                  {localizeNumber(
                    municipalityStats.femalePopulation.toLocaleString(),
                    "ne",
                  )}
                </td>
                <td className="border p-2 text-right">
                  {localizeNumber(
                    municipalityStats.otherPopulation.toLocaleString(),
                    "ne",
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
       
      </TabsContent>
    </>
  );
}
