import { HOUSEHOLD_STEPS, HouseholdStep } from "@/types/household";
import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  steps: readonly string[];
  currentStep: string;
  onStepClick: (step: HouseholdStep) => void;
}

export default function StepIndicator({
  steps,
  currentStep,
  onStepClick,
}: StepIndicatorProps) {
  return (
    <div className="flex justify-between items-center">
      {steps.map((step, index) => (
        <div
          key={step}
          className="flex flex-col items-center"
          onClick={() => onStepClick(step as HouseholdStep)}
        >
          <div
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
              step === currentStep
                ? "bg-primary text-white"
                : "bg-gray-200 text-gray-600 cursor-pointer hover:bg-gray-300",
            )}
          >
            {index + 1}
          </div>
          <span
            className={cn(
              "text-xs mt-1",
              step === currentStep
                ? "text-primary font-medium"
                : "text-gray-500",
            )}
          >
            {step}
          </span>
        </div>
      ))}
    </div>
  );
}
