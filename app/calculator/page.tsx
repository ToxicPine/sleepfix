"use client";

import React, { useState, useMemo } from "react";
import { HeroHeader } from "@/components/sections/title-section";
import {
  MedicationDetailsCard,
  VitaminCStrategyCard,
  SleepSensitivityCard,
} from "@/components/sections/medication-controls";
import { AdvancedSettings } from "@/components/sections/advanced-settings";
import { MedicalDisclaimerSection } from "@/components/sections/footer-sections";
import { AMPHETAMINE_PARAMETERS } from "@/lib/pharmaceuticals/amphetamine/constants";
import { VITAMIN_C_INTERVENTION_PARAMS } from "@/lib/interventions/ascorbic";
import { convertConcentrationTimeSeriestoChartData } from "@/lib/utils/chart-data-converters";
import { SleepImpactIndicator } from "@/components/sections/sleep-impact";
import { BloodConcentration } from "@/components/sections/blood-concentration";
import { UrinaryPhComponent } from "@/components/sections/urinary-ph";

import { calculateVitaminCPhTimeSeries } from "@/lib/interventions/ascorbic";
import { calculateAmphetamineConcentrationsMgL } from "@/lib/utils/concentration-calculations";
import { analyzeSleepImprovement } from "@/lib/utils/analysis-functions";
import { calculateAdjustedSleepThresholdForAmphetamine } from "@/lib/pharmaceuticals/amphetamine/utils";
import { AcknowledgementsSection } from "@/components/sections/footer-sections";

export default function VyvanseSleepSimulator() {
  const dosingIntervalH = 24;
  const [vyvanseDoseMg, setVyvanseDoseMg] = useState<number>(30);
  const [bodyWeightKg, setBodyWeightKg] = useState<number>(70);
  const [baseUrinePh, setBaseUrinePh] = useState<number>(6.5);
  const [userSleepThresholdNgML, setUserSleepThresholdNgML] =
    useState<number>(13);

  const [vitaminCDoseMg, setVitaminCDoseMg] = useState<number>(1800);
  const [vitaminCTimeH, setVitaminCTimeH] = useState<number>(2);
  const [urineFlowRateLPerH, setUrineFlowRateLPerH] = useState<number>(0.06);
  const [
    urineBufferCapacityMmolPerLPerPh,
    setUrineBufferCapacityMmolPerLPerPh,
  ] = useState<number>(30);

  const urinePhTimeSeries = useMemo(() => {
    return calculateVitaminCPhTimeSeries(
      baseUrinePh,
      {
        interventionType: "vitaminC" as const,
        vitaminCDoseMg,
        vitaminCTimeH,
        urineFlowRateLPerH,
        urineBufferCapacityMmolPerLPerPh,
      },
      VITAMIN_C_INTERVENTION_PARAMS,
      dosingIntervalH,
      0.1,
    );
  }, [
    baseUrinePh,
    vitaminCDoseMg,
    vitaminCTimeH,
    urineFlowRateLPerH,
    urineBufferCapacityMmolPerLPerPh,
  ]);

  const concentrationTimeSeries = useMemo(() => {
    return calculateAmphetamineConcentrationsMgL(
      urinePhTimeSeries,
      { doseMg: vyvanseDoseMg, bodyWeightKg, baseUrinePh },
      AMPHETAMINE_PARAMETERS,
      0.1,
    );
  }, [urinePhTimeSeries, vyvanseDoseMg, bodyWeightKg, baseUrinePh]);

  const concentrationChartData = useMemo(
    () => convertConcentrationTimeSeriestoChartData(concentrationTimeSeries),
    [concentrationTimeSeries],
  );

  const sleepAnalysis = useMemo(
    () =>
      analyzeSleepImprovement(concentrationTimeSeries, userSleepThresholdNgML),
    [concentrationTimeSeries, userSleepThresholdNgML],
  );

  /*
  const pkSummary = calculatePharmacokineticSummary(
    concentrationTimeSeries,
    AMPHETAMINE_PARAMETERS.dosingIntervalH,
  );
  */

  const adjustedSleepThresholdNgML = useMemo(
    () =>
      calculateAdjustedSleepThresholdForAmphetamine(
        vyvanseDoseMg,
        AMPHETAMINE_PARAMETERS.naiveSleepThresholdNgML,
      ),
    [vyvanseDoseMg],
  );

  /* const referenceParams = useMemo(
    () =>
      calculateBaseline(
        { doseMg: vyvanseDoseMg, bodyWeightKg, baseUrinePh },
        AMPHETAMINE_PARAMETERS,
        calculateAmphetamineConcentrationsMgL,
      ),
    [vyvanseDoseMg, bodyWeightKg, baseUrinePh],
  ); */

  // Advanced settings configuration
  const advancedSettings = useMemo(
    () => [
      {
        key: "urineFlowRate",
        label: "Urine Flow Rate",
        value: urineFlowRateLPerH,
        min: 0.02,
        max: 0.2,
        step: 0.01,
        unit: "L/h",
        precision: 2,
        description:
          "Normal range: 0.04-0.08 L/h. Higher values dilute the effect.",
        onChange: setUrineFlowRateLPerH,
      },
      {
        key: "urineBufferCapacity",
        label: "Urine Buffer Capacity",
        value: urineBufferCapacityMmolPerLPerPh,
        min: 10,
        max: 50,
        step: 1,
        unit: "mmol/L/pH",
        precision: 0,
        description: "Normal range: 20-40. Higher values resist pH changes.",
        onChange: setUrineBufferCapacityMmolPerLPerPh,
      },
    ],
    [urineFlowRateLPerH, urineBufferCapacityMmolPerLPerPh],
  );

  return (
    <div className="max-w-4xl md:max-w-6xl mx-auto px-4 py-12 sm:px-6 sm:py-12 lg:p-8 lg:py-24">
      <div className="flex flex-col gap-6 md:gap-8">
        <HeroHeader title="Vitamin C Sleep Calculator" />

        <MedicalDisclaimerSection />

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 xl:grid-cols-[3fr_2fr_2fr] gap-8">
          <div className="md:col-span-2 xl:col-span-1">
            <SleepImpactIndicator
              sleepMetrics={sleepAnalysis}
              cardSettings={{
                cardPadding: "default",
                cardPerimeter: "shadow",
                cardBackground: "gradient",
                backgroundColor: "blue",
              }}
            />
          </div>
          <VitaminCStrategyCard
            vitaminCDoseMg={vitaminCDoseMg}
            vitaminCTimeH={vitaminCTimeH}
            onVitaminCDoseChange={setVitaminCDoseMg}
            onVitaminCTimeChange={setVitaminCTimeH}
            cardSettings={{
              cardPadding: "default",
              cardPerimeter: "border",
              cardBackground: "default",
              backgroundColor: "orange",
            }}
          />
          <SleepSensitivityCard
            userSleepThresholdNgML={userSleepThresholdNgML}
            adjustedSleepThresholdNgML={adjustedSleepThresholdNgML}
            naiveSleepThresholdNgML={
              AMPHETAMINE_PARAMETERS.naiveSleepThresholdNgML
            }
            onSleepThresholdChange={setUserSleepThresholdNgML}
            cardSettings={{
              cardPadding: "default",
              cardPerimeter: "border",
              cardBackground: "default",
              backgroundColor: "pink",
            }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <BloodConcentration
            data={concentrationChartData}
            dosingIntervalH={dosingIntervalH}
            estimatedSleepThresholdNgML={adjustedSleepThresholdNgML}
            customSleepThresholdNgML={userSleepThresholdNgML}
            naiveSleepThresholdNgML={
              AMPHETAMINE_PARAMETERS.naiveSleepThresholdNgML
            }
            cardSettings={{
              cardPadding: "default",
              cardPerimeter: "border",
              cardBackground: "default",
              backgroundColor: "green",
            }}
            axisColors={{
              axisColor: "#016630",
              axisLabelColor: "#016630",
            }}
            lineColors={{
              steadyStateColor: "#ff595e",
              firstDoseColor: "#ffca3a",
              steadyStateNoInterventionColor: "#8ac926",
              firstDayNoInterventionColor: "#1982c4",
            }}
          />
          <MedicationDetailsCard
            simulationInputs={{
              doseMg: vyvanseDoseMg,
              bodyWeightKg,
              baseUrinePh,
            }}
            onDoseChange={setVyvanseDoseMg}
            onBodyWeightChange={setBodyWeightKg}
            onBaseUrinePhChange={setBaseUrinePh}
            cardSettings={{
              cardPadding: "default",
              cardPerimeter: "border",
              cardBackground: "default",
              backgroundColor: "blue",
            }}
          />
        </div>

        <UrinaryPhComponent
          data={urinePhTimeSeries}
          dosingIntervalH={dosingIntervalH}
          cardSettings={{
            cardPadding: "default",
            cardPerimeter: "border",
            cardBackground: "default",
            backgroundColor: "amber",
          }}
        />

        <AdvancedSettings
          settings={advancedSettings}
          cardSettings={{
            cardPadding: "default",
            cardPerimeter: "border",
            cardBackground: "default",
            backgroundColor: "purple",
          }}
        />

        {/* <PharmacokineticDetails
              pkSummary={simulationResults.pkSummary}
              referenceParams={referenceParams}
              referenceUrinePh={AMPHETAMINE_PARAMETERS.referenceUrinePh}
              dosingIntervalH={AMPHETAMINE_PARAMETERS.dosingIntervalH}
            /> */}

        <AcknowledgementsSection />
      </div>
    </div>
  );
}
