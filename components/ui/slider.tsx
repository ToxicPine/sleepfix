import React from "react";
import { cn } from "@/lib/utils";

interface SliderProps {
  label?: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  precision?: number;
  onValueChange: (value: number) => void;
  customFormatter?: (value: number) => string;
  showMinMax?: boolean;
  className?: string;
  trackClassName?: string;
  trackBackgroundClassName?: string;
  labelClassName?: string;
  valueClassName?: string;
  disabled?: boolean;
  id?: string;
  name?: string;
  style?: React.CSSProperties;
}

export function Slider({
  label,
  value,
  min,
  max,
  step,
  unit = "",
  precision = 1,
  onValueChange,
  customFormatter,
  showMinMax = true,
  className,
  trackClassName,
  trackBackgroundClassName,
  labelClassName,
  valueClassName,
  disabled = false,
  id,
  name,
  style,
}: SliderProps) {
  const displayValue = customFormatter
    ? customFormatter(value)
    : `${value.toFixed(precision)}${unit ? ` ${unit}` : ""}`;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onValueChange(parseFloat(e.target.value));
  };

  return (
    <div className={cn("space-y-3", className)}>
      {label && (
        <div className="flex justify-between items-center">
          <label
            htmlFor={id}
            className={cn("text-sm font-medium leading-none", labelClassName)}
          >
            {label}
          </label>
          <div className="flex items-baseline gap-1">
            <span className={cn("text-lg font-semibold", valueClassName)}>
              {displayValue}
            </span>
          </div>
        </div>
      )}

      <div className="relative flex items-center">
        {/* Background track for gradient */}
        {trackBackgroundClassName && (
          <div
            className={cn(
              "absolute inset-0 pointer-events-none",
              trackBackgroundClassName,
            )}
            style={style}
          />
        )}

        {/* Transparent input overlay - positioned absolutely to align with background */}
        <input
          id={id}
          name={name}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          className={cn("absolute inset-0", trackClassName)}
        />
      </div>

      {showMinMax && (
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-500">{min}</span>
          <span className="text-xs text-gray-500">{max}</span>
        </div>
      )}
    </div>
  );
}
