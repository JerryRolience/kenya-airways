import { Button } from "@/components/ui/button"
import { Card, CardHeader } from "@/components/ui/card"
import { AlertTriangle, RefreshCw } from "lucide-react"

interface ErrorStatsCardProps {
  onRetry?: () => void
  message?: string
}

export function ErrorStatsCard({ onRetry, message = "Failed to load statistics." }: ErrorStatsCardProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="overflow-hidden -space-y-4! py-4">
          <CardHeader className="flex flex-row items-center space-y-0 px-4! -pt-4!">
            <div className="p-2 rounded-full border border-destructive/30 bg-destructive/5">
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </div>
            <span className="text-xs font-medium text-muted-foreground ml-2 truncate">Unavailable</span>
          </CardHeader>
          <div className="px-4 space-y-2">
            <div className="flex items-center gap-2">
              {/* Flat line instead of value */}
              <div className="h-6 flex items-center">
                <span className="text-lg font-bold text-muted-foreground/40">—</span>
              </div>
            </div>
            {/* Only show message + retry on the first card */}
            {i === 0 ? (
              <div className="space-y-1.5">
                <p className="text-xs text-destructive/80">{message}</p>
                {onRetry && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onRetry}
                    className="h-7 gap-1.5 px-2 text-xs text-muted-foreground hover:text-foreground -ml-2"
                  >
                    <RefreshCw className="h-3 w-3" />
                    Retry
                  </Button>
                )}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground/50">—</p>
            )}
          </div>
        </Card>
      ))}
    </div>
  )
}
