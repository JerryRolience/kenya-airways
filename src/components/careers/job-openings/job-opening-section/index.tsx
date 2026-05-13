"use client"

import { useFetchPublicJobOpenings } from "@/hooks/job/use-fetch-public-job-openings"
import Link from "next/link"
import { useMemo, useState } from "react"
import { JobOpeningCard } from "./job-opening-card"
import { JobOpeningSectionEmptyState, JobOpeningSectionFilterEmptyState } from "./job-opening-section-empty-state"
import { JobOpeningSectionErrorState } from "./job-opening-section-error-state"
import { JobOpeningSectionLoadingState } from "./job-opening-section-loading-state"
import { JobOpeningSectionSearchAndFiltering } from "./job-opening-section-search-and-filtering"

export function JobOpeningSection() {
  const [search, setSearch] = useState("")
  const [department, setDepartment] = useState("All Departments")

  const { data, isLoading, isError, error, refetch } = useFetchPublicJobOpenings()

  const openings = useMemo(() => {
    if (data?.success) {
      return data.data
    }
    return []
  }, [data])

  const filteredOpenings = useMemo(() => {
    return openings?.filter(opening => {
      const matchesSearch = !search || opening.title.toLowerCase().includes(search.toLowerCase()) || opening.description.toLowerCase().includes(search.toLowerCase())
      const matchesDepartment = department === "All Departments" || opening.department === department
      return matchesSearch && matchesDepartment
    })
  }, [openings, search, department])

  return (
    <section className="py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center mb-10">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Open Positions</span>
          <h2 className="font-display mt-2 text-3xl font-bold text-foreground md:text-4xl">Find your role</h2>
          {!isLoading && !isError && (
            <p className="mt-2 text-sm text-muted-foreground">
              {openings?.length} position
              {openings?.length !== 1 ? "s" : ""} currently open
            </p>
          )}
        </div>

        {/* Search + Filter — only show if there's data or we're loading */}
        {((openings && openings.length > 0) || isLoading) && !isError && (
          <JobOpeningSectionSearchAndFiltering department={department} search={search} setDepartment={setDepartment} setSearch={setSearch} />
        )}

        {/*  LOADING STATE  */}
        {isLoading && <JobOpeningSectionLoadingState />}

        {/*  ERROR STATE  */}
        {isError && !isLoading && <JobOpeningSectionErrorState error={error} refetch={refetch} />}

        {/*  DATA STATE: No results after filtering  */}
        {!isLoading && !isError && openings && openings.length > 0 && filteredOpenings?.length === 0 && <JobOpeningSectionFilterEmptyState setDepartment={setDepartment} setSearch={setSearch} />}

        {/*  DATA STATE: No openings at all  */}
        {!isLoading && !isError && openings && openings.length === 0 && <JobOpeningSectionEmptyState />}

        {/*  DATA STATE: Has openings  */}
        {!isLoading && !isError && filteredOpenings && filteredOpenings.length > 0 && (
          <div className="grid gap-4">
            {filteredOpenings?.map(opening => (
              <Link key={opening.id} href={`/careers/${opening.id}`}>
                <JobOpeningCard opening={opening} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
