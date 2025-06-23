import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import LandOwnershipPieChart from "./charts/land-ownership-pie-chart";
import LandOwnershipBarChart from "./charts/land-ownership-bar-chart";
import WardLandOwnershipPieCharts from "./charts/ward-land-ownership-pie-charts";
import { localizeNumber } from "@/lib/utils/localize-number";
import LandSecurityChart from "./charts/land-security-chart";

interface LandOwnershipChartsProps {
  overallSummary: Array<{
    type: string;
    typeName: string;
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
  landOwnershipData: Array<{
    id?: string;
    wardNumber: number;
    landOwnershipType: string;
    households: number;
  }>;
  wardWiseAnalysis: Array<{
    wardNumber: number;
    totalHouseholds: number;
    mostCommonType: string;
    mostCommonTypeHouseholds: number;
    mostCommonTypePercentage: string;
    privateHouseholds: number;
    privatePercentage: string;
    publicEilaniHouseholds: number;
    publicEilaniPercentage: string;
    guthiHouseholds: number;
    guthiPercentage: string;
    villageBlockHouseholds: number;
    villageBlockPercentage: string;
    otherHouseholds: number;
    otherPercentage: string;
    securityScore: number;
    secureHouseholds: number;
    insecureHouseholds: number;
  }>;
  LAND_OWNERSHIP_TYPES: Record<string, string>;
  LAND_OWNERSHIP_COLORS: Record<string, string>;
  securityScore: number;
}

export default function LandOwnershipCharts({
  overallSummary,
  totalHouseholds,
  pieChartData,
  wardWiseData,
  wardNumbers,
  landOwnershipData,
  wardWiseAnalysis,
  LAND_OWNERSHIP_TYPES,
  LAND_OWNERSHIP_COLORS,
  securityScore,
}: LandOwnershipChartsProps) {
  return (
    <>
      {/* Overall land ownership distribution - with pre-rendered table and client-side chart */}
      <div 
        className="mb-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Land Ownership Types in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content={`Land ownership types of Khajura with a total of ${totalHouseholds} households`}
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            जग्गा स्वामित्वका प्रमुख प्रकारहरू
          </h3>
          <p className="text-sm text-muted-foreground">
            कुल परिवार संख्या: {localizeNumber(totalHouseholds.toLocaleString(), "ne")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
          {/* Client-side pie chart */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-medium mb-4 text-center">पाई चार्ट</h4>
            <div className="h-[600px]">
              <LandOwnershipPieChart
                pieChartData={pieChartData}
                LAND_OWNERSHIP_TYPES={LAND_OWNERSHIP_TYPES}
                LAND_OWNERSHIP_COLORS={LAND_OWNERSHIP_COLORS}
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
                    <th className="border p-2 text-left">जग्गाको प्रकार</th>
                    <th className="border p-2 text-right">घरपरिवार संख्या</th>
                    <th className="border p-2 text-right">प्रतिशत</th>
                  </tr>
                </thead>
                <tbody>
                  {overallSummary.map((item, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-muted/40" : ""}>
                      <td className="border p-2">{localizeNumber(i + 1, "ne")}</td>
                      <td className="border p-2">{item.typeName}</td>
                      <td className="border p-2 text-right">
                        {localizeNumber(item.households.toLocaleString(), "ne")}
                      </td>
                      <td className="border p-2 text-right">
                        {localizeNumber(((item.households / totalHouseholds) * 100).toFixed(2), "ne")}%
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
                      {localizeNumber(totalHouseholds.toLocaleString(), "ne")}
                    </td>
                    <td className="border p-2 text-right">
                      {localizeNumber("100.00", "ne")}%
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
            
            <div className="mt-8">
              <h4 className="text-lg font-medium mb-4 text-center">जग्गा सुरक्षा स्कोर</h4>
              <div className="p-4">
                <LandSecurityChart securityScore={securityScore} />
              </div>
              <p className="text-sm text-muted-foreground mt-4 text-center">
                नोट: जग्गा सुरक्षा स्कोर निजी र गुठी जग्गामा बसोबास गर्ने घरपरिवारको प्रतिशतमा आधारित छ।
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 p-4 border-t">
          <h4 className="text-sm font-medium text-muted-foreground mb-4">
            जग्गा स्वामित्व प्रकार विवरण
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {overallSummary.map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor:
                      LAND_OWNERSHIP_COLORS[
                        item.type as keyof typeof LAND_OWNERSHIP_COLORS
                      ] || "#888",
                  }}
                ></div>
                <div className="flex-grow">
                  <div className="flex justify-between items-center">
                    <span className="text-sm truncate">{item.typeName}</span>
                    <span className="font-medium">
                      {localizeNumber(((item.households / totalHouseholds) * 100).toFixed(1), "ne")}%
                    </span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(item.households / totalHouseholds) * 100}%`,
                        backgroundColor:
                          LAND_OWNERSHIP_COLORS[
                            item.type as keyof typeof LAND_OWNERSHIP_COLORS
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
      <div 
        className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        id="ward-wise-land-ownership"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Ward-wise Land Ownership in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content="Land ownership distribution across wards in Khajura"
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            वडा अनुसार जग्गा स्वामित्वको वितरण
          </h3>
          <p className="text-sm text-muted-foreground">
            वडा र जग्गा स्वामित्व प्रकार अनुसार घरपरिवार वितरण
          </p>
        </div>

        <div className="p-6">
          <div className="h-[500px]">
            <LandOwnershipBarChart
              wardWiseData={wardWiseData}
              LAND_OWNERSHIP_COLORS={LAND_OWNERSHIP_COLORS}
              LAND_OWNERSHIP_TYPES={LAND_OWNERSHIP_TYPES}
            />
          </div>
        </div>
      </div>

      {/* Ward-wise analysis - with pre-rendered HTML table for SEO */}
      <div 
        className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        id="land-ownership-trends"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Ward-wise Land Ownership Analysis in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content="Land ownership patterns by ward in Khajura"
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            वडागत जग्गा स्वामित्व विश्लेषण
          </h3>
          <p className="text-sm text-muted-foreground">
            वडा अनुसार जग्गा स्वामित्वका प्रमुख प्रकारहरू र वितरण
          </p>
        </div>

        <div className="p-6">
          <div className="overflow-auto">
            <table className="w-full border-collapse min-w-[800px]">
              <thead className="sticky top-0 z-10">
                <tr className="bg-muted">
                  <th className="border p-2">वडा नं.</th>
                  <th className="border p-2 text-right">जम्मा घरपरिवार</th>
                  <th className="border p-2">प्रमुख जग्गा स्वामित्व</th>
                  <th className="border p-2 text-right">निजी जग्गा (%)</th>
                  <th className="border p-2 text-right">सार्वजनिक/ऐलानी (%)</th>
                  <th className="border p-2 text-right">जग्गा सुरक्षा स्कोर</th>
                </tr>
              </thead>
              <tbody>
                {wardWiseAnalysis.map((item, i) => {
                  return (
                    <tr key={i} className={i % 2 === 0 ? "bg-muted/50" : ""}>
                      <td className="border p-2">वडा {localizeNumber(item.wardNumber, "ne")}</td>
                      <td className="border p-2 text-right">
                        {localizeNumber(item.totalHouseholds.toLocaleString(), "ne")}
                      </td>
                      <td className="border p-2">
                        {LAND_OWNERSHIP_TYPES[item.mostCommonType as keyof typeof LAND_OWNERSHIP_TYPES] || item.mostCommonType}
                      </td>
                      <td className="border p-2 text-right">
                        {localizeNumber(item.privatePercentage, "ne")}%
                      </td>
                      <td className="border p-2 text-right">
                        {localizeNumber(item.publicEilaniPercentage, "ne")}%
                      </td>
                      <td className="border p-2 text-right">
                        <span className={item.securityScore >= 75 ? "text-green-600" : item.securityScore >= 50 ? "text-amber-600" : "text-red-600"}>
                          {localizeNumber(item.securityScore.toString(), "ne")}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="font-semibold bg-muted/70">
                  <td className="border p-2">पालिका जम्मा</td>
                  <td className="border p-2 text-right">
                    {localizeNumber(totalHouseholds.toLocaleString(), "ne")}
                  </td>
                  <td className="border p-2">
                    {LAND_OWNERSHIP_TYPES[overallSummary[0]?.type as keyof typeof LAND_OWNERSHIP_TYPES] || overallSummary[0]?.type}
                  </td>
                  <td className="border p-2 text-right">
                    {localizeNumber(
                      ((overallSummary.find(s => s.type === "PRIVATE")?.households || 0) / totalHouseholds * 100).toFixed(2),
                      "ne"
                    )}%
                  </td>
                  <td className="border p-2 text-right">
                    {localizeNumber(
                      ((overallSummary.find(s => s.type === "PUBLIC_EILANI")?.households || 0) / totalHouseholds * 100).toFixed(2),
                      "ne"
                    )}%
                  </td>
                  <td className="border p-2 text-right">
                    <span className={securityScore >= 75 ? "text-green-600" : securityScore >= 50 ? "text-amber-600" : "text-red-600"}>
                      {localizeNumber(securityScore.toString(), "ne")}%
                    </span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Ward pie charts (client component) */}
          <h4 className="text-lg font-medium mt-8 mb-4">वडागत जग्गा स्वामित्वको वितरण</h4>
          <WardLandOwnershipPieCharts
            wardNumbers={wardNumbers}
            landOwnershipData={landOwnershipData}
            LAND_OWNERSHIP_TYPES={LAND_OWNERSHIP_TYPES}
            LAND_OWNERSHIP_COLORS={LAND_OWNERSHIP_COLORS}
          />
        </div>
      </div>
    </>
  );
}
