import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"

interface Props {
  department: string
  search: string
  setDepartment: (dep: string) => void
  setSearch: (term: string) => void
}

const departments = ["All Departments", "Flight Operations", "Cabin Crew", "Ground Staff", "Human Resources", "IT", "Finance", "Marketing", "Engineering"]

export function JobOpeningSectionSearchAndFiltering({ department, search, setDepartment, setSearch }: Props) {
  return (
    <div className="mb-8 flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search positions..." className="pl-10 h-11 rounded-xl bg-card border-border/60" />
      </div>
      <Select value={department} onValueChange={setDepartment}>
        <SelectTrigger className="h-11 w-full sm:w-48 rounded-xl bg-card border-border/60">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {departments.map(dept => (
            <SelectItem key={dept} value={dept}>
              {dept}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
