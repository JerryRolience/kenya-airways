"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useSignOut } from "@/hooks/authentication/use-sign-out"
import { cn } from "@/lib/utils"
import { useClerk } from "@clerk/nextjs"
import { ArrowRight, ChevronDown, LayoutDashboard, LogOut, Menu, Plane, Ticket, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { ThemeToggle } from "../global/theme/theme-toggle"

const links = [
  { label: "Flights", href: "/dashboard/flights" },
  { label: "Manage Booking", href: "/dashboard/bookings" },
  { label: "Careers", href: "/careers" },
  { label: "Help", href: "/help" },
]

const userMenuLinks = [
  { label: "My Bookings", href: "/dashboard/bookings", icon: Ticket },
  { label: "Profile", href: "/dashboard/profile", icon: User },
]

const adminLinks = [{ label: "Admin Dashboard", href: "/admin", icon: LayoutDashboard }]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const { isSignedIn, user } = useClerk()
  const { handleLogout, isSigningOut } = useSignOut()
  const [isAdmin, setIsAdmin] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handler)
    return () => window.removeEventListener("scroll", handler)
  }, [])

  useEffect(() => {
    if (user?.publicMetadata) {
      const role = (user.publicMetadata as any)?.role
      setIsAdmin(role === "ADMIN" || role === "SUPER_ADMIN")
    }
  }, [user])

  // Helper to check if a link is active
  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  const handleCardClick = () => {
    // Scroll smoothly to the booking card
    const bookingCard = document.getElementById("booking-card")
    if (bookingCard) {
      bookingCard.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }

  return (
    <header className="fixed top-0 z-50 w-full">
      <div className="mx-auto mt-3 max-w-7xl px-4">
        <nav className={cn("flex items-center justify-between px-4 py-2.5 md:px-6 rounded-2xl transition-all duration-300", scrolled ? "glass shadow-elegant" : "bg-black/10 backdrop-blur-sm")}>
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-elegant transition-transform group-hover:-rotate-6">
              <Plane className="h-4 w-4 -rotate-45" strokeWidth={2.4} />
            </span>
            <span className="font-display text-lg font-semibold tracking-tight hidden sm:block">
              Kenya <span className="text-accent">Airways</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden items-center gap-1 md:flex">
            {links.map(l => (
              <Link
                key={l.label}
                href={l.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive(l.href)
                    ? "bg-accent/10 text-accent" // Active style
                    : "text-foreground/70 hover:bg-secondary hover:text-accent", // Default style
                )}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            {/* Signed In User Menu */}
            {isSignedIn ? (
              <>
                {/* Desktop User Dropdown */}
                <div className="hidden md:flex items-center gap-1">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="flex items-center gap-2 text-sm hover:cursor-pointer">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <User className="h-3.5 w-3.5" />
                        </div>
                        <span className="hidden lg:inline max-w-25 truncate">{user?.firstName || "Account"}</span>
                        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>
                        <div className="flex flex-col">
                          <span className="font-medium">{user?.fullName || "User"}</span>
                          <span className="text-xs text-muted-foreground truncate">{user?.primaryEmailAddress?.emailAddress}</span>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />

                      {userMenuLinks.map(item => (
                        <DropdownMenuItem key={item.label} asChild>
                          <Link href={item.href} className="cursor-pointer flex items-center gap-2">
                            <item.icon className="h-4 w-4" />
                            {item.label}
                          </Link>
                        </DropdownMenuItem>
                      ))}

                      {isAdmin && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">Administration</DropdownMenuLabel>
                          {adminLinks.map(item => (
                            <DropdownMenuItem key={item.label} asChild>
                              <Link href={item.href} className="cursor-pointer flex items-center gap-2">
                                <item.icon className="h-4 w-4" />
                                {item.label}
                              </Link>
                            </DropdownMenuItem>
                          ))}
                        </>
                      )}

                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        disabled={isSigningOut}
                        onSelect={e => {
                          e.preventDefault()
                          handleLogout()
                        }}
                        className="cursor-pointer text-destructive focus:text-destructive"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        {isSigningOut ? "Signing out..." : "Log out"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-xl hover:cursor-pointer text-xs" onClick={handleCardClick}>
                    Book Now
                  </Button>
                </div>

                {/* Mobile: Simple logout button */}
                <Button className="md:hidden text-xs hover:cursor-pointer" disabled={isSigningOut} onClick={() => handleLogout()} size="sm" variant="ghost">
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                {/* Desktop: Sign In + Book Now */}
                <div className="hidden md:flex items-center gap-2">
                  <Link href="/auth">
                    <Button variant="ghost" size="sm" className="text-sm hover:cursor-pointer">
                      Sign in
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                  <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-xl hover:cursor-pointer" onClick={handleCardClick}>
                    Book Now
                  </Button>
                </div>
              </>
            )}

            {/* Mobile Hamburger Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open navigation menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <SheetTitle className="font-display text-lg">
                  Kenya <span className="text-accent">Airways</span>
                </SheetTitle>

                {/* Mobile Menu Content */}
                <div className="mt-6 flex flex-col gap-1">
                  {/* Main Links */}
                  <Link
                    href="/"
                    className={cn(
                      "rounded-lg px-3 py-3 text-base font-medium hover:bg-secondary hover:text-accent hover:cursor-pointer transition-colors",
                      isActive("/") && "bg-accent/10 text-accent",
                    )}
                  >
                    Home
                  </Link>
                  {links.map(l => (
                    <Link
                      key={l.label}
                      href={l.href}
                      className={cn(
                        "rounded-lg px-3 py-3 text-base font-medium hover:bg-secondary hover:text-accent hover:cursor-pointer transition-colors",
                        isActive(l.href) && "bg-accent/10 text-accent", // Active on mobile too
                      )}
                    >
                      {l.label}
                    </Link>
                  ))}

                  <div className="my-3 border-t border-border/60" />

                  {/* Signed In Links */}
                  {isSignedIn ? (
                    <>
                      {userMenuLinks.map(item => (
                        <Link
                          key={item.label}
                          href={item.href}
                          className={cn(
                            "rounded-lg px-3 py-3 text-base font-medium hover:bg-secondary hover:text-accent hover:cursor-pointer transition-colors flex items-center gap-3",
                            isActive(item.href) && "bg-accent/10 text-accent",
                          )}
                        >
                          <item.icon className="h-4 w-4 text-muted-foreground" />
                          {item.label}
                        </Link>
                      ))}

                      {isAdmin && (
                        <>
                          <div className="my-2 border-t border-border/60" />
                          <p className="px-3 py-1 text-xs text-muted-foreground uppercase tracking-wider">Administration</p>
                          {adminLinks.map(item => (
                            <Link
                              key={item.label}
                              href={item.href}
                              className={cn(
                                "rounded-lg px-3 py-3 text-base font-medium hover:bg-secondary hover:text-accent hover:cursor-pointer transition-colors flex items-center gap-3",
                                isActive(item.href) && "bg-accent/10 text-accent",
                              )}
                            >
                              <item.icon className="h-4 w-4 text-muted-foreground" />
                              {item.label}
                            </Link>
                          ))}
                        </>
                      )}

                      <div className="my-2 border-t border-border/60" />

                      <button
                        onClick={() => handleLogout()}
                        disabled={isSigningOut}
                        className="rounded-lg px-3 py-3 text-base font-medium text-destructive hover:bg-destructive/10 hover:cursor-pointer transition-colors flex items-center gap-3 w-full text-left"
                      >
                        <LogOut className="h-4 w-4" />
                        {isSigningOut ? "Signing out..." : "Log out"}
                      </button>
                    </>
                  ) : (
                    <>
                      <Link href="/auth">
                        <Button variant="outline" className="mt-3 w-full rounded-xl hover:cursor-pointer">
                          Sign in
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                      </Link>
                    </>
                  )}

                  <Button className="w-full rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 hover:cursor-pointer" onClick={handleCardClick}>
                    <Plane className="w-4 h-4 mr-2 -rotate-45" />
                    Book Now
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </div>
    </header>
  )
}
