import {
  StyledCard,
  StyledContent,
  StyledDescription,
  StyledHeader,
  StyledTitle,
} from "@/components/ui/styled-card";
import { COLORS } from "@/components/ui/color";
import { cn } from "@/lib/utils";

type QuickStartStep = {
  icon: string;
  title: string;
  description: string;
  bgColor: keyof COLORS;
};

const quickStartSteps: QuickStartStep[] = [
  {
    icon: "🍊",
    title: "Take Vitamin C",
    description: "This will help your kidneys wipe-out your medication faster.",
    bgColor: "amber",
  },
  {
    icon: "💊",
    title: "Wait Eight Hours",
    description: "Your kidneys will do their thing, just give them time!",
    bgColor: "purple",
  },
  {
    icon: "😴",
    title: "Fall Asleep Sooner",
    description: "Well, hopefully! It worked for me, your mileage may vary.",
    bgColor: "blue",
  },
];

function getEmphasizedColor(bgColor: keyof COLORS) {
  return cn("bg-gradient-to-br", {
    "from-purple-200 to-pink-200": bgColor === "purple",
    "from-blue-200 to-violet-200": bgColor === "blue",
    "from-green-200 to-emerald-200": bgColor === "green",
    "from-orange-200 to-yellow-200": bgColor === "orange",
    "from-red-200 to-rose-200": bgColor === "red",
    "from-amber-200 to-red-200": bgColor === "amber",
  });
}

export function QuickStartGuide() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
      {quickStartSteps.map((step, index) => (
        <StyledCard
          key={index}
          cardPadding="compact"
          cardPerimeter="shadow"
          cardBackground="gradient"
          backgroundColor={step.bgColor}
          className="flex flex-row md:p-6 space-y-0 gap-4 md:gap-4 content-center md:text-center md:justify-center md:flex-col items-center"
        >
          <StyledContent>
            <div
              className={cn(
                "w-12 h-12 m-0 rounded-xl flex items-center justify-center",
                getEmphasizedColor(step.bgColor),
              )}
            >
              <span className="text-2xl">{step.icon}</span>
            </div>
          </StyledContent>
          <StyledHeader>
            <StyledTitle size="small" textColor={step.bgColor}>
              {step.title}
            </StyledTitle>
            <StyledDescription textColor={step.bgColor}>
              {step.description}
            </StyledDescription>
          </StyledHeader>
        </StyledCard>
      ))}
    </div>
  );
}
