import {
  StyledCard,
  StyledContent,
  StyledDescription,
  StyledHeader,
  StyledTitle,
  type StyledCardProps,
} from "@/components/ui/styled-card";
import { HalfLifeIndicator } from "@/components/indicators/half-life-indicator";
import { AccumulationFactorIndicator } from "@/components/indicators/accumulation-factor-indicator";
import { PharmacokineticSummary } from "@/lib/types/pharmacokinetics";

interface ReferenceParams {
  halfLifeH: number;
  eliminationRateConstantPerH: number;
}

interface PharmacokineticDetailsProps {
  pkSummary: PharmacokineticSummary;
  referenceParams: ReferenceParams;
  referenceUrinePh: number;
  dosingIntervalH: number;
  cardSettings: StyledCardProps;
}

export function PharmacokineticDetails({
  pkSummary,
  referenceParams,
  referenceUrinePh,
  dosingIntervalH,
  cardSettings,
}: PharmacokineticDetailsProps) {
  const referenceAccumulationFactor =
    referenceParams.eliminationRateConstantPerH > 0
      ? 1 /
        (1 -
          Math.exp(
            -referenceParams.eliminationRateConstantPerH * dosingIntervalH,
          ))
      : Infinity;

  return (
    <StyledCard
      cardPadding={cardSettings.cardPadding}
      cardPerimeter={cardSettings.cardPerimeter}
      cardBackground={cardSettings.cardBackground}
      backgroundColor={cardSettings.backgroundColor}
    >
      <StyledHeader>
        <StyledTitle>Pharmacokinetic Details</StyledTitle>
        <StyledDescription>
          Key metrics showing how Vitamin C affects drug elimination
        </StyledDescription>
      </StyledHeader>
      <StyledContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-800 mb-3">Drug Half-Life</h4>
            <HalfLifeIndicator
              currentHalfLifeH={pkSummary.halfLifeH}
              referenceHalfLifeH={referenceParams.halfLifeH}
              referenceUrinePh={referenceUrinePh}
            />
            <p className="text-sm text-gray-600 mt-3">
              The time it takes for half the drug to be eliminated from your
              system.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-800 mb-3">
              Accumulation Factor
            </h4>
            <AccumulationFactorIndicator
              currentAccumulationFactor={pkSummary.accumulationFactorR}
              referenceAccumulationFactor={referenceAccumulationFactor}
              referenceUrinePh={referenceUrinePh}
            />
            <p className="text-sm text-gray-600 mt-3">
              How much drug builds up with daily dosing at steady state.
            </p>
          </div>
        </div>
      </StyledContent>
    </StyledCard>
  );
}
