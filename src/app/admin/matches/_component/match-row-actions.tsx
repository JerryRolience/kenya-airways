"use client"

import { DeleteAlertDialog } from "@/components/global/dialogs/deleteAlertDialog"
import { MatchDetailSheet } from "@/components/job-openings/match"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useRemoveMatch } from "@/hooks/matches/use-remove-match"
import { MatchListItem } from "@/types/match"
import { MoreHorizontal } from "lucide-react"
import { useState } from "react"

export function MatchRowActions({ match }: { match: MatchListItem }) {
  const [viewOpen, setViewOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const { onRemoveMatch, isPending: isRemovePending } = useRemoveMatch({ matchId: match.id })

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0 hover:cursor-pointer">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem className="text-xs hover:cursor-pointer" onClick={() => setViewOpen(true)}>
            View details
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-xs text-destructive focus:text-destructive hover:cursor-pointer" onClick={() => setDeleteOpen(true)}>
            Remove match
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Match Detail Sheet */}
      <MatchDetailSheet
        open={viewOpen}
        onOpenChange={setViewOpen}
        match={match}
        onRemove={() => {
          setViewOpen(false)
          onRemoveMatch()
        }}
      />

      {/* Delete Dialog */}
      <DeleteAlertDialog
        entityName={`match between ${match.employeeName} and ${match.openingTitle}`}
        entityType="match"
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        isPending={isRemovePending}
        onConfirm={() => onRemoveMatch()}
      />
    </>
  )
}
