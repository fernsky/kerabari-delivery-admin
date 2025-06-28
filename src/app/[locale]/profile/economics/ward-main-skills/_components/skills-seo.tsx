import Script from "next/script";
import { localizeNumber } from "@/lib/utils/localize-number";

interface SkillsSEOProps {
  overallSummary: Array<{
    skill: string;
    skillName: string;
    population: number;
  }>;
  totalPopulation: number;
  skillLabels: Record<string, string>;
  SKILL_NAMES_EN: Record<string, string>;
  wardNumbers: number[];
}

export default function SkillsSEO({
  overallSummary,
  totalPopulation,
  skillLabels,
  SKILL_NAMES_EN,
  wardNumbers,
}: SkillsSEOProps) {
  // Create structured data for SEO
  const generateStructuredData = () => {
    // Convert skills stats to structured data format
    const skillsStats = overallSummary.map((item) => ({
      "@type": "Observation",
      name: `${SKILL_NAMES_EN[item.skill] || item.skill} in Khajura Rural Municipality`,
      observationDate: new Date().toISOString().split("T")[0],
      measuredProperty: {
        "@type": "PropertyValue",
        name: `${SKILL_NAMES_EN[item.skill] || item.skill} skilled population`,
        unitText: "people",
      },
      measuredValue: item.population,
      description: `${item.population.toLocaleString()} people in Khajura Rural Municipality have skills in ${SKILL_NAMES_EN[item.skill] || item.skill} (${((item.population / totalPopulation) * 100).toFixed(2)}% of total skilled population)`,
      alternateName: `${item.skillName} - ${localizeNumber(item.population.toString(), "ne")} व्यक्ति (${localizeNumber(((item.population / totalPopulation) * 100).toFixed(2), "ne")}%)`,
    }));

    return {
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: "Skills Distribution of Khajura Rural Municipality (बुद्धशान्ति गाउँपालिका)",
      description: `Skills distribution data across ${wardNumbers.length} wards of Khajura Rural Municipality with a total skilled population of ${totalPopulation.toLocaleString()} people (${localizeNumber(totalPopulation.toString(), "ne")} व्यक्ति).`,
      keywords: [
        "Khajura Rural Municipality",
        "बुद्धशान्ति गाउँपालिका",
        "Skills distribution",
        "सीप वितरण",
        "Technical abilities",
        "प्राविधिक क्षमता",
        "Ward-wise skills data",
        "वडा अनुसार सीप तथ्यांक",
        "Nepal workforce skills",
        "नेपाल कार्यबल सीप",
        "Local skills inventory",
        "स्थानीय सीप सूची",
        ...Object.values(SKILL_NAMES_EN).map((name) => `${name} population`),
        ...Object.values(skillLabels).map((name) => `${name} जनसंख्या`),
      ],
      url: "https://buddhashanti-rm.gov.np/profile/economics/ward-main-skills",
      creator: {
        "@type": "Organization",
        name: "Khajura Rural Municipality",
        alternateName: "बुद्धशान्ति गाउँपालिका",
        url: "https://buddhashanti-rm.gov.np",
      },
      temporalCoverage: "2021/2023",
      spatialCoverage: {
        "@type": "Place",
        name: "Khajura Rural Municipality, Banke, Nepal",
        alternateName: "बुद्धशान्ति गाउँपालिका, झापा, नेपाल",
        geo: {
          "@type": "GeoCoordinates",
          latitude: "28.1356",
          longitude: "81.6314",
        },
      },
      variableMeasured: overallSummary.map((item) => ({
        "@type": "PropertyValue",
        name: `${SKILL_NAMES_EN[item.skill] || item.skill} skilled population`,
        alternateName: `${item.skillName} सीप भएको जनसंख्या`,
        unitText: "people",
        value: item.population,
      })),
      observation: skillsStats,
    };
  };

  const structuredData = generateStructuredData();

  return (
    <>
      <Script
        id="skills-distribution-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
    </>
  );
}
