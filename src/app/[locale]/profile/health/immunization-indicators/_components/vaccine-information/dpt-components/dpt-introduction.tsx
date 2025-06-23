export function DPTIntroduction() {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        <span className="english-font">DPT-HepB-Hib</span> खोपको परिचय र इतिहास
      </h2>
      
      <div className="prose prose-lg max-w-none space-y-6">
        <p className="text-lg leading-relaxed text-gray-700">
          <span className="english-font font-medium">DPT-HepB-Hib</span> खोप आधुनिक चिकित्सा विज्ञानको एक महत्वपूर्ण उपलब्धि हो जसले एकै पटकमा पाँचवटा जीवनलाई खतरा पुर्याउने रोगहरूविरुद्ध सुरक्षा प्रदान गर्छ। यो संयुक्त खोप (Combination Vaccine) को रूपमा विकसित गरिएको हो जसले बच्चाहरूलाई कम इन्जेक्सनमा बढी सुरक्षा दिन्छ।
        </p>
        
        <p className="text-lg leading-relaxed text-gray-700">
          यो खोप विश्व स्वास्थ्य संगठन (WHO) द्वारा सिफारिस गरिएको छ र नेपालमा २००९ सालदेखि राष्ट्रिय खोप कार्यक्रम अन्तर्गत प्रदान गरिएको छ। यसअघि यी रोगहरूविरुद्ध छुट्टाछुट्टै खोपहरू दिनुपर्थ्यो, तर अहिले एकै खोपमा सबै सुरक्षा मिल्छ।
        </p>

        <p className="text-lg leading-relaxed text-gray-700">
          <span className="english-font">DPT-HepB-Hib</span> खोपको सबैभन्दा महत्वपूर्ण विशेषता यो हो कि यसले बच्चाहरूमा मृत्युदर बढाउने पाँचवटा मुख्य रोगहरूविरुद्ध एकसाथ सुरक्षा प्रदान गर्छ। यी रोगहरू विशेषगरी २ वर्षमुनिका बच्चाहरूमा अत्यन्त घातक हुन्छन्।
        </p>
      </div>

      <h3 className="text-xl font-semibold mt-8 mb-4 text-gray-800">खोपको संरचना र प्राविधिक विवरण</h3>
      
      <div className="bg-blue-50 p-6 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
          <div>
            <h4 className="font-semibold text-blue-900 mb-3">मुख्य घटकहरू:</h4>
            <ul className="space-y-2 text-sm leading-relaxed">
              <li>• <span className="english-font font-medium">Diphtheria Toxoid</span> - डिफ्थेरिया विरुद्ध</li>
              <li>• <span className="english-font font-medium">Pertussis antigen</span> - खोक्खर खोकी विरुद्ध</li>
              <li>• <span className="english-font font-medium">Tetanus Toxoid</span> - टिटानस विरुद्ध</li>
              <li>• <span className="english-font font-medium">Hepatitis B surface antigen</span> - हेपाटाइटिस बी विरुद्ध</li>
              <li>• <span className="english-font font-medium">Hib conjugate</span> - हिमोफिलस इन्फ्लुएन्जा विरुद्ध</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-blue-900 mb-3">दिने तरिका र मात्रा:</h4>
            <ul className="space-y-2 text-sm leading-relaxed">
              <li>• दाहिने वा बाँयो जांघको माथिल्लो भाग</li>
              <li>• मांसपेशीमा (<span className="english-font">Intramuscular</span>) विधिबाट</li>
              <li>• <span className="english-font">0.5 ml</span> मात्रामा प्रत्येक खुराक</li>
              <li>• तीन चरणमा (६, १०, १४ हप्तामा)</li>
              <li>• प्रत्येक खुराकबीच कम्तिमा ४ हप्ताको अन्तर</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
