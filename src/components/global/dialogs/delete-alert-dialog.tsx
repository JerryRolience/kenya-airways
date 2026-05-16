"use client"

import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { AlertTriangle, CheckCircle2, Loader2, Trash2 } from "lucide-react"
import { useState } from "react"

export type DialogVariant = "destructive" | "warning" | "default" | "success"

interface DeleteAlertDialogProps {
  entityName: string
  entityType?: string
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onConfirm: () => Promise<void> | void
  isPending?: boolean
  title?: string
  description?: string
  confirmLabel?: string
  variant?: DialogVariant
}

const VARIANT_STYLES: Record<DialogVariant, { icon: React.ElementType; buttonClass: string; iconClass: string }> = {
  destructive: {
    icon: Trash2,
    buttonClass: "bg-destructive hover:bg-destructive/90 text-destructive-foreground",
    iconClass: "text-destructive",
  },
  success: {
    icon: CheckCircle2,
    buttonClass: "bg-green-600 hover:bg-green-700 text-white",
    iconClass: "text-green-600",
  },
  warning: {
    icon: AlertTriangle,
    buttonClass: "bg-amber-600 hover:bg-amber-700 text-white",
    iconClass: "text-amber-600",
  },
  default: {
    icon: CheckCircle2,
    buttonClass: "bg-primary hover:bg-primary/90 text-primary-foreground",
    iconClass: "text-primary",
  },
}

export function DeleteAlertDialog({
  entityName,
  entityType = "item",
  trigger,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  onConfirm,
  isPending: externalPending,
  title,
  description,
  confirmLabel = "Delete",
  variant = "destructive",
}: DeleteAlertDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const [internalPending, setInternalPending] = useState(false)

  // Support both controlled and uncontrolled usage
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen
  const setOpen = isControlled ? controlledOnOpenChange! : setInternalOpen
  const isPending = externalPending ?? internalPending

  const handleConfirm = async () => {
    if (!externalPending) setInternalPending(true)
    try {
      await onConfirm()
      setOpen(false)
    } finally {
      if (!externalPending) setInternalPending(false)
    }
  }

  const resolvedTitle = title ?? `Delete ${entityType}`
  const resolvedDescription = description ?? `This will permanently delete ${entityName === "" ? `this ${entityType}` : `"${entityName}"`}. This action cannot be undone.`

  const { icon: Icon, buttonClass, iconClass } = VARIANT_STYLES[variant]

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      {!isControlled && (
        <AlertDialogTrigger asChild>
          {trigger ?? (
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
              <span className="sr-only">Delete {entityType}</span>
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </AlertDialogTrigger>
      )}

      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader className="text-center sm:text-center">
          <div className="flex items-center justify-center gap-2">
            <Icon className={cn("h-5 w-5", iconClass)} />
            <AlertDialogTitle className="text-base">{resolvedTitle}</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-sm">{resolvedDescription}</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-2 sm:space-x-2">
          <AlertDialogCancel disabled={isPending} className="flex-1 hover:cursor-pointer">
            Cancel
          </AlertDialogCancel>
          <Button className={cn("flex-1 gap-2 hover:cursor-pointer", buttonClass)} onClick={handleConfirm} disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Icon className="h-4 w-4" />
                {confirmLabel}
              </>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
