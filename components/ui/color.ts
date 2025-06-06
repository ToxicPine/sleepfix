import { cn } from "@/lib/utils";

export type COLORS = {
  default: "gray";
  purple: "purple";
  pink: "pink";
  teal: "teal";
  yellow: "yellow";
  violet: "violet";
  indigo: "indigo";
  amber: "amber";
  orange: "orange";
  blue: "blue";
  green: "green";
  red: "red";
};

export interface ColoredItem {
  backgroundColor?: keyof COLORS;
}

export interface ColoredText {
  textColor?: keyof COLORS;
}

export const getColor: { [key in keyof COLORS]: string } = {
  default: "gray",
  purple: "purple",
  pink: "pink",
  teal: "teal",
  yellow: "yellow",
  violet: "violet",
  indigo: "indigo",
  amber: "amber",
  orange: "orange",
  blue: "blue",
  green: "green",
  red: "red",
};

export function getBackgroundGradient(
  backgroundColor: ColoredItem["backgroundColor"],
): string {
  return cn({
    "bg-white/80 backdrop-blur-sm": backgroundColor === "default",
    "bg-linear-to-br/oklch from-purple-100 to-pink-100 backdrop-blur-sm":
      backgroundColor === "purple",
    "bg-linear-to-br/oklch from-orange-100 to-yellow-100 backdrop-blur-sm":
      backgroundColor === "orange",
    "bg-linear-to-br/oklch from-blue-100 to-violet-100 backdrop-blur-sm":
      backgroundColor === "blue",
    "bg-linear-to-br/oklch from-green-100 to-teal-100 backdrop-blur-sm":
      backgroundColor === "green",
    "bg-linear-to-br/oklch from-red-100 to-pink-100 backdrop-blur-sm":
      backgroundColor === "red",
    "bg-linear-to-br/oklch from-pink-100 to-purple-100 backdrop-blur-sm":
      backgroundColor === "pink",
    "bg-linear-to-br/oklch from-teal-100 to-green-100 backdrop-blur-sm":
      backgroundColor === "teal",
    "bg-linear-to-br/oklch from-yellow-100 to-orange-100 backdrop-blur-sm":
      backgroundColor === "yellow",
    "bg-linear-to-br/oklch from-violet-100 to-blue-100 backdrop-blur-sm":
      backgroundColor === "violet",
    "bg-linear-to-br/oklch from-indigo-100 to-sky-100 backdrop-blur-sm":
      backgroundColor === "indigo",
    "bg-linear-to-br/oklch from-amber-100 to-red-100 backdrop-blur-sm":
      backgroundColor === "amber",
  });
}

export function getBackgroundColor(
  backgroundColor: ColoredItem["backgroundColor"],
): string {
  return cn({
    "bg-white/80 backdrop-blur-sm": backgroundColor === "default",
    "bg-purple-50": backgroundColor === "purple",
    "bg-orange-50": backgroundColor === "orange",
    "bg-blue-50": backgroundColor === "blue",
    "bg-green-50": backgroundColor === "green",
    "bg-red-50": backgroundColor === "red",
    "bg-pink-50": backgroundColor === "pink",
    "bg-teal-50": backgroundColor === "teal",
    "bg-yellow-50": backgroundColor === "yellow",
    "bg-violet-50": backgroundColor === "violet",
    "bg-indigo-50": backgroundColor === "indigo",
    "bg-amber-50": backgroundColor === "amber",
  });
}

export function getBorderColor(
  backgroundColor: ColoredItem["backgroundColor"],
): string {
  return cn({
    "border-gray-200": backgroundColor === "default",
    "border-purple-200": backgroundColor === "purple",
    "border-orange-200": backgroundColor === "orange",
    "border-blue-200": backgroundColor === "blue",
    "border-green-200": backgroundColor === "green",
    "border-red-200": backgroundColor === "red",
    "border-pink-200": backgroundColor === "pink",
    "border-teal-200": backgroundColor === "teal",
    "border-yellow-200": backgroundColor === "yellow",
    "border-violet-200": backgroundColor === "violet",
    "border-indigo-200": backgroundColor === "indigo",
    "border-amber-200": backgroundColor === "amber",
  });
}

export function getHeadingColor(
  backgroundColor: ColoredItem["backgroundColor"],
): string {
  return cn({
    "text-gray-900": backgroundColor === "default",
    "text-purple-900": backgroundColor === "purple",
    "text-orange-900": backgroundColor === "orange",
    "text-blue-900": backgroundColor === "blue",
    "text-green-900": backgroundColor === "green",
    "text-red-900": backgroundColor === "red",
    "text-pink-900": backgroundColor === "pink",
    "text-teal-900": backgroundColor === "teal",
    "text-yellow-900": backgroundColor === "yellow",
    "text-violet-900": backgroundColor === "violet",
    "text-indigo-900": backgroundColor === "indigo",
    "text-amber-900": backgroundColor === "amber",
  });
}

export function getSubheadingColor(
  backgroundColor: ColoredItem["backgroundColor"],
): string {
  return cn({
    "text-gray-600": backgroundColor === "default",
    "text-purple-600": backgroundColor === "purple",
    "text-orange-600": backgroundColor === "orange",
    "text-blue-600": backgroundColor === "blue",
    "text-green-600": backgroundColor === "green",
    "text-red-600": backgroundColor === "red",
    "text-pink-600": backgroundColor === "pink",
    "text-teal-600": backgroundColor === "teal",
    "text-yellow-600": backgroundColor === "yellow",
    "text-violet-600": backgroundColor === "violet",
    "text-indigo-600": backgroundColor === "indigo",
    "text-amber-600": backgroundColor === "amber",
  });
}

export function getTextColor(
  backgroundColor: ColoredItem["backgroundColor"],
): string {
  return cn({
    "text-gray-700/85": backgroundColor === "default",
    "text-purple-700/85": backgroundColor === "purple",
    "text-orange-700/85": backgroundColor === "orange",
    "text-blue-700/85": backgroundColor === "blue",
    "text-green-700/85": backgroundColor === "green",
    "text-red-700/85": backgroundColor === "red",
    "text-pink-700/85": backgroundColor === "pink",
    "text-teal-700/85": backgroundColor === "teal",
    "text-yellow-700/85": backgroundColor === "yellow",
    "text-violet-700/85": backgroundColor === "violet",
    "text-indigo-700/85": backgroundColor === "indigo",
    "text-amber-700/85": backgroundColor === "amber",
  });
}
