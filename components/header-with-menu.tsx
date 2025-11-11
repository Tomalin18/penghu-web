"use client"

import { useEffect, useMemo, useState, type KeyboardEvent } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { ChevronRight, X } from "lucide-react"

import { cn } from "@/lib/utils"

interface HeaderWithMenuProps {
  title?: string
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

// 為了符合舊版電腦版版頭的字級與間距需求，移除「官網首頁」並將後續項目維持在同一組設定內。
const navItems: NavItem[] = [
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

const HamburgerIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 32 24"
    aria-hidden="true"
    focusable="false"
    className={className}
    {...props}
  >
    <rect
      x="6"
      y="4"
      width="20"
      height="2.5"
      rx="1.25"
      fill="currentColor"
      className="origin-center transition-transform duration-200 ease-out group-hover:-translate-y-[1.5px]"
    />
    <rect x="6" y="10.75" width="20" height="2.5" rx="1.25" fill="currentColor" />
    <rect
      x="6"
      y="17.5"
      width="20"
      height="2.5"
      rx="1.25"
      fill="currentColor"
      className="origin-center transition-transform duration-200 ease-out group-hover:translate-y-[1.5px]"
    />
  </svg>
)

export function HeaderWithMenu({ title }: HeaderWithMenuProps) {
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

    return matched?.id ?? ""
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
      <header className="fixed inset-x-0 top-0 z-50 flex justify-center bg-white shadow-sm">
        <div className="hidden xl:flex h-[80px] w-[1280px] items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-3">
            <img
              src="/images/penghu-logo.png"
              alt="Like 澎湖 - 台灣好行"
              className="h-[77.25px] w-auto object-contain"
            />
          </Link>

          <nav className="flex h-full flex-1 items-stretch justify-center gap-0.5 px-2 xl:px-4 2xl:px-6">
            {navItems.map((item) => {
              const dropdown = item.dropdown
              const showDropdown = Boolean(dropdown)
              const showPin = Boolean(dropdown && (dropdown.showPinOnly || (dropdown.items?.length ?? 0) > 0))
              const showList = Boolean(dropdown?.items?.length)
              const underlineActive = item.alwaysUnderline || activeNavId === item.id
              const allowHoverUnderline = !["my-tickets", "purchase", "reservation", "traffic", "search", "service"].includes(item.id)
              const allowHoverColor = allowHoverUnderline
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
                  className="relative flex items-center justify-center"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  onFocusCapture={handleFocus}
                  onBlurCapture={handleBlur}
                >
                  <button
                    type="button"
                    onClick={() => handleNavigation(item.href)}
                    // 確保字級與橫向間距貼近舊版電腦版設計，維持 16px 字級與 30px 水平內距。
                    className={cn(
                      "group relative flex h-full w-[110px] items-center justify-center px-[18px] text-[16px] font-[500] tracking-[0.1em] text-[#222222] transition-colors",
                      underlineActive
                        ? "font-[700]"
                        : allowHoverColor ? "hover:text-[#ec561b]" : "",
                    )}
                  >
                    <span className="pointer-events-none">{item.label}</span>
                    <span
                      className={cn(
                        "pointer-events-none absolute bottom-6 left-1/2 h-[3px] w-[70%] -translate-x-1/2 transition-colors",
                        underlineActive
                          ? "bg-[#ec561b]"
                          : allowHoverUnderline
                            ? "bg-transparent group-hover:bg-[#ec561b]"
                            : "bg-transparent",
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

          <div className="ml-auto flex h-full items-center bg-[#1690aa] text-white">
            <div className="flex items-center gap-2 pl-2">
              <img
                src="/images/icons/top_login.png"
                alt="登入"
                className="mr-1 h-4 w-4 object-contain"
              />
              <button
                type="button"
                onClick={() => setIsLoggedIn((prev) => !prev)}
                className="text-sm font-semibold transition hover:text-gray-100"
              >
                {isLoggedIn ? "登出" : "登入"}
              </button>
            </div>
            <span className="mx-2 h-4 w-px bg-white/40" />
            <div
              className="relative flex h-full min-w-[70px] cursor-pointer items-center justify-center px-2 transition hover:bg-[#00BA99]"
              onMouseEnter={() => setLanguageOpen(true)}
              onMouseLeave={() => setLanguageOpen(false)}
              onClick={() => setLanguageOpen((prev) => !prev)}
            >
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <img
                  src="/images/icons/top_global.png"
                  alt="語系"
                  className="h-4 w-4 object-contain"
                />
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
                      "flex w-full items-center justify-center px-3 py-1.5 text-[16px] font-medium transition hover:bg-[#1eacca]",
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
        <div className="grid h-[60px] w-full max-w-[1280px] grid-cols-[auto_1fr_auto] items-center px-4 xl:hidden">
          <span
            role="button"
            tabIndex={0}
            aria-label="開啟選單"
            aria-expanded={mobileMenuOpen}
            onClick={toggleMobileMenu}
            onKeyDown={(event: KeyboardEvent<HTMLSpanElement>) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault()
                toggleMobileMenu()
              }
            }}
            className="group inline-flex h-8 w-8 cursor-pointer items-center justify-center"
          >
            <HamburgerIcon className="h-8 w-8 text-[#1690aa]" />
          </span>

          <div className="flex justify-center">
            {title ? (
              <h1 className="text-base font-semibold tracking-wide text-slate-700">{title}</h1>
            ) : (
              <Link href="/" className="flex items-center">
                <img
                  src="/images/penghu-logo.png"
                  alt="Like 澎湖 - 台灣好行"
                  className="h-[68.45px] w-auto object-contain"
                />
              </Link>
            )}
          </div>

          <div />
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
          <div className="absolute inset-y-0 left-0 flex h-full w-[320px] flex-col bg-white text-[#3f3a39] shadow-2xl">
            <button
              type="button"
              onClick={toggleMobileMenu}
              className="absolute left-full top-4 ml-3 inline-flex h-10 w-10 items-center justify-center text-white transition hover:text-white/80"
              aria-label="關閉選單"
            >
              <X className="h-6 w-6 font-bold" strokeWidth={3} />
            </button>

            <div className="px-5 pt-6">
              <div className="flex gap-2 pb-1 text-sm font-semibold">
                {Object.entries(languageOptions).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => handleLanguageChange(value as LanguageCode)}
                    className={cn(
                      "flex-1 rounded-[6px] px-0 py-[6px] text-white transition",
                      currentLanguage === value
                        ? "bg-[#00BA99]"
                        : "bg-[#1690aa] hover:bg-[#1690aa]",
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 px-5 pt-2 text-sm font-semibold">
              <span className="tracking-[0.3em] text-[#191d63]">MENU</span>
            </div>
            <div className="mt-3 border-t border-[#CCC]" />

            <div className="flex-1 overflow-y-auto text-sm font-medium">
              <div>
                {navItems.map((item) => {
                  const hasSubItems = (item.dropdown?.items?.length ?? 0) > 0
                  const isExpanded = expandedMobileMenus[item.id]

                  return (
                    <div key={item.id}>
                      <button
                        type="button"
                        onClick={() =>
                          hasSubItems ? toggleMobileSubmenu(item.id) : handleNavigation(item.href)
                        }
                        className={cn("flex w-full items-center justify-between text-left tracking-[0.04em] px-[1em]",
                          isExpanded ? "bg-[#3f3a39] text-white" : "")
                        }
                      >
                        <span className="leading-[50px]">{item.label}</span>
                        {hasSubItems ? (
                          <ChevronRight
                            className={cn(
                              "h-5 w-5 transition-transform",
                              isExpanded ? "rotate-90 text-black" : "text-[#3f3a39]",
                            )}
                          />
                        ) : null}
                      </button>

                      {hasSubItems ? (
                        <div
                          className={cn(
                            "overflow-hidden transition-[max-height]",
                            isExpanded
                              ? "max-h-96 duration-[800ms] ease-in-out"
                              : "max-h-0 duration-[300ms] ease-out",
                          )}
                        >
                          <div className="bg-[#ede6e2] text-[14px]">
                            {item.dropdown?.items?.map((subItem, index) => (
                              <>
                                <button
                                  key={`${item.id}-mobile-${index}`}
                                  type="button"
                                  onClick={() => handleNavigation(subItem.href)}
                                  className="flex w-full flex-col items-start rounded-[8px] px-[25px] py-[7px] transition"
                                >
                                  {subItem.lines.map((line, lineIndex) => (
                                    <span
                                      key={`${item.id}-mobile-${index}-${lineIndex}`}
                                      className="leading-[50px]"
                                    >
                                      {line}
                                    </span>
                                  ))}
                                </button>
                                <div className="h-[2px] bg-white" />
                              </>
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  )
                })}
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsLoggedIn((prev) => !prev)
                toggleMobileMenu()
              }}
              className="mt-auto flex items-center justify-center bg-[#0c90af] py-3 gap-1 text-[15px] font-[500] text-white transition hover:bg-[#0f9fc2]"
            >
              <img
                src="/images/icons/top_login.png"
                alt="登入"
                className="h-4 w-4 object-contain"
              />
              <span>{isLoggedIn ? "登出" : "登入"}</span>
            </button>
          </div>
        </div>
      ) : null}

      </>
  )
}

export default HeaderWithMenu