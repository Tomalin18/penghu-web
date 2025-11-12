"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { cn } from "@/lib/utils"

interface PageBackLinkProps {
  href?: string
  onClick?: () => void
  className?: string
  iconClassName?: string
  ariaLabel?: string
}

export function PageBackLink({
  href = "/",
  onClick,
  className,
  iconClassName,
  ariaLabel = "返回上一頁",
}: PageBackLinkProps) {
  const baseClassName = cn(
    "inline-flex items-center justify-center leading-none text-inherit transition hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white/70 focus-visible:ring-offset-transparent",
    className,
  )

  const Icon = (
    <ArrowLeft
      aria-hidden="true"
      className={cn("h-6 w-6", iconClassName)}
    />
  )

  if (onClick) {
    return (
      <button type="button" onClick={onClick} aria-label={ariaLabel} className={baseClassName}>
        {Icon}
      </button>
    )
  }

  return (
    <Link href={href} aria-label={ariaLabel} className={baseClassName}>
      {Icon}
    </Link>
  )
}

export default PageBackLink

