"use client";

import MaritalStatusPieChart from "./charts/marital-status-pie-chart";
import MaritalStatusBarChart from "./charts/marital-status-bar-chart";
import AgeWiseMaritalStatusChart from "./charts/age-wise-marital-status-chart";
import WardMaritalStatusCharts from "./charts/ward-marital-status-charts";
import GenderMaritalStatusChart from "./charts/gender-marital-status-chart";
import { localizeNumber } from "@/lib/utils/localize-number";

// Define marital status colors with enhanced aesthetic
const MARITAL_STATUS_COLORS = {
  SINGLE: "#4F46E5", // Indigo-600
  MARRIED: "#10B981", // Emerald-500
  DIVORCED: "#F59E0B", // Amber-500
  WIDOWED: "#EC4899", // Pink-500
  SEPARATED: "#6B7280", // Gray-500
  NOT_STATED: "#94A3B8", // Slate-400
};

interface MaritalStatusChartsProps {
  overallByMaritalStatus: Array<{
    status: string;
    statusName: string;
    population: number;
  }>;
  ageWiseMaritalData: Array<Record<string, any>>;
  genderWiseData: Array<{
    status: string;
    statusName: string;
    male: number;
    female: number;
    other: number;
    total: number;
  }>;
  wardWiseData: Array<Record<string, any>>;
  totalPopulation: number;
  MARITAL_STATUS_NAMES: Record<string, string>;
  AGE_GROUP_NAMES: Record<string, string>;
  pieChartData: Array<{
    name: string;
    value: number;
    percentage: string;
  }>;
  wardNumbers: number[];
  maritalData: Array<{
    id?: string;
    wardNumber: number;
    ageGroup: string;
    maritalStatus: string;
    population: number;
    malePopulation?: number;
    femalePopulation?: number;
    otherPopulation?: number;
    updatedAt?: string;
    createdAt?: string;
  }>;

}

export default function MaritalStatusCharts({
  overallByMaritalStatus,
  ageWiseMaritalData,
  genderWiseData,
  wardWiseData,
  totalPopulation,
  MARITAL_STATUS_NAMES,
  AGE_GROUP_NAMES,
  pieChartData,
  wardNumbers,
  maritalData,

}: MaritalStatusChartsProps) {
  return (
    <>
      {/* Overall marital status distribution */}
      <div className="mb-12 border rounded-lg shadow-sm overflow-hidden bg-card">
        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold">वैवाहिक स्थिति अनुसार जनसंख्या वितरण</h3>
          <p className="text-sm text-muted-foreground">
            कुल जनसंख्या: {localizeNumber(totalPopulation.toLocaleString(), "ne")} व्यक्ति
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
          {/* Client-side pie chart */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-medium mb-4 text-center">पाई चार्ट</h4>
            <div className="h-[400px]">
              <MaritalStatusPieChart
                pieChartData={pieChartData}
                MARITAL_STATUS_NAMES={MARITAL_STATUS_NAMES}
                MARITAL_STATUS_COLORS={MARITAL_STATUS_COLORS}
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
                    <th className="border p-2 text-left">वैवाहिक स्थिति</th>
                    <th className="border p-2 text-right">जनसंख्या</th>
                    <th className="border p-2 text-right">प्रतिशत</th>
                  </tr>
                </thead>
                <tbody>
                  {overallByMaritalStatus.map((item, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-muted/40" : ""}>
                      <td className="border p-2">{localizeNumber((i + 1).toString(), "ne")}</td>
                      <td className="border p-2">{item.statusName}</td>
                      <td className="border p-2 text-right">
                        {localizeNumber(item.population.toLocaleString(), "ne")}
                      </td>
                      <td className="border p-2 text-right">
                        {localizeNumber(((item.population / totalPopulation) * 100).toFixed(2), "ne")}
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
                      {localizeNumber(totalPopulation.toLocaleString(), "ne")}
                    </td>
                    <td className="border p-2 text-right">{localizeNumber("100.00", "ne")}%</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 p-4 border-t">
          <h4 className="text-sm font-medium text-muted-foreground mb-4">
            प्रमुख वैवाहिक स्थितिहरू
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {overallByMaritalStatus.slice(0, 5).map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor:
                      MARITAL_STATUS_COLORS[
                        item.status as keyof typeof MARITAL_STATUS_COLORS
                      ] || "#888",
                  }}
                ></div>
                <div className="flex-grow">
                  <div className="flex justify-between items-center">
                    <span>{item.statusName}</span>
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
                          MARITAL_STATUS_COLORS[
                            item.status as keyof typeof MARITAL_STATUS_COLORS
                          ] || "#888",
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground pt-4">
            {overallByMaritalStatus.length > 5
              ? `${localizeNumber((overallByMaritalStatus.length - 5).toString(), "ne")} अन्य वैवाहिक स्थितिहरू पनि छन्।`
              : ""}
          </p>
        </div>
      </div>

      {/* Age-wise marital status section */}
      <div
        className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        id="age-wise-marital-status"
      >
        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold">उमेर अनुसार वैवाहिक स्थिति</h3>
          <p className="text-sm text-muted-foreground">
            उमेर समूह अनुसार विभिन्न वैवाहिक स्थिति
          </p>
        </div>

        <div className="p-6">
         
            <AgeWiseMaritalStatusChart 
              ageWiseMaritalData={ageWiseMaritalData}
              MARITAL_STATUS_COLORS={MARITAL_STATUS_COLORS}
              MARITAL_STATUS_NAMES={MARITAL_STATUS_NAMES}
             
            />
        </div>
      </div>

      {/* Gender-wise marital status */}
      <div
        className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        id="gender-wise-marital-status"
      >
        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold">लिङ्ग अनुसार वैवाहिक स्थिति</h3>
          <p className="text-sm text-muted-foreground">
            पुरुष, महिला र अन्य वर्गको वैवाहिक स्थिति तुलना
          </p>
        </div>

        <div className="p-6">
        
            <GenderMaritalStatusChart 
              genderWiseData={genderWiseData}
             
            />
     

          <div className="mt-6 overflow-x-auto">
            <h4 className="text-lg font-medium mb-4">
              लिङ्ग अनुसार वैवाहिक स्थिति तालिका
            </h4>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted">
                  <th className="border p-2 text-left">वैवाहिक स्थिति</th>
                  <th className="border p-2 text-right">पुरुष</th>
                  <th className="border p-2 text-right">महिला</th>
                  <th className="border p-2 text-right">अन्य</th>
                  <th className="border p-2 text-right">जम्मा</th>
                </tr>
              </thead>
              <tbody>
                {genderWiseData
                  .sort((a, b) => b.total - a.total)
                  .map((item, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-muted/40" : ""}>
                      <td className="border p-2">{item.statusName}</td>
                      <td className="border p-2 text-right">
                        {localizeNumber(item.male.toLocaleString(), "ne")}
                      </td>
                      <td className="border p-2 text-right">
                        {localizeNumber(item.female.toLocaleString(), "ne")}
                      </td>
                      <td className="border p-2 text-right">
                        {localizeNumber(item.other.toLocaleString(), "ne")}
                      </td>
                      <td className="border p-2 text-right font-medium">
                        {localizeNumber(item.total.toLocaleString(), "ne")}
                      </td>
                    </tr>
                  ))}
                <tr className="font-semibold bg-muted/70">
                  <td className="border p-2">जम्मा</td>
                  <td className="border p-2 text-right">
                    {localizeNumber(
                      genderWiseData
                        .reduce((sum, item) => sum + item.male, 0)
                        .toLocaleString(),
                      "ne"
                    )}
                  </td>
                  <td className="border p-2 text-right">
                    {localizeNumber(
                      genderWiseData
                        .reduce((sum, item) => sum + item.female, 0)
                        .toLocaleString(),
                      "ne"
                    )}
                  </td>
                  <td className="border p-2 text-right">
                    {localizeNumber(
                      genderWiseData
                        .reduce((sum, item) => sum + item.other, 0)
                        .toLocaleString(),
                      "ne"
                    )}
                  </td>
                  <td className="border p-2 text-right">
                    {localizeNumber(
                      genderWiseData
                        .reduce((sum, item) => sum + item.total, 0)
                        .toLocaleString(),
                      "ne"
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Ward-wise distribution */}
      <div className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card">
        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold">वडा अनुसार वैवाहिक स्थिति वितरण</h3>
          <p className="text-sm text-muted-foreground">
            वडा र वैवाहिक स्थिति अनुसार जनसंख्या वितरण
          </p>
        </div>

        <div className="p-6">
          <div className="h-[500px]">
            <MaritalStatusBarChart
              wardWiseData={wardWiseData}
              MARITAL_STATUS_COLORS={MARITAL_STATUS_COLORS}
              MARITAL_STATUS_NAMES={MARITAL_STATUS_NAMES}
             
            />
          </div>
        </div>
      </div>

      {/* Detailed ward analysis */}
      <div className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card">
        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold">
            वडा अनुसार विस्तृत वैवाहिक विश्लेषण
          </h3>
          <p className="text-sm text-muted-foreground">
            प्रत्येक वडाको विस्तृत वैवाहिक स्थिति संरचना
          </p>
        </div>

        <div className="p-6">
          <h4 className="text-lg font-medium mb-4">वडागत वैवाहिक स्थिति तालिका</h4>
          <div className="overflow-auto max-h-[600px]">
            <table className="w-full border-collapse min-w-[800px]">
              <thead className="sticky top-0 z-10">
                <tr className="bg-muted">
                  <th className="border p-2">वडा नं.</th>
                  <th className="border p-2">प्रमुख वैवाहिक स्थिति</th>
                  <th className="border p-2 text-right">जनसंख्या</th>
                  <th className="border p-2 text-right">वडाको प्रतिशत</th>
                  <th className="border p-2">दोस्रो प्रमुख वैवाहिक स्थिति</th>
                  <th className="border p-2 text-right">जनसंख्या</th>
                  <th className="border p-2 text-right">वडाको प्रतिशत</th>
                </tr>
              </thead>
              <tbody>
                {wardNumbers.map((wardNumber, i) => {
                  const wardItems = maritalData.filter(
                    (item) => item.wardNumber === wardNumber,
                  );
                  const wardTotal = wardItems.reduce(
                    (sum, item) => sum + (item.population || 0),
                    0,
                  );

                  // Group by marital status and sum population
                  const maritalStatusGroups = wardItems.reduce((acc: Record<string, number>, item) => {
                    if (!acc[item.maritalStatus]) acc[item.maritalStatus] = 0;
                    acc[item.maritalStatus] += item.population || 0;
                    return acc;
                  }, {});

                  // Convert to array and sort by population
                  const sortedMaritalStatus = Object.entries(maritalStatusGroups)
                    .map(([status, population]) => ({ status, population: population as number }))
                    .sort((a, b) => b.population - a.population);

                  const primaryStatus = sortedMaritalStatus[0];
                  const secondaryStatus = sortedMaritalStatus[1];

                  return (
                    <tr key={i} className={i % 2 === 0 ? "bg-muted/50" : ""}>
                      <td className="border p-2">वडा {localizeNumber(wardNumber.toString(), "ne")}</td>
                      <td className="border p-2">
                        {primaryStatus
                          ? MARITAL_STATUS_NAMES[primaryStatus.status as keyof typeof MARITAL_STATUS_NAMES] ||
                            primaryStatus.status
                          : "-"}
                      </td>
                      <td className="border p-2 text-right">
                        {primaryStatus?.population
                          ? localizeNumber(primaryStatus.population.toLocaleString(), "ne")
                          : localizeNumber("0", "ne")}
                      </td>
                      <td className="border p-2 text-right">
                        {wardTotal > 0 && primaryStatus?.population
                          ? localizeNumber((
                              (primaryStatus.population / wardTotal) *
                              100
                            ).toFixed(2), "ne") + "%"
                          : localizeNumber("0", "ne") + "%"}
                      </td>
                      <td className="border p-2">
                        {secondaryStatus
                          ? MARITAL_STATUS_NAMES[secondaryStatus.status as keyof typeof MARITAL_STATUS_NAMES] ||
                            secondaryStatus.status
                          : "-"}
                      </td>
                      <td className="border p-2 text-right">
                        {secondaryStatus?.population
                          ? localizeNumber(secondaryStatus.population.toLocaleString(), "ne")
                          : localizeNumber("0", "ne")}
                      </td>
                      <td className="border p-2 text-right">
                        {wardTotal > 0 && secondaryStatus?.population
                          ? localizeNumber((
                              (secondaryStatus.population / wardTotal) *
                              100
                            ).toFixed(2), "ne") + "%"
                          : localizeNumber("0", "ne") + "%"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Ward pie charts (client component) */}
          <h4 className="text-lg font-medium mt-8 mb-4">वडागत पाई चार्ट</h4>
          <WardMaritalStatusCharts
            wardNumbers={wardNumbers}
            maritalData={maritalData}
            MARITAL_STATUS_NAMES={MARITAL_STATUS_NAMES}
            MARITAL_STATUS_COLORS={MARITAL_STATUS_COLORS}
          />
        </div>
      </div>
    </>
  );
}
