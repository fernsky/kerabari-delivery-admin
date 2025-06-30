import { localizeNumber } from "@/lib/utils/localize-number";

interface TemperatureAnalysisSectionProps {
  temperatureData: Array<{
    date: string;
    temperatureCelsius: number;
    year: number;
    month: number;
  }>;
  averageTemperature: number;
  trendSlope: number;
  anomalyStats: {
    totalAnomalies: number;
    warmAnomalies: number;
    coldAnomalies: number;
    extremeAnomalies: number;
    averageAnomaly: number;
  };
  climateScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

export default function TemperatureAnalysisSection({
  averageTemperature,
  trendSlope,
  anomalyStats,
  climateScore,
  riskLevel,
}: TemperatureAnalysisSectionProps) {
  const warmingRate = trendSlope * 12;
  
  const riskLevelDetails = {
    low: { name: "कम जोखिम", color: "text-green-600", bgColor: "bg-green-100" },
    medium: { name: "मध्यम जोखिम", color: "text-yellow-600", bgColor: "bg-yellow-100" },
    high: { name: "उच्च जोखिम", color: "text-orange-600", bgColor: "bg-orange-100" },
    critical: { name: "गंभीर जोखिम", color: "text-red-600", bgColor: "bg-red-100" },
  };

  const riskInfo = riskLevelDetails[riskLevel];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card p-4 rounded-lg text-center">
          <p className="text-sm text-muted-foreground">औसत तापक्रम</p>
          <p className="text-2xl font-bold">
            {localizeNumber(averageTemperature.toFixed(1), "ne")}°C
          </p>
        </div>

        <div className="bg-card p-4 rounded-lg text-center">
          <p className="text-sm text-muted-foreground">वार्षिक वृद्धि</p>
          <p className={`text-2xl font-bold ${warmingRate > 0.1 ? 'text-red-600' : warmingRate > 0.05 ? 'text-orange-600' : 'text-green-600'}`}>
            {localizeNumber(warmingRate.toFixed(2), "ne")}°C/वर्ष
          </p>
        </div>

        <div className="bg-card p-4 rounded-lg text-center">
          <p className="text-sm text-muted-foreground">जलवायु स्कोर</p>
          <p className={`text-2xl font-bold ${climateScore > 70 ? 'text-red-600' : climateScore > 50 ? 'text-orange-600' : 'text-green-600'}`}>
            {localizeNumber(climateScore.toFixed(0), "ne")}/100
          </p>
        </div>

        <div className="bg-card p-4 rounded-lg text-center">
          <p className="text-sm text-muted-foreground">जोखिम स्तर</p>
          <p className={`text-2xl font-bold ${riskInfo.color}`}>
            {riskInfo.name}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card p-4 rounded-lg">
          <h4 className="font-medium mb-3 text-red-600">महत्वपूर्ण निष्कर्ष</h4>
          <ul className="space-y-2 text-sm">
            <li>• वार्षिक तापक्रम वृद्धि: {localizeNumber(warmingRate.toFixed(2), "ne")}°C प्रति वर्ष</li>
            <li>• तातो विचलन: {localizeNumber(anomalyStats.warmAnomalies.toString(), "ne")} महिना</li>
            <li>• चिसो विचलन: {localizeNumber(anomalyStats.coldAnomalies.toString(), "ne")} महिना</li>
            <li>• औसत विचलन: {anomalyStats.averageAnomaly > 0 ? '+' : ''}{localizeNumber(anomalyStats.averageAnomaly.toFixed(1), "ne")}°C</li>
          </ul>
        </div>

        <div className="bg-card p-4 rounded-lg">
          <h4 className="font-medium mb-3 text-blue-600">अनुशंसित कार्य</h4>
          <ul className="space-y-2 text-sm">
            <li>• तापक्रम निगरानी प्रणाली सुदृढ बनाउनु</li>
            <li>• जलवायु अनुकूल कृषि तकनीक विकास</li>
            <li>• सिंचाई प्रणाली सुधार</li>
            <li>• जनचेतना कार्यक्रम सञ्चालन</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 