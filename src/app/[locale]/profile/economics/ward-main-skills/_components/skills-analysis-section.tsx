"use client";

import Link from "next/link";
import { useEffect } from "react";
import { localizeNumber } from "@/lib/utils/localize-number";

interface SkillsAnalysisSectionProps {
  overallSummary: Array<{
    skill: string;
    skillName: string;
    population: number;
  }>;
  totalPopulation: number;
  skillLabels: Record<string, string>;
  SKILL_NAMES_EN: Record<string, string>;
}

export default function SkillsAnalysisSection({
  overallSummary,
  totalPopulation,
  skillLabels,
  SKILL_NAMES_EN,
}: SkillsAnalysisSectionProps) {
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

  // Calculate skill categories
  const technicalSkills = [
    "CARPENTERY_RELATED",
    "PLUMBING",
    "ELECTRICITY_INSTALLMENT_RELATED",
    "MECHANICS_RELATED",
    "FURNITURE_RELATED",
    "RADIO_TELEVISION_ELECTRICAL_REPAIR",
  ];
  const professionalSkills = [
    "TEACHING_RELATED",
    "HUMAN_HEALTH_RELATED",
    "ANIMAL_HEALTH_RELATED",
    "COMPUTER_SCIENCE_RELATED",
    "ENGINEERING_DESIGN_RELATED",
    "LAND_SURVEY_RELATED",
  ];
  const agriculturalSkills = ["AGRICULTURE_RELATED"];
  const serviceSkills = [
    "HOTEL_RESTAURANT_RELATED",
    "DRIVING_RELATED",
    "BEUATICIAN_RELATED",
  ];
  const artisanSkills = [
    "PHOTOGRAPHY_RELATED",
    "HANDICRAFT_RELATED",
    "MUSIC_DRAMA_RELATED",
    "STONEWORK_WOODWORK",
    "PRINTING_RELATED",
    "SHOEMAKING_RELATED",
    "SEWING_RELATED",
    "JWELLERY_MAKING_RELATED",
    "LITERARY_CREATION_RELATED",
  ];

  // Calculate population by skill category
  const technicalPopulation = overallSummary
    .filter((item) => technicalSkills.includes(item.skill))
    .reduce((sum, item) => sum + item.population, 0);

  const professionalPopulation = overallSummary
    .filter((item) => professionalSkills.includes(item.skill))
    .reduce((sum, item) => sum + item.population, 0);

  const agriculturalPopulation = overallSummary
    .filter((item) => agriculturalSkills.includes(item.skill))
    .reduce((sum, item) => sum + item.population, 0);

  const servicePopulation = overallSummary
    .filter((item) => serviceSkills.includes(item.skill))
    .reduce((sum, item) => sum + item.population, 0);

  const artisanPopulation = overallSummary
    .filter((item) => artisanSkills.includes(item.skill))
    .reduce((sum, item) => sum + item.population, 0);

  const otherPopulation =
    totalPopulation -
    technicalPopulation -
    professionalPopulation -
    agriculturalPopulation -
    servicePopulation -
    artisanPopulation;

  // Calculate top two skills ratio if both exist
  const topSkill = overallSummary[0];
  const secondSkill = overallSummary[1];

  const topTwoSkillRatio =
    topSkill && secondSkill && secondSkill.population > 0
      ? (topSkill.population / secondSkill.population).toFixed(2)
      : "N/A";

  // Add SEO-friendly data attributes to enhance crawler understanding
  useEffect(() => {
    // Add data to document.body for SEO (will be crawled but not visible to users)
    if (document && document.body) {
      document.body.setAttribute(
        "data-municipality",
        "Khajura Rural Municipality / गढवा गाउँपालिका",
      );
      document.body.setAttribute(
        "data-total-skilled-population",
        totalPopulation.toString(),
      );

      // Add main skill data
      if (topSkill) {
        const skillNameEN = SKILL_NAMES_EN[topSkill.skill] || topSkill.skill;
        document.body.setAttribute(
          "data-main-skill",
          `${skillNameEN} / ${topSkill.skillName}`,
        );
        document.body.setAttribute(
          "data-main-skill-population",
          topSkill.population.toString(),
        );
        document.body.setAttribute(
          "data-main-skill-percentage",
          ((topSkill.population / totalPopulation) * 100).toFixed(2),
        );
      }

      // Add skill category data
      document.body.setAttribute(
        "data-technical-skills-percentage",
        ((technicalPopulation / totalPopulation) * 100).toFixed(2),
      );
      document.body.setAttribute(
        "data-professional-skills-percentage",
        ((professionalPopulation / totalPopulation) * 100).toFixed(2),
      );
      document.body.setAttribute(
        "data-agricultural-skills-percentage",
        ((agriculturalPopulation / totalPopulation) * 100).toFixed(2),
      );
      document.body.setAttribute(
        "data-service-skills-percentage",
        ((servicePopulation / totalPopulation) * 100).toFixed(2),
      );
      document.body.setAttribute(
        "data-artisan-skills-percentage",
        ((artisanPopulation / totalPopulation) * 100).toFixed(2),
      );
    }
  }, [
    overallSummary,
    totalPopulation,
    topSkill,
    technicalPopulation,
    professionalPopulation,
    agriculturalPopulation,
    servicePopulation,
    artisanPopulation,
    SKILL_NAMES_EN,
  ]);

  return (
    <>
      <div className="mt-6 flex flex-wrap gap-4 justify-center">
        {overallSummary.slice(0, 6).map((item, index) => {
          // Calculate percentage
          const percentage = (
            (item.population / totalPopulation) *
            100
          ).toFixed(2);

          return (
            <div
              key={index}
              className="bg-muted/50 rounded-lg p-4 text-center min-w-[200px] relative overflow-hidden"
              // Add data attributes for SEO crawlers
              data-skill={`${SKILL_NAMES_EN[item.skill] || item.skill} / ${item.skillName}`}
              data-population={item.population}
              data-percentage={percentage}
            >
              <div
                className="absolute bottom-0 left-0 right-0"
                style={{
                  height: `${Math.min(
                    (item.population / overallSummary[0].population) * 100,
                    100,
                  )}%`,
                  backgroundColor:
                    SKILL_COLORS[item.skill as keyof typeof SKILL_COLORS] ||
                    "#888",
                  opacity: 0.2,
                  zIndex: 0,
                }}
              />
              <div className="relative z-10">
                <h3 className="text-lg font-medium mb-2">
                  {item.skillName}
                  {/* Hidden span for SEO with English name */}
                  <span className="sr-only">
                    {SKILL_NAMES_EN[item.skill] || item.skill}
                  </span>
                </h3>
                <p className="text-2xl font-bold">
                  {localizeNumber(percentage, "ne")}%
                </p>
                <p className="text-sm text-muted-foreground">
                  {localizeNumber(item.population.toLocaleString(), "ne")}{" "}
                  व्यक्ति
                  <span className="sr-only">
                    ({item.population.toLocaleString()} people)
                  </span>
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-muted/50 p-4 rounded-lg mt-8">
        <h3 className="text-xl font-medium mb-4">
          सीप वर्गीकरण विश्लेषण
          <span className="sr-only">
            Skills Classification Analysis of Khajura
          </span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            className="bg-card p-4 rounded border"
            data-analysis-type="top-skill"
            data-skill-name={topSkill?.skill}
            data-skill-percentage={
              topSkill
                ? ((topSkill.population / totalPopulation) * 100).toFixed(2)
                : "0"
            }
          >
            <h4 className="font-medium mb-2">
              प्रमुख सीप
              <span className="sr-only">
                Main Skill in Khajura Rural Municipality
              </span>
            </h4>
            <p className="text-3xl font-bold">
              {topSkill ? topSkill.skillName : "-"}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {topSkill
                ? `कुल दक्ष जनसंख्याको ${localizeNumber(((topSkill.population / totalPopulation) * 100).toFixed(2), "ne")}% व्यक्ति`
                : ""}
              <span className="sr-only">
                {topSkill
                  ? `${((topSkill.population / totalPopulation) * 100).toFixed(2)}% of total skilled population in Khajura Rural Municipality`
                  : ""}
              </span>
            </p>
          </div>

          <div
            className="bg-card p-4 rounded border"
            data-analysis-type="skill-ratio"
            data-ratio={topTwoSkillRatio}
            data-primary-skill={topSkill?.skill}
            data-secondary-skill={secondSkill?.skill}
          >
            <h4 className="font-medium mb-2">
              प्रमुख-दोस्रो सीप अनुपात
              <span className="sr-only">
                Primary to Secondary Skill Ratio in Khajura
              </span>
            </h4>
            <p className="text-3xl font-bold">
              {localizeNumber(topTwoSkillRatio, "ne")}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {topSkill && secondSkill
                ? `हरेक ${localizeNumber(topTwoSkillRatio, "ne")} ${topSkill.skillName} सीप भएका व्यक्तिका लागि १ ${secondSkill.skillName} सीप भएका व्यक्ति`
                : ""}
              <span className="sr-only">
                {topSkill && secondSkill
                  ? `For every ${topTwoSkillRatio} people with ${SKILL_NAMES_EN[topSkill.skill]} skills, there is 1 person with ${SKILL_NAMES_EN[secondSkill.skill]} skills in Khajura Rural Municipality`
                  : ""}
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="bg-muted/50 p-4 rounded-lg mt-4">
        <h4 className="font-medium mb-4">
          सीप क्षेत्र अनुसार वितरण
          <span className="sr-only">Distribution by Skill Categories</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card p-3 rounded border">
            <h5 className="text-sm font-medium">प्राविधिक सीप</h5>
            <p className="text-sm flex justify-between">
              <span>
                {localizeNumber(technicalPopulation.toLocaleString(), "ne")}{" "}
                व्यक्ति
              </span>
              <span className="font-medium">
                {localizeNumber(
                  ((technicalPopulation / totalPopulation) * 100).toFixed(1),
                  "ne",
                )}
                %
              </span>
            </p>
            <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
              <div
                className="h-full rounded-full bg-blue-500"
                style={{
                  width: `${(technicalPopulation / totalPopulation) * 100}%`,
                }}
              ></div>
            </div>
          </div>

          <div className="bg-card p-3 rounded border">
            <h5 className="text-sm font-medium">पेशागत सीप</h5>
            <p className="text-sm flex justify-between">
              <span>
                {localizeNumber(professionalPopulation.toLocaleString(), "ne")}{" "}
                व्यक्ति
              </span>
              <span className="font-medium">
                {localizeNumber(
                  ((professionalPopulation / totalPopulation) * 100).toFixed(1),
                  "ne",
                )}
                %
              </span>
            </p>
            <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
              <div
                className="h-full rounded-full bg-purple-500"
                style={{
                  width: `${(professionalPopulation / totalPopulation) * 100}%`,
                }}
              ></div>
            </div>
          </div>

          <div className="bg-card p-3 rounded border">
            <h5 className="text-sm font-medium">कृषि सम्बन्धी सीप</h5>
            <p className="text-sm flex justify-between">
              <span>
                {localizeNumber(agriculturalPopulation.toLocaleString(), "ne")}{" "}
                व्यक्ति
              </span>
              <span className="font-medium">
                {localizeNumber(
                  ((agriculturalPopulation / totalPopulation) * 100).toFixed(1),
                  "ne",
                )}
                %
              </span>
            </p>
            <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
              <div
                className="h-full rounded-full bg-green-500"
                style={{
                  width: `${(agriculturalPopulation / totalPopulation) * 100}%`,
                }}
              ></div>
            </div>
          </div>

          <div className="bg-card p-3 rounded border">
            <h5 className="text-sm font-medium">सेवा सम्बन्धी सीप</h5>
            <p className="text-sm flex justify-between">
              <span>
                {localizeNumber(servicePopulation.toLocaleString(), "ne")}{" "}
                व्यक्ति
              </span>
              <span className="font-medium">
                {localizeNumber(
                  ((servicePopulation / totalPopulation) * 100).toFixed(1),
                  "ne",
                )}
                %
              </span>
            </p>
            <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
              <div
                className="h-full rounded-full bg-orange-500"
                style={{
                  width: `${(servicePopulation / totalPopulation) * 100}%`,
                }}
              ></div>
            </div>
          </div>

          <div className="bg-card p-3 rounded border">
            <h5 className="text-sm font-medium">हस्तकला तथा कला सम्बन्धी</h5>
            <p className="text-sm flex justify-between">
              <span>
                {localizeNumber(artisanPopulation.toLocaleString(), "ne")}{" "}
                व्यक्ति
              </span>
              <span className="font-medium">
                {localizeNumber(
                  ((artisanPopulation / totalPopulation) * 100).toFixed(1),
                  "ne",
                )}
                %
              </span>
            </p>
            <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
              <div
                className="h-full rounded-full bg-pink-500"
                style={{
                  width: `${(artisanPopulation / totalPopulation) * 100}%`,
                }}
              ></div>
            </div>
          </div>

          <div className="bg-card p-3 rounded border">
            <h5 className="text-sm font-medium">अन्य</h5>
            <p className="text-sm flex justify-between">
              <span>
                {localizeNumber(otherPopulation.toLocaleString(), "ne")} व्यक्ति
              </span>
              <span className="font-medium">
                {localizeNumber(
                  ((otherPopulation / totalPopulation) * 100).toFixed(1),
                  "ne",
                )}
                %
              </span>
            </p>
            <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
              <div
                className="h-full rounded-full bg-gray-500"
                style={{
                  width: `${(otherPopulation / totalPopulation) * 100}%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
