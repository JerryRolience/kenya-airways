export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

export function getAvailabilityMeta(availableSeats: number, isFull: boolean) {
  if (isFull)
    return {
      label: "Sold out",
      color: "text-destructive",
      dot: "bg-destructive",
    }
  if (availableSeats <= 3)
    return {
      label: `${availableSeats} seat${availableSeats !== 1 ? "s" : ""} left`,
      color: "text-amber-600",
      dot: "bg-amber-500",
    }
  if (availableSeats <= 9)
    return {
      label: `${availableSeats} seats left`,
      color: "text-amber-500",
      dot: "bg-amber-400",
    }
  return {
    label: "Available",
    color: "text-emerald-600",
    dot: "bg-emerald-500",
  }
}
