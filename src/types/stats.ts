import { LucideIcon } from "lucide-react"

export interface StatItem {
  title: string
  value: string | number
  change?: string // must start with "+" or "-" or be "0"
  description: string
  icon: LucideIcon
  color?: string
  link?: string
}

export interface StatsCardProps {
  statsData: StatItem[]
  isLoading?: boolean
  isError?: boolean
  onRetry?: () => void
  message?: string
}
