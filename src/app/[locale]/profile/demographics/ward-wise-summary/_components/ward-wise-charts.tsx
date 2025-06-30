"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { ReferenceLine } from "recharts";
import PopulationDistributionCharts from "./charts/population-distribution-charts";
import GenderRatioCharts from "./charts/gender-ratio-charts";
import HouseholdCharts from "./charts/household-charts";
import { localizeNumber } from "@/lib/utils/localize-number";

// Modern aesthetic color scheme for gender representation
const GENDER_COLORS = {
  MALE: "#3B82F6", // Blue
  FEMALE: "#EC4899", // Pink
  OTHER: "#10B981", // Emerald
};

interface WardWiseChartsProps {
  wardPopulationData: Array<{
    ward: string;
    population: number;
    malePopulation: number;
    femalePopulation: number;
    otherPopulation: number;
    percentage: string;
    households: number;
  }>;
  wardSexRatioData: Array<{
    ward: string;
    sexRatio: number;
    population: number;
  }>;
  wardHouseholdData: Array<{
    ward: string;
    householdSize: number;
    households: number;
  }>;
  municipalityStats: {
    totalPopulation: number;
    malePopulation: number;
    femalePopulation: number;
    otherPopulation: number;
    totalHouseholds: number;
  };
  municipalityAverages: {
    averageHouseholdSize: number;
    sexRatio: number;
  };
  GENDER_NAMES: Record<string, string>;
}

export default function WardWiseCharts({
  wardPopulationData,
  wardSexRatioData,
  wardHouseholdData,
  municipalityStats,
  municipalityAverages,
  GENDER_NAMES,
}: WardWiseChartsProps) {
  const [selectedTab, setSelectedTab] = useState<string>("bar");
  const [householdTab, setHouseholdTab] = useState<string>("bar");
  const [genderTab, setGenderTab] = useState<string>("bar");

  return (
    <>
      {/* Ward-wise population distribution */}
      <div
        className="mb-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        id="ward-population-distribution"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Ward-wise Population Distribution in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content={`Population distribution across wards in Khajura with a total population of ${municipalityStats.totalPopulation}`}
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            केराबारी गाउँपालिकाको वडागत जनसंख्या वितरण
          </h3>
          <p className="text-sm text-muted-foreground">
            कुल जनसंख्या:{" "}
            <span itemProp="population">
              {localizeNumber(
                municipalityStats.totalPopulation.toLocaleString(),
                "ne",
              )}
            </span>
            व्यक्ति
          </p>
        </div>

        <Tabs
          value={selectedTab}
          onValueChange={setSelectedTab}
          className="w-full"
        >
          <div className="border-b bg-muted/40">
            <div className="container">
              <TabsList className="h-10 bg-transparent">
                <TabsTrigger
                  value="bar"
                  className="data-[state=active]:bg-background"
                >
                  बार चार्ट
                </TabsTrigger>
                <TabsTrigger
                  value="pie"
                  className="data-[state=active]:bg-background"
                >
                  पाई चार्ट
                </TabsTrigger>
                <TabsTrigger
                  value="table"
                  className="data-[state=active]:bg-background"
                >
                  तालिका
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          <PopulationDistributionCharts
            selectedTab={selectedTab}
            wardPopulationData={wardPopulationData}
            municipalityStats={municipalityStats}
            municipalityAverages={municipalityAverages}
          />
        </Tabs>
      </div>

      {/* Gender distribution by ward */}
      <div
        className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        id="gender-ratio"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Ward-wise Gender Ratio in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content={`Gender ratio distribution across wards in Khajura with an average ratio of ${municipalityAverages.sexRatio}`}
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            केराबारी गाउँपालिकाको वडागत लिङ्ग अनुपात
          </h3>
          <p className="text-sm text-muted-foreground">
            केराबारी गाउँपालिकाको प्रत्येक वडाको पुरुष-महिला अनुपात (प्रति
            १०० पुरुषमा महिलाको संख्या)
          </p>
        </div>

        <Tabs value={genderTab} onValueChange={setGenderTab} className="w-full">
          <div className="border-b bg-muted/40">
            <div className="container">
              <TabsList className="h-10 bg-transparent">
                <TabsTrigger
                  value="bar"
                  className="data-[state=active]:bg-background"
                >
                  लैङ्गिक अनुपात
                </TabsTrigger>
                <TabsTrigger
                  value="stacked"
                  className="data-[state=active]:bg-background"
                >
                  लिङ्ग अनुसार वितरण
                </TabsTrigger>
                <TabsTrigger
                  value="table"
                  className="data-[state=active]:bg-background"
                >
                  तालिका
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          <GenderRatioCharts
            genderTab={genderTab}
            wardSexRatioData={wardSexRatioData}
            wardPopulationData={wardPopulationData}
            municipalityStats={municipalityStats}
            municipalityAverages={municipalityAverages}
            GENDER_NAMES={GENDER_NAMES}
          />
        </Tabs>
      </div>

      {/* Household distribution by ward */}
      <div
        className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        id="household-size"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Ward-wise Household Information in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content={`Household count and size distribution across wards in Khajura with an average household size of ${municipalityAverages.averageHouseholdSize}`}
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            केराबारी गाउँपालिकाको वडागत घरधुरी र परिवार संख्या
          </h3>
          <p className="text-sm text-muted-foreground">
            केराबारी गाउँपालिकाको प्रत्येक वडाको घरधुरी संख्या र औसत परिवार
            संख्या
          </p>
        </div>

        <Tabs
          value={householdTab}
          onValueChange={setHouseholdTab}
          className="w-full"
        >
          <div className="border-b bg-muted/40">
            <div className="container">
              <TabsList className="h-10 bg-transparent">
                <TabsTrigger
                  value="bar"
                  className="data-[state=active]:bg-background"
                >
                  घरधुरी संख्या
                </TabsTrigger>
                <TabsTrigger
                  value="household-size"
                  className="data-[state=active]:bg-background"
                >
                  औसत परिवार संख्या
                </TabsTrigger>
                <TabsTrigger
                  value="table"
                  className="data-[state=active]:bg-background"
                >
                  तालिका
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          <HouseholdCharts
            householdTab={householdTab}
            wardHouseholdData={wardHouseholdData}
            wardPopulationData={wardPopulationData}
            municipalityStats={municipalityStats}
            municipalityAverages={municipalityAverages}
          />
        </Tabs>
      </div>
    </>
  );
}
