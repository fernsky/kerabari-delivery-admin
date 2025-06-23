import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import AgeGroupPieChart from "./charts/age-group-pie-chart";
import AgeGroupBarChart from "./charts/age-group-bar-chart";
import WardAgeGroupPieCharts from "./charts/ward-age-group-pie-charts";
import { localizeNumber } from "@/lib/utils/localize-number";

// Define age group colors for consistency
const AGE_GROUP_COLORS = {
  AGE_0_TO_14: "#FF9F40", // Orange for children
  AGE_15_TO_59: "#36A2EB", // Blue for working age
  AGE_60_PLUS: "#FF6384", // Pink/red for elderly
};

interface EconomicallyActivePopulationChartsProps {
  overallSummary: Array<{
    ageGroup: string;
    ageGroupName: string;
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
  populationData: Array<{
    id?: string;
    wardNumber: number;
    ageGroup: string;
    population: number;
  }>;
  dependencyRatios: Array<{
    wardNumber: number;
    dependentPopulation: number;
    workingAgePopulation: number;
    ratio: number;
  }>;
  AGE_GROUP_NAMES: Record<string, string>;
}

export default function EconomicallyActivePopulationCharts({
  overallSummary,
  totalPopulation,
  pieChartData,
  wardWiseData,
  wardNumbers,
  populationData,
  dependencyRatios,
  AGE_GROUP_NAMES,
}: EconomicallyActivePopulationChartsProps) {
  return (
    <>
      {/* Overall age distribution - with pre-rendered table and client-side chart */}
      <div 
        className="mb-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Age-wise Economically Active Population in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content={`Age-wise population distribution of Khajura with a total population of ${totalPopulation}`}
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            उमेर समूह अनुसार जनसंख्या वितरण
          </h3>
          <p className="text-sm text-muted-foreground">
            कुल जनसंख्या: {localizeNumber(totalPopulation.toLocaleString(), "ne")} व्यक्ति
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
          {/* Client-side pie chart */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-medium mb-4 text-center">पाई चार्ट</h4>
            <div className="h-[420px]">
              <AgeGroupPieChart
                pieChartData={pieChartData}
                AGE_GROUP_NAMES={AGE_GROUP_NAMES}
                AGE_GROUP_COLORS={AGE_GROUP_COLORS}
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
                    <th className="border p-2 text-left">उमेर समूह</th>
                    <th className="border p-2 text-right">जनसंख्या</th>
                    <th className="border p-2 text-right">प्रतिशत</th>
                  </tr>
                </thead>
                <tbody>
                  {overallSummary.map((item, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-muted/40" : ""}>
                      <td className="border p-2">{localizeNumber(i + 1, "ne")}</td>
                      <td className="border p-2">{item.ageGroupName}</td>
                      <td className="border p-2 text-right">
                        {localizeNumber(item.population.toLocaleString(), "ne")}
                      </td>
                      <td className="border p-2 text-right">
                        {localizeNumber(((item.population / totalPopulation) * 100).toFixed(2), "ne")}%
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
                      {localizeNumber(totalPopulation.toLocaleString(), "ne")}
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
            उमेर समूह विवरण
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {overallSummary.map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor:
                      AGE_GROUP_COLORS[
                        item.ageGroup as keyof typeof AGE_GROUP_COLORS
                      ] || "#888",
                  }}
                ></div>
                <div className="flex-grow">
                  <div className="flex justify-between items-center">
                    <span>{item.ageGroupName}</span>
                    <span className="font-medium">
                      {localizeNumber(((item.population / totalPopulation) * 100).toFixed(1), "ne")}%
                    </span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(item.population / totalPopulation) * 100}%`,
                        backgroundColor:
                          AGE_GROUP_COLORS[
                            item.ageGroup as keyof typeof AGE_GROUP_COLORS
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
        id="ward-wise-economic-activity"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Ward-wise Age Group Distribution in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content="Age group distribution across wards in Khajura"
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            वडा अनुसार उमेर समूह वितरण
          </h3>
          <p className="text-sm text-muted-foreground">
            वडा र उमेर समूह अनुसार जनसंख्या वितरण
          </p>
        </div>

        <div className="p-6">
          <div className="h-[500px]">
            <AgeGroupBarChart
              wardWiseData={wardWiseData}
              AGE_GROUP_COLORS={AGE_GROUP_COLORS}
              AGE_GROUP_NAMES={AGE_GROUP_NAMES}
            />
          </div>
        </div>
      </div>

      {/* Dependency ratio analysis - with pre-rendered HTML table for SEO */}
      <div 
        className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Dependency Ratio Analysis by Ward in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content="Dependency ratio analysis for each ward in Khajura"
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            निर्भरता अनुपात विश्लेषण (Dependency Ratio)
          </h3>
          <p className="text-sm text-muted-foreground">
            कार्य उमेरमा नरहेका समूहको कार्य उमेरको जनसंख्यासँगको अनुपात
          </p>
        </div>

        <div className="p-6">
          <p className="mb-4">
            निर्भरता अनुपात (Dependency Ratio) भनेको कार्य उमेरमा नरहेका जनसंख्या (०-१४ र ६०+ वर्षका) लाई कार्य उमेरको जनसंख्या (१५-५९ वर्षका) ले भाग गरेर १०० ले गुणा गरिएको मान हो।
          </p>
          
          <div className="overflow-auto">
            <table className="w-full border-collapse min-w-[800px]">
              <thead className="sticky top-0 z-10">
                <tr className="bg-muted">
                  <th className="border p-2">वडा नं.</th>
                  <th className="border p-2 text-right">कार्य उमेर जनसंख्या<br/>(१५-५९ वर्ष)</th>
                  <th className="border p-2 text-right">आश्रित जनसंख्या<br/>(०-१४ र ६०+ वर्ष)</th>
                  <th className="border p-2 text-right">निर्भरता अनुपात</th>
                  <th className="border p-2">स्थिति</th>
                </tr>
              </thead>
              <tbody>
                {dependencyRatios.map((item, i) => {
                  // Categorize dependency ratio
                  let status = "";
                  let statusColor = "";
                  
                  if (item.ratio < 50) {
                    status = "कम निर्भरता";
                    statusColor = "text-green-600";
                  } else if (item.ratio < 80) {
                    status = "मध्यम निर्भरता";
                    statusColor = "text-yellow-600";
                  } else {
                    status = "उच्च निर्भरता";
                    statusColor = "text-red-600";
                  }
                  
                  return (
                    <tr key={i} className={i % 2 === 0 ? "bg-muted/50" : ""}>
                      <td className="border p-2">वडा {localizeNumber(item.wardNumber, "ne")}</td>
                      <td className="border p-2 text-right">
                        {localizeNumber(item.workingAgePopulation.toLocaleString(), "ne")}
                      </td>
                      <td className="border p-2 text-right">
                        {localizeNumber(item.dependentPopulation.toLocaleString(), "ne")}
                      </td>
                      <td className="border p-2 text-right">
                        {localizeNumber(item.ratio.toFixed(2), "ne")}%
                      </td>
                      <td className={`border p-2 ${statusColor}`}>
                        {status}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="font-semibold bg-muted/70">
                  <td className="border p-2">पालिका औसत</td>
                  <td className="border p-2 text-right">
                    {localizeNumber((overallSummary.find(item => item.ageGroup === "AGE_15_TO_59")?.population || 0).toLocaleString(), "ne")}
                  </td>
                  <td className="border p-2 text-right">
                    {localizeNumber(((overallSummary.find(item => item.ageGroup === "AGE_0_TO_14")?.population || 0) + 
                      (overallSummary.find(item => item.ageGroup === "AGE_60_PLUS")?.population || 0)).toLocaleString(), "ne")}
                  </td>
                  <td className="border p-2 text-right">
                    {localizeNumber((((overallSummary.find(item => item.ageGroup === "AGE_0_TO_14")?.population || 0) + 
                      (overallSummary.find(item => item.ageGroup === "AGE_60_PLUS")?.population || 0)) / 
                      (overallSummary.find(item => item.ageGroup === "AGE_15_TO_59")?.population || 1) * 100).toFixed(2), "ne")}%
                  </td>
                  <td className="border p-2">
                    {((overallSummary.find(item => item.ageGroup === "AGE_0_TO_14")?.population || 0) + 
                      (overallSummary.find(item => item.ageGroup === "AGE_60_PLUS")?.population || 0)) / 
                      (overallSummary.find(item => item.ageGroup === "AGE_15_TO_59")?.population || 1) * 100 < 50 ? (
                        <span className="text-green-600">कम निर्भरता</span>
                      ) : ((overallSummary.find(item => item.ageGroup === "AGE_0_TO_14")?.population || 0) + 
                          (overallSummary.find(item => item.ageGroup === "AGE_60_PLUS")?.population || 0)) / 
                          (overallSummary.find(item => item.ageGroup === "AGE_15_TO_59")?.population || 1) * 100 < 80 ? (
                        <span className="text-yellow-600">मध्यम निर्भरता</span>
                      ) : (
                        <span className="text-red-600">उच्च निर्भरता</span>
                      )}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Ward pie charts (client component) */}
          <h4 className="text-lg font-medium mt-8 mb-4">वडागत उमेर समूह वितरण</h4>
          <WardAgeGroupPieCharts
            wardNumbers={wardNumbers}
            populationData={populationData}
            AGE_GROUP_NAMES={AGE_GROUP_NAMES}
            AGE_GROUP_COLORS={AGE_GROUP_COLORS}
          />
        </div>
      </div>
    </>
  );
}
