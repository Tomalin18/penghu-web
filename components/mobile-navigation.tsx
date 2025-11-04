"use client"

import { Home, Ticket, CreditCard, Calendar, MessageCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter, usePathname } from "next/navigation"

interface MobileNavigationProps {
  activeTab?: string
}

export function MobileNavigation({ activeTab = "home" }: MobileNavigationProps) {
  // 底部導航已移除
  return null
}

export default MobileNavigation
