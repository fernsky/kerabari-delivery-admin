import { ForeignEmploymentCountryEnum, type ForeignEmploymentCountryType } from "@/server/api/routers/profile/economics/ward-wise-foreign-employment-countries.schema";

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
}

export const FOREIGN_EMPLOYMENT_COUNTRY_LABELS: Record<string, string> = {
  SAUDI_ARABIA: "साउदी अरब",
  QATAR: "कतार",
  UNITED_ARAB_EMIRATES: "संयुक्त अरब इमिरेट्स",
  KUWAIT: "कुवेत",
  OMAN: "ओमान",
  BAHRAIN: "बहराइन",
  MALAYSIA: "मलेसिया",
  SINGAPORE: "सिङ्गापुर",
  THAILAND: "थाइल्यान्ड",
  JAPAN: "जापान",
  SOUTH_KOREA: "दक्षिण कोरिया",
  INDIA: "भारत",
  CHINA: "चीन",
  UNITED_KINGDOM_OF_GREAT_BRITAIN: "संयुक्त राज्य",
  UNITED_STATES_OF_AMERICA: "अमेरिका",
  CANADA: "क्यानाडा",
  AUSTRALIA: "अस्ट्रेलिया",
  NEW_ZEALAND: "न्युजिल्यान्ड",
  OTHER: "अन्य",
};

export const COUNTRY_REGIONS: Record<string, string[]> = {
  gulf: ["SAUDI_ARABIA", "QATAR", "UNITED_ARAB_EMIRATES", "KUWAIT", "OMAN", "BAHRAIN"],
  southeastAsia: ["MALAYSIA", "SINGAPORE", "THAILAND", "JAPAN", "SOUTH_KOREA", "INDIA", "CHINA"],
  europe: ["UNITED_KINGDOM_OF_GREAT_BRITAIN"],
  america: ["UNITED_STATES_OF_AMERICA", "CANADA"],
  other: ["AUSTRALIA", "NEW_ZEALAND", "OTHER"],
};

export function processForeignEmploymentCountriesData(rawData: ForeignEmploymentCountriesData[]): ProcessedForeignEmploymentCountriesData {
  if (!rawData || rawData.length === 0) {
    return {
      totalForeignEmploymentPopulation: 0,
      countryData: {},
      wardData: {},
      topCountries: [],
      regionalDistribution: {
        gulf: 0,
        southeastAsia: 0,
        europe: 0,
        america: 0,
        other: 0,
      },
    };
  }

  // Calculate total foreign employment population
  const totalForeignEmploymentPopulation = rawData.reduce((sum, item) => sum + (item.population || 0), 0);

  // Process country data
  const countryData: Record<string, any> = {};
  const allCountries: Array<any> = [];

  rawData.forEach((item, index) => {
    const percentage = totalForeignEmploymentPopulation > 0 ? (item.population / totalForeignEmploymentPopulation) * 100 : 0;
    const countryInfo = {
      population: item.population,
      percentage,
      label: FOREIGN_EMPLOYMENT_COUNTRY_LABELS[item.country] || item.country,
      rank: index + 1,
    };

    if (countryData[item.country]) {
      countryData[item.country].population += item.population;
      countryData[item.country].percentage = totalForeignEmploymentPopulation > 0 ? (countryData[item.country].population / totalForeignEmploymentPopulation) * 100 : 0;
    } else {
      countryData[item.country] = countryInfo;
      allCountries.push({
        country: item.country,
        ...countryInfo,
      });
    }
  });

  // Sort countries by population
  allCountries.sort((a, b) => b.population - a.population);

  // Update ranks after sorting
  allCountries.forEach((country, index) => {
    countryData[country.country].rank = index + 1;
  });

  // Get top 5 countries
  const topCountries = allCountries.slice(0, 5).map(country => ({
    country: country.country,
    population: country.population,
    percentage: country.percentage,
    label: country.label,
  }));

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

  return {
    totalForeignEmploymentPopulation,
    countryData,
    wardData,
    topCountries,
    regionalDistribution,
  };
}

export function generateForeignEmploymentCountriesAnalysis(data: ProcessedForeignEmploymentCountriesData): string {
  if (data.totalForeignEmploymentPopulation === 0) {
    return "वैदेशिक रोजगारी देश सम्बन्धी तथ्याङ्क उपलब्ध छैन।";
  }

  const analysisParts: string[] = [];

  // Overall summary
  analysisParts.push(
    `गाउँपालिकामा कुल ${convertToNepaliNumber(data.totalForeignEmploymentPopulation)} जना वैदेशिक रोजगारीमा रहेका छन्।`
  );

  // Top countries analysis
  if (data.topCountries.length > 0) {
    const topCountry = data.topCountries[0];
    analysisParts.push(
      `सबैभन्दा बढी जना ${topCountry.label} मा रोजगारीमा रहेका छन् जसमा ${convertToNepaliNumber(topCountry.population)} जना (${formatNepaliPercentage(topCountry.percentage)}) समावेश छन्।`
    );

    if (data.topCountries.length > 1) {
      const secondCountry = data.topCountries[1];
      analysisParts.push(
        `दोस्रो स्थानमा ${secondCountry.label} रहेको छ जसमा ${convertToNepaliNumber(secondCountry.population)} जना (${formatNepaliPercentage(secondCountry.percentage)}) समावेश छन्।`
      );
    }
  }

  // Regional distribution analysis
  const regions = data.regionalDistribution;
  const totalInRegions = regions.gulf + regions.southeastAsia + regions.europe + regions.america + regions.other;
  
  if (totalInRegions > 0) {
    const gulfPercentage = (regions.gulf / totalInRegions) * 100;
    const southeastAsiaPercentage = (regions.southeastAsia / totalInRegions) * 100;
    const europePercentage = (regions.europe / totalInRegions) * 100;
    const americaPercentage = (regions.america / totalInRegions) * 100;

    analysisParts.push(
      `क्षेत्रीय वितरण अनुसार, खाडी देशहरूमा ${convertToNepaliNumber(regions.gulf)} जना (${formatNepaliPercentage(gulfPercentage)}), दक्षिण पूर्व एसियामा ${convertToNepaliNumber(regions.southeastAsia)} जना (${formatNepaliPercentage(southeastAsiaPercentage)}), युरोपमा ${convertToNepaliNumber(regions.europe)} जना (${formatNepaliPercentage(europePercentage)}), र अमेरिकामा ${convertToNepaliNumber(regions.america)} जना (${formatNepaliPercentage(americaPercentage)}) समावेश छन्।`
    );
  }

  // Ward-wise analysis
  if (Object.keys(data.wardData).length > 0) {
    const wardEntries = Object.entries(data.wardData);
    const highestWard = wardEntries.reduce((max, [wardNum, wardData]) => 
      wardData.totalForeignEmploymentPopulation > max.totalForeignEmploymentPopulation ? { wardNum: parseInt(wardNum), ...wardData } : max
    , { wardNum: 0, totalForeignEmploymentPopulation: 0, countries: {}, primaryCountry: '', primaryCountryPercentage: 0, countryCount: 0 });
    
    const lowestWard = wardEntries.reduce((min, [wardNum, wardData]) => 
      wardData.totalForeignEmploymentPopulation < min.totalForeignEmploymentPopulation ? { wardNum: parseInt(wardNum), ...wardData } : min
    , { wardNum: 0, totalForeignEmploymentPopulation: Infinity, countries: {}, primaryCountry: '', primaryCountryPercentage: 0, countryCount: 0 });

    analysisParts.push(
      `वडाको आधारमा हेर्दा, वडा नं. ${convertToNepaliNumber(highestWard.wardNum)} मा सबैभन्दा बढी ${convertToNepaliNumber(highestWard.totalForeignEmploymentPopulation)} जना वैदेशिक रोजगारीमा रहेका छन् भने वडा नं. ${convertToNepaliNumber(lowestWard.wardNum)} मा सबैभन्दा कम ${convertToNepaliNumber(lowestWard.totalForeignEmploymentPopulation)} जना रहेका छन्।`
    );
  }

  // Additional insights
  analysisParts.push(
    "यो तथ्याङ्कले गाउँपालिकाको वैदेशिक रोजगारीको वितरण र रेमिटेन्स प्रवाहको मुख्य स्रोतहरूलाई प्रतिनिधित्व गर्दछ र स्थानीय अर्थतन्त्रमा वैदेशिक रोजगारीको प्रभावको मूल्याङ्कन गर्न सहयोग गर्दछ।"
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