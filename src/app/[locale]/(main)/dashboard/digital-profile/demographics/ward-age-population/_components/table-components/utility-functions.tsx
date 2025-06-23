export type Gender = "MALE" | "FEMALE" | "OTHER";
export type AgeGroup =
  | "AGE_0_4"
  | "AGE_5_9"
  | "AGE_10_14"
  | "AGE_15_19"
  | "AGE_20_24"
  | "AGE_25_29"
  | "AGE_30_34"
  | "AGE_35_39"
  | "AGE_40_44"
  | "AGE_45_49"
  | "AGE_50_54"
  | "AGE_55_59"
  | "AGE_60_64"
  | "AGE_65_69"
  | "AGE_70_74"
  | "AGE_75_AND_ABOVE";

// Define age groups categories
export const ageGroupCategories = [
  {
    name: "Children",
    groups: ["AGE_0_4", "AGE_5_9", "AGE_10_14"],
    color: "bg-blue-50",
  },
  {
    name: "Youth",
    groups: ["AGE_15_19", "AGE_20_24", "AGE_25_29"],
    color: "bg-green-50",
  },
  {
    name: "Adults",
    groups: [
      "AGE_30_34",
      "AGE_35_39",
      "AGE_40_44",
      "AGE_45_49",
      "AGE_50_54",
      "AGE_55_59",
    ],
    color: "bg-amber-50",
  },
  {
    name: "Elderly",
    groups: ["AGE_60_64", "AGE_65_69", "AGE_70_74", "AGE_75_AND_ABOVE"],
    color: "bg-orange-50",
  },
];

export function getAgeGroupLabel(ageGroup: AgeGroup): string {
  switch (ageGroup) {
    case "AGE_0_4":
      return "०-४ वर्ष";
    case "AGE_5_9":
      return "५-९ वर्ष";
    case "AGE_10_14":
      return "१०-१४ वर्ष";
    case "AGE_15_19":
      return "१५-१९ वर्ष";
    case "AGE_20_24":
      return "२०-२४ वर्ष";
    case "AGE_25_29":
      return "२५-२९ वर्ष";
    case "AGE_30_34":
      return "३०-३४ वर्ष";
    case "AGE_35_39":
      return "३५-३९ वर्ष";
    case "AGE_40_44":
      return "४०-४४ वर्ष";
    case "AGE_45_49":
      return "४५-४९ वर्ष";
    case "AGE_50_54":
      return "५०-५४ वर्ष";
    case "AGE_55_59":
      return "५५-५९ वर्ष";
    case "AGE_60_64":
      return "६०-६४ वर्ष";
    case "AGE_65_69":
      return "६५-६९ वर्ष";
    case "AGE_70_74":
      return "७०-७४ वर्ष";
    case "AGE_75_AND_ABOVE":
      return "७५+ वर्ष";
    default:
      return ageGroup;
  }
}

export function getAgeGroupCategoryColor(ageGroup: AgeGroup): string {
  for (const category of ageGroupCategories) {
    if (category.groups.includes(ageGroup)) {
      return category.color;
    }
  }
  return "";
}

export function getAgeGroupCategoryName(ageGroup: AgeGroup): string {
  for (const category of ageGroupCategories) {
    if (category.groups.includes(ageGroup)) {
      return category.name;
    }
  }
  return "";
}

export function getGenderLabel(gender: Gender): string {
  switch (gender) {
    case "MALE":
      return "पुरुष";
    case "FEMALE":
      return "महिला";
    case "OTHER":
      return "अन्य";
    default:
      return gender;
  }
}

export function getGenderBadgeColor(gender: Gender): string {
  switch (gender) {
    case "MALE":
      return "bg-blue-100 text-blue-800";
    case "FEMALE":
      return "bg-pink-100 text-pink-800";
    case "OTHER":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export function getGenderBgColor(gender: Gender): string {
  switch (gender) {
    case "MALE":
      return "bg-blue-50";
    case "FEMALE":
      return "bg-pink-50";
    case "OTHER":
      return "bg-purple-50";
    default:
      return "";
  }
}

export function getAllAgeGroups(): AgeGroup[] {
  return ageGroupCategories.flatMap(
    (category) => category.groups,
  ) as AgeGroup[];
}
