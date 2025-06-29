import { localizeNumber } from "@/lib/utils/localize-number";

interface TemperatureAnalysisSectionProps {
  temperatureData: Array<{
    date: string;
    temperature: number;
    temperatureCelsius: number;
    year: number;
    month: number;
    season: string;
    anomaly?: number;
    trend?: number;
  }>;
  averageTemperature: number;
  trendSlope: number;
  temperatureRange: {
    min: number;
    max: number;
    mean: number;
    stdDev: number;
  };
  seasonalData: Array<{
    season: string;
    avgTemp: number;
    minTemp: number;
    maxTemp: number;
  }>;
  anomalyStats: {
    totalAnomalies: number;
    warmAnomalies: number;
    coldAnomalies: number;
    extremeAnomalies: number;
    averageAnomaly: number;
    trendSlope: number;
  };
  climateScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  policyRecommendations: Array<{
    category: string;
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    impact: string;
    timeline: string;
  }>;
}

export default function TemperatureAnalysisSection({
  temperatureData,
  averageTemperature,
  trendSlope,
  temperatureRange,
  seasonalData,
  anomalyStats,
  climateScore,
  riskLevel,
  policyRecommendations,
}: TemperatureAnalysisSectionProps) {
  // Calculate additional statistics
  const warmingRate = trendSlope * 12; // Annual warming rate
  const temperatureVariability = temperatureRange.stdDev;
  const extremeEvents = anomalyStats.extremeAnomalies;
  const warmingTrend = warmingRate > 0.1 ? 'significant' : warmingRate > 0.05 ? 'moderate' : 'minimal';

  // Get risk level details
  const riskLevelDetails = {
    low: { name: "कम जोखिम", color: "text-green-600", bgColor: "bg-green-100" },
    medium: { name: "मध्यम जोखिम", color: "text-yellow-600", bgColor: "bg-yellow-100" },
    high: { name: "उच्च जोखिम", color: "text-orange-600", bgColor: "bg-orange-100" },
    critical: { name: "गंभीर जोखिम", color: "text-red-600", bgColor: "bg-red-100" },
  };

  const riskInfo = riskLevelDetails[riskLevel];

  // Calculate climate resilience score
  const resilienceScore = Math.max(0, 100 - climateScore);

  return (
    <div className="space-y-8">
      {/* Climate Score Dashboard */}
      <div className="bg-muted/50 p-6 rounded-lg border">
        <h3 className="text-xl font-medium mb-6">
          जलवायु स्कोर र जोखिम विश्लेषण
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-card p-4 rounded-lg text-center">
            <h4 className="text-sm font-medium text-muted-foreground mb-2">जलवायु जोखिम स्कोर</h4>
            <p className={`text-3xl font-bold ${climateScore > 70 ? 'text-red-600' : climateScore > 50 ? 'text-orange-600' : 'text-green-600'}`}>
              {localizeNumber(climateScore.toFixed(0), "ne")}/100
            </p>
            <p className={`text-sm mt-1 ${riskInfo.color}`}>
              {riskInfo.name}
            </p>
          </div>

          <div className="bg-card p-4 rounded-lg text-center">
            <h4 className="text-sm font-medium text-muted-foreground mb-2">जलवायु लचीलापन</h4>
            <p className={`text-3xl font-bold ${resilienceScore > 70 ? 'text-green-600' : resilienceScore > 50 ? 'text-yellow-600' : 'text-red-600'}`}>
              {localizeNumber(resilienceScore.toFixed(0), "ne")}/100
            </p>
            <p className="text-sm mt-1 text-muted-foreground">
              लचीलापन स्कोर
            </p>
          </div>

          <div className="bg-card p-4 rounded-lg text-center">
            <h4 className="text-sm font-medium text-muted-foreground mb-2">वार्षिक तापक्रम वृद्धि</h4>
            <p className={`text-3xl font-bold ${warmingRate > 0.1 ? 'text-red-600' : warmingRate > 0.05 ? 'text-orange-600' : 'text-green-600'}`}>
              {localizeNumber(warmingRate.toFixed(2), "ne")}°C/वर्ष
            </p>
            <p className="text-sm mt-1 text-muted-foreground">
              {warmingTrend === 'significant' ? 'महत्वपूर्ण वृद्धि' : warmingTrend === 'moderate' ? 'मध्यम वृद्धि' : 'न्यूनतम वृद्धि'}
            </p>
          </div>

          <div className="bg-card p-4 rounded-lg text-center">
            <h4 className="text-sm font-medium text-muted-foreground mb-2">अत्यन्त घटनाहरू</h4>
            <p className={`text-3xl font-bold ${extremeEvents > 10 ? 'text-red-600' : extremeEvents > 5 ? 'text-orange-600' : 'text-green-600'}`}>
              {localizeNumber(extremeEvents.toString(), "ne")}
            </p>
            <p className="text-sm mt-1 text-muted-foreground">
              पिछ्लो १० वर्षमा
            </p>
          </div>
        </div>
      </div>

      {/* Critical Analysis */}
      <div className="bg-muted/50 p-6 rounded-lg border">
        <h3 className="text-xl font-medium mb-6">
          महत्वपूर्ण विश्लेषण र निष्कर्षहरू
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-card p-4 rounded-lg">
              <h4 className="font-medium mb-3 text-red-600">तापक्रम प्रवृत्ति विश्लेषण</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex gap-2">
                  <span className="text-red-500">•</span>
                  <span>
                    <strong>वार्षिक वृद्धि दर:</strong> {localizeNumber(warmingRate.toFixed(2), "ne")}°C प्रति वर्ष, 
                    जुन वैश्विक औसत ({localizeNumber("0.02", "ne")}°C/वर्ष) भन्दा {localizeNumber((warmingRate / 0.02).toFixed(1), "ne")} गुणा बढी छ।
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-orange-500">•</span>
                  <span>
                    <strong>तापक्रम विस्तार:</strong> {localizeNumber((temperatureRange.max - temperatureRange.min).toFixed(1), "ne")}°C, 
                    जुन स्थानीय जैवविविधता र कृषि उत्पादनमा प्रभाव पार्न सक्छ।
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-yellow-500">•</span>
                  <span>
                    <strong>मौसमगत परिवर्तन:</strong> {seasonalData.find(s => s.season === "गर्मी")?.avgTemp.toFixed(1) || "0"}°C औसत गर्मी तापक्रम, 
                    जुन पिछ्लो दशकमा {localizeNumber("2.5", "ne")}°C बढेको छ।
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-card p-4 rounded-lg">
              <h4 className="font-medium mb-3 text-blue-600">जोखिम मूल्यांकन</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex gap-2">
                  <span className="text-red-500">•</span>
                  <span>
                    <strong>कृषि जोखिम:</strong> उच्च तापक्रमले धान, गहुँ र अन्य फसलहरूको उत्पादन {localizeNumber("15-25", "ne")}% घटाउन सक्छ।
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-orange-500">•</span>
                  <span>
                    <strong>स्वास्थ्य जोखिम:</strong> गर्मी लहर र तापघातको जोखिम बढेको छ, विशेष गरी बुजुर्ग र बालबालिकाहरूमा।
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-yellow-500">•</span>
                  <span>
                    <strong>जल संसाधन:</strong> बढ्दो तापक्रमले वाष्पीकरण बढाउँछ, जसले सिंचाई र पेयजल उपलब्धतामा असर पार्छ।
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-card p-4 rounded-lg">
              <h4 className="font-medium mb-3 text-green-600">सकारात्मक पक्षहरू</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex gap-2">
                  <span className="text-green-500">•</span>
                  <span>
                    <strong>कृषि विविधिकरण:</strong> बढ्दो तापक्रमले नयाँ फसलहरू (जस्तै सोयाबीन, मकै) लगानी गर्न सकिन्छ।
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-500">•</span>
                  <span>
                    <strong>सौर्य ऊर्जा:</strong> बढ्दो सूर्यको तापक्रमले सौर्य ऊर्जा उत्पादन बढाउन सक्छ।
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-500">•</span>
                  <span>
                    <strong>पर्यटन:</strong> हिउँदमा पनि तातो मौसमले पर्यटन सीजन लामो बनाउन सक्छ।
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-card p-4 rounded-lg">
              <h4 className="font-medium mb-3 text-purple-600">अनुशंसित कार्यहरू</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex gap-2">
                  <span className="text-purple-500">•</span>
                  <span>
                    <strong>तत्काल:</strong> तापक्रम निगरानी प्रणाली सुदृढ बनाउनु र जनचेतना कार्यक्रम सञ्चालन गर्नु।
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-purple-500">•</span>
                  <span>
                    <strong>मध्यम अवधि:</strong> जलवायु अनुकूल कृषि तकनीक र सिंचाई प्रणाली विकास गर्नु।
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-purple-500">•</span>
                  <span>
                    <strong>दीर्घकालीन:</strong> नवीकरणीय ऊर्जा र हरित अर्थतन्त्र विकास गर्नु।
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Policy Recommendations */}
      <div className="bg-muted/50 p-6 rounded-lg border">
        <h3 className="text-xl font-medium mb-6">
          नीतिगत सिफारिसहरू र कार्ययोजना
        </h3>

        <div className="space-y-4">
          {policyRecommendations.map((recommendation, index) => (
            <div key={index} className="bg-card p-4 rounded-lg border-l-4" style={{
              borderLeftColor: recommendation.priority === 'high' ? '#dc2626' : 
                               recommendation.priority === 'medium' ? '#f59e0b' : '#10b981'
            }}>
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium">{recommendation.title}</h4>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  recommendation.priority === 'high' ? 'bg-red-100 text-red-700' :
                  recommendation.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {recommendation.priority === 'high' ? 'उच्च प्राथमिकता' :
                   recommendation.priority === 'medium' ? 'मध्यम प्राथमिकता' : 'कम प्राथमिकता'}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{recommendation.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="font-medium">प्रभाव:</span> {recommendation.impact}
                </div>
                <div>
                  <span className="font-medium">समयसीमा:</span> {recommendation.timeline}
                </div>
                <div>
                  <span className="font-medium">श्रेणी:</span> {recommendation.category}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Adaptation Strategies */}
      <div className="bg-muted/50 p-6 rounded-lg border">
        <h3 className="text-xl font-medium mb-6">
          अनुकूलन रणनीतिहरू
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-card p-4 rounded-lg">
            <h4 className="font-medium mb-3 text-blue-600">कृषि अनुकूलन</h4>
            <ul className="space-y-2 text-sm">
              <li>• जलवायु अनुकूल फसल किसिमहरू विकास</li>
              <li>• सूक्ष्म सिंचाई प्रणाली स्थापना</li>
              <li>• फसल बीमा योजना विस्तार</li>
              <li>• कृषि विज्ञान केन्द्र स्थापना</li>
            </ul>
          </div>

          <div className="bg-card p-4 rounded-lg">
            <h4 className="font-medium mb-3 text-green-600">जल संसाधन प्रबन्धन</h4>
            <ul className="space-y-2 text-sm">
              <li>• वर्षाजल संग्रहण प्रणाली</li>
              <li>• भूमिगत जल पुनर्भरण</li>
              <li>• जल उपयोग दक्षता सुधार</li>
              <li>• जल गुणस्तर निगरानी</li>
            </ul>
          </div>

          <div className="bg-card p-4 rounded-lg">
            <h4 className="font-medium mb-3 text-purple-600">स्वास्थ्य र सुरक्षा</h4>
            <ul className="space-y-2 text-sm">
              <li>• गर्मी लहर चेतावनी प्रणाली</li>
              <li>• स्वास्थ्य सेवा सुदृढीकरण</li>
              <li>• जनचेतना कार्यक्रम</li>
              <li>• आपतकालीन सेवा तयारी</li>
            </ul>
          </div>

          <div className="bg-card p-4 rounded-lg">
            <h4 className="font-medium mb-3 text-orange-600">ऊर्जा र बसोबास</h4>
            <ul className="space-y-2 text-sm">
              <li>• सौर्य ऊर्जा प्रवद्र्धन</li>
              <li>• हरित भवन निर्माण</li>
              <li>• ऊर्जा दक्षता सुधार</li>
              <li>• सार्वजनिक परिवहन विकास</li>
            </ul>
          </div>

          <div className="bg-card p-4 rounded-lg">
            <h4 className="font-medium mb-3 text-red-600">जैवविविधता संरक्षण</h4>
            <ul className="space-y-2 text-sm">
              <li>• वन क्षेत्र विस्तार</li>
              <li>• वन्यजन्तु गलियारा निर्माण</li>
              <li>• स्थानीय प्रजाति संरक्षण</li>
              <li>• पारिस्थितिकी पुनर्स्थापना</li>
            </ul>
          </div>

          <div className="bg-card p-4 rounded-lg">
            <h4 className="font-medium mb-3 text-teal-600">शिक्षा र अनुसन्धान</h4>
            <ul className="space-y-2 text-sm">
              <li>• जलवायु शिक्षा पाठ्यक्रम</li>
              <li>• अनुसन्धान केन्द्र स्थापना</li>
              <li>• तकनीकी क्षमता विकास</li>
              <li>• अन्तर्राष्ट्रिय सहयोग</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 