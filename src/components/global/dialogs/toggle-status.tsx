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
import { cn } from "@/lib/utils";
import {
  Loader2,
  PowerOff,
  ShieldCheck,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { useState } from "react";

interface ToggleStatusDialogProps {
  // Entity info
  entityName: string; // e.g. "John Doe"
  entityType?: string; // e.g. "passenger", "employee" — defaults to "account"
  isActive: boolean; // current status — drives all copy + colors

  // Control
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;

  // Action
  onConfirm: () => Promise<void> | void;
  isPending?: boolean;

  // Customization
  activateLabel?: string; // confirm button label when activating
  deactivateLabel?: string; // confirm button label when deactivating

  // Optional extra context shown under the description
  warningNote?: string;
}

export function ToggleStatusDialog({
  entityName,
  entityType = "account",
  isActive,
  trigger,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  onConfirm,
  isPending: externalPending,
  activateLabel = "Activate",
  deactivateLabel = "Deactivate",
  warningNote,
}: ToggleStatusDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [internalPending, setInternalPending] = useState(false);

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

  const actionLabel = isActive ? deactivateLabel : activateLabel;
  const Icon = isActive ? PowerOff : ShieldCheck;

  const iconWrapperClass = isActive
    ? "bg-amber-100 dark:bg-amber-900/20"
    : "bg-emerald-100 dark:bg-emerald-900/20";

  const iconClass = isActive
    ? "text-amber-600 dark:text-amber-400"
    : "text-emerald-600 dark:text-emerald-400";

  const buttonClass = isActive
    ? "bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-700 text-white border-0"
    : "bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white border-0";

  const title = isActive
    ? `Deactivate ${entityType}`
    : `Activate ${entityType}`;

  const description = isActive
    ? `${entityName === "" ? `This ${entityType}` : `"${entityName}"`} will be deactivated and will lose access to the system immediately.`
    : `${entityName === "" ? `This ${entityType}` : `"${entityName}"`} will be reactivated and regain full access to the system.`;

  const defaultWarning = isActive
    ? "Any active sessions will be terminated. You can reactivate this account at any time."
    : "Make sure this account should be restored before proceeding.";

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      {!isControlled && (
        <AlertDialogTrigger asChild>
          {trigger ?? (
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 gap-1.5 px-2 text-xs font-medium transition-colors",
                isActive
                  ? "text-muted-foreground hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                  : "text-muted-foreground hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20",
              )}
            >
              {isActive ? (
                <ToggleLeft className="h-3.5 w-3.5" />
              ) : (
                <ToggleRight className="h-3.5 w-3.5" />
              )}
              {actionLabel}
            </Button>
          )}
        </AlertDialogTrigger>
      )}

      <AlertDialogContent className="max-w-md">
        {/* Icon */}
        <div
          className={cn(
            "flex h-12 w-12 mx-auto items-center justify-center rounded-full mb-1",
            iconWrapperClass,
          )}
        >
          <Icon className={cn("h-5 w-5", iconClass)} />
        </div>

        <AlertDialogHeader className="text-center sm:text-center">
          <AlertDialogTitle className="text-base">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-sm">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Warning note */}
        <div
          className={cn(
            "mx-1 rounded-lg border px-3.5 py-3 text-xs",
            isActive
              ? "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-900/10 dark:text-amber-300"
              : "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-900/10 dark:text-emerald-300",
          )}
        >
          {warningNote ?? defaultWarning}
        </div>

        <AlertDialogFooter className="mt-1 sm:space-x-2">
          <AlertDialogCancel
            disabled={isPending}
            className="flex-1 hover:cursor-pointer"
          >
            Cancel
          </AlertDialogCancel>
          <Button
            className={cn("flex-1 gap-2 hover:cursor-pointer", buttonClass)}
            onClick={handleConfirm}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {isActive ? "Deactivating..." : "Activating..."}
              </>
            ) : (
              <>
                <Icon className="h-4 w-4" />
                {actionLabel}
              </>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
