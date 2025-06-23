import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import MigratedHouseholdPieChart from "./charts/migrated-household-pie-chart";
import MigratedHouseholdBarChart from "./charts/migrated-household-bar-chart";
import WardMigratedHouseholdPieCharts from "./charts/ward-migrated-household-pie-charts";
import { localizeNumber } from "@/lib/utils/localize-number";

// Define migration origin colors for consistency
const MIGRATED_FROM_COLORS = {
  SAME_DISTRICT_ANOTHER_MUNICIPALITY: "#34A0A4", // Light blue for same district
  ANOTHER_DISTRICT: "#76C893", // Green for another district
  ABROAD: "#D9ED92", // Yellow for abroad
};

interface MigratedHouseholdChartsProps {
  overallSummary: Array<{
    migratedFrom: string;
    migratedFromName: string;
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
  migratedData: Array<{
    id?: string;
    wardNumber: number;
    migratedFrom: string;
    households: number;
  }>;
  wardWiseAnalysis: Array<{
    wardNumber: number;
    totalHouseholds: number;
    mostCommonMigratedFrom: string;
    mostCommonMigratedFromHouseholds: number;
    mostCommonMigratedFromPercentage: string;
  }>;
  MIGRATED_FROM_NAMES: Record<string, string>;
}

export default function MigratedHouseholdCharts({
  overallSummary,
  totalHouseholds,
  pieChartData,
  wardWiseData,
  wardNumbers,
  migratedData,
  wardWiseAnalysis,
  MIGRATED_FROM_NAMES,
}: MigratedHouseholdChartsProps) {
  return (
    <>
      {/* Overall migration distribution - with pre-rendered table and client-side chart */}
      <div 
        className="mb-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Migrated Households in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content={`Migrated household distribution of Khajura with a total of ${totalHouseholds} households`}
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            आप्रवासित घरपरिवारको वितरण
          </h3>
          <p className="text-sm text-muted-foreground">
            कुल आप्रवासित घरपरिवार संख्या: {localizeNumber(totalHouseholds.toLocaleString(), "ne")} घरपरिवार
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
          {/* Client-side pie chart */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-medium mb-4 text-center">पाई चार्ट</h4>
            <div className="h-[420px]">
              <MigratedHouseholdPieChart
                pieChartData={pieChartData}
                MIGRATED_FROM_NAMES={MIGRATED_FROM_NAMES}
                MIGRATED_FROM_COLORS={MIGRATED_FROM_COLORS}
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
                    <th className="border p-2 text-left">स्थान</th>
                    <th className="border p-2 text-right">घरपरिवार संख्या</th>
                    <th className="border p-2 text-right">प्रतिशत</th>
                  </tr>
                </thead>
                <tbody>
                  {overallSummary.map((item, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-muted/40" : ""}>
                      <td className="border p-2">{localizeNumber(i + 1, "ne")}</td>
                      <td className="border p-2">{item.migratedFromName}</td>
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
            
          </div>
        </div>

        <div className="lg:col-span-1 p-4 border-t">
          <h4 className="text-sm font-medium text-muted-foreground mb-4">
            आप्रवासित घरपरिवारको विवरण
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {overallSummary.map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor:
                      MIGRATED_FROM_COLORS[
                        item.migratedFrom as keyof typeof MIGRATED_FROM_COLORS
                      ] || "#888",
                  }}
                ></div>
                <div className="flex-grow">
                  <div className="flex justify-between items-center">
                    <span>{item.migratedFromName}</span>
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
                          MIGRATED_FROM_COLORS[
                            item.migratedFrom as keyof typeof MIGRATED_FROM_COLORS
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
        id="ward-wise-migration"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Ward-wise Migrated Households in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content="Migrated household distribution across wards in Khajura"
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            वडा अनुसार आप्रवासित घरपरिवारको वितरण
          </h3>
          <p className="text-sm text-muted-foreground">
            वडा र आप्रवासन स्थान अनुसार घरपरिवार संख्या वितरण
          </p>
        </div>

        <div className="p-6">
          <div className="h-[500px]">
            <MigratedHouseholdBarChart
              wardWiseData={wardWiseData}
              MIGRATED_FROM_COLORS={MIGRATED_FROM_COLORS}
              MIGRATED_FROM_NAMES={MIGRATED_FROM_NAMES}
            />
          </div>
        </div>
      </div>

      {/* Ward-wise analysis - with pre-rendered HTML table for SEO */}
      <div 
        className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Ward-wise Migration Analysis in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content="Most common household migration origins by ward in Khajura"
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            वडागत आप्रवासित घरपरिवारको प्रमुख स्थान
          </h3>
          <p className="text-sm text-muted-foreground">
            वडा अनुसार आप्रवासित घरपरिवारको प्रमुख स्थान र वितरण
          </p>
        </div>

        <div className="p-6">
          <div className="overflow-auto">
            <table className="w-full border-collapse min-w-[800px]">
              <thead className="sticky top-0 z-10">
                <tr className="bg-muted">
                  <th className="border p-2">वडा नं.</th>
                  <th className="border p-2 text-right">कुल आप्रवासित घरपरिवार संख्या</th>
                  <th className="border p-2">प्रमुख आप्रवासन स्थान</th>
                  <th className="border p-2 text-right">प्रमुख स्थानका घरपरिवार</th>
                  <th className="border p-2 text-right">प्रतिशत</th>
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
                        {MIGRATED_FROM_NAMES[item.mostCommonMigratedFrom as keyof typeof MIGRATED_FROM_NAMES] || item.mostCommonMigratedFrom}
                      </td>
                      <td className="border p-2 text-right">
                        {localizeNumber(item.mostCommonMigratedFromHouseholds.toLocaleString(), "ne")}
                      </td>
                      <td className="border p-2 text-right">
                        {localizeNumber(item.mostCommonMigratedFromPercentage, "ne")}%
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
                    {MIGRATED_FROM_NAMES[overallSummary[0]?.migratedFrom as keyof typeof MIGRATED_FROM_NAMES] || overallSummary[0]?.migratedFrom}
                  </td>
                  <td className="border p-2 text-right">
                    {localizeNumber((overallSummary[0]?.households || 0).toLocaleString(), "ne")}
                  </td>
                  <td className="border p-2 text-right">
                    {localizeNumber(((overallSummary[0]?.households || 0) / totalHouseholds * 100).toFixed(2), "ne")}%
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Ward pie charts (client component) */}
          <h4 className="text-lg font-medium mt-8 mb-4">वडागत आप्रवासन वितरण</h4>
          <WardMigratedHouseholdPieCharts
            wardNumbers={wardNumbers}
            migratedData={migratedData}
            MIGRATED_FROM_NAMES={MIGRATED_FROM_NAMES}
            MIGRATED_FROM_COLORS={MIGRATED_FROM_COLORS}
          />
        </div>
      </div>
    </>
  );
}
