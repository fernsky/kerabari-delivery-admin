import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import AgeGroupPieChart from "./charts/age-group-pie-chart";
import GenderPieChart from "./charts/gender-pie-chart";
import WardAgeGroupBarChart from "./charts/ward-age-group-bar-chart";
import WardGenderBarChart from "./charts/ward-gender-bar-chart";
import WardDetailedAnalysis from "./charts/ward-detailed-analysis";

// Define colors for consistency
const AGE_GROUP_COLORS = {
  AGE_0_TO_14: "#FF9F40",
  AGE_15_TO_59: "#36A2EB",
  AGE_60_PLUS: "#FF6384",
};

const GENDER_COLORS = {
  MALE: "#36A2EB",
  FEMALE: "#FF6384",
  OTHER: "#4BC0C0",
};

interface EconomicallyActiveChartsProps {
  ageGroupSummary: Array<{
    ageGroup: string;
    ageGroupName: string;
    population: number;
  }>;
  genderSummary: Array<{
    gender: string;
    genderName: string;
    population: number;
  }>;
  totalPopulation: number;
  ageGroupPieChartData: Array<{
    name: string;
    value: number;
    percentage: string;
  }>;
  genderPieChartData: Array<{
    name: string;
    value: number;
    percentage: string;
  }>;
  wardWiseData: Array<Record<string, any>>;
  wardWiseGenderData: Array<Record<string, any>>;
  wardNumbers: number[];
  economicallyActiveData: Array<{
    id?: string;
    wardNumber: number;
    ageGroup: string;
    gender: string;
    population: number;
    updatedAt?: string;
    createdAt?: string;
  }>;
  AGE_GROUP_NAMES: Record<string, string>;
  GENDER_NAMES: Record<string, string>;
  dependencyRatio: string;
}

export default function EconomicallyActiveCharts({
  ageGroupSummary,
  genderSummary,
  totalPopulation,
  ageGroupPieChartData,
  genderPieChartData,
  wardWiseData,
  wardWiseGenderData,
  wardNumbers,
  economicallyActiveData,
  AGE_GROUP_NAMES,
  GENDER_NAMES,
  dependencyRatio,
}: EconomicallyActiveChartsProps) {
  return (
    <>
      {/* Age group distribution - with pre-rendered table and client-side chart */}
      <div className="mb-12 border rounded-lg shadow-sm overflow-hidden bg-card">
        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold">उमेर समूह अनुसार वितरण</h3>
          <p className="text-sm text-muted-foreground">
            कुल जनसंख्या: {totalPopulation.toLocaleString()} व्यक्ति
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
          {/* Client-side pie chart */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-medium mb-4 text-center">पाई चार्ट</h4>
            <div className="h-[400px]">
              <AgeGroupPieChart
                pieChartData={ageGroupPieChartData}
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
                  {ageGroupSummary.map((item, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-muted/40" : ""}>
                      <td className="border p-2">{i + 1}</td>
                      <td className="border p-2">{item.ageGroupName}</td>
                      <td className="border p-2 text-right">
                        {item.population.toLocaleString()}
                      </td>
                      <td className="border p-2 text-right">
                        {((item.population / totalPopulation) * 100).toFixed(2)}
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
                      {totalPopulation.toLocaleString()}
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
            प्रमुख उमेर समूहहरू
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {ageGroupSummary.map((item, i) => (
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
                      {((item.population / totalPopulation) * 100).toFixed(1)}%
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
          <div className="mt-4 p-3 bg-muted/30 rounded-md">
            <p className="text-sm">
              <strong>निर्भरता अनुपात:</strong> {dependencyRatio}% - हरेक १००
              कार्यसक्षम उमेरका व्यक्तिले {dependencyRatio} जना आश्रित
              (बालबालिका र वृद्ध) लाई आर्थिक रूपमा सहयोग गर्नुपर्ने स्थिति
            </p>
          </div>
        </div>
      </div>

      {/* Gender distribution - with pre-rendered table and client-side chart */}
      <div
        id="gender-distribution"
        className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card"
      >
        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold">लिङ्ग अनुसार वितरण</h3>
          <p className="text-sm text-muted-foreground">
            कुल जनसंख्या: {totalPopulation.toLocaleString()} व्यक्ति
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
          {/* Client-side pie chart */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-medium mb-4 text-center">पाई चार्ट</h4>
            <div className="h-[400px]">
              <GenderPieChart
                pieChartData={genderPieChartData}
                GENDER_NAMES={GENDER_NAMES}
                GENDER_COLORS={GENDER_COLORS}
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
                    <th className="border p-2 text-left">लिङ्ग</th>
                    <th className="border p-2 text-right">जनसंख्या</th>
                    <th className="border p-2 text-right">प्रतिशत</th>
                  </tr>
                </thead>
                <tbody>
                  {genderSummary.map((item, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-muted/40" : ""}>
                      <td className="border p-2">{i + 1}</td>
                      <td className="border p-2">{item.genderName}</td>
                      <td className="border p-2 text-right">
                        {item.population.toLocaleString()}
                      </td>
                      <td className="border p-2 text-right">
                        {((item.population / totalPopulation) * 100).toFixed(2)}
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
                      {totalPopulation.toLocaleString()}
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
            लिङ्ग अनुपात
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {genderSummary.map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor:
                      GENDER_COLORS[
                        item.gender as keyof typeof GENDER_COLORS
                      ] || "#888",
                  }}
                ></div>
                <div className="flex-grow">
                  <div className="flex justify-between items-center">
                    <span>{item.genderName}</span>
                    <span className="font-medium">
                      {((item.population / totalPopulation) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(item.population / totalPopulation) * 100}%`,
                        backgroundColor:
                          GENDER_COLORS[
                            item.gender as keyof typeof GENDER_COLORS
                          ] || "#888",
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Calculate gender ratio */}
          {(() => {
            const males =
              genderSummary.find((g) => g.gender === "MALE")?.population || 0;
            const females =
              genderSummary.find((g) => g.gender === "FEMALE")?.population || 0;
            const genderRatio =
              females > 0 ? ((males / females) * 100).toFixed(2) : "N/A";

            return (
              <div className="mt-4 p-3 bg-muted/30 rounded-md">
                <p className="text-sm">
                  <strong>लिङ्ग अनुपात:</strong> प्रति १०० महिलामा {genderRatio}{" "}
                  पुरुष
                </p>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Ward-wise distribution - by age group */}
      <div
        id="ward-wise-distribution"
        className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card"
      >
        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold">वडा अनुसार उमेर समूह वितरण</h3>
          <p className="text-sm text-muted-foreground">
            वडा र उमेर समूह अनुसार जनसंख्या वितरण
          </p>
        </div>

        <div className="p-6">
          <div className="h-[500px]">
            <WardAgeGroupBarChart
              wardWiseData={wardWiseData}
              AGE_GROUP_COLORS={AGE_GROUP_COLORS}
              AGE_GROUP_NAMES={AGE_GROUP_NAMES}
            />
          </div>
        </div>
      </div>

      {/* Ward-wise distribution - by gender */}
      <div className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card">
        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold">वडा अनुसार लिङ्ग वितरण</h3>
          <p className="text-sm text-muted-foreground">
            वडा र लिङ्ग अनुसार जनसंख्या वितरण
          </p>
        </div>

        <div className="p-6">
          <div className="h-[500px]">
            <WardGenderBarChart
              wardWiseGenderData={wardWiseGenderData}
              GENDER_COLORS={GENDER_COLORS}
              GENDER_NAMES={GENDER_NAMES}
            />
          </div>
        </div>
      </div>

      {/* Detailed ward analysis */}
      <div className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card">
        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold">वडा अनुसार विस्तृत विश्लेषण</h3>
          <p className="text-sm text-muted-foreground">
            प्रत्येक वडाको विस्तृत उमेर समूह र लिङ्ग वितरण
          </p>
        </div>

        <div className="p-6">
          <WardDetailedAnalysis
            wardNumbers={wardNumbers}
            economicallyActiveData={economicallyActiveData}
            AGE_GROUP_NAMES={AGE_GROUP_NAMES}
            GENDER_NAMES={GENDER_NAMES}
            AGE_GROUP_COLORS={AGE_GROUP_COLORS}
            GENDER_COLORS={GENDER_COLORS}
          />

          <div className="mt-4 flex justify-end">
            <Button variant="outline" size="sm">
              <FileDown className="mr-2 h-4 w-4" />
              Excel डाउनलोड
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
