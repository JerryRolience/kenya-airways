import { socialLinks } from "@/constants/auth";
import Link from "next/link";

export function FormFooter() {
  return (
    <div className="mt-8 space-y-4">
      <p className="text-center text-xs text-muted-foreground">
        By continuing, you agree to Kenya Airways&apos;{" "}
        <Link
          href="/terms"
          className="underline underline-offset-2 text-accent hover:text-accent-foreground  transition-colors"
        >
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link
          href="/privacy"
          className="underline underline-offset-2 text-accent hover:text-accent-foreground transition-colors"
        >
          Privacy Policy
        </Link>
        .
      </p>

      {/* Divider */}
      <div className="h-px bg-border" />

      {/* Social row */}
      <div className="flex items-center justify-center gap-3">
        <span className="text-xs text-muted-foreground">Follow us</span>
        <div className="flex items-center gap-2">
          {socialLinks.map((item) => (
            <Link
              key={item.id}
              href={item.link}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-all hover:border-foreground/20 hover:bg-muted hover:text-foreground"
              aria-label={`Social link ${item.id}`}
            >
              <item.icon size={14} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
