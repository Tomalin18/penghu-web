"use client"

import { useState } from "react"
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Users,
  Minus,
  Plus,
  ChevronRightIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

export default function WebTicketInfoPage() {
  const [selectedDates, setSelectedDates] = useState<Record<string, Date | undefined>>({})
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [dateSelectionCollapsed, setDateSelectionCollapsed] = useState(false)

  const [ticketQuantities, setTicketQuantities] = useState({
    adult: 0,
    discount: 0,
    senior: 0,
    love: 0,
    child: 0,
  })
  const [drawerOpen, setDrawerOpen] = useState(false)

  const [pickupLocations, setPickupLocations] = useState<Record<string, Record<string, string>>>({})
  const [formData, setFormData] = useState<
    Array<{
      ticketType: string
      name: string
      email: string
      phone: string
      countryCode: string
      id: string
      ticketSerial: string
      needsAccessibility: string
      sameAsPassenger1: boolean
    }>
  >([])
  const [termsAccepted, setTermsAccepted] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  const ticketId = searchParams.get("ticketId") || ""
  const channel = searchParams.get("channel") || ""
  const ticketTypeParam = searchParams.get("ticketType") || ""

  const routes = [
    {
      id: "north",
      name: "北環線",
      color: "bg-[#6FA650]",
      primaryColor: "#6FA650",
      secondaryColor: "#EAF4EE",
      alertColor: "#598348",
    },
    {
      id: "south",
      name: "澎南線",
      color: "bg-[#D96B3E]",
      primaryColor: "#D96B3E",
      secondaryColor: "#FFFBE4",
      alertColor: "#C66239",
    },
    {
      id: "xihu",
      name: "湖西線",
      color: "bg-[#63A0B5]",
      primaryColor: "#63A0B5",
      secondaryColor: "#E8F5FC",
      alertColor: "#3D8098",
    },
  ]

  const getTicketRoutes = (ticketId: string): string[] => {
    if (ticketId.includes("north-xihu")) {
      return ["north", "xihu"]
    } else if (ticketId.includes("north-south")) {
      return ["north", "south"]
    } else if (ticketId.includes("xihu-south")) {
      return ["xihu", "south"]
    } else if (ticketId.includes("penghu-3")) {
      return ["north", "xihu", "south"]
    } else if (ticketId.includes("north") || ticketId === "magong-north-1") {
      return ["north"]
    } else if (ticketId.includes("xihu") || ticketId === "magong-xihu-1") {
      return ["xihu"]
    } else if (ticketId.includes("south") || ticketId === "magong-south-1") {
      return ["south"]
    }
    return ["north"]
  }

  const getTicketInfo = (ticketId: string) => {
    const ticketData: Record<string, any> = {
      "magong-north-1": {
        name: "媽宮・北環線 一日券",
        price: "NT$ 150起",
        type: "一日券",
        image: "/images/ticket-north-ring-premium.png",
      },
      "magong-xihu-1": {
        name: "媽宮・湖西線 一日券",
        price: "NT$ 125起",
        type: "一日券",
        image: "/images/ticket-xihu.png",
      },
      "magong-south-1": {
        name: "媽宮・澎南線 一日券",
        price: "NT$ 100起",
        type: "一日券",
        image: "/images/ticket-south-premium.png",
      },
      "north-xihu-2": {
        name: "台灣好行 二日券 北環・湖西線",
        price: "NT$ 250起",
        type: "二日券",
        image: "/images/ticket-north-xihu-2day.png",
      },
      "north-south-2": {
        name: "台灣好行 二日券 北環・澎南線",
        price: "NT$ 225起",
        type: "二日券",
        image: "/images/ticket-north-south-2day.png",
      },
      "xihu-south-2": {
        name: "台灣好行 二日券 湖西・澎南線",
        price: "NT$ 200起",
        type: "二日券",
        image: "/images/ticket-xihu-south-2day.png",
      },
      "penghu-3-600": {
        name: "台灣好行 三日券 北環・湖西・澎南線",
        price: "NT$ 600起",
        type: "三日券",
        image: "/images/ticket-3day-600.png",
      },
      "penghu-3-300": {
        name: "台灣好行 三日券 北環・湖西・澎南線",
        price: "NT$ 300起",
        type: "三日券",
        image: "/images/ticket-3day-300.png",
      },
    }

    return (
      ticketData[ticketId] || {
        name: "媽宮・北環線 一日券",
        price: "NT$ 150起",
        type: "一日券",
        image: "/images/ticket-north-ring-premium.png",
      }
    )
  }

  const getRouteStations = (routeId: string) => {
    const stationsByRoute = {
      north: [
        { value: "", label: "請選擇上車地點" },
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
        { value: "", label: "請選擇上車地點" },
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
        { value: "", label: "請選擇上車地點" },
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
    return stationsByRoute[routeId as keyof typeof stationsByRoute] || []
  }

  const selectedTicket = getTicketInfo(ticketId)
  const ticketRoutes = getTicketRoutes(ticketId)

  const getTicketAvailability = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0]
    const seed = dateStr.split("-").reduce((acc, val) => acc + Number.parseInt(val), 0)
    const seededRandom = (seed * 9301 + 49297) % 233280
    const count = Math.floor((seededRandom / 233280) * 27)

    let status: "available" | "limited" | "soldout"
    if (count === 0) {
      status = "soldout"
    } else if (count < 5) {
      status = "limited"
    } else {
      status = "available"
    }

    return { status, count }
  }

  const CustomCalendar = ({
    routeId,
    routeInfo,
    disabled,
  }: { routeId: string; routeInfo: any; disabled?: boolean }) => {
    const today = new Date()
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()

    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const calendarDays = []

    for (let i = 0; i < startingDayOfWeek; i++) {
      calendarDays.push(null)
    }

    for (let day = 1; day <= daysInMonth; day++) {
      calendarDays.push(new Date(year, month, day))
    }

    const monthNames = [
      "一月",
      "二月",
      "三月",
      "四月",
      "五月",
      "六月",
      "七月",
      "八月",
      "九月",
      "十月",
      "十一月",
      "十二月",
    ]

    const dayNames = ["日", "一", "二", "三", "四", "五", "六"]

    const goToPreviousMonth = () => {
      if (disabled) return
      setCurrentMonth(new Date(year, month - 1, 1))
    }

    const goToNextMonth = () => {
      if (disabled) return
      setCurrentMonth(new Date(year, month + 1, 1))
    }

    const handleDateClick = (date: Date) => {
      if (disabled) return

      const availability = getTicketAvailability(date)
      const isPastDate = date < today

      if (!isPastDate && availability.status !== "soldout") {
        setSelectedDates((prev) => ({
          ...prev,
          [routeId]: date,
        }))
      }
    }

    const isDateSelected = (date: Date) => {
      const selectedDate = selectedDates[routeId]
      return (
        selectedDate &&
        date.getDate() === selectedDate.getDate() &&
        date.getMonth() === selectedDate.getMonth() &&
        date.getFullYear() === selectedDate.getFullYear()
      )
    }

    return (
      <div className={`w-full ${disabled ? "opacity-50 pointer-events-none" : ""}`}>
        <div className="flex items-center space-x-2 mb-3">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: routeInfo.primaryColor }} />
          <h4 className="font-medium text-foreground">{routeInfo.name}</h4>
          <span className="text-xs text-muted-foreground">選擇使用日期</span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="icon" onClick={goToPreviousMonth} disabled={disabled}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h3 className="font-semibold text-lg">
            {monthNames[month]} {year}
          </h3>
          <Button variant="ghost" size="icon" onClick={goToNextMonth} disabled={disabled}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-2">
          {dayNames.map((dayName) => (
            <div key={dayName} className="text-center text-sm font-medium text-muted-foreground py-2">
              {dayName}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((date, index) => {
            if (!date) {
              return <div key={index} className="h-20"></div>
            }

            const availability = getTicketAvailability(date)
            const isPastDate = date < today
            const isSoldOut = availability.status === "soldout"
            const isSelected = isDateSelected(date)
            const isToday = date.toDateString() === today.toDateString()

            return (
              <button
                key={index}
                onClick={() => handleDateClick(date)}
                disabled={isPastDate || isSoldOut || disabled}
                className={`
                  h-20 border rounded-lg flex flex-col items-center justify-center p-1 transition-colors
                  ${
                    isSelected
                      ? `border-2 text-white`
                      : isToday
                        ? "bg-primary/10 border-primary text-primary"
                        : "bg-background border-border hover:bg-muted"
                  }
                  ${isPastDate || isSoldOut || disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                `}
                style={
                  isSelected
                    ? {
                        backgroundColor: routeInfo.primaryColor,
                        borderColor: routeInfo.primaryColor,
                      }
                    : {}
                }
              >
                <span className={`text-[10px] font-medium leading-tight ${isSelected ? "text-white" : ""}`}>{date.getDate()}</span>

                <div className="mt-0.5">
                  {isSoldOut ? (
                    <span className="text-[9px] font-medium text-red-600 bg-red-100 py-0.5 rounded px-0.5 leading-none whitespace-nowrap">售完</span>
                  ) : (
                    <span
                      className={`text-[9px] font-bold py-0.5 rounded px-0.5 leading-none whitespace-nowrap ${
                        availability.count < 5
                          ? "text-red-700 bg-red-100"
                          : availability.count <= 10
                            ? "text-yellow-700 bg-yellow-100"
                            : "text-green-700 bg-green-100"
                      } ${isSelected ? "bg-white/20 text-white" : ""}`}
                    >
                      {availability.count}位
                    </span>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  const handleTicketQuantityChange = (type: keyof typeof ticketQuantities, delta: number) => {
    setTicketQuantities((prev) => {
      const newValue = Math.max(0, Math.min(26, prev[type] + delta))
      return { ...prev, [type]: newValue }
    })
  }

  const handleDrawerComplete = () => {
    const totalCount = Object.values(ticketQuantities).reduce((sum, count) => sum + count, 0)

    if (totalCount > 0) {
      const initialData: typeof formData = []
      const initialLocations: Record<string, Record<string, string>> = {}

      let passengerIndex = 0

      Object.entries(ticketQuantities).forEach(([ticketType, count]) => {
        for (let i = 0; i < count; i++) {
          initialData.push({
            ticketType,
            name: "",
            email: "",
            phone: "",
            countryCode: "+886",
            id: "",
            ticketSerial: "",
            needsAccessibility: "no",
            sameAsPassenger1: false,
          })

          initialLocations[passengerIndex.toString()] = {}
          ticketRoutes.forEach((routeId) => {
            initialLocations[passengerIndex.toString()][routeId] = ""
          })

          passengerIndex++
        }
      })

      setFormData(initialData)
      setPickupLocations(initialLocations)
    } else {
      setFormData([])
      setPickupLocations({})
    }

    setDrawerOpen(false)
  }

  const getTicketSummary = () => {
    const ticketLabels = {
      adult: "全票",
      discount: "澎湖籍",
      senior: "長者",
      love: "愛心",
      child: "兒童",
    }

    return Object.entries(ticketQuantities)
      .filter(([_, count]) => count > 0)
      .map(([type, count]) => `${ticketLabels[type as keyof typeof ticketLabels]}*${count}`)
      .join(", ")
  }

  const getTicketTypeLabel = (ticketType: string) => {
    const labels: Record<string, string> = {
      adult: "全票（非澎湖籍）",
      discount: "澎湖籍居民票",
      senior: "長者票",
      love: "愛心票",
      child: "兒童票",
    }
    return labels[ticketType] || ticketType
  }

  const getStationLabel = (routeId: string, stationId: string) => {
    if (!stationId) return "未選擇"
    const stations = getRouteStations(routeId)
    const station = stations.find((s) => s.value === stationId)
    return station ? station.label : stationId
  }

  const handleInputChange = (passengerIndex: number, field: string, value: string | boolean) => {
    setFormData((prev) => {
      const newData = [...prev]
      newData[passengerIndex] = { ...newData[passengerIndex], [field]: value }
      return newData
    })
  }

  const handleSameAsPassenger1 = (index: number, checked: boolean) => {
    setFormData((prev) => {
      const newData = [...prev]
      newData[index] = {
        ...newData[index],
        sameAsPassenger1: checked,
        ...(checked && prev[0]
          ? {
              name: prev[0].name,
              email: prev[0].email,
              phone: prev[0].phone,
              countryCode: prev[0].countryCode,
              id: prev[0].id,
              ticketSerial: prev[0].ticketSerial,
              needsAccessibility: prev[0].needsAccessibility,
            }
          : {}),
      }
      return newData
    })

    if (checked && pickupLocations["0"]) {
      setPickupLocations((prev) => {
        const newLocations = { ...prev }
        newLocations[index.toString()] = { ...prev["0"] }
        return newLocations
      })
    }
  }

  const handlePickupLocationChange = (passengerIndex: number, routeId: string, value: string) => {
    setPickupLocations((prev) => {
      const newLocations = { ...prev }
      if (!newLocations[passengerIndex.toString()]) {
        newLocations[passengerIndex.toString()] = {}
      }
      newLocations[passengerIndex.toString()][routeId] = value
      return newLocations
    })
  }

  const isFormValid = () => {
    if (passengerCount === 0) return false

    const allDatesSelected = ticketRoutes.every((routeId) => selectedDates[routeId])

    const allPickupLocationsFilled = Array.from({ length: passengerCount }, (_, i) => i).every((passengerIndex) =>
      ticketRoutes.every(
        (routeId) =>
          pickupLocations[passengerIndex.toString()]?.[routeId] &&
          pickupLocations[passengerIndex.toString()][routeId] !== "",
      ),
    )

    const allPassengerDataFilled = formData.every(
      (passenger) => passenger.ticketType && passenger.name && passenger.phone && passenger.ticketSerial,
    )

    return allDatesSelected && allPickupLocationsFilled && allPassengerDataFilled && termsAccepted
  }

  const handleNext = () => {
    if (isFormValid()) {
      const reservationData = {
        ticketInfo: selectedTicket,
        ticketId,
        channel,
        ticketType: ticketTypeParam,
        routes: ticketRoutes.map((routeId) => {
          const routeInfo = routes.find((r) => r.id === routeId)
          return {
            id: routeId,
            name: routeInfo?.name || "",
            date: selectedDates[routeId],
          }
        }),
        passengers: formData.map((passenger, index) => ({
          ...passenger,
          pickupLocations: pickupLocations[index.toString()],
        })),
        totalPassengers: passengerCount,
        ticketQuantities,
      }

      localStorage.setItem("reservationData", JSON.stringify(reservationData))
      router.push("/reservation/success")
    }
  }

  const ticketTypeOptions = [
    { value: "adult", label: "全票（非澎湖籍）", description: "一般成人票" },
    { value: "discount", label: "澎湖籍居民票", description: "設籍澎湖縣之居民" },
    { value: "senior", label: "長者票", description: "65歲以上長者" },
    { value: "love", label: "愛心票", description: "持身心障礙證明者及必要陪伴者" },
    { value: "child", label: "兒童票", description: "6-11歲兒童" },
  ]

  const passengerCount = Object.values(ticketQuantities).reduce((sum, count) => sum + count, 0)
  const allDatesSelected = ticketRoutes.every((routeId) => selectedDates[routeId])

  return (
    <div className="min-h-screen bg-background flex flex-col">
      
      <header className="bg-primary px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-6xl mx-auto flex items-center">
          <Link
            href={`/reservation?channel=${channel}&ticketType=${ticketTypeParam}&route=${ticketId}`}
            className="text-primary-foreground"
          >
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="flex-1 font-bold text-xl text-primary-foreground text-center">劃位 - 填寫資料</h1>
        </div>
      </header>

      <div className="flex-1 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Main Form (2 columns on desktop) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Selected Ticket */}
              <div>
                <h2 className="font-semibold text-xl text-foreground mb-4">已選擇票券</h2>
                <Card className="shadow-sm border border-border bg-card">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={selectedTicket.image || "/placeholder.svg"}
                            alt={selectedTicket.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-primary">{selectedTicket.name}</h3>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">{selectedTicket.price}</p>
                        <p className="text-sm text-muted-foreground">{selectedTicket.type}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Passenger Count */}
              <div>
                <h2 className="font-semibold text-xl text-foreground mb-4">搭乘人數</h2>
                <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
                  <DrawerTrigger asChild>
                    <Card className="shadow-sm cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Users className="h-6 w-6 text-muted-foreground" />
                            <div>
                              <div className="text-sm text-muted-foreground">乘客人數</div>
                              <div className="font-medium text-lg text-foreground">
                                {passengerCount > 0 ? getTicketSummary() : "請選擇票種"}
                              </div>
                            </div>
                          </div>
                          <ChevronRightIcon className="h-5 w-5 text-muted-foreground" />
                        </div>
                      </CardContent>
                    </Card>
                  </DrawerTrigger>
                  <DrawerContent>
                    <DrawerHeader>
                      <DrawerTitle>選擇乘客人數</DrawerTitle>
                      <DrawerDescription>請選擇各票種的數量</DrawerDescription>
                    </DrawerHeader>
                    <div className="px-4 py-2 space-y-2 max-h-[60vh] overflow-y-auto">
                      {ticketTypeOptions.map((type) => (
                        <div key={type.value} className="flex items-center justify-between py-3 border-b last:border-b-0">
                          <div className="flex-1">
                            <div className="font-medium text-foreground">{type.label}</div>
                            <div className="text-sm text-muted-foreground">{type.description}</div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 rounded-full bg-transparent"
                              onClick={() => handleTicketQuantityChange(type.value as keyof typeof ticketQuantities, -1)}
                              disabled={ticketQuantities[type.value as keyof typeof ticketQuantities] === 0}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center font-medium text-lg">
                              {ticketQuantities[type.value as keyof typeof ticketQuantities]}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 rounded-full bg-transparent"
                              onClick={() => handleTicketQuantityChange(type.value as keyof typeof ticketQuantities, 1)}
                              disabled={passengerCount >= 26}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <DrawerFooter>
                      <Button
                        onClick={handleDrawerComplete}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                        disabled={passengerCount === 0}
                      >
                        完成
                      </Button>
                    </DrawerFooter>
                  </DrawerContent>
                </Drawer>
              </div>

              {/* Date Selection */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <h2 className="font-semibold text-xl text-foreground">選擇日期</h2>
                    <span className="text-xs text-red-500">日期下方數字表示尚有空位數</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDateSelectionCollapsed(!dateSelectionCollapsed)}
                    className="text-muted-foreground"
                    disabled={passengerCount === 0}
                  >
                    {dateSelectionCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                    {allDatesSelected && dateSelectionCollapsed ? "已完成" : ""}
                  </Button>
                </div>

                {passengerCount === 0 && (
                  <div className="text-center py-4 text-muted-foreground text-sm">請先選擇搭乘人數</div>
                )}

                {!dateSelectionCollapsed && passengerCount > 0 && (
                  <div className={`grid grid-cols-1 ${ticketRoutes.length > 1 ? "lg:grid-cols-2" : ""} gap-4`}>
                    {ticketRoutes.map((routeId) => {
                      const routeInfo = routes.find((r) => r.id === routeId)
                      if (!routeInfo) return null

                      return (
                        <Card key={routeId} className="shadow-sm border border-border bg-card">
                          <CardContent className="p-6">
                            <CustomCalendar routeId={routeId} routeInfo={routeInfo} disabled={passengerCount === 0} />
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Passenger Forms */}
              {passengerCount > 0 && (
                <div>
                  <h2 className="font-semibold text-xl text-foreground mb-4">乘客資料</h2>
                  <div className="space-y-6">
                    {Array.from({ length: passengerCount }, (_, index) => (
                      <Card key={index} className="shadow-sm">
                        <CardContent className="p-6 space-y-4">
                          <div className="flex items-center justify-between border-b pb-3">
                            <h3 className="font-medium text-lg text-foreground">
                              {passengerCount > 1 ? `乘客 ${index + 1}` : "乘客資料"}
                            </h3>
                            {index > 0 && (
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id={`same-as-passenger-1-${index}`}
                                  checked={formData[index]?.sameAsPassenger1 || false}
                                  onCheckedChange={(checked) => handleSameAsPassenger1(index, checked as boolean)}
                                />
                                <Label htmlFor={`same-as-passenger-1-${index}`} className="text-sm cursor-pointer">
                                  <div>
                                    同乘客1
                                    <br />
                                    <span className="text-red-500 text-xs">一起同行可由一人代表</span>
                                  </div>
                                </Label>
                              </div>
                            )}
                          </div>

                          <div
                            className={`${index > 0 && formData[index]?.sameAsPassenger1 ? "ring-2 ring-primary/50 bg-primary/5 rounded-lg p-4" : ""}`}
                          >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor={`ticket-type-${index}`} className="text-sm font-bold text-foreground">
                                  <span className="text-red-500">*</span> 票種
                                </Label>
                                <select
                                  id={`ticket-type-${index}`}
                                  className="mt-2 w-full p-3 border-2 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                                  value={formData[index]?.ticketType || "adult"}
                                  onChange={(e) => handleInputChange(index, "ticketType", e.target.value)}
                                >
                                  {ticketTypeOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                      {option.label}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              <div>
                                <Label htmlFor={`ticket-serial-${index}`} className="text-sm font-bold text-foreground">
                                  <span className="text-red-500">*</span> 票券序號
                                </Label>
                                <Input
                                  id={`ticket-serial-${index}`}
                                  placeholder="請輸入票券序號"
                                  className="mt-2 border-2 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary placeholder:text-muted-foreground/40 transition-colors"
                                  value={formData[index]?.ticketSerial || ""}
                                  onChange={(e) => handleInputChange(index, "ticketSerial", e.target.value)}
                                />
                                <div className="mt-1">
                                  <a
                                    href="https://www.penghufuneasy.com.tw/penghufuneasy/index.php?action=ticket_rules"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-red-500 text-sm underline hover:text-red-600"
                                  >
                                    各通路票券序號規則
                                  </a>
                                </div>
                              </div>
                            </div>

                            {ticketRoutes.map((routeId) => {
                              const routeInfo = routes.find((r) => r.id === routeId)
                              const routeStations = getRouteStations(routeId)
                              if (!routeInfo) return null

                              const selectedDate = selectedDates[routeId]
                              const formattedDate = selectedDate
                                ? `${selectedDate.getFullYear()}/${String(selectedDate.getMonth() + 1).padStart(2, "0")}/${String(selectedDate.getDate()).padStart(2, "0")}`
                                : ""

                              return (
                                <div key={routeId} className="mt-4">
                                  <Label className="text-sm font-bold text-foreground flex items-center space-x-2">
                                    <span className="text-red-500">*</span>
                                    <div
                                      className="w-3 h-3 rounded-full"
                                      style={{ backgroundColor: routeInfo.primaryColor }}
                                    />
                                    <span>{routeInfo.name} 上車地點</span>
                                    {formattedDate && (
                                      <span className="text-xs text-muted-foreground font-normal">
                                        已選擇日期：{formattedDate}
                                      </span>
                                    )}
                                  </Label>
                                  <select
                                    className="mt-2 w-full p-3 border-2 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                                    value={pickupLocations[index.toString()]?.[routeId] || ""}
                                    onChange={(e) => handlePickupLocationChange(index, routeId, e.target.value)}
                                  >
                                    {routeStations.map((option) => (
                                      <option key={option.value} value={option.value}>
                                        {option.label}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              )
                            })}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                              <div>
                                <Label htmlFor={`name-${index}`} className="text-sm font-bold text-foreground">
                                  <span className="text-red-500">*</span> 姓名
                                </Label>
                                <Input
                                  id={`name-${index}`}
                                  placeholder="請輸入姓名"
                                  className="mt-2 border-2 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary placeholder:text-muted-foreground/40 transition-colors"
                                  value={formData[index]?.name || ""}
                                  onChange={(e) => handleInputChange(index, "name", e.target.value)}
                                />
                              </div>

                              <div>
                                <Label htmlFor={`phone-${index}`} className="text-sm font-bold text-foreground">
                                  <span className="text-red-500">*</span> 手機號碼
                                </Label>
                                <div className="flex gap-2 mt-2">
                                  <select
                                    value={formData[index]?.countryCode || "+886"}
                                    onChange={(e) => handleInputChange(index, "countryCode", e.target.value)}
                                    className="w-32 h-11 px-3 border-2 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                                  >
                                    <option value="+886">🇹🇼 +886</option>
                                    <option value="+86">🇨🇳 +86</option>
                                    <option value="+852">🇭🇰 +852</option>
                                    <option value="+853">🇲🇴 +853</option>
                                    <option value="+65">🇸🇬 +65</option>
                                    <option value="+60">🇲🇾 +60</option>
                                    <option value="+81">🇯🇵 +81</option>
                                    <option value="+82">🇰🇷 +82</option>
                                    <option value="+1">🇺🇸 +1</option>
                                    <option value="+44">🇬🇧 +44</option>
                                  </select>
                                  <Input
                                    id={`phone-${index}`}
                                    placeholder="請輸入手機號碼"
                                    className="flex-1 border-2 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary placeholder:text-muted-foreground/40 transition-colors"
                                    value={formData[index]?.phone || ""}
                                    onChange={(e) => handleInputChange(index, "phone", e.target.value)}
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                              <div>
                                <Label htmlFor={`email-${index}`} className="text-sm font-bold text-foreground">
                                  Email
                                </Label>
                                <Input
                                  id={`email-${index}`}
                                  type="email"
                                  placeholder="請輸入電子郵件"
                                  className="mt-2 border-2 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary placeholder:text-muted-foreground/40 transition-colors"
                                  value={formData[index]?.email || ""}
                                  onChange={(e) => handleInputChange(index, "email", e.target.value)}
                                />
                              </div>

                              <div>
                                <Label htmlFor={`id-${index}`} className="text-sm font-bold text-foreground">
                                  身分證/護照號碼
                                </Label>
                                <Input
                                  id={`id-${index}`}
                                  placeholder="請輸入身分證或護照號碼"
                                  className="mt-2 border-2 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary placeholder:text-muted-foreground/40 transition-colors"
                                  value={formData[index]?.id || ""}
                                  onChange={(e) => handleInputChange(index, "id", e.target.value)}
                                />
                              </div>
                            </div>

                            <div className="mt-4">
                              <Label className="text-sm font-bold text-foreground">
                                <span className="text-red-500">*</span> 是否需要低地板公車
                              </Label>
                              <p className="text-xs text-red-500 mt-1">▲行動不便及使用輪椅者、孕婦、娃娃車的乘客請選擇"是"</p>
                              <div className="mt-2 flex space-x-4">
                                <label className="flex items-center space-x-2 cursor-pointer">
                                  <input
                                    type="radio"
                                    name={`lowFloor-${index}`}
                                    value="yes"
                                    className="w-5 h-5 text-primary bg-white border-2 border-gray-600 focus:ring-2 focus:ring-primary cursor-pointer"
                                    checked={formData[index]?.needsAccessibility === "yes"}
                                    onChange={(e) => handleInputChange(index, "needsAccessibility", e.target.value)}
                                  />
                                  <span className="text-foreground">是</span>
                                </label>
                                <label className="flex items-center space-x-2 cursor-pointer">
                                  <input
                                    type="radio"
                                    name={`lowFloor-${index}`}
                                    value="no"
                                    className="w-5 h-5 text-primary bg-white border-2 border-gray-600 focus:ring-2 focus:ring-primary cursor-pointer"
                                    checked={formData[index]?.needsAccessibility === "no"}
                                    onChange={(e) => handleInputChange(index, "needsAccessibility", e.target.value)}
                                  />
                                  <span className="text-foreground">否</span>
                                </label>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Terms */}
              {passengerCount > 0 && (
                <div className="pb-8">
                  <div className="flex items-start space-x-3 p-4 bg-muted/30 rounded-lg border">
                    <input
                      type="checkbox"
                      id="terms"
                      className="mt-1 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary cursor-pointer"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                    />
                    <label htmlFor="terms" className="text-sm text-foreground cursor-pointer leading-relaxed">
                      我已閱讀並同意
                      <button
                        type="button"
                        className="text-primary underline hover:text-primary/80 transition-colors mx-1"
                        onClick={(e) => {
                          e.preventDefault()
                          console.log("[v0] Terms link clicked")
                        }}
                      >
                        劃位條款
                      </button>
                      <span className="text-red-500">*</span>
                    </label>
                  </div>
                </div>
              )}

            </div>

            {/* Right: Summary Sidebar */}
            {passengerCount > 0 && (
              <div className="lg:col-span-1">
                <div className="sticky top-8">
                  <Card className="shadow-sm border border-border bg-card">
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-lg text-foreground mb-4">劃位摘要</h3>
                      <div className="space-y-3">
                        <div>
                          <div className="text-sm text-muted-foreground mb-2">已選擇票券</div>
                          <div className="font-medium text-foreground">{selectedTicket.name}</div>
                          <div className="text-sm text-muted-foreground">{selectedTicket.type}</div>
                        </div>

                        <div>
                          <div className="text-sm text-muted-foreground mb-2">購買通路</div>
                          <div className="font-medium text-foreground">{channel}</div>
                        </div>

                        <div>
                          <div className="text-sm text-muted-foreground mb-2">路線日期</div>
                          <div className="space-y-1">
                            {Object.entries(selectedDates).map(([routeId, date]) => {
                              const routeInfo = routes.find((r) => r.id === routeId)
                              if (!date || !routeInfo) return null
                              const formattedDate = `${String(date.getFullYear())}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}`
                              return (
                                <div key={routeId} className="text-sm text-foreground">
                                  {routeInfo.name}: {formattedDate}
                                </div>
                              )
                            })}
                          </div>
                        </div>

                        <div>
                          <div className="text-sm text-muted-foreground mb-2">乘客人數</div>
                          <div className="font-medium text-foreground">{passengerCount} 人</div>
                        </div>

                        {/* 乘客資訊 */}
                        {formData.length > 0 && (
                          <div className="border-t pt-3 mt-3">
                            <div className="text-sm text-muted-foreground mb-3">乘客資訊</div>
                            <div className="space-y-3 max-h-[400px] overflow-y-auto">
                              {formData.map((passenger, index) => {
                                const hasData = passenger.name || passenger.ticketType || passenger.ticketSerial
                                if (!hasData) return null

                                return (
                                  <div key={index} className="bg-muted/30 p-3 rounded-lg space-y-2">
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs font-semibold text-foreground">
                                        {passengerCount > 1 ? `乘客 ${index + 1}` : "乘客資料"}
                                      </span>
                                    </div>
                                    {passenger.name && (
                                      <div className="text-xs">
                                        <span className="text-muted-foreground">姓名：</span>
                                        <span className="font-medium text-foreground ml-1">{passenger.name}</span>
                                      </div>
                                    )}
                                    {passenger.ticketType && (
                                      <div className="text-xs">
                                        <span className="text-muted-foreground">票種：</span>
                                        <span className="font-medium text-foreground ml-1">
                                          {getTicketTypeLabel(passenger.ticketType)}
                                        </span>
                                      </div>
                                    )}
                                    {passenger.ticketSerial && (
                                      <div className="text-xs">
                                        <span className="text-muted-foreground">票券序號：</span>
                                        <span className="font-medium text-foreground ml-1">{passenger.ticketSerial}</span>
                                      </div>
                                    )}
                                    {pickupLocations[index.toString()] && (
                                      <div className="text-xs">
                                        <span className="text-muted-foreground">上車地點：</span>
                                        <div className="mt-1 space-y-1">
                                          {ticketRoutes.map((routeId) => {
                                            const stationId = pickupLocations[index.toString()]?.[routeId]
                                            const routeInfo = routes.find((r) => r.id === routeId)
                                            if (!stationId || !routeInfo) return null
                                            return (
                                              <div key={routeId} className="font-medium text-foreground">
                                                {routeInfo.name}: {getStationLabel(routeId, stationId)}
                                              </div>
                                            )
                                          })}
                                        </div>
                                      </div>
                                    )}
                                    {passenger.email && (
                                      <div className="text-xs">
                                        <span className="text-muted-foreground">Email：</span>
                                        <span className="font-medium text-foreground ml-1">{passenger.email}</span>
                                      </div>
                                    )}
                                    {passenger.phone && (
                                      <div className="text-xs">
                                        <span className="text-muted-foreground">電話：</span>
                                        <span className="font-medium text-foreground ml-1">
                                          {passenger.countryCode ? `${passenger.countryCode} ${passenger.phone}` : passenger.phone}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Button - Sticky */}
      {passengerCount > 0 && (
        <div className="sticky bottom-0 z-40 bg-background/95 backdrop-blur-sm border-t">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Button
              className={`w-full h-12 rounded-xl font-medium text-lg transition-all duration-200 ${
                isFormValid()
                  ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed opacity-60"
              }`}
              onClick={handleNext}
              disabled={!isFormValid()}
            >
              {(() => {
                const datesMissing = !ticketRoutes.every((routeId) => selectedDates[routeId])
                const pickupMissing = !Array.from({ length: passengerCount }, (_, i) => i).every((passengerIndex) =>
                  ticketRoutes.every(
                    (routeId) =>
                      pickupLocations[passengerIndex.toString()]?.[routeId] &&
                      pickupLocations[passengerIndex.toString()][routeId] !== "",
                  ),
                )
                const dataMissing = !formData.every(
                  (passenger) => passenger.ticketType && passenger.name && passenger.phone && passenger.ticketSerial,
                )
                const termsMissing = !termsAccepted

                if (datesMissing) return "請選擇使用日期"
                if (pickupMissing) return "請選擇上車地點"
                if (dataMissing) return "請完成乘客資料"
                if (termsMissing) return "請同意劃位條款"
                return "確認劃位"
              })()}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

