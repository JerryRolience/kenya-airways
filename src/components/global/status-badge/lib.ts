import { LucideIcon } from "lucide-react"

export type StatusVariant = "success" | "warning" | "destructive" | "info" | "neutral" | "purple" | "blue" | "pink" | "indigo"

export type StatusMeta = {
  label: string
  variant: StatusVariant
  icon?: LucideIcon
  pulse?: boolean
}

export const STATUS_VARIANTS: Record<StatusVariant, string> = {
  success: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  warning: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  destructive: "bg-red-500/10 text-red-600 border-red-500/20",
  info: "bg-sky-500/10 text-sky-600 border-sky-500/20",
  neutral: "bg-gray-500/10 text-gray-600 border-gray-500/20",

  purple: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  blue: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  pink: "bg-pink-500/10 text-pink-600 border-pink-500/20",
  indigo: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
}

export function getStatusMeta<T extends string>({ map, value }: { map: Record<T, StatusMeta>; value: T }) {
  return map[value]
}
