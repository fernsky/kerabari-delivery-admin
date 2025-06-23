import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import TimeSpentPieChart from "./charts/time-spent-pie-chart";
import WardTimeSpentBarChart from "./charts/ward-time-spent-bar-chart";
import WardTimeSpentAnalysis from "./charts/ward-time-spent-analysis";

// Define colors for consistency
const TIME_SPENT_COLORS = {
  LESS_THAN_1_HOUR: "#4BC0C0",
  HOURS_1_TO_3: "#36A2EB",
  HOURS_4_TO_6: "#FFCD56",
  HOURS_7_TO_9: "#FF9F40",
  HOURS_10_TO_12: "#FF6384",
  MORE_THAN_12_HOURS: "#9966FF",
};

interface HouseholdChoresChartsProps {
  overallSummary: Array<{
    timeSpent: string;
    timeSpentName: string;
    population: number;
  }>;
  totalPopulation: number;
  pieChartData: Array<{
    name: string;
    value: number;
    percentage: string;
  }>;
  wardWiseData: Array<Record<string, any>>;
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
}

export default function HouseholdChoresCharts({
  overallSummary,
  totalPopulation,
  pieChartData,
  wardWiseData,
  wardNumbers,
  householdChoresData,
  TIME_SPENT_NAMES,
}: HouseholdChoresChartsProps) {
  return (
    <>
      {/* Overall time spent distribution - with pre-rendered table and client-side chart */}
      <div className="mb-12 border rounded-lg shadow-sm overflow-hidden bg-card">
        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold">
            घरायसी कामकाजमा खर्चिने समय अनुसार वितरण
          </h3>
          <p className="text-sm text-muted-foreground">
            कुल जनसंख्या: {totalPopulation.toLocaleString()} व्यक्ति
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
          {/* Client-side pie chart */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-medium mb-4 text-center">पाई चार्ट</h4>
            <div className="h-[400px]">
              <TimeSpentPieChart
                pieChartData={pieChartData}
                TIME_SPENT_NAMES={TIME_SPENT_NAMES}
                TIME_SPENT_COLORS={TIME_SPENT_COLORS}
              />
            </div>
          </div>

          {/* Server-side pre-rendered table for SEO */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-medium mb-4 text-center">तालिका</h4>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted sticky top-0">
                    <th className="border p-2 text-left">क्र.सं.</th>
                    <th className="border p-2 text-left">समय अवधि</th>
                    <th className="border p-2 text-right">जनसंख्या</th>
                    <th className="border p-2 text-right">प्रतिशत</th>
                  </tr>
                </thead>
                <tbody>
                  {overallSummary.map((item, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-muted/40" : ""}>
                      <td className="border p-2">{i + 1}</td>
                      <td className="border p-2">{item.timeSpentName}</td>
                      <td className="border p-2 text-right">
                        {item.population.toLocaleString()}
                      </td>
                      <td className="border p-2 text-right">
                        {((item.population / totalPopulation) * 100).toFixed(2)}
                        %
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="font-semibold bg-muted/70">
                    <td className="border p-2" colSpan={2}>
                      जम्मा
                    </td>
                    <td className="border p-2 text-right">
                      {totalPopulation.toLocaleString()}
                    </td>
                    <td className="border p-2 text-right">100.00%</td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <div className="mt-4 flex justify-end">
              <Button variant="outline" size="sm">
                <FileDown className="mr-2 h-4 w-4" />
                Excel डाउनलोड
              </Button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 p-4 border-t">
          <h4 className="text-sm font-medium text-muted-foreground mb-4">
            घरायसी कामकाजमा खर्चिने समयको वितरण
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {overallSummary.map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor:
                      TIME_SPENT_COLORS[
                        item.timeSpent as keyof typeof TIME_SPENT_COLORS
                      ] || "#888",
                  }}
                ></div>
                <div className="flex-grow">
                  <div className="flex justify-between items-center">
                    <span>{item.timeSpentName}</span>
                    <span className="font-medium">
                      {((item.population / totalPopulation) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(item.population / totalPopulation) * 100}%`,
                        backgroundColor:
                          TIME_SPENT_COLORS[
                            item.timeSpent as keyof typeof TIME_SPENT_COLORS
                          ] || "#888",
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ward-wise distribution - bar chart */}
      <div
        id="ward-wise-chores"
        className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card"
      >
        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold">
            वडा अनुसार घरायसी कामकाज समय वितरण
          </h3>
          <p className="text-sm text-muted-foreground">
            वडा र समय अवधि अनुसार जनसंख्या वितरण
          </p>
        </div>

        <div className="p-6">
          <div className="h-[500px]">
            <WardTimeSpentBarChart
              wardWiseData={wardWiseData}
              TIME_SPENT_COLORS={TIME_SPENT_COLORS}
              TIME_SPENT_NAMES={TIME_SPENT_NAMES}
            />
          </div>
        </div>
      </div>

      {/* Detailed ward analysis */}
      <div className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card">
        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold">वडा अनुसार विस्तृत विश्लेषण</h3>
          <p className="text-sm text-muted-foreground">
            प्रत्येक वडाको घरायसी कामकाज समय वितरणको विस्तृत विश्लेषण
          </p>
        </div>

        <div className="p-6">
          <h4 className="text-lg font-medium mb-4">वडागत तालिका</h4>
          <div className="overflow-auto max-h-[600px]">
            <table className="w-full border-collapse min-w-[800px]">
              <thead className="sticky top-0 z-10">
                <tr className="bg-muted">
                  <th className="border p-2">वडा नं.</th>
                  <th className="border p-2">मुख्य समय अवधि</th>
                  <th className="border p-2 text-right">जनसंख्या</th>
                  <th className="border p-2 text-right">वडाको प्रतिशत</th>
                  <th className="border p-2">दोस्रो समय अवधि</th>
                  <th className="border p-2 text-right">जनसंख्या</th>
                  <th className="border p-2 text-right">वडाको प्रतिशत</th>
                </tr>
              </thead>
              <tbody>
                {wardNumbers.map((wardNumber, i) => {
                  const wardItems = householdChoresData.filter(
                    (item) => item.wardNumber === wardNumber,
                  );
                  const wardTotal = wardItems.reduce(
                    (sum, item) => sum + (item.population || 0),
                    0,
                  );

                  // Sort by population to find primary and secondary time spent categories
                  const sortedItems = [...wardItems].sort(
                    (a, b) => (b.population || 0) - (a.population || 0),
                  );
                  const primaryTimeSpent = sortedItems[0];
                  const secondaryTimeSpent = sortedItems[1];

                  return (
                    <tr key={i} className={i % 2 === 0 ? "bg-muted/50" : ""}>
                      <td className="border p-2">वडा {wardNumber}</td>
                      <td className="border p-2">
                        {primaryTimeSpent
                          ? TIME_SPENT_NAMES[primaryTimeSpent.timeSpent] ||
                            primaryTimeSpent.timeSpent
                          : "-"}
                      </td>
                      <td className="border p-2 text-right">
                        {primaryTimeSpent?.population?.toLocaleString() || "0"}
                      </td>
                      <td className="border p-2 text-right">
                        {wardTotal > 0 && primaryTimeSpent?.population
                          ? (
                              (primaryTimeSpent.population / wardTotal) *
                              100
                            ).toFixed(2) + "%"
                          : "0%"}
                      </td>
                      <td className="border p-2">
                        {secondaryTimeSpent
                          ? TIME_SPENT_NAMES[secondaryTimeSpent.timeSpent] ||
                            secondaryTimeSpent.timeSpent
                          : "-"}
                      </td>
                      <td className="border p-2 text-right">
                        {secondaryTimeSpent?.population?.toLocaleString() ||
                          "0"}
                      </td>
                      <td className="border p-2 text-right">
                        {wardTotal > 0 && secondaryTimeSpent?.population
                          ? (
                              (secondaryTimeSpent.population / wardTotal) *
                              100
                            ).toFixed(2) + "%"
                          : "0%"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex justify-end">
            <Button variant="outline" size="sm">
              <FileDown className="mr-2 h-4 w-4" />
              Excel डाउनलोड
            </Button>
          </div>

          {/* Ward analysis charts (client component) */}
          <h4 className="text-lg font-medium mt-8 mb-4">वडागत विश्लेषण</h4>
          <WardTimeSpentAnalysis
            wardNumbers={wardNumbers}
            householdChoresData={householdChoresData}
            TIME_SPENT_NAMES={TIME_SPENT_NAMES}
            TIME_SPENT_COLORS={TIME_SPENT_COLORS}
          />
        </div>
      </div>
    </>
  );
}
