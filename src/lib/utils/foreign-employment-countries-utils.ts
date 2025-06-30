import { ForeignEmploymentCountryEnum, type ForeignEmploymentCountryType, foreignEmploymentCountryOptions } from "@/server/api/routers/profile/economics/ward-wise-foreign-employment-countries.schema";

export interface ForeignEmploymentCountriesData {
  id: string;
  wardNumber: number;
  country: ForeignEmploymentCountryType;
  population: number;
}

export interface ProcessedForeignEmploymentCountriesData {
  totalForeignEmploymentPopulation: number;
  countryData: Record<string, {
    population: number;
    percentage: number;
    label: string;
    rank: number;
  }>;
  displayCountryData: Record<string, {
    population: number;
    percentage: number;
    label: string;
    rank: number;
  }>;
  wardData: Record<number, {
    totalForeignEmploymentPopulation: number;
    countries: Record<string, number>;
    primaryCountry: string;
    primaryCountryPercentage: number;
    countryCount: number;
  }>;
  topCountries: Array<{
    country: string;
    population: number;
    percentage: number;
    label: string;
  }>;
  regionalDistribution: {
    gulf: number;
    southeastAsia: number;
    europe: number;
    america: number;
    other: number;
  };
  countryCriticalScores: {
    diversityScore: number;
    concentrationScore: number;
    regionalBalanceScore: number;
    vulnerabilityScore: number;
    opportunityScore: number;
  };
  countryInsights: string[];
}

// Create a mapping from the schema options
export const FOREIGN_EMPLOYMENT_COUNTRY_LABELS: Record<string, string> = Object.fromEntries(
  foreignEmploymentCountryOptions.map(option => [option.value, option.label])
);

export const COUNTRY_REGIONS: Record<string, string[]> = {
  gulf: ["SAUDI_ARABIA", "QATAR", "UNITED_ARAB_EMIRATES", "KUWAIT", "OMAN", "BAHRAIN"],
  southeastAsia: ["MALAYSIA", "SINGAPORE", "THAILAND", "JAPAN", "SOUTH_KOREA", "INDIA", "CHINA"],
  europe: ["UNITED_KINGDOM_OF_GREAT_BRITAIN", "ROMANIA", "GERMANY", "FRANCE", "ITALY", "SPAIN"],
  america: ["UNITED_STATES_OF_AMERICA", "CANADA", "BRAZIL", "ARGENTINA", "MEXICO"],
  other: ["AUSTRALIA", "NEW_ZEALAND", "SOUTH_AFRICA", "MAURITIUS", "DUBAI", "OTHER"],
};

export function processForeignEmploymentCountriesData(rawData: ForeignEmploymentCountriesData[]): ProcessedForeignEmploymentCountriesData {
  if (!rawData || rawData.length === 0) {
    return {
      totalForeignEmploymentPopulation: 0,
      countryData: {},
      displayCountryData: {},
      wardData: {},
      topCountries: [],
      regionalDistribution: {
        gulf: 0,
        southeastAsia: 0,
        europe: 0,
        america: 0,
        other: 0,
      },
      countryCriticalScores: {
        diversityScore: 0,
        concentrationScore: 0,
        regionalBalanceScore: 0,
        vulnerabilityScore: 0,
        opportunityScore: 0,
      },
      countryInsights: [],
    };
  }

  // Calculate total foreign employment population
  const totalForeignEmploymentPopulation = rawData.reduce((sum, item) => sum + (item.population || 0), 0);

  // Process country data
  const countryData: Record<string, any> = {};
  const allCountries: Array<any> = [];

  rawData.forEach((item) => {
    if (!countryData[item.country]) {
      countryData[item.country] = {
        population: 0,
        percentage: 0,
        label: FOREIGN_EMPLOYMENT_COUNTRY_LABELS[item.country] || item.country,
        rank: 0,
      };
    }
    countryData[item.country].population += item.population;
  });

  // Calculate percentages and build allCountries array
  Object.entries(countryData).forEach(([country, data]) => {
    data.percentage = totalForeignEmploymentPopulation > 0 ? (data.population / totalForeignEmploymentPopulation) * 100 : 0;
    allCountries.push({
      country,
      ...data,
    });
  });

  // Sort countries by population
  allCountries.sort((a, b) => b.population - a.population);
  allCountries.forEach((country, index) => {
    countryData[country.country].rank = index + 1;
  });

  // Top 10 countries for display
  const topCountries = allCountries.slice(0, 10).map(country => ({
    country: country.country,
    population: country.population,
    percentage: country.percentage,
    label: country.label,
  }));

  // Aggregate others
  const otherCountries = allCountries.slice(10);
  const otherPopulation = otherCountries.reduce((sum, c) => sum + c.population, 0);
  const otherPercentage = totalForeignEmploymentPopulation > 0 ? (otherPopulation / totalForeignEmploymentPopulation) * 100 : 0;

  // Build displayCountryData (top 10 + other)
  const displayCountryData: Record<string, any> = {};
  topCountries.forEach((c, i) => {
    displayCountryData[c.country] = {
      population: c.population,
      percentage: c.percentage,
      label: c.label,
      rank: i + 1,
    };
  });
  if (otherPopulation > 0) {
    displayCountryData["OTHER"] = {
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
    const wardTotalForeignEmploymentPopulation = wardItems.reduce((sum, item) => sum + item.population, 0);
    const wardCountries: Record<string, number> = {};
    wardItems.forEach(item => {
      if (wardCountries[item.country]) {
        wardCountries[item.country] += item.population;
      } else {
        wardCountries[item.country] = item.population;
      }
    });
    // Find primary country for this ward
    const sortedWardCountries = Object.entries(wardCountries).sort(([, a], [, b]) => b - a);
    const primaryCountry = sortedWardCountries[0]?.[0] || '';
    const primaryCountryPercentage = wardTotalForeignEmploymentPopulation > 0 
      ? (sortedWardCountries[0]?.[1] || 0) / wardTotalForeignEmploymentPopulation * 100 
      : 0;
    wardData[wardNum] = {
      totalForeignEmploymentPopulation: wardTotalForeignEmploymentPopulation,
      countries: wardCountries,
      primaryCountry,
      primaryCountryPercentage,
      countryCount: Object.keys(wardCountries).length,
    };
  });

  // Calculate regional distribution
  const regionalDistribution = {
    gulf: 0,
    southeastAsia: 0,
    europe: 0,
    america: 0,
    other: 0,
  };
  Object.entries(countryData).forEach(([country, data]) => {
    if (COUNTRY_REGIONS.gulf.includes(country)) {
      regionalDistribution.gulf += data.population;
    } else if (COUNTRY_REGIONS.southeastAsia.includes(country)) {
      regionalDistribution.southeastAsia += data.population;
    } else if (COUNTRY_REGIONS.europe.includes(country)) {
      regionalDistribution.europe += data.population;
    } else if (COUNTRY_REGIONS.america.includes(country)) {
      regionalDistribution.america += data.population;
    } else {
      regionalDistribution.other += data.population;
    }
  });

  // Calculate critical scores
  const diversityScore = (Object.keys(countryData).length / 50) * 100; // 50+ countries possible
  const concentrationScore = allCountries[0]?.percentage || 0;
  const regionalBalanceScore = 100 - Math.abs(regionalDistribution.gulf - regionalDistribution.southeastAsia);
  const vulnerabilityScore = concentrationScore > 40 ? 100 - concentrationScore : 80;
  const opportunityScore = diversityScore > 60 ? diversityScore : 50;

  // Generate insights
  const countryInsights: string[] = [];
  if (concentrationScore > 40) countryInsights.push("एक देशमा अत्यधिक निर्भरता छ, विविधता आवश्यक छ।");
  if (diversityScore > 60) countryInsights.push("देशहरूको विविधता राम्रो छ, अवसरहरू धेरै छन्।");
  if (regionalBalanceScore < 60) countryInsights.push("क्षेत्रीय असन्तुलन छ, नयाँ बजार खोज्नुपर्छ।");
  if (vulnerabilityScore < 50) countryInsights.push("आर्थिक जोखिम उच्च छ, विविधता बढाउनु आवश्यक छ।");
  if (opportunityScore > 70) countryInsights.push("नयाँ देशहरूमा रोजगारीको अवसर विस्तार गर्न सकिन्छ।");

  return {
    totalForeignEmploymentPopulation,
    countryData,
    displayCountryData,
    wardData,
    topCountries,
    regionalDistribution,
    countryCriticalScores: {
      diversityScore,
      concentrationScore,
      regionalBalanceScore,
      vulnerabilityScore,
      opportunityScore,
    },
    countryInsights,
  };
}

export function generateForeignEmploymentCountriesAnalysis(data: ProcessedForeignEmploymentCountriesData): string {
  if (data.totalForeignEmploymentPopulation === 0) {
    return "वैदेशिक रोजगारी देश सम्बन्धी तथ्याङ्क उपलब्ध छैन।";
  }
  const analysisParts: string[] = [];
  // Overall summary
  analysisParts.push(
    `केराबारी गाउँपालिकामा कुल ${convertToNepaliNumber(data.totalForeignEmploymentPopulation)} जना वैदेशिक रोजगारीमा रहेका छन्। यी तथ्याङ्कले गाउँपालिकाको आर्थिक, सामाजिक र क्षेत्रीय विविधता, जोखिम र अवसरहरूको विस्तृत चित्र प्रस्तुत गर्दछ।`
  );
  // Top countries
  analysisParts.push(
    `शीर्ष १० देशहरूमा रोजगारीमा गएका जनसंख्या: ${data.topCountries.map((c, i) => `${convertToNepaliNumber(i+1)}. ${c.label} (${convertToNepaliNumber(c.population)} जना, ${formatNepaliPercentage(c.percentage)})`).join(', ')}। अन्य देशहरूमा जम्मा ${convertToNepaliNumber(data.displayCountryData.OTHER?.population || 0)} (${formatNepaliPercentage(data.displayCountryData.OTHER?.percentage || 0)}) जना रहेका छन्।`
  );
  // Country diversity and concentration
  analysisParts.push(
    `देशहरूको विविधता स्कोर: ${convertToNepaliNumber(Math.round(data.countryCriticalScores.diversityScore * 10) / 10)}। प्रमुख देशमा निर्भरता स्कोर: ${convertToNepaliNumber(Math.round(data.countryCriticalScores.concentrationScore * 10) / 10)}%।`
  );
  // Regional distribution
  const regions = data.regionalDistribution;
  const totalInRegions = regions.gulf + regions.southeastAsia + regions.europe + regions.america + regions.other;
  if (totalInRegions > 0) {
    const gulfPercentage = (regions.gulf / totalInRegions) * 100;
    const southeastAsiaPercentage = (regions.southeastAsia / totalInRegions) * 100;
    const europePercentage = (regions.europe / totalInRegions) * 100;
    const americaPercentage = (regions.america / totalInRegions) * 100;
    analysisParts.push(
      `क्षेत्रीय वितरण: खाडी देशहरूमा ${convertToNepaliNumber(regions.gulf)} (${formatNepaliPercentage(gulfPercentage)}), दक्षिण पूर्व एसियामा ${convertToNepaliNumber(regions.southeastAsia)} (${formatNepaliPercentage(southeastAsiaPercentage)}), युरोपमा ${convertToNepaliNumber(regions.europe)} (${formatNepaliPercentage(europePercentage)}), अमेरिकामा ${convertToNepaliNumber(regions.america)} (${formatNepaliPercentage(americaPercentage)}), अन्यमा ${convertToNepaliNumber(regions.other)} (${formatNepaliPercentage(100 - (gulfPercentage + southeastAsiaPercentage + europePercentage + americaPercentage))}) जना।`
    );
  }
  // Ward-wise
  if (Object.keys(data.wardData).length > 0) {
    const wardEntries = Object.entries(data.wardData);
    const highestWard = wardEntries.reduce((max, [wardNum, wardData]) => 
      wardData.totalForeignEmploymentPopulation > max.totalForeignEmploymentPopulation ? { wardNum: parseInt(wardNum), ...wardData } : max
    , { wardNum: 0, totalForeignEmploymentPopulation: 0, countries: {}, primaryCountry: '', primaryCountryPercentage: 0, countryCount: 0 });
    const lowestWard = wardEntries.reduce((min, [wardNum, wardData]) => 
      wardData.totalForeignEmploymentPopulation < min.totalForeignEmploymentPopulation ? { wardNum: parseInt(wardNum), ...wardData } : min
    , { wardNum: 0, totalForeignEmploymentPopulation: Infinity, countries: {}, primaryCountry: '', primaryCountryPercentage: 0, countryCount: 0 });
    analysisParts.push(
      `वडागत विश्लेषण: वडा नं. ${convertToNepaliNumber(highestWard.wardNum)} मा सबैभन्दा बढी (${convertToNepaliNumber(highestWard.totalForeignEmploymentPopulation)}) जना, वडा नं. ${convertToNepaliNumber(lowestWard.wardNum)} मा सबैभन्दा कम (${convertToNepaliNumber(lowestWard.totalForeignEmploymentPopulation)}) जना वैदेशिक रोजगारीमा रहेका छन्।`
    );
  }
  // Critical insights
  if (data.countryInsights.length > 0) {
    analysisParts.push(`महत्त्वपूर्ण अन्तर्दृष्टि: ${data.countryInsights.join(' ')}।`);
  }
  // Policy recommendations
  analysisParts.push(
    `नीतिगत सिफारिस: रोजगारीको विविधता बढाउने, नयाँ देशहरूमा अवसर खोज्ने, प्रमुख देशमा निर्भरता घटाउने, क्षेत्रीय सन्तुलन कायम गर्ने, जोखिम न्यूनीकरणका उपायहरू अवलम्बन गर्ने।`
  );
  return analysisParts.join(' ');
}

export function convertToNepaliNumber(num: number): string {
  const nepaliDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
  return num.toString().replace(/\d/g, (digit) => nepaliDigits[parseInt(digit)]);
}

export function formatNepaliPercentage(percentage: number): string {
  return `${convertToNepaliNumber(Math.round(percentage * 10) / 10)}%`;
} 