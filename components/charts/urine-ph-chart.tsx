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

dayjs.extend(duration);

interface UrinePhChartProps {
  data: PhTimeSeriesPoint[];
  dosingIntervalH: number;
  axisColor: string;
  axisLabelColor: string;
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

  const xAxisTicks = useMemo(
    () => [0, 4, 8, 12, 16, 20, 24].filter((tick) => tick <= dosingIntervalH),
    [dosingIntervalH],
  );

  const yAxisDomain = useMemo(() => [4, 8], []);
  const yAxisTicks = useMemo(() => [4, 5, 6, 7, 8], []);

  const yAxisLabelStyle = useMemo(
    () => ({ fontSize: 12, fill: axisLabelColor }),
    [axisLabelColor],
  );

  const tooltipContentStyle = useMemo(
    () => ({
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(8px)",
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    }),
    [],
  );

  const neutralPhLabelStyle = useMemo(
    () => ({ fontSize: 10, fill: "#10b981" }),
    [],
  );

  const acidicPhLabelStyle = useMemo(
    () => ({ fontSize: 10, fill: "#ef4444" }),
    [],
  );

  const activeDotStyle = useMemo(() => ({ r: 6, fill: "#f59e0b" }), []);

  // Memoize formatters and callbacks
  const xAxisTickFormatter = useCallback((value: number) => `${value}h`, []);

  const yAxisTickFormatter = useCallback(
    (value: number) => value.toFixed(1),
    [],
  );

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
            <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.8} />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.3} />
          </linearGradient>
        </defs>

        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#e5e7eb"
          vertical={false}
        />

        <XAxis
          dataKey="timeH"
          domain={[0, dosingIntervalH]}
          ticks={xAxisTicks}
          tickFormatter={xAxisTickFormatter}
          label={{
            value: "Time (h)",
            style: { fontSize: 12, fill: axisLabelColor },
          }}
          stroke={axisColor}
          fontSize={12}
          tickLine={false}
        />

        <YAxis
          domain={yAxisDomain}
          ticks={yAxisTicks}
          tickFormatter={yAxisTickFormatter}
          label={{
            value: "Urine pH",
            angle: -90,
            position: "insideLeft",
            style: yAxisLabelStyle,
          }}
          stroke={axisColor}
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />

        <Tooltip
          formatter={tooltipValueFormatter}
          labelFormatter={tooltipLabelFormatter}
          contentStyle={tooltipContentStyle}
        />

        <Legend
          content={hideLegend} // Hide legend for single line
        />

        {/* Reference lines for pH levels */}
        <ReferenceLine
          y={7}
          stroke="#10b981"
          strokeWidth={1.5}
          strokeDasharray="3 3"
          label={{
            value: "Neutral pH",
            position: "right",
            style: neutralPhLabelStyle,
          }}
        />

        <ReferenceLine
          y={5.5}
          stroke="#ef4444"
          strokeWidth={1.5}
          strokeDasharray="3 3"
          label={{
            value: "Acidic",
            position: "right",
            style: acidicPhLabelStyle,
          }}
        />

        {/* pH Line */}
        <Line
          type="monotone"
          dataKey="ph"
          name="Urine pH"
          stroke="#f0b100"
          strokeWidth={3}
          dot={false}
          activeDot={activeDotStyle}
        />

        {/* Highlight intervention timing */}
        {data.length > 0 && (
          <ReferenceLine
            x={data[0].timeH}
            stroke="#8b5cf6"
            strokeWidth={1}
            strokeDasharray="5 5"
            opacity={0}
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
}
