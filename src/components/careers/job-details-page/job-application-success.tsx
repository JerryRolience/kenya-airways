import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"
import Link from "next/link"

export function JobApplicationSuccess({ title }: { title: string }) {
  return (
    <div className="my-6 flex items-center justify-center">
      <Card className="max-w-md w-full mx-4 p-8 text-center border-border/60 shadow-elegant">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 mx-auto">
          <CheckCircle2 className="h-8 w-8 text-emerald-600" />
        </div>
        <h1 className="font-display text-2xl font-bold text-foreground mt-4">Application Submitted!</h1>
        <p className="mt-2 text-sm text-muted-foreground">Thank you for applying for {title}. We&apos;ll review your application and get back to you within 2 weeks.</p>
        <div className="mt-6 flex flex-col gap-3">
          <Link href="/careers">
            <Button className="w-full rounded-xl py-4 hover:cursor-pointer">View other openings</Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="w-full rounded-xl py-4 hover:cursor-pointer">
              Back to home
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}
