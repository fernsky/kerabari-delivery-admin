import { localizeNumber } from "@/lib/utils/localize-number";
import SchoolDropoutPieChart from "./charts/school-dropout-pie-chart";
import SchoolDropoutBarChart from "./charts/school-dropout-bar-chart";
import SchoolDropoutComparisonChart from "./charts/school-dropout-comparison-chart";
import WardSchoolDropoutPieCharts from "./charts/ward-school-dropout-pie-charts";

interface WardWiseSchoolDropoutChartsProps {
  pieChartData: Array<{
    name: string;
    nameEn: string;
    value: number;
    percentage: string;
    color: string;
  }>;
  wardWiseData: Array<any>;
  totalDropouts: number;
  dropoutCauseTotals: Record<string, number>;
  causeMap: Record<string, string>;
  dropoutGroupTotals: Record<string, number>;
  dropoutGroupPercentages: Record<string, number>;
  wardWiseEmploymentDropout: Array<{
    wardNumber: number;
    percentage: number;
  }>;
  highestEmploymentDropoutWard: {
    wardNumber: number;
    percentage: number;
  };
  lowestEmploymentDropoutWard: {
    wardNumber: number;
    percentage: number;
  };
  DROPOUT_CAUSE_GROUPS: Record<string, {
    name: string;
    nameEn: string;
    color: string;
    causes: string[];
  }>;
}

export default function WardWiseSchoolDropoutCharts({
  pieChartData,
  wardWiseData,
  totalDropouts,
  dropoutCauseTotals,
  causeMap,
  dropoutGroupTotals,
  dropoutGroupPercentages,
  wardWiseEmploymentDropout,
  highestEmploymentDropoutWard,
  lowestEmploymentDropoutWard,
  DROPOUT_CAUSE_GROUPS,
}: WardWiseSchoolDropoutChartsProps) {
  return (
    <>
      {/* Overall school dropout cause distribution */}
      <div 
        className="mb-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="School Dropout Causes Distribution in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content={`Distribution of school dropout causes with a total of ${totalDropouts} dropouts`}
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            विद्यालय छाड्ने कारण अनुसार वितरण
          </h3>
          <p className="text-sm text-muted-foreground">
            कुल विद्यालय छाड्नेहरू: {localizeNumber(totalDropouts.toLocaleString(), "ne")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
          {/* Client-side pie chart */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-medium mb-4 text-center">पाई चार्ट</h4>
            <div className="h-[420px]">
              <SchoolDropoutPieChart
                pieChartData={pieChartData}
                DROPOUT_CAUSE_GROUPS={DROPOUT_CAUSE_GROUPS}
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
                    <th className="border p-2 text-left">विद्यालय छाड्ने कारण</th>
                    <th className="border p-2 text-right">जनसंख्या</th>
                    <th className="border p-2 text-right">प्रतिशत</th>
                  </tr>
                </thead>
                <tbody>
                  {pieChartData.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-muted/40" : ""}>
                      <td className="border p-2">{localizeNumber((index + 1).toString(), "ne")}</td>
                      <td className="border p-2">{item.name}</td>
                      <td className="border p-2 text-right">
                        {localizeNumber(item.value.toLocaleString(), "ne")}
                      </td>
                      <td className="border p-2 text-right">
                        {localizeNumber(item.percentage, "ne")}%
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
                      {localizeNumber(totalDropouts.toLocaleString(), "ne")}
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
            विद्यालय छाड्ने कारण विवरण
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pieChartData.map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                ></div>
                <div className="flex-grow">
                  <div className="flex justify-between items-center">
                    <span>{item.name}</span>
                    <span className="font-medium">
                      {localizeNumber(item.percentage, "ne")}%
                    </span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${parseFloat(item.percentage)}%`,
                        backgroundColor: item.color,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ward-wise distribution */}
      <div 
        className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        id="ward-wise-school-dropout-causes"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Ward-wise School Dropout Causes in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content="Distribution of school dropout causes across wards in Khajura"
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            वडा अनुसार विद्यालय छाड्ने कारणहरू
          </h3>
          <p className="text-sm text-muted-foreground">
            वडा अनुसार विभिन्न कारणले विद्यालय छाड्नेहरूको वितरण
          </p>
        </div>

        <div className="p-6">
          <div className="h-[500px]">
            <SchoolDropoutBarChart
              wardWiseData={wardWiseData}
              DROPOUT_CAUSE_GROUPS={DROPOUT_CAUSE_GROUPS}
            />
          </div>
        </div>
      </div>

      {/* Ward-wise comparison */}
      <div 
        className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Economic-Related Dropout Comparison Across Wards in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content="Comparison of economic-related dropout rates across wards in Khajura"
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            वडागत आर्थिक कारणले विद्यालय छाड्ने दर
          </h3>
          <p className="text-sm text-muted-foreground">
            विभिन्न वडाहरूमा आर्थिक कारण विद्यालय छाड्नेहरूको तुलना
          </p>
        </div>

        <div className="p-6">
          <div className="h-[400px]">
            <SchoolDropoutComparisonChart
              wardWiseEconomicDropout={wardWiseEmploymentDropout}
              highestEconomicDropoutWard={highestEmploymentDropoutWard}
              lowestEconomicDropoutWard={lowestEmploymentDropoutWard}
              DROPOUT_CAUSE_GROUPS={DROPOUT_CAUSE_GROUPS}
            />
          </div>
        </div>
      </div>

      {/* Ward-wise analysis */}
      <div 
        className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Ward-wise School Dropout Analysis in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content="Detailed analysis of school dropout causes by ward in Khajura"
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            वडागत विद्यालय छाड्ने कारणहरूको विश्लेषण
          </h3>
          <p className="text-sm text-muted-foreground">
            वडा अनुसार विद्यालय छाड्ने कारणहरूको विस्तृत विश्लेषण
          </p>
        </div>

        <div className="p-6">
          <div className="overflow-auto">
            <table className="w-full border-collapse min-w-[800px]">
              <thead className="sticky top-0 z-10">
                <tr className="bg-muted">
                  <th className="border p-2">वडा नं.</th>
                  <th className="border p-2 text-right">जम्मा विद्यालय छाड्नेहरू</th>
                  {Object.keys(DROPOUT_CAUSE_GROUPS).map(key => (
                    <th key={key} className="border p-2 text-right">
                      {DROPOUT_CAUSE_GROUPS[key as keyof typeof DROPOUT_CAUSE_GROUPS].name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {wardWiseData.map((item, i) => {
                  const total = item.total;
                  return (
                    <tr key={i} className={i % 2 === 0 ? "bg-muted/50" : ""}>
                      <td className="border p-2">वडा {localizeNumber(item.wardNumber, "ne")}</td>
                      <td className="border p-2 text-right">
                        {localizeNumber(total.toLocaleString(), "ne")}
                      </td>
                      {Object.keys(DROPOUT_CAUSE_GROUPS).map(key => {
                        const groupName = DROPOUT_CAUSE_GROUPS[key as keyof typeof DROPOUT_CAUSE_GROUPS].name;
                        const value = item[groupName] || 0;
                        const percentage = total > 0 ? ((value / total) * 100).toFixed(2) : "0.00";
                        return (
                          <td key={key} className="border p-2 text-right">
                            {localizeNumber(value.toLocaleString(), "ne")}
                            <div className="text-xs text-muted-foreground">
                              ({localizeNumber(percentage, "ne")}%)
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="font-semibold bg-muted/70">
                  <td className="border p-2">पालिका जम्मा</td>
                  <td className="border p-2 text-right">
                    {localizeNumber(totalDropouts.toLocaleString(), "ne")}
                  </td>
                  {Object.keys(DROPOUT_CAUSE_GROUPS).map(key => {
                    const value = dropoutGroupTotals[key];
                    const percentage = dropoutGroupPercentages[key].toFixed(2);
                    return (
                      <td key={key} className="border p-2 text-right">
                        {localizeNumber(value.toLocaleString(), "ne")}
                        <div className="text-xs">
                          ({localizeNumber(percentage, "ne")}%)
                        </div>
                      </td>
                    );
                  })}
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Ward pie charts (client component) */}
          <h4 className="text-lg font-medium mt-8 mb-4">वडागत विद्यालय छाड्ने कारणहरूको वितरण</h4>
          <WardSchoolDropoutPieCharts
            wardWiseData={wardWiseData}
            DROPOUT_CAUSE_GROUPS={DROPOUT_CAUSE_GROUPS}
          />
        </div>
      </div>
    </>
  );
}
