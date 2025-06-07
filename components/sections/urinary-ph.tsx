import { PhTimeSeriesPoint } from "@/lib/types/pharmacokinetics";
import {
  StyledCard,
  StyledContent,
  StyledDescription,
  StyledTitle,
  StyledHeader,
  StyledCardProps,
} from "../ui/styled-card";
import { UrinePhChart } from "@/components/charts/urine-ph-chart";

export interface UrinaryPhComponentProps {
  data: PhTimeSeriesPoint[];
  dosingIntervalH: number;
  cardSettings: StyledCardProps;
}

export function UrinaryPhComponent({
  data,
  dosingIntervalH,
  cardSettings,
}: UrinaryPhComponentProps) {
  return (
    <StyledCard
      cardPadding={cardSettings.cardPadding}
      cardPerimeter={cardSettings.cardPerimeter}
      cardBackground={cardSettings.cardBackground}
      backgroundColor={cardSettings.backgroundColor}
    >
      <StyledHeader>
        <StyledTitle textColor={cardSettings.backgroundColor}>
          Urine pH Changes
        </StyledTitle>
        <StyledDescription textColor={cardSettings.backgroundColor}>
          See how Vitamin C acidifies your urine to speed elimination
        </StyledDescription>
      </StyledHeader>
      <StyledContent className="h-80 sm:h-96">
        <UrinePhChart
          data={data}
          dosingIntervalH={dosingIntervalH}
          axisColor="amber"
          axisLabelColor="amber"
        />
      </StyledContent>
    </StyledCard>
  );
}
