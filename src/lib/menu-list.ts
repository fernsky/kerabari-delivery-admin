import { PersonIcon } from "@radix-ui/react-icons";
import {
  LayoutGrid,
  LucideIcon,
  LandPlot,
  UsersRound,
  AreaChart,
  FormInput,
  GitPullRequest,
  Building2,
  ScanBarcode,
  Store,
  User2Icon,
  Paperclip,
  Home,
  PersonStanding,
  Wheat,
  BarChart3, // For demographic summary icon
  LineChart, // Add this import for the ward time series icon
  Building, // For institutions icon
  MapPin, // For local areas icon
  Route, // For roads icon
  ParkingCircle, // For parking facilities icon
  Bus,
  TowerControl,
  StoreIcon, // For public transport icon
  Tag,
  Users,
  Settings,
  Bookmark,
  SquarePen,
  FileText, // Add this import
} from "lucide-react";

export type Role = "admin" | "superadmin" | "enumerator";

type Submenu = {
  href: string;
  label: string;
  active?: boolean;
  roles?: Role[];
};

type Menu = {
  href: string;
  label: string;
  active?: boolean;
  icon: LucideIcon;
  roles?: Role[];
  submenus?: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

const menuConfig: Menu[] = [
  {
    href: "/",
    label: "होम",
    icon: LayoutGrid,
    roles: ["admin", "superadmin", "enumerator"],
  },
  {
    href: "/dashboard/households",
    label: "घरधुरीहरू",
    icon: Home,
    roles: ["admin", "superadmin", "enumerator"],
  },
  {
    href: "/dashboard/businesses",
    label: "व्यवसायहरू",
    icon: StoreIcon,
    roles: ["admin", "superadmin", "enumerator"],
  },
  {
    href: "/dashboard/individuals",
    label: "व्यक्तिहरू",
    icon: BarChart3,
    roles: ["admin", "superadmin", "enumerator"],
  },
  // Demographics submenu with children
  {
    href: "/dashboard/digital-profile/demographics",
    label: "जनसांख्यिकी",
    icon: BarChart3,
    roles: ["admin", "superadmin"],
    submenus: [
      {
        href: "/dashboard/digital-profile/demographics/demographics-summary",
        label: "सारांश",
        roles: ["admin", "superadmin"],
      },
      {
        href: "/dashboard/digital-profile/demographics/ward-time-series",
        label: "समय शृंखला",
        roles: ["admin", "superadmin"],
      },
      {
        href: "/dashboard/digital-profile/demographics/ward-househead-gender",
        label: "घरमूली लिङ्ग",
        roles: ["admin", "superadmin"],
      },
      {
        href: "/dashboard/digital-profile/demographics/ward-age-population",
        label: "उमेर जनसंख्या",
        roles: ["admin", "superadmin"],
      },
      {
        href: "/dashboard/digital-profile/demographics/ward-wise-demographic-summary",
        label: "वडा सारांश",
        roles: ["admin", "superadmin"],
      },
      {
        href: "/dashboard/digital-profile/demographics/ward-wise-caste-population",
        label: "जाति जनसंख्या",
        roles: ["admin", "superadmin"],
      },
      {
        href: "/dashboard/digital-profile/demographics/ward-wise-mother-tongue-population",
        label: "मातृभाषा",
        roles: ["admin", "superadmin"],
      },
      {
        href: "/dashboard/digital-profile/demographics/ward-wise-religion-population",
        label: "धर्म",
        roles: ["admin", "superadmin"],
      },
      {
        href: "/dashboard/digital-profile/demographics/age-wise-marital-status",
        label: "वैवाहिक स्थिति",
        roles: ["admin", "superadmin"],
      },
      {
        href: "/dashboard/digital-profile/demographics/ward-age-gender-wise-married-age",
        label: "विवाह उमेर",
        roles: ["admin", "superadmin"],
      },
      {
        href: "/dashboard/digital-profile/demographics/ward-age-gender-wise-absentee",
        label: "उमेर र लिङ्ग अनुसार प्रवासी",
        roles: ["admin", "superadmin"],
      },
      {
        href: "/dashboard/digital-profile/demographics/ward-wise-absentee-educational-level",
        label: "प्रवासी शिक्षा स्तर",
        roles: ["admin", "superadmin"],
      },
      {
        href: "/dashboard/digital-profile/demographics/ward-wise-absentee-educational-level",
        label: "प्रवासी शिक्षा स्तर",
        roles: ["admin", "superadmin"],
      },
      {
        href: "/dashboard/digital-profile/demographics/ward-wise-absentee-absence-reason",
        label: "प्रवासी अनुपस्थितिको कारण",
        roles: ["admin", "superadmin"],
      },
      {
        href: "/dashboard/digital-profile/demographics/ward-wise-absentee-location",
        label: "प्रवासी स्थान",
        roles: ["admin", "superadmin"],
      },
    ],
  },

  {
    href: "#",
    label: "अर्थशास्त्र",
    icon: LineChart,
    roles: ["admin", "superadmin"],
    submenus: [
      {
        href: "/dashboard/digital-profile/economics/ward-age-gender-wise-economically-active-population",
        label: "आर्थिक रुपमा सक्रिय जनसंख्या",
        roles: ["admin", "superadmin"],
      },
      {
        href: "/dashboard/digital-profile/economics/ward-wise-major-occupation",
        label: "मुख्य पेशा",
        roles: ["admin", "superadmin"],
      },
      {
        href: "/dashboard/digital-profile/economics/ward-wise-household-chores",
        label: "घरायसी कामको समय विवरण",
        roles: ["admin", "superadmin"],
      },
      {
        href: "/dashboard/digital-profile/economics/ward-wise-household-income-source",
        label: "घरधुरी आय स्रोत",
        roles: ["admin", "superadmin"],
      },
      {
        href: "/dashboard/digital-profile/economics/ward-wise-remittance-expense-type",
        label: "रिमिटेन्स र खर्च",
        roles: ["admin", "superadmin"],
      },
      {
        href: "/dashboard/digital-profile/economics/ward-wise-annual-income-sustenance",
        label: "वार्षिक आय अनुसार खाद्य सुरक्षा",
        roles: ["admin", "superadmin"],
      },
      {
        href: "/dashboard/digital-profile/economics/ward-wise-households-on-loan",
        label: "ऋण लिएका घरधुरी",
        roles: ["admin", "superadmin"],
      },
      {
        href: "/dashboard/digital-profile/economics/ward-wise-households-loan-use",
        label: "ऋणको प्रयोग",
        roles: ["admin", "superadmin"],
      },
      {
        href: "/dashboard/digital-profile/economics/ward-wise-trained-population",
        label: "तालिम प्राप्त जनसंख्या",
        roles: ["admin", "superadmin"],
      },
      {
        href: "/dashboard/digital-profile/economics/ward-wise-major-skills",
        label: "प्रमुख सीप",
        roles: ["admin", "superadmin"],
      },
      {
        href: "/dashboard/digital-profile/economics/imported-products",
        label: "आयातित उत्पादनहरू",
        roles: ["admin", "superadmin"],
      },
      {
        href: "/dashboard/digital-profile/economics/exported-products",
        label: "निर्यातित उत्पादनहरू",
        roles: ["admin", "superadmin"],
      },
      {
        href: "/dashboard/digital-profile/economics/ward-wise-household-land-possessions",
        label: "घरधुरी जग्गा स्वामित्व विवरण",
        roles: ["admin", "superadmin"],
      },
    ],
  },

  // Agricultural menu with submenus
  {
    href: "#",
    label: "कृषिगत क्षेत्र",
    icon: Wheat,
    roles: ["admin", "superadmin"],
    submenus: [
      {
        href: "/dashboard/digital-profile/institutions/agricultural/agric-zones",
        label: "कृषि क्षेत्रहरू",
        roles: ["admin", "superadmin"],
      },
      {
        href: "/dashboard/digital-profile/institutions/agricultural/farms",
        label: "फार्महरू",
        roles: ["admin", "superadmin"],
      },
      {
        href: "/dashboard/digital-profile/institutions/agricultural/fish-farms",
        label: "माछा फार्महरू",
        roles: ["admin", "superadmin"],
      },
      {
        href: "/dashboard/digital-profile/institutions/agricultural/grasslands",
        label: "चरन क्षेत्रहरू",
        roles: ["admin", "superadmin"],
      },
      {
        href: "/dashboard/digital-profile/institutions/agricultural/grazing-areas",
        label: "चरन खर्क क्षेत्रहरू",
        roles: ["admin", "superadmin"],
      },
      {
        href: "/dashboard/digital-profile/institutions/agricultural/processing-centers",
        label: "प्रशोधन केन्द्रहरू",
        roles: ["admin", "superadmin"],
      },
    ],
  },

  // Local Areas menu
  {
    href: "/dashboard/digital-profile/institutions/local-areas",
    label: "स्थानीय क्षेत्रहरू",
    icon: MapPin,
    roles: ["admin", "superadmin"],
  },

  // Transportation menu with submenus
  {
    href: "#",
    label: "यातायात",
    icon: Route,
    roles: ["admin", "superadmin"],
    submenus: [
      {
        href: "/dashboard/digital-profile/institutions/transportation/roads",
        label: "सडकहरू",
        roles: ["admin", "superadmin"],
      },
      {
        href: "/dashboard/digital-profile/institutions/transportation/parking-facilities",
        label: "पार्किङ सुविधाहरू",
        roles: ["admin", "superadmin"],
      },
      {
        href: "/dashboard/digital-profile/institutions/transportation/public-transports",
        label: "सार्वजनिक यातायात",
        roles: ["admin", "superadmin"],
      },
      {
        href: "/dashboard/digital-profile/institutions/transportation/petrol-pumps",
        label: "पेट्रोल पम्पहरू",
        roles: ["admin", "superadmin"],
      },
    ],
  },

  // Cultural menu with submenus
  {
    href: "#",
    label: "सांस्कृतिक",
    icon: Building,
    roles: ["admin", "superadmin"],
    submenus: [
      {
        href: "/dashboard/digital-profile/institutions/cultural/religious-places",
        label: "धार्मिक स्थलहरू",
        roles: ["admin", "superadmin"],
      },
      {
        href: "/dashboard/digital-profile/institutions/cultural/historical-sites",
        label: "ऐतिहासिक स्थलहरू",
        roles: ["admin", "superadmin"],
      },
    ],
  },

  // Digital Profile main menu with submenus
  {
    href: "#",
    label: "डिजिटल प्रोफाइल",
    icon: FileText,
    roles: ["admin", "superadmin"],
    submenus: [
      {
        href: "/dashboard/digital-profile/report-preview",
        label: "प्रतिवेदन पूर्वावलोकन",
        roles: ["admin", "superadmin"],
      },
      {
        href: "/dashboard/digital-profile/demographics",
        label: "जनसांख्यिकी",
        roles: ["admin", "superadmin"],
      },
      {
        href: "/dashboard/digital-profile/economics",
        label: "आर्थिक",
        roles: ["admin", "superadmin"],
      },
      {
        href: "/dashboard/digital-profile/institutions",
        label: "संस्थाहरू",
        roles: ["admin", "superadmin"],
      },
    ],
  },

  //   {
  //     href: "/qr-code",
  //     label: "क्यूआर कोड",
  //     icon: ScanBarcode,
  //     roles: ["enumerator"],
  //   },
  //   {
  //     href: "/requested-areas",
  //     label: "अनुरोध गरिएका क्षेत्रहरू",
  //     icon: LandPlot,
  //     roles: ["enumerator"],
  //   },
  //   {
  //     href: "/account",
  //     label: "प्रयोगकर्ता खाता",
  //     icon: User2Icon,
  //     roles: ["enumerator"],
  //   },
  //   {
  //     href: "/collections",
  //     label: "मेरो संग्रह",
  //     icon: Paperclip,
  //     roles: ["enumerator"],
  //   },

  //   {
  //     href: "/ward",
  //     label: "वडाहरू",
  //     icon: AreaChart,
  //     roles: ["admin", "superadmin"],
  //     submenus: [],
  //   },
  //   {
  //     href: "/area",
  //     label: "क्षेत्रहरू",
  //     icon: LandPlot,
  //     roles: ["admin", "superadmin"],
  //     submenus: [],
  //   },
  //   {
  //     href: "/buildings",
  //     label: "भवनहरू",
  //     icon: Building2,
  //     roles: ["admin", "superadmin"],
  //   },
  //   {
  //     href: "/businesses",
  //     label: "व्यवसायहरू",
  //     icon: Store,
  //     roles: ["admin", "superadmin"],
  //   },
  //   {
  //     href: "/families",
  //     label: "परिवारहरू",
  //     icon: UsersRound,
  //     roles: ["admin", "superadmin"],
  //   },
  // {
  //     href: "/submissions",
  //     label: "प्रस्तुतिहरू",
  //     icon: Paperclip,
  //     roles: ["admin", "superadmin"],
  //     submenus: [],
  //   },
  //   {
  //     href:"/wardwise",
  //     label: "वडा अनुसार डाटा",
  //     icon:Home,
  //     roles: ["admin", "superadmin"],
  //     submenus:[],
  //   },
  //  {
  //     href:"/enumeratorwise",
  //     label: "गणकअनुसार डाटा",
  //     icon:PersonStanding,
  //     roles: ["admin", "superadmin"],
  //     submenus:[],
  //   },
  //   {
  //     href: "/individuals",
  //     label: "व्यक्तिहरू",
  //     icon: User2Icon,
  //     roles: ["admin", "superadmin"],
  //   },
  //   {
  //     href: "/deaths",
  //     label: "मृत्युहरू",
  //     icon: GitPullRequest,
  //     roles: ["admin", "superadmin"],
  //   },
  //   {
  //     href: "/enumerators",
  //     label: "गणकहरू",
  //     icon: UsersRound,
  //     roles: ["admin", "superadmin"],
  //     submenus: [],
  //   },
];

export function getMenuList(pathname: string, userRole: Role): Group[] {
  const filteredMenus = menuConfig.filter(
    (menu) => !menu.roles || menu.roles.includes(userRole),
  );

  return [
    {
      groupLabel: "",
      menus: filteredMenus,
    },
  ];
}
