import { ConcentrationChartDataPoint } from "@/lib/types/pharmacokinetics";

/**
 * PURE FUNCTION: Calculate optimal Y-axis maximum for concentration chart
 * Takes chart data and threshold values to determine appropriate display bounds
 * Input: Chart data with ng/mL concentrations, threshold values in ng/mL
 * Output: Y-axis maximum value in ng/mL
 */
export function calculateConcentrationChartYAxisMax(
  chartData: ConcentrationChartDataPoint[],
  userSleepThresholdNgML: number,
  naiveSleepThresholdNgML: number,
  adjustedSleepThresholdNgML: number,
): number {
  // Fallback for empty or invalid data
  if (!chartData || chartData.length === 0) {
    return Math.max(
      100,
      userSleepThresholdNgML + 10,
      adjustedSleepThresholdNgML + 10,
    );
  }

  // Extract all concentration values from the chart data
  const allConcentrations = chartData.flatMap((d) =>
    [
      d.steadyStateConcentrationNgML,
      d.firstPeriodConcentrationNgML,
      d.steadyStateNoInterventionConcentrationNgML,
      d.firstDayNoInterventionConcentrationNgML,
    ].filter((c) => isFinite(c) && c !== null && c !== undefined),
  );

  // Find the maximum concentration in the data
  const maxConcentration =
    allConcentrations.length > 0 ? Math.max(...allConcentrations) : 0;

  // Calculate Y-axis max considering both data and threshold values
  // Add padding for better visual display
  return (
    Math.ceil(
      Math.max(
        maxConcentration,
        userSleepThresholdNgML,
        naiveSleepThresholdNgML,
        adjustedSleepThresholdNgML,
      ) / 10,
    ) *
      10 +
    20
  );
}

/**
 * PURE FUNCTION: Calculate optimal Y-axis range for pH chart
 * Determines appropriate display bounds for urine pH data
 * Input: pH data (unitless), safety bounds (unitless)
 * Output: Y-axis range object with min/max (unitless)
 */
export function calculatePhChartYAxisRange(
  phData: { ph: number }[],
  safeMinPh: number,
  safeMaxPh: number,
): { min: number; max: number } {
  if (!phData || phData.length === 0) {
    return {
      min: safeMinPh - 0.5,
      max: safeMaxPh + 0.5,
    };
  }

  const phValues = phData.map((d) => d.ph).filter((ph) => isFinite(ph));
  const minPh = Math.min(...phValues);
  const maxPh = Math.max(...phValues);

  // Expand range to include safety bounds and add padding
  return {
    min: Math.min(minPh - 0.2, safeMinPh - 0.5),
    max: Math.max(maxPh + 0.2, safeMaxPh + 0.5),
  };
}
