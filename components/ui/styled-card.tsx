import * as React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  getBackgroundColor,
  getBorderColor,
  ColoredText,
  ColoredItem,
  getTextColor,
  getSubheadingColor,
  COLORS,
  getHeadingColor,
  getBackgroundGradient,
} from "@/components/ui/color";

export interface StyledCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    ColoredItem {
  cardStyle?: "default" | "elevated" | "section";
  cardBackground?: "default" | "gradient";
  cardPerimeter?: "shadow" | "border" | "none";
  cardPadding?: "default" | "compact" | "subcompact";
}

interface StyledRegularHeaderProps
  extends React.HTMLAttributes<HTMLDivElement>,
    ColoredItem,
    ColoredText {
  variant?: "default";
}

interface StyledProminentHeaderProps
  extends React.HTMLAttributes<HTMLDivElement>,
    ColoredText {
  variant: "prominent";
  backgroundColor?: keyof COLORS;
}

type StyledHeaderProps = StyledRegularHeaderProps | StyledProminentHeaderProps;

interface StyledContentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    ColoredText {}

interface StyledDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    ColoredText {
  variant?: "default" | "muted" | "emphasized";
}

interface StyledTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    ColoredText {
  size?: "default" | "small" | "tiny" | "micro";
}

export function StyledCard({
  className,
  cardStyle = "default",
  cardBackground = "default",
  cardPerimeter = "shadow",
  cardPadding = "default",
  backgroundColor = "default",
  ...props
}: StyledCardProps) {
  return (
    <Card
      className={cn(
        "flex flex-col",
        { "gap-1.5 p-4 md:gap-2.5 md:p-6": cardPadding === "default" },
        { "gap-1 p-3 md:gap-1.5 md:p-4": cardPadding === "compact" },
        { "gap-1 p-3": cardPadding === "subcompact" },
        {
          [getBackgroundGradient(backgroundColor)]:
            cardBackground === "gradient",
          [getBackgroundColor(backgroundColor)]: cardBackground === "default",
        },
        { [getBorderColor(backgroundColor)]: cardPerimeter === "border" },
        { "border-1": cardPerimeter === "border" },
        { "rounded-2xl": cardStyle === "default" },
        { "transition-shadow": cardPerimeter === "shadow" },
        {
          "shadow-md hover:shadow-lg":
            cardPerimeter === "shadow" && cardStyle === "default",
          "shadow-lg hover:shadow-xl":
            cardPerimeter === "shadow" && cardStyle === "elevated",
          "shadow-md": cardPerimeter === "shadow" && cardStyle === "section",
        },
        className,
      )}
      {...props}
    />
  );
}

export function StyledHeader({
  className,
  variant = "default",
  backgroundColor = "default",
  ...props
}: StyledHeaderProps) {
  const bgStyles = cn({
    "bg-gradient-to-br from-purple-200 to-pink-200":
      backgroundColor === "purple",
    "bg-gradient-to-br from-blue-200 to-indigo-200": backgroundColor === "blue",
    "bg-gradient-to-br from-green-200 to-emerald-200":
      backgroundColor === "green",
    "bg-gradient-to-br from-orange-200 to-yellow-200":
      backgroundColor === "orange",
    "bg-gradient-to-br from-red-200 to-rose-200": backgroundColor === "red",
  });
  return (
    <CardHeader
      className={cn(
        "space-y-0.5 leading-tight",
        { "rounded-t-2xl": backgroundColor },
        { [bgStyles]: variant === "prominent" },
        {
          "p-0": variant === "default",
          "p-8": variant === "prominent",
        },
        className,
      )}
      {...props}
    />
  );
}

export function StyledContent({
  className,
  textColor = "default",
  ...props
}: StyledContentProps) {
  return (
    <CardContent
      className={cn("space-y-6 text-sm", getTextColor(textColor), className)}
      {...props}
    />
  );
}

export function StyledTitle({
  className,
  textColor = "default",
  size = "default",
  ...props
}: StyledTitleProps) {
  return (
    <CardTitle
      className={cn(
        "font-semibold leading-tight",
        { "text-lg md:text-xl": size === "default" },
        { "text-md": size === "small" },
        { "text-sm": size === "tiny" },
        { "text-xs": size === "micro" },
        getHeadingColor(textColor),
        className,
      )}
      {...props}
    />
  );
}

export function StyledDescription({
  className,
  variant = "default",
  textColor = "default",
  ...props
}: StyledDescriptionProps) {
  return (
    <CardDescription
      className={cn(
        "leading-tight text-sm",
        getSubheadingColor(textColor),
        {
          "text-muted-foreground": variant === "muted",
          "text-foreground font-medium": variant === "emphasized",
        },
        className,
      )}
      {...props}
    />
  );
}
