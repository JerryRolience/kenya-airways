export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

type AvailabilityState = "full" | "not-enough" | "critical" | "low" | "available"

export function getAvailabilityState(availableSeats: number, isFull: boolean, hasEnoughSeats: boolean): AvailabilityState {
  if (isFull) return "full"
  if (!hasEnoughSeats) return "not-enough"
  if (availableSeats <= 3) return "critical"
  if (availableSeats <= 9) return "low"
  return "available"
}
