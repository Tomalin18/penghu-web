"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { TicketTypeSelector } from "@/components/ticket-type-selector"
import { DesktopNavigation } from "@/components/desktop-navigation"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

export default function WebTicketPurchasePage() {
  const [selectedTicketType, setSelectedTicketType] = useState("一日券")
  const [selectedRoute, setSelectedRoute] = useState<string>("")
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const typeParam = searchParams.get("type")
    if (typeParam && ["一日券", "二日券", "三日券", "其他票券"].includes(typeParam)) {
      setSelectedTicketType(typeParam)
    }
  }, [searchParams])

  const handleTicketTypeChange = (type: string) => {
    setSelectedTicketType(type)
    setSelectedRoute("")
    router.push(`/web/purchase/tickets?type=${encodeURIComponent(type)}`)
  }

  const ticketOptions = {
    一日券: [
      {
        id: "magong-north-1",
        name: "媽宮・北環線 一日券",
        minPrice: 150,
        maxPrice: 300,
        image: "/images/ticket-north-ring-premium.png",
      },
      {
        id: "magong-xihu-1",
        name: "媽宮・湖西線 一日券",
        minPrice: 125,
        maxPrice: 250,
        image: "/images/ticket-xihu.png",
      },
      {
        id: "magong-south-1",
        name: "媽宮・澎南線 一日券",
        minPrice: 100,
        maxPrice: 200,
        image: "/images/ticket-south-premium.png",
      },
    ],
    二日券: [
      {
        id: "north-xihu-2",
        name: "台灣好行 二日券 北環・湖西線",
        minPrice: 250,
        maxPrice: 500,
        image: "/images/ticket-north-xihu-2day.png",
      },
      {
        id: "north-south-2",
        name: "台灣好行 二日券 北環・澎南線",
        minPrice: 225,
        maxPrice: 450,
        image: "/images/ticket-north-south-2day.png",
      },
      {
        id: "xihu-south-2",
        name: "台灣好行 二日券 湖西・澎南線",
        minPrice: 200,
        maxPrice: 400,
        image: "/images/ticket-xihu-south-2day.png",
      },
    ],
    三日券: [
      {
        id: "penghu-3-300",
        name: "台灣好行 三日券 北環・湖西・澎南線",
        minPrice: 300,
        maxPrice: 600,
        image: "/images/ticket-3day-300.png",
      },
    ],
    其他票券: [
      {
        id: "north-airport-combo",
        name: "媽宮・暢遊北環線一日券+空港快線",
        minPrice: 300,
        maxPrice: 600,
        image: "/images/ticket-magong-north-300.png",
      },
      {
        id: "xihu-airport-combo",
        name: "媽宮・湖西慢旅趣一日券+空港快線",
        minPrice: 250,
        maxPrice: 500,
        image: "/images/ticket-magong-xihu-250.png",
      },
      {
        id: "south-airport-combo",
        name: "媽宮・澎南輕旅行一日券+空港快線",
        minPrice: 200,
        maxPrice: 400,
        image: "/images/ticket-magong-south-200.png",
      },
    ],
  }

  const handleRouteSelect = (routeId: string) => {
    setSelectedRoute(routeId)
    router.push(`/web/purchase/tickets/${routeId}`)
  }

  const currentTickets = ticketOptions[selectedTicketType as keyof typeof ticketOptions] || []

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DesktopNavigation activeTab="purchase" />
      
      <header className="bg-primary px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-6xl mx-auto flex items-center">
          <Link href="/" className="text-primary-foreground">
            <span className="text-lg">←</span>
          </Link>
          <h1 className="flex-1 font-bold text-xl text-primary-foreground text-center">購票 - 選擇票券</h1>
        </div>
      </header>

      <div className="flex-1 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <TicketTypeSelector selectedType={selectedTicketType} onTypeChange={handleTicketTypeChange} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentTickets.map((ticket) => (
              <Card
                key={ticket.id}
                className={`shadow-sm cursor-pointer transition-all border-2 ${
                  selectedRoute === ticket.id
                    ? "border-primary bg-primary/5"
                    : "border-transparent hover:border-primary/50"
                }`}
                onClick={() => handleRouteSelect(ticket.id)}
              >
                <CardContent className="p-4">
                  <div className="flex flex-col items-center space-y-3">
                    <img
                      src={ticket.image || "/placeholder.svg?height=32&width=32"}
                      alt="Ticket"
                      className={`object-contain rounded w-32 h-32 ${selectedRoute === ticket.id ? "opacity-100" : "opacity-70"}`}
                    />
                    <div className="text-center">
                      <h3
                        className={`font-semibold text-base mb-2 ${selectedRoute === ticket.id ? "text-primary" : "text-foreground"}`}
                      >
                        {ticket.name}
                      </h3>
                      <p
                        className={`text-sm font-medium ${selectedRoute === ticket.id ? "text-primary" : "text-primary/70"}`}
                      >
                        NT$ {ticket.minPrice}~{ticket.maxPrice}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

