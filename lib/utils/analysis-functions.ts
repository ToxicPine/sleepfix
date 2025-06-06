import {
  TimeSeriesMgL,
  SleepAnalysisResult,
  PharmacokineticSummary,
  ConcentrationTimeSeriesResultMgL,
} from "@/lib/types/pharmacokinetics";
import { calculateAccumulationFactorR } from "./concentration-calculations";

export function findSleepTimeH(
  concentrationProfileMgL: TimeSeriesMgL,
  sleepThresholdNgML: number,
): number | null {
  // Convert ng/mL threshold to mg/L: 1 ng/mL = 0.001 mg/L
  const ngMLToMgLConversionFactor = 0.001;
  const sleepThresholdMgL = sleepThresholdNgML * ngMLToMgLConversionFactor;

  for (const point of concentrationProfileMgL) {
    if (point.valueMgL <= sleepThresholdMgL) {
      return point.timeH;
    }
  }

  return null;
}

export function analyzeSleepImprovement(
  concentrations: ConcentrationTimeSeriesResultMgL,
  sleepThresholdNgML: number,
): SleepAnalysisResult {
  const soonestYouCanFallAsleepWithInterventionH = findSleepTimeH(
    concentrations.steadyStateMgL,
    sleepThresholdNgML,
  );

  const soonestYouCanFallAsleepWithoutInterventionH = findSleepTimeH(
    concentrations.baseline.steadyStateMgL,
    sleepThresholdNgML,
  );

  switch (true) {
    case soonestYouCanFallAsleepWithInterventionH === null &&
      soonestYouCanFallAsleepWithoutInterventionH === null:
      return {
        soonestYouCanFallAsleepWithInterventionH: null,
        soonestYouCanFallAsleepWithoutInterventionH: null,
        additionalSleepHoursGained: null,
        sleepImprovementPercent: null,
      };
    case soonestYouCanFallAsleepWithInterventionH === null &&
      soonestYouCanFallAsleepWithoutInterventionH !== null:
      return {
        soonestYouCanFallAsleepWithInterventionH: null,
        soonestYouCanFallAsleepWithoutInterventionH,
        additionalSleepHoursGained: null,
        sleepImprovementPercent: null,
      };
    case soonestYouCanFallAsleepWithInterventionH !== null &&
      soonestYouCanFallAsleepWithoutInterventionH === null:
      return {
        soonestYouCanFallAsleepWithInterventionH,
        soonestYouCanFallAsleepWithoutInterventionH: null,
        additionalSleepHoursGained: null,
        sleepImprovementPercent: null,
      };
    case soonestYouCanFallAsleepWithInterventionH !== null &&
      soonestYouCanFallAsleepWithoutInterventionH !== null: {
      const additionalSleepHoursGained =
        soonestYouCanFallAsleepWithoutInterventionH -
        soonestYouCanFallAsleepWithInterventionH;

      const sleepImprovementPercent =
        (additionalSleepHoursGained /
          soonestYouCanFallAsleepWithInterventionH) *
        100;

      return {
        soonestYouCanFallAsleepWithInterventionH,
        soonestYouCanFallAsleepWithoutInterventionH,
        additionalSleepHoursGained,
        sleepImprovementPercent,
      };
    }
    default:
      return {
        soonestYouCanFallAsleepWithInterventionH: null,
        soonestYouCanFallAsleepWithoutInterventionH: null,
        additionalSleepHoursGained: null,
        sleepImprovementPercent: null,
      };
  }
}

// I'M NOT SURE ABOUT THIS FUNCTION YET
export function calculatePharmacokineticSummary(
  concentrations: ConcentrationTimeSeriesResultMgL,
  dosingIntervalH: number,
): PharmacokineticSummary {
  const { baseline } = concentrations;

  // calculate elimination rate from baseline single dose data
  const initialConcMgL = baseline.singleDoseMgL[0]?.valueMgL ?? 0;
  const finalConcMgL =
    baseline.singleDoseMgL[baseline.singleDoseMgL.length - 1]?.valueMgL ?? 0;

  let eliminationRateConstantPerH = 0;
  let halfLifeH = 0;
  let accumulationFactorR = 1;

  if (initialConcMgL > 0 && finalConcMgL > 0 && dosingIntervalH > 0) {
    // k = ln(C0/Ct) / t
    eliminationRateConstantPerH =
      Math.log(initialConcMgL / finalConcMgL) / dosingIntervalH;

    // t1/2 = ln(2) / k
    halfLifeH = Math.log(2) / eliminationRateConstantPerH;

    // Calculate accumulation factor
    accumulationFactorR = calculateAccumulationFactorR(
      eliminationRateConstantPerH,
      dosingIntervalH,
    );
  }

  // trough concentration at steady state
  const troughConcentrationSteadyStateMgL = finalConcMgL * accumulationFactorR;

  return {
    eliminationRateConstantPerH,
    halfLifeH,
    accumulationFactorR,
    troughConcentrationSteadyStateMgL,
  };
}
