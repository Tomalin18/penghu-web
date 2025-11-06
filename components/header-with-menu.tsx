"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu, Home, Ticket, Calendar, Globe, ChevronLeft, CreditCard } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface HeaderWithMenuProps {
  title?: string
  showBackButton?: boolean
  onBack?: () => void
}

export function HeaderWithMenu({ title, showBackButton = true, onBack }: HeaderWithMenuProps) {
  const router = useRouter()
  const [currentLanguage, setCurrentLanguage] = useState<"zh-TW" | "en" | "ja" | "ko">("zh-TW")
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const navigationItems = [
    { id: "home", label: "官網首頁", icon: Home, href: "/" },
    { id: "my-tickets", label: "我的車票", icon: Ticket, href: "/my-tickets" },
    { id: "purchase", label: "我要購票", icon: CreditCard, href: "/purchase/tickets" },
    { id: "reservation", label: "有票劃位", icon: Calendar, href: "/reservation" },
  ]

  const handleNavigation = (href: string) => {
    router.push(href)
  }

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      router.back()
    }
  }

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

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      {/* Desktop Header */}
      <div className="hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0">
              <Link href="/" className="flex items-center">
                <img src="/images/taiwan-logo.png" alt="Taiwan Tourist Shuttle" className="h-12 w-auto object-contain" />
              </Link>
            </div>

            {/* Desktop Navigation - 平均間隔 */}
            <nav className="flex-1 flex items-center justify-evenly px-8">
              {navigationItems.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigation(item.href)}
                    className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    <Icon className="h-4 w-4" />
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
                    className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    <Globe className="h-4 w-4" />
                    <span className="hidden md:inline">{languageOptions[currentLanguage]}</span>
                    <span className="sr-only md:hidden">切換語系</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="!z-[100]">
                  <DropdownMenuItem onClick={() => handleLanguageChange("zh-TW")}>
                    {currentLanguage === "zh-TW" && "✓ "}
                    繁體中文
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleLanguageChange("en")}>
                    {currentLanguage === "en" && "✓ "}
                    English
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleLanguageChange("ja")}>
                    {currentLanguage === "ja" && "✓ "}
                    日本語
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleLanguageChange("ko")}>
                    {currentLanguage === "ko" && "✓ "}
                    한국어
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

          </div>
        </div>
      </div>

      {/* Mobile Header - 只顯示 logo 和漢堡選單 */}
      <div className="md:hidden px-3 py-3">
        <div className="relative flex items-center justify-between max-w-md mx-auto">
          {/* Left side - 漢堡選單 */}
          <div className="flex items-center gap-1">
            {showBackButton && (
              <Button variant="ghost" size="icon" className="rounded-full" onClick={handleBack}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
            )}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <SheetHeader>
                  <SheetTitle>選單</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-2">
                  {navigationItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <Button
                        key={item.id}
                        variant="ghost"
                        className="w-full justify-start h-12"
                        onClick={() => handleNavigation(item.href)}
                      >
                        <Icon className="h-5 w-5 mr-3" />
                        {item.label}
                      </Button>
                    )
                  })}

                  <div className="pt-4 mt-4 border-t border-border">
                    <div className="px-3 py-2 text-sm font-medium text-muted-foreground">語言 / Language</div>
                    <Select value={currentLanguage} onValueChange={handleLanguageChange}>
                      <SelectTrigger className="w-full h-12 justify-start">
                        <div className="flex items-center gap-3">
                          <Globe className="h-5 w-5" />
                          <span>{languageOptions[currentLanguage]}</span>
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="zh-TW">繁中</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="ja">日本語</SelectItem>
                        <SelectItem value="ko">한국어</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Center - Logo or Title */}
          <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center">
            {title ? (
              <h1 className="text-lg font-semibold">{title}</h1>
            ) : (
              <img src="/images/taiwan-logo.png" alt="Taiwan Tourist Shuttle" className="h-10 w-auto object-contain" />
            )}
          </div>

        </div>
      </div>
    </header>
  )
}

export default HeaderWithMenu