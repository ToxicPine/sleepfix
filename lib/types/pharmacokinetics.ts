// =============================================================================
// GENERIC TIME SERIES AND CORE TYPES
// =============================================================================

export type TimeSeriesPoint = { timeH: number; valueMgL: number }; // Time in hours, value in mg/L
export type TimeSeriesMgL = TimeSeriesPoint[];

export interface PhTimeSeriesPoint {
  timeH: number;
  ph: number;
}
export type PhTimeSeries = PhTimeSeriesPoint[];

export interface ConcentrationTimeSeriesResultMgL {
  singleDoseMgL: TimeSeriesMgL;
  steadyStateMgL: TimeSeriesMgL;
  baseline: {
    singleDoseMgL: TimeSeriesMgL;
    steadyStateMgL: TimeSeriesMgL;
  };
}

// =============================================================================
// GENERIC DRUG INTERFACE FOR EXTENSIBILITY
// =============================================================================

export interface DrugParameters {
  readonly drugName: string;
  readonly naiveSleepThresholdNgML: number;
}

// Generic drug simulation inputs
export interface DrugSimulationInputs {
  doseMg: number;
  bodyWeightKg: number;
  baseUrinePh: number;
}

// =============================================================================
// GENERIC INTERVENTION SYSTEM
// =============================================================================

export interface InterventionParameters {
  readonly interventionType: string;
}

export interface InterventionInputs {
  interventionType: string;
}

export type PhCalculationFn<
  TIntervention extends InterventionInputs,
  TInterventionParams extends InterventionParameters,
> = (
  basePh: number,
  interventionInputs: TIntervention,
  interventionParams: TInterventionParams,
  dosingIntervalH: number,
  timeH: number,
) => number;

export type PhSeriesGeneratorFn<
  TIntervention extends InterventionInputs,
  TInterventionParams extends InterventionParameters,
> = (
  basePh: number,
  interventionInputs: TIntervention,
  interventionParams: TInterventionParams,
  dosingIntervalH: number,
  timeStepH: number,
) => PhTimeSeries;

// =============================================================================
// ANALYSIS RESULT TYPES (PURE FUNCTION OUTPUTS)
// =============================================================================

export interface SleepAnalysisResultOne {
  soonestYouCanFallAsleepWithInterventionH: number;
  soonestYouCanFallAsleepWithoutInterventionH: null;
  additionalSleepHoursGained: null;
  sleepImprovementPercent: null;
}

export interface SleepAnalysisResultTwo {
  soonestYouCanFallAsleepWithInterventionH: null;
  soonestYouCanFallAsleepWithoutInterventionH: number;
  additionalSleepHoursGained: null;
  sleepImprovementPercent: null;
}

export interface SleepAnalysisResultThree {
  soonestYouCanFallAsleepWithInterventionH: number;
  soonestYouCanFallAsleepWithoutInterventionH: number;
  additionalSleepHoursGained: number;
  sleepImprovementPercent: number;
}

export interface SleepAnalysisResultFour {
  soonestYouCanFallAsleepWithInterventionH: null;
  soonestYouCanFallAsleepWithoutInterventionH: null;
  additionalSleepHoursGained: null;
  sleepImprovementPercent: null;
}

export type SleepAnalysisResult =
  | SleepAnalysisResultOne
  | SleepAnalysisResultTwo
  | SleepAnalysisResultThree
  | SleepAnalysisResultFour;

export interface PharmacokineticSummary {
  eliminationRateConstantPerH: number;
  halfLifeH: number;
  accumulationFactorR: number;
  troughConcentrationSteadyStateMgL: number;
}

// =============================================================================
// CHART DATA INTERFACES (PRESENTATION LAYER)
// =============================================================================

export interface ConcentrationChartDataPoint {
  timeH: number;
  steadyStateConcentrationNgML: number;
  firstPeriodConcentrationNgML: number;
  steadyStateNoInterventionConcentrationNgML: number;
  firstDayNoInterventionConcentrationNgML: number;
}

export interface PhChartDataPoint {
  timeH: number;
  ph: number;
}

// =============================================================================
// FUNCTION TYPE DEFINITIONS
// =============================================================================

// Generic concentration time series calculation function type
// Takes pH time series (unitless pH over timeH) and returns concentration time series (mg/L over timeH)
export type ConcentrationTimeSeriesFromPhFn<
  TDrugParams extends DrugParameters,
> = (
  phTimeSeries: PhTimeSeries,
  drugInputs: DrugSimulationInputs,
  drugParams: TDrugParams,
  timeStepH: number,
) => ConcentrationTimeSeriesResultMgL; // concentrations (mg/L) over time (hours)

// =============================================================================
// GENERIC PH SERIES GENERATION FUNCTION
// =============================================================================

export function generatePhTimeSeriesWithIntervention<
  TIntervention extends InterventionInputs,
  TInterventionParams extends InterventionParameters,
>(
  basePh: number,
  interventionInputs: TIntervention,
  interventionParams: TInterventionParams,
  phCalculationFn: PhCalculationFn<TIntervention, TInterventionParams>,
  dosingIntervalH: number = 24,
  timeStepH: number = 0.1,
): PhTimeSeries {
  const phTimeSeries: PhTimeSeries = [];

  for (let timeH = 0; timeH <= dosingIntervalH; timeH += timeStepH) {
    phTimeSeries.push({
      timeH,
      ph: phCalculationFn(
        basePh,
        interventionInputs,
        interventionParams,
        dosingIntervalH,
        timeH,
      ),
    });
  }

  return phTimeSeries;
}
