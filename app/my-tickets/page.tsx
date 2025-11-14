"use client"

import { MapPin, QrCode, Star, Accessibility } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MobileNavigation } from "@/components/mobile-navigation"
import HeaderWithMenu from "@/components/header-with-menu"
import PageBackLink from "@/components/page-back-link"
import { TicketStatusFilter } from "@/components/ticket-status-filter"
import { TicketSlider, type TicketSliderItem } from "@/components/ui/ticket-slider"
import { useIsMobile } from "@/hooks/use-mobile"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useState, useEffect, useCallback } from "react"
import { getTickets, updateTicket, type StoredTicket } from "@/lib/ticket-storage"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function WebMyTicketsPage() {
  const router = useRouter()
  const isMobile = useIsMobile()
  const [selectedTicket, setSelectedTicket] = useState<StoredTicket | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isTicketInfoDialogOpen, setIsTicketInfoDialogOpen] = useState(false)
  const [isRatingDialogOpen, setIsRatingDialogOpen] = useState(false)
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false)
  const [ticketToCancel, setTicketToCancel] = useState<StoredTicket | null>(null)
  const [ratingSubmitted, setRatingSubmitted] = useState(false)
  const [ratings, setRatings] = useState({
    booking: 0,
    transportation: 0,
    sightseeing: 0,
    food: 0,
    overall: 0,
  })
  const [comment, setComment] = useState("")
  const [tickets, setTickets] = useState<StoredTicket[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState<string>("已劃位")

  useEffect(() => {
    const loadedTickets = getTickets()

    // Sample tickets with different statuses
    const sampleTickets: StoredTicket[] = [
      // 已劃位 (Seat Assigned) - future date
      {
        id: "TK251015",
        name: "媽宮・西湖線 一日券",
        routeName: "西湖線",
        date: "2025/10/15",
        quantity: 1,
        totalAmount: 300,
        status: "purchased",
        seatAssigned: true,
        seatNumber: "B05",
        purchaseDate: "2025/10/1",
        validUntil: "2025/11/1",
        type: "一日券",
        breakdown: {
          adult: {
            label: "全票（非澎湖籍）",
            count: 1,
            price: 300,
            subtotal: 300,
          },
        },
        selectedDates: [
          {
            routeId: "xihu",
            routeName: "西湖線",
            date: "2025/10/15",
            cancelled: true, // 標記此路線為已取消
          },
        ],
        passengers: [
          {
            ticketType: "adult",
            name: "陳大明",
            email: "chen@example.com",
            phone: "0934567890",
            id: "B234567890",
            needsAccessibility: "yes",
            pickupLocations: { xihu: "magong-port" },
          },
        ],
      },
      // 未劃位 (Not Assigned) - future date
      {
        id: "TK250915",
        name: "媽宮・北環線 一日券",
        routeName: "北環線",
        date: "2026/10/10",
        quantity: 2,
        totalAmount: 600,
        status: "purchased",
        seatAssigned: false,
        purchaseDate: "2025/9/10",
        validUntil: "2025/12/10",
        type: "一日券",
        breakdown: {
          adult: {
            label: "全票（非澎湖籍）",
            count: 2,
            price: 300,
            subtotal: 600,
          },
        },
        selectedDates: [
          {
            routeId: "north",
            routeName: "北環線",
            date: "2026/10/10",
          },
        ],
        passengers: [
          {
            ticketType: "adult",
            name: "王小明",
            email: "wang@example.com",
            phone: "0912345678",
            id: "A123456789",
            needsAccessibility: "no",
            pickupLocations: { north: "xiweidong-0828" },
          },
          {
            ticketType: "adult",
            name: "李小華",
            email: "lee@example.com",
            phone: "0923456789",
            needsAccessibility: "no",
            pickupLocations: { north: "xiweidong-0828" },
          },
        ],
      },
      // 已搭乘 (Completed) - past date
      {
        id: "TK250920",
        name: "媽宮・湖西線 一日券",
        routeName: "湖西線",
        date: "2025/9/20",
        quantity: 1,
        totalAmount: 300,
        status: "completed",
        seatAssigned: true,
        seatNumber: "B08",
        purchaseDate: "2025/9/15",
        validUntil: "2025/12/15",
        type: "一日券",
        breakdown: {
          adult: {
            label: "全票（非澎湖籍）",
            count: 1,
            price: 300,
            subtotal: 300,
          },
        },
        selectedDates: [
          {
            routeId: "xihu",
            routeName: "湖西線",
            date: "2025/9/20",
          },
        ],
        passengers: [
          {
            ticketType: "adult",
            name: "陳小美",
            email: "chen@example.com",
            phone: "0934567890",
            id: "B234567890",
            needsAccessibility: "no",
            pickupLocations: { xihu: "magonggang-0830" },
          },
        ],
      },
      // 已取消 (Cancelled)
      {
        id: "TK251010",
        name: "媽宮・南環線 一日券",
        routeName: "南環線",
        date: "2025/10/10",
        quantity: 3,
        totalAmount: 900,
        status: "cancelled",
        seatAssigned: true,
        seatNumber: "C10, C11, C12",
        purchaseDate: "2025/9/25",
        validUntil: "2025/12/25",
        type: "一日券",
        breakdown: {
          adult: {
            label: "全票（非澎湖籍）",
            count: 3,
            price: 300,
            subtotal: 900,
          },
        },
        selectedDates: [
          {
            routeId: "south",
            routeName: "南環線",
            date: "2025/10/10",
          },
        ],
        passengers: [
          {
            ticketType: "adult",
            name: "林小美",
            email: "lin@example.com",
            phone: "0945678901",
            id: "C345678901",
            needsAccessibility: "no",
            pickupLocations: { south: "magong-port" },
          },
          {
            ticketType: "adult",
            name: "張小強",
            email: "zhang@example.com",
            phone: "0956789012",
            needsAccessibility: "no",
            pickupLocations: { south: "magong-port" },
          },
          {
            ticketType: "adult",
            name: "劉小芳",
            email: "liu@example.com",
            phone: "0967890123",
            needsAccessibility: "no",
            pickupLocations: { south: "magong-port" },
          },
        ],
      },
      // 二日券 - 未劃位狀態
      {
        id: "TK2D001",
        name: "台灣好行 二日券 北環・湖西線",
        routeName: "北環・湖西線",
        date: "2025/11/20",
        quantity: 2,
        totalAmount: 500,
        status: "purchased",
        seatAssigned: false,
        purchaseDate: "2025/10/15",
        validUntil: "2025/12/15",
        type: "二日券",
        breakdown: {
          adult: {
            label: "全票",
            count: 1,
            price: 250,
            subtotal: 250,
          },
          senior: {
            label: "長者",
            count: 1,
            price: 250,
            subtotal: 250,
          },
        },
        selectedDates: [
          {
            routeId: "north",
            routeName: "北環線",
            date: "2025/11/20",
          },
          {
            routeId: "xihu",
            routeName: "湖西線",
            date: "2025/11/21",
          },
        ],
        passengers: [
          {
            ticketType: "adult",
            name: "張小明",
            email: "zhang.adult@example.com",
            phone: "0911111111",
            id: "A111111111",
            needsAccessibility: "no",
            pickupLocations: { 
              north: "gongchezong-0840",
              xihu: "magonggang-0830"
            },
            ticketSerial: "2D001A"
          },
          {
            ticketType: "senior",
            name: "李阿嬤",
            email: "li.senior@example.com",
            phone: "0922222222",
            id: "B222222222",
            needsAccessibility: "yes",
            pickupLocations: { 
              north: "gongchezong-0840",
              xihu: "magonggang-0830"
            },
            ticketSerial: "2D001S"
          },
        ],
      },
      // 二日券 - 已劃位狀態
      {
        id: "TK2D002",
        name: "台灣好行 二日券 北環・澎南線",
        routeName: "北環・澎南線",
        date: "2025/12/15",
        quantity: 3,
        totalAmount: 675,
        status: "purchased",
        seatAssigned: true,
        seatNumber: "A05, A06, A07",
        purchaseDate: "2025/11/1",
        validUntil: "2026/1/1",
        type: "二日券",
        breakdown: {
          adult: {
            label: "全票",
            count: 2,
            price: 225,
            subtotal: 450,
          },
          child: {
            label: "兒童",
            count: 1,
            price: 225,
            subtotal: 225,
          },
        },
        selectedDates: [
          {
            routeId: "north",
            routeName: "北環線",
            date: "2025/12/15",
          },
          {
            routeId: "south",
            routeName: "澎南線",
            date: "2025/12/16",
            cancelled: true, // 標記澎南線為已取消
          },
        ],
        passengers: [
          {
            ticketType: "adult",
            name: "王大華",
            email: "wang.adult@example.com",
            phone: "0933333333",
            id: "C333333333",
            needsAccessibility: "no",
            pickupLocations: { 
              north: "ziyouta-0845",
              south: "magonggang-0828"
            },
            ticketSerial: "2D002A"
          },
          {
            ticketType: "adult",
            name: "陳小美",
            email: "chen.adult@example.com",
            phone: "0944444444",
            id: "D444444444",
            needsAccessibility: "no",
            pickupLocations: { 
              north: "ziyouta-0845",
              south: "magonggang-0828"
            },
            ticketSerial: "2D002B"
          },
          {
            ticketType: "child",
            name: "王小寶",
            email: "wang.child@example.com",
            phone: "0955555555",
            id: "E555555555",
            needsAccessibility: "no",
            pickupLocations: { 
              north: "ziyouta-0845",
              south: "magonggang-0828"
            },
            ticketSerial: "2D002C"
          },
        ],
      },
      // 三日券 - 未劃位狀態
      {
        id: "TK3D001",
        name: "台灣好行 三日券 北環・湖西・澎南線",
        routeName: "北環・湖西・澎南線",
        date: "2025/12/25",
        quantity: 4,
        totalAmount: 1200,
        status: "purchased",
        seatAssigned: false,
        purchaseDate: "2025/11/10",
        validUntil: "2026/1/10",
        type: "三日券",
        breakdown: {
          adult: {
            label: "全票",
            count: 2,
            price: 300,
            subtotal: 600,
          },
          senior: {
            label: "長者",
            count: 1,
            price: 300,
            subtotal: 300,
          },
          child: {
            label: "兒童",
            count: 1,
            price: 300,
            subtotal: 300,
          },
        },
        selectedDates: [
          {
            routeId: "north",
            routeName: "北環線",
            date: "2025/12/25",
          },
          {
            routeId: "xihu",
            routeName: "湖西線",
            date: "2025/12/26",
          },
          {
            routeId: "south",
            routeName: "澎南線",
            date: "2025/12/27",
          },
        ],
        passengers: [
          {
            ticketType: "adult",
            name: "全家旅遊爸",
            email: "family.dad@example.com",
            phone: "0977777777",
            id: "G777777777",
            needsAccessibility: "no",
            pickupLocations: { 
              north: "dongwei-0907",
              xihu: "airport-0900",
              south: "shanshui-0930"
            },
            ticketSerial: "3D001A"
          },
          {
            ticketType: "adult",
            name: "全家旅遊媽",
            email: "family.mom@example.com",
            phone: "0988888888",
            id: "H888888888",
            needsAccessibility: "no",
            pickupLocations: { 
              north: "dongwei-0907",
              xihu: "airport-0900",
              south: "shanshui-0930"
            },
            ticketSerial: "3D001B"
          },
          {
            ticketType: "senior",
            name: "全家旅遊爺",
            email: "family.grandpa@example.com",
            phone: "0999999999",
            id: "I999999999",
            needsAccessibility: "yes",
            pickupLocations: { 
              north: "dongwei-0907",
              xihu: "airport-0900",
              south: "shanshui-0930"
            },
            ticketSerial: "3D001S"
          },
          {
            ticketType: "child",
            name: "全家旅遊孩",
            email: "family.kid@example.com",
            phone: "0900000000",
            id: "J000000000",
            needsAccessibility: "no",
            pickupLocations: { 
              north: "dongwei-0907",
              xihu: "airport-0900",
              south: "shanshui-0930"
            },
            ticketSerial: "3D001C"
          },
        ],
      },
      // 三日券 - 已劃位狀態
      {
        id: "TK3D002",
        name: "台灣好行 三日券 北環・湖西・澎南線",
        routeName: "北環・湖西・澎南線",
        date: "2026/1/20",
        quantity: 2,
        totalAmount: 600,
        status: "purchased",
        seatAssigned: true,
        seatNumber: "C15, C16",
        purchaseDate: "2025/12/1",
        validUntil: "2026/2/1",
        type: "三日券",
        breakdown: {
          adult: {
            label: "全票",
            count: 2,
            price: 300,
            subtotal: 600,
          },
        },
        selectedDates: [
          {
            routeId: "north",
            routeName: "北環線",
            date: "2026/1/20",
          },
          {
            routeId: "xihu",
            routeName: "湖西線",
            date: "2026/1/21",
          },
          {
            routeId: "south",
            routeName: "澎南線",
            date: "2026/1/22",
          },
        ],
        passengers: [
          {
            ticketType: "adult",
            name: "情侶男",
            email: "couple.boy@example.com",
            phone: "0912345678",
            id: "K111111111",
            needsAccessibility: "no",
            pickupLocations: { 
              north: "kuahaidaqiao-0930",
              xihu: "nanliao-0950",
              south: "suogang-1000"
            },
            ticketSerial: "3D002A"
          },
          {
            ticketType: "adult",
            name: "情侶女",
            email: "couple.girl@example.com",
            phone: "0923456789",
            id: "L222222222",
            needsAccessibility: "no",
            pickupLocations: { 
              north: "kuahaidaqiao-0930",
              xihu: "nanliao-0950",
              south: "suogang-1000"
            },
            ticketSerial: "3D002B"
          },
        ],
      },
      // 三日券 - 已搭乘狀態
    ]

    const existingSampleIds = sampleTickets.map((t) => t.id)
    const filteredLoadedTickets = loadedTickets.filter((t) => !existingSampleIds.includes(t.id))

    const allTickets = [...sampleTickets, ...filteredLoadedTickets]

    // Show all tickets (both assigned and unassigned)
    const assignedTickets = allTickets

    // Sort tickets: future dates first (ascending), then past dates (descending)
    const sortedTickets = assignedTickets.sort((a, b) => {
      const aDate = new Date(a.date)
      const bDate = new Date(b.date)
      const now = new Date()

      const aIsPast = aDate < now
      const bIsPast = bDate < now

      if (!aIsPast && bIsPast) return -1
      if (aIsPast && !bIsPast) return 1

      if (!aIsPast && !bIsPast) {
        return aDate.getTime() - bDate.getTime()
      } else {
        return bDate.getTime() - aDate.getTime()
      }
    })

    setTickets(sortedTickets)
    setIsLoading(false)
  }, [])

  const handleCancelTicket = () => {
    if (!ticketToCancel) return

    // Update the ticket in local state
    setTickets((prevTickets) =>
      prevTickets.map((ticket) =>
        ticket.id === ticketToCancel.id ? { ...ticket, status: "cancelled" as const } : ticket,
      ),
    )

    // Also update in localStorage if it exists there
    const updatedTicket = { ...ticketToCancel, status: "cancelled" as const }
    updateTicket(ticketToCancel.id, { status: "cancelled" })

    setIsCancelDialogOpen(false)
    setTicketToCancel(null)
  }

  const handleEditTicket = (ticket: StoredTicket) => {
    router.push(`/my-tickets/edit/${ticket.id}`)
  }

  const handleQRCodeClick = (ticket: StoredTicket) => {
    setSelectedTicket(ticket)
    setIsDialogOpen(true)
  }

  const handleViewTicketInfo = (ticket: StoredTicket) => {
    setSelectedTicket(ticket)
    setIsTicketInfoDialogOpen(true)
  }

  const handleRatingClick = (ticket: StoredTicket) => {
    setSelectedTicket(ticket)
    setIsRatingDialogOpen(true)
    setRatingSubmitted(false)
    setRatings({
      booking: 0,
      transportation: 0,
      sightseeing: 0,
      food: 0,
      overall: 0,
    })
    setComment("")
  }

  const handleStarClick = useCallback((category: keyof typeof ratings, value: number) => {
    setRatings((prev) => ({ ...prev, [category]: value }))
  }, [])

  const handleRatingSubmit = () => {
    setRatingSubmitted(true)
    setTimeout(() => {
      setIsRatingDialogOpen(false)
      setRatingSubmitted(false)
    }, 2000)
  }

  const isRatingComplete = Object.values(ratings).every((rating) => rating > 0)

  const StarRating = useCallback(
    ({ value, onChange }: { value: number; onChange: (value: number) => void }) => (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onChange(star)
            }}
            className="focus:outline-none transition-colors"
          >
            <Star className={`h-6 w-6 ${star <= value ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
          </button>
        ))}
      </div>
    ),
    [],
  )

  const RatingDialog = useCallback(
    () => (
      <Dialog open={isRatingDialogOpen} onOpenChange={setIsRatingDialogOpen}>
        <DialogContent className="max-w-sm max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-center">為此行程評分</DialogTitle>
          </DialogHeader>
          {ratingSubmitted ? (
            <div className="py-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-green-600 fill-green-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">感謝您的評分！</h3>
              <p className="text-muted-foreground text-sm">您的寶貴意見將幫助我們提供更好的服務</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  {selectedTicket?.name} • {selectedTicket?.date}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium mb-2 block">訂票流程</Label>
                  <StarRating value={ratings.booking} onChange={(v) => handleStarClick("booking", v)} />
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2 block">交通服務</Label>
                  <StarRating value={ratings.transportation} onChange={(v) => handleStarClick("transportation", v)} />
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2 block">景點遊覽</Label>
                  <StarRating value={ratings.sightseeing} onChange={(v) => handleStarClick("sightseeing", v)} />
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2 block">美食體驗</Label>
                  <StarRating value={ratings.food} onChange={(v) => handleStarClick("food", v)} />
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2 block">整體滿意度</Label>
                  <StarRating value={ratings.overall} onChange={(v) => handleStarClick("overall", v)} />
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2 block">建議（選填）</Label>
                  <Textarea
                    placeholder="請分享您的旅遊心得或建議..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="min-h-[80px] resize-none"
                  />
                </div>
              </div>

              <Button
                className="w-full bg-primary hover:bg-primary/90"
                onClick={handleRatingSubmit}
                disabled={!isRatingComplete}
              >
                送出評分
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    ),
    [
      isRatingDialogOpen,
      ratingSubmitted,
      selectedTicket,
      ratings,
      comment,
      isRatingComplete,
      StarRating,
      handleStarClick,
    ],
  )

  const QRCodeDisplay = ({ ticket }: { ticket: StoredTicket }) => (
    <div className="flex flex-col items-center space-y-4">
      <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
        <div className="w-48 h-48 bg-gray-100 flex items-center justify-center rounded">
          <div className="text-center">
            <QrCode className="h-16 w-16 mx-auto mb-2 text-gray-400" />
            <div className="text-xs text-gray-500">QR Code</div>
            <div className="text-xs text-gray-400 mt-1">{ticket.id}</div>
          </div>
        </div>
      </div>
      <div className="text-center">
        <h3 className="font-semibold text-foreground text-sm mb-1">{ticket.name}</h3>
        <p className="text-xs text-muted-foreground mt-1">
          {ticket.routeName} • {ticket.date}
        </p>
        <p className="text-xs text-muted-foreground">
          數量: {ticket.quantity} 張 • NT${ticket.totalAmount}
        </p>
      </div>
    </div>
  )

  const getTicketTypeLabel = (ticketType: string) => {
    const labels: Record<string, string> = {
      adult: "全票",
      discount: "澎湖籍",
      senior: "長者",
      love: "愛心",
      child: "兒童",
    }
    return labels[ticketType] || ticketType
  }

  const getStationLabel = (routeId: string, stationId: string) => {
    const stationsByRoute: Record<string, Array<{ value: string; label: string }>> = {
      north: [
        { value: "xiweidong-0828", label: "08:28 西衛東站" },
        { value: "magonggang-0836", label: "08:36 馬公港站" },
        { value: "gongchezong-0840", label: "08:40 公車總站" },
        { value: "ziyouta-0845", label: "08:45 自由塔（勝國）站" },
        { value: "disanyu-0849", label: "08:49 第三漁港（雅霖）站" },
        { value: "wenao-0855", label: "08:55 文澳（元泰.百世多麗）站" },
        { value: "dongwei-0907", label: "09:07 東衛站" },
        { value: "kuahaidaqiao-0930", label: "09:30 跨海大橋（西嶼端）" },
        { value: "sanxianta-1005", label: "10:05 三仙塔" },
        { value: "dacaiye-1035", label: "10:35 大菓葉玄武岩柱" },
        { value: "erkanjuluo-1100", label: "11:00 二崁聚落" },
        { value: "tongliangguta-1150", label: "11:50 通梁古榕" },
      ],
      xihu: [
        { value: "magonggang-0830", label: "08:30 馬公港站" },
        { value: "gongchezong-0834", label: "08:34 公車總站" },
        { value: "ziyouta-0839", label: "08:39 自由塔（勝國）站" },
        { value: "disanyu-0843", label: "08:43 第三漁港（雅霖）站" },
        { value: "wenao-0847", label: "08:47 文澳（元泰.百世多麗）站" },
        { value: "airport-0900", label: "09:00 澎湖機場站" },
        { value: "beiliao-0910", label: "09:10 北寮奎壁山" },
        { value: "nanliao-0950", label: "09:50 南寮社區" },
        { value: "longmen-1035", label: "10:35 龍門閉鎖陣地" },
        { value: "museum-1135", label: "11:35 澎湖生活博物館" },
      ],
      south: [
        { value: "magonggang-0828", label: "08:28 馬公港站" },
        { value: "gongchezong-0832", label: "08:32 公車總站" },
        { value: "ziyouta-0836", label: "08:36 自由塔（勝國）站" },
        { value: "disanyu-0840", label: "08:40 第三漁港（雅霖）站" },
        { value: "wenao-0844", label: "08:44 文澳（元泰.百世多麗）站" },
        { value: "fengkui-0905", label: "09:05 風櫃洞" },
        { value: "fishery-0945", label: "09:45 澎湖縣水產種苗繁殖場" },
        { value: "shanshui-1050", label: "10:50 山水沙灘" },
        { value: "suogang-1130", label: "11:30 鎖港子午塔" },
      ],
    }

    const routeStations = stationsByRoute[routeId] || []
    const station = routeStations.find(s => s.value === stationId)
    return station ? station.label : stationId
  }

  const TicketInfoDisplay = ({ ticket, showQRCode = true }: { ticket: StoredTicket; showQRCode?: boolean }) => {
    const ticketSlides =
      ticket.passengers && ticket.passengers.length > 0
        ? ticket.passengers
        : Array.from({ length: ticket.quantity }).map((_, index) => ({
            ticketType: "",
            name: "",
            ticketSerial: "",
            __fallbackIndex: index + 1,
          }))

    const hasMultipleTickets = ticketSlides.length > 1

    const sliderItems: TicketSliderItem[] = hasMultipleTickets
      ? ticketSlides.map((passenger: any, index: number) => {
          const slideId =
            passenger.ticketSerial ??
            (passenger.__fallbackIndex ? `${ticket.id}-${passenger.__fallbackIndex}` : `${ticket.id}-${index + 1}`)

          return {
            id: slideId,
            content: (
              <div className="w-[240px] mx-auto flex flex-col items-center space-y-3">
                <div className="bg-white p-4 rounded-lg border-2 border-gray-200 shadow-sm">
                  <div className="w-48 h-48 bg-gray-100 flex items-center justify-center rounded">
                    <div className="text-center">
                      <QrCode className="h-16 w-16 mx-auto mb-2 text-gray-400" />
                      <div className="text-xs text-gray-500">QR Code</div>
                      <div className="text-xs text-gray-400 mt-1 truncate max-w-[10rem]">{slideId}</div>
                    </div>
                  </div>
                </div>
                <div className="text-center space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">
                    第 {index + 1} 張／共 {ticketSlides.length} 張
                  </p>
                  {passenger.name && <p className="text-xs text-muted-foreground">乘客：{passenger.name}</p>}
                  {passenger.ticketType && (
                    <p className="text-xs text-muted-foreground">票種：{getTicketTypeLabel(passenger.ticketType)}</p>
                  )}
                </div>
              </div>
            ),
          }
        })
      : []

    return (
      <div className="space-y-4">
        {/* QR Code */}
        {showQRCode && (
          <div className="flex flex-col items-center pb-4 border-b border-border">
            {hasMultipleTickets ? (
              <TicketSlider items={sliderItems} peek={48} gap={24} className="w-full max-w-xs" />
            ) : (
              <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                <div className="w-48 h-48 bg-gray-100 flex items-center justify-center rounded">
                  <div className="text-center">
                    <QrCode className="h-16 w-16 mx-auto mb-2 text-gray-400" />
                    <div className="text-xs text-gray-500">QR Code</div>
                    <div className="text-xs text-gray-400 mt-1">{ticket.id}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

      {/* 票券基本資訊 */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-foreground text-sm mb-2">
            {ticket.name}
          </h3>
          {/* 顯示所有路線資訊 */}
          <div className="space-y-1 mb-2">
            {ticket.selectedDates?.map((dateInfo: any, routeIndex: number) => (
              <div key={routeIndex} className="flex items-center text-xs text-muted-foreground">
                <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                <span>路線{routeIndex + 1}：{dateInfo.routeName} 搭乘日期：{dateInfo.date}</span>
              </div>
            ))}
          </div>
          <div className="text-xs text-muted-foreground">
            <div>數量: {ticket.quantity} 張</div>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <Badge variant="default" className="text-xs">
            {ticket.status === "purchased" ? "已購買" : ticket.status === "reserved" ? "已劃位" : "已取消"}
          </Badge>
          <div className="text-xs text-muted-foreground text-right mt-1">
            <div>購買: {ticket.purchaseDate}</div>
          </div>
        </div>
      </div>

      {/* 票券明細 */}
      {ticket.breakdown && (
        <div className="mb-4">
          <h4 className="font-semibold text-xs text-foreground mb-2">票券明細</h4>
          <div className="bg-muted/50 p-3 rounded-lg space-y-1">
            {Object.entries(ticket.breakdown).map(([key, detail]: [string, any]) => (
              <div key={key} className="flex justify-between text-xs">
                <span className="text-muted-foreground">
                  {detail.label} x {detail.count}
                </span>
                <span className="font-medium">NT${detail.subtotal}</span>
              </div>
            ))}
            <div className="pt-2 border-t border-border flex justify-between font-semibold text-xs">
              <span>總計</span>
              <span className="text-primary">NT${ticket.totalAmount}</span>
            </div>
          </div>
        </div>
      )}

      {/* 退款明細 - 當票券狀態為已取消或有路線被取消時顯示 */}
      {((ticket.status === "cancelled") || (ticket.selectedDates?.some((route: any) => route.cancelled))) && ticket.breakdown && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-xs text-foreground">退款明細</h4>
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">退款申請中</span>
          </div>
          <div className="bg-muted/50 p-3 rounded-lg space-y-1">
            {(() => {
              // 找到第一個被取消的路線名稱
              const cancelledRoute = ticket.selectedDates?.find(date => date.cancelled);
              const routeNamePrefix = cancelledRoute ? `${cancelledRoute.routeName} ` : '';
              
              return Object.entries(ticket.breakdown).map(([key, detail]: [string, any]) => (
                <div key={key} className="flex justify-between text-xs">
                  <span className="text-muted-foreground">
                    {routeNamePrefix}{detail.label} x {detail.count}
                  </span>
                  <span className="font-medium">- NT${detail.subtotal}</span>
                </div>
              ));
            })()}
            <div className="pt-2 border-t border-border flex justify-between font-semibold text-xs">
              <span>總計</span>
              <span className="text-primary">- NT${ticket.totalAmount}</span>
            </div>
          </div>
        </div>
      )}

      {/* 每條路線的完整資訊 */}
      {ticket.selectedDates?.map((dateInfo: any, routeIndex: number) => (
        <div key={routeIndex} className="mb-4 last:mb-0">
          {/* 路線分隔線 */}
          {routeIndex > 0 && (
            <div className="border-t border-border my-4"></div>
          )}
          
          {/* 路線標題 */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-primary" />
              <h4 className="font-semibold text-sm text-foreground">
                路線{routeIndex + 1}：{dateInfo.routeName}
              </h4>
              <span className="ml-2 text-xs text-muted-foreground">
                搭乘日期：{dateInfo.date}
              </span>
            </div>
            {dateInfo.cancelled && (
              <Badge variant="destructive" className="text-xs bg-red-600 text-white">
                已取消
              </Badge>
            )}
          </div>

          {/* 該路線的乘客資訊 */}
          <div className="bg-muted/30 p-3 rounded-lg">
            <h5 className="font-medium text-xs text-foreground mb-2">乘客資訊</h5>
            <div className="space-y-2">
              {ticket.passengers?.map((passenger: any, passengerIndex: number) => {
                // 取得該乘客在當前路線的上車地點
                const getPickupLocation = (passenger: any, currentRoute: any) => {
                  if (passenger.pickupLocations && passenger.pickupLocations[currentRoute.routeId]) {
                    const stationId = passenger.pickupLocations[currentRoute.routeId]
                    return getStationLabel(currentRoute.routeId, stationId)
                  }
                  return "未指定"
                }

                return (
                  <div key={passengerIndex} className="text-xs">
                    <div className="flex items-center gap-1 mb-1">
                      <span className="text-muted-foreground">姓名：</span>
                      <span className="font-medium">{passenger.name}</span>
                    </div>
                    <div className="flex items-center gap-1 mb-1">
                      <span className="text-muted-foreground">上車地點：</span>
                      <span className="font-medium">{getPickupLocation(passenger, dateInfo)}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 items-center mb-1">
                      <div className="flex items-center gap-1">
                        <span className="text-muted-foreground">票種：</span>
                        <span className="font-medium">{getTicketTypeLabel(passenger.ticketType)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-muted-foreground">票券序號：</span>
                        <span className="font-medium">{passenger.ticketSerial || "未填寫"}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mb-1">
                      <span className="text-muted-foreground">Email：</span>
                      <span className="font-medium">{passenger.email}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-muted-foreground">電話：</span>
                      <span className="font-medium">
                        {passenger.countryCode ? `${passenger.countryCode} ${passenger.phone}` : passenger.phone}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* 該路線的我要取消按鈕 */}
          {(() => {
            const isPastTicket = new Date(ticket.date) < new Date()
            const canCancel = !isPastTicket && ticket.status !== "cancelled" && new Date(ticket.validUntil) >= new Date() && !dateInfo.cancelled
            
            if (!canCancel) return null
            
            return (
              <div className="mt-3 pt-3 border-t border-border">
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full h-8 text-xs bg-white text-red-600 font-bold hover:bg-red-50 hover:text-red-700"
                  onClick={() => {
                    setTicketToCancel(ticket)
                    setIsCancelDialogOpen(true)
                  }}
                >
                  我要取消
                </Button>
              </div>
            )
          })()}
        </div>
      ))}

      <div className="space-y-1">
        <h4 className="font-semibold text-xs text-foreground">購票資訊</h4>
        <div className="bg-muted/50 p-2 rounded-lg space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">票券編號</span>
            <span className="font-mono text-xs">{ticket.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">購買日期</span>
            <span className="font-medium">{ticket.purchaseDate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">有效期限</span>
            <span className="font-medium">{ticket.validUntil}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">數量</span>
            <span className="font-medium">{ticket.quantity} 張</span>
          </div>
        </div>
      </div>

    </div>
    )
  }

  const getTicketStatus = (ticket: StoredTicket) => {
    // 單純根據票券的固定狀態判斷，不考慮日期
    if (ticket.status === "cancelled") {
      return { label: "已取消", variant: "destructive" as const, className: "" }
    }

    if (ticket.status === "completed") {
      return { label: "已搭乘", variant: "secondary" as const, className: "" }
    }

    // 如果未劃位，顯示「未劃位」狀態
    if (!ticket.seatAssigned) {
      return { label: "未劃位", variant: "outline" as const, className: "bg-orange-100 text-orange-700 border-orange-200" }
    }

    // 預設為已劃位
    return { label: "已劃位", variant: "default" as const, className: "" }
  }

  const getTicketStatusLabel = (ticket: StoredTicket): string => {
    if (ticket.status === "cancelled") {
      return "已取消"
    }
    if (ticket.status === "completed") {
      return "已搭乘"
    }
    if (!ticket.seatAssigned) {
      return "未劃位"
    }
    return "已劃位"
  }

  const filteredTickets = tickets.filter((ticket) => {
    if (selectedStatus === "全部") {
      return true
    }
    return getTicketStatusLabel(ticket) === selectedStatus
  })

  const TicketCard = ({ ticket }: { ticket: StoredTicket }) => {
    const isPastTicket = new Date(ticket.date) < new Date()
    const status = getTicketStatus(ticket)
    const canEdit =
      ticket.seatAssigned && !isPastTicket && ticket.status !== "cancelled" && new Date(ticket.validUntil) >= new Date()

    const needsLowFloorBus = ticket.passengers?.some((p) => p.needsAccessibility === "yes")

    return (
      <Card className="shadow-sm border-l-4 border-l-primary flex flex-col h-full">
        <CardContent className="px-3 py-1 flex flex-col flex-1">
          <div className="flex-1">
            <div className="flex justify-between items-start mb-1">
              <div className="flex-1">
                <h3 className="font-semibold text-foreground text-sm mb-1">{ticket.name}</h3>
                <div className="flex items-center text-xs text-muted-foreground mb-2">
                  <MapPin className="h-3 w-3 mr-1" />
                  {ticket.routeName}
                  {ticket.type === "一日券" && (
                    <span className="ml-1">搭乘日期：{ticket.date}</span>
                  )}
                </div>
                {needsLowFloorBus && (
                  <div className="flex items-center gap-1 mt-1">
                    <Badge variant="outline" className="text-sm bg-blue-50 text-blue-700 border-blue-200">
                      <Accessibility className="h-3 w-3 mr-1" />
                      低地板公車
                    </Badge>
                  </div>
                )}
              </div>
              <div className="flex flex-col items-end">
                <Badge 
                  variant={status.variant} 
                  className={`text-xs ${status.className || ''}`}
                >
                  {status.label}
                </Badge>
              </div>
            </div>

            <div className="flex justify-between items-center mb-1 pl-4 pr-1">
              <div className="text-xs text-muted-foreground">
                <div>數量: {ticket.quantity} 張</div>
                <div>金額: NT${ticket.totalAmount}</div>
              </div>
              <div className="text-xs text-muted-foreground text-right">
                <div>購買: {ticket.purchaseDate}</div>
              </div>
            </div>
          </div>

          <div className="flex gap-2 mt-auto pt-2">
            {status.label === "已取消" ? (
              // 已取消：車票詳情（不顯示QR碼）
              <Dialog open={isTicketInfoDialogOpen} onOpenChange={setIsTicketInfoDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full h-8 text-xs bg-transparent"
                    onClick={() => handleViewTicketInfo(ticket)}
                  >
                    查看詳情
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-sm max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-center">票券資訊</DialogTitle>
                  </DialogHeader>
                  {selectedTicket && <TicketInfoDisplay ticket={selectedTicket} showQRCode={false} />}
                </DialogContent>
              </Dialog>
            ) : status.label === "已劃位" ? (
              // 已劃位：票券QR碼、修改、取消
              <>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 h-8 text-xs bg-transparent"
                      onClick={() => handleQRCodeClick(ticket)}
                    >
                      <QrCode className="h-3 w-3 mr-1" />
                      票券QR碼
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-sm max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-center">票券資訊</DialogTitle>
                    </DialogHeader>
                    {selectedTicket && <TicketInfoDisplay ticket={selectedTicket} showQRCode={true} />}
                  </DialogContent>
                </Dialog>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 h-8 text-xs bg-transparent"
                  onClick={() => handleEditTicket(ticket)}
                >
                  修改/取消 劃位
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 h-8 text-xs bg-transparent text-destructive hover:text-destructive"
                  onClick={() => {
                    setTicketToCancel(ticket)
                    setIsCancelDialogOpen(true)
                  }}
                >
                  我要取消
                </Button>
              </>
            ) : status.label === "未劃位" ? (
              // 未劃位：劃位、查看詳情、取消
              <>
                <Button
                  size="sm"
                  variant="default"
                  className="flex-1 h-8 text-xs"
                  onClick={() => handleEditTicket(ticket)}
                >
                  立即劃位
                </Button>
                <Dialog open={isTicketInfoDialogOpen} onOpenChange={setIsTicketInfoDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 h-8 text-xs bg-transparent"
                      onClick={() => handleViewTicketInfo(ticket)}
                    >
                      查看詳情
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-sm max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-center">票券資訊</DialogTitle>
                    </DialogHeader>
                    {selectedTicket && <TicketInfoDisplay ticket={selectedTicket} showQRCode={false} />}
                  </DialogContent>
                </Dialog>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 h-8 text-xs bg-transparent text-destructive hover:text-destructive"
                  onClick={() => {
                    setTicketToCancel(ticket)
                    setIsCancelDialogOpen(true)
                  }}
                >
                  我要取消
                </Button>
              </>
            ) : status.label === "已搭乘" ? (
              // 已搭乘：車票詳情（不顯示QR碼）、為此行程評分
              <>
                <Dialog open={isTicketInfoDialogOpen} onOpenChange={setIsTicketInfoDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 h-8 text-xs bg-transparent"
                      onClick={() => handleViewTicketInfo(ticket)}
                    >
                      查看詳情
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-sm max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-center">票券資訊</DialogTitle>
                    </DialogHeader>
                    {selectedTicket && <TicketInfoDisplay ticket={selectedTicket} showQRCode={false} />}
                  </DialogContent>
                </Dialog>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 h-8 text-xs bg-accent"
                  onClick={() => handleRatingClick(ticket)}
                >
                  <Star className="h-3 w-3 mr-1" />
                  為此行程評分
                </Button>
              </>
            ) : (
              // 其他狀態（如已失效）
              <Dialog open={isTicketInfoDialogOpen} onOpenChange={setIsTicketInfoDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full h-8 text-xs bg-transparent"
                    onClick={() => handleViewTicketInfo(ticket)}
                  >
                    查看詳情
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-sm max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-center">票券資訊</DialogTitle>
                  </DialogHeader>
                  {selectedTicket && <TicketInfoDisplay ticket={selectedTicket} showQRCode={false} />}
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">載入中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <HeaderWithMenu />

      <div className="flex flex-1 flex-col pt-[60px] xl:pt-[80px]">
        <header className="bg-primary px-4 sm:px-6 lg:px-8 py-4 -mt-[60px] xl:-mt-[80px]">
          <div className="max-w-6xl mx-auto flex items-center">
            <PageBackLink
              onClick={() => router.back()}
              className="text-primary-foreground focus-visible:ring-white/80"
              ariaLabel="返回上一頁"
            />
            <h1 className="flex-1 font-bold text-xl text-primary-foreground text-center">我的車票</h1>
          </div>
        </header>

        <div className="flex-1 py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-6">
              <TicketStatusFilter selectedStatus={selectedStatus} onStatusChange={setSelectedStatus} />
            </div>
        {filteredTickets.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <QrCode className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">
              {tickets.length === 0 ? "尚無車票" : `尚無「${selectedStatus}」的車票`}
            </h3>
            <p className="text-muted-foreground text-sm mb-6">
              {tickets.length === 0
                ? "購買票券後，您的車票將顯示在這裡"
                : "請選擇其他狀態查看車票"}
            </p>
            {tickets.length === 0 && (
              <Button
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={() => router.push("/purchase/tickets")}
              >
                立即購票
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className={`${isMobile ? "space-y-3" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"}`}>
              {filteredTickets.map((ticket) => (
                <TicketCard key={ticket.id} ticket={ticket} />
              ))}
            </div>
          </>
        )}
          </div>
        </div>

        {/* Bottom Button - Sticky */}
        {tickets.length > 0 && (
          <div className="sticky bottom-0 z-40 bg-background/95 backdrop-blur-sm border-t">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <Button
                size="lg"
                className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl"
                onClick={() => router.push("/purchase/tickets")}
              >
                購買更多票券
              </Button>
            </div>
          </div>
        )}

        {isMobile && <MobileNavigation activeTab="my-tickets" />}
      </div>

      {RatingDialog()}

      <AlertDialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>確定要取消這張票券嗎？</AlertDialogTitle>
            <AlertDialogDescription>
              取消後將退款<strong>NT${ticketToCancel?.totalAmount || 0}</strong>。<br />
              此操作無法復原，是否確認取消？
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>返回</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancelTicket} className="bg-destructive hover:bg-destructive/90">
              確認取消
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
