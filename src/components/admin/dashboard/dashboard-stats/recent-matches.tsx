import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Link as LinkIcon } from "lucide-react"
import Link from "next/link"

export function RecentMatches({ matches }: { matches: any[] }) {
  return (
    <Card className="border-border/60 bg-card">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-semibold">Recent Matches</CardTitle>
        <Link href="/admin/matches/history">
          <Button variant="ghost" size="sm" className="text-xs text-accent hover:cursor-pointer">
            View all <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {matches.length > 0 ? (
          <div className="space-y-3">
            {matches.map(match => (
              <div key={match.id} className="flex items-center gap-3 rounded-xl border border-border/60 bg-muted/30 p-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <LinkIcon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {match.employee.firstName} {match.employee.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {match.employee.position} → {match.opening.title}
                  </p>
                </div>
                <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200">
                  Active
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <LinkIcon className="h-8 w-8 text-muted-foreground/40 mx-auto" />
            <p className="mt-2 text-sm text-muted-foreground">No matches yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
