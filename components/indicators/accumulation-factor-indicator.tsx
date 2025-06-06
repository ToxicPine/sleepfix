import React from "react";
import { Card } from "@/components/ui/card";

interface AccumulationFactorIndicatorProps {
  currentAccumulationFactor: number;
  referenceAccumulationFactor: number;
  referenceUrinePh: number;
}

interface InfoCardProps {
  label: string;
  value: string;
  variant?: "default" | "purple";
}

function InfoCard({ label, value, variant = "default" }: InfoCardProps) {
  const styles = {
    default: {
      container: "bg-gray-50 rounded-lg p-3",
      label: "text-xs text-gray-600 mb-1",
      value: "font-semibold text-gray-900",
    },
    purple: {
      container: "bg-purple-50 rounded-lg p-3",
      label: "text-xs text-purple-600 mb-1",
      value: "font-semibold text-purple-900",
    },
  };

  const style = styles[variant];

  return (
    <Card className={style.container}>
      <div className={style.label}>{label}</div>
      <div className={style.value}>{value}</div>
    </Card>
  );
}

interface IndicatorBarProps {
  isLower: boolean;
  changePercent: number;
}

function IndicatorBar({ isLower, changePercent }: IndicatorBarProps) {
  const getIndicatorColor = () => {
    if (Math.abs(changePercent) < 5) return "from-gray-400 to-gray-500";
    return isLower
      ? "from-green-500 to-emerald-500"
      : "from-orange-500 to-red-500";
  };

  return (
    <div
      className={`h-2 bg-gradient-to-r ${getIndicatorColor()} rounded-full mb-4`}
    />
  );
}

interface ChangeDisplayProps {
  changePercent: number;
  isLower: boolean;
}

function ChangeDisplay({ changePercent, isLower }: ChangeDisplayProps) {
  const getChangeText = () => {
    if (Math.abs(changePercent) < 5) return "Similar buildup";
    return isLower ? "Less drug buildup" : "More drug buildup";
  };

  return (
    <div className="mt-4 text-center">
      <span
        className={`text-sm font-medium ${
          isLower ? "text-green-700" : "text-orange-700"
        }`}
      >
        {Math.abs(changePercent).toFixed(0)}% {getChangeText()}
      </span>
    </div>
  );
}

interface NoteSectionProps {
  currentAccumulationFactor: number;
  isLower: boolean;
}

function NoteSection({ currentAccumulationFactor, isLower }: NoteSectionProps) {
  return (
    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
      <p className="text-xs text-blue-700">
        <span className="font-medium">Note:</span> With daily dosing, peak
        levels reach {currentAccumulationFactor.toFixed(1)}x single-dose levels
        {isLower
          ? ", reducing potential side effects"
          : ", which may increase side effects"}
        .
      </p>
    </div>
  );
}

function validateAccumulationFactors(
  current: number,
  reference: number,
): boolean {
  return (
    isFinite(current) && current > 0 && isFinite(reference) && reference > 0
  );
}

export function AccumulationFactorIndicator({
  currentAccumulationFactor,
  referenceAccumulationFactor,
  referenceUrinePh,
}: AccumulationFactorIndicatorProps) {
  if (
    !validateAccumulationFactors(
      currentAccumulationFactor,
      referenceAccumulationFactor,
    )
  ) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 text-center">
        <p className="text-sm text-gray-500">Accumulation data not available</p>
      </div>
    );
  }

  const changePercent =
    ((currentAccumulationFactor - referenceAccumulationFactor) /
      referenceAccumulationFactor) *
    100;
  const isLower = currentAccumulationFactor < referenceAccumulationFactor;

  return (
    <div className="relative">
      <IndicatorBar isLower={isLower} changePercent={changePercent} />

      <div className="grid grid-cols-2 gap-4 text-sm">
        <InfoCard
          label="Current buildup"
          value={`${currentAccumulationFactor.toFixed(2)}x`}
        />

        <InfoCard
          label={`Reference (pH ${referenceUrinePh})`}
          value={`${referenceAccumulationFactor.toFixed(2)}x`}
          variant="purple"
        />
      </div>

      <ChangeDisplay changePercent={changePercent} isLower={isLower} />

      <NoteSection
        currentAccumulationFactor={currentAccumulationFactor}
        isLower={isLower}
      />
    </div>
  );
}
