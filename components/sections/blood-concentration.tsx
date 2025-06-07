import { ConcentrationChartDataPoint } from "@/lib/types/pharmacokinetics";
import { ConcentrationChart } from "../charts/concentration-chart";
import {
  StyledCard,
  StyledContent,
  StyledDescription,
  StyledTitle,
  StyledHeader,
  StyledCardProps,
} from "../ui/styled-card";
import colors from "tailwindcss/colors";

export interface BloodConcentrationProps {
  data: ConcentrationChartDataPoint[];
  dosingIntervalH: number;
  estimatedSleepThresholdNgML: number;
  customSleepThresholdNgML: number;
  naiveSleepThresholdNgML: number;
  cardSettings: StyledCardProps;
  axisColors: {
    axisColor: keyof typeof colors;
    axisLabelColor: keyof typeof colors;
  };
  lineColors: {
    steadyStateColor: keyof typeof colors;
    firstDoseColor: keyof typeof colors;
    steadyStateNoInterventionColor: keyof typeof colors;
    firstDayNoInterventionColor: keyof typeof colors;
  };
}

export function BloodConcentration({
  data,
  dosingIntervalH,
  estimatedSleepThresholdNgML,
  customSleepThresholdNgML,
  naiveSleepThresholdNgML,
  cardSettings,
  axisColors,
  lineColors,
}: BloodConcentrationProps) {
  return (
    <StyledCard
      cardPadding={cardSettings.cardPadding}
      cardPerimeter={cardSettings.cardPerimeter}
      cardBackground={cardSettings.cardBackground}
      backgroundColor={cardSettings.backgroundColor}
    >
      <StyledHeader>
        <StyledTitle textColor={cardSettings.backgroundColor}>
          Concentration In Blood Over Time
        </StyledTitle>
        <StyledDescription textColor={cardSettings.backgroundColor}>
          Track how Vitamin C affects drug levels throughout the day
        </StyledDescription>
      </StyledHeader>
      <StyledContent className="h-80 sm:h-96">
        <ConcentrationChart
          data={data}
          dosingIntervalH={dosingIntervalH}
          estimatedSleepThresholdNgML={estimatedSleepThresholdNgML}
          customSleepThresholdNgML={customSleepThresholdNgML}
          naiveSleepThresholdNgML={naiveSleepThresholdNgML}
          axisColor={axisColors.axisColor}
          axisLabelColor={axisColors.axisLabelColor}
          steadyStateColor={lineColors.steadyStateColor}
          firstDoseColor={lineColors.firstDoseColor}
          steadyStateNoInterventionColor={
            lineColors.steadyStateNoInterventionColor
          }
          firstDayNoInterventionColor={lineColors.firstDayNoInterventionColor}
        />
      </StyledContent>
    </StyledCard>
  );
}
