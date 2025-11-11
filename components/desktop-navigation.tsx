"use client"

import { Ticket, CreditCard, Calendar, Menu, X, Globe } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter, usePathname } from "next/navigation"
import { useState } from "react"
import Link from "next/link"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface DesktopNavigationProps {
  activeTab?: string
}

export function DesktopNavigation({ activeTab = "home" }: DesktopNavigationProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [currentLanguage, setCurrentLanguage] = useState<"zh-TW" | "en" | "ja" | "ko">("zh-TW")

  const handleLanguageChange = (language: "zh-TW" | "en" | "ja" | "ko") => {
    setCurrentLanguage(language)
    // Here you would typically integrate with your i18n system
    console.log("[v0] Language switched to:", language)
  }

  const languageOptions = {
    "zh-TW": "繁體中文",
    en: "English",
    ja: "日本語",
    ko: "한국어",
  }

  // 依照新版需求移除「官網首頁」，僅保留實際功能頁籤。
  const navItems = [
    { id: "my-tickets", label: "我的車票", icon: Ticket, href: "/my-tickets" },
    { id: "purchase", label: "購票", icon: CreditCard, href: "/purchase/tickets" },
    { id: "reservation", label: "有票劃位", icon: Calendar, href: "/reservation" },
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
    return ""
  }

  const activeNav = getActiveNav()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <img src="/images/penghu-logo.png" alt="Like 澎湖 - 台灣好行" className="h-16 w-auto object-contain" />
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
                    "flex items-center space-x-2 px-5 py-3 rounded-md text-[16px] font-medium transition-colors",
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

          {/* Language Switcher */}
          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "flex items-center space-x-2 px-5 py-3 rounded-md text-[16px] font-medium transition-colors",
                    "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <Globe className="h-4 w-4" />
                  <span className="hidden md:inline">{languageOptions[currentLanguage]}</span>
                  <span className="sr-only md:hidden">切換語系</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="!z-[100]">
                <DropdownMenuItem onClick={() => handleLanguageChange("zh-TW")} className="text-[16px]">
                  {currentLanguage === "zh-TW" && "✓ "}
                  繁體中文
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleLanguageChange("en")} className="text-[16px]">
                  {currentLanguage === "en" && "✓ "}
                  English
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleLanguageChange("ja")} className="text-[16px]">
                  {currentLanguage === "ja" && "✓ "}
                  日本語
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleLanguageChange("ko")} className="text-[16px]">
                  {currentLanguage === "ko" && "✓ "}
                  한국어
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

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
