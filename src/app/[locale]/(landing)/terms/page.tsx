import React from "react";
import { Metadata } from "next";
import {
  FileText,
  ScrollText,
  AlertCircle,
  GanttChart,
  Scale,
  FileWarning,
  Info,
  MessageSquare,
  Bell,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "नियम र शर्तहरू | केराबारी गाउँपालिका",
  description: "केराबारी गाउँपालिका डिजिटल प्रोफाइल प्रयोगका नियम र शर्तहरू",
};

export default function TermsPage() {
  // Content sections
  const termsSections = [
    {
      title: "वेबसाइट प्रयोग",
      description: "वेबसाइट प्रयोग सम्बन्धी नियमहरू",
      icon: <FileText className="w-5 h-5" />,
      content: [
        "केराबारी गाउँपालिकाको डिजिटल प्रोफाइल वेबसाइट प्रयोग गर्दा निम्न नियमहरू लागू हुनेछन्:",
        "• वेबसाइटको सामग्रीको प्रयोग व्यक्तिगत, गैर-व्यावसायिक प्रयोजनको लागि मात्र गर्न सकिनेछ",
        "• स्रोत खुलाएर शैक्षिक र अनुसन्धान उद्देश्यका लागि सामग्री प्रयोग गर्न सकिनेछ",
        "• सामग्रीको कुनै पनि प्रकारको दुरुपयोग, परिवर्तन वा वितरण गर्न पाइने छैन",
        "• स्वचालित प्रणालीद्वारा वेबसाइटको सामग्री संकलन (स्क्रेपिंग) गर्न प्रतिबन्धित छ",
      ],
    },
    {
      title: "प्रयोगकर्ता उत्तरदायित्व",
      description: "प्रयोगकर्ताको जिम्मेवारी सम्बन्धी शर्तहरू",
      icon: <AlertCircle className="w-5 h-5" />,
      content: [
        "वेबसाइट प्रयोग गर्दा प्रयोगकर्ताले निम्न जिम्मेवारीहरू वहन गर्नुपर्नेछ:",
        "• आफूले प्रदान गरेको जानकारीको सत्यता र शुद्धताको सुनिश्चितता गर्ने",
        "• अरूलाई हानि पुर्याउने, धम्की दिने वा उत्पीडन गर्ने कुनै पनि क्रियाकलापमा संलग्न नहुने",
        "• आफ्नो खाता विवरण गोप्य राख्ने र सुरक्षित प्रयोग गर्ने",
        "• कानुन विपरीतका कुनै पनि गतिविधिमा वेबसाइटको प्रयोग नगर्ने",
      ],
    },
    {
      title: "बौद्धिक सम्पत्ति",
      description: "बौद्धिक सम्पत्ति अधिकार सम्बन्धी जानकारी",
      icon: <Scale className="w-5 h-5" />,
      content: [
        "वेबसाइटमा रहेका सामग्रीहरू बौद्धिक सम्पत्ति कानून अन्तर्गत संरक्षित छन्:",
        "• लोगो, चित्र, ग्राफिक, लेआउट र डिजाइन केराबारी गाउँपालिकाको स्वामित्वमा छन्",
        "• सबै डाटासेट र तथ्याङ्क सरकारी स्वामित्वमा छन् र यस पालिकाको अनुमति बिना व्यापारिक प्रयोग गर्न पाइँदैन",
        "• सार्वजनिक जानकारीका सामग्रीहरू स्रोत खुलाएर प्रयोग गर्न सकिनेछ",
        "• अनुमति बिना सामग्री प्रतिलिपि गर्न पाइने छैन",
      ],
    },
    {
      title: "जवाफदेहिता सीमाहरू",
      description: "पालिकाको जवाफदेहिताका सीमाहरू",
      icon: <GanttChart className="w-5 h-5" />,
      content: [
        "केराबारी गाउँपालिका निम्न अवस्थाहरूमा जवाफदेही हुने छैन:",
        "• वेबसाइटको प्रयोगबाट सिर्जना हुने कुनै पनि प्रत्यक्ष वा अप्रत्यक्ष क्षति",
        "• तथ्याङ्कमा हुनसक्ने अशुद्धता वा त्रुटिका कारण हुने नतिजाहरू",
        "• वेबसाइटमा रहेका बाह्य लिङ्कहरूको सामग्री वा सेवा",
        "• प्राविधिक समस्या, सर्भर डाउनटाइम वा साइबर आक्रमणका कारण हुने अवरोध",
        "• प्रयोगकर्ताले उपलब्ध गराएको जानकारीको गलत प्रयोग",
      ],
    },
    {
      title: "परिवर्तनहरू",
      description: "नियम र शर्तहरू परिवर्तन सम्बन्धी प्रावधान",
      icon: <FileWarning className="w-5 h-5" />,
      content: [
        "केराबारी गाउँपालिकाले यी नियम र शर्तहरू परिवर्तन गर्ने अधिकार राख्दछ:",
        "• परिवर्तनहरू वेबसाइटमा प्रकाशित भएपछि तुरुन्तै प्रभावकारी हुनेछन्",
        "• महत्वपूर्ण परिवर्तनहरूको बारेमा वेबसाइटमा सूचना प्रकाशित गरिनेछ",
        "• परिवर्तन पश्चात पनि वेबसाइट प्रयोग गर्नु प्रयोगकर्ताको सहमति मानिनेछ",
        "• नियमित रूपमा यी शर्तहरू पढ्न प्रयोगकर्तालाई सुझाव दिइन्छ",
      ],
    },
    {
      title: "कानूनी अधिकारक्षेत्र",
      description: "कानूनी प्रावधान र क्षेत्राधिकार",
      icon: <ScrollText className="w-5 h-5" />,
      content: [
        "यी नियम र शर्तहरू नेपालको कानून अनुसार व्याख्या र लागू गरिनेछ:",
        "• कुनै विवाद उत्पन्न भएमा नेपालको कानून अनुसार समाधान गरिनेछ",
        "• नेपालको अदालतले यस सम्बन्धी विवादहरूमा क्षेत्राधिकार राख्नेछ",
        "• विवाद समाधानका लागि पहिले मध्यस्थताको प्रयास गरिनेछ",
        "• प्रयोगकर्ताले नेपालको सम्बन्धित कानूनहरूको पालना गर्नु पर्नेछ",
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
              <ScrollText className="w-3.5 h-3.5 mr-1.5 text-[#1a4894]" />
              <span className="text-xs text-[#0b1f42] font-medium">
                आधिकारिक दस्तावेज
              </span>
            </Badge>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              नियम र शर्तहरू
            </h1>

            <p className="text-white/90 text-lg max-w-3xl">
              केराबारी गाउँपालिकाको डिजिटल प्रोफाइल सेवा प्रयोग गर्नु अघि
              कृपया यी नियम र शर्तहरू ध्यानपूर्वक पढ्नुहोस्। यी शर्तहरू स्वीकार
              गरेपछि मात्र वेबसाइट प्रयोग गर्नु उपयुक्त हुनेछ।
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
        <div className="mb-8 bg-white rounded-xl p-6 shadow-sm border border-[#123772]/10">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 space-y-4">
              <h2 className="text-lg font-semibold text-[#0b1f42] flex items-center">
                <Info className="w-5 h-5 mr-2 text-[#1a4894]" />
                महत्वपूर्ण जानकारी
              </h2>

              <p className="text-gray-700">
                यस वेबसाइट प्रयोग गरेर, तपाईंले यी सम्पूर्ण नियम र शर्तहरू पढेर
                बुझेको मानिनेछ। यदि तपाईं यी शर्तहरू स्वीकार गर्न चाहनुहुन्न
                भने, यस वेबसाइटको प्रयोगबाट तुरुन्तै रोक्नुहोस्। यस वेबसाइटका
                सबै सुविधा र सामग्रीहरू यी शर्तहरूको अधीनमा रहेर प्रदान
                गरिन्छन्।
              </p>

              <p className="text-[#123772] font-medium">
                यो दस्तावेज कानूनी रूपमा बाध्यकारी सम्झौता हो जसले केराबारी
                गाउँपालिका र प्रयोगकर्ताबीचको सम्बन्धलाई परिभाषित गर्दछ।
              </p>
            </div>

            <div className="hidden md:flex items-center justify-center">
              <div className="p-4 rounded-full bg-gradient-to-br from-[#123772]/10 to-[#1a4894]/10">
                <div className="p-4 rounded-full bg-gradient-to-br from-[#123772]/20 to-[#1a4894]/20">
                  <div className="p-6 rounded-full bg-gradient-to-br from-[#123772] to-[#0b1f42] text-white">
                    <ScrollText className="w-10 h-10" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Terms Sections */}
        <div className="space-y-6">
          {termsSections.map((section, index) => (
            <Card
              key={index}
              className="overflow-hidden shadow-sm hover:shadow-md transition-all border border-[#123772]/10"
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

        {/* Contact Section */}
        <div className="mt-12 bg-white p-6 rounded-xl border border-[#123772]/10 shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-[#0b1f42] flex items-center">
            <MessageSquare className="w-5 h-5 mr-2 text-[#1a4894]" />
            सम्पर्क जानकारी
          </h2>

          <p className="text-gray-700 mb-4">
            यी नियम र शर्तहरूको बारेमा कुनै प्रश्न, स्पष्टीकरण वा सुझाव भएमा,
            कृपया हामीलाई निम्न माध्यमबाट सम्पर्क गर्न सक्नुहुनेछ:
          </p>

          <div className="grid md:grid-cols-2 gap-6 mt-4">
            <div className="p-4 bg-[#123772]/5 rounded-lg">
              <h3 className="font-medium text-[#0b1f42] mb-2">
                कार्यालय ठेगाना
              </h3>
              <p className="text-gray-700">
                केराबारी गाउँपालिका कार्यालय
                <br />
                मोरङ, कोशी प्रदेश
                <br />
                नेपाल
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center sm:justify-end">
            <Link href="/privacy" passHref>
              <Button
                variant="outline"
                className="border-[#123772]/20 text-[#123772] hover:bg-[#123772]/5"
              >
                गोपनीयता नीति हेर्नुहोस्
              </Button>
            </Link>

            <Link href="/" passHref>
              <Button className="bg-gradient-to-r from-[#0b1f42] to-[#1a4894] text-white hover:shadow-md">
                मुख्य पृष्ठमा फिर्ता
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
