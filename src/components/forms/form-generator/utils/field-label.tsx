import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FieldLabelProps {
  label: string;
  name: string;
  hasError?: boolean;
  required?: boolean;
  icon?: React.ReactNode;
}

export function FieldLabel({
  label,
  name,
  hasError,
  required,
  icon,
}: FieldLabelProps) {
  return (
    <Label
      htmlFor={name}
      className={cn(
        "flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
        hasError && "text-destructive",
      )}
    >
      {icon}
      {label}
      {required && (
        <span className={cn("ml-1", hasError && "text-destructive")}>*</span>
      )}
    </Label>
  );
}
