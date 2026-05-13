import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import Link from "next/link"

export function QuickActionCard({ title, description, icon: Icon, href, primary = false }: { title: string; description: string; icon: React.ElementType; href: string; primary?: boolean }) {
  return (
    <Link href={href}>
      <Card className={cn("group border-border/60 bg-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-elegant cursor-pointer", primary && "border-accent/30 bg-accent/5")}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg", primary ? "bg-accent text-accent-foreground" : "bg-muted text-foreground")}>
              <Icon className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground group-hover:text-accent transition-colors">{title}</p>
              <p className="text-xs text-muted-foreground">{description}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
