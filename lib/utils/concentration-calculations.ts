import {
  TimeSeriesMgL,
  PhTimeSeries,
  ConcentrationTimeSeriesResultMgL,
  DrugSimulationInputs,
  ConcentrationTimeSeriesFromPhFn,
} from "@/lib/types/pharmacokinetics";
import { AmphetamineParameters } from "@/lib/pharmaceuticals/amphetamine/constants";

/**
 * Calculate amphetamine elimination rate at given pH
 * This is the fundamental PK relationship for amphetamine
 * Input: urinePh (unitless), apparentVolumeOfDistributionL (L)
 * Output: elimination rate (per hour, h⁻¹)
 */
export function calculateAmphetamineEliminationRatePerH(
  urinePh: number,
  apparentVolumeOfDistributionL: number,
  constants: AmphetamineParameters,
): number {
  if (apparentVolumeOfDistributionL <= 0) return Infinity;

  // pH-dependent renal clearance (decreases with lower pH)
  const renalClearanceAtCurrentPhLPerH =
    constants.renalClearanceAtPh6_5LPerH * Math.pow(10, -0.3 * (urinePh - 6.5));

  const totalSystemicClearanceLPerH =
    constants.hepaticClearanceLPerH + renalClearanceAtCurrentPhLPerH;

  return totalSystemicClearanceLPerH / apparentVolumeOfDistributionL;
}

/**
 * Simulate concentration profile from pH time series
 * Generic approach that could work for any drug with pH-dependent elimination
 * Input: initialConcentrationMgL (mg/L), timeStepH (hours)
 * Output: TimeSeriesMgL with timeH in hours, valueMgL in mg/L
 */
function simulateConcentrationMgLFromPhTimeSeries(
  initialConcentrationMgL: number,
  phTimeSeries: PhTimeSeries,
  eliminationRateCalculatorFn: (
    ph: number,
    vdL: number,
    params: AmphetamineParameters,
  ) => number,
  apparentVolumeOfDistributionL: number,
  drugParams: AmphetamineParameters,
  timeStepH: number,
): TimeSeriesMgL {
  const concentrationProfileMgL: TimeSeriesMgL = [];
  let currentConcentrationMgL = initialConcentrationMgL;

  for (let i = 0; i < phTimeSeries.length; i++) {
    const { timeH } = phTimeSeries[i];

    if (i === 0) {
      concentrationProfileMgL.push({
        timeH,
        valueMgL: initialConcentrationMgL,
      });
      continue;
    }

    const previousPh = phTimeSeries[i - 1].ph;
    const eliminationRatePerH = eliminationRateCalculatorFn(
      previousPh,
      apparentVolumeOfDistributionL,
      drugParams,
    );

    if (isFinite(eliminationRatePerH) && eliminationRatePerH > 0) {
      currentConcentrationMgL =
        currentConcentrationMgL * Math.exp(-eliminationRatePerH * timeStepH);
    }

    concentrationProfileMgL.push({ timeH, valueMgL: currentConcentrationMgL });
  }

  return concentrationProfileMgL;
}

export function calculateAccumulationFactorR(
  eliminationRateConstantPerH: number,
  dosingIntervalH: number,
): number {
  if (eliminationRateConstantPerH <= 0) return Infinity;

  const expTerm = Math.exp(-eliminationRateConstantPerH * dosingIntervalH);

  if (expTerm >= 1) return Infinity;

  return 1 / (1 - expTerm);
}

export const calculateAmphetamineConcentrationsMgL: ConcentrationTimeSeriesFromPhFn<
  AmphetamineParameters
> = (
  phTimeSeries: PhTimeSeries,
  drugInputs: DrugSimulationInputs,
  drugParams: AmphetamineParameters,
  timeStepH: number,
  dosingIntervalH: number = 24,
): ConcentrationTimeSeriesResultMgL => {
  // Calculate derived parameters
  const liberatedAmphetamineMg =
    drugParams.oralBioavailabilityF *
    drugParams.amphetaminePerVyvanseF *
    drugInputs.doseMg;

  const apparentVolumeOfDistributionL =
    drugParams.volumeDistributionFactorLPerKg * drugInputs.bodyWeightKg;

  const initialConcentrationMgL =
    apparentVolumeOfDistributionL > 0
      ? liberatedAmphetamineMg / apparentVolumeOfDistributionL
      : 0;

  // Simulate single dose with dynamic pH effects
  const singleDoseMgL = simulateConcentrationMgLFromPhTimeSeries(
    initialConcentrationMgL,
    phTimeSeries,
    calculateAmphetamineEliminationRatePerH,
    apparentVolumeOfDistributionL,
    drugParams,
    timeStepH,
  );

  // Calculate average elimination rate for steady-state approximation
  const totalEliminationRatePerH = phTimeSeries.reduce((sum, { ph }) => {
    return (
      sum +
      calculateAmphetamineEliminationRatePerH(
        ph,
        apparentVolumeOfDistributionL,
        drugParams,
      )
    );
  }, 0);

  const averageEliminationRatePerH =
    totalEliminationRatePerH / phTimeSeries.length;
  const averageAccumulationFactorR = calculateAccumulationFactorR(
    averageEliminationRatePerH,
    dosingIntervalH,
  );

  // Calculate steady-state profile
  const concentrationAtTauMgL =
    singleDoseMgL[singleDoseMgL.length - 1]?.valueMgL || 0;
  const accumulatedTroughConcentrationMgL = isFinite(averageAccumulationFactorR)
    ? concentrationAtTauMgL * averageAccumulationFactorR
    : 0;

  const troughDecayMgL = simulateConcentrationMgLFromPhTimeSeries(
    accumulatedTroughConcentrationMgL,
    phTimeSeries,
    calculateAmphetamineEliminationRatePerH,
    apparentVolumeOfDistributionL,
    drugParams,
    timeStepH,
  );

  const steadyStateMgL = singleDoseMgL.map((point, index) => ({
    timeH: point.timeH,
    valueMgL: point.valueMgL + (troughDecayMgL[index]?.valueMgL || 0),
  }));

  // Calculate baseline (constant pH) profiles
  const eliminationRateAtBasePhPerH = calculateAmphetamineEliminationRatePerH(
    drugInputs.baseUrinePh,
    apparentVolumeOfDistributionL,
    drugParams,
  );

  const baselineSingleDoseMgL: TimeSeriesMgL = [];
  const baselineSteadyStateMgL: TimeSeriesMgL = [];

  if (
    isFinite(eliminationRateAtBasePhPerH) &&
    eliminationRateAtBasePhPerH > 0
  ) {
    const accumulationFactorBasePhR = calculateAccumulationFactorR(
      eliminationRateAtBasePhPerH,
      dosingIntervalH,
    );
    const concentrationAtTauBasePhMgL =
      initialConcentrationMgL *
      Math.exp(-eliminationRateAtBasePhPerH * dosingIntervalH);
    const accumulatedTroughBasePhMgL = isFinite(accumulationFactorBasePhR)
      ? concentrationAtTauBasePhMgL * accumulationFactorBasePhR
      : 0;

    phTimeSeries.forEach(({ timeH }) => {
      const singleDoseConcMgL =
        initialConcentrationMgL *
        Math.exp(-eliminationRateAtBasePhPerH * timeH);
      baselineSingleDoseMgL.push({ timeH, valueMgL: singleDoseConcMgL });

      const troughConcMgL =
        accumulatedTroughBasePhMgL *
        Math.exp(-eliminationRateAtBasePhPerH * timeH);
      baselineSteadyStateMgL.push({
        timeH,
        valueMgL: singleDoseConcMgL + troughConcMgL,
      });
    });
  } else {
    phTimeSeries.forEach(({ timeH }) => {
      baselineSingleDoseMgL.push({ timeH, valueMgL: initialConcentrationMgL });
      baselineSteadyStateMgL.push({ timeH, valueMgL: initialConcentrationMgL });
    });
  }

  return {
    singleDoseMgL,
    steadyStateMgL,
    baseline: {
      singleDoseMgL: baselineSingleDoseMgL,
      steadyStateMgL: baselineSteadyStateMgL,
    },
  };
};
