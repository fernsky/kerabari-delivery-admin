import { localizeNumber } from "@/lib/utils/localize-number";
import ToiletTypePieChart from "./charts/toilet-type-pie-chart";
import ToiletTypeBarChart from "./charts/toilet-type-bar-chart";
import WardToiletTypePieCharts from "./charts/ward-toilet-type-pie-charts";
import SanitationComparisonChart from "./charts/sanitation-comparison-chart";

interface ToiletTypeChartsProps {
  overallSummary: Array<{
    toiletType: string;
    toiletTypeName: string;
    households: number;
  }>;
  totalHouseholds: number;
  pieChartData: Array<{
    name: string;
    value: number;
    percentage: string;
    color: string;
  }>;
  wardWiseData: Array<Record<string, any>>;
  wardNumbers: number[];
  toiletTypeData: Array<{
    id?: string;
    wardNumber: number;
    toiletType: string;
    households: number;
  }>;
  wardWiseAnalysis: Array<{
    wardNumber: number;
    totalHouseholds: number;
    mostCommonType: string;
    mostCommonTypeName: string;
    mostCommonTypeHouseholds: number;
    mostCommonTypePercentage: string;
    sanitationHouseholds: number;
    sanitationPercentage: string;
    modernToiletsPercentage: string;
    noToiletsPercentage: string;
    typePercentages: Record<string, string>;
  }>;
  typeMap: Record<string, string>;
  TOILET_TYPE_COLORS: Record<string, string>;
  highestSanitationWard?: {
    wardNumber: number;
    sanitationPercentage: string;
  };
  lowestSanitationWard?: {
    wardNumber: number;
    sanitationPercentage: string;
  };
  sanitationIndex: number;
}

export default function ToiletTypeCharts({
  overallSummary,
  totalHouseholds,
  pieChartData,
  wardWiseData,
  wardNumbers,
  toiletTypeData,
  wardWiseAnalysis,
  typeMap,
  TOILET_TYPE_COLORS,
  highestSanitationWard,
  lowestSanitationWard,
  sanitationIndex,
}: ToiletTypeChartsProps) {
  return (
    <>
      {/* Overall toilet type distribution - with pre-rendered table and client-side chart */}
      <div 
        className="mb-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Toilet Types in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content={`Toilet type distribution of Khajura with a total of ${totalHouseholds} households`}
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            शौचालय प्रकार अनुसार वितरण
          </h3>
          <p className="text-sm text-muted-foreground">
            कुल घरधुरी संख्या: {localizeNumber(totalHouseholds.toLocaleString(), "ne")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
          {/* Client-side pie chart */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-medium mb-4 text-center">पाई चार्ट</h4>
            <div className="h-[420px]">
              <ToiletTypePieChart
                pieChartData={pieChartData}
                typeMap={typeMap}
                TOILET_TYPE_COLORS={TOILET_TYPE_COLORS}
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
                    <th className="border p-2 text-left">शौचालय प्रकार</th>
                    <th className="border p-2 text-right">घरधुरी संख्या</th>
                    <th className="border p-2 text-right">प्रतिशत</th>
                  </tr>
                </thead>
                <tbody>
                  {overallSummary.map((item, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-muted/40" : ""}>
                      <td className="border p-2">{localizeNumber(i + 1, "ne")}</td>
                      <td className="border p-2">{item.toiletTypeName}</td>
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
            शौचालय प्रकारहरूको विवरण
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {overallSummary.map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor:
                      TOILET_TYPE_COLORS[
                        item.toiletType as keyof typeof TOILET_TYPE_COLORS
                      ] || "#888",
                  }}
                ></div>
                <div className="flex-grow">
                  <div className="flex justify-between items-center">
                    <span>{item.toiletTypeName}</span>
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
                          TOILET_TYPE_COLORS[
                            item.toiletType as keyof typeof TOILET_TYPE_COLORS
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
        id="ward-wise-toilet-types"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Ward-wise Toilet Types in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content="Toilet types distribution across wards in Khajura"
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            वडा अनुसार शौचालय प्रकारहरूको वितरण
          </h3>
          <p className="text-sm text-muted-foreground">
            वडा र शौचालय प्रकार अनुसार घरधुरी वितरण
          </p>
        </div>

        <div className="p-6">
          <div className="h-[500px]">
            <ToiletTypeBarChart
              wardWiseData={wardWiseData}
              TOILET_TYPE_COLORS={TOILET_TYPE_COLORS}
              typeMap={typeMap}
            />
          </div>
        </div>
      </div>

      {/* Sanitation comparison across wards */}
      <div 
        className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Sanitation Rate Comparison Across Wards in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content="Comparison of sanitation rates across wards in Khajura"
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            वडागत शौचालय उपलब्धता दर
          </h3>
          <p className="text-sm text-muted-foreground">
            विभिन्न वडाहरूमा शौचालयको उपलब्धता दर (शौचालय नभएका घरधुरी बाहेक)
          </p>
        </div>

        <div className="p-6">
          <div className="h-[400px]">
            <SanitationComparisonChart
              wardWiseAnalysis={wardWiseAnalysis}
              highestSanitationWard={highestSanitationWard}
              lowestSanitationWard={lowestSanitationWard}
              TOILET_TYPE_COLORS={TOILET_TYPE_COLORS}
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
          content="Ward-wise Toilet Type Analysis in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content="Most common toilet types by ward in Khajura"
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            वडागत शौचालय प्रकार विश्लेषण
          </h3>
          <p className="text-sm text-muted-foreground">
            वडा अनुसार शौचालय प्रकारहरूको वितरण र विश्लेषण
          </p>
        </div>

        <div className="p-6">
          <div className="overflow-auto">
            <table className="w-full border-collapse min-w-[800px]">
              <thead className="sticky top-0 z-10">
                <tr className="bg-muted">
                  <th className="border p-2">वडा नं.</th>
                  <th className="border p-2 text-right">जम्मा घरधुरी</th>
                  <th className="border p-2">प्रमुख शौचालय प्रकार</th>
                  <th className="border p-2 text-right">प्रमुख प्रकारको घरधुरी</th>
                  <th className="border p-2 text-right">प्रतिशत</th>
                  <th className="border p-2 text-right">आधुनिक शौचालय</th>
                  <th className="border p-2 text-right">शौचालय नभएका</th>
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
                        {item.mostCommonTypeName}
                      </td>
                      <td className="border p-2 text-right">
                        {localizeNumber(item.mostCommonTypeHouseholds.toLocaleString(), "ne")}
                      </td>
                      <td className="border p-2 text-right">
                        {localizeNumber(item.mostCommonTypePercentage, "ne")}%
                      </td>
                      <td className="border p-2 text-right">
                        {localizeNumber(item.modernToiletsPercentage, "ne")}%
                      </td>
                      <td className="border p-2 text-right">
                        {localizeNumber(item.noToiletsPercentage, "ne")}%
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
                    {overallSummary.length > 0 ? overallSummary[0].toiletTypeName : ""}
                  </td>
                  <td className="border p-2 text-right">
                    {localizeNumber((overallSummary[0]?.households || 0).toLocaleString(), "ne")}
                  </td>
                  <td className="border p-2 text-right">
                    {localizeNumber(((overallSummary[0]?.households || 0) / totalHouseholds * 100).toFixed(2), "ne")}%
                  </td>
                  <td className="border p-2 text-right">
                    {localizeNumber(
                      (
                        (overallSummary
                          .filter(item => item.toiletType === 'FLUSH_WITH_SEPTIC_TANK')
                          .reduce((sum, item) => sum + item.households, 0) / totalHouseholds) * 100
                      ).toFixed(2),
                      "ne"
                    )}%
                  </td>
                  <td className="border p-2 text-right">
                    {localizeNumber(
                      (
                        (overallSummary
                          .filter(item => item.toiletType === 'NO_TOILET')
                          .reduce((sum, item) => sum + item.households, 0) / totalHouseholds) * 100
                      ).toFixed(2),
                      "ne"
                    )}%
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Ward pie charts (client component) */}
          <h4 className="text-lg font-medium mt-8 mb-4">वडागत शौचालय प्रकारको वितरण</h4>
          <WardToiletTypePieCharts
            wardNumbers={wardNumbers}
            toiletTypeData={toiletTypeData}
            typeMap={typeMap}
            TOILET_TYPE_COLORS={TOILET_TYPE_COLORS}
          />
        </div>
      </div>
    </>
  );
}
