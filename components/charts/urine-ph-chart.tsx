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
import { PhTimeSeriesPoint } from "@/lib/types/pharmacokinetics";
import colors from "tailwindcss/colors";

dayjs.extend(duration);

interface UrinePhChartProps {
  data: PhTimeSeriesPoint[];
  dosingIntervalH: number;
  axisColor: keyof typeof colors;
  axisLabelColor: keyof typeof colors;
}

export function UrinePhChart({
  data,
  dosingIntervalH,
  axisColor,
  axisLabelColor,
}: UrinePhChartProps) {
  const chartMargins = useMemo(
    () => ({ top: 10, right: 30, left: 10, bottom: 30 }),
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

  const yAxisDomain = useMemo(() => [4, 8], []);
  const yAxisTicks = useMemo(() => [4, 5, 6, 7, 8], []);
  const yAxisLabel = useMemo(
    () => ({
      value: "Urine pH",
      angle: -90,
      position: "insideLeft",
      style: { fontSize: 12, fill: colors[axisLabelColor][800] },
    }),
    [axisLabelColor],
  );

  const yAxisTickFormatter = useCallback(
    (value: number) => value.toFixed(1),
    [],
  );

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

  const neutralPhLabel = useMemo(
    () => ({ fontSize: 10, fill: colors.green[600] }),
    [],
  );

  const acidicPhLabel = useMemo(
    () => ({ fontSize: 10, fill: colors.red[600] }),
    [],
  );

  const activeDotStyle = useMemo(() => ({ r: 6, fill: colors.amber[600] }), []);

  const tooltipValueFormatter = useCallback(
    (value: number) => value.toFixed(2),
    [],
  );

  const tooltipLabelFormatter = useCallback((label: string | number) => {
    const hours = parseFloat(String(label));
    const dur = dayjs.duration(hours, "hours");
    const h = dur.hours();
    const m = dur.minutes();

    if (h === 0) return `Time: ${m}m`;
    if (m === 0) return `Time: ${h}h`;
    return `Time: ${h}h ${m}m`;
  }, []);

  const hideLegend = useCallback(() => null, []);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={chartMargins}>
        <defs>
          <linearGradient id="phGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={colors.amber[500]} stopOpacity={0.8} />
            <stop
              offset="100%"
              stopColor={colors.amber[500]}
              stopOpacity={0.3}
            />
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
          tickLine={false}
        />

        <YAxis
          domain={yAxisDomain}
          ticks={yAxisTicks}
          tickFormatter={yAxisTickFormatter}
          label={yAxisLabel}
          stroke={colors[axisColor][800]}
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />

        <Tooltip
          formatter={tooltipValueFormatter}
          labelFormatter={tooltipLabelFormatter}
          contentStyle={tooltipContentStyle}
          labelStyle={{
            fontSize: 15,
            marginBottom: "3px",
            fontWeight: "500",
          }}
          itemStyle={{
            fontSize: 12,
            fontWeight: "500",
          }}
        />

        <Legend content={hideLegend} />

        <ReferenceLine
          y={7}
          stroke={colors.green[600]}
          strokeWidth={1.5}
          strokeDasharray="3 3"
          label={neutralPhLabel}
        />

        <ReferenceLine
          y={5.5}
          stroke={colors.red[600]}
          strokeWidth={1.5}
          strokeDasharray="3 3"
          label={acidicPhLabel}
        />

        {/* pH Line */}
        <Line
          type="monotone"
          dataKey="ph"
          name="Urine pH"
          stroke={colors.amber[500]}
          strokeWidth={2}
          dot={false}
          activeDot={activeDotStyle}
        />

        {/* Highlight intervention timing */}
        {data.length > 0 && (
          <ReferenceLine
            x={data[0].timeH}
            stroke={colors.purple[600]}
            strokeWidth={1}
            strokeDasharray="5 5"
            opacity={0}
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
}
