import Link from "next/link"
import { getInitials, getInitialsColor } from "./utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface TableUserAvatarProps {
  firstName: string
  lastName: string
  href?: string
  email?: string | null
  image?: string | null
}

export function TableUserAvatar({ firstName, lastName, email, image, href }: TableUserAvatarProps) {
  const initials = getInitials(firstName, lastName)
  const gradient = getInitialsColor(firstName, lastName)
  const hasImage = !!image

  const avatarContent = (
    <>
      {" "}
      <Avatar className="h-8 w-8 shrink-0 ring-offset-background transition-all group-hover:ring-2 group-hover:ring-primary/20">
        {hasImage ? <AvatarImage src={image!} alt={`${firstName} ${lastName}`} /> : null}
        <AvatarFallback className={`bg-linear-to-br ${gradient} text-[11px] font-semibold text-white shadow-sm`}>{initials}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col min-w-0">
        <span className="font-medium text-sm group-hover:text-primary transition-colors truncate">
          {firstName} {lastName}
        </span>
        {email && <span className="text-xs text-muted-foreground truncate max-w-36">{email}</span>}
      </div>
    </>
  )

  return href ? (
    <Link href={href} className="flex items-center gap-2.5 min-w-0 group">
      {avatarContent}
    </Link>
  ) : (
    <div className="flex items-center gap-2.5 min-w-0">{avatarContent}</div>
  )
}
