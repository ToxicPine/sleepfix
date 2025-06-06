import { DrugParameters } from "@/lib/types/pharmacokinetics";

export interface AmphetamineParameters extends DrugParameters {
  readonly drugName: "amphetamine";
  readonly oralBioavailabilityF: number;
  readonly amphetaminePerVyvanseF: number;
  readonly volumeDistributionFactorLPerKg: number;
  readonly hepaticClearanceLPerH: number;
  readonly renalClearanceAtPh6_5LPerH: number;
}

export const AMPHETAMINE_PARAMETERS: AmphetamineParameters = {
  drugName: "amphetamine",

  // Baseline sleep threshold concentration (ng/mL)
  naiveSleepThresholdNgML: 15,

  // Oral bioavailability of lisdexamfetamine (fraction)
  oralBioavailabilityF: 0.96,

  // Conversion factor from lisdexamfetamine to amphetamine (fraction)
  amphetaminePerVyvanseF: 0.294,

  // Volume of distribution factor per kg body weight (L/kg)
  volumeDistributionFactorLPerKg: 3.14,

  // Hepatic clearance rate (L/h)
  hepaticClearanceLPerH: 7.41,

  // Renal clearance at pH 6.5 (L/h)
  renalClearanceAtPh6_5LPerH: 7.14,
};
