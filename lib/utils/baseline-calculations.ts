import {
  DrugSimulationInputs,
  PhTimeSeries,
  ConcentrationTimeSeriesFromPhFn,
  DrugParameters,
  PharmacokineticSummary,
} from "@/lib/types/pharmacokinetics";
import { calculatePharmacokineticSummary } from "./analysis-functions";

export function calculateBaseline<TDrugParams extends DrugParameters>(
  drugInputs: DrugSimulationInputs,
  drugParams: TDrugParams,
  concentrationCalculatorFn: ConcentrationTimeSeriesFromPhFn<TDrugParams>,
  timeStepH: number = 0.1,
  dosingIntervalH: number = 24,
): PharmacokineticSummary {
  const flatPhTimeSeries: PhTimeSeries = [];

  for (let timeH = 0; timeH <= dosingIntervalH; timeH += timeStepH) {
    flatPhTimeSeries.push({
      timeH,
      ph: drugInputs.baseUrinePh,
    });
  }

  const baselineConcentrationsMgL = concentrationCalculatorFn(
    flatPhTimeSeries,
    drugInputs,
    drugParams,
    timeStepH,
  );

  return calculatePharmacokineticSummary(
    baselineConcentrationsMgL,
    dosingIntervalH,
  );
}
