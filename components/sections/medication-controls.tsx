import {
  StyledCard,
  StyledContent,
  StyledDescription,
  StyledHeader,
  StyledTitle,
  type StyledCardProps,
} from "@/components/ui/styled-card";
import { StyledSlider } from "@/components/ui/styled-slider";
import { DrugSimulationInputs } from "@/lib/types/pharmacokinetics";

interface MedicationDetailsProps {
  simulationInputs: DrugSimulationInputs;
  onDoseChange: (value: number) => void;
  onBodyWeightChange: (value: number) => void;
  onBaseUrinePhChange: (value: number) => void;
  cardSettings: StyledCardProps;
}

export function MedicationDetailsCard({
  simulationInputs,
  onDoseChange,
  onBodyWeightChange,
  onBaseUrinePhChange,
  cardSettings,
}: MedicationDetailsProps) {
  return (
    <StyledCard
      cardPadding={cardSettings.cardPadding}
      cardPerimeter={cardSettings.cardPerimeter}
      cardBackground={cardSettings.cardBackground}
      backgroundColor={cardSettings.backgroundColor}
    >
      <StyledHeader>
        <StyledTitle>Medication Details</StyledTitle>
        <StyledDescription>Your Vyvanse prescription info</StyledDescription>
      </StyledHeader>
      <StyledContent>
        <StyledSlider
          label="Vyvanse Dose"
          value={simulationInputs.doseMg}
          color={cardSettings.backgroundColor}
          min={10}
          max={70}
          step={5}
          unit="mg"
          precision={0}
          onValueChange={onDoseChange}
        />
        <StyledSlider
          label="Body Weight"
          color={cardSettings.backgroundColor}
          value={simulationInputs.bodyWeightKg}
          min={30}
          max={150}
          step={1}
          unit="kg"
          precision={0}
          onValueChange={onBodyWeightChange}
        />
        <StyledSlider
          label="Your Baseline Urine pH"
          color={cardSettings.backgroundColor}
          value={simulationInputs.baseUrinePh}
          min={4.5}
          max={8.5}
          step={0.1}
          unit=""
          precision={1}
          onValueChange={onBaseUrinePhChange}
        />
        <StyledCard
          cardPadding="subcompact"
          cardPerimeter="border"
          cardBackground="default"
          backgroundColor="purple"
        >
          <StyledHeader>
            <span className="font-medium">Note:</span> Normal urine pH is
            6.0-6.5
          </StyledHeader>
        </StyledCard>
      </StyledContent>
    </StyledCard>
  );
}

interface VitaminCStrategyProps {
  vitaminCDoseMg: number;
  vitaminCTimeH: number;
  cardSettings: StyledCardProps;
  onVitaminCDoseChange: (value: number) => void;
  onVitaminCTimeChange: (value: number) => void;
}

export function VitaminCStrategyCard({
  vitaminCDoseMg,
  vitaminCTimeH,
  cardSettings,
  onVitaminCDoseChange,
  onVitaminCTimeChange,
}: VitaminCStrategyProps) {
  return (
    <StyledCard
      cardPadding={cardSettings.cardPadding}
      cardPerimeter={cardSettings.cardPerimeter}
      cardBackground={cardSettings.cardBackground}
      backgroundColor={cardSettings.backgroundColor}
    >
      <StyledHeader>
        <StyledTitle>Vitamin C Strategy</StyledTitle>
        <StyledDescription>Optimize your sleep intervention</StyledDescription>
      </StyledHeader>
      <StyledContent>
        <StyledSlider
          label="Vitamin C Dose"
          value={vitaminCDoseMg}
          color={cardSettings.backgroundColor}
          min={0}
          max={4000}
          step={100}
          unit="mg"
          precision={0}
          onValueChange={onVitaminCDoseChange}
        />
        <StyledSlider
          label="Timing After Vyvanse"
          value={vitaminCTimeH}
          color="orange"
          min={0}
          max={23}
          step={1}
          unit="hours"
          precision={0}
          onValueChange={onVitaminCTimeChange}
        />
      </StyledContent>
    </StyledCard>
  );
}

interface SleepSensitivityProps {
  userSleepThresholdNgML: number;
  adjustedSleepThresholdNgML: number;
  naiveSleepThresholdNgML: number;
  onSleepThresholdChange: (value: number) => void;
  cardSettings: StyledCardProps;
}

export function SleepSensitivityCard({
  userSleepThresholdNgML,
  adjustedSleepThresholdNgML,
  naiveSleepThresholdNgML,
  onSleepThresholdChange,
  cardSettings,
}: SleepSensitivityProps) {
  return (
    <StyledCard
      cardPadding={cardSettings.cardPadding}
      cardPerimeter={cardSettings.cardPerimeter}
      cardBackground={cardSettings.cardBackground}
      backgroundColor={cardSettings.backgroundColor}
    >
      <StyledHeader>
        <StyledTitle>Sleep Sensitivity</StyledTitle>
        <StyledDescription>Your personal sleep threshold</StyledDescription>
      </StyledHeader>
      <StyledContent>
        <StyledSlider
          label="Sleep Threshold"
          value={userSleepThresholdNgML}
          color={cardSettings.backgroundColor}
          min={0}
          max={50}
          step={1}
          unit="ng/mL"
          precision={0}
          onValueChange={onSleepThresholdChange}
        />
        <StyledCard
          cardPadding="subcompact"
          cardPerimeter="border"
          cardBackground="default"
          backgroundColor="orange"
        >
          <StyledHeader>
            <StyledTitle size="tiny" textColor="orange">
              Reference values:
            </StyledTitle>
          </StyledHeader>
          <StyledContent textColor="orange" className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span>First-time user:</span>
              <span className="font-medium">
                {naiveSleepThresholdNgML} ng/mL
              </span>
            </div>
            <div className="flex justify-between">
              <span>Your dose-adjusted:</span>
              <span className="font-medium">
                {adjustedSleepThresholdNgML.toFixed(0)} ng/mL
              </span>
            </div>
            <div className="flex justify-between">
              <span>Regular user:</span>
              <span className="font-medium">15-20 ng/mL</span>
            </div>
          </StyledContent>
        </StyledCard>
      </StyledContent>
    </StyledCard>
  );
}
