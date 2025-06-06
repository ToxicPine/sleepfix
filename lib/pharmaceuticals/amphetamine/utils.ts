// THIS IS NOT SOUND
export function calculateAdjustedSleepThresholdForAmphetamine(
  doseMg: number,
  baselineThresholdNgML: number,
): number {
  const doseAdjustment = (doseMg - 30) / 4;
  const adjustedThreshold = baselineThresholdNgML + doseAdjustment;

  return Math.min(20, Math.max(baselineThresholdNgML, adjustedThreshold));
}
