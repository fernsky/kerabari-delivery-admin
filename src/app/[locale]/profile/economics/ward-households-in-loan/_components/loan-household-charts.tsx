import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import LoanHouseholdBarChart from "./charts/loan-household-bar-chart";
import LoanHouseholdPieChart from "./charts/loan-household-pie-chart";
import LoanHouseholdDistributionChart from "./charts/loan-household-distribution-chart";

// Define colors for consistency
const LOAN_COLORS = {
  primaryColor: "#FF5733",
  secondaryColor: "#36A2EB",
  accentColor: "#4BC0C0",
  neutralColor: "#9966FF",
  highlightColor: "#FFCE56",
};

interface LoanHouseholdChartsProps {
  wardWiseData: Array<{
    ward: string;
    households: number;
    wardNumber: number;
  }>;
  pieChartData: Array<{
    name: string;
    value: number;
    percentage: string;
  }>;
  totalHouseholdsOnLoan: number;
  topWardsByLoan: Array<{
    ward: string;
    households: number;
    wardNumber: number;
  }>;
}

export default function LoanHouseholdCharts({
  wardWiseData,
  pieChartData,
  totalHouseholdsOnLoan,
  topWardsByLoan,
}: LoanHouseholdChartsProps) {
  return (
    <>
      {/* Overall loan distribution overview */}
      <div className="mb-12 border rounded-lg shadow-sm overflow-hidden bg-card">
        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold">ऋण लिएका घरपरिवारको वितरण</h3>
          <p className="text-sm text-muted-foreground">
            कुल ऋणी घरपरिवार: {totalHouseholdsOnLoan.toLocaleString()}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
          {/* Client-side pie chart */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-medium mb-4 text-center">पाई चार्ट</h4>
            <div className="h-[400px]">
              <LoanHouseholdPieChart
                pieChartData={pieChartData}
                LOAN_COLORS={LOAN_COLORS}
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
                    <th className="border p-2 text-left">वडा</th>
                    <th className="border p-2 text-right">ऋणी घरपरिवार</th>
                    <th className="border p-2 text-right">प्रतिशत</th>
                  </tr>
                </thead>
                <tbody>
                  {wardWiseData.map((item, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-muted/40" : ""}>
                      <td className="border p-2">{i + 1}</td>
                      <td className="border p-2">{item.ward}</td>
                      <td className="border p-2 text-right">
                        {item.households.toLocaleString()}
                      </td>
                      <td className="border p-2 text-right">
                        {(
                          (item.households / totalHouseholdsOnLoan) *
                          100
                        ).toFixed(2)}
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
                      {totalHouseholdsOnLoan.toLocaleString()}
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
      </div>

      {/* Ward-wise bar chart */}
      <div className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card">
        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold">वडागत ऋणी घरपरिवार</h3>
          <p className="text-sm text-muted-foreground">
            वडा अनुसार ऋण लिएका घरपरिवारको संख्या
          </p>
        </div>

        <div className="p-6">
          <div className="h-[500px]">
            <LoanHouseholdBarChart
              wardWiseData={wardWiseData}
              LOAN_COLORS={LOAN_COLORS}
            />
          </div>
        </div>
      </div>

      {/* Top wards with highest loan percentage */}
      <div className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card">
        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold">
            सबैभन्दा बढी ऋणी घरपरिवार भएका वडाहरू
          </h3>
          <p className="text-sm text-muted-foreground">
            ऋण लिएका घरपरिवारको संख्याको आधारमा शीर्ष 5 वडाहरू
          </p>
        </div>

        <div className="p-6">
          <div className="h-[400px]">
            <LoanHouseholdDistributionChart
              topWardsByLoan={topWardsByLoan}
              totalHouseholdsOnLoan={totalHouseholdsOnLoan}
              LOAN_COLORS={LOAN_COLORS}
            />
          </div>
        </div>
      </div>
    </>
  );
}
