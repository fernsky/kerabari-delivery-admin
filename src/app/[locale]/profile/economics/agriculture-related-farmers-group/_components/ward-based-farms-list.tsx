import { localizeNumber } from "@/lib/utils/localize-number";
import { Card, CardContent } from "@/components/ui/card";
import { Tag } from "lucide-react";

interface WardBasedFarmsListProps {
  farmsByWard: Array<{
    wardNumber: number;
    farmCount: number;
    farms: Array<{
      id: string;
      name: string;
      type: string;
      icon: string;
    }>;
  }>;
  WARD_COLORS: Record<number, string>;
  GROUP_ICONS: Record<string, string>;
  statistics: {
    totalGroups: number;
    totalWards: number;
    avgGroupsPerWard: number;
    mostPopularGroupType: string;
    mostPopularGroupTypePercentage: number;
    wardWithMostGroups: number;
    maximumGroupsInAWard: number;
  };
  popularGroupByWard: Array<{
    wardNumber: number;
    mostCommonType: string;
    count: number;
    icon: string;
  }>;
}

export default function WardBasedFarmsList({
  farmsByWard,
  WARD_COLORS,
  GROUP_ICONS,
  statistics,
  popularGroupByWard,
}: WardBasedFarmsListProps) {
  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold mb-6">वडागत समूहहरूको विस्तृत विवरण</h3>
      <div className="space-y-8">
        {farmsByWard.map((ward) => (
          <div key={ward.wardNumber} id={`ward-${ward.wardNumber}`}>
            <div className="flex items-center gap-2 mb-3">
              <div 
                className="h-10 w-10 rounded-full flex items-center justify-center text-white text-xl font-bold"
                style={{ 
                  backgroundColor: ward.farmCount > 0 
                    ? `${WARD_COLORS[ward.wardNumber]}` 
                    : "#95a5a6" 
                }}
              >
                {localizeNumber(ward.wardNumber, "ne")}
              </div>
              <div>
                <h4 className="text-xl font-semibold">
                  वडा नं. {localizeNumber(ward.wardNumber.toString(), "ne")}
                </h4>
                <p className="text-muted-foreground">
                  {ward.farmCount > 0 ? (
                    <>
                      {localizeNumber(ward.farmCount.toString(), "ne")} समूह
                      {ward.farmCount > 0 && popularGroupByWard.find(w => w.wardNumber === ward.wardNumber) && (
                        <> - मुख्यतः {popularGroupByWard.find(w => w.wardNumber === ward.wardNumber)?.mostCommonType}</>
                      )}
                    </>
                  ) : (
                    <>कुनै पनि समूह छैन</>
                  )}
                </p>
              </div>
            </div>

            {ward.farmCount > 0 ? (
              <Card className="mt-2">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {/* Ward statistics */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                      <div className="border rounded-lg p-3 bg-muted/40">
                        <p className="text-sm text-muted-foreground">कुल समूह</p>
                        <p className="text-2xl font-bold">
                          {localizeNumber(ward.farmCount.toString(), "ne")}
                        </p>
                      </div>
                      
                      <div className="border rounded-lg p-3 bg-muted/40">
                        <p className="text-sm text-muted-foreground">प्रमुख समूह प्रकार</p>
                        <p className="text-2xl font-bold flex items-center gap-2">
                          {popularGroupByWard.find(w => w.wardNumber === ward.wardNumber)?.icon || "🌱"} 
                          {popularGroupByWard.find(w => w.wardNumber === ward.wardNumber)?.mostCommonType || ""}
                        </p>
                      </div>
                      
                      <div className="border rounded-lg p-3 bg-muted/40">
                        <p className="text-sm text-muted-foreground">समूह प्रकार</p>
                        <p className="text-2xl font-bold">
                          {localizeNumber(
                            Array.from(new Set(ward.farms.map(farm => farm.type))).length.toString(),
                            "ne"
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Farm groups list */}
                    <div className="border rounded-lg overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-muted/50 border-b">
                          <tr>
                            <th className="text-left p-3">समूहको नाम</th>
                            <th className="text-left p-3">समूह प्रकार</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {ward.farms.map((farm) => (
                            <tr key={farm.id} className="hover:bg-muted/30">
                              <td className="p-3">
                                {farm.name}
                              </td>
                              <td className="p-3">
                                <div className="flex items-center gap-2">
                                  <span className="text-xl">{farm.icon}</span>
                                  <span>{farm.type}</span>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    {/* Group type distribution within ward */}
                    {ward.farmCount >= 3 && (
                      <div className="mt-4 pt-4 border-t">
                        <h5 className="text-md font-medium mb-3 flex items-center gap-2">
                          <Tag className="h-4 w-4" />
                          समूहको प्रकारको वितरण
                        </h5>
                        <div className="space-y-2">
                          {Object.entries(
                            ward.farms.reduce((acc: Record<string, number>, farm) => {
                              acc[farm.type] = (acc[farm.type] || 0) + 1;
                              return acc;
                            }, {})
                          )
                            .sort(([, a], [, b]) => b - a)
                            .map(([type, count], index) => (
                              <div key={index} className="flex items-center gap-3">
                                <div className="w-full max-w-md">
                                  <div className="flex justify-between text-sm mb-1">
                                    <span className="flex items-center gap-1">
                                      {GROUP_ICONS[type] || "🌱"} {type}
                                    </span>
                                    <span>
                                      {localizeNumber(count.toString(), "ne")} (
                                      {localizeNumber(((count / ward.farmCount) * 100).toFixed(1), "ne")}%)
                                    </span>
                                  </div>
                                  <div className="w-full bg-muted h-2 rounded-full">
                                    <div
                                      className="h-full rounded-full"
                                      style={{
                                        width: `${(count / ward.farmCount) * 100}%`,
                                        backgroundColor: "#3498db",
                                      }}
                                    ></div>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="mt-2 border-dashed">
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">
                    यस वडामा कुनै पनि कृषि सम्बन्धित समूह छैन।
                  </p>
                  <p className="text-sm mt-2">
                    कृषि प्रवर्द्धन कार्यक्रम र समूह संगठन प्रोत्साहन गर्न आवश्यक छ।
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
