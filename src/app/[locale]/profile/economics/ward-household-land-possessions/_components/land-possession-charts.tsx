import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import LandPossessionBarChart from "./charts/land-possession-bar-chart";
import LandPossessionPieChart from "./charts/land-possession-pie-chart";
import LandOwnershipStatusPieChart from "./charts/land-ownership-status-pie-chart";

// Define colors for consistency
const LAND_COLORS = {
  primary: "#4CAF50", // Green for land-owning
  secondary: "#F44336", // Red for landless
  accent: "#2196F3", // Blue accent
  neutral: "#9E9E9E", // Grey for neutral
};

interface LandPossessionChartsProps {
  wardWiseData: Array<{
    ward: string;
    households: number;
    wardNumber: number;
    percentage: string;
  }>;
  pieChartData: Array<{
    name: string;
    value: number;
    percentage: string;
  }>;
  landOwnershipStatusData: Array<{
    name: string;
    value: number;
    percentage: string;
  }>;
  totalHouseholdsWithLand: number;
  estimatedTotalHouseholds: number;
}

export default function LandPossessionCharts({
  wardWiseData,
  pieChartData,
  landOwnershipStatusData,
  totalHouseholdsWithLand,
  estimatedTotalHouseholds,
}: LandPossessionChartsProps) {
  return (
    <>
      {/* Land ownership status overview */}
      <div className="mb-12 border rounded-lg shadow-sm overflow-hidden bg-card">
        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold">जग्गा स्वामित्वको अवस्था</h3>
          <p className="text-sm text-muted-foreground">
            कुल घरपरिवार: अनुमानित{" "}
            {Math.round(estimatedTotalHouseholds).toLocaleString()}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
          {/* Client-side pie chart */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-medium mb-4 text-center">पाई चार्ट</h4>
            <div className="h-[400px]">
              <LandOwnershipStatusPieChart
                landOwnershipStatusData={landOwnershipStatusData}
                LAND_COLORS={LAND_COLORS}
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
                    <th className="border p-2 text-left">स्वामित्वको अवस्था</th>
                    <th className="border p-2 text-right">घरपरिवार संख्या</th>
                    <th className="border p-2 text-right">प्रतिशत</th>
                  </tr>
                </thead>
                <tbody>
                  {landOwnershipStatusData.map((item, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-muted/40" : ""}>
                      <td className="border p-2">{i + 1}</td>
                      <td className="border p-2">{item.name}</td>
                      <td className="border p-2 text-right">
                        {Math.round(item.value).toLocaleString()}
                      </td>
                      <td className="border p-2 text-right">
                        {item.percentage}%
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
                      {Math.round(estimatedTotalHouseholds).toLocaleString()}
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
            जग्गा स्वामित्वको अवस्था
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-4">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: LAND_COLORS.primary }}
              ></div>
              <div className="flex-grow">
                <div className="flex justify-between items-center">
                  <span>जग्गाधनी घरपरिवार</span>
                  <span className="font-medium">
                    {landOwnershipStatusData[0].percentage}%
                  </span>
                </div>
                <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${landOwnershipStatusData[0].percentage}%`,
                      backgroundColor: LAND_COLORS.primary,
                    }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: LAND_COLORS.secondary }}
              ></div>
              <div className="flex-grow">
                <div className="flex justify-between items-center">
                  <span>जग्गाविहीन घरपरिवार</span>
                  <span className="font-medium">
                    {landOwnershipStatusData[1].percentage}%
                  </span>
                </div>
                <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${landOwnershipStatusData[1].percentage}%`,
                      backgroundColor: LAND_COLORS.secondary,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ward-wise land-owning households overview */}
      <div className="mb-12 border rounded-lg shadow-sm overflow-hidden bg-card">
        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold">
            वडा अनुसार जग्गाधनी घरपरिवार
          </h3>
          <p className="text-sm text-muted-foreground">
            कुल जग्गाधनी घरपरिवार: {totalHouseholdsWithLand.toLocaleString()}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
          {/* Client-side pie chart */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-medium mb-4 text-center">पाई चार्ट</h4>
            <div className="h-[400px]">
              <LandPossessionPieChart
                pieChartData={pieChartData}
                LAND_COLORS={LAND_COLORS}
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
                    <th className="border p-2 text-right">जग्गाधनी घरपरिवार</th>
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
                        {item.percentage}%
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
                      {totalHouseholdsWithLand.toLocaleString()}
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
          <h3 className="text-xl font-semibold">वडागत जग्गाधनी घरपरिवार</h3>
          <p className="text-sm text-muted-foreground">
            वडा अनुसार जग्गाधनी घरपरिवारको संख्या
          </p>
        </div>

        <div className="p-6">
          <div className="h-[500px]">
            <LandPossessionBarChart
              wardWiseData={wardWiseData}
              LAND_COLORS={LAND_COLORS}
            />
          </div>
        </div>
      </div>
    </>
  );
}
