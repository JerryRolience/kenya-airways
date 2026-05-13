export interface BuildPaginatedResultParams<T> {
  items: T[]
  total: number
  limit: number
  isFiltered?: boolean
  search?: string
}

export interface PaginatedResult<T> {
  data: T[]
  meta: {
    total: number // total matching records (for display "showing X of Y")
    limit: number // page size
    hasNextPage: boolean // is there a next page?
    nextCursor: string | null // cursor to pass for next page
    isEmpty: boolean // no records at all (not just this page)
    isFiltered: boolean // is a search/filter active?
  }
}

export interface DataSelectOption {
  value: string
  label: string
}
