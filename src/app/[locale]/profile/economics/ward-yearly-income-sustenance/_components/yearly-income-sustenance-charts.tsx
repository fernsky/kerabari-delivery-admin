import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import IncomeSustenancePieChart from "./charts/income-sustenance-pie-chart";
import IncomeSustenanceBarChart from "./charts/income-sustenance-bar-chart";
import WardIncomeSustenanceCharts from "./charts/ward-income-sustenance-charts";
import { MonthsSustainedEnum } from "@/server/api/routers/profile/economics/ward-wise-annual-income-sustenance.schema";

// Define colors for months sustained categories
const MONTHS_SUSTAINED_COLORS = {
  UPTO_THREE_MONTHS: "#FF5733", // Red-orange
  THREE_TO_SIX_MONTHS: "#FFC300", // Yellow
  SIX_TO_NINE_MONTHS: "#36A2EB", // Blue
  TWELVE_MONTHS: "#4CAF50", // Green
};

interface YearlyIncomeSustenanceChartsProps {
  overallSummary: Array<{
    monthsSustained: string;
    monthsSustainedName: string;
    households: number;
  }>;
  totalHouseholds: number;
  pieChartData: Array<{
    name: string;
    value: number;
    percentage: string;
  }>;
  wardWiseData: Array<Record<string, any>>;
  wardNumbers: number[];
  incomeSustenanceData: Array<{
    id?: string;
    wardNumber: number;
    monthsSustained: string;
    households: number;
  }>;
  MONTHS_SUSTAINED_NAMES: Record<string, string>;
}

export default function YearlyIncomeSustenanceCharts({
  overallSummary,
  totalHouseholds,
  pieChartData,
  wardWiseData,
  wardNumbers,
  incomeSustenanceData,
  MONTHS_SUSTAINED_NAMES,
}: YearlyIncomeSustenanceChartsProps) {
  return (
    <>
      {/* Overall income sustenance distribution - with pre-rendered table and client-side chart */}
      <div className="mb-12 border rounded-lg shadow-sm overflow-hidden bg-card">
        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold">
            वार्षिक आयको पर्याप्तता वितरण
          </h3>
          <p className="text-sm text-muted-foreground">
            कुल घरपरिवार: {totalHouseholds.toLocaleString()}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
          {/* Client-side pie chart */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-medium mb-4 text-center">पाई चार्ट</h4>
            <div className="h-[400px]">
              <IncomeSustenancePieChart
                pieChartData={pieChartData}
                MONTHS_SUSTAINED_NAMES={MONTHS_SUSTAINED_NAMES}
                MONTHS_SUSTAINED_COLORS={MONTHS_SUSTAINED_COLORS}
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
                    <th className="border p-2 text-left">आयको पर्याप्तता</th>
                    <th className="border p-2 text-right">घरपरिवार संख्या</th>
                    <th className="border p-2 text-right">प्रतिशत</th>
                  </tr>
                </thead>
                <tbody>
                  {overallSummary.map((item, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-muted/40" : ""}>
                      <td className="border p-2">{i + 1}</td>
                      <td className="border p-2">{item.monthsSustainedName}</td>
                      <td className="border p-2 text-right">
                        {item.households.toLocaleString()}
                      </td>
                      <td className="border p-2 text-right">
                        {((item.households / totalHouseholds) * 100).toFixed(2)}
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
                      {totalHouseholds.toLocaleString()}
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
            आयको पर्याप्तता अनुसार वितरण
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {overallSummary.map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor:
                      MONTHS_SUSTAINED_COLORS[
                        item.monthsSustained as keyof typeof MONTHS_SUSTAINED_COLORS
                      ] || "#888",
                  }}
                ></div>
                <div className="flex-grow">
                  <div className="flex justify-between items-center">
                    <span>{item.monthsSustainedName}</span>
                    <span className="font-medium">
                      {((item.households / totalHouseholds) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(item.households / totalHouseholds) * 100}%`,
                        backgroundColor:
                          MONTHS_SUSTAINED_COLORS[
                            item.monthsSustained as keyof typeof MONTHS_SUSTAINED_COLORS
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

      {/* Ward-wise distribution - pre-rendered table with client-side chart */}
      <div className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card">
        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold">
            वडा अनुसार आयको पर्याप्तता वितरण
          </h3>
          <p className="text-sm text-muted-foreground">
            वडा र आयको पर्याप्तता अनुसार घरपरिवार वितरण
          </p>
        </div>

        <div className="p-6">
          <div className="h-[500px]">
            <IncomeSustenanceBarChart
              wardWiseData={wardWiseData}
              MONTHS_SUSTAINED_COLORS={MONTHS_SUSTAINED_COLORS}
              MONTHS_SUSTAINED_NAMES={MONTHS_SUSTAINED_NAMES}
            />
          </div>
        </div>
      </div>

      {/* Detailed ward analysis - with pre-rendered HTML table for SEO */}
      <div className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card">
        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold">
            वडा अनुसार विस्तृत आयको पर्याप्तता विश्लेषण
          </h3>
          <p className="text-sm text-muted-foreground">
            प्रत्येक वडामा वार्षिक आयको पर्याप्तताको विस्तृत स्थिति
          </p>
        </div>

        <div className="p-6">
          <h4 className="text-lg font-medium mb-4">
            वडागत आयको पर्याप्तता तालिका
          </h4>
          <div className="overflow-auto max-h-[600px]">
            <table className="w-full border-collapse min-w-[800px]">
              <thead className="sticky top-0 z-10">
                <tr className="bg-muted">
                  <th className="border p-2">वडा नं.</th>
                  <th className="border p-2">वर्षभरि पुग्ने घरपरिवार</th>
                  <th className="border p-2 text-right">प्रतिशत</th>
                  <th className="border p-2">६-९ महिना पुग्ने घरपरिवार</th>
                  <th className="border p-2 text-right">प्रतिशत</th>
                  <th className="border p-2">
                    ३ महिना भन्दा कम पुग्ने घरपरिवार
                  </th>
                  <th className="border p-2 text-right">प्रतिशत</th>
                </tr>
              </thead>
              <tbody>
                {wardNumbers.map((wardNumber, i) => {
                  const wardItems = incomeSustenanceData.filter(
                    (item) => item.wardNumber === wardNumber,
                  );
                  const wardTotal = wardItems.reduce(
                    (sum, item) => sum + (item.households || 0),
                    0,
                  );

                  // Get specific month categories
                  const yearRound = wardItems.find(
                    (item) => item.monthsSustained === "TWELVE_MONTHS",
                  );
                  const sixToNine = wardItems.find(
                    (item) => item.monthsSustained === "SIX_TO_NINE_MONTHS",
                  );
                  const upToThree = wardItems.find(
                    (item) => item.monthsSustained === "UPTO_THREE_MONTHS",
                  );

                  return (
                    <tr key={i} className={i % 2 === 0 ? "bg-muted/50" : ""}>
                      <td className="border p-2">वडा {wardNumber}</td>
                      <td className="border p-2 text-right">
                        {yearRound?.households?.toLocaleString() || "0"}
                      </td>
                      <td className="border p-2 text-right">
                        {wardTotal > 0 && yearRound?.households
                          ? ((yearRound.households / wardTotal) * 100).toFixed(
                              2,
                            ) + "%"
                          : "0%"}
                      </td>
                      <td className="border p-2 text-right">
                        {sixToNine?.households?.toLocaleString() || "0"}
                      </td>
                      <td className="border p-2 text-right">
                        {wardTotal > 0 && sixToNine?.households
                          ? ((sixToNine.households / wardTotal) * 100).toFixed(
                              2,
                            ) + "%"
                          : "0%"}
                      </td>
                      <td className="border p-2 text-right">
                        {upToThree?.households?.toLocaleString() || "0"}
                      </td>
                      <td className="border p-2 text-right">
                        {wardTotal > 0 && upToThree?.households
                          ? ((upToThree.households / wardTotal) * 100).toFixed(
                              2,
                            ) + "%"
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

          {/* Ward charts (client component) */}
          <h4 className="text-lg font-medium mt-8 mb-4">वडागत चार्टहरू</h4>
          <WardIncomeSustenanceCharts
            wardNumbers={wardNumbers}
            incomeSustenanceData={incomeSustenanceData}
            MONTHS_SUSTAINED_NAMES={MONTHS_SUSTAINED_NAMES}
            MONTHS_SUSTAINED_COLORS={MONTHS_SUSTAINED_COLORS}
          />
        </div>
      </div>
    </>
  );
}
