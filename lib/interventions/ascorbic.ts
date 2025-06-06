import {
  InterventionParameters,
  InterventionInputs,
  PhCalculationFn,
  PhSeriesGeneratorFn,
  generatePhTimeSeriesWithIntervention,
} from "@/lib/types/pharmacokinetics";

export interface VitaminCInterventionParameters extends InterventionParameters {
  readonly interventionType: "vitaminC";
  readonly ascorbateMolarMassMgPerMmol: number;
  readonly ascorbateDefaultHalfLifeH: number;
}

export const VITAMIN_C_INTERVENTION_PARAMS: VitaminCInterventionParameters = {
  interventionType: "vitaminC",
  ascorbateMolarMassMgPerMmol: 176.12,
  ascorbateDefaultHalfLifeH: 4.0,
};

export interface VitaminCInterventionInputs extends InterventionInputs {
  interventionType: "vitaminC";
  vitaminCDoseMg: number;
  vitaminCTimeH: number;
  urineFlowRateLPerH: number;
  urineBufferCapacityMmolPerLPerPh: number;
}

function calculateAscorbateFractionalAbsorption(doseMg: number): number {
  if (doseMg <= 0) return 0;
  if (doseMg <= 200) return 0.9;
  if (doseMg >= 1250) return 0.33;

  // linear interpolation between 200mg and 1250mg
  return 0.9 - ((doseMg - 200) / (1250 - 200)) * (0.9 - 0.33);
}

export const calculateVitaminCPhEffect: PhCalculationFn<
  VitaminCInterventionInputs,
  VitaminCInterventionParameters
> = (
  basePh: number,
  interventionInputs: VitaminCInterventionInputs,
  interventionParams: VitaminCInterventionParameters,
  dosingIntervalH: number,
  timeH: number,
): number => {
  if (interventionInputs.vitaminCDoseMg <= 0) {
    return basePh;
  }

  const timeSinceVitaminCAdministrationH =
    timeH - interventionInputs.vitaminCTimeH;

  if (timeSinceVitaminCAdministrationH < 0) {
    return basePh;
  }

  const vitaminCDoseMg = interventionInputs.vitaminCDoseMg;
  const fractionalAbsorption =
    calculateAscorbateFractionalAbsorption(vitaminCDoseMg);
  const ascorbateMolarMass = interventionParams.ascorbateMolarMassMgPerMmol;
  const ascorbateHalfLife = interventionParams.ascorbateDefaultHalfLifeH;
  const ascorbateEliminationRate = Math.log(2) / ascorbateHalfLife;
  const bufferCapacity = interventionInputs.urineBufferCapacityMmolPerLPerPh;
  const urineFlowRate = interventionInputs.urineFlowRateLPerH;

  if (bufferCapacity <= 0 || urineFlowRate <= 0 || ascorbateMolarMass <= 0) {
    return basePh;
  }

  const absorbedAscorbateMmol =
    (fractionalAbsorption * vitaminCDoseMg) / ascorbateMolarMass;
  const dynamicFactor =
    (ascorbateEliminationRate *
      Math.exp(-ascorbateEliminationRate * timeSinceVitaminCAdministrationH)) /
    (bufferCapacity * urineFlowRate);

  const phChange = -absorbedAscorbateMmol * dynamicFactor;
  return basePh + phChange;
};

export const calculateVitaminCPhTimeSeries: PhSeriesGeneratorFn<
  VitaminCInterventionInputs,
  VitaminCInterventionParameters
> = (
  basePh: number,
  interventionInputs: VitaminCInterventionInputs,
  interventionParams: VitaminCInterventionParameters,
  dosingIntervalH: number,
  timeStepH: number,
) => {
  return generatePhTimeSeriesWithIntervention(
    basePh,
    interventionInputs,
    interventionParams,
    calculateVitaminCPhEffect,
    dosingIntervalH,
    timeStepH,
  );
};
