import {
  StyledCard,
  StyledContent,
  StyledHeader,
  StyledTitle,
} from "@/components/ui/styled-card";
import { ColoredItem, getTextColor } from "@/components/ui/color";
import { cn } from "@/lib/utils";

interface ScienceBoxProps extends ColoredItem {
  title: string;
  content: string;
}

function ScienceBox({
  title,
  content,
  backgroundColor,
}: ScienceBoxProps & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <StyledCard
      cardPadding="default"
      cardPerimeter="border"
      cardBackground="gradient"
      backgroundColor={backgroundColor}
    >
      <StyledHeader>
        <StyledTitle textColor={backgroundColor}>{title}</StyledTitle>
      </StyledHeader>
      <StyledContent>
        <p className={cn("text-sm", getTextColor(backgroundColor))}>
          {content}
        </p>
      </StyledContent>
    </StyledCard>
  );
}

export function HowItWorksSection() {
  const scienceBoxes: ScienceBoxProps[] = [
    {
      title: "How Your Body Clears Vyvanse",
      content:
        "Your body flushes out ADHD drugs through your kidneys (mostly). The speed of this process varies significantly from person to person. If you can't fall asleep, it's probably because your body is eliminating the medication too slowly.",
      backgroundColor: "red",
    },
    {
      title: "The Role of Urine pH",
      content:
        "The acidity of your urine (pH) is a key to how fast your body clears the medication; more acidic urine 'traps' the drug so it can be flushed out faster. Keeping a lower pH means that the drug will (probably) leave your system before bedtime.",
      backgroundColor: "yellow",
    },
    {
      title: "A Strategy for Better Sleep",
      content:
        "Taking Vitamin C later in the day makes your urine more acidic. This can speed up the medication's removal in the evening, making it easier to fall asleep at night without affecting its potential to help you during the day.",
      backgroundColor: "green",
    },
  ];

  return (
    <div className="w-full grid grid-cols-1 gap-6">
      {scienceBoxes.map((box, index) => (
        <ScienceBox
          key={index}
          backgroundColor={box.backgroundColor}
          title={box.title}
          content={box.content}
        />
      ))}
    </div>
  );
}

export function MedicalDisclaimerSection() {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <StyledCard
        cardPadding="default"
        cardPerimeter="border"
        cardBackground="default"
        backgroundColor="orange"
      >
        <StyledHeader className="text-center">
          <StyledTitle textColor="orange">
            Important Medical Information
          </StyledTitle>
        </StyledHeader>
        <StyledContent
          textColor="orange"
          className="text-sm text-center space-y-1.5"
        >
          <p>
            This tool was not created by a doctor, and the advice presented
            comes with no guarantees.
          </p>
          <p>
            The safe upper limit for Vitamin C is ~2000mg per day; exceeding
            this is at your own risk.
          </p>
          <p className="text-xs">
            We modelled the impact of acidifying your urine on Vyvanse
            elimination using the model from Huang W, et al. See{" "}
            <i>Journal of Pharmacology and Experimental Therapeutics</i>. 2020
            Jun; <b>373</b>(3):488-501.
          </p>
        </StyledContent>
      </StyledCard>
    </div>
  );
}

export function AcknowledgementsSection() {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <StyledCard
        cardPadding="compact"
        cardPerimeter="border"
        cardBackground="default"
        backgroundColor="pink"
      >
        <StyledContent textColor="pink" className="text-center">
          Made with ❤️ by{" "}
          <a
            href="https://github.com/ToxicPine"
            className="underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Arbion Halili
          </a>
        </StyledContent>
      </StyledCard>
    </div>
  );
}
