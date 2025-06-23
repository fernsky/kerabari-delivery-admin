"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { HOUSEHOLD_STEPS, HouseholdStep } from "@/types/household";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { useHouseholdStore } from "@/store/household-store";
import StepIndicator from "@/components/households/StepIndicator";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { HouseholdForm } from "@/components/households/EditHouseholdForm";

export default function EditHouseholdPage() {
  const [step, setStep] = useState<HouseholdStep>(HOUSEHOLD_STEPS[0]);
  const currentStepIndex = HOUSEHOLD_STEPS.findIndex((s) => s === step);
  const params = useParams();
  const router = useRouter();

  console.log("Edit Household Page Params:", params);

  // Format and clean the household ID
  let rawHouseholdId = params.id as string;
  // Decode URI components and clean the ID
  const householdId = decodeURIComponent(rawHouseholdId)
    .replace(/:/g, "") // Remove any colons
    .replace(/[^a-f0-9-]/gi, ""); // Remove any non-hex/hyphen chars

  const finalHouseholdId = `uuid:${householdId.slice(1)}`;
  console.log("Final Household ID:", finalHouseholdId);
  // Get Zustand household store methods
  const { resetCurrentHousehold } = useHouseholdStore();

  // Fetch household data
  const {
    data: household,
    isLoading,
    error,
  } = api.households.getHouseholdById.useQuery(
    {
      id: finalHouseholdId,
    },
    {
      retry: 1,
      onError: (err) => {
        toast.error(`घरधुरी विवरण प्राप्त गर्न असफल: ${err.message}`);
        router.push("/dashboard/households");
      },
    },
  );

  // Clear store when navigating away or component unmounts
  useEffect(() => {
    return () => {
      resetCurrentHousehold();
    };
  }, [resetCurrentHousehold]);

  const goToPreviousStep = () => {
    if (currentStepIndex > 0) {
      setStep(HOUSEHOLD_STEPS[currentStepIndex - 1]);
    }
  };

  const goToNextStep = async () => {
    if (currentStepIndex < HOUSEHOLD_STEPS.length - 1) {
      setStep(HOUSEHOLD_STEPS[currentStepIndex + 1]);
    }
  };

  const isLastStep = currentStepIndex === HOUSEHOLD_STEPS.length - 1;
  const isSecondToLastStep = currentStepIndex === HOUSEHOLD_STEPS.length - 2;

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 flex justify-center items-center h-64">
        <Spinner />
        <span className="ml-4">घरधुरी विवरण लोड हुँदैछ...</span>
      </div>
    );
  }

  if (error || !household) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h2 className="text-xl text-red-500 mb-4">
          घरधुरी विवरण प्राप्त गर्न सकिएन
        </h2>
        <p className="mb-6">घरधुरी फेला परेन वा पहुँच अनुमति छैन</p>
        <Button onClick={() => router.push("/dashboard/households")}>
          घरधुरी सूचीमा फर्कनुहोस्
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">घरधुरी विवरण सम्पादन</h1>
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/households")}
          >
            सूचीमा फर्कनुहोस्
          </Button>
        </div>

        <div className="mb-6">
          <p className="text-gray-600">
            <strong>परिवार मूली:</strong> {household.familyHeadName as string}
          </p>
          <p className="text-gray-600">
            <strong>घर संकेत नं.:</strong> {household.houseSymbolNo as string}
          </p>
        </div>

        <StepIndicator
          steps={HOUSEHOLD_STEPS}
          currentStep={step}
          onStepClick={setStep}
        />

        <div className="bg-white shadow-md rounded-lg p-6 mt-6">
          <HouseholdForm currentStep={step} initialData={household} />

          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={goToPreviousStep}
              disabled={currentStepIndex === 0}
            >
              अघिल्लो
            </Button>

            {!isLastStep && (
              <Button onClick={goToNextStep}>
                {isSecondToLastStep ? "समीक्षा" : "अर्को"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
