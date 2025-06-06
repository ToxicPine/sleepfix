"use client";

import React, { useMemo, useCallback } from "react";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { ConcentrationChartDataPoint } from "@/lib/types/pharmacokinetics";
import { calculateConcentrationChartYAxisMax } from "@/lib/utils/chart-helpers";

// Enable duration plugin
dayjs.extend(duration);

interface ConcentrationChartProps {
  data: ConcentrationChartDataPoint[];
  dosingIntervalH: number; // Hours between doses
  estimatedSleepThresholdNgML: number; // ng/mL concentration threshold
  customSleepThresholdNgML: number; // ng/mL concentration threshold
  naiveSleepThresholdNgML: number; // ng/mL concentration threshold for calculation
  axisColor: string;
  axisLabelColor: string;
  steadyStateColor: string;
  firstDoseColor: string;
  steadyStateNoInterventionColor: string;
  firstDayNoInterventionColor: string;
}

// Memoized legend mapping to avoid recreation on every render
const LEGEND_MAP: Record<string, string> = {
  steadyStateConcentrationNgML: "Daily Dose (with Vitamin C)",
  firstPeriodConcentrationNgML: "First Dose (with Vitamin C)",
  steadyStateNoInterventionConcentrationNgML: "Daily Dose (no intervention)",
  firstDayNoInterventionConcentrationNgML: "First Dose (no intervention)",
};

export function ConcentrationChart({
  data,
  dosingIntervalH,
  estimatedSleepThresholdNgML,
  customSleepThresholdNgML,
  naiveSleepThresholdNgML,
  axisColor,
  axisLabelColor,
  steadyStateColor,
  firstDoseColor,
  steadyStateNoInterventionColor,
  firstDayNoInterventionColor,
}: ConcentrationChartProps) {
  // Calculate maxYAxisValue inside the component
  const maxYAxisValue = useMemo(
    () =>
      calculateConcentrationChartYAxisMax(
        data,
        customSleepThresholdNgML,
        naiveSleepThresholdNgML,
        estimatedSleepThresholdNgML,
      ),
    [
      data,
      customSleepThresholdNgML,
      naiveSleepThresholdNgML,
      estimatedSleepThresholdNgML,
    ],
  );

  // Memoize chart margins and styling objects
  const chartMargins = useMemo(
    () => ({ top: 20, right: 40, left: 20, bottom: 40 }),
    [],
  );

  const xAxisTicks = useMemo(
    () => [0, 4, 8, 12, 16, 20, 24].filter((tick) => tick <= dosingIntervalH),
    [dosingIntervalH],
  );

  const yAxisDomain = useMemo(
    () => [0, Math.ceil(maxYAxisValue)],
    [maxYAxisValue],
  );

  // Memoize tooltip styles
  const tooltipContentStyle = useMemo(
    () => ({
      backgroundColor: "rgba(255, 255, 255, 0.98)",
      backdropFilter: "blur(12px)",
      borderRadius: "16px",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      fontSize: "13px",
      fontWeight: "500",
    }),
    [],
  );

  const legendWrapperStyle = useMemo(
    () => ({
      paddingTop: "16px",
      fontSize: "13px",
      fontWeight: "500",
    }),
    [],
  );

  // Memoize tooltip formatter
  const tooltipFormatter = useCallback(
    (value: number, name: string) => [
      `${value.toFixed(1)} ng/mL`,
      LEGEND_MAP[name] || name,
    ],
    [],
  );

  // Memoize label formatter
  const labelFormatter = useCallback((label: string | number) => {
    const hours = parseFloat(String(label));
    const dur = dayjs.duration(hours, "hours");
    const h = dur.hours();
    const m = dur.minutes();

    if (h === 0) return `Time: ${m}m`;
    if (m === 0) return `Time: ${h}h`;
    return `Time: ${h}h ${m}m`;
  }, []);

  // Memoize legend formatter
  const legendFormatter = useCallback((value: string) => {
    return LEGEND_MAP[value] || value;
  }, []);

  // Memoize Y-axis label style
  const yAxisLabelStyle = useMemo(
    () => ({
      fontSize: 13,
      fill: axisLabelColor,
      fontWeight: "500",
    }),
    [axisLabelColor],
  );
  const xAxisDomain = useMemo(() => [0, dosingIntervalH], [dosingIntervalH]);
  const xAxisTickFormatter = useCallback((value: number) => `${value}h`, []);
  const xAxisLineStyle = useMemo(
    () => ({ stroke: axisColor, strokeOpacity: 0.5 }),
    [axisColor],
  );
  const yAxisTickFormatter = useCallback((value: number) => `${value}`, []);
  const yAxisLabel = useMemo(
    () => ({
      value: "Concentration (ng/mL)",
      angle: -90,
      position: "insideLeft" as const,
      style: yAxisLabelStyle,
    }),
    [yAxisLabelStyle],
  );
  const tooltipCursorStyle = useMemo(
    () => ({
      stroke: axisColor,
      strokeWidth: 1,
      strokeOpacity: 0.5,
      strokeDasharray: "3 3",
    }),
    [axisColor],
  );
  const customThresholdLabel = useMemo(
    () => ({
      value: "Your Sleep Threshold",
      position: "right" as const,
      offset: 10,
      style: {
        fontSize: 12,
        fill: "#8b5cf6",
        fontWeight: 600,
        textShadow: "0 1px 2px rgba(255,255,255,0.8)",
      },
    }),
    [],
  );
  const estimatedThresholdLabel = useMemo(
    () => ({
      value: "Dose-Adjusted",
      position: "left" as const,
      offset: 10,
      style: {
        fontSize: 11,
        fill: "#f59e0b",
        fontWeight: 500,
        textShadow: "0 1px 2px rgba(255,255,255,0.8)",
      },
    }),
    [],
  );
  const steadyStateActiveDot = useMemo(
    () => ({
      r: 7,
      fill: steadyStateColor,
      stroke: "#fff",
      strokeWidth: 2,
      filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
    }),
    [steadyStateColor],
  );
  const firstDoseActiveDot = useMemo(
    () => ({
      r: 6,
      fill: firstDoseColor,
      stroke: "#fff",
      strokeWidth: 2,
      filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
    }),
    [firstDoseColor],
  );
  const steadyStateNoInterventionActiveDot = useMemo(
    () => ({
      r: 5,
      fill: steadyStateNoInterventionColor,
      opacity: 0.8,
    }),
    [steadyStateNoInterventionColor],
  );
  const firstDayNoInterventionActiveDot = useMemo(
    () => ({
      r: 4,
      fill: firstDayNoInterventionColor,
      opacity: 0.8,
    }),
    [firstDayNoInterventionColor],
  );

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={chartMargins}>
        <defs>
          {/* Optimized gradient definitions */}
          <linearGradient id="steadyStateGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={steadyStateColor} stopOpacity={0.9} />
            <stop
              offset="100%"
              stopColor={steadyStateColor}
              stopOpacity={0.1}
            />
          </linearGradient>
          <linearGradient id="firstDoseGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={firstDoseColor} stopOpacity={0.9} />
            <stop offset="100%" stopColor={firstDoseColor} stopOpacity={0.1} />
          </linearGradient>
        </defs>

        <CartesianGrid
          strokeDasharray="2 4"
          stroke={axisColor}
          strokeOpacity={0.3}
          vertical={false}
        />

        <XAxis
          dataKey="timeH"
          domain={xAxisDomain}
          ticks={xAxisTicks}
          tickFormatter={xAxisTickFormatter}
          stroke={axisColor}
          fontSize={12}
          fontWeight="500"
          tickLine={false}
          axisLine={xAxisLineStyle}
        />

        <YAxis
          domain={yAxisDomain}
          tickFormatter={yAxisTickFormatter}
          label={yAxisLabel}
          stroke={axisColor}
          fontSize={12}
          fontWeight="500"
          tickLine={false}
          axisLine={false}
        />

        <Tooltip
          formatter={tooltipFormatter}
          labelFormatter={labelFormatter}
          contentStyle={tooltipContentStyle}
          cursor={tooltipCursorStyle}
          animationDuration={150}
        />

        <Legend
          wrapperStyle={legendWrapperStyle}
          iconType="line"
          formatter={legendFormatter}
        />

        {/* Enhanced sleep threshold reference lines */}
        <ReferenceLine
          y={customSleepThresholdNgML}
          stroke="#8b5cf6"
          strokeWidth={2.5}
          strokeDasharray="6 4"
          label={customThresholdLabel}
        />

        <ReferenceLine
          y={estimatedSleepThresholdNgML}
          stroke="#f59e0b"
          strokeWidth={2}
          strokeDasharray="4 4"
          label={estimatedThresholdLabel}
        />

        {/* Enhanced concentration lines with better visual hierarchy */}
        <Line
          type="monotone"
          dataKey="steadyStateConcentrationNgML"
          stroke={steadyStateColor}
          strokeWidth={3.5}
          dot={false}
          activeDot={steadyStateActiveDot}
          animationDuration={800}
          animationEasing="ease-out"
        />

        <Line
          type="monotone"
          dataKey="firstPeriodConcentrationNgML"
          stroke={firstDoseColor}
          strokeWidth={2.5}
          dot={false}
          activeDot={firstDoseActiveDot}
          animationDuration={600}
          animationEasing="ease-out"
        />

        <Line
          type="monotone"
          dataKey="steadyStateNoInterventionConcentrationNgML"
          stroke={steadyStateNoInterventionColor}
          strokeWidth={2}
          strokeDasharray="6 4"
          opacity={0.6}
          dot={false}
          activeDot={steadyStateNoInterventionActiveDot}
          animationDuration={400}
        />

        <Line
          type="monotone"
          dataKey="firstDayNoInterventionConcentrationNgML"
          stroke={firstDayNoInterventionColor}
          strokeWidth={1.5}
          strokeDasharray="4 4"
          opacity={0.6}
          dot={false}
          activeDot={firstDayNoInterventionActiveDot}
          animationDuration={400}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
