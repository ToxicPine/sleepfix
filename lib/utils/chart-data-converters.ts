import {
  ConcentrationTimeSeriesResultMgL,
  ConcentrationChartDataPoint,
  PhTimeSeriesPoint,
  PhChartDataPoint,
} from "@/lib/types/pharmacokinetics";

export function convertConcentrationTimeSeriestoChartData(
  concentrations: ConcentrationTimeSeriesResultMgL,
): ConcentrationChartDataPoint[] {
  // Use single dose data as the time basis (all series should have same time points)
  const timePoints = concentrations.singleDoseMgL;

  return timePoints.map((point, index) => {
    const timeH = point.timeH;

    // Convert mg/L to ng/mL: 1 mg/L = 1000 ng/mL
    const mgLToNgMLConversionFactor = 1000;

    return {
      timeH,
      steadyStateConcentrationNgML:
        (concentrations.steadyStateMgL[index]?.valueMgL || 0) *
        mgLToNgMLConversionFactor,
      firstPeriodConcentrationNgML:
        (concentrations.singleDoseMgL[index]?.valueMgL || 0) *
        mgLToNgMLConversionFactor,
      steadyStateNoInterventionConcentrationNgML:
        (concentrations.baseline.steadyStateMgL[index]?.valueMgL || 0) *
        mgLToNgMLConversionFactor,
      firstDayNoInterventionConcentrationNgML:
        (concentrations.baseline.singleDoseMgL[index]?.valueMgL || 0) *
        mgLToNgMLConversionFactor,
    };
  });
}

export function convertPhTimeSeriestoChartData(
  phTimeSeries: PhTimeSeriesPoint[],
): PhChartDataPoint[] {
  return phTimeSeries.map((point) => ({
    timeH: point.timeH,
    ph: point.ph,
  }));
}
