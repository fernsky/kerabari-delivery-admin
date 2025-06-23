import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import HouseholdOuterWallPieChart from "./charts/household-outer-wall-pie-chart";
import HouseholdOuterWallBarChart from "./charts/household-outer-wall-bar-chart";
import WardHouseholdOuterWallPieCharts from "./charts/ward-household-outer-wall-pie-charts";
import { localizeNumber } from "@/lib/utils/localize-number";
import OuterWallQualityChart from "./charts/outer-wall-quality-chart";

interface HouseholdOuterWallChartsProps {
  overallSummary: Array<{
    wallType: string;
    wallTypeName: string;
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
  wallData: Array<{
    id?: string;
    wardNumber: number;
    wallType: string;
    households: number;
  }>;
  wardWiseAnalysis: Array<{
    wardNumber: number;
    totalHouseholds: number;
    mostCommonType: string;
    mostCommonTypeHouseholds: number;
    mostCommonTypePercentage: string;
    highQualityWalls: number;
    highQualityPercentage: string;
    mediumQualityWalls: number;
    mediumQualityPercentage: string;
    lowQualityWalls: number;
    lowQualityPercentage: string;
    qualityScore: number;
  }>;
  WALL_TYPE_NAMES: Record<string, string>;
  WALL_TYPE_COLORS: Record<string, string>;
}

export default function HouseholdOuterWallCharts({
  overallSummary,
  totalHouseholds,
  pieChartData,
  wardWiseData,
  wardNumbers,
  wallData,
  wardWiseAnalysis,
  WALL_TYPE_NAMES,
  WALL_TYPE_COLORS,
}: HouseholdOuterWallChartsProps) {
  // Calculate quality values for the entire municipality
  const totalHighQuality = wardWiseAnalysis.reduce((sum, item) => sum + item.highQualityWalls, 0);
  const totalMediumQuality = wardWiseAnalysis.reduce((sum, item) => sum + item.mediumQualityWalls, 0);
  const totalLowQuality = wardWiseAnalysis.reduce((sum, item) => sum + item.lowQualityWalls, 0);

  const highQualityPercentage = totalHouseholds > 0 ? ((totalHighQuality / totalHouseholds) * 100).toFixed(1) : "0";
  const mediumQualityPercentage = totalHouseholds > 0 ? ((totalMediumQuality / totalHouseholds) * 100).toFixed(1) : "0";
  const lowQualityPercentage = totalHouseholds > 0 ? ((totalLowQuality / totalHouseholds) * 100).toFixed(1) : "0";
  
  const qualityData = [
    { name: "उच्च गुणस्तर", value: totalHighQuality, percentage: highQualityPercentage, color: "#3498db" },
    { name: "मध्यम गुणस्तर", value: totalMediumQuality, percentage: mediumQualityPercentage, color: "#f39c12" },
    { name: "न्यून गुणस्तर", value: totalLowQuality, percentage: lowQualityPercentage, color: "#e74c3c" },
  ];

  return (
    <>
      {/* Overall household outer wall distribution - with pre-rendered table and client-side chart */}
      <div 
        className="mb-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="House Outer Wall Types in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content={`House outer wall distribution of Khajura with a total of ${totalHouseholds} households`}
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            घरको बाहिरी गारोको प्रकार अनुसार वितरण
          </h3>
          <p className="text-sm text-muted-foreground">
            कुल घरधुरी संख्या: {localizeNumber(totalHouseholds.toLocaleString(), "ne")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
          {/* Client-side pie chart */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-medium mb-4 text-center">पाई चार्ट</h4>
            <div className="h-[480px]">
              <HouseholdOuterWallPieChart
                pieChartData={pieChartData}
                WALL_TYPE_NAMES={WALL_TYPE_NAMES}
                WALL_TYPE_COLORS={WALL_TYPE_COLORS}
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
                    <th className="border p-2 text-left">बाहिरी गारोको प्रकार</th>
                    <th className="border p-2 text-right">घरधुरी संख्या</th>
                    <th className="border p-2 text-right">प्रतिशत</th>
                  </tr>
                </thead>
                <tbody>
                  {overallSummary.map((item, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-muted/40" : ""}>
                      <td className="border p-2">{localizeNumber(i + 1, "ne")}</td>
                      <td className="border p-2">{item.wallTypeName}</td>
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
            घरको बाहिरी गारो विवरण
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {overallSummary.slice(0, 6).map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor:
                      WALL_TYPE_COLORS[
                        item.wallType as keyof typeof WALL_TYPE_COLORS
                      ] || "#888",
                  }}
                ></div>
                <div className="flex-grow">
                  <div className="flex justify-between items-center">
                    <span className="text-sm truncate">{item.wallTypeName.split('(')[0].trim()}</span>
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
                          WALL_TYPE_COLORS[
                            item.wallType as keyof typeof WALL_TYPE_COLORS
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

      {/* Quality analysis chart */}
      <div 
        className="mb-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Outer Wall Quality Analysis in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content="Quality analysis of house outer walls in Khajura Rural Municipality"
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            बाहिरी गारोको गुणस्तर विश्लेषण
          </h3>
          <p className="text-sm text-muted-foreground">
            घरको बाहिरी गारोको गुणस्तरको वर्गीकरण र विश्लेषण
          </p>
        </div>

        <div className="p-6">
          <div className="prose prose-slate dark:prose-invert max-w-none mb-6">
            <p>
              गारोको प्रकारका आधारमा निम्न गुणस्तर वर्गीकरण गरिएको छ:
            </p>
            <ul>
              <li>
                <strong>उच्च गुणस्तर:</strong> सिमेन्टको जोडाइ भएको इँटा/ढुङ्गा र प्रि फ्याब
              </li>
              <li>
                <strong>मध्यम गुणस्तर:</strong> माटोको जोडाइ भएको इँटा/ढुङ्गा र काठ/फल्याक
              </li>
              <li>
                <strong>न्यून गुणस्तर:</strong> काँचो इँटा, जस्ता/टिन/च्यादर, बाँसजन्य सामग्री र अन्य
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left side: Quality pie chart */}
            <div className="h-[400px]">
              <OuterWallQualityChart qualityData={qualityData} />
            </div>

            {/* Right side: Quality analysis table */}
            <div>
              <h4 className="text-lg font-medium mb-4">गारोको गुणस्तर वितरण</h4>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted">
                    <th className="border p-2 text-left">गुणस्तर श्रेणी</th>
                    <th className="border p-2 text-right">घरधुरी संख्या</th>
                    <th className="border p-2 text-right">प्रतिशत</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-muted/40">
                    <td className="border p-2 font-medium text-blue-600">उच्च गुणस्तर</td>
                    <td className="border p-2 text-right">{localizeNumber(totalHighQuality.toLocaleString(), "ne")}</td>
                    <td className="border p-2 text-right">{localizeNumber(highQualityPercentage, "ne")}%</td>
                  </tr>
                  <tr>
                    <td className="border p-2 font-medium text-orange-500">मध्यम गुणस्तर</td>
                    <td className="border p-2 text-right">{localizeNumber(totalMediumQuality.toLocaleString(), "ne")}</td>
                    <td className="border p-2 text-right">{localizeNumber(mediumQualityPercentage, "ne")}%</td>
                  </tr>
                  <tr className="bg-muted/40">
                    <td className="border p-2 font-medium text-red-500">न्यून गुणस्तर</td>
                    <td className="border p-2 text-right">{localizeNumber(totalLowQuality.toLocaleString(), "ne")}</td>
                    <td className="border p-2 text-right">{localizeNumber(lowQualityPercentage, "ne")}%</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr className="font-semibold bg-muted/70">
                    <td className="border p-2">जम्मा</td>
                    <td className="border p-2 text-right">{localizeNumber(totalHouseholds.toLocaleString(), "ne")}</td>
                    <td className="border p-2 text-right">{localizeNumber("100.0", "ne")}%</td>
                  </tr>
                </tfoot>
              </table>

              <div className="mt-6 space-y-4">
                <div>
                  <h5 className="text-medium font-semibold mb-2">उच्च गुणस्तर भएको अग्रणी वडा</h5>
                  <div className="flex items-center">
                    {wardWiseAnalysis[0] && (
                      <>
                        <div className="text-3xl font-bold text-blue-600 mr-2">
                          वडा {localizeNumber(wardWiseAnalysis[0].wardNumber.toString(), "ne")}
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">उच्च गुणस्तर</div>
                          <div className="font-medium">{localizeNumber(wardWiseAnalysis[0].highQualityPercentage, "ne")}%</div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <h5 className="text-medium font-semibold mb-2">न्यून गुणस्तर भएको सबैभन्दा धेरै वडा</h5>
                  <div className="flex items-center">
                    {wardWiseAnalysis.slice(-1)[0] && (
                      <>
                        <div className="text-3xl font-bold text-red-600 mr-2">
                          वडा {localizeNumber(wardWiseAnalysis.slice(-1)[0].wardNumber.toString(), "ne")}
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">न्यून गुणस्तर</div>
                          <div className="font-medium">{localizeNumber(wardWiseAnalysis.slice(-1)[0].lowQualityPercentage, "ne")}%</div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ward-wise distribution - pre-rendered table with client-side chart */}
      <div 
        className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        id="ward-wise-household-outer-wall"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Ward-wise House Outer Wall in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content="House outer wall distribution across wards in Khajura"
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            वडा अनुसार घरको बाहिरी गारोको वितरण
          </h3>
          <p className="text-sm text-muted-foreground">
            वडा र गारोको प्रकार अनुसार घरधुरी वितरण
          </p>
        </div>

        <div className="p-6">
          <div className="h-[500px]">
            <HouseholdOuterWallBarChart
              wardWiseData={wardWiseData}
              WALL_TYPE_COLORS={WALL_TYPE_COLORS}
              WALL_TYPE_NAMES={WALL_TYPE_NAMES}
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
          content="Ward-wise House Outer Wall Analysis in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content="Most common house outer wall types by ward in Khajura"
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            वडागत बाहिरी गारो विश्लेषण
          </h3>
          <p className="text-sm text-muted-foreground">
            वडा अनुसार घरको बाहिरी गारोको प्रमुख प्रकारहरू र वितरण
          </p>
        </div>

        <div className="p-6">
          <div className="overflow-auto">
            <table className="w-full border-collapse min-w-[800px]">
              <thead className="sticky top-0 z-10">
                <tr className="bg-muted">
                  <th className="border p-2">वडा नं.</th>
                  <th className="border p-2 text-right">जम्मा घरधुरी</th>
                  <th className="border p-2">प्रमुख गारोको प्रकार</th>
                  <th className="border p-2 text-right">उच्च गुणस्तर (%)</th>
                  <th className="border p-2 text-right">मध्यम गुणस्तर (%)</th>
                  <th className="border p-2 text-right">न्यून गुणस्तर (%)</th>
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
                        {WALL_TYPE_NAMES[item.mostCommonType as keyof typeof WALL_TYPE_NAMES]?.split('(')[0].trim() || item.mostCommonType}
                      </td>
                      <td className="border p-2 text-right">
                        {localizeNumber(item.highQualityPercentage, "ne")}%
                      </td>
                      <td className="border p-2 text-right">
                        {localizeNumber(item.mediumQualityPercentage, "ne")}%
                      </td>
                      <td className="border p-2 text-right">
                        {localizeNumber(item.lowQualityPercentage, "ne")}%
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
                    {WALL_TYPE_NAMES[overallSummary[0]?.wallType as keyof typeof WALL_TYPE_NAMES]?.split('(')[0].trim() || overallSummary[0]?.wallType}
                  </td>
                  <td className="border p-2 text-right">
                    {localizeNumber(highQualityPercentage, "ne")}%
                  </td>
                  <td className="border p-2 text-right">
                    {localizeNumber(mediumQualityPercentage, "ne")}%
                  </td>
                  <td className="border p-2 text-right">
                    {localizeNumber(lowQualityPercentage, "ne")}%
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Ward pie charts (client component) */}
          <h4 className="text-lg font-medium mt-8 mb-4">वडागत बाहिरी गारोको वितरण</h4>
          <WardHouseholdOuterWallPieCharts
            wardNumbers={wardNumbers}
            wallData={wallData}
            WALL_TYPE_NAMES={WALL_TYPE_NAMES}
            WALL_TYPE_COLORS={WALL_TYPE_COLORS}
          />
        </div>
      </div>
    </>
  );
}
