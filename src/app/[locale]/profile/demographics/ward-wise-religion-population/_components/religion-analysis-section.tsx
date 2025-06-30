import { localizeNumber } from "@/lib/utils/localize-number";

interface ReligionAnalysisProps {
  overallSummary: Array<{
    religion: string;
    religionName: string;
    population: number;
  }>;
  totalPopulation: number;
  RELIGION_NAMES: Record<string, string>;
}

export default function ReligionAnalysisSection({
  overallSummary,
  totalPopulation,
  RELIGION_NAMES,
}: ReligionAnalysisProps) {
  // Modern aesthetic color palette for religions
  const RELIGION_COLORS = {
    HINDU: "#6366F1", // Indigo
    BUDDHIST: "#8B5CF6", // Purple
    KIRANT: "#EC4899", // Pink
    CHRISTIAN: "#F43F5E", // Rose
    ISLAM: "#10B981", // Emerald
    NATURE: "#06B6D4", // Cyan
    BON: "#3B82F6", // Blue
    JAIN: "#F59E0B", // Amber
    BAHAI: "#84CC16", // Lime
    SIKH: "#9333EA", // Fuchsia
    OTHER: "#14B8A6", // Teal
  };

  // Calculate top two religions ratio if both exist
  const topReligion = overallSummary[0];
  const secondReligion = overallSummary[1];

  const topTwoReligionRatio =
    topReligion && secondReligion && secondReligion.population > 0
      ? (topReligion.population / secondReligion.population).toFixed(2)
      : "N/A";

  return (
    <>
      <div className="mt-6 flex flex-wrap gap-4 justify-center">
        {overallSummary.slice(0, 6).map((item, index) => {
          // Define English religion name for SEO
          const religionEN =
            item.religion === "HINDU"
              ? "Hindu"
              : item.religion === "BUDDHIST"
                ? "Buddhist"
                : item.religion === "KIRANT"
                  ? "Kirat"
                  : item.religion === "CHRISTIAN"
                    ? "Christian"
                    : item.religion === "ISLAM"
                      ? "Islam"
                      : item.religion === "NATURE"
                        ? "Nature Worship"
                        : item.religion === "BON"
                          ? "Bon"
                          : item.religion === "JAIN"
                            ? "Jain"
                            : item.religion === "BAHAI"
                              ? "Bahai"
                              : item.religion === "SIKH"
                                ? "Sikh"
                                : "Other";

          // Calculate percentage
          const percentage = (
            (item.population / totalPopulation) *
            100
          ).toFixed(2);

          return (
            <div
              key={index}
              className="bg-muted/50 rounded-lg p-4 text-center min-w-[200px] relative overflow-hidden"
            >
              <div
                className="absolute bottom-0 left-0 right-0"
                style={{
                  height: `${Math.min(
                    (item.population / overallSummary[0].population) * 100,
                    100,
                  )}%`,
                  backgroundColor:
                    RELIGION_COLORS[
                      item.religion as keyof typeof RELIGION_COLORS
                    ] || "#888",
                  opacity: 0.2,
                  zIndex: 0,
                }}
              />
              <div className="relative z-10">
                <h3 className="text-lg font-medium mb-2">
                  {item.religionName}
                  <span className="sr-only">{religionEN}</span>
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
          केराबारी गाउँपालिकाको धार्मिक विविधता विश्लेषण
          <span className="sr-only">
            Religious Diversity Analysis of Khajura
          </span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-2">
              केराबारी गाउँपालिकाको प्रमुख धर्म
              <span className="sr-only">
                Main Religion in Khajura Rural Municipality
              </span>
            </h4>
            <p className="text-3xl font-bold">
              {topReligion ? topReligion.religionName : "-"}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {topReligion
                ? `कुल जनसंख्याको ${localizeNumber(((topReligion.population / totalPopulation) * 100).toFixed(2), "ne")}% व्यक्ति`
                : ""}
              <span className="sr-only">
                {topReligion
                  ? `${((topReligion.population / totalPopulation) * 100).toFixed(2)}% of total population in Khajura Rural Municipality`
                  : ""}
              </span>
            </p>
          </div>

          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-2">
              केराबारी गाउँपालिकाको प्रमुख-दोस्रो धर्म अनुपात
              <span className="sr-only">
                Primary to Secondary Religion Ratio in Khajura
              </span>
            </h4>
            <p className="text-3xl font-bold">
              {localizeNumber(topTwoReligionRatio, "ne")}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {topReligion && secondReligion
                ? `हरेक ${localizeNumber(topTwoReligionRatio, "ne")} ${topReligion.religionName} अवलम्बनकर्ताका लागि १ ${secondReligion.religionName} अवलम्बनकर्ता`
                : ""}
              <span className="sr-only">
                {topReligion && secondReligion
                  ? `For every ${topTwoReligionRatio} ${topReligion.religion.toLowerCase()} followers, there is 1 ${secondReligion.religion.toLowerCase()} follower in Khajura Rural Municipality`
                  : ""}
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
