"use client"

import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Armchair, ArrowRight, BookOpen, ChevronRight, Clock, HelpCircle, Luggage, Mail, Phone, Plane, Search, ShieldCheck, Sparkles, Ticket } from "lucide-react"
import Link from "next/link"
import { useMemo, useState } from "react"

//  Help Categories
const categories = [
  {
    id: "booking",
    title: "Booking Flights",
    description: "How to search, select, and book your perfect flight",
    icon: Plane,
    color: "bg-blue-50 text-blue-600 border-blue-200",
    href: "/help/booking",
    articles: 8,
  },
  {
    id: "manage",
    title: "Manage Booking",
    description: "Change, cancel, or upgrade your existing reservation",
    icon: Ticket,
    color: "bg-blue-50 text-blue-600 border-blue-200",
    href: "/help/manage",
    articles: 6,
  },
  {
    id: "baggage",
    title: "Baggage Policy",
    description: "What to pack, weight limits, and special items",
    icon: Luggage,
    color: "bg-blue-50 text-blue-600 border-blue-200",
    href: "/help/baggage",
    articles: 5,
  },
  {
    id: "cabins",
    title: "Cabin Classes",
    description: "Compare Executive, Middle, and Economy experiences",
    icon: Armchair,
    color: "bg-blue-50 text-blue-600 border-blue-200",
    href: "/help/cabins",
    articles: 4,
  },
  {
    id: "faq",
    title: "FAQs",
    description: "Quick answers to our most common questions",
    icon: HelpCircle,
    color: "bg-blue-50 text-blue-600 border-blue-200",
    href: "/help/faq",
    articles: 15,
  },
]

//  Popular Articles
const popularArticles = [
  { title: "How to change your flight date", href: "/help/manage#change-date", icon: Clock },
  { title: "Baggage allowance by class", href: "/help/baggage#allowance", icon: Luggage },
  { title: "Cancellation and refund policy", href: "/help/manage#refund", icon: ShieldCheck },
  { title: "How to select your seat", href: "/help/booking#seat-selection", icon: Armchair },
  { title: "Online check-in guide", href: "/help/booking#check-in", icon: BookOpen },
  { title: "Traveling with infants", href: "/help/faq#infants", icon: HelpCircle },
]

//  Quick Actions
const quickActions = [
  // {
  //   title: "Chat with us",
  //   description: "Average response time: 2 minutes",
  //   icon: MessageCircle,
  //   action: "Open chat",
  //   href: "#chat",
  //   primary: true,
  // },
  {
    title: "Email support",
    description: "We reply within 4 hours",
    icon: Mail,
    action: "Send email",
    href: "mailto:jerryrawlings892@gmail.com",
    primary: true,
  },
  {
    title: "Call us",
    description: "24/7 toll-free: +254 759 523 907`",
    icon: Phone,
    action: "Call now",
    href: "tel:+254759523907",
  },
]

export function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState("")

  // Filter categories and articles based on search
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories
    const q = searchQuery.toLowerCase()
    return categories.filter(c => c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q))
  }, [searchQuery])

  const filteredArticles = useMemo(() => {
    if (!searchQuery.trim()) return popularArticles
    const q = searchQuery.toLowerCase()
    return popularArticles.filter(a => a.title.toLowerCase().includes(q))
  }, [searchQuery])

  return (
    <div className="min-h-screen bg-background">
      {/*  Hero Section  */}
      <section className="relative overflow-hidden bg-linear-to-br from-primary via-primary/95 to-primary/90">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-accent blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-white blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-4xl px-4 py-20 md:py-28 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white/90 mb-6">
            <Sparkles className="h-4 w-4 text-accent" />
            Kenya Airways Help Center
          </div>

          <h1 className="font-display text-4xl font-bold tracking-tight text-white md:text-6xl">How can we help you?</h1>
          <p className="mt-4 text-lg text-white/70 max-w-xl mx-auto">Search our help articles or browse by category to find everything you need for your journey.</p>

          {/* Search Bar */}
          <div className="mt-8 mx-auto max-w-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder='Search help articles... (e.g., "baggage allowance")'
                className="h-14 pl-12 pr-4 rounded-2xl bg-white text-foreground placeholder:text-muted-foreground border-0 shadow-elegant text-base"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground hover:text-foreground">
                  Clear
                </button>
              )}
            </div>
            {searchQuery && (
              <p className="mt-2 text-sm text-white/60">
                {filteredCategories.length} categor
                {filteredCategories.length !== 1 ? "ies" : "y"} and {filteredArticles.length} article
                {filteredArticles.length !== 1 ? "s" : ""} found
              </p>
            )}
          </div>
        </div>
      </section>

      {/*  Category Cards  */}
      <section className="relative -mt-12 mx-auto max-w-6xl px-4 pb-16">
        {filteredCategories.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCategories.map(category => (
              <Link key={category.id} href={category.href}>
                <Card className="group relative h-full border-border/60 bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-elegant cursor-pointer">
                  <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl border", category.color)}>
                    <category.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-display mt-4 text-lg font-semibold text-foreground group-hover:text-accent transition-colors">{category.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{category.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{category.articles} articles</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Search className="h-12 w-12 text-muted-foreground/40 mx-auto" />
            <p className="mt-4 text-lg font-medium text-foreground">No categories found</p>
            <p className="mt-1 text-sm text-muted-foreground">Try a different search term</p>
          </div>
        )}
      </section>

      {/*  Popular Articles  */}
      {filteredArticles.length > 0 && (
        <section className="border-t border-border/60 bg-muted/30 py-16">
          <div className="mx-auto max-w-4xl px-4">
            <div className="text-center">
              <h2 className="font-display text-2xl font-bold text-foreground md:text-3xl">Popular articles</h2>
              <p className="mt-2 text-sm text-muted-foreground">What other travelers are reading right now</p>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {filteredArticles.map(article => (
                <Link key={article.title} href={article.href}>
                  <Card className="group flex items-center gap-4 border-border/60 bg-card p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-elegant cursor-pointer">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                      <article.icon className="h-5 w-5 text-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground group-hover:text-accent transition-colors">{article.title}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all" />
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/*  Quick Actions / Contact  */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4">
          <div className="text-center">
            <h2 className="font-display text-2xl font-bold text-foreground md:text-3xl">Still need help?</h2>
            <p className="mt-2 text-sm text-muted-foreground">Our support team is available 24/7</p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {quickActions.map(action => (
              <a key={action.title} href={action.href}>
                <Card
                  className={cn(
                    "group relative h-full border-border/60 p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-elegant cursor-pointer",
                    action.primary && "border-accent/30 bg-accent/5",
                  )}
                >
                  <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", action.primary ? "bg-accent text-accent-foreground" : "bg-muted text-foreground")}>
                    <action.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-3 text-sm font-semibold text-foreground">{action.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{action.description}</p>
                  <div className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-accent group-hover:gap-2 transition-all">
                    {action.action}
                    <ArrowRight className="h-3 w-3" />
                  </div>
                </Card>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
