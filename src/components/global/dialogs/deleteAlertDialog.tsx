"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
import { useState } from "react";

interface DeleteAlertDialogProps {
  // What's being deleted — shown in the confirmation message
  entityName: string; // e.g. "John Doe" or "JKI-203 Flight"
  entityType?: string; // e.g. "passenger", "airport", "employee" — defaults to "item"

  // Control
  trigger?: React.ReactNode; // custom trigger — defaults to a red Trash2 button
  open?: boolean; // controlled mode
  onOpenChange?: (open: boolean) => void;

  // Action
  onConfirm: () => Promise<void> | void;
  isPending?: boolean; // if you manage loading state externally

  // Customization
  title?: string;
  description?: string;
  confirmLabel?: string;
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
}: DeleteAlertDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [internalPending, setInternalPending] = useState(false);

  // Support both controlled and uncontrolled usage
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? controlledOnOpenChange! : setInternalOpen;
  const isPending = externalPending ?? internalPending;

  const handleConfirm = async () => {
    if (!externalPending) setInternalPending(true);
    try {
      await onConfirm();
      setOpen(false);
    } finally {
      if (!externalPending) setInternalPending(false);
    }
  };

  const resolvedTitle = title ?? `Delete ${entityType}`;
  const resolvedDescription =
    description ??
    `This will permanently delete ${entityName === "" ? `this ${entityType}` : `"${entityName}"`}. This action cannot be undone.`;

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      {/* Only render trigger wrapper when not fully controlled */}
      {!isControlled && (
        <AlertDialogTrigger asChild>
          {trigger ?? (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            >
              <span className="sr-only">Delete {entityType}</span>
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </AlertDialogTrigger>
      )}

      <AlertDialogContent className="max-w-md">
        {/* Icon */}

        <AlertDialogHeader className="text-center sm:text-center ">
          <div className="flex items-center gap-2">
            <Trash2 className="h-4 w-4 text-destructive" />
            <AlertDialogTitle className="text-base">
              {resolvedTitle}
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-sm">
            {resolvedDescription}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-2 sm:space-x-2">
          <AlertDialogCancel
            disabled={isPending}
            className="flex-1 hover:cursor-pointer"
          >
            Cancel
          </AlertDialogCancel>
          <Button
            variant="destructive"
            className="flex-1 gap-2 hover:cursor-pointer"
            onClick={handleConfirm}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                {confirmLabel}
              </>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
