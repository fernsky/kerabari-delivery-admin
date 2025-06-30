import React from "react";
import { Metadata } from "next";
import {
  Shield,
  Lock,
  Eye,
  FileText,
  UserCheck,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Settings,
  Bell,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

export const metadata: Metadata = {
  title: "गोपनीयता नीति | केराबारी गाउँपालिका",
  description: "केराबारी गाउँपालिका डिजिटल प्रोफाइलको गोपनीयता नीति",
};

export default function PrivacyPolicyPage() {
  // Content sections
  const privacySections = [
    {
      title: "तथ्याङ्क संकलन",
      description: "हामीले तपाईंको बारेमा कसरी र के जानकारी संकलन गर्छौं",
      icon: <FileText className="w-5 h-5" />,
      content: [
        "हामीले प्रयोगकर्ताहरूबाट निम्न जानकारीहरू संकलन गर्न सक्छौं:",
        "• व्यक्तिगत पहिचान जानकारी (नाम, इमेल ठेगाना, फोन नम्बर)",
        "• पालिकामा बसोबास सम्बन्धी जानकारी",
        "• प्राविधिक जानकारी जस्तै IP ठेगाना, उपकरण जानकारी",
        "• अन्य जानकारी जुन तपाईंले हामीलाई उपलब्ध गराउनु हुन्छ",
      ],
    },
    {
      title: "तथ्याङ्कको उपयोग",
      description: "हामीले तपाईंको जानकारी कसरी प्रयोग गर्छौं",
      icon: <UserCheck className="w-5 h-5" />,
      content: [
        "तपाईंबाट संकलित जानकारीहरू निम्न उद्देश्यका लागि प्रयोग गरिन्छ:",
        "• पालिकाको प्रोफाइल सेवा प्रदान गर्न",
        "• प्रयोगकर्ताको अनुभव सुधार गर्न",
        "• वेबसाइटको प्रदर्शन अनुगमन र विश्लेषण गर्न",
        "• हाम्रो सेवाहरूमा सुधार ल्याउन",
        "• सुरक्षा सुनिश्चित गर्न र धोखाधडी पत्ता लगाउन",
      ],
    },
    {
      title: "तथ्याङ्क सुरक्षा",
      description: "हामीले तपाईंको तथ्याङ्क कसरी सुरक्षित राख्छौं",
      icon: <Lock className="w-5 h-5" />,
      content: [
        "हामी निम्न तरिकाहरूबाट तपाईंको जानकारी सुरक्षित राख्न प्रतिबद्ध छौं:",
        "• उच्च स्तरको एन्क्रिप्सन प्रविधि प्रयोग",
        "• नियमित सुरक्षा अडिट र परीक्षण",
        "• सीमित कर्मचारी पहुँच",
        "• अत्याधुनिक डाटा स्टोरेज प्रणाली",
        "• सुरक्षित सर्भर र क्लाउड प्रणाली",
      ],
    },
    {
      title: "कुकी नीति",
      description: "वेबसाइटमा कुकीको प्रयोग सम्बन्धी जानकारी",
      icon: <Settings className="w-5 h-5" />,
      content: [
        "हाम्रो वेबसाइटले तपाईंको अनुभव सुधार गर्न कुकीहरू प्रयोग गर्दछ:",
        "• आवश्यक कुकीहरू: वेबसाइटको सामान्य कार्यका लागि आवश्यक",
        "• प्राथमिकता कुकीहरू: तपाईंको प्राथमिकता सम्झन मद्दत गर्ने",
        "• सुरक्षा कुकीहरू: सुरक्षित लगइन र संरक्षण प्रदान गर्ने",
        "• विश्लेषण कुकीहरू: वेबसाइटको प्रदर्शन र प्रयोग अनुगमन गर्ने",
      ],
    },
    {
      title: "तेस्रो पक्ष साझेदारी",
      description: "हामी कुन तेस्रो पक्षहरूसँग तथ्याङ्क साझा गर्छौं",
      icon: <Eye className="w-5 h-5" />,
      content: [
        "हामी निम्न अवस्थामा मात्र तपाईंको जानकारी तेस्रो पक्षसँग साझा गर्न सक्छौं:",
        "• कानूनी आवश्यकता पूरा गर्न",
        "• सार्वजनिक सुरक्षा वा राष्ट्रिय हित संरक्षण गर्न",
        "• हाम्रो वेबसाइट सेवा प्रदायक र प्राविधिक सहयोगीहरू",
        "• स्पष्ट रूपमा तपाईंको सहमति प्राप्त गरेर",
        "• सरकारी निकायहरूसँग आधिकारिक तथ्याङ्क साझेदारीमा",
      ],
    },
    {
      title: "प्रयोगकर्ता अधिकार",
      description: "तपाईंको जानकारी सम्बन्धी अधिकारहरू",
      icon: <BookOpen className="w-5 h-5" />,
      content: [
        "तपाईंसँग आफ्नो व्यक्तिगत जानकारी सम्बन्धी निम्न अधिकारहरू छन्:",
        "• जानकारी हेर्ने र प्रतिलिपि पाउने अधिकार",
        "• जानकारी सच्याउने वा अद्यावधिक गर्ने अधिकार",
        "• जानकारी मेटाउने अधिकार (कानूनी सीमा भित्र)",
        "• जानकारी प्रशोधनमा आपत्ति जनाउने अधिकार",
        "• डाटा पोर्टेबिलिटी (डाटा स्थानान्तरण) को अधिकार",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#FCFCFD]">
      {/* Header Section with Background */}
      <div className="relative w-full">
        <div className="bg-gradient-to-r from-[#0b1f42] to-[#1a4894] py-16 md:py-24">
          <div className="absolute inset-0 bg-[url('/patterns/topography.svg')] opacity-10 mix-blend-overlay" />

          <div className="container px-4 sm:px-6 max-w-5xl mx-auto relative z-10">
            <Badge
              variant="outline"
              className="mb-4 px-3 py-1 bg-white/95 backdrop-blur-sm border-white/20 shadow-sm inline-flex items-center"
            >
              <Shield className="w-3.5 h-3.5 mr-1.5 text-[#1a4894]" />
              <span className="text-xs text-[#0b1f42] font-medium">
                आधिकारिक दस्तावेज
              </span>
            </Badge>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              गोपनीयता नीति
            </h1>

            <p className="text-white/90 text-lg max-w-3xl">
              केराबारी गाउँपालिकाको डिजिटल प्रोफाइलमा तपाईंको गोपनीयता हाम्रो
              प्राथमिकता हो। यस नीतिले हामीले संकलन गर्ने जानकारी, त्यसको प्रयोग
              र सुरक्षाको बारेमा व्याख्या गर्दछ।
            </p>
          </div>
        </div>

        {/* Last Updated Badge */}
        <div className="container px-4 sm:px-6 max-w-5xl mx-auto">
          <div className="relative -mt-6 flex justify-center md:justify-end">
            <Badge
              variant="outline"
              className="bg-white shadow-md border-[#123772]/20 px-3 py-1.5 text-xs"
            >
              <Bell className="w-3.5 h-3.5 mr-1.5 text-[#123772]" />
              अन्तिम अद्यावधिक: फागुन १५, २०८०
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container px-4 sm:px-6 max-w-5xl mx-auto py-12">
        <div className="mb-8 bg-gradient-to-r from-[#0b1f42]/5 to-[#1a4894]/5 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4 text-[#0b1f42]">
            हामीले तपाईंको गोपनीयताको सम्मान गर्छौं
          </h2>
          <p className="text-gray-700">
            केराबारी गाउँपालिकाको डिजिटल प्रोफाइल प्रयोग गरेर, तपाईंले यस
            गोपनीयता नीति अन्तर्गत आफ्नो जानकारी संकलन र प्रशोधन गर्न सहमति
            दिनुहुन्छ। यो नीति समय-समयमा परिमार्जन हुन सक्छ, त्यसैले कृपया
            नियमित रूपमा यसलाई हेर्नुहोला।
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {privacySections.map((section, index) => (
            <Card
              key={index}
              className="overflow-hidden shadow-sm hover:shadow-md transition-all"
            >
              <CardHeader className="bg-gradient-to-r from-[#0b1f42]/5 to-[#1a4894]/5 border-b border-[#123772]/10">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-gradient-to-br from-[#123772] to-[#0b1f42] text-white">
                    {section.icon}
                  </div>
                  <div>
                    <CardTitle className="text-lg text-[#0b1f42]">
                      {section.title}
                    </CardTitle>
                    <CardDescription className="text-[#123772]/70">
                      {section.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {section.content.map((paragraph, i) => (
                    <p
                      key={i}
                      className={
                        i === 0 ? "font-medium text-[#123772]" : "text-gray-600"
                      }
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Final Notes */}
        <div className="mt-12 bg-white p-6 rounded-xl border border-[#123772]/10 shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-[#0b1f42] flex items-center">
            <CheckCircle2 className="w-5 h-5 mr-2 text-[#1a4894]" />
            अन्तिम जानकारी
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <p className="text-gray-700">
                यो गोपनीयता नीति केराबारी गाउँपालिकाको डिजिटल प्रोफाइल
                वेबसाइटमा मात्र लागू हुन्छ। बाह्य वेबसाइटका लिंकहरू तपाईंको
                सुविधाको लागि प्रदान गरिएका हुन् र तिनीहरूको आफ्नै गोपनीयता नीति
                हुन सक्छ।
              </p>

              <p className="text-gray-700">
                यदि तपाईंसँग यस गोपनीयता नीतिको बारेमा कुनै प्रश्न छ भने, कृपया
                हामीलाई सम्पर्क गर्नुहोस्।
              </p>
            </div>

            <div className="flex justify-center items-center">
              <div className="relative h-48 w-48">
                <Image
                  src="/images/privacy-shield.svg"
                  alt="डाटा सुरक्षा"
                  width={200}
                  height={200}
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
