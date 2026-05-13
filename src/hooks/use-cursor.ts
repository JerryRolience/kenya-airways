import { useState, useCallback } from "react"

export function useCursorPagination() {
  // Stack of cursors visited — index 0 is always null (first page)
  const [cursorStack, setCursorStack] = useState<(string | null)[]>([null])
  const [currentPage, setCurrentPage] = useState(0)

  const currentCursor = cursorStack[currentPage] ?? undefined

  const goToNextPage = useCallback(
    (nextCursor: string | null) => {
      if (!nextCursor) return
      setCursorStack(prev => {
        const next = [...prev]
        // Only push if we haven't visited this page before
        if (currentPage + 1 >= next.length) {
          next.push(nextCursor)
        }
        return next
      })
      setCurrentPage(p => p + 1)
    },
    [currentPage],
  )

  const goToPreviousPage = useCallback(() => {
    if (currentPage === 0) return
    setCurrentPage(p => p - 1)
  }, [currentPage])

  const goToFirstPage = useCallback(() => {
    setCurrentPage(0)
  }, [])

  const reset = useCallback(() => {
    setCursorStack([null])
    setCurrentPage(0)
  }, [])

  return {
    currentCursor,
    currentPage,
    hasPreviousPage: currentPage > 0,
    goToNextPage,
    goToPreviousPage,
    goToFirstPage,
    reset,
  }
}
