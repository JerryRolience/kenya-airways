import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar"
import { getInitials, getInitialsColor } from "./utils"

interface UserAvatarProps {
  firstName: string
  lastName: string
  image?: string
  isActive?: boolean
}
export function UserAvatar({ firstName, lastName, image, isActive }: UserAvatarProps) {
  const gradient = getInitialsColor(firstName, lastName)
  const initials = getInitials(firstName, lastName)
  return (
    <div className="relative">
      <Avatar className="h-20 w-20 ring-4 ring-background shadow-md">
        <AvatarImage src={image || undefined} alt={`${firstName} ${lastName}`} className="object-cover" />
        <AvatarFallback className={cn("text-2xl sm:text-3xl font-bold tracking-tight text-white", `bg-linear-to-br ${gradient}`)}>
          {initials}
        </AvatarFallback>
      </Avatar>

      {/* Status dot */}
      {isActive && (
        <span className="absolute -bottom-1 -right-1">
          <span className="relative flex h-4 w-4">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-4 w-4 rounded-full bg-emerald-500 border-2 border-background" />
          </span>
        </span>
      )}
      {!isActive && (
        <span className="absolute -bottom-1 -right-1">
          <span className="relative flex h-4 w-4">
            <span className="relative inline-flex h-4 w-4 rounded-full bg-gray-400 border-2 border-background" />
          </span>
        </span>
      )}
    </div>
  )
}
