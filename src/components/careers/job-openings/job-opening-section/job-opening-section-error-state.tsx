import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCw } from "lucide-react"

export function JobOpeningSectionErrorState({ error, refetch }: { error: any; refetch: () => void }) {
  return (
    <div className="text-center py-16">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 mx-auto">
        <AlertCircle className="h-8 w-8 text-destructive" />
      </div>
      <h2 className="mt-5 text-lg font-semibold text-foreground font-display">Failed to load job openings</h2>
      <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">{error instanceof Error ? error.message : "An unexpected error occurred. Please try again later."}</p>
      <Button onClick={() => refetch()} variant="outline" className="mt-5 rounded-xl h-9 px-4 text-xs gap-2">
        <RefreshCw className="h-3.5 w-3.5" />
        Try again
      </Button>
    </div>
  )
}
