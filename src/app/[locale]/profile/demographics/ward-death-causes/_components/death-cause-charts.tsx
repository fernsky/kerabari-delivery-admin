import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import DeathCausePieChart from "./charts/death-cause-pie-chart";
import DeathCauseBarChart from "./charts/death-cause-bar-chart";
import WardDeathCausePieCharts from "./charts/ward-death-cause-pie-charts";
import { localizeNumber } from "@/lib/utils/localize-number";

// Define death cause colors for consistency
const DEATH_CAUSE_COLORS = {
  HAIJA: "#FF5733", // Red-orange
  PNEUMONIA: "#FFC300", // Yellow
  FLU: "#36A2EB", // Blue
  TUBERCULOSIS: "#4BC0C0", // Cyan
  LEPROSY: "#9966FF", // Purple
  JAUNDICE_HEPATITIS: "#3CB371", // Green
  TYPHOID: "#FF6384", // Pink
  VIRAL_INFLUENZA: "#FFCE56", // Light orange
  ENCEPHALITIS: "#607D8B", // Grey
  MENINGITIS: "#E91E63", // Magenta
  HEPATITIS: "#8BC34A", // Light green
  MALARIA: "#FF9F40", // Orange
  KALA_AZAR: "#CBDB57", // Lime
  HIV_AIDS: "#9C27B0", // Deep Purple
  OTHER_SEXUALLY_TRANSMITTED_DISEASES: "#795548", // Brown
  MEASLES: "#00BCD4", // Cyan
  SCABIES: "#FFA726", // Orange
  RABIES: "#F44336", // Red
  COVID19_CORONAVIRUS: "#FF4081", // Pink
  OTHER_INFECTIOUS_DISEASES: "#7E57C2", // Deep Purple
  HEART_RELATED_DISEASES: "#D32F2F", // Red
  RESPIRATORY_DISEASES: "#1976D2", // Blue
  ASTHMA: "#388E3C", // Green
  EPILEPSY: "#FBC02D", // Yellow
  CANCER: "#C2185B", // Pink
  DIABETES: "#0097A7", // Cyan
  KIDNEY_RELATED_DISEASES: "#7B1FA2", // Purple
  LIVER_RELATED_DISEASES: "#FFA000", // Amber
  BRAIN_RELATED: "#0D47A1", // Blue
  BLOOD_PRESSURE: "#D84315", // Deep Orange
  GASTRIC_ULCER_INTESTINAL_DISEASE: "#00796B", // Teal
  REPRODUCTIVE_OR_OBSTETRIC_CAUSES: "#AFB42B", // Lime
  TRAFFIC_ACCIDENT: "#E64A19", // Deep Orange
  OTHER_ACCIDENTS: "#5D4037", // Brown
  SUICIDE: "#455A64", // Blue Grey
  NATURAL_DISASTER: "#6A1B9A", // Purple
  DEATH_BY_OLD_AGE: "#616161", // Grey
  OTHER: "#9E9E9E", // Grey
};

interface DeathCauseChartsProps {
  overallSummary: Array<{
    deathCause: string;
    deathCauseName: string;
    population: number;
  }>;
  totalDeaths: number;
  pieChartData: Array<{
    name: string;
    value: number;
    percentage: string;
  }>;
  wardWiseData: Array<Record<string, any>>;
  wardNumbers: number[];
  deathCauseData: Array<{
    id?: string;
    wardNumber: number;
    deathCause: string;
    population: number;
  }>;
  deathCauseLabels: Record<string, string>;
}

export default function DeathCauseCharts({
  overallSummary,
  totalDeaths,
  pieChartData,
  wardWiseData,
  wardNumbers,
  deathCauseData,
  deathCauseLabels,
}: DeathCauseChartsProps) {
  return (
    <>
      {/* Overall death cause distribution - with pre-rendered table and client-side chart */}
      <div 
        className="mb-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Death Cause Distribution in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content={`Distribution of death causes in Khajura with a total of ${totalDeaths} deaths`}
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            मृत्युका कारणहरू अनुसार वितरण
          </h3>
          <p className="text-sm text-muted-foreground">
            कुल मृत्यु संख्या: {localizeNumber(totalDeaths.toLocaleString(), "ne")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
          {/* Client-side pie chart */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-medium mb-4 text-center">पाई चार्ट</h4>
            <div className="h-[480px]">
              <DeathCausePieChart
                pieChartData={pieChartData}
                deathCauseLabels={deathCauseLabels}
                DEATH_CAUSE_COLORS={DEATH_CAUSE_COLORS}
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
                    <th className="border p-2 text-left">मृत्युको कारण</th>
                    <th className="border p-2 text-right">संख्या</th>
                    <th className="border p-2 text-right">प्रतिशत</th>
                  </tr>
                </thead>
                <tbody>
                  {overallSummary.map((item, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-muted/40" : ""}>
                      <td className="border p-2">{localizeNumber(i + 1, "ne")}</td>
                      <td className="border p-2">{item.deathCauseName}</td>
                      <td className="border p-2 text-right">
                        {localizeNumber(item.population.toLocaleString(), "ne")}
                      </td>
                      <td className="border p-2 text-right">
                        {localizeNumber(((item.population / totalDeaths) * 100).toFixed(2), "ne")}%
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
                      {localizeNumber(totalDeaths.toLocaleString(), "ne")}
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
            प्रमुख मृत्युका कारणहरू
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {overallSummary.slice(0, 5).map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor:
                      DEATH_CAUSE_COLORS[
                        item.deathCause as keyof typeof DEATH_CAUSE_COLORS
                      ] || "#888",
                  }}
                ></div>
                <div className="flex-grow">
                  <div className="flex justify-between items-center">
                    <span>{item.deathCauseName}</span>
                    <span className="font-medium">
                      {localizeNumber(((item.population / totalDeaths) * 100).toFixed(1), "ne")}%
                    </span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(item.population / totalDeaths) * 100}%`,
                        backgroundColor:
                          DEATH_CAUSE_COLORS[
                            item.deathCause as keyof typeof DEATH_CAUSE_COLORS
                          ] || "#888",
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground pt-4">
            {overallSummary.length > 5
              ? `${localizeNumber(overallSummary.length - 5, "ne")} अन्य मृत्युका कारणहरू पनि छन्।`
              : ""}
          </p>
        </div>
      </div>

      {/* Ward-wise distribution - pre-rendered table with client-side chart */}
      <div 
        className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Ward-wise Death Cause Distribution in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content="Death cause distribution across wards in Khajura"
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            वडा अनुसार मृत्युका कारणहरूको वितरण
          </h3>
          <p className="text-sm text-muted-foreground">
            वडा र मृत्युको कारण अनुसार वितरण
          </p>
        </div>

        <div className="p-6">
          <div className="h-[800px]">
            <DeathCauseBarChart
              wardWiseData={wardWiseData}
              DEATH_CAUSE_COLORS={DEATH_CAUSE_COLORS}
              deathCauseLabels={deathCauseLabels}
            />
          </div>
        </div>
      </div>

      {/* Detailed ward analysis - with pre-rendered HTML table for SEO */}
      <div 
        className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Detailed Death Cause Analysis by Ward in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content="Detailed death cause composition of each ward in Khajura"
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            वडा अनुसार विस्तृत मृत्युका कारणहरूको विश्लेषण
          </h3>
          <p className="text-sm text-muted-foreground">
            प्रत्येक वडाको विस्तृत मृत्युका कारणहरूको संरचना
          </p>
        </div>

        <div className="p-6">
          <h4 className="text-lg font-medium mb-4">वडागत मृत्युका कारण तालिका</h4>
          <div className="overflow-auto max-h-[600px]">
            <table className="w-full border-collapse min-w-[800px]">
              <thead className="sticky top-0 z-10">
                <tr className="bg-muted">
                  <th className="border p-2">वडा नं.</th>
                  <th className="border p-2">प्रमुख मृत्युको कारण</th>
                  <th className="border p-2 text-right">संख्या</th>
                  <th className="border p-2 text-right">वडाको प्रतिशत</th>
                  <th className="border p-2">दोस्रो प्रमुख मृत्युको कारण</th>
                  <th className="border p-2 text-right">संख्या</th>
                  <th className="border p-2 text-right">वडाको प्रतिशत</th>
                </tr>
              </thead>
              <tbody>
                {wardNumbers.map((wardNumber, i) => {
                  const wardItems = deathCauseData.filter(
                    (item) => item.wardNumber === wardNumber,
                  );
                  const wardTotal = wardItems.reduce(
                    (sum, item) => sum + (item.population || 0),
                    0,
                  );

                  // Sort by population to find primary and secondary death causes
                  const sortedItems = [...wardItems].sort(
                    (a, b) => (b.population || 0) - (a.population || 0),
                  );
                  const primaryDeathCause = sortedItems[0];
                  const secondaryDeathCause = sortedItems[1];

                  return (
                    <tr key={i} className={i % 2 === 0 ? "bg-muted/50" : ""}>
                      <td className="border p-2">वडा {localizeNumber(wardNumber, "ne")}</td>
                      <td className="border p-2">
                        {primaryDeathCause
                          ? deathCauseLabels[primaryDeathCause.deathCause] ||
                            primaryDeathCause.deathCause
                          : "-"}
                      </td>
                      <td className="border p-2 text-right">
                        {primaryDeathCause?.population
                          ? localizeNumber(primaryDeathCause.population.toLocaleString(), "ne")
                          : "०"}
                      </td>
                      <td className="border p-2 text-right">
                        {wardTotal > 0 && primaryDeathCause?.population
                          ? localizeNumber(
                              ((primaryDeathCause.population / wardTotal) * 100).toFixed(2),
                              "ne"
                            ) + "%"
                          : "०%"}
                      </td>
                      <td className="border p-2">
                        {secondaryDeathCause
                          ? deathCauseLabels[secondaryDeathCause.deathCause] ||
                            secondaryDeathCause.deathCause
                          : "-"}
                      </td>
                      <td className="border p-2 text-right">
                        {secondaryDeathCause?.population
                          ? localizeNumber(secondaryDeathCause.population.toLocaleString(), "ne")
                          : "०"}
                      </td>
                      <td className="border p-2 text-right">
                        {wardTotal > 0 && secondaryDeathCause?.population
                          ? localizeNumber(
                              ((secondaryDeathCause.population / wardTotal) * 100).toFixed(2),
                              "ne"
                            ) + "%"
                          : "०%"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Ward pie charts (client component) */}
          <h4 className="text-lg font-medium mt-8 mb-4">वडागत पाई चार्ट</h4>
          <WardDeathCausePieCharts
            wardNumbers={wardNumbers}
            deathCauseData={deathCauseData}
            deathCauseLabels={deathCauseLabels}
            DEATH_CAUSE_COLORS={DEATH_CAUSE_COLORS}
          />
        </div>
      </div>
    </>
  );
}
