import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import SkillsPieChart from "./charts/skills-pie-chart";
import SkillsBarChart from "./charts/skills-bar-chart";
import WardSkillsPieCharts from "./charts/ward-skills-pie-charts";
import { localizeNumber } from "@/lib/utils/localize-number";

// Define skills colors for consistency
const SKILL_COLORS = {
  TEACHING_RELATED: "#FF5733",
  PHOTOGRAPHY_RELATED: "#FFC300",
  HANDICRAFT_RELATED: "#36A2EB",
  MUSIC_DRAMA_RELATED: "#4BC0C0",
  STONEWORK_WOODWORK: "#9966FF",
  CARPENTERY_RELATED: "#3CB371",
  PLUMBING: "#FF6384",
  HUMAN_HEALTH_RELATED: "#FFCE56",
  ANIMAL_HEALTH_RELATED: "#C9CBCF",
  ELECTRICITY_INSTALLMENT_RELATED: "#FF9F40",
  HOTEL_RESTAURANT_RELATED: "#4CAF50",
  AGRICULTURE_RELATED: "#9C27B0",
  PRINTING_RELATED: "#2196F3",
  DRIVING_RELATED: "#FF5722",
  MECHANICS_RELATED: "#673AB7",
  FURNITURE_RELATED: "#795548",
  SHOEMAKING_RELATED: "#607D8B",
  SEWING_RELATED: "#E91E63",
  JWELLERY_MAKING_RELATED: "#FFEB3B",
  BEUATICIAN_RELATED: "#8BC34A",
  SELF_PROTECTION_RELATED: "#009688",
  LAND_SURVEY_RELATED: "#03A9F4",
  COMPUTER_SCIENCE_RELATED: "#F44336",
  ENGINEERING_DESIGN_RELATED: "#3F51B5",
  RADIO_TELEVISION_ELECTRICAL_REPAIR: "#CDDC39",
  LITERARY_CREATION_RELATED: "#00BCD4",
  OTHER: "#9E9E9E",
  NONE: "#757575",
};

interface SkillsChartsProps {
  overallSummary: Array<{
    skill: string;
    skillName: string;
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
  skillsData: Array<{
    id?: string;
    wardNumber: number;
    skill: string;
    population: number;
  }>;
  skillLabels: Record<string, string>;
  SKILL_NAMES_EN: Record<string, string>;
}

export default function SkillsCharts({
  overallSummary,
  totalPopulation,
  pieChartData,
  wardWiseData,
  wardNumbers,
  skillsData,
  skillLabels,
  SKILL_NAMES_EN,
}: SkillsChartsProps) {
  return (
    <>
      {/* Overall skills distribution - with pre-rendered table and client-side chart */}
      <div
        className="mb-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Skills Distribution in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content={`Distribution of skills in Khajura with a total of ${totalPopulation} skilled population`}
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            सीप अनुसार जनसंख्या वितरण
          </h3>
          <p className="text-sm text-muted-foreground">
            कुल दक्ष जनसंख्या:{" "}
            {localizeNumber(totalPopulation.toLocaleString(), "ne")} व्यक्ति
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
          {/* Client-side pie chart */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-medium mb-4 text-center">पाई चार्ट</h4>
            <div className="h-[700px]">
              <SkillsPieChart
                pieChartData={pieChartData}
                skillLabels={skillLabels}
                SKILL_COLORS={SKILL_COLORS}
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
                    <th className="border p-2 text-left">सीप / दक्षता</th>
                    <th className="border p-2 text-right">जनसंख्या</th>
                    <th className="border p-2 text-right">प्रतिशत</th>
                  </tr>
                </thead>
                <tbody>
                  {overallSummary.map((item, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-muted/40" : ""}>
                      <td className="border p-2">
                        {localizeNumber(i + 1, "ne")}
                      </td>
                      <td className="border p-2">{item.skillName}</td>
                      <td className="border p-2 text-right">
                        {localizeNumber(item.population.toLocaleString(), "ne")}
                      </td>
                      <td className="border p-2 text-right">
                        {localizeNumber(
                          ((item.population / totalPopulation) * 100).toFixed(2),
                          "ne"
                        )}
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
            प्रमुख सीपहरू
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {overallSummary.slice(0, 5).map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor:
                      SKILL_COLORS[item.skill as keyof typeof SKILL_COLORS] ||
                      "#888",
                  }}
                ></div>
                <div className="flex-grow">
                  <div className="flex justify-between items-center">
                    <span>{item.skillName}</span>
                    <span className="font-medium">
                      {localizeNumber(
                        ((item.population / totalPopulation) * 100).toFixed(1),
                        "ne"
                      )}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(item.population / totalPopulation) * 100}%`,
                        backgroundColor:
                          SKILL_COLORS[
                            item.skill as keyof typeof SKILL_COLORS
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
              ? `${localizeNumber(overallSummary.length - 5, "ne")} अन्य सीपहरू पनि छन्।`
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
          content="Ward-wise Skills Distribution in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content="Skills distribution across wards in Khajura"
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            वडा अनुसार सीप वितरण
          </h3>
          <p className="text-sm text-muted-foreground">
            वडा र सीप अनुसार जनसंख्या वितरण
          </p>
        </div>

        <div className="p-6">
          <div className="h-[800px]">
            <SkillsBarChart
              wardWiseData={wardWiseData}
              SKILL_COLORS={SKILL_COLORS}
              skillLabels={skillLabels}
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
          content="Detailed Skills Analysis by Ward in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content="Detailed skills composition of each ward in Khajura"
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            वडा अनुसार विस्तृत सीप विश्लेषण
          </h3>
          <p className="text-sm text-muted-foreground">
            प्रत्येक वडाको विस्तृत सीप संरचना
          </p>
        </div>

        <div className="p-6">
          <h4 className="text-lg font-medium mb-4">वडागत सीप तालिका</h4>
          <div className="overflow-auto max-h-[600px]">
            <table className="w-full border-collapse min-w-[800px]">
              <thead className="sticky top-0 z-10">
                <tr className="bg-muted">
                  <th className="border p-2">वडा नं.</th>
                  <th className="border p-2">प्रमुख सीप</th>
                  <th className="border p-2 text-right">जनसंख्या</th>
                  <th className="border p-2 text-right">वडाको प्रतिशत</th>
                  <th className="border p-2">दोस्रो प्रमुख सीप</th>
                  <th className="border p-2 text-right">जनसंख्या</th>
                  <th className="border p-2 text-right">वडाको प्रतिशत</th>
                </tr>
              </thead>
              <tbody>
                {wardNumbers.map((wardNumber, i) => {
                  const wardItems = skillsData.filter(
                    (item) => item.wardNumber === wardNumber
                  );
                  const wardTotal = wardItems.reduce(
                    (sum, item) => sum + (item.population || 0),
                    0
                  );

                  // Sort by population to find primary and secondary skills
                  const sortedItems = [...wardItems].sort(
                    (a, b) => (b.population || 0) - (a.population || 0)
                  );
                  const primarySkill = sortedItems[0];
                  const secondarySkill = sortedItems[1];

                  return (
                    <tr key={i} className={i % 2 === 0 ? "bg-muted/50" : ""}>
                      <td className="border p-2">
                        वडा {localizeNumber(wardNumber, "ne")}
                      </td>
                      <td className="border p-2">
                        {primarySkill
                          ? skillLabels[primarySkill.skill] ||
                            primarySkill.skill
                          : "-"}
                      </td>
                      <td className="border p-2 text-right">
                        {primarySkill?.population
                          ? localizeNumber(
                              primarySkill.population.toLocaleString(),
                              "ne"
                            )
                          : "०"}
                      </td>
                      <td className="border p-2 text-right">
                        {wardTotal > 0 && primarySkill?.population
                          ? localizeNumber(
                              ((primarySkill.population / wardTotal) * 100).toFixed(
                                2
                              ),
                              "ne"
                            ) + "%"
                          : "०%"}
                      </td>
                      <td className="border p-2">
                        {secondarySkill
                          ? skillLabels[secondarySkill.skill] ||
                            secondarySkill.skill
                          : "-"}
                      </td>
                      <td className="border p-2 text-right">
                        {secondarySkill?.population
                          ? localizeNumber(
                              secondarySkill.population.toLocaleString(),
                              "ne"
                            )
                          : "०"}
                      </td>
                      <td className="border p-2 text-right">
                        {wardTotal > 0 && secondarySkill?.population
                          ? localizeNumber(
                              ((secondarySkill.population / wardTotal) * 100).toFixed(
                                2
                              ),
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
          <WardSkillsPieCharts
            wardNumbers={wardNumbers}
            skillsData={skillsData}
            skillLabels={skillLabels}
            SKILL_COLORS={SKILL_COLORS}
          />
        </div>
      </div>
    </>
  );
}
