import React, { useCallback, useState, useMemo } from "react";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { SleepAnalysisResult } from "@/lib/types/pharmacokinetics";
import { StyledSlider } from "@/components/ui/styled-slider";
import {
  StyledCard,
  StyledContent,
  StyledDescription,
  StyledHeader,
  StyledTitle,
  type StyledCardProps,
} from "@/components/ui/styled-card";
import { COLORS } from "../ui/color";

dayjs.extend(duration);

interface SleepTimeCardProps {
  variant: "without" | "with";
  label: string;
  emoji: string;
  sleepWindow: string;
  sleepWindowLabel: string;
}

function SleepTimeCard({
  variant,
  label,
  emoji,
  sleepWindow,
}: SleepTimeCardProps) {
  const backgroundColor = variant === "with" ? "amber" : "pink";
  return (
    <StyledCard
      cardPadding="subcompact"
      cardPerimeter="border"
      cardBackground={variant === "with" ? "gradient" : "default"}
      backgroundColor={backgroundColor}
      className="flex flex-row-reverse justify-between"
    >
      <div>
        <span className="text-xl">{emoji}</span>
      </div>
      <div>
        <StyledHeader>
          <StyledDescription textColor={backgroundColor}>
            {label}
          </StyledDescription>
        </StyledHeader>
        <StyledContent className="space-y-1">
          <StyledTitle textColor={backgroundColor}>{sleepWindow}</StyledTitle>
        </StyledContent>
      </div>
    </StyledCard>
  );
}

interface PersonalizedSleepScheduleProps {
  soonestYouCanFallAsleepWithoutInterventionH: number | null;
  soonestYouCanFallAsleepWithInterventionH: number | null;
  backgroundColor?: keyof COLORS;
}

function formatSleepWindow(awakeTimeH: number | null): string {
  if (awakeTimeH === null) return "No Sleep";

  // Calculate available sleep window in 24 hours
  const sleepWindowH = 24 - awakeTimeH;

  if (sleepWindowH <= 0) return "No Sleep";

  const dur = dayjs.duration(sleepWindowH, "hours");
  const h = dur.hours();
  const m = dur.minutes();

  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

function getSleepWindowLabel(awakeTimeH: number | null): string {
  if (awakeTimeH === null) return "impossible";

  const sleepWindowH = 24 - awakeTimeH;
  if (sleepWindowH <= 0) return "impossible";

  return "sleep window";
}

function formatHoursGained(hours: number): string {
  const dur = dayjs.duration(hours, "hours");
  const h = dur.hours();
  const m = dur.minutes();

  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

function getTimeEmoji(hours: number | null): string {
  if (hours === null) return "❌";
  if (hours < 12) return "🌅";
  if (hours < 18) return "☀️";
  if (hours < 22) return "🌆";
  return "🌙";
}

function getImpactMessage(hoursGained: number): string {
  if (hoursGained >= 3) return "Excellent improvement! 🎉";
  if (hoursGained >= 2) return "Great improvement! 👍";
  if (hoursGained >= 1) return "Good improvement 😊";
  return "Sure, it's not much, but it's something!";
}

function formatTimeAMPM(totalHours: number): string {
  const baseTime = dayjs().startOf("day");
  const targetTime = baseTime.add(totalHours, "hours");
  return targetTime.format("h:mm A");
}

// PersonalizedSleepSchedule Component
export function PersonalizedSleepSchedule({
  soonestYouCanFallAsleepWithoutInterventionH,
  soonestYouCanFallAsleepWithInterventionH,
  backgroundColor,
}: PersonalizedSleepScheduleProps) {
  const [wakeUpTimeH, setWakeUpTimeH] = useState<number>(7);

  const formatWakeUpTimeForSlider = useCallback((timeH: number): string => {
    const baseTime = dayjs().startOf("day");
    const targetTime = baseTime.add(timeH, "hours");
    return targetTime.format("h:mm A");
  }, []);

  return (
    <>
      <div className="text-sm text-gray-700">
        {soonestYouCanFallAsleepWithoutInterventionH !== null &&
        soonestYouCanFallAsleepWithInterventionH !== null ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <StyledCard
                cardPadding="subcompact"
                cardPerimeter="border"
                cardBackground="default"
                backgroundColor="amber"
              >
                <StyledHeader>
                  <StyledDescription textColor="amber">
                    Bedtime Without
                  </StyledDescription>
                </StyledHeader>
                <StyledContent
                  className="text-xl leading-tight font-bold"
                  textColor="amber"
                >
                  {formatTimeAMPM(
                    wakeUpTimeH + soonestYouCanFallAsleepWithoutInterventionH,
                  )}
                </StyledContent>
              </StyledCard>
              <StyledCard
                cardPadding="subcompact"
                cardPerimeter="border"
                cardBackground="gradient"
                backgroundColor="green"
              >
                <StyledHeader>
                  <StyledDescription textColor="green">
                    Bedtime With
                  </StyledDescription>
                </StyledHeader>
                <StyledContent
                  className="text-xl leading-tight font-bold"
                  textColor="green"
                >
                  {formatTimeAMPM(
                    wakeUpTimeH + soonestYouCanFallAsleepWithInterventionH,
                  )}
                </StyledContent>
              </StyledCard>
            </div>
            <StyledSlider
              label="When do you take Vyvanse?"
              color={backgroundColor}
              value={wakeUpTimeH}
              min={5}
              max={11}
              step={0.5}
              unit="h"
              precision={1}
              onValueChange={setWakeUpTimeH}
              customFormatter={formatWakeUpTimeForSlider}
            />
          </div>
        ) : (
          <div className="space-y-1.5">
            <p className="text-center text-gray-600">
              Current settings suggest sleep may not be possible within 24
              hours. Consider lowering your dose or increasing your sleep
              threshold.
            </p>
          </div>
        )}
      </div>
    </>
  );
}

interface SleepImpactIndicatorProps {
  sleepMetrics: SleepAnalysisResult;
  cardSettings: StyledCardProps;
}

export function SleepImpactIndicator({
  sleepMetrics,
  cardSettings,
}: SleepImpactIndicatorProps) {
  const {
    soonestYouCanFallAsleepWithInterventionH,
    soonestYouCanFallAsleepWithoutInterventionH,
    additionalSleepHoursGained,
  } = sleepMetrics;

  const formattedHoursGained = useMemo(
    () => formatHoursGained(additionalSleepHoursGained ?? 0),
    [additionalSleepHoursGained],
  );

  const impactMessage = useMemo(
    () => getImpactMessage(additionalSleepHoursGained ?? 0),
    [additionalSleepHoursGained],
  );

  const sleepDisplayData = useMemo(
    () => ({
      without: {
        emoji: getTimeEmoji(soonestYouCanFallAsleepWithoutInterventionH),
        window: formatSleepWindow(soonestYouCanFallAsleepWithoutInterventionH),
        windowLabel: getSleepWindowLabel(
          soonestYouCanFallAsleepWithoutInterventionH,
        ),
      },
      with: {
        emoji: getTimeEmoji(soonestYouCanFallAsleepWithInterventionH),
        window: formatSleepWindow(soonestYouCanFallAsleepWithInterventionH),
        windowLabel: getSleepWindowLabel(
          soonestYouCanFallAsleepWithInterventionH,
        ),
      },
    }),
    [
      soonestYouCanFallAsleepWithoutInterventionH,
      soonestYouCanFallAsleepWithInterventionH,
    ],
  );

  return (
    <StyledCard
      cardPadding={cardSettings.cardPadding}
      cardPerimeter={cardSettings.cardPerimeter}
      cardBackground={cardSettings.cardBackground}
      backgroundColor={cardSettings.backgroundColor}
      className="justify-center"
    >
      <StyledHeader className="py-4 space-y-1.5 md:space-y-2.5 text-center">
        <StyledTitle
          className="text-2xl md:text-3xl"
          textColor={cardSettings.backgroundColor}
        >
          You&apos;ll Sleep {formattedHoursGained} Longer!
        </StyledTitle>
        <StyledDescription
          className="text-lg md:text-xl"
          textColor={cardSettings.backgroundColor}
        >
          {impactMessage}
        </StyledDescription>
      </StyledHeader>
      <StyledContent className="space-y-4">
        {/* Sleep Time Comparison */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SleepTimeCard
            variant="without"
            label="Without Vitamin C"
            emoji={sleepDisplayData.without.emoji}
            sleepWindow={sleepDisplayData.without.window}
            sleepWindowLabel={sleepDisplayData.without.windowLabel}
          />

          <SleepTimeCard
            variant="with"
            label="With Vitamin C"
            emoji={sleepDisplayData.with.emoji}
            sleepWindow={sleepDisplayData.with.window}
            sleepWindowLabel={sleepDisplayData.with.windowLabel}
          />
        </div>
        <PersonalizedSleepSchedule
          soonestYouCanFallAsleepWithoutInterventionH={
            soonestYouCanFallAsleepWithoutInterventionH
          }
          soonestYouCanFallAsleepWithInterventionH={
            soonestYouCanFallAsleepWithInterventionH
          }
          backgroundColor={cardSettings.backgroundColor}
        />
      </StyledContent>
    </StyledCard>
  );
}
