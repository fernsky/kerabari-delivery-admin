import { localizeNumber } from "@/lib/utils/localize-number";
import { Card, CardContent } from "@/components/ui/card";
import { Tag } from "lucide-react";

interface WardBasedCooperativesListProps {
  cooperativesByWard: Array<{
    wardNumber: number;
    cooperativeCount: number;
    cooperatives: Array<{
      id: string;
      cooperativeName: string;
      cooperativeType: string;
      typeName: string;
      phoneNumber: string;
      remarks: string;
      icon: string;
    }>;
  }>;
  COOPERATIVE_TYPES: Record<string, string>;
  COOPERATIVE_COLORS: Record<string, string>;
  COOPERATIVE_ICONS: Record<string, string>;
  statistics: {
    totalCooperatives: number;
    totalWards: number;
    avgCooperativesPerWard: number;
    mostPopularCooperativeType: string;
    mostPopularCooperativeTypeName: string;
    mostPopularCooperativeTypePercentage: number;
    wardWithMostCooperatives: number;
    maximumCooperativesInAWard: number;
    provinceLevelCooperatives: number;
  };
  popularCooperativeByWard: Array<{
    wardNumber: number;
    mostCommonType: string;
    mostCommonTypeName: string;
    count: number;
    icon: string;
  }>;
}

export default function WardBasedCooperativesList({
  cooperativesByWard,
  COOPERATIVE_TYPES,
  COOPERATIVE_COLORS,
  COOPERATIVE_ICONS,
  statistics,
  popularCooperativeByWard,
}: WardBasedCooperativesListProps) {
  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold mb-6">वडागत सहकारी संस्थाहरूको विस्तृत विवरण</h3>
      <div className="space-y-8">
        {cooperativesByWard.map((ward) => (
          <div key={ward.wardNumber} id={`ward-${ward.wardNumber}`}>
            <div className="flex items-center gap-2 mb-3">
              <div 
                className="h-10 w-10 rounded-full flex items-center justify-center text-white text-xl font-bold"
                style={{ 
                  backgroundColor: ward.cooperativeCount > 0 
                    ? `${COOPERATIVE_COLORS[popularCooperativeByWard.find(w => w.wardNumber === ward.wardNumber)?.mostCommonType || "OTHER"]}` 
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
                  {ward.cooperativeCount > 0 ? (
                    <>
                      {localizeNumber(ward.cooperativeCount.toString(), "ne")} सहकारी संस्था
                      {ward.cooperativeCount > 0 && popularCooperativeByWard.find(w => w.wardNumber === ward.wardNumber) && (
                        <> - मुख्यतः {popularCooperativeByWard.find(w => w.wardNumber === ward.wardNumber)?.mostCommonTypeName}</>
                      )}
                    </>
                  ) : (
                    <>कुनै पनि सहकारी संस्था छैन</>
                  )}
                </p>
              </div>
            </div>

            {ward.cooperativeCount > 0 ? (
              <Card className="mt-2">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {/* Ward statistics */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                      <div className="border rounded-lg p-3 bg-muted/40">
                        <p className="text-sm text-muted-foreground">कुल सहकारी</p>
                        <p className="text-2xl font-bold">
                          {localizeNumber(ward.cooperativeCount.toString(), "ne")}
                        </p>
                      </div>
                      
                      <div className="border rounded-lg p-3 bg-muted/40">
                        <p className="text-sm text-muted-foreground">प्रमुख प्रकार</p>
                        <p className="text-2xl font-bold flex items-center gap-2">
                          {popularCooperativeByWard.find(w => w.wardNumber === ward.wardNumber)?.icon || "🏢"} 
                          {popularCooperativeByWard.find(w => w.wardNumber === ward.wardNumber)?.mostCommonTypeName || ""}
                        </p>
                      </div>
                      
                      <div className="border rounded-lg p-3 bg-muted/40">
                        <p className="text-sm text-muted-foreground">सहकारी प्रकार</p>
                        <p className="text-2xl font-bold">
                          {localizeNumber(
                            Array.from(new Set(ward.cooperatives.map(coop => coop.cooperativeType))).length.toString(),
                            "ne"
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Cooperatives list */}
                    <div className="border rounded-lg overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-muted/50 border-b">
                          <tr>
                            <th className="text-left p-3">संस्थाको नाम</th>
                            <th className="text-left p-3">सहकारीको प्रकार</th>
                            <th className="text-left p-3 hidden md:table-cell">सम्पर्क / कैफियत</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {ward.cooperatives.map((cooperative) => (
                            <tr key={cooperative.id} className="hover:bg-muted/30">
                              <td className="p-3">
                                {cooperative.cooperativeName}
                              </td>
                              <td className="p-3">
                                <div className="flex items-center gap-2">
                                  <span className="text-xl">{cooperative.icon}</span>
                                  <span>{cooperative.typeName}</span>
                                </div>
                              </td>
                              <td className="p-3 hidden md:table-cell">
                                <div className="text-sm space-y-1">
                                  {cooperative.phoneNumber && (
                                    <div>{cooperative.phoneNumber}</div>
                                  )}
                                  {cooperative.remarks && (
                                    <div className="px-2 py-0.5 bg-primary/10 text-primary rounded-full inline-block">
                                      {cooperative.remarks}
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    {/* Cooperative type distribution within ward */}
                    {ward.cooperativeCount >= 3 && (
                      <div className="mt-4 pt-4 border-t">
                        <h5 className="text-md font-medium mb-3 flex items-center gap-2">
                          <Tag className="h-4 w-4" />
                          सहकारी प्रकारको वितरण
                        </h5>
                        <div className="space-y-2">
                          {Object.entries(
                            ward.cooperatives.reduce((acc: Record<string, number>, coop) => {
                              acc[coop.cooperativeType] = (acc[coop.cooperativeType] || 0) + 1;
                              return acc;
                            }, {})
                          )
                            .sort(([, a], [, b]) => b - a)
                            .map(([type, count], index) => (
                              <div key={index} className="flex items-center gap-3">
                                <div className="w-full max-w-md">
                                  <div className="flex justify-between text-sm mb-1">
                                    <span className="flex items-center gap-1">
                                      {COOPERATIVE_ICONS[type] || "🏢"} {COOPERATIVE_TYPES[type] || type}
                                    </span>
                                    <span>
                                      {localizeNumber(count.toString(), "ne")} (
                                      {localizeNumber(((count / ward.cooperativeCount) * 100).toFixed(1), "ne")}%)
                                    </span>
                                  </div>
                                  <div className="w-full bg-muted h-2 rounded-full">
                                    <div
                                      className="h-full rounded-full"
                                      style={{
                                        width: `${(count / ward.cooperativeCount) * 100}%`,
                                        backgroundColor: COOPERATIVE_COLORS[type] || "#95a5a6",
                                      }}
                                    ></div>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Province level cooperatives */}
                    {ward.cooperatives.some(coop => coop.remarks?.includes("प्रदेश स्तरीय")) && (
                      <div className="mt-4 pt-4 border-t">
                        <h5 className="text-md font-medium mb-3">प्रदेश स्तरीय सहकारीहरू</h5>
                        <div className="border rounded-lg p-4 bg-blue-50">
                          <ul className="space-y-2">
                            {ward.cooperatives
                              .filter(coop => coop.remarks?.includes("प्रदेश स्तरीय"))
                              .map(coop => (
                                <li key={coop.id} className="flex items-center gap-2">
                                  <span>{coop.icon}</span>
                                  <span>{coop.cooperativeName}</span>
                                </li>
                              ))
                            }
                          </ul>
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
                    यस वडामा कुनै पनि सहकारी संस्था छैन।
                  </p>
                  <p className="text-sm mt-2">
                    सहकारी प्रवर्द्धन कार्यक्रम र वित्तीय समावेशीकरण पहलहरू आवश्यक छन्।
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
