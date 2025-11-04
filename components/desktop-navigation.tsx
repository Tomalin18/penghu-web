"use client"

import { Home, Ticket, CreditCard, Calendar, MessageCircle, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter, usePathname } from "next/navigation"
import { useState } from "react"
import Link from "next/link"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

interface DesktopNavigationProps {
  activeTab?: string
}

export function DesktopNavigation({ activeTab = "home" }: DesktopNavigationProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { id: "home", label: "首頁", icon: Home, href: "/" },
    { id: "my-tickets", label: "我的車票", icon: Ticket, href: "/web/my-tickets" },
    { id: "purchase", label: "購票", icon: CreditCard, href: "/web/purchase/tickets" },
    { id: "reservation", label: "有票劃位", icon: Calendar, href: "/web/reservation" },
    { id: "support", label: "客服", icon: MessageCircle, href: "/support" },
  ]

  const handleNavigation = (href: string) => {
    router.push(href)
    setMobileMenuOpen(false)
  }

  const getActiveNav = () => {
    if (activeTab) return activeTab
    for (const item of navItems) {
      if (pathname.startsWith(item.href)) {
        return item.id
      }
    }
    return "home"
  }

  const activeNav = getActiveNav()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">澎</span>
              </div>
              <span className="font-bold text-lg text-foreground hidden sm:inline-block">澎湖好行</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = activeNav === item.id

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.href)}
                  className={cn(
                    "flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <Icon className={cn("h-4 w-4", isActive ? "text-primary" : "")} />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">開啟選單</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>選單</SheetTitle>
                </SheetHeader>
                <nav className="mt-6 space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = activeNav === item.id

                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavigation(item.href)}
                        className={cn(
                          "w-full flex items-center space-x-3 px-4 py-3 rounded-md text-base font-medium transition-colors",
                          isActive
                            ? "text-primary bg-primary/10"
                            : "text-foreground hover:bg-muted"
                        )}
                      >
                        <Icon className={cn("h-5 w-5", isActive ? "text-primary" : "")} />
                        <span>{item.label}</span>
                      </button>
                    )
                  })}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}

export default DesktopNavigation
