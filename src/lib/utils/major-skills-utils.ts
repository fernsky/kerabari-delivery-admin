import { skillTypeEnum, type SkillType, skillLabels } from "@/server/api/routers/profile/economics/ward-wise-major-skills.schema";

export interface MajorSkillsData {
  id: string;
  wardNumber: number;
  skill: SkillType;
  population: number;
}

export interface ProcessedMajorSkillsData {
  totalSkilledPopulation: number;
  skillData: Record<string, {
    population: number;
    percentage: number;
    label: string;
    rank: number;
  }>;
  displaySkillData: Record<string, {
    population: number;
    percentage: number;
    label: string;
    rank: number;
  }>;
  wardData: Record<number, {
    totalSkilledPopulation: number;
    skills: Record<string, number>;
    primarySkill: string;
    primarySkillPercentage: number;
    skillCount: number;
  }>;
  skillCategories: {
    technical: number;
    agricultural: number;
    service: number;
    manufacturing: number;
    other: number;
  };
  topSkills: Array<{
    skill: string;
    population: number;
    percentage: number;
    label: string;
  }>;
}

export const MAJOR_SKILLS_LABELS: Record<string, string> = skillLabels;

export const SKILL_CATEGORIES: Record<string, string[]> = {
  technical: ["CARPENTERY_RELATED", "PLUMBING", "ELECTRICITY_INSTALLMENT_RELATED", "MECHANICS_RELATED", "COMPUTER_SCIENCE_RELATED", "ENGINEERING_DESIGN_RELATED", "RADIO_TELEVISION_ELECTRICAL_REPAIR"],
  agricultural: ["AGRICULTURE_RELATED", "ANIMAL_HEALTH_RELATED"],
  service: ["TEACHING_RELATED", "HUMAN_HEALTH_RELATED", "HOTEL_RESTAURANT_RELATED", "DRIVING_RELATED", "BEUATICIAN_RELATED", "SELF_PROTECTION_RELATED", "LITERARY_CREATION_RELATED"],
  manufacturing: ["FURNITURE_RELATED", "SHOEMAKING_RELATED", "SEWING_RELATED", "JWELLERY_MAKING_RELATED"],
  other: ["PHOTOGRAPHY_RELATED", "HANDICRAFT_RELATED", "MUSIC_DRAMA_RELATED", "STONEWORK_WOODWORK", "PRINTING_RELATED", "LAND_SURVEY_RELATED", "OTHER", "NONE"],
};

export function processMajorSkillsData(rawData: MajorSkillsData[]): ProcessedMajorSkillsData {
  if (!rawData || rawData.length === 0) {
    return {
      totalSkilledPopulation: 0,
      skillData: {},
      displaySkillData: {},
      wardData: {},
      skillCategories: {
        technical: 0,
        agricultural: 0,
        service: 0,
        manufacturing: 0,
        other: 0,
      },
      topSkills: [],
    };
  }

  // Calculate total skilled population
  const totalSkilledPopulation = rawData.reduce((sum, item) => sum + (item.population || 0), 0);

  // Process skill data
  const skillData: Record<string, any> = {};
  const allSkills: Array<any> = [];

  rawData.forEach((item, index) => {
    const percentage = totalSkilledPopulation > 0 ? (item.population / totalSkilledPopulation) * 100 : 0;
    const skillInfo = {
      population: item.population,
      percentage,
      label: MAJOR_SKILLS_LABELS[item.skill] || item.skill,
      rank: index + 1,
    };

    if (skillData[item.skill]) {
      skillData[item.skill].population += item.population;
      skillData[item.skill].percentage = totalSkilledPopulation > 0 ? (skillData[item.skill].population / totalSkilledPopulation) * 100 : 0;
    } else {
      skillData[item.skill] = skillInfo;
      allSkills.push({
        skill: item.skill,
        ...skillInfo,
      });
    }
  });

  // Sort skills by population
  allSkills.sort((a, b) => b.population - a.population);

  // Update ranks after sorting
  allSkills.forEach((skill, index) => {
    skillData[skill.skill].rank = index + 1;
  });

  // Top 10 skills for display
  const topSkills = allSkills.slice(0, 10).map(skill => ({
    skill: skill.skill,
    population: skill.population,
    percentage: skill.percentage,
    label: skill.label,
  }));

  // Aggregate others
  const otherSkills = allSkills.slice(10);
  const otherPopulation = otherSkills.reduce((sum, s) => sum + s.population, 0);
  const otherPercentage = totalSkilledPopulation > 0 ? (otherPopulation / totalSkilledPopulation) * 100 : 0;

  // Build displaySkillData (top 10 + other)
  const displaySkillData: Record<string, any> = {};
  topSkills.forEach((s, i) => {
    displaySkillData[s.skill] = {
      population: s.population,
      percentage: s.percentage,
      label: s.label,
      rank: i + 1,
    };
  });
  if (otherPopulation > 0) {
    displaySkillData["OTHER"] = {
      population: otherPopulation,
      percentage: otherPercentage,
      label: "अन्य",
      rank: 11,
    };
  }

  // Process ward data
  const wardData: Record<number, any> = {};
  const uniqueWards = Array.from(new Set(rawData.map(item => item.wardNumber))).sort((a, b) => a - b);
  
  uniqueWards.forEach(wardNum => {
    const wardItems = rawData.filter(item => item.wardNumber === wardNum);
    const wardTotalSkilledPopulation = wardItems.reduce((sum, item) => sum + item.population, 0);
    const wardSkills: Record<string, number> = {};
    
    wardItems.forEach(item => {
      if (wardSkills[item.skill]) {
        wardSkills[item.skill] += item.population;
      } else {
        wardSkills[item.skill] = item.population;
      }
    });

    // Find primary skill for this ward
    const sortedWardSkills = Object.entries(wardSkills).sort(([, a], [, b]) => b - a);
    const primarySkill = sortedWardSkills[0]?.[0] || '';
    const primarySkillPercentage = wardTotalSkilledPopulation > 0 
      ? (sortedWardSkills[0]?.[1] || 0) / wardTotalSkilledPopulation * 100 
      : 0;

    wardData[wardNum] = {
      totalSkilledPopulation: wardTotalSkilledPopulation,
      skills: wardSkills,
      primarySkill,
      primarySkillPercentage,
      skillCount: Object.keys(wardSkills).length,
    };
  });

  // Calculate skill categories
  const skillCategories = {
    technical: 0,
    agricultural: 0,
    service: 0,
    manufacturing: 0,
    other: 0,
  };

  Object.entries(skillData).forEach(([skill, data]) => {
    if (SKILL_CATEGORIES.technical.includes(skill)) {
      skillCategories.technical += data.population;
    } else if (SKILL_CATEGORIES.agricultural.includes(skill)) {
      skillCategories.agricultural += data.population;
    } else if (SKILL_CATEGORIES.service.includes(skill)) {
      skillCategories.service += data.population;
    } else if (SKILL_CATEGORIES.manufacturing.includes(skill)) {
      skillCategories.manufacturing += data.population;
    } else {
      skillCategories.other += data.population;
    }
  });

  return {
    totalSkilledPopulation,
    skillData,
    displaySkillData,
    wardData,
    skillCategories,
    topSkills,
  };
}

export function generateMajorSkillsAnalysis(data: ProcessedMajorSkillsData): string {
  if (data.totalSkilledPopulation === 0) {
    return "प्रमुख सीप सम्बन्धी तथ्याङ्क उपलब्ध छैन।";
  }

  const analysisParts: string[] = [];

  // Overall summary
  analysisParts.push(
    `गाउँपालिकामा कुल ${convertToNepaliNumber(data.totalSkilledPopulation)} जनाको प्रमुख सीप रहेको छ।`
  );

  // Top skills analysis
  if (data.topSkills.length > 0) {
    const topSkill = data.topSkills[0];
    analysisParts.push(
      `सबैभन्दा बढी जनाको सीप ${topSkill.label} रहेको छ जसमा ${convertToNepaliNumber(topSkill.population)} जना (${formatNepaliPercentage(topSkill.percentage)}) समावेश छन्।`
    );

    if (data.topSkills.length > 1) {
      const secondSkill = data.topSkills[1];
      analysisParts.push(
        `दोस्रो स्थानमा ${secondSkill.label} सीप रहेको छ जसमा ${convertToNepaliNumber(secondSkill.population)} जना (${formatNepaliPercentage(secondSkill.percentage)}) समावेश छन्।`
      );
    }
  }

  // Skill categories analysis
  const categories = data.skillCategories;
  const totalInCategories = categories.technical + categories.agricultural + categories.service + categories.manufacturing + categories.other;
  
  if (totalInCategories > 0) {
    const technicalPercentage = (categories.technical / totalInCategories) * 100;
    const agriculturalPercentage = (categories.agricultural / totalInCategories) * 100;
    const servicePercentage = (categories.service / totalInCategories) * 100;

    analysisParts.push(
      `सीपको वर्गीकरण अनुसार, ताम्कनीकी सीपमा ${convertToNepaliNumber(categories.technical)} जना (${formatNepaliPercentage(technicalPercentage)}), कृषि सीपमा ${convertToNepaliNumber(categories.agricultural)} जना (${formatNepaliPercentage(agriculturalPercentage)}), र सेवा क्षेत्रमा ${convertToNepaliNumber(categories.service)} जना (${formatNepaliPercentage(servicePercentage)}) समावेश छन्।`
    );
  }

  // Ward-wise analysis
  if (Object.keys(data.wardData).length > 0) {
    const wardEntries = Object.entries(data.wardData);
    const highestWard = wardEntries.reduce((max, [wardNum, wardData]) => 
      wardData.totalSkilledPopulation > max.totalSkilledPopulation ? { wardNum: parseInt(wardNum), ...wardData } : max
    , { wardNum: 0, totalSkilledPopulation: 0, skills: {}, primarySkill: '', primarySkillPercentage: 0, skillCount: 0 });
    
    const lowestWard = wardEntries.reduce((min, [wardNum, wardData]) => 
      wardData.totalSkilledPopulation < min.totalSkilledPopulation ? { wardNum: parseInt(wardNum), ...wardData } : min
    , { wardNum: 0, totalSkilledPopulation: Infinity, skills: {}, primarySkill: '', primarySkillPercentage: 0, skillCount: 0 });

    analysisParts.push(
      `वडाको आधारमा हेर्दा, वडा नं. ${convertToNepaliNumber(highestWard.wardNum)} मा सबैभन्दा बढी ${convertToNepaliNumber(highestWard.totalSkilledPopulation)} जनाको सीप रहेको छ भने वडा नं. ${convertToNepaliNumber(lowestWard.wardNum)} मा सबैभन्दा कम ${convertToNepaliNumber(lowestWard.totalSkilledPopulation)} जनाको सीप रहेको छ।`
    );
  }

  // Additional insights
  analysisParts.push(
    "यो तथ्याङ्कले गाउँपालिकाको मानव संसाधनको सीप र क्षमताको वितरणलाई प्रतिनिधित्व गर्दछ र स्थानीय आर्थिक विकासका लागि उपलब्ध सीपको मूल्याङ्कन गर्न सहयोग गर्दछ।"
  );

  return analysisParts.join(" ");
}

export function convertToNepaliNumber(num: number): string {
  const nepaliDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
  return num.toString().replace(/\d/g, (digit) => nepaliDigits[parseInt(digit)]);
}

export function formatNepaliPercentage(percentage: number): string {
  return `${convertToNepaliNumber(Math.round(percentage * 10) / 10)}%`;
} 