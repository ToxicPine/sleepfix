import React from "react";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

// Enable duration plugin
dayjs.extend(duration);

interface HalfLifeIndicatorProps {
  currentHalfLifeH: number;
  referenceHalfLifeH: number;
  referenceUrinePh: number;
}

export function HalfLifeIndicator({
  currentHalfLifeH,
  referenceHalfLifeH,
  referenceUrinePh,
}: HalfLifeIndicatorProps) {
  const changePercent =
    ((currentHalfLifeH - referenceHalfLifeH) / referenceHalfLifeH) * 100;
  const isShorter = currentHalfLifeH < referenceHalfLifeH;

  const formatHours = (hours: number): string => {
    const dur = dayjs.duration(hours, "hours");
    const h = dur.hours();
    const m = dur.minutes();

    if (h === 0) return `${m}m`;
    if (m === 0) return `${h}h`;
    return `${h}h ${m}m`;
  };

  const getIndicatorColor = () => {
    if (Math.abs(changePercent) < 5) return "from-gray-400 to-gray-500";
    return isShorter
      ? "from-green-500 to-emerald-500"
      : "from-orange-500 to-red-500";
  };

  const getChangeText = () => {
    if (Math.abs(changePercent) < 5) return "About the same";
    return isShorter ? "Faster elimination" : "Slower elimination";
  };

  return (
    <div className="relative">
      <div
        className={`h-2 bg-gradient-to-r ${getIndicatorColor()} rounded-full mb-4`}
      />

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-xs text-gray-600 mb-1">Current half-life</div>
          <div className="font-semibold text-gray-900">
            {formatHours(currentHalfLifeH)}
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-3">
          <div className="text-xs text-purple-600 mb-1">
            Reference (pH {referenceUrinePh})
          </div>
          <div className="font-semibold text-purple-900">
            {formatHours(referenceHalfLifeH)}
          </div>
        </div>
      </div>

      <div className="mt-4 text-center">
        <span
          className={`text-sm font-medium ${
            isShorter ? "text-green-700" : "text-orange-700"
          }`}
        >
          {Math.abs(changePercent).toFixed(0)}% {getChangeText()}
        </span>
      </div>
    </div>
  );
}
