"use client"

import { useState, useRef } from "react"
import { ArrowLeft, Store, Bus, Plane } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

export default function WebReservationPage() {
  const [selectedChannel, setSelectedChannel] = useState<string>("")
  const [selectedTicketType, setSelectedTicketType] = useState<string>("none")
  const [selectedRoute, setSelectedRoute] = useState<string>("")

  const channels = [
    { id: "7-11", name: "7-11", icon: Store },
    { id: "family", name: "全家", icon: Store },
    { id: "bus", name: "和盟澎湖分公司", icon: Bus },
    { id: "klook", name: "KLOOK", icon: Plane },
    { id: "trip", name: "Trip", icon: Plane },
  ]

  const ticketOptions = {
    一日券: [
      {
        id: "magong-north-1",
        name: "媽宮・北環線 一日券",
        price: 150,
        image: "/images/ticket-north-ring-premium.png",
      },
      {
        id: "magong-xihu-1",
        name: "媽宮・湖西線 一日券",
        price: 125,
        image: "/images/ticket-xihu.png",
      },
      {
        id: "magong-south-1",
        name: "媽宮・澎南線 一日券",
        price: 100,
        image: "/images/ticket-south-premium.png",
      },
    ],
    二日券: [
      {
        id: "north-xihu-2",
        name: "台灣好行 二日券 北環・湖西線",
        price: 250,
        image: "/images/ticket-north-xihu-2day.png",
      },
      {
        id: "north-south-2",
        name: "台灣好行 二日券 北環・澎南線",
        price: 225,
        image: "/images/ticket-north-south-2day.png",
      },
      {
        id: "xihu-south-2",
        name: "台灣好行 二日券 湖西・澎南線",
        price: 200,
        image: "/images/ticket-xihu-south-2day.png",
      },
    ],
    三日券: [
      {
        id: "penghu-3-300",
        name: "台灣好行 三日券 北環・湖西・澎南線",
        price: 300,
        image: "/images/ticket-3day-300.png",
      },
    ],
  }

  const handleChannelSelect = (channelId: string) => {
    setSelectedChannel(channelId)
  }

  const handleTicketTypeSelect = (type: string) => {
    setSelectedTicketType(type)
    setSelectedRoute("")
  }

  const handleTicketSelect = (ticketId: string) => {
    setSelectedRoute(ticketId)
  }

  const currentTickets = ticketOptions[selectedTicketType as keyof typeof ticketOptions] || []
  const isAllSelected = selectedChannel && selectedTicketType && selectedTicketType !== "none" && selectedRoute

  return (
    <div className="min-h-screen bg-background flex flex-col">
      
      <header className="bg-primary px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-6xl mx-auto flex items-center">
          <Link href="/" className="text-primary-foreground">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="flex-1 font-bold text-xl text-primary-foreground text-center">劃位</h1>
        </div>
      </header>

      <div className="flex-1 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Purchase Channel Selection */}
          <div>
            <h2 className="font-semibold text-xl text-foreground mb-6">請選擇您的購買通路</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {channels.map((channel) => {
                const IconComponent = channel.icon
                const isSelected = selectedChannel === channel.id
                return (
                  <Card
                    key={channel.id}
                    className={`shadow-sm hover:shadow-md transition-all cursor-pointer border-2 ${
                      isSelected ? "border-primary bg-primary/5" : "border-transparent hover:border-primary/60"
                    }`}
                    onClick={() => handleChannelSelect(channel.id)}
                  >
                    <CardContent className="p-4 text-center">
                      <IconComponent
                        className={`h-8 w-8 mx-auto mb-3 ${isSelected ? "text-primary" : "text-primary/70"}`}
                      />
                      <p className={`text-sm font-medium ${isSelected ? "text-primary" : "text-foreground"}`}>
                        {channel.name}
                      </p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Ticket Type Selection */}
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4">請選擇您的票券類型</h2>
            <Select value={selectedTicketType} onValueChange={handleTicketTypeSelect}>
              <SelectTrigger className="w-full max-w-md">
                <SelectValue placeholder="請選擇票券類型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">請選擇</SelectItem>
                <SelectItem value="一日券">一日券</SelectItem>
                <SelectItem value="二日券">二日券</SelectItem>
                <SelectItem value="三日券">三日券</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Route Selection Section */}
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4">請選擇票券</h2>
            {!selectedTicketType || selectedTicketType === "none" ? (
              <div className="text-sm text-muted-foreground p-4 bg-muted/50 rounded-lg">
                請先選擇票券類型
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentTickets.map((ticket) => (
                  <Card
                    key={ticket.id}
                    className={`shadow-sm cursor-pointer transition-all border-2 ${
                      selectedRoute === ticket.id
                        ? "border-primary bg-primary/5"
                        : "border-transparent hover:border-primary/50"
                    }`}
                    onClick={() => handleTicketSelect(ticket.id)}
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
                            NT$ {ticket.price}~{ticket.price * 2}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Bottom Button - Sticky */}
      <div className="sticky bottom-0 z-40 bg-background/95 backdrop-blur-sm border-t">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {isAllSelected ? (
            <Link
              href={`/reservation/ticket-info?ticketId=${selectedRoute}&channel=${selectedChannel}&ticketType=${selectedTicketType}`}
            >
              <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-medium text-lg">
                下一步
              </Button>
            </Link>
          ) : (
            <Button
              disabled
              className="w-full h-12 bg-muted text-muted-foreground rounded-xl font-medium text-lg cursor-not-allowed"
            >
              下一步
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

