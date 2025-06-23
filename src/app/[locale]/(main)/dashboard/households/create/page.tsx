"use client";

import { useState } from "react";
import { HOUSEHOLD_STEPS, HouseholdStep } from "@/types/household";
import { HouseholdForm } from "@/components/households/HouseholdForm";
import StepIndicator from "@/components/households/StepIndicator";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";

export default function NewHouseholdPage() {
  const [step, setStep] = useState<HouseholdStep>(HOUSEHOLD_STEPS[0]);
  const currentStepIndex = HOUSEHOLD_STEPS.findIndex((s) => s === step);
  const form = useForm();

  const goToPreviousStep = () => {
    if (currentStepIndex > 0) {
      setStep(HOUSEHOLD_STEPS[currentStepIndex - 1]);
    }
  };

  const goToNextStep = async () => {
    // If we're on the last step, the submit button in ReviewStep will handle submission
    if (currentStepIndex < HOUSEHOLD_STEPS.length - 1) {
      // Validate current step before proceeding
      const isValid = await form.trigger();
      if (isValid) {
        setStep(HOUSEHOLD_STEPS[currentStepIndex + 1]);
      }
    }
  };

  const isLastStep = currentStepIndex === HOUSEHOLD_STEPS.length - 1;
  const isSecondToLastStep = currentStepIndex === HOUSEHOLD_STEPS.length - 2;

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">नयाँ घरधुरी दर्ता</h1>

        <StepIndicator
          steps={HOUSEHOLD_STEPS}
          currentStep={step}
          onStepClick={setStep}
        />

        <div className="bg-white shadow-md rounded-lg p-6 mt-6">
          <HouseholdForm currentStep={step} />

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
