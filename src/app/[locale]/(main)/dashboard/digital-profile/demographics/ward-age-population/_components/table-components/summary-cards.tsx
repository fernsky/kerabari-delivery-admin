import { Card, CardContent } from "@/components/ui/card";

type Gender = "MALE" | "FEMALE" | "OTHER";

interface SummaryCardsProps {
  totals: {
    byGender: Record<Gender, number>;
    grandTotal: number;
  };
}

export function SummaryCards({ totals }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card className="bg-green-50 border-green-100">
        <CardContent className="pt-4">
          <div className="text-lg font-medium text-green-700">कुल जनसंख्या</div>
          <div className="text-2xl font-bold text-green-800">
            {totals.grandTotal.toLocaleString()}
          </div>
        </CardContent>
      </Card>
      <Card className="bg-blue-50 border-blue-100">
        <CardContent className="pt-4">
          <div className="text-lg font-medium text-blue-700">पुरुष</div>
          <div className="text-2xl font-bold text-blue-800">
            {totals.byGender.MALE.toLocaleString()}
          </div>
          <div className="text-sm text-blue-600">
            {totals.grandTotal > 0
              ? `${((totals.byGender.MALE / totals.grandTotal) * 100).toFixed(1)}%`
              : "0%"}
          </div>
        </CardContent>
      </Card>
      <Card className="bg-pink-50 border-pink-100">
        <CardContent className="pt-4">
          <div className="text-lg font-medium text-pink-700">महिला</div>
          <div className="text-2xl font-bold text-pink-800">
            {totals.byGender.FEMALE.toLocaleString()}
          </div>
          <div className="text-sm text-pink-600">
            {totals.grandTotal > 0
              ? `${((totals.byGender.FEMALE / totals.grandTotal) * 100).toFixed(1)}%`
              : "0%"}
          </div>
        </CardContent>
      </Card>
      {totals.byGender.OTHER > 0 && (
        <Card className="bg-purple-50 border-purple-100">
          <CardContent className="pt-4">
            <div className="text-lg font-medium text-purple-700">अन्य</div>
            <div className="text-2xl font-bold text-purple-800">
              {totals.byGender.OTHER.toLocaleString()}
            </div>
            <div className="text-sm text-purple-600">
              {`${((totals.byGender.OTHER / totals.grandTotal) * 100).toFixed(1)}%`}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
