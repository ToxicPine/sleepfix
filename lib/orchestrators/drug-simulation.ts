import {
  DrugParameters,
  DrugSimulationInputs,
  PhTimeSeries,
  ConcentrationTimeSeriesResultMgL,
  SleepAnalysisResult,
  PharmacokineticSummary,
  ConcentrationTimeSeriesFromPhFn,
  PhSeriesGeneratorFn,
  InterventionInputs,
  InterventionParameters,
} from "@/lib/types/pharmacokinetics";
import {
  analyzeSleepImprovement,
  calculatePharmacokineticSummary,
} from "@/lib/utils/analysis-functions";

export interface DrugSimulationResult {
  phTimeSeries: PhTimeSeries;
  concentrationsMgL: ConcentrationTimeSeriesResultMgL;
}

export function simulateDrugEffectsWithIntervention<
  TDrugParams extends DrugParameters,
  TIntervention extends InterventionInputs,
  TInterventionParams extends InterventionParameters,
>(
  drugParams: TDrugParams,
  drugInputs: DrugSimulationInputs,
  interventionInputs: TIntervention,
  interventionParams: TInterventionParams,
  concentrationCalculator: ConcentrationTimeSeriesFromPhFn<TDrugParams>,
  phSeriesGeneratorFn: PhSeriesGeneratorFn<TIntervention, TInterventionParams>,
  userSleepThresholdNgML: number,
  timeStepH: number = 0.1,
  dosingIntervalH: number = 24,
): {
  phTimeSeries: PhTimeSeries;
  concentrationsMgL: ConcentrationTimeSeriesResultMgL;
  sleepAnalysis: SleepAnalysisResult;
  pkSummary: PharmacokineticSummary;
} {
  // Step 1: Generate pH time series
  const phTimeSeries = phSeriesGeneratorFn(
    drugInputs.baseUrinePh,
    interventionInputs,
    interventionParams,
    dosingIntervalH,
    timeStepH,
  );

  // Step 2: Calculate concentration time series
  const concentrationsMgL = concentrationCalculator(
    phTimeSeries,
    drugInputs,
    drugParams,
    timeStepH,
  );

  // Step 3: Analyze sleep impact
  const sleepAnalysis = analyzeSleepImprovement(
    concentrationsMgL,
    userSleepThresholdNgML,
  );

  // Step 4: Analyze pharmacokinetic summary
  const pkSummary = calculatePharmacokineticSummary(
    concentrationsMgL,
    dosingIntervalH,
  );

  return {
    phTimeSeries,
    concentrationsMgL,
    sleepAnalysis,
    pkSummary,
  };
}

export function simulateDrugWithIntervention<
  TDrugParams extends DrugParameters,
  TIntervention extends InterventionInputs,
  TInterventionParams extends InterventionParameters,
>(
  drugInputs: DrugSimulationInputs,
  drugParams: TDrugParams,
  interventionInputs: TIntervention,
  interventionParams: TInterventionParams,
  phSeriesGeneratorFn: PhSeriesGeneratorFn<TIntervention, TInterventionParams>,
  concentrationCalculatorFn: ConcentrationTimeSeriesFromPhFn<TDrugParams>,
  dosingIntervalH: number = 24,
  timeStepH: number = 0.1,
): DrugSimulationResult {
  const phTimeSeries = phSeriesGeneratorFn(
    drugInputs.baseUrinePh,
    interventionInputs,
    interventionParams,
    dosingIntervalH,
    timeStepH,
  );

  const concentrationsMgL = concentrationCalculatorFn(
    phTimeSeries,
    drugInputs,
    drugParams,
    timeStepH,
  );

  return {
    phTimeSeries,
    concentrationsMgL,
  };
}

export function simulateDrugBaseline<TDrugParams extends DrugParameters>(
  drugInputs: DrugSimulationInputs,
  drugParams: TDrugParams,
  concentrationCalculatorFn: ConcentrationTimeSeriesFromPhFn<TDrugParams>,
  dosingIntervalH: number = 24,
  timeStepH: number = 0.1,
): DrugSimulationResult {
  const phTimeSeries: PhTimeSeries = [];
  for (let timeH = 0; timeH <= dosingIntervalH; timeH += timeStepH) {
    phTimeSeries.push({
      timeH,
      ph: drugInputs.baseUrinePh,
    });
  }

  const concentrationsMgL = concentrationCalculatorFn(
    phTimeSeries,
    drugInputs,
    drugParams,
    timeStepH,
  );

  return {
    phTimeSeries,
    concentrationsMgL,
  };
}
