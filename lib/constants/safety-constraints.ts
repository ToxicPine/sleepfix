/**
 * Application-level safety constraints
 * These are UI/safety bounds, not fundamental drug pharmacokinetic parameters
 */
export interface SafetyConstraints {
  readonly urinePhSafeMin: number;
  readonly urinePhSafeMax: number;
}

/**
 * Safety constraints for urine pH interventions
 * These represent safe physiological ranges for urine pH
 */
export const URINE_PH_SAFETY_CONSTRAINTS: SafetyConstraints = {
  urinePhSafeMin: 4.5,
  urinePhSafeMax: 8.0,
};
