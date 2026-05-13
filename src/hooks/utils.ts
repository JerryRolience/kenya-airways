// Format change string the way StatsCard expects — "+12" or "-5" or "0"
export function fmtChange(n: number): string {
  if (n === 0) return "0"
  return n > 0 ? `+${n}` : `${n}`
}
