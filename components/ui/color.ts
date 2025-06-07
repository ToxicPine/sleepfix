import { cn } from "@/lib/utils";
import colors from "tailwindcss/colors";

export type COLORS = {
  default: "gray";
} & { [key in keyof typeof colors]: string };

export interface ColoredItem {
  backgroundColor?: keyof COLORS;
}

export interface ColoredText {
  textColor?: keyof COLORS;
}

export const BACKGROUND_GRADIENTS: Record<keyof COLORS, string> = {
  default: "bg-white/80 backdrop-blur-sm",
  red: "bg-linear-to-br/oklch from-red-100 to-pink-100 backdrop-blur-sm",
  orange: "bg-linear-to-br/oklch from-orange-100 to-rose-100 backdrop-blur-sm",
  amber: "bg-linear-to-br/oklch from-amber-100 to-red-100 backdrop-blur-sm",
  yellow:
    "bg-linear-to-br/oklch from-yellow-100 to-orange-100 backdrop-blur-sm",
  lime: "bg-linear-to-br/oklch from-lime-100 to-amber-100 backdrop-blur-sm",
  green: "bg-linear-to-br/oklch from-green-100 to-teal-100 backdrop-blur-sm",
  emerald:
    "bg-linear-to-br/oklch from-emerald-100 to-lime-100 backdrop-blur-sm",
  teal: "bg-linear-to-br/oklch from-teal-100 to-green-100 backdrop-blur-sm",
  cyan: "bg-linear-to-br/oklch from-cyan-100 to-emerald-100 backdrop-blur-sm",
  sky: "bg-linear-to-br/oklch from-sky-100 to-teal-100 backdrop-blur-sm",
  blue: "bg-linear-to-br/oklch from-blue-100 to-violet-100 backdrop-blur-sm",
  indigo: "bg-linear-to-br/oklch from-indigo-100 to-sky-100 backdrop-blur-sm",
  violet: "bg-linear-to-br/oklch from-violet-100 to-blue-100 backdrop-blur-sm",
  purple:
    "bg-linear-to-br/oklch from-purple-100 to-indigo-100 backdrop-blur-sm",
  fuchsia:
    "bg-linear-to-br/oklch from-fuchsia-100 to-violet-100 backdrop-blur-sm",
  pink: "bg-linear-to-br/oklch from-pink-100 to-purple-100 backdrop-blur-sm",
  rose: "bg-linear-to-br/oklch from-rose-100 to-fuchsia-100 backdrop-blur-sm",

  slate: "bg-linear-to-br/oklch from-slate-200 to-slate-100 backdrop-blur-sm",
  gray: "bg-linear-to-br/oklch from-gray-200 to-gray-100 backdrop-blur-sm",
  zinc: "bg-linear-to-br/oklch from-zinc-200 to-zinc-100 backdrop-blur-sm",
  neutral:
    "bg-linear-to-br/oklch from-neutral-200 to-neutral-100 backdrop-blur-sm",
  stone: "bg-linear-to-br/oklch from-stone-200 to-stone-100 backdrop-blur-sm",

  inherit: "bg-inherit",
  current: "bg-current",
  transparent: "bg-transparent",
  black: "bg-linear-to-br/oklch from-black/80 to-black/60 backdrop-blur-sm",
  white: "bg-white",
};

export function getBackgroundGradient(
  backgroundColor: ColoredItem["backgroundColor"],
): string {
  return cn(BACKGROUND_GRADIENTS[backgroundColor ?? "default"]);
}

export const BACKGROUND_COLORS: Record<keyof COLORS, string> = {
  default: "bg-white/80 backdrop-blur-sm",
  purple: "bg-purple-50",
  orange: "bg-orange-50",
  blue: "bg-blue-50",
  green: "bg-green-50",
  red: "bg-red-50",
  pink: "bg-pink-50",
  teal: "bg-teal-50",
  yellow: "bg-yellow-50",
  violet: "bg-violet-50",
  indigo: "bg-indigo-50",
  amber: "bg-amber-50",
  gray: "bg-gray-50",
  inherit: "bg-inherit",
  current: "bg-current",
  transparent: "bg-transparent",
  black: "bg-black",
  white: "bg-white",
  slate: "bg-slate-50",
  zinc: "bg-zinc-50",
  neutral: "bg-neutral-50",
  stone: "bg-stone-50",
  lime: "bg-lime-50",
  emerald: "bg-emerald-50",
  cyan: "bg-cyan-50",
  sky: "bg-sky-50",
  fuchsia: "bg-fuchsia-50",
  rose: "bg-rose-50",
};

export function getBackgroundColor(
  backgroundColor: ColoredItem["backgroundColor"],
): string {
  return cn(BACKGROUND_COLORS[backgroundColor ?? "default"]);
}

export const BORDER_COLORS: Record<keyof COLORS, string> = {
  default: "border-gray-200",
  purple: "border-purple-200",
  orange: "border-orange-200",
  blue: "border-blue-200",
  green: "border-green-200",
  red: "border-red-200",
  pink: "border-pink-200",
  teal: "border-teal-200",
  yellow: "border-yellow-200",
  violet: "border-violet-200",
  indigo: "border-indigo-200",
  amber: "border-amber-200",
  gray: "border-gray-200",
  inherit: "border-inherit",
  current: "border-current",
  transparent: "border-transparent",
  black: "border-black",
  white: "border-white",
  slate: "border-slate-200",
  zinc: "border-zinc-200",
  neutral: "border-neutral-200",
  stone: "border-stone-200",
  lime: "border-lime-200",
  emerald: "border-emerald-200",
  cyan: "border-cyan-200",
  sky: "border-sky-200",
  fuchsia: "border-fuchsia-200",
  rose: "border-rose-200",
};

export function getBorderColor(
  backgroundColor: ColoredItem["backgroundColor"],
): string {
  return cn(BORDER_COLORS[backgroundColor ?? "default"]);
}

export const SUBHEADING_COLORS: Record<keyof COLORS, string> = {
  default: "text-gray-700/85",
  purple: "text-purple-700/85",
  orange: "text-orange-700/85",
  blue: "text-blue-700/85",
  green: "text-green-700/85",
  red: "text-red-700/85",
  pink: "text-pink-700/85",
  teal: "text-teal-700/85",
  yellow: "text-yellow-700/85",
  violet: "text-violet-700/85",
  indigo: "text-indigo-700/85",
  amber: "text-amber-700/85",
  gray: "text-gray-700/85",
  inherit: "text-inherit",
  current: "text-current",
  transparent: "text-transparent",
  black: "text-black",
  white: "text-white",
  slate: "text-slate-700/85",
  zinc: "text-zinc-700/85",
  neutral: "text-neutral-700/85",
  stone: "text-stone-700/85",
  lime: "text-lime-700/85",
  emerald: "text-emerald-700/85",
  cyan: "text-cyan-700/85",
  sky: "text-sky-700/85",
  fuchsia: "text-fuchsia-700/85",
  rose: "text-rose-700/85",
};

export const HEADING_COLORS: Record<keyof COLORS, string> = {
  default: "text-gray-800",
  purple: "text-purple-800",
  orange: "text-orange-800",
  blue: "text-blue-800",
  green: "text-green-800",
  red: "text-red-800",
  pink: "text-pink-800",
  teal: "text-teal-800",
  yellow: "text-yellow-800",
  violet: "text-violet-800",
  indigo: "text-indigo-800",
  amber: "text-amber-800",
  gray: "text-gray-800",
  inherit: "text-inherit",
  current: "text-current",
  transparent: "text-transparent",
  black: "text-black",
  white: "text-white",
  slate: "text-slate-800",
  zinc: "text-zinc-800",
  neutral: "text-neutral-800",
  stone: "text-stone-800",
  lime: "text-lime-800",
  emerald: "text-emerald-800",
  cyan: "text-cyan-800",
  sky: "text-sky-800",
  fuchsia: "text-fuchsia-800",
  rose: "text-rose-800",
};

export function getHeadingColor(
  backgroundColor: ColoredItem["backgroundColor"],
): string {
  return cn(HEADING_COLORS[backgroundColor ?? "default"]);
}

export function getSubheadingColor(
  backgroundColor: ColoredItem["backgroundColor"],
): string {
  return cn(SUBHEADING_COLORS[backgroundColor ?? "default"]);
}

export const TEXT_COLORS: Record<keyof COLORS, string> = {
  default: "text-gray-700/85",
  purple: "text-purple-700/85",
  orange: "text-orange-700/85",
  blue: "text-blue-700/85",
  green: "text-green-700/85",
  red: "text-red-700/85",
  pink: "text-pink-700/85",
  teal: "text-teal-700/85",
  yellow: "text-yellow-700/85",
  violet: "text-violet-700/85",
  indigo: "text-indigo-700/85",
  amber: "text-amber-700/85",
  gray: "text-gray-700/85",
  inherit: "text-inherit",
  current: "text-current",
  transparent: "text-transparent",
  black: "text-black",
  white: "text-white",
  slate: "text-slate-700/85",
  zinc: "text-zinc-700/85",
  neutral: "text-neutral-700/85",
  stone: "text-stone-700/85",
  lime: "text-lime-700/85",
  emerald: "text-emerald-700/85",
  cyan: "text-cyan-700/85",
  sky: "text-sky-700/85",
  fuchsia: "text-fuchsia-700/85",
  rose: "text-rose-700/85",
};

export function getTextColor(
  backgroundColor: ColoredItem["backgroundColor"],
): string {
  return cn(TEXT_COLORS[backgroundColor ?? "default"]);
}
