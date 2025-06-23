"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CalendarIcon,
  InfoIcon,
  MapPin,
  Check,
  X,
  Tractor,
  Users,
  Home,
  Leaf,
  Bean,
  Droplets,
  LandPlot,
  Tally4,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface FarmDetailsProps {
  farm: any;
}

export function FarmDetails({ farm }: FarmDetailsProps) {
  // Get farm type label
  const getFarmTypeLabel = (type: string) => {
    const types = {
      CROP_FARM: "बाली फार्म",
      LIVESTOCK_FARM: "पशुपालन फार्म",
      MIXED_FARM: "मिश्रित फार्म",
      POULTRY_FARM: "पंक्षी फार्म",
      DAIRY_FARM: "डेरी फार्म",
      AQUACULTURE_FARM: "जलकृषि फार्म",
      HORTICULTURE_FARM: "बागवानी फार्म",
      APICULTURE_FARM: "मौरी पालन",
      SERICULTURE_FARM: "रेशम खेती",
      ORGANIC_FARM: "जैविक फार्म",
      COMMERCIAL_FARM: "व्यावसायिक फार्म",
      SUBSISTENCE_FARM: "जीविकोपार्जन फार्म",
      AGROFORESTRY: "कृषि वन",
      OTHER: "अन्य",
    };
    return types[type as keyof typeof types] || type;
  };

  // Get farming system label
  const getFarmingSystemLabel = (system: string | null) => {
    if (!system) return "उल्लेख नभएको";

    const systems = {
      CONVENTIONAL: "परम्परागत",
      ORGANIC: "जैविक",
      INTEGRATED: "एकीकृत",
      CONSERVATION: "संरक्षणात्मक",
      HYDROPONIC: "हाइड्रोपोनिक",
      PERMACULTURE: "परमाकल्चर",
      BIODYNAMIC: "जैव गतिशील",
      TRADITIONAL: "परम्परागत",
      MIXED: "मिश्रित",
    };
    return systems[system as keyof typeof systems] || system;
  };

  // Get soil type label
  const getSoilTypeLabel = (soil: string | null) => {
    if (!soil) return "उल्लेख नभएको";

    const soils = {
      CLAY: "चिम्ट्याइलो माटो",
      SANDY: "बलौटे माटो",
      LOAM: "दोमट माटो",
      SILT: "पाँगो माटो",
      CLAY_LOAM: "चिम्ट्याइलो दोमट माटो",
      SANDY_LOAM: "बलौटे दोमट माटो",
      SILTY_CLAY: "पाँगो चिम्ट्याइलो माटो",
      ROCKY: "ढुंगेनी माटो",
      PEATY: "ग्यागो माटो",
      CHALKY: "चुने माटो",
      MIXED: "मिश्रित माटो",
    };
    return soils[soil as keyof typeof soils] || soil;
  };

  // Get irrigation type label
  const getIrrigationTypeLabel = (irrigation: string | null) => {
    if (!irrigation) return "उल्लेख नभएको";

    const irrigations = {
      RAINFED: "वर्षामा आधारित",
      CANAL: "कुलो/नहर",
      DRIP: "थोपा सिँचाई",
      SPRINKLER: "फुहारा सिँचाई",
      FLOOD: "जलाशय सिँचाई",
      GROUNDWATER: "भूमिगत पानी",
      RAINWATER_HARVESTING: "आकाशे पानी संकलन",
      NONE: "छैन",
      MIXED: "मिश्रित",
    };
    return irrigations[irrigation as keyof typeof irrigations] || irrigation;
  };

  // Get livestock housing label
  const getLivestockHousingLabel = (housing: string | null) => {
    if (!housing) return "उल्लेख नभएको";

    const housings = {
      OPEN_SHED: "खुला गोठ",
      BARN: "भकारी",
      FREE_STALL: "स्वतन्त्र स्टल",
      TIE_STALL: "बाँधेर राख्ने स्टल",
      DEEP_LITTER: "गहिरो ओछ्यान",
      CAGE_SYSTEM: "पिंजडा प्रणाली",
      FREE_RANGE: "खुला चरण",
      MOVABLE_PEN: "चल्ने खोर",
      ZERO_GRAZING: "शून्य चरण",
      MIXED: "मिश्रित",
    };
    return housings[housing as keyof typeof housings] || housing;
  };

  // Get land ownership label
  const getLandOwnershipLabel = (ownership: string | null) => {
    if (!ownership) return "उल्लेख नभएको";

    const ownerships = {
      OWNED: "आफ्नै",
      LEASED: "भाडामा",
      COMMUNITY: "सामुदायिक",
      SHARED: "साझेदारी",
      GOVERNMENT: "सरकारी",
      MIXED: "मिश्रित",
    };
    return ownerships[ownership as keyof typeof ownerships] || ownership;
  };

  // Get education level label
  const getEducationLabel = (edu: string | null) => {
    if (!edu) return "उल्लेख नभएको";

    const education = {
      NONE: "शिक्षा छैन",
      PRIMARY: "प्राथमिक तह",
      SECONDARY: "माध्यमिक तह",
      HIGHER_SECONDARY: "उच्च माध्यमिक तह",
      BACHELORS: "स्नातक तह",
      MASTERS: "स्नातकोत्तर तह",
      PHD: "विद्यावारिधि",
      VOCATIONAL: "प्राविधिक शिक्षा",
      OTHER: "अन्य",
    };
    return education[edu as keyof typeof education] || edu;
  };

  return (
    <div className="space-y-6">
      {/* Main Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <InfoIcon className="h-5 w-5 text-muted-foreground" />
            आधारभूत जानकारी
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          {/* Description */}
          {farm.description && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                विवरण
              </h3>
              <p className="text-base">{farm.description}</p>
            </div>
          )}

          {/* Farm Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                फार्मको प्रकार
              </h3>
              <div>
                <Badge variant="outline" className="text-base font-normal">
                  {getFarmTypeLabel(farm.farmType)}
                </Badge>
              </div>
            </div>

            {farm.farmingSystem && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  खेती प्रणाली
                </h3>
                <div>
                  <Badge variant="outline" className="text-base font-normal">
                    {getFarmingSystemLabel(farm.farmingSystem)}
                  </Badge>
                </div>
              </div>
            )}
          </div>

          {/* Location Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {farm.wardNumber && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  वडा नं.
                </h3>
                <p>{farm.wardNumber}</p>
              </div>
            )}

            {farm.location && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  ठाउँ/टोल
                </h3>
                <p>{farm.location}</p>
              </div>
            )}

            {farm.address && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  ठेगाना
                </h3>
                <p>{farm.address}</p>
              </div>
            )}
          </div>

          {/* Farm Size and Land Details */}
          <div className="space-y-3 pt-4 border-t">
            <div className="flex items-center gap-2">
              <LandPlot className="h-5 w-5 text-primary" />
              <h3 className="text-base font-medium">जग्गा विवरण</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {farm.totalAreaInHectares !== null &&
                farm.totalAreaInHectares !== undefined && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      जम्मा क्षेत्रफल
                    </h3>
                    <p>{farm.totalAreaInHectares} हेक्टर</p>
                  </div>
                )}

              {farm.cultivatedAreaInHectares !== null &&
                farm.cultivatedAreaInHectares !== undefined && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      खेती गरिएको क्षेत्रफल
                    </h3>
                    <p>{farm.cultivatedAreaInHectares} हेक्टर</p>
                  </div>
                )}

              {farm.landOwnership && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    जग्गाको स्वामित्व
                  </h3>
                  <p>{getLandOwnershipLabel(farm.landOwnership)}</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {farm.soilType && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    माटोको प्रकार
                  </h3>
                  <p>{getSoilTypeLabel(farm.soilType)}</p>
                </div>
              )}

              {farm.irrigationType && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    सिंचाइको प्रकार
                  </h3>
                  <p>{getIrrigationTypeLabel(farm.irrigationType)}</p>
                </div>
              )}

              {farm.irrigatedAreaInHectares !== null &&
                farm.irrigatedAreaInHectares !== undefined && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      सिंचित क्षेत्रफल
                    </h3>
                    <p>{farm.irrigatedAreaInHectares} हेक्टर</p>
                  </div>
                )}
            </div>

            {farm.irrigationSourceDetails && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  सिंचाइ स्रोतको विवरण
                </h3>
                <p>{farm.irrigationSourceDetails}</p>
              </div>
            )}
          </div>

          {/* Crop Details */}
          <div className="space-y-3 pt-4 border-t">
            <div className="flex items-center gap-2">
              <Bean className="h-5 w-5 text-primary" />
              <h3 className="text-base font-medium">बाली विवरण</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {farm.mainCrops && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    मुख्य बालीहरू
                  </h3>
                  <p>{farm.mainCrops}</p>
                </div>
              )}

              {farm.secondaryCrops && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    सहायक बालीहरू
                  </h3>
                  <p>{farm.secondaryCrops}</p>
                </div>
              )}
            </div>

            {farm.croppingSeasons && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  बाली मौसमहरू
                </h3>
                <p>{farm.croppingSeasons}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {farm.cropRotation ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <X className="h-4 w-4 text-gray-400" />
                  )}
                  <h3 className="text-sm font-medium">बाली चक्र</h3>
                </div>
                {farm.cropRotation && farm.cropRotationDetails && (
                  <p className="ml-6 text-sm">{farm.cropRotationDetails}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {farm.intercropping ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <X className="h-4 w-4 text-gray-400" />
                  )}
                  <h3 className="text-sm font-medium">अन्तरबाली</h3>
                </div>
              </div>
            </div>

            {farm.annualCropYieldMT !== null &&
              farm.annualCropYieldMT !== undefined && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    वार्षिक बाली उत्पादन
                  </h3>
                  <p>
                    {farm.annualCropYieldMT} मेट्रिक टन
                    {farm.recordedYearCrops && ` (${farm.recordedYearCrops})`}
                  </p>
                </div>
              )}
          </div>

          {/* Livestock Details */}
          {farm.hasLivestock && (
            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-center gap-2">
                <Tally4 className="h-5 w-5 text-primary" />
                <h3 className="text-base font-medium">पशुपालन विवरण</h3>
              </div>

              {farm.livestockTypes && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    पशुधनको प्रकार
                  </h3>
                  <p>{farm.livestockTypes}</p>
                </div>
              )}

              {/* Livestock counts */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {farm.cattleCount > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      गाई/गोरु
                    </h3>
                    <p>{farm.cattleCount} वटा</p>
                  </div>
                )}

                {farm.buffaloCount > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      भैंसी/राँगा
                    </h3>
                    <p>{farm.buffaloCount} वटा</p>
                  </div>
                )}

                {farm.goatCount > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      बाख्रा
                    </h3>
                    <p>{farm.goatCount} वटा</p>
                  </div>
                )}

                {farm.sheepCount > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      भेडा
                    </h3>
                    <p>{farm.sheepCount} वटा</p>
                  </div>
                )}

                {farm.pigCount > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      सुँगुर/बंगुर
                    </h3>
                    <p>{farm.pigCount} वटा</p>
                  </div>
                )}

                {farm.poultryCount > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      कुखुरा
                    </h3>
                    <p>{farm.poultryCount} वटा</p>
                  </div>
                )}

                {farm.otherLivestockCount > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      अन्य
                    </h3>
                    <p>{farm.otherLivestockCount} वटा</p>
                    {farm.otherLivestockDetails && (
                      <p className="text-xs text-gray-500">
                        {farm.otherLivestockDetails}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {farm.livestockHousingType && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    पशुधन आवास प्रकार
                  </h3>
                  <p>{getLivestockHousingLabel(farm.livestockHousingType)}</p>
                </div>
              )}

              {farm.livestockManagementDetails && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    पशुधन व्यवस्थापन विवरण
                  </h3>
                  <p>{farm.livestockManagementDetails}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {farm.annualMilkProductionLiters > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      वार्षिक दुध उत्पादन
                    </h3>
                    <p>{farm.annualMilkProductionLiters} लिटर</p>
                  </div>
                )}

                {farm.annualEggProduction > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      वार्षिक अण्डा उत्पादन
                    </h3>
                    <p>{farm.annualEggProduction} वटा</p>
                  </div>
                )}

                {farm.annualMeatProductionKg > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      वार्षिक मासु उत्पादन
                    </h3>
                    <p>{farm.annualMeatProductionKg} के.जी.</p>
                  </div>
                )}
              </div>

              {farm.recordedYearLivestock && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    अभिलेखित पशुधन वर्ष
                  </h3>
                  <p>{farm.recordedYearLivestock}</p>
                </div>
              )}
            </div>
          )}

          {/* Farmer Details */}
          <div className="space-y-3 pt-4 border-t">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <h3 className="text-base font-medium">किसान विवरण</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {farm.ownerName && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    मालिकको नाम
                  </h3>
                  <p>{farm.ownerName}</p>
                </div>
              )}

              {farm.ownerContact && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    मालिकको सम्पर्क
                  </h3>
                  <p>{farm.ownerContact}</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {farm.farmerType && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    किसानको प्रकार
                  </h3>
                  <p>{farm.farmerType}</p>
                </div>
              )}

              {farm.farmerEducation && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    किसानको शिक्षा
                  </h3>
                  <p>{getEducationLabel(farm.farmerEducation)}</p>
                </div>
              )}

              {farm.farmerExperienceYears !== null &&
                farm.farmerExperienceYears !== undefined && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      अनुभव
                    </h3>
                    <p>{farm.farmerExperienceYears} वर्ष</p>
                  </div>
                )}
            </div>

            {farm.hasCooperativeMembership && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <h3 className="text-sm font-medium">सहकारी सदस्यता</h3>
                </div>
                {farm.cooperativeName && (
                  <p className="ml-6">{farm.cooperativeName}</p>
                )}
              </div>
            )}
          </div>

          {/* Farm Infrastructure */}
          <div className="space-y-3 pt-4 border-t">
            <div className="flex items-center gap-2">
              <Home className="h-5 w-5 text-primary" />
              <h3 className="text-base font-medium">फार्म पूर्वाधार</h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                {farm.hasFarmHouse ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <X className="h-4 w-4 text-gray-400" />
                )}
                <span>फार्म हाउस</span>
              </div>

              <div className="flex items-center gap-2">
                {farm.hasStorage ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <X className="h-4 w-4 text-gray-400" />
                )}
                <span>भण्डारण सुविधा</span>
              </div>

              <div className="flex items-center gap-2">
                {farm.hasElectricity ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <X className="h-4 w-4 text-gray-400" />
                )}
                <span>बिजुली</span>
              </div>

              <div className="flex items-center gap-2">
                {farm.hasRoadAccess ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <X className="h-4 w-4 text-gray-400" />
                )}
                <span>सडक पहुँच</span>
              </div>
            </div>

            {farm.hasStorage &&
              farm.storageCapacityMT !== null &&
              farm.storageCapacityMT !== undefined && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    भण्डारण क्षमता
                  </h3>
                  <p>{farm.storageCapacityMT} मेट्रिक टन</p>
                </div>
              )}

            {farm.hasFarmEquipment && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <h3 className="text-sm font-medium">फार्म उपकरणहरू</h3>
                </div>
                {farm.equipmentDetails && (
                  <p className="ml-6">{farm.equipmentDetails}</p>
                )}
              </div>
            )}

            {farm.hasRoadAccess && farm.roadAccessType && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  सडक पहुँचको प्रकार
                </h3>
                <p>{farm.roadAccessType}</p>
              </div>
            )}
          </div>

          {/* Sustainability Practices */}
          <div className="space-y-3 pt-4 border-t">
            <div className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-primary" />
              <h3 className="text-base font-medium">दिगोपन अभ्यासहरू</h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                {farm.usesChemicalFertilizer ? (
                  <Check className="h-4 w-4 text-amber-600" />
                ) : (
                  <X className="h-4 w-4 text-green-600" />
                )}
                <span>रासायनिक मल प्रयोग</span>
              </div>

              <div className="flex items-center gap-2">
                {farm.usesPesticides ? (
                  <Check className="h-4 w-4 text-amber-600" />
                ) : (
                  <X className="h-4 w-4 text-green-600" />
                )}
                <span>कीटनाशक प्रयोग</span>
              </div>

              <div className="flex items-center gap-2">
                {farm.usesOrganicMethods ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <X className="h-4 w-4 text-gray-400" />
                )}
                <span>जैविक विधिहरू</span>
              </div>

              <div className="flex items-center gap-2">
                {farm.composting ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <X className="h-4 w-4 text-gray-400" />
                )}
                <span>कम्पोस्टिङ</span>
              </div>

              <div className="flex items-center gap-2">
                {farm.rainwaterHarvesting ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <X className="h-4 w-4 text-gray-400" />
                )}
                <span>वर्षात पानी सङ्कलन</span>
              </div>

              <div className="flex items-center gap-2">
                {farm.hasCertifications ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <X className="h-4 w-4 text-gray-400" />
                )}
                <span>प्रमाणीकरण</span>
              </div>
            </div>

            {farm.soilConservationPractices && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  माटो संरक्षण अभ्यासहरू
                </h3>
                <p>{farm.soilConservationPractices}</p>
              </div>
            )}

            {farm.manureManagement && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  मलको व्यवस्थापन
                </h3>
                <p>{farm.manureManagement}</p>
              </div>
            )}

            {farm.hasCertifications && farm.certificationDetails && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  प्रमाणीकरण विवरण
                </h3>
                <p>{farm.certificationDetails}</p>
              </div>
            )}
          </div>

          {/* Technical Support and Training */}
          <div className="space-y-3 pt-4 border-t">
            <h3 className="text-base font-medium">
              प्राविधिक सहयोग र प्रशिक्षण
            </h3>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {farm.receivesExtensionServices ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <X className="h-4 w-4 text-gray-400" />
                )}
                <span>विस्तार सेवाहरू प्राप्त</span>
              </div>
              {farm.receivesExtensionServices &&
                farm.extensionServiceProvider && (
                  <p className="ml-6 text-sm">
                    {farm.extensionServiceProvider}
                  </p>
                )}
            </div>

            {farm.trainingReceived && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  प्राप्त तालिम
                </h3>
                <p>{farm.trainingReceived}</p>
              </div>
            )}

            {farm.technicalSupportNeeds && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  प्राविधिक सहयोगका आवश्यकताहरू
                </h3>
                <p>{farm.technicalSupportNeeds}</p>
              </div>
            )}
          </div>

          {/* Challenges and Opportunities */}
          <div className="space-y-3 pt-4 border-t">
            <h3 className="text-base font-medium">चुनौती र अवसरहरू</h3>

            {farm.majorChallenges && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  प्रमुख चुनौतीहरू
                </h3>
                <p>{farm.majorChallenges}</p>
              </div>
            )}

            {farm.disasterVulnerabilities && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  प्रकोप संवेदनशीलता
                </h3>
                <p>{farm.disasterVulnerabilities}</p>
              </div>
            )}

            {farm.growthOpportunities && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  वृद्धि अवसरहरू
                </h3>
                <p>{farm.growthOpportunities}</p>
              </div>
            )}

            {farm.futureExpansionPlans && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  भविष्यका विस्तार योजनाहरू
                </h3>
                <p>{farm.futureExpansionPlans}</p>
              </div>
            )}
          </div>

          {/* Economics Details */}
          <div className="space-y-3 pt-4 border-t">
            <div className="flex items-center gap-2">
              <Tractor className="h-5 w-5 text-primary" />
              <h3 className="text-base font-medium">आर्थिक विवरण</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {farm.familyLaborCount !== null &&
                farm.familyLaborCount !== undefined && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      परिवार श्रम
                    </h3>
                    <p>{farm.familyLaborCount} जना</p>
                  </div>
                )}

              {farm.hiredLaborCount !== null &&
                farm.hiredLaborCount !== undefined && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      भाडा कामदार
                    </h3>
                    <p>{farm.hiredLaborCount} जना</p>
                  </div>
                )}

              {farm.annualInvestmentNPR !== null &&
                farm.annualInvestmentNPR !== undefined && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      वार्षिक लगानी
                    </h3>
                    <p>रु. {farm.annualInvestmentNPR.toLocaleString()}</p>
                  </div>
                )}

              {farm.annualIncomeNPR !== null &&
                farm.annualIncomeNPR !== undefined && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      वार्षिक आम्दानी
                    </h3>
                    <p>रु. {farm.annualIncomeNPR.toLocaleString()}</p>
                  </div>
                )}
            </div>

            <div className="flex items-center gap-2">
              {farm.profitableOperation ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <X className="h-4 w-4 text-red-600" />
              )}
              <span>नाफामूलक संचालन</span>
            </div>

            {farm.marketAccessDetails && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  बजार पहुँच विवरण
                </h3>
                <p>{farm.marketAccessDetails}</p>
              </div>
            )}

            {farm.majorBuyerTypes && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  प्रमुख खरिदकर्ता प्रकारहरू
                </h3>
                <p>{farm.majorBuyerTypes}</p>
              </div>
            )}
          </div>

          {/* Linked Entities */}
          {(farm.linkedProcessingCenters?.length > 0 ||
            farm.linkedGrazingAreas?.length > 0 ||
            farm.linkedAgricZones?.length > 0 ||
            farm.linkedGrasslands?.length > 0) && (
            <div className="space-y-3 pt-4 border-t">
              <h3 className="text-base font-medium">जडित संस्थाहरू</h3>

              {farm.linkedProcessingCenters?.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    प्रशोधन केन्द्रहरू
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {farm.linkedProcessingCenters.map((item: any) => (
                      <Badge key={item.id} variant="outline">
                        {item.name || item.id}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {farm.linkedGrazingAreas?.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    चरण क्षेत्रहरू
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {farm.linkedGrazingAreas.map((item: any) => (
                      <Badge key={item.id} variant="outline">
                        {item.name || item.id}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {farm.linkedAgricZones?.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    कृषि क्षेत्रहरू
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {farm.linkedAgricZones.map((item: any) => (
                      <Badge key={item.id} variant="outline">
                        {item.name || item.id}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {farm.linkedGrasslands?.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    घाँसे मैदानहरू
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {farm.linkedGrasslands.map((item: any) => (
                      <Badge key={item.id} variant="outline">
                        {item.name || item.id}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                सिर्जना मिति
              </h3>
              <div className="flex items-center gap-1.5">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                <span>{formatDate(farm.createdAt)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                अपडेट मिति
              </h3>
              <div className="flex items-center gap-1.5">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                <span>{formatDate(farm.updatedAt)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SEO Information */}
      {(farm.metaTitle || farm.metaDescription || farm.keywords) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-muted-foreground"
              >
                <path d="M4 11h16"></path>
                <path d="M4 7h16"></path>
                <path d="M4 15h16"></path>
              </svg>
              SEO जानकारी
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            {farm.metaTitle && (
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Meta Title
                </h3>
                <p>{farm.metaTitle}</p>
              </div>
            )}
            {farm.metaDescription && (
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Meta Description
                </h3>
                <p>{farm.metaDescription}</p>
              </div>
            )}
            {farm.keywords && (
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Keywords
                </h3>
                <p>{farm.keywords}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
