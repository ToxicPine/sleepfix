import React, { useMemo } from "react";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { COLORS } from "@/components/ui/color";
import colors from "tailwindcss/colors";

interface StyledSliderProps {
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
  size?: "sm" | "md" | "lg";
  color?: keyof COLORS;
  disabled?: boolean;
  id?: string;
  name?: string;
  className?: string;
}

const sizeVariants = {
  sm: {
    track: "h-1",
    thumb:
      "[&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3",
    label: "text-xs",
    value: "text-sm",
  },
  md: {
    track: "h-2",
    thumb:
      "[&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5",
    label: "text-sm",
    value: "text-lg",
  },
  lg: {
    track: "h-3",
    thumb:
      "[&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6",
    label: "text-base",
    value: "text-xl",
  },
};

export function StyledSlider({
  size = "md",
  color = "purple",
  className,
  ...props
}: StyledSliderProps) {
  const sizeConfig = sizeVariants[size];
  const percentage =
    ((props.value - props.min) / (props.max - props.min)) * 100;

  const { fillColor, trackBgColor } = useMemo(() => {
    const colorPalette =
      color in colors ? colors[color as keyof typeof colors] : colors.gray;
    let mutedColor = colorPalette[200];

    if (typeof mutedColor === "string" && mutedColor.startsWith("oklch(")) {
      const match = mutedColor.match(/oklch\(([^)]+)\)/);
      if (match) {
        const parts = match[1].split(/\s+/);
        if (parts.length === 3) {
          const l = parts[0];
          const c = parseFloat(parts[1]);
          const h = parts[2];
          const mutedChroma = c * 0.5;
          mutedColor = `oklch(${l} ${mutedChroma} ${h})`;
        }
      }
    }

    return {
      fillColor: colorPalette[500],
      trackBgColor: mutedColor,
    };
  }, [color]);

  const trackBackgroundClassName = cn("rounded-lg", sizeConfig.track, [
    "bg-[linear-gradient(to_right,var(--fill-color)_0%,var(--fill-color)_var(--fill-percentage),var(--track-bg-color)_var(--fill-percentage),var(--track-bg-color)_100%)]",
  ]);

  // Transparent input overlay
  const trackClassName = cn(
    "w-full appearance-none bg-transparent cursor-pointer relative z-10",
    "focus:outline-none",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    "[&::-webkit-slider-thumb]:appearance-none",
    "[&::-webkit-slider-thumb]:bg-white",
    "[&::-webkit-slider-thumb]:border-3",
    {
      "[&::-webkit-slider-thumb]:border-purple-600": color === "purple",
      "[&::-webkit-slider-thumb]:border-blue-600": color === "blue",
      "[&::-webkit-slider-thumb]:border-green-600": color === "green",
      "[&::-webkit-slider-thumb]:border-red-600": color === "red",
      "[&::-webkit-slider-thumb]:border-orange-600": color === "orange",
      "[&::-webkit-slider-thumb]:border-gray-600": color === "default",
      "[&::-webkit-slider-thumb]:border-pink-600": color === "pink",
      "[&::-webkit-slider-thumb]:border-teal-600": color === "teal",
      "[&::-webkit-slider-thumb]:border-yellow-600": color === "yellow",
      "[&::-webkit-slider-thumb]:border-violet-600": color === "violet",
      "[&::-webkit-slider-thumb]:border-indigo-600": color === "indigo",
      "[&::-webkit-slider-thumb]:border-amber-600": color === "amber",
    },
    "[&::-webkit-slider-thumb]:rounded-full",
    "[&::-webkit-slider-thumb]:cursor-pointer",
    "[&::-webkit-slider-thumb]:shadow-lg",
    "[&::-webkit-slider-thumb]:transition-all",
    "[&::-webkit-slider-thumb]:duration-200",
    "hover:[&::-webkit-slider-thumb]:scale-110",
    "[&::-moz-range-thumb]:appearance-none",
    "[&::-moz-range-thumb]:bg-white",
    "[&::-moz-range-thumb]:border-3",
    {
      "[&::-moz-range-thumb]:border-purple-600": color === "purple",
      "[&::-moz-range-thumb]:border-blue-600": color === "blue",
      "[&::-moz-range-thumb]:border-green-600": color === "green",
      "[&::-moz-range-thumb]:border-red-600": color === "red",
      "[&::-moz-range-thumb]:border-orange-600": color === "orange",
      "[&::-moz-range-thumb]:border-gray-600": color === "default",
      "[&::-moz-range-thumb]:border-pink-600": color === "pink",
      "[&::-moz-range-thumb]:border-teal-600": color === "teal",
      "[&::-moz-range-thumb]:border-yellow-600": color === "yellow",
      "[&::-moz-range-thumb]:border-violet-600": color === "violet",
      "[&::-moz-range-thumb]:border-indigo-600": color === "indigo",
      "[&::-moz-range-thumb]:border-amber-600": color === "amber",
    },
    "[&::-moz-range-thumb]:rounded-full",
    "[&::-moz-range-thumb]:cursor-pointer",
    "[&::-moz-range-thumb]:shadow-lg",
    "hover:[&::-moz-range-thumb]:scale-110",
    sizeConfig.thumb,
    sizeConfig.track,
  );

  return (
    <Slider
      {...props}
      className={cn("space-y-3", className)}
      labelClassName={cn(
        "font-medium leading-tight text-gray-700",
        sizeConfig.label,
      )}
      valueClassName={cn(
        "font-semibold leading-tight text-gray-900",
        sizeConfig.value,
      )}
      trackClassName={trackClassName}
      trackBackgroundClassName={trackBackgroundClassName}
      style={
        {
          "--fill-percentage": `${percentage}%`,
          "--fill-color": fillColor,
          "--track-bg-color": trackBgColor,
        } as React.CSSProperties
      }
    />
  );
}
