import { Button } from "@/components/ui/button"
import { Briefcase, Search } from "lucide-react"

export function JobOpeningSectionEmptyState() {
  return (
    <div className="text-center py-16">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted mx-auto">
        <Briefcase className="h-8 w-8 text-muted-foreground/40" />
      </div>
      <h2 className="mt-5 text-lg font-semibold text-foreground font-display">No open positions right now</h2>
      <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
        There are currently no open positions. Check back later or submit a general application to be considered for future opportunities.
      </p>
    </div>
  )
}

export function JobOpeningSectionFilterEmptyState({ setDepartment, setSearch }: { setDepartment: (dep: string) => void; setSearch: (term: string) => void }) {
  return (
    <div className="text-center py-16">
      <Search className="h-12 w-12 text-muted-foreground/40 mx-auto" />
      <p className="mt-4 text-lg font-medium text-foreground">No positions match your filters</p>
      <p className="mt-1 text-sm text-muted-foreground">Try a different search term or department filter.</p>
      <Button
        onClick={() => {
          setSearch("")
          setDepartment("All Departments")
        }}
        variant="outline"
        className="mt-4 rounded-xl h-9 px-4 text-xs"
      >
        Clear filters
      </Button>
    </div>
  )
}
