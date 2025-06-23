import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import ForeignEmploymentPieChart from "./charts/foreign-employment-pie-chart";
import ForeignEmploymentBarChart from "./charts/foreign-employment-bar-chart";
import WardForeignEmploymentPieCharts from "./charts/ward-foreign-employment-pie-charts";
import { localizeNumber } from "@/lib/utils/localize-number";
import RegionalDistributionChart from "./charts/regional-distribution-chart";
import SkillLevelChart from "./charts/skill-level-chart";

interface ForeignEmploymentCountriesChartsProps {
  overallSummary: Array<{
    country: string;
    countryName: string;
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
  employmentData: Array<{
    id?: string;
    wardNumber: number;
    country: string;
    population: number;
  }>;
  wardWiseAnalysis: Array<{
    wardNumber: number;
    totalPopulation: number;
    mostCommonCountry: string;
    mostCommonCountryPopulation: number;
    mostCommonCountryPercentage: string;
    gulfCountriesPopulation: number;
    gulfPercentage: string;
    asiaPacificPopulation: number;
    asiaPacificPercentage: string;
    westernCountriesPopulation: number;
    westernCountriesPercentage: string;
    diversityScore: number;
    uniqueCountries: number;
  }>;
  regionChartData: Array<{
    name: string;
    value: number;
    percentage: string;
  }>;
  skillLevelChartData: Array<{
    name: string;
    value: number;
    percentage: string;
  }>;
  COUNTRY_NAMES: Record<string, string>;
  COUNTRY_COLORS: Record<string, string>;
  estimatedAnnualRemittance: number;
  formattedEstimatedAnnualRemittance: string;
}

export default function ForeignEmploymentCountriesCharts({
  overallSummary,
  totalPopulation,
  pieChartData,
  wardWiseData,
  wardNumbers,
  employmentData,
  wardWiseAnalysis,
  regionChartData,
  skillLevelChartData,
  COUNTRY_NAMES,
  COUNTRY_COLORS,
  estimatedAnnualRemittance,
  formattedEstimatedAnnualRemittance,
}: ForeignEmploymentCountriesChartsProps) {
  // Assign color scheme for skill levels
  const SKILL_LEVEL_COLORS = {
    "दक्ष": "#2ecc71", // Green for skilled
    "अर्धदक्ष": "#f39c12", // Orange for semi-skilled
    "अदक्ष": "#e74c3c", // Red for unskilled
  };

  // Assign color scheme for regions
  const REGION_COLORS = {
    "खाडी मुलुक": "#3498db", // Blue for Gulf
    "एसिया प्यासिफिक": "#9b59b6", // Purple for Asia Pacific
    "दक्षिण एसिया": "#e74c3c", // Red for South Asia
    "पश्चिमी देशहरू": "#2ecc71", // Green for Western Countries
    "अन्य देशहरू": "#95a5a6", // Grey for Others
  };

  return (
    <>
      {/* Overall foreign employment distribution - with pre-rendered table and client-side chart */}
      <div 
        className="mb-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Foreign Employment Countries in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content={`Foreign employment destinations of Khajura with a total of ${totalPopulation} migrant workers`}
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            वैदेशिक रोजगारीका प्रमुख गन्तव्य देशहरू
          </h3>
          <p className="text-sm text-muted-foreground">
            कुल वैदेशिक रोजगारीमा गएको जनसंख्या: {localizeNumber(totalPopulation.toLocaleString(), "ne")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
          {/* Client-side pie chart */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-medium mb-4 text-center">पाई चार्ट</h4>
            <div className="h-[1080px]">
              <ForeignEmploymentPieChart
                pieChartData={pieChartData}
                COUNTRY_NAMES={COUNTRY_NAMES}
                COUNTRY_COLORS={COUNTRY_COLORS}
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
                    <th className="border p-2 text-left">देश</th>
                    <th className="border p-2 text-right">जनसंख्या</th>
                    <th className="border p-2 text-right">प्रतिशत</th>
                  </tr>
                </thead>
                <tbody>
                  {overallSummary.map((item, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-muted/40" : ""}>
                      <td className="border p-2">{localizeNumber(i + 1, "ne")}</td>
                      <td className="border p-2">{item.countryName}</td>
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
            वैदेशिक रोजगारीका गन्तव्य देशहरू विवरण
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {overallSummary.slice(0, 6).map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor:
                      COUNTRY_COLORS[
                        item.country as keyof typeof COUNTRY_COLORS
                      ] || "#888",
                  }}
                ></div>
                <div className="flex-grow">
                  <div className="flex justify-between items-center">
                    <span className="text-sm truncate">{item.countryName}</span>
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
                          COUNTRY_COLORS[
                            item.country as keyof typeof COUNTRY_COLORS
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

      {/* Regional Distribution Chart */}
      <div 
        className="mb-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Regional Distribution of Foreign Employment in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content="Regional analysis of foreign employment in Khajura"
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline" id="regional-foreign-employment-trends">
            क्षेत्रगत वैदेशिक रोजगारी प्रवृत्ति
          </h3>
          <p className="text-sm text-muted-foreground">
            वैदेशिक रोजगारीका क्षेत्रगत वितरण र विश्लेषण
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
          {/* Regional Distribution Chart */}
          <div className="h-[600px]">
            <RegionalDistributionChart regionChartData={regionChartData} REGION_COLORS={REGION_COLORS} />
          </div>

          {/* Skill Level Distribution Chart */}
          <div className="h-[400px]">
            <SkillLevelChart skillLevelChartData={skillLevelChartData} SKILL_LEVEL_COLORS={SKILL_LEVEL_COLORS} />
          </div>
        </div>
        
        <div className="p-6 border-t">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Regional analysis table */}
            <div>
              <h4 className="text-lg font-medium mb-4">क्षेत्रगत वितरण</h4>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted">
                    <th className="border p-2 text-left">क्षेत्र</th>
                    <th className="border p-2 text-right">जनसंख्या</th>
                    <th className="border p-2 text-right">प्रतिशत</th>
                  </tr>
                </thead>
                <tbody>
                  {regionChartData.map((region, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-muted/40" : ""}>
                      <td className="border p-2">{region.name}</td>
                      <td className="border p-2 text-right">{localizeNumber(region.value.toLocaleString(), "ne")}</td>
                      <td className="border p-2 text-right">{localizeNumber(region.percentage, "ne")}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Skill level analysis table */}
            <div>
              <h4 className="text-lg font-medium mb-4">सीप स्तर अनुसार वितरण</h4>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted">
                    <th className="border p-2 text-left">सीप स्तर</th>
                    <th className="border p-2 text-right">जनसंख्या</th>
                    <th className="border p-2 text-right">प्रतिशत</th>
                  </tr>
                </thead>
                <tbody>
                  {skillLevelChartData.map((skill, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-muted/40" : ""}>
                      <td className="border p-2">{skill.name}</td>
                      <td className="border p-2 text-right">{localizeNumber(skill.value.toLocaleString(), "ne")}</td>
                      <td className="border p-2 text-right">{localizeNumber(skill.percentage, "ne")}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              <div className="mt-6 bg-muted/30 p-4 rounded-lg">
                <h5 className="font-medium mb-2">सीप स्तर अनुसार प्रमुख गन्तव्य देशहरू</h5>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="w-3 h-3 rounded-full mt-1" style={{backgroundColor: SKILL_LEVEL_COLORS["दक्ष"]}}></div>
                    <div>
                      <strong>दक्ष:</strong> दक्षिण कोरिया, जापान, अष्ट्रेलिया, अमेरिका, बेलायत
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-3 h-3 rounded-full mt-1" style={{backgroundColor: SKILL_LEVEL_COLORS["अर्धदक्ष"]}}></div>
                    <div>
                      <strong>अर्धदक्ष:</strong> कतार, साउदी अरेबिया, युएई, कुवेत, मलेसिया
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-3 h-3 rounded-full mt-1" style={{backgroundColor: SKILL_LEVEL_COLORS["अदक्ष"]}}></div>
                    <div>
                      <strong>अदक्ष:</strong> भारत तथा अन्य विभिन्न देशहरू
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      

      {/* Ward-wise distribution - pre-rendered table with client-side chart */}
      <div 
        className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        id="ward-wise-foreign-employment"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Ward-wise Foreign Employment in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content="Foreign employment distribution across wards in Khajura"
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            वडा अनुसार वैदेशिक रोजगारीको वितरण
          </h3>
          <p className="text-sm text-muted-foreground">
            वडा र देश अनुसार वैदेशिक रोजगारी वितरण
          </p>
        </div>

        <div className="p-6">
          <div className="h-[500px]">
            <ForeignEmploymentBarChart
              wardWiseData={wardWiseData}
              COUNTRY_COLORS={COUNTRY_COLORS}
              COUNTRY_NAMES={COUNTRY_NAMES}
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
          content="Ward-wise Foreign Employment Analysis in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content="Foreign employment patterns by ward in Khajura"
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            वडागत वैदेशिक रोजगारी विश्लेषण
          </h3>
          <p className="text-sm text-muted-foreground">
            वडा अनुसार वैदेशिक रोजगारीका प्रमुख गन्तव्य देशहरू र वितरण
          </p>
        </div>

        <div className="p-6">
          <div className="overflow-auto">
            <table className="w-full border-collapse min-w-[800px]">
              <thead className="sticky top-0 z-10">
                <tr className="bg-muted">
                  <th className="border p-2">वडा नं.</th>
                  <th className="border p-2 text-right">वैदेशिक रोजगारी संख्या</th>
                  <th className="border p-2">प्रमुख गन्तव्य देश</th>
                  <th className="border p-2 text-right">खाडी मुलुक (%)</th>
                  <th className="border p-2 text-right">एसिया प्यासिफिक (%)</th>
                  <th className="border p-2 text-right">पश्चिमी देशहरू (%)</th>
                </tr>
              </thead>
              <tbody>
                {wardWiseAnalysis.map((item, i) => {
                  return (
                    <tr key={i} className={i % 2 === 0 ? "bg-muted/50" : ""}>
                      <td className="border p-2">वडा {localizeNumber(item.wardNumber, "ne")}</td>
                      <td className="border p-2 text-right">
                        {localizeNumber(item.totalPopulation.toLocaleString(), "ne")}
                      </td>
                      <td className="border p-2">
                        {COUNTRY_NAMES[item.mostCommonCountry as keyof typeof COUNTRY_NAMES] || item.mostCommonCountry}
                      </td>
                      <td className="border p-2 text-right">
                        {localizeNumber(item.gulfPercentage, "ne")}%
                      </td>
                      <td className="border p-2 text-right">
                        {localizeNumber(item.asiaPacificPercentage, "ne")}%
                      </td>
                      <td className="border p-2 text-right">
                        {localizeNumber(item.westernCountriesPercentage, "ne")}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="font-semibold bg-muted/70">
                  <td className="border p-2">पालिका जम्मा</td>
                  <td className="border p-2 text-right">
                    {localizeNumber(totalPopulation.toLocaleString(), "ne")}
                  </td>
                  <td className="border p-2">
                    {COUNTRY_NAMES[overallSummary[0]?.country as keyof typeof COUNTRY_NAMES] || overallSummary[0]?.country}
                  </td>
                  <td className="border p-2 text-right">
                    {localizeNumber(
                      ((regionChartData.find(r => r.name === "खाडी मुलुक")?.value || 0) / totalPopulation * 100).toFixed(2),
                      "ne"
                    )}%
                  </td>
                  <td className="border p-2 text-right">
                    {localizeNumber(
                      ((regionChartData.find(r => r.name === "एसिया प्यासिफिक")?.value || 0) / totalPopulation * 100).toFixed(2),
                      "ne"
                    )}%
                  </td>
                  <td className="border p-2 text-right">
                    {localizeNumber(
                      ((regionChartData.find(r => r.name === "पश्चिमी देशहरू")?.value || 0) / totalPopulation * 100).toFixed(2),
                      "ne"
                    )}%
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Ward pie charts (client component) */}
          <h4 className="text-lg font-medium mt-8 mb-4">वडागत वैदेशिक रोजगारीको वितरण</h4>
          <WardForeignEmploymentPieCharts
            wardNumbers={wardNumbers}
            employmentData={employmentData}
            COUNTRY_NAMES={COUNTRY_NAMES}
            COUNTRY_COLORS={COUNTRY_COLORS}
          />
        </div>
      </div>
    </>
  );
}
