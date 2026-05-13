// Helper function to get deterministic color based on name
export const getInitialsColor = (firstName: string, lastName: string) => {
  const colors = [
    "from-blue-500 to-blue-600",
    "from-violet-500 to-violet-600",
    "from-emerald-500 to-emerald-600",
    "from-amber-500 to-amber-600",
    "from-rose-500 to-rose-600",
    "from-cyan-500 to-cyan-600",
    "from-indigo-500 to-indigo-600",
    "from-teal-500 to-teal-600",
    "from-purple-500 to-purple-600",
    "from-pink-500 to-pink-600",
  ]
  const colorIndex = (firstName.charCodeAt(0) + lastName.charCodeAt(0)) % colors.length
  return colors[colorIndex]
}

// Helper function to get initials
export const getInitials = (firstName: string, lastName: string) => {
  return `${firstName[0]}${lastName[0]}`.toUpperCase()
}
