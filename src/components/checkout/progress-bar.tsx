import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  { id: 1, label: "Dados" },
  { id: 2, label: "Pagamento" },
  { id: 3, label: "Confirmação" },
] as const;

interface ProgressBarProps {
  currentStep: number;
}

export function ProgressBar({ currentStep }: ProgressBarProps) {
  return (
    <nav aria-label="Progresso do checkout" className="w-full">
      <ol className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;

          return (
            <li key={step.id} className="flex flex-1 items-center">
              <div className="flex w-full flex-col items-center gap-2">
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-colors duration-200",
                      isCompleted && "bg-forest text-white",
                      isCurrent && "bg-cta text-white",
                      !isCompleted && !isCurrent && "bg-border text-muted",
                    )}
                  >
                    {isCompleted ? (
                      <Check className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      step.id
                    )}
                  </span>
                  {index < steps.length - 1 && (
                    <div
                      className={cn(
                        "h-px flex-1 transition-colors duration-200",
                        isCompleted ? "bg-forest" : "bg-border",
                      )}
                    />
                  )}
                </div>
                <span
                  className={cn(
                    "text-xs font-medium",
                    isCurrent ? "text-foreground" : "text-muted",
                  )}
                >
                  {step.label}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
