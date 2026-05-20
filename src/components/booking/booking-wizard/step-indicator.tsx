import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

//  Step Indicator
export type WizardStep = 1 | 2 | 3 | 4

export function StepIndicator({ currentStep, isReturnTrip }: { currentStep: WizardStep; isReturnTrip?: boolean }) {
  const steps = isReturnTrip
    ? [
        { num: 1, label: "Passengers" },
        { num: 2, label: "Outbound seats" },
        { num: 3, label: "Return seats" },
        { num: 4, label: "Review & pay" },
      ]
    : [
        { num: 1, label: "Passengers" },
        { num: 2, label: "Seats" },
        { num: 3, label: "Review & pay" },
      ]

  return (
    <div className="flex items-center gap-0 mb-8 overflow-x-auto">
      {steps.map((step, i) => {
        const isDone = currentStep > step.num
        const isActive = currentStep === step.num
        return (
          <div key={step.num} className="flex items-center">
            {/* Step circle */}
            <div className="flex items-center gap-2.5 shrink-0">
              <div
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all",
                  isDone && "bg-primary text-primary-foreground",
                  isActive && "bg-primary text-primary-foreground ring-4 ring-primary/20",
                  !isDone && !isActive && "bg-muted text-muted-foreground",
                )}
              >
                {isDone ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : step.num}
              </div>
              <span className={cn("text-sm font-medium hidden sm:block", isActive ? "text-foreground" : "text-muted-foreground")}>{step.label}</span>
            </div>

            {/* Connector */}
            {i < steps.length - 1 && <div className={cn("h-px w-8 sm:w-16 mx-2 transition-all", currentStep > step.num ? "bg-primary" : "bg-border")} />}
          </div>
        )
      })}
    </div>
  )
}
