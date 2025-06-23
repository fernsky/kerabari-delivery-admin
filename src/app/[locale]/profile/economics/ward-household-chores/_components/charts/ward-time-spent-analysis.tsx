"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface WardTimeSpentAnalysisProps {
  wardNumbers: number[];
  householdChoresData: Array<{
    id?: string;
    wardNumber: number;
    timeSpent: string;
    population: number;
    updatedAt?: string;
    createdAt?: string;
  }>;
  TIME_SPENT_NAMES: Record<string, string>;
  TIME_SPENT_COLORS: Record<string, string>;
}

export default function WardTimeSpentAnalysis({
  wardNumbers,
  householdChoresData,
  TIME_SPENT_NAMES,
  TIME_SPENT_COLORS,
}: WardTimeSpentAnalysisProps) {
  const [selectedWard, setSelectedWard] = useState(wardNumbers[0] || 1);
  const [view, setView] = useState("table");

  // Get data for the selected ward
  const wardData = householdChoresData.filter(
    (item) => item.wardNumber === selectedWard,
  );

  // Process time spent data
  const timeSpentSummary = Object.entries(
    wardData.reduce((acc: Record<string, number>, item) => {
      if (!acc[item.timeSpent]) acc[item.timeSpent] = 0;
      acc[item.timeSpent] += item.population || 0;
      return acc;
    }, {}),
  )
    .map(([timeSpent, population]) => ({
      timeSpent,
      timeSpentName: TIME_SPENT_NAMES[timeSpent] || timeSpent,
      population,
    }))
    .sort((a, b) => {
      // Custom sort to maintain time spent order
      const order = [
        "LESS_THAN_1_HOUR",
        "HOURS_1_TO_3",
        "HOURS_4_TO_6",
        "HOURS_7_TO_9",
        "HOURS_10_TO_12",
        "MORE_THAN_12_HOURS",
      ];
      return order.indexOf(a.timeSpent) - order.indexOf(b.timeSpent);
    });

  // Calculate ward total
  const wardTotal = timeSpentSummary.reduce(
    (sum, item) => sum + item.population,
    0,
  );

  // Prepare data for charts
  const timeChartData = timeSpentSummary.map((item) => ({
    name: item.timeSpentName,
    value: item.population,
    percentage: ((item.population / wardTotal) * 100).toFixed(2),
  }));

  // Calculate high time spent percentage (7+ hours)
  const highTimePopulation = timeSpentSummary
    .filter(
      (item) =>
        item.timeSpent === "HOURS_7_TO_9" ||
        item.timeSpent === "HOURS_10_TO_12" ||
        item.timeSpent === "MORE_THAN_12_HOURS",
    )
    .reduce((sum, item) => sum + item.population, 0);

  const highTimePercentage =
    wardTotal > 0 ? ((highTimePopulation / wardTotal) * 100).toFixed(2) : "0";

  return (
    <div>
      {/* Ward selector */}
      <div className="mb-6 flex flex-wrap gap-2">
        {wardNumbers.map((wardNumber) => (
          <Button
            key={wardNumber}
            variant={selectedWard === wardNumber ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedWard(wardNumber)}
          >
            वडा {wardNumber}
          </Button>
        ))}
      </div>

      {/* View switcher */}
      <div className="mb-6">
        <Tabs value={view} onValueChange={setView} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="table">तालिका</TabsTrigger>
            <TabsTrigger value="chart">चार्ट</TabsTrigger>
            <TabsTrigger value="analysis">विश्लेषण</TabsTrigger>
          </TabsList>

          {/* Table view */}
          <TabsContent value="table" className="mt-6">
            <div>
              <h4 className="text-md font-medium mb-3">
                समय अवधि अनुसार वडा {selectedWard} को जनसंख्या
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border p-2 text-left">समय अवधि</th>
                      <th className="border p-2 text-right">जनसंख्या</th>
                      <th className="border p-2 text-right">प्रतिशत</th>
                    </tr>
                  </thead>
                  <tbody>
                    {timeSpentSummary.map((item, i) => (
                      <tr key={i} className={i % 2 === 0 ? "bg-muted/40" : ""}>
                        <td className="border p-2">{item.timeSpentName}</td>
                        <td className="border p-2 text-right">
                          {item.population.toLocaleString()}
                        </td>
                        <td className="border p-2 text-right">
                          {((item.population / wardTotal) * 100).toFixed(2)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="font-semibold bg-muted/70">
                      <td className="border p-2">जम्मा</td>
                      <td className="border p-2 text-right">
                        {wardTotal.toLocaleString()}
                      </td>
                      <td className="border p-2 text-right">100.00%</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* Chart view */}
          <TabsContent value="chart" className="mt-6">
            <div>
              <h4 className="text-md font-medium mb-3 text-center">
                समय अवधि अनुसार वितरण (वडा {selectedWard})
              </h4>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={timeChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percentage }) =>
                        `${name}: ${percentage}%`
                      }
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {timeChartData.map((entry, index) => {
                        const timeSpentKey =
                          Object.keys(TIME_SPENT_NAMES).find(
                            (key) => TIME_SPENT_NAMES[key] === entry.name,
                          ) || "LESS_THAN_1_HOUR";

                        return (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              TIME_SPENT_COLORS[
                                timeSpentKey as keyof typeof TIME_SPENT_COLORS
                              ] ||
                              `#${Math.floor(Math.random() * 16777215).toString(16)}`
                            }
                          />
                        );
                      })}
                    </Pie>
                    <Tooltip
                      formatter={(value) => Number(value).toLocaleString()}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>

          {/* Analysis view */}
          <TabsContent value="analysis" className="mt-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-muted/30 p-4 rounded-md">
                  <h4 className="font-medium mb-3">
                    घरायसी कामकाजको प्रमुख समय (वडा {selectedWard})
                  </h4>
                  <p className="text-3xl font-bold">
                    {timeSpentSummary.length > 0
                      ? timeSpentSummary.sort(
                          (a, b) => b.population - a.population,
                        )[0].timeSpentName
                      : "-"}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    सबैभन्दा धेरै व्यक्तिले घरायसी कामकाजमा खर्चिने समय अवधि
                  </p>
                </div>

                <div className="bg-muted/30 p-4 rounded-md">
                  <h4 className="font-medium mb-3">
                    ७+ घण्टा खर्च गर्ने (वडा {selectedWard})
                  </h4>
                  <p className="text-3xl font-bold">{highTimePercentage}%</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    उच्च समय (७+ घण्टा) खर्च गर्ने व्यक्तिहरू
                  </p>

                  <div className="mt-4">
                    <div className="flex items-center">
                      <div className="flex-1 bg-muted h-3 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{
                            width: `${Math.min(parseFloat(highTimePercentage), 100)}%`,
                          }}
                        ></div>
                      </div>
                      <span className="ml-3 text-sm font-medium">
                        {highTimePercentage}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-muted/30 p-4 rounded-md">
                <h4 className="font-medium mb-3">
                  वडा {selectedWard} मा घरायसी कामकाज प्रोफाइल
                </h4>
                <div className="space-y-2 text-sm">
                  <p>
                    वडा {selectedWard} मा कुल {wardTotal.toLocaleString()}{" "}
                    व्यक्तिहरूले घरायसी कामकाजमा विभिन्न समय खर्चिन्छन्।
                  </p>

                  <p>
                    सबैभन्दा बढी व्यक्तिहरू (
                    {timeChartData.sort((a, b) => b.value - a.value)[0]
                      ?.percentage || 0}
                    %) ले{" "}
                    {timeChartData.sort((a, b) => b.value - a.value)[0]?.name ||
                      ""}{" "}
                    समय घरायसी कामकाजमा खर्चिन्छन्।
                  </p>

                  <p>
                    यस वडामा {highTimePercentage}% व्यक्तिहरू (लगभग{" "}
                    {highTimePopulation.toLocaleString()} जना) ले ७ घण्टा वा
                    सोभन्दा बढी समय घरायसी कामकाजमा खर्चिन्छन्।
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
