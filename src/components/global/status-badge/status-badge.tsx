import { cn } from "@/lib/utils"
import { STATUS_VARIANTS, StatusMeta } from "./lib"

type Props = {
  meta: StatusMeta
  className?: string
}

export function StatusBadge({ meta, className }: Props) {
  const Icon = meta.icon

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-2xl px-2 py-1 text-xs font-medium border",
        STATUS_VARIANTS[meta.variant],
        className,
      )}
    >
      {/* Dot or Icon */}
      {Icon ? (
        <Icon className={cn("h-3.5 w-3.5", meta.pulse && "animate-pulse")} />
      ) : (
        <span className={cn("h-1.5 w-1.5 rounded-full", meta.pulse && "animate-pulse")} />
      )}

      {meta.label}
    </div>
  )
}
