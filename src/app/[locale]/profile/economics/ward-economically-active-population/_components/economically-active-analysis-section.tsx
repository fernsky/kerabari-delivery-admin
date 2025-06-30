"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";

interface EconomicallyActiveAnalysisProps {
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
  AGE_GROUP_NAMES: Record<string, string>;
  GENDER_NAMES: Record<string, string>;
  dependencyRatio: string;
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
}

export default function EconomicallyActiveAnalysisSection({
  ageGroupSummary,
  genderSummary,
  totalPopulation,
  AGE_GROUP_NAMES,
  GENDER_NAMES,
  dependencyRatio,
  wardNumbers,
  economicallyActiveData,
}: EconomicallyActiveAnalysisProps) {
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

  // Get working age population (15-59)
  const workingAgePopulation =
    ageGroupSummary.find((item) => item.ageGroup === "AGE_15_TO_59")
      ?.population || 0;

  const workingAgePercentage =
    totalPopulation > 0
      ? ((workingAgePopulation / totalPopulation) * 100).toFixed(2)
      : "0";

  // Calculate gender ratio
  const males = genderSummary.find((g) => g.gender === "MALE")?.population || 0;
  const females =
    genderSummary.find((g) => g.gender === "FEMALE")?.population || 0;
  const genderRatio =
    females > 0 ? ((males / females) * 100).toFixed(2) : "N/A";

  // Find the ward with the highest working population
  const wardWorkingAgePopulation = wardNumbers.map((wardNumber) => {
    const workingAgePop = economicallyActiveData
      .filter(
        (item) =>
          item.wardNumber === wardNumber && item.ageGroup === "AGE_15_TO_59",
      )
      .reduce((sum, item) => sum + (item.population || 0), 0);

    const totalWardPop = economicallyActiveData
      .filter((item) => item.wardNumber === wardNumber)
      .reduce((sum, item) => sum + (item.population || 0), 0);

    return {
      wardNumber,
      workingAgePop,
      totalWardPop,
      percentage: totalWardPop > 0 ? (workingAgePop / totalWardPop) * 100 : 0,
    };
  });

  const highestWorkingAgeWard = wardWorkingAgePopulation.sort(
    (a, b) => b.percentage - a.percentage,
  )[0];

  // Add SEO-friendly data attributes
  useEffect(() => {
    // Define English translations for key data
    const AGE_GROUP_NAMES_EN: Record<string, string> = {
      AGE_0_TO_14: "0-14 years",
      AGE_15_TO_59: "15-59 years",
      AGE_60_PLUS: "60+ years",
    };

    const GENDER_NAMES_EN: Record<string, string> = {
      MALE: "Male",
      FEMALE: "Female",
      OTHER: "Other",
    };

    // Add data to document.body for SEO
    if (document && document.body) {
      document.body.setAttribute(
        "data-municipality",
        "Khajura Rural Municipality / केराबारी गाउँपालिका",
      );
      document.body.setAttribute(
        "data-total-population",
        totalPopulation.toString(),
      );
      document.body.setAttribute(
        "data-working-age-population",
        workingAgePopulation.toString(),
      );
      document.body.setAttribute(
        "data-working-age-percentage",
        workingAgePercentage,
      );
      document.body.setAttribute("data-dependency-ratio", dependencyRatio);
      document.body.setAttribute("data-gender-ratio", genderRatio);

      // Add age group data
      ageGroupSummary.forEach((item) => {
        const ageGroupNameEN =
          AGE_GROUP_NAMES_EN[item.ageGroup] || item.ageGroup;
        document.body.setAttribute(
          `data-${item.ageGroup.toLowerCase()}-population`,
          item.population.toString(),
        );
        document.body.setAttribute(
          `data-${item.ageGroup.toLowerCase()}-percentage`,
          ((item.population / totalPopulation) * 100).toFixed(2),
        );
      });

      // Add gender data
      genderSummary.forEach((item) => {
        const genderNameEN = GENDER_NAMES_EN[item.gender] || item.gender;
        document.body.setAttribute(
          `data-${item.gender.toLowerCase()}-population`,
          item.population.toString(),
        );
        document.body.setAttribute(
          `data-${item.gender.toLowerCase()}-percentage`,
          ((item.population / totalPopulation) * 100).toFixed(2),
        );
      });
    }
  }, [
    ageGroupSummary,
    genderSummary,
    totalPopulation,
    dependencyRatio,
    genderRatio,
    workingAgePopulation,
    workingAgePercentage,
  ]);

  return (
    <>
      <div className="mt-6 flex flex-wrap gap-4 justify-center">
        {/* Age Group Analysis Cards */}
        <div className="bg-muted/50 rounded-lg p-4 text-center min-w-[300px] relative overflow-hidden">
          <div
            className="absolute bottom-0 left-0 right-0"
            style={{
              height: "60%",
              backgroundColor: "#36A2EB",
              opacity: 0.1,
              zIndex: 0,
            }}
          />
          <div className="relative z-10">
            <h3 className="text-lg font-medium mb-2">
              कार्यसक्षम उमेर समूह
              <span className="sr-only">Working Age Group (15-59 years)</span>
            </h3>
            <p className="text-3xl font-bold">{workingAgePercentage}%</p>
            <p className="text-sm text-muted-foreground">
              {workingAgePopulation.toLocaleString()} व्यक्ति (१५-५९ वर्ष)
            </p>
          </div>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 text-center min-w-[300px] relative overflow-hidden">
          <div
            className="absolute bottom-0 left-0 right-0"
            style={{
              height: "60%",
              backgroundColor: "#FF6384",
              opacity: 0.1,
              zIndex: 0,
            }}
          />
          <div className="relative z-10">
            <h3 className="text-lg font-medium mb-2">
              निर्भरता अनुपात
              <span className="sr-only">Dependency Ratio</span>
            </h3>
            <p className="text-3xl font-bold">{dependencyRatio}%</p>
            <p className="text-sm text-muted-foreground">
              प्रति १०० कार्यसक्षम उमेरका व्यक्ति
            </p>
          </div>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 text-center min-w-[300px] relative overflow-hidden">
          <div
            className="absolute bottom-0 left-0 right-0"
            style={{
              height: "60%",
              backgroundColor: "#4BC0C0",
              opacity: 0.1,
              zIndex: 0,
            }}
          />
          <div className="relative z-10">
            <h3 className="text-lg font-medium mb-2">
              लिङ्ग अनुपात
              <span className="sr-only">Gender Ratio</span>
            </h3>
            <p className="text-3xl font-bold">{genderRatio}</p>
            <p className="text-sm text-muted-foreground">
              प्रति १०० महिलामा पुरुष संख्या
            </p>
          </div>
        </div>
      </div>

      <div className="bg-muted/50 p-4 rounded-lg mt-8">
        <h3 className="text-xl font-medium mb-4">
          आर्थिक सक्रियता विश्लेषण
          <span className="sr-only">Economic Activity Analysis of Khajura</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-2">उच्च कार्यसक्षम जनसंख्या वडा</h4>
            <p className="text-3xl font-bold">
              वडा {highestWorkingAgeWard?.wardNumber}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              कुल वडा जनसंख्याको {highestWorkingAgeWard?.percentage.toFixed(2)}%
              कार्यसक्षम उमेरका (१५-५९ वर्ष)
            </p>
          </div>

          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-2">जनसांख्यिकी लाभांश</h4>
            <div className="flex items-center">
              <div className="flex-1 bg-muted h-3 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary"
                  style={{
                    width: `${parseFloat(workingAgePercentage)}%`,
                    maxWidth: "100%",
                  }}
                ></div>
              </div>
              <span className="ml-3 text-sm font-medium">
                {workingAgePercentage}%
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {parseFloat(workingAgePercentage) > 66
                ? "उच्च जनसांख्यिकी लाभांश - कार्यसक्षम जनसंख्या बढी भएको"
                : "मध्यम जनसांख्यिकी लाभांश - कार्यसक्षम र आश्रित जनसंख्या सन्तुलित"}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-muted/50 p-4 rounded-lg mt-6">
        <h3 className="text-xl font-medium mb-2">
          आर्थिक नीतिगत सिफारिसहरू
          <span className="sr-only">
            Economic Policy Recommendations for Khajura
          </span>
        </h3>
        <ul className="list-disc pl-5 space-y-2 mt-3">
          <li>
            कार्यसक्षम उमेर समूह (१५-५९ वर्ष) का लागि पर्याप्त रोजगारी अवसर
            सिर्जना र उद्यमशीलता प्रवर्द्धन
          </li>
          <li>
            बढ्दो वृद्ध जनसंख्याको लागि पर्याप्त स्वास्थ्य सेवा र सामाजिक
            सुरक्षा कार्यक्रम विकास
          </li>
          <li>
            युवा जनशक्तिको सीप विकास गरी उत्पादनशील क्षेत्रमा संलग्न गराउने
            रणनीति
          </li>
          <li>
            लैङ्गिक समानता र महिला सशक्तिकरणलाई प्राथमिकता दिई आर्थिक गतिविधिमा
            पहुँच बढाउने
          </li>
        </ul>

        <div className="mt-5 flex justify-end">
          <Button variant="outline" size="sm" className="gap-1">
            थप जान्नुहोस्
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="bg-muted/50 p-4 rounded-lg mt-6">
        <h3 className="text-xl font-medium mb-2">
          थप जानकारी
          <span className="sr-only">
            Additional Information about Economically Active Population in
            Khajura
          </span>
        </h3>
        <p>
          केराबारी गाउँपालिकाको आर्थिक रूपमा सक्रिय जनसंख्या सम्बन्धी थप
          जानकारी वा विस्तृत तथ्याङ्कको लागि, कृपया{" "}
          <Link href="/contact" className="text-primary hover:underline">
            हामीलाई सम्पर्क
          </Link>{" "}
          गर्नुहोस् वा{" "}
          <Link
            href="/profile/economics"
            className="text-primary hover:underline"
          >
            आर्थिक प्रोफाइल
          </Link>{" "}
          खण्डमा हेर्नुहोस्।
        </p>
      </div>
    </>
  );
}
