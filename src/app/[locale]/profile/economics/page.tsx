import {
  ChevronRight,
  BarChart3,
  Home,
  LandPlot,
  WalletCards,
  Briefcase,
  Store,
  Cloud,
  Sprout,
  Apple,
  Wheat,
  SunMedium,
  Plane,
  Leaf,
  Bean,
  Utensils,
  Beef,
  Bug,
} from "lucide-react";
import { api } from "@/trpc/server";
import Image from "next/image";
import { localizeNumber } from "@/lib/utils/localize-number";
import type { Metadata } from "next";
import Link from "next/link";

// Force dynamic rendering since we're using tRPC which relies on headers
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "केराबारी गाउँपालिका आर्थिक अवस्था | डिजिटल प्रोफाइल",
  description:
    "केराबारी गाउँपालिकाको आर्थिक तथ्याङ्क: घरपरिवारको आय स्रोत, खेती, पशुपालन, रोजगारी, व्यावसायिक क्षेत्र, उत्पादन विवरण र आर्थिक विकास सम्बन्धी जानकारी।",
  keywords: [
    "केराबारी गाउँपालिका",
    "आर्थिक अवस्था",
    "कृषि",
    "पशुपालन",
    "रोजगारी",
    "सिंचाई",
    "घरधुरी",
    "कृषि उत्पादन",
    "वैदेशिक रोजगारी",
    "विप्रेषण",
  ],
  openGraph: {
    title: "केराबारी गाउँपालिका आर्थिक अवस्था | डिजिटल प्रोफाइल",
    description:
      "केराबारी गाउँपालिकाको आर्थिक तथ्याङ्क: घरपरिवारको आय स्रोत, खेती, पशुपालन, रोजगारी, व्यावसायिक क्षेत्र, उत्पादन विवरण र आर्थिक विकास सम्बन्धी जानकारी।",
    type: "article",
    locale: "ne_NP",
    siteName: "केराबारी गाउँपालिका डिजिटल प्रोफाइल",
  },
};

const toc = [
  { level: 2, text: "परिचय", slug: "introduction" },
  { level: 2, text: "प्रमुख आर्थिक तथ्यहरू", slug: "key-economics" },
  { level: 2, text: "आर्थिक श्रेणीहरू", slug: "economic-categories" },
  { level: 2, text: "कृषि तथा पशुपालन", slug: "agriculture-livestock" },
];

const economicCategories = [
  {
    title: "विशेष सीप भएका मानव संशाधन",
    description:
      "केराबारी गाउँपालिकामा उपलब्ध विशेष सीप भएका मानव संशाधनको वडागत विवरण र विश्लेषण।",
    href: "/profile/economics/ward-main-skills",
    icon: <Briefcase className="h-5 w-5" />,
  },
  {
    title: "घरको स्वामित्वको आधारमा घरधुरी",
    description:
      "केराबारी गाउँपालिकामा घरको स्वामित्व (आफ्नै, भाडा, संस्थागत आदि) अनुसार घरधुरी वितरण।",
    href: "/profile/economics/ward-wise-house-ownership",
    icon: <Home className="h-5 w-5" />,
  },
  {
    title: "जगको आधारमा घरधुरी",
    description:
      "केराबारी गाउँपालिकामा घरको जग/फाउण्डेसनको प्रकार अनुसार घरधुरीको वितरण र विश्लेषण।",
    href: "/profile/economics/ward-wise-household-base",
    icon: <LandPlot className="h-5 w-5" />,
  },
  {
    title: "बाहिरी गारोको आधारमा घरधुरी",
    description:
      "केराबारी गाउँपालिकामा घरको बाहिरी गारो (इट्टा, ढुङ्गा, माटो आदि) को प्रकार अनुसार घरधुरी विवरण।",
    href: "/profile/economics/ward-wise-household-outer-wall",
    icon: <Home className="h-5 w-5" />,
  },
  {
    title: "वैदेशिक रोजगारीमा गएकाहरूको विवरण",
    description:
      "केराबारी गाउँपालिकाबाट वैदेशिक रोजगारीमा गएका व्यक्तिहरूको देश अनुसार वितरण र विश्लेषण।",
    href: "/profile/economics/ward-wise-foreign-employment-countries",
    icon: <Plane className="h-5 w-5" />,
  },
  {
    title: "वैदेशिक रोजगारीबाट प्राप्त विप्रेषण",
    description:
      "केराबारी गाउँपालिकामा वैदेशिक रोजगारीबाट प्राप्त हुने विप्रेषणको वडागत विश्लेषण।",
    href: "/profile/economics/ward-wise-remittance",
    icon: <WalletCards className="h-5 w-5" />,
  },
  {
    title: "जग्गाको स्वामित्वको आधारमा घरधुरी",
    description:
      "केराबारी गाउँपालिकामा जग्गाको स्वामित्व अनुसार घरधुरीहरूको वडागत वितरण।",
    href: "/profile/economics/ward-wise-land-ownership",
    icon: <LandPlot className="h-5 w-5" />,
  },
  {
    title: "सिंचाई सुविधाको उपलब्धता",
    description:
      "केराबारी गाउँपालिकामा सिंचाई भएको र नभएको क्षेत्रको वडागत विवरण र विश्लेषण।",
    href: "/profile/economics/ward-wise-irrigated-area",
    icon: <Cloud className="h-5 w-5" />,
  },
  {
    title: "सिंचाईको स्रोतको आधारमा सिंचित जमिन",
    description:
      "केराबारी गाउँपालिकामा विभिन्न सिंचाई स्रोत (नदी, कुलो, बोरिङ्ग आदि) अनुसार सिंचित जमिन।",
    href: "/profile/economics/municipality-wide-irrigation-source",
    icon: <Cloud className="h-5 w-5" />,
  },
  {
    title: "अन्नबाली उत्पादन",
    description:
      "केराबारी गाउँपालिकामा उत्पादन हुने विभिन्न अन्नबालीहरूको विस्तृत उत्पादन विवरण।",
    href: "/profile/economics/municipality-wide-food-crops",
    icon: <Wheat className="h-5 w-5" />,
  },
  {
    title: "दलहनबाली उत्पादन",
    description:
      "केराबारी गाउँपालिकामा उत्पादन हुने विभिन्न दलहनबालीहरूको विस्तृत विवरण र उत्पादन परिमाण।",
    href: "/profile/economics/municipality-wide-pulses",
    icon: <Bean className="h-5 w-5" />,
  },
  {
    title: "तेलबाली उत्पादन",
    description:
      "केराबारी गाउँपालिकामा उत्पादन हुने विभिन्न तेलबालीहरूको तथ्याङ्क र विश्लेषण।",
    href: "/profile/economics/municipality-wide-oil-seeds",
    icon: <SunMedium className="h-5 w-5" />,
  },
  {
    title: "फलफुलबाली उत्पादन",
    description:
      "केराबारी गाउँपालिकामा उत्पादन हुने विभिन्न फलफुल बालीहरूको विस्तृत उत्पादन विवरण।",
    href: "/profile/economics/municipality-wide-fruits",
    icon: <Apple className="h-5 w-5" />,
  },
  {
    title: "मसलाबाली उत्पादन",
    description:
      "केराबारी गाउँपालिकामा उत्पादन हुने विभिन्न मसलाबालीहरूको विस्तृत उत्पादन तथ्याङ्क।",
    href: "/profile/economics/municipality-wide-spices",
    icon: <Sprout className="h-5 w-5" />,
  },
  {
    title: "तरकारीबाली उत्पादन",
    description:
      "केराबारी गाउँपालिकामा उत्पादन हुने विभिन्न तरकारीबालीहरूको विस्तृत तथ्याङ्क र विश्लेषण।",
    href: "/profile/economics/municipality-wide-vegetables",
    icon: <Leaf className="h-5 w-5" />,
  },
  {
    title: "पशुपन्छीजन्य वस्तुको उत्पादन",
    description:
      "केराबारी गाउँपालिकामा उत्पादन हुने विभिन्न पशुपन्छीजन्य वस्तुहरूको विवरण र परिमाण।",
    href: "/profile/economics/municipality-wide-animal-products",
    icon: <Beef className="h-5 w-5" />,
  },
  {
    title: "खाद्यान्न बालीमा लाग्ने रोग विवरण",
    description:
      "केराबारी गाउँपालिकामा खाद्यान्न बालीमा लाग्ने प्रमुख रोगहरू र तिनको प्रभाव सम्बन्धी विवरण।",
    href: "/profile/economics/municipality-wide-crop-diseases",
    icon: <Bug className="h-5 w-5" />,
  },
  {
    title: "तरकारी तथा फलफूलमा लाग्ने रोग/किरा",
    description:
      "केराबारी गाउँपालिकामा तरकारी तथा फलफूलमा लाग्ने प्रमुख रोग र किराहरूको विस्तृत विवरण।",
    href: "/profile/economics/municipality-wide-vegetables-and-fruits-diseases",
    icon: <Bug className="h-5 w-5" />,
  },
  {
    title: "व्यवसायिक कृषि/पशुपालन फर्महरू",
    description:
      "केराबारी गाउँपालिकामा रहेका व्यवसायिक कृषि तथा पशुपालन फर्महरूको विवरण र विश्लेषण।",
    href: "/profile/economics/commercial-agricultural-animal-husbandry-farmers-group",
    icon: <Store className="h-5 w-5" />,
  },
  {
    title: "कृषि वा पशुपालनमा आबद्ध घरधुरी",
    description:
      "केराबारी गाउँपालिकामा कृषि तथा पशुपालनमा संलग्न घरधुरीहरूको वडागत वितरण र विश्लेषण।",
    href: "/profile/economics/ward-wise-households-in-agriculture",
    icon: <Utensils className="h-5 w-5" />,
  },
  {
    title: "सहकारी संस्थाहरू सम्बन्धी विवरण",
    description:
      "केराबारी गाउँपालिकामा सञ्चालित सहकारी संस्थाहरूको प्रकार, सदस्य संख्या र कार्यक्षेत्र सम्बन्धी विवरण।",
    href: "/profile/economics/cooperatives",
    icon: <Store className="h-5 w-5" />,
  },
];

export default async function EconomicsPage() {
  let agriculturalData;
  let landData;
  let remittanceData;

  try {
    // You can replace these with actual API calls
    agriculturalData =
      await api.profile.economics.wardWiseHouseholdsInAgriculture.getAll
        .query()
        .catch(() => null);
    landData = await api.profile.economics.wardWiseLandOwnership.getAll
      .query()
      .catch(() => null);
    remittanceData = await api.profile.economics.wardWiseRemittance.getAll
      .query()
      .catch(() => null);
  } catch (error) {
    console.error("Error fetching economic summary data:", error);
  }
  // Calculate municipality totals if data is available
  const agriculturalHouseholds = agriculturalData
    ? agriculturalData.reduce(
        (sum, item) => sum + (item.involvedInAgriculture || 0),
        0,
      )
    : null;

  const landOwningHouseholds = landData
    ? landData.reduce(
        (sum, item) =>
          item.landOwnershipType === "PRIVATE"
            ? sum + (item.households || 0)
            : sum,
        0,
      )
    : null;

  const remittanceReceivingHouseholds = remittanceData
    ? remittanceData.reduce(
        (sum, item) => sum + (item.sendingPopulation || 0),
        0,
      )
    : null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-8">
        {/* Hero Section */}
        <div className="relative rounded-lg overflow-hidden">
          <Image
            src="/images/economics-hero.svg"
            alt="केराबारी गाउँपालिका आर्थिक अवस्था"
            width={1200}
            height={400}
            className="w-full h-[300px] object-cover"
            priority
          />
        </div>
        <div className="mt-6 px-2">
          <h1 className="text-4xl font-bold mb-3">
            केराबारी गाउँपालिकाको आर्थिक अवस्था
          </h1>
        </div>

        {/* Introduction Section */}
        <section id="introduction">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p>
              केराबारी गाउँपालिकाको आर्थिक प्रोफाइलमा यहाँका नागरिकहरूको आय
              स्रोत, रोजगारीको अवस्था, कृषि तथा पशुपालनको स्थिति, वैदेशिक
              रोजगारी, विप्रेषण लगायतका आर्थिक सूचकहरू समेटिएका छन्। यी
              तथ्याङ्कहरूले स्थानीय अर्थतन्त्रको अवस्था बुझ्न, आर्थिक विकासका
              लागि योजना बनाउन र प्राथमिकताहरू निर्धारण गर्न महत्वपूर्ण आधार
              प्रदान गर्दछन्।
            </p>
            <p>
              यस खण्डमा प्रस्तुत गरिएका आर्थिक तथ्याङ्कहरूले केराबारी
              गाउँपालिकाको आर्थिक विकासको वर्तमान अवस्था, चुनौतीहरू र
              सम्भावनाहरूलाई प्रकाश पार्दछन्। यसबाट स्थानीय सरकार, निजी क्षेत्र,
              गैरसरकारी संस्थाहरू र अन्य सरोकारवालाहरूलाई आर्थिक नीति निर्माण,
              कार्यक्रम कार्यान्वयन र प्रभावकारिता मूल्याङ्कनमा सघाउ पुग्नेछ।
            </p>
          </div>
        </section>

        {/* Key Economics Section */}
        <section id="key-economics">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight border-b pb-2 mb-6">
              प्रमुख आर्थिक तथ्यहरू
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Key stats cards */}
            <div className="bg-muted/20 border rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium mb-2">कृषिमा आबद्ध घरधुरी</h3>
              <p className="text-3xl font-bold text-primary">
                {agriculturalHouseholds !== null
                  ? localizeNumber(
                      agriculturalHouseholds.toLocaleString(),
                      "ne",
                    )
                  : "लोड हुँदैछ..."}
              </p>
            </div>

            <div className="bg-muted/20 border rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium mb-2">
                आफ्नो जग्गा भएका घरधुरी
              </h3>
              <p className="text-3xl font-bold text-primary">
                {landOwningHouseholds !== null
                  ? localizeNumber(landOwningHouseholds.toLocaleString(), "ne")
                  : "लोड हुँदैछ..."}
              </p>
            </div>

            <div className="bg-muted/20 border rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium mb-2">
                विप्रेषण प्राप्त घरधुरी
              </h3>
              <p className="text-3xl font-bold text-primary">
                {remittanceReceivingHouseholds !== null
                  ? localizeNumber(
                      remittanceReceivingHouseholds.toLocaleString(),
                      "ne",
                    )
                  : "लोड हुँदैछ..."}
              </p>
            </div>

            <div className="bg-muted/20 border rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium mb-2">
                प्रमुख आर्थिक क्षेत्र
              </h3>
              <p className="text-3xl font-bold text-primary">कृषि</p>
            </div>
          </div>
        </section>

        {/* Economic Categories Section */}
        <section id="economic-categories" className="my-8">
          <div className="prose prose-lg dark:prose-invert max-w-none mb-6">
            <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight border-b pb-2">
              आर्थिक श्रेणीहरू
            </h2>
            <p>
              केराबारी गाउँपालिकाको आर्थिक अवस्था सम्बन्धी विस्तृत जानकारीका
              लागि तलका श्रेणीहरू हेर्नुहोस्। प्रत्येक श्रेणीमा विस्तृत
              तथ्याङ्क, चार्ट र विश्लेषण प्रस्तुत गरिएको छ।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {economicCategories.map((category, i) => (
              <Link
                key={i}
                href={category.href}
                className="flex flex-col h-full group hover:shadow-md transition-all duration-200 bg-background border rounded-lg overflow-hidden"
              >
                <div className="p-6 flex-grow">
                  <div className="flex items-start gap-4">
                    <div className="mt-1 rounded-full bg-primary/10 p-2 text-primary">
                      {category.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                        {category.title}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {category.description}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="px-6 py-3 bg-muted/20 flex items-center justify-end">
                  <span className="text-sm text-primary font-medium flex items-center">
                    हेर्नुहोस् <ChevronRight className="h-4 w-4 ml-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Agriculture and Livestock Section */}
        <section id="agriculture-livestock" className="my-8">
          <div className="prose prose-lg dark:prose-invert max-w-none mb-6">
            <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight border-b pb-2">
              कृषि तथा पशुपालन
            </h2>
            <p>
              केराबारी गाउँपालिकाको प्रमुख आर्थिक क्षेत्र कृषि तथा पशुपालन
              हो। यहाँ विभिन्न प्रकारका अन्नबाली, दलहनबाली, तेलबाली, फलफूल,
              तरकारी र मसलाबालीहरूको उत्पादन हुन्छ। कृषि तथा पशुपालनमा आबद्ध
              घरधुरीको विस्तृत विवरण हेर्न&nbsp;
              <Link
                href="/profile/economics/ward-wise-households-in-agriculture"
                className="text-primary hover:text-primary/80 font-medium"
              >
                कृषि वा पशुपालनमा आबद्ध घरधुरी
              </Link>
              मा जानुहोस्। व्यवसायिक कृषि तथा पशुपालन फर्महरूको जानकारीका
              लागि&nbsp;
              <Link
                href="/profile/economics/commercial-agricultural-animal-husbandry-farmers-group"
                className="text-primary hover:text-primary/80 font-medium"
              >
                व्यवसायिक कृषि/पशुपालन फर्महरू
              </Link>
              मा जानुहोस्।
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
