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
import { ImplicitLabelType } from "recharts/types/component/Label";
import { ConcentrationChartDataPoint } from "@/lib/types/pharmacokinetics";
import { calculateConcentrationChartYAxisMax } from "@/lib/utils/chart-helpers";
import colors from "tailwindcss/colors";

// Enable duration plugin
dayjs.extend(duration);

interface ConcentrationChartProps {
  data: ConcentrationChartDataPoint[];
  dosingIntervalH: number; // Hours between doses
  estimatedSleepThresholdNgML: number; // ng/mL concentration threshold
  customSleepThresholdNgML: number; // ng/mL concentration threshold
  naiveSleepThresholdNgML: number; // ng/mL concentration threshold for calculation
  axisColor: keyof typeof colors;
  axisLabelColor: keyof typeof colors;
  steadyStateColor: keyof typeof colors;
  firstDoseColor: keyof typeof colors;
  steadyStateNoInterventionColor: keyof typeof colors;
  firstDayNoInterventionColor: keyof typeof colors;
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
  const tooltipContentStyle = useMemo(
    () => ({
      padding: "12px",
      display: "flex" as const,
      flexDirection: "column" as const,
      gap: "4px",
      backgroundColor: colors[axisColor][50],
      borderRadius: "16px",
      border: `1px solid ${colors[axisColor][200]}`,
      fontSize: "12px",
      lineHeight: "1",
      fontWeight: "500",
    }),
    [axisColor],
  );

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

  const xAxisDomain = useMemo(() => [0, dosingIntervalH], [dosingIntervalH]);
  const xAxisTicks = useMemo(
    () => [0, 4, 8, 12, 16, 20, 24].filter((tick) => tick <= dosingIntervalH),
    [dosingIntervalH],
  );
  /*const xAxisLabel = useMemo(
    () => ({
      value: "Time (h)",
      position: "insideBottomRight",
      style: { fontSize: 12, fill: colors[axisLabelColor][800] },
    }),
    [axisLabelColor],
  );*/
  const xAxisTickFormatter = useCallback((value: number) => `${value}h`, []);

  const yAxisDomain = useMemo(
    () => [0, Math.ceil(maxYAxisValue)],
    [maxYAxisValue],
  );
  const yAxisLabelStyle = useMemo(
    () => ({
      fontSize: 12,
      fill: colors[axisLabelColor][800],
      fontWeight: "500",
      paddingBottom: "4px",
      textAnchor: "middle" as const,
      dominantBaseline: "middle" as const,
      dx: -0,
      dy: -0,
    }),
    [axisLabelColor],
  );
  const yAxisLabel = useMemo(
    () => ({
      value: "Concentration (ng/mL)",
      angle: -90,
      position: "insideLeft" as const,
      style: yAxisLabelStyle,
    }),
    [yAxisLabelStyle],
  );
  const yAxisTickFormatter = useCallback((value: number) => `${value}`, []);

  // Memoize tooltip styles
  const legendWrapperStyle = useMemo(
    () => ({
      paddingTop: "8px",
      fontSize: "12px",
      fontWeight: "500",
    }),
    [],
  );

  const tooltipFormatter = useCallback(
    (value: number, name: string) => [
      `${value.toFixed(1)} ng/mL`,
      LEGEND_MAP[name] || name,
    ],
    [],
  );

  const labelFormatter = useCallback((label: string | number) => {
    const hours = parseFloat(String(label));
    const dur = dayjs.duration(hours, "hours");
    const h = dur.hours();
    const m = dur.minutes();

    if (h === 0) return `Time: ${m}m`;
    if (m === 0) return `Time: ${h}h`;
    return `Time: ${h}h ${m}m`;
  }, []);

  const legendFormatter = useCallback((value: string) => {
    return LEGEND_MAP[value] || value;
  }, []);

  const tooltipCursorStyle = useMemo(
    () => ({
      stroke: colors[axisColor][800],
      strokeWidth: 1,
      strokeOpacity: 0.5,
      strokeDasharray: "3 3",
    }),
    [axisColor],
  );

  const estimatedAbove = estimatedSleepThresholdNgML > customSleepThresholdNgML;

  const customThresholdLabel = useMemo<ImplicitLabelType>(
    () => ({
      value: "Your Sleep Threshold",
      position: estimatedAbove ? "insideTopLeft" : "insideBottomLeft",
      offset: 6,
      style: {
        fontSize: 10,
        fill: colors.purple[600],
        fontWeight: 600,
        textShadow: "0 1px 2px rgba(255,255,255,0.8)",
      },
    }),
    [estimatedAbove],
  );
  const estimatedThresholdLabel = useMemo<ImplicitLabelType>(
    () => ({
      value: "Dose-Adjusted",
      position: estimatedAbove ? "insideBottomLeft" : "insideTopLeft",
      offset: 6,
      style: {
        fontSize: 10,
        fill: colors.amber[600],
        fontWeight: 500,
        textShadow: "0 1px 2px rgba(255,255,255,0.8)",
      },
    }),
    [estimatedAbove],
  );
  const steadyStateActiveDot = useMemo(
    () => ({
      r: 7,
      fill: steadyStateColor,
      stroke: colors.white,
      strokeWidth: 2,
      filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
    }),
    [steadyStateColor],
  );
  const firstDoseActiveDot = useMemo(
    () => ({
      r: 6,
      fill: firstDoseColor,
      stroke: colors.white,
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
          stroke={colors[axisColor][800]}
          strokeOpacity={0.25}
          vertical={false}
        />

        <XAxis
          dataKey="timeH"
          domain={xAxisDomain}
          ticks={xAxisTicks}
          tickFormatter={xAxisTickFormatter}
          stroke={colors[axisColor][800]}
          fontSize={12}
          fontWeight="500"
          tickLine={false}
          axisLine={{ stroke: colors[axisColor][800] }}
        />

        <YAxis
          domain={yAxisDomain}
          tickFormatter={yAxisTickFormatter}
          label={yAxisLabel}
          stroke={colors[axisColor][800]}
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
          itemStyle={{
            fontSize: 12,
            fontWeight: "500",
          }}
          labelStyle={{
            fontSize: 15,
            marginBottom: "3px",
            fontWeight: "500",
          }}
        />

        <Legend
          wrapperStyle={legendWrapperStyle}
          iconType="line"
          formatter={legendFormatter}
        />

        {/* Enhanced sleep threshold reference lines */}
        <ReferenceLine
          y={customSleepThresholdNgML}
          stroke={colors.purple[600]}
          strokeWidth={1.5}
          strokeDasharray="6 4"
          label={customThresholdLabel}
        />

        <ReferenceLine
          y={estimatedSleepThresholdNgML}
          stroke={colors.amber[600]}
          strokeWidth={1.5}
          strokeDasharray="6 4"
          label={estimatedThresholdLabel}
        />

        {/* Enhanced concentration lines with better visual hierarchy */}
        <Line
          type="monotone"
          dataKey="steadyStateConcentrationNgML"
          stroke={colors[steadyStateColor][600]}
          strokeWidth={2}
          dot={false}
          activeDot={steadyStateActiveDot}
          animationDuration={800}
          animationEasing="ease-out"
        />

        <Line
          type="monotone"
          dataKey="steadyStateNoInterventionConcentrationNgML"
          stroke={colors[steadyStateNoInterventionColor][600]}
          strokeWidth={2}
          strokeDasharray="6 4"
          opacity={0.75}
          dot={false}
          activeDot={steadyStateNoInterventionActiveDot}
          animationDuration={400}
        />

        <Line
          type="monotone"
          dataKey="firstPeriodConcentrationNgML"
          stroke={colors[firstDoseColor][600]}
          strokeWidth={2}
          dot={false}
          activeDot={firstDoseActiveDot}
          animationDuration={600}
          animationEasing="ease-out"
        />

        <Line
          type="monotone"
          dataKey="firstDayNoInterventionConcentrationNgML"
          stroke={colors[firstDayNoInterventionColor][600]}
          strokeWidth={2}
          strokeDasharray="4 4"
          opacity={0.7}
          dot={false}
          activeDot={firstDayNoInterventionActiveDot}
          animationDuration={400}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
