"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Globe, Menu, UserRound, ChevronRight, ChevronLeft, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface HeaderWithMenuProps {
  title?: string
  showBackButton?: boolean
  onBack?: () => void
}

type SubNavItem = {
  href?: string
  lines: string[]
}

type NavDropdown = {
  showPinOnly?: boolean
  items?: SubNavItem[]
}

type NavItem = {
  id: string
  label: string
  href: string
  alwaysUnderline?: boolean
  dropdown?: NavDropdown
}

const navItems: NavItem[] = [
  { id: "home", label: "官網首頁", href: "/" },
  {
    id: "my-tickets",
    label: "我的車票",
    href: "/my-tickets",
    alwaysUnderline: true,
    dropdown: {
      showPinOnly: true,
    },
  },
  {
    id: "purchase",
    label: "我要購票",
    href: "/purchase/tickets",
    alwaysUnderline: true,
    dropdown: {
      showPinOnly: true,
    },
  },
  {
    id: "reservation",
    label: "有票劃位",
    href: "/reservation",
    alwaysUnderline: true,
    dropdown: {
      items: [
        { href: "#before-2024-04", lines: ["114年4月前"] },
        { href: "#from-2024-04", lines: ["114年4月起"] },
        { href: "#from-2024-07", lines: ["114年7月起"] },
      ],
    },
  },
  {
    id: "traffic",
    label: "交通資訊",
    href: "#traffic",
    dropdown: {
      items: [
        { href: "#public-transport", lines: ["大眾運輸"] },
        { href: "#bus-schedule", lines: ["好行時刻表"] },
      ],
    },
  },
  {
    id: "search",
    label: "好行好搜",
    href: "#search",
    dropdown: {
      items: [
        { href: "#audio-guide", lines: ["語音導覽"] },
        { href: "#data-platform", lines: ["數據平台"] },
        { href: "#download", lines: ["下載專區"] },
        { href: "#map", lines: ["旅遊地圖"] },
      ],
    },
  },
  {
    id: "service",
    label: "服務查詢",
    href: "#service",
    dropdown: {
      items: [
        { href: "#faq", lines: ["常見問題FAQ"] },
        { href: "#seat-lookup", lines: ["座位查詢"] },
        { href: "#ticket-info", lines: ["票券介紹"] },
      ],
    },
  },
]

type LanguageCode = "zh-TW" | "en" | "ko" | "ja" | "zh-CN"

const languageOptions: Record<LanguageCode, string> = {
  "zh-TW": "繁",
  en: "EN",
  ko: "한국어",
  ja: "日",
  "zh-CN": "简",
}

export function HeaderWithMenu({ title, showBackButton = true, onBack }: HeaderWithMenuProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>("zh-TW")
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [expandedMobileMenus, setExpandedMobileMenus] = useState<Record<string, boolean>>({})
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [languageOpen, setLanguageOpen] = useState(false)

  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", mobileMenuOpen)
    return () => {
      document.body.classList.remove("overflow-hidden")
    }
  }, [mobileMenuOpen])

  const activeNavId = useMemo(() => {
    const matched = navItems.find((item) => {
      if (item.href.startsWith("#")) return false
      if (item.href === "/") return pathname === "/"
      return pathname === item.href || pathname.startsWith(`${item.href}/`)
    })

    return matched?.id ?? "home"
  }, [pathname])

  const handleNavigation = (href?: string) => {
    setHoveredMenu(null)
    if (!href) {
      return
    }

    if (href.startsWith("#")) {
      setMobileMenuOpen(false)
      setExpandedMobileMenus({})
      setLanguageOpen(false)
      return
    }

    router.push(href)
    setMobileMenuOpen(false)
    setExpandedMobileMenus({})
    setLanguageOpen(false)
  }

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      router.back()
    }
  }

  const handleLanguageChange = (language: LanguageCode) => {
    setCurrentLanguage(language)
    setLanguageOpen(false)
    console.log("[header] language changed:", language)
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => {
      const next = !prev
      if (!next) {
        setExpandedMobileMenus({})
      }
      return next
    })
  }

  const toggleMobileSubmenu = (id: string) => {
    setExpandedMobileMenus((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 bg-white shadow-sm">
        <div className="hidden xl:flex h-20 items-center justify-between pl-6 pr-4 2xl:pl-10 2xl:pr-8">
          <Link href="/" className="flex items-center gap-3">
            <img
              src="/images/penghu-logo.png"
              alt="Like 澎湖 - 台灣好行"
              className="h-16 w-auto object-contain"
            />
          </Link>

          <nav className="flex h-full flex-1 items-stretch justify-center gap-1 px-2 xl:px-4 2xl:px-6">
            {navItems.map((item) => {
              const dropdown = item.dropdown
              const showDropdown = Boolean(dropdown)
              const showPin = Boolean(dropdown && (dropdown.showPinOnly || (dropdown.items?.length ?? 0) > 0))
              const showList = Boolean(dropdown?.items?.length)
              const underlineActive = item.alwaysUnderline || activeNavId === item.id
              const isHovered = hoveredMenu === item.id

              const handleMouseEnter = () => {
                if (showDropdown) setHoveredMenu(item.id)
              }

              const handleMouseLeave = () => {
                if (showDropdown) {
                  setHoveredMenu((prev) => (prev === item.id ? null : prev))
                }
              }

              const handleFocus = () => {
                if (showDropdown) setHoveredMenu(item.id)
              }

              const handleBlur = () => {
                if (showDropdown) {
                  setHoveredMenu((prev) => (prev === item.id ? null : prev))
                }
              }

              return (
                <div
                  key={item.id}
                  className="relative flex flex-1 items-center justify-center"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  onFocusCapture={handleFocus}
                  onBlurCapture={handleBlur}
                >
                  <button
                    type="button"
                    onClick={() => handleNavigation(item.href)}
                    className={cn(
                      "group relative flex w-full items-center justify-center px-2 py-4 text-[11px] font-semibold tracking-wide text-[#222222] transition-colors",
                      "hover:text-[#ec561b]",
                      "xl:px-3 xl:py-4 xl:text-[12px] 2xl:px-5 2xl:py-5 2xl:text-sm",
                    )}
                  >
                    <span className="pointer-events-none">{item.label}</span>
                    <span
                      className={cn(
                        "pointer-events-none absolute bottom-3 left-1/2 h-[3px] w-[60%] -translate-x-1/2 transition-colors",
                        underlineActive ? "bg-[#ec561b]" : "bg-transparent group-hover:bg-[#ec561b]",
                      )}
                    />
                  </button>

                  {showPin ? (
                    <span
                      className={cn(
                        "pointer-events-none absolute -bottom-[1px] left-1/2 flex -translate-x-1/2 flex-col items-center text-[#1690aa] transition-all",
                        isHovered
                          ? "duration-[800ms] ease-in-out translate-y-0 opacity-100"
                          : "duration-[400ms] ease-out translate-y-2 opacity-0",
                      )}
                    >
                      <span className="h-2.5 w-2.5 rounded-full border-2 border-white bg-[#1690aa]" />
                      <span
                        className={cn(
                          "w-px bg-current",
                          showList ? "h-[8px]" : "h-[8px]",
                        )}
                      />
                    </span>
                  ) : null}

                  {showList ? (
                    <div
                      className={cn(
                        "absolute left-1/2 top-full w-full -translate-x-1/2",
                        isHovered ? "pointer-events-auto" : "pointer-events-none",
                      )}
                    >
                      <div
                        className={cn(
                          "overflow-hidden bg-[#1690aa] text-white shadow-[0_12px_24px_rgba(0,0,0,0.18)] transition-[max-height]",
                          isHovered
                            ? "max-h-96 duration-[800ms] ease-in-out"
                            : "max-h-0 duration-[400ms] ease-out",
                        )}
                      >
                        {dropdown?.items?.map((subItem, index) => (
                          <button
                            key={`${item.id}-${index}`}
                            type="button"
                            onClick={() => handleNavigation(subItem.href)}
                            className={cn(
                              "flex w-full flex-col items-center gap-1 px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#1eacca]",
                              isHovered ? "duration-[800ms] ease-in-out" : "duration-[400ms] ease-out",
                            )}
                          >
                            {subItem.lines.map((line, lineIndex) => (
                              <span
                                key={`${item.id}-${index}-${lineIndex}`}
                                className={cn(
                                  "leading-snug",
                                  lineIndex === 0 ? "text-base tracking-[0.05em]" : "text-xs text-white/80",
                                )}
                              >
                                {line}
                              </span>
                            ))}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              )
            })}
          </nav>

          <div className="ml-3 flex h-full items-center bg-[#1690aa] pl-4 pr-2 text-white xl:ml-4 xl:pl-4 xl:pr-2 2xl:ml-5 2xl:pl-5 2xl:pr-3">
            <UserRound className="mr-2 h-5 w-5 text-white" />
            <button
              type="button"
              onClick={() => setIsLoggedIn((prev) => !prev)}
              className="text-sm font-semibold transition hover:text-gray-100"
            >
              {isLoggedIn ? "登出" : "登入"}
            </button>
            <span className="mx-3 h-4 w-px bg-white/40" />
            <div
              className="relative flex h-full w-[70px] cursor-pointer items-center justify-center transition hover:bg-white/10 xl:w-[76px] 2xl:w-[96px]"
              onMouseEnter={() => setLanguageOpen(true)}
              onMouseLeave={() => setLanguageOpen(false)}
              onClick={() => setLanguageOpen((prev) => !prev)}
            >
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <Globe className="h-4 w-4" />
                <span>{languageOptions[currentLanguage]}</span>
              </div>
              <div
                className={cn(
                  "absolute right-0 top-full w-full overflow-hidden bg-[#1690aa] text-white transition-[max-height,opacity]",
                  languageOpen
                    ? "max-h-48 opacity-100 duration-[800ms] ease-in-out"
                    : "max-h-0 opacity-0 duration-[300ms] ease-out pointer-events-none",
                )}
              >
                {Object.entries(languageOptions).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => handleLanguageChange(value as LanguageCode)}
                    className={cn(
                      "flex w-full items-center justify-center px-4 py-2 text-sm font-medium transition hover:bg-[#1eacca]",
                      languageOpen ? "duration-[800ms] ease-in-out" : "duration-[300ms] ease-out",
                      currentLanguage === value ? "bg-[#1eacca]" : "",
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="flex h-16 items-center justify-between px-4 xl:hidden">
          <div className="flex items-center gap-2">
            {showBackButton && (
              <Button variant="ghost" size="icon" className="rounded-full" onClick={handleBack}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
            )}
          </div>

          <div className="flex flex-1 justify-center">
            {title ? (
              <h1 className="text-base font-semibold tracking-wide text-slate-700">{title}</h1>
            ) : (
              <Link href="/" className="flex items-center">
                <img
                  src="/images/penghu-logo.png"
                  alt="Like 澎湖 - 台灣好行"
                  className="h-12 w-auto object-contain"
                />
              </Link>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full" onClick={toggleMobileMenu}>
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>
      {/* Mobile Menu */}
      {mobileMenuOpen ? (
        <div className="fixed inset-0 z-[70] xl:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            aria-label="關閉選單"
            onClick={toggleMobileMenu}
          />
          <div className="absolute inset-y-0 left-0 flex h-full w-[82vw] max-w-sm flex-col bg-[#1690aa] text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/15 px-4 py-4">
              <span className="text-lg font-semibold tracking-wide">主選單</span>
              <button
                type="button"
                onClick={toggleMobileMenu}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/40 text-white transition hover:border-white hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-3 py-4">
              <div className="space-y-2">
                {navItems.map((item) => {
                  const hasSubItems = (item.dropdown?.items?.length ?? 0) > 0
                  const isExpanded = expandedMobileMenus[item.id]
                  const isHighlighted = Boolean(item.alwaysUnderline)

                  return (
                    <div key={item.id} className="rounded-lg bg-white/5">
                      <button
                        type="button"
                        onClick={() =>
                          hasSubItems ? toggleMobileSubmenu(item.id) : handleNavigation(item.href)
                        }
                        className={cn(
                          "flex w-full items-center justify-between px-4 py-4 text-left text-base font-semibold tracking-wide transition",
                          hasSubItems ? "" : "pr-6",
                          isExpanded ? "bg-white/10" : "",
                        )}
                      >
                        <span className="flex items-center gap-2">
                          {isHighlighted ? (
                            <span className="h-2 w-2 rounded-full bg-[#ec561b]" aria-hidden />
                          ) : null}
                          <span>{item.label}</span>
                        </span>
                        {hasSubItems ? (
                          <ChevronRight
                            className={cn(
                              "h-5 w-5 text-white/80 transition-transform",
                              isExpanded ? "rotate-90" : "",
                            )}
                          />
                        ) : null}
                      </button>

                      {hasSubItems ? (
                        <div
                          className={cn(
                            "overflow-hidden bg-white/10 transition-[max-height]",
                            isExpanded
                              ? "max-h-96 duration-[800ms] ease-in-out"
                              : "max-h-0 duration-[300ms] ease-out",
                          )}
                        >
                          {item.dropdown?.items?.map((subItem, index) => (
                            <button
                              key={`${item.id}-mobile-${index}`}
                              type="button"
                              onClick={() => handleNavigation(subItem.href)}
                              className="flex w-full flex-col items-center gap-1 border-t border-white/10 px-5 py-3 text-center text-sm font-medium text-white transition hover:bg-white/20"
                            >
                              {subItem.lines.map((line, lineIndex) => (
                                <span
                                  key={`${item.id}-mobile-${index}-${lineIndex}`}
                                  className={cn(
                                    "leading-snug",
                                    lineIndex === 0 ? "text-base tracking-[0.08em]" : "text-xs text-white/80",
                                  )}
                                >
                                  {line}
                                </span>
                              ))}
                            </button>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  )
                })}
              </div>

              <div className="mt-6 rounded-lg bg-white/10 px-4 py-5">
                <div className="flex items-center gap-3">
                  <UserRound className="h-5 w-5 text-white" />
                  <span className="text-sm font-semibold">會員中心</span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    className="rounded-full border border-white/30 py-2 text-sm font-semibold tracking-wide text-white transition hover:bg-white/10"
                    onClick={() => {
                      setIsLoggedIn(true)
                      toggleMobileMenu()
                    }}
                  >
                    會員登入
                  </button>
                  <button
                    type="button"
                    className="rounded-full border border-white/30 py-2 text-sm font-semibold tracking-wide text-white transition hover:bg-white/10"
                    onClick={() => {
                      toggleMobileMenu()
                      router.push("/register")
                    }}
                  >
                    立即註冊
                  </button>
                </div>
              </div>

              <div className="mt-4 rounded-lg bg-white/10 px-4 py-5">
                <div className="text-sm font-semibold text-white">語系切換</div>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {Object.entries(languageOptions).map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => handleLanguageChange(value as LanguageCode)}
                      className={cn(
                        "rounded-full border px-3 py-2 text-sm font-semibold transition",
                        currentLanguage === value
                          ? "border-white bg-white/20 text-white"
                          : "border-white/30 text-white/80 hover:border-white hover:text-white",
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      </>
  )
}

export default HeaderWithMenu