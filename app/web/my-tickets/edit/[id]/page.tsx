"use client"

import { useState } from "react"
import { ArrowLeft, ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DesktopNavigation } from "@/components/desktop-navigation"
import { useIsMobile } from "@/hooks/use-mobile"
import Link from "next/link"
import { useRouter, useParams, useSearchParams } from "next/navigation"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function WebEditReservationPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const isMobile = useIsMobile()
  const ticketId = params.id as string

  const ticketDataFromUrl = {
    ticketType: searchParams.get("ticketType") || "adult",
    ticketSerial: searchParams.get("ticketSerial") || "",
    routeId: searchParams.get("routeId") || "north",
    ticketName: searchParams.get("ticketName") || "",
    ticketImage: searchParams.get("ticketImage") || "",
    date: searchParams.get("date") || "",
    pickupLocation: searchParams.get("pickupLocation") || "",
    name: searchParams.get("name") || "",
    phone: searchParams.get("phone") || "",
    email: searchParams.get("email") || "",
    id: searchParams.get("id") || "",
    needsAccessibility: searchParams.get("needsAccessibility") || "no",
  }

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    ticketDataFromUrl.date ? new Date(ticketDataFromUrl.date) : undefined,
  )
  const [currentMonth, setCurrentMonth] = useState(
    ticketDataFromUrl.date ? new Date(ticketDataFromUrl.date) : new Date(),
  )
  const [dateSelectionCollapsed, setDateSelectionCollapsed] = useState(!!ticketDataFromUrl.date)
  const [pickupLocation, setPickupLocation] = useState(ticketDataFromUrl.pickupLocation)
  const [seatSelectionType, setSeatSelectionType] = useState<string>("cancel")
  const [formData, setFormData] = useState({
    name: ticketDataFromUrl.name,
    email: ticketDataFromUrl.email,
    phone: ticketDataFromUrl.phone,
    countryCode: "+886",
    id: ticketDataFromUrl.id,
    needsAccessibility: ticketDataFromUrl.needsAccessibility,
  })
  const [termsAccepted, setTermsAccepted] = useState(true)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)

  // 根據票券 ID 獲取票券資訊
  const getTicketInfo = (ticketId: string) => {
    const ticketInfoMap: Record<string, any> = {
      "TK251015": {
        name: "媽宮・西湖線 一日券",
        price: "NT$ 300",
        type: "一日券",
        image: "/images/ticket-xihu.png",
      },
      "TK2D001": {
        name: "台灣好行 二日券 北環・湖西線",
        price: "NT$ 500",
        type: "二日券",
        image: "/images/ticket-north-xihu-2day.png",
      },
      "TK2D002": {
        name: "台灣好行 二日券 北環・湖西線",
        price: "NT$ 500",
        type: "二日券",
        image: "/images/ticket-north-xihu-2day.png",
      },
      "TK3D001": {
        name: "台灣好行 三日券 北環・湖西・澎南線",
        price: "NT$ 900",
        type: "三日券",
        image: "/images/ticket-3day-300.png",
      },
      "TK3D002": {
        name: "台灣好行 三日券 北環・湖西・澎南線",
        price: "NT$ 600",
        type: "三日券",
        image: "/images/ticket-3day-300.png",
      },
    }
    return ticketInfoMap[ticketId] || { 
      name: ticketDataFromUrl.ticketName || "未知票券", 
      price: "NT$ 0",
      type: "一日券",
      image: "/placeholder.svg" 
    }
  }

  const ticketInfo = getTicketInfo(ticketId)

  const [ticketData] = useState({
    ticketType: ticketDataFromUrl.ticketType,
    ticketSerial: ticketDataFromUrl.ticketSerial,
    routeId: ticketDataFromUrl.routeId,
    ticketName: ticketInfo.name,
    ticketImage: ticketInfo.image,
    price: ticketInfo.price,
    type: ticketInfo.type,
  })

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

  const routeInfo = routes.find((r) => r.id === ticketData.routeId)

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

  const routeStations = getRouteStations(ticketData.routeId)

  const ticketTypeOptions = [
    { value: "adult", label: "全票（非澎湖籍）" },
    { value: "discount", label: "澎湖籍居民票" },
    { value: "senior", label: "長者票" },
    { value: "love", label: "愛心票" },
    { value: "group", label: "團體票" },
    { value: "child", label: "兒童票" },
  ]

  const getTicketTypeLabel = (value: string) => {
    return ticketTypeOptions.find((opt) => opt.value === value)?.label || value
  }

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

  const CustomCalendar = () => {
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
      setCurrentMonth(new Date(year, month - 1, 1))
    }

    const goToNextMonth = () => {
      setCurrentMonth(new Date(year, month + 1, 1))
    }

    const handleDateClick = (date: Date) => {
      const availability = getTicketAvailability(date)
      const isPastDate = date < today

      if (!isPastDate && availability.status !== "soldout") {
        setSelectedDate(date)
      }
    }

    const isDateSelected = (date: Date) => {
      return (
        selectedDate &&
        date.getDate() === selectedDate.getDate() &&
        date.getMonth() === selectedDate.getMonth() &&
        date.getFullYear() === selectedDate.getFullYear()
      )
    }

    return (
      <div className="w-full">
        <div className="flex items-center space-x-2 mb-3">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: routeInfo?.primaryColor }} />
          <h4 className="font-medium text-foreground">{routeInfo?.name}</h4>
          <span className="text-xs text-muted-foreground">選擇使用日期</span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="icon" onClick={goToPreviousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h3 className="font-semibold text-lg">
            {monthNames[month]} {year}
          </h3>
          <Button variant="ghost" size="icon" onClick={goToNextMonth}>
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
                disabled={isPastDate || isSoldOut}
                className={`
                  h-20 border rounded-lg flex flex-col items-center justify-center p-1 transition-colors
                  ${
                    isSelected
                      ? `border-2 text-white`
                      : isToday
                        ? "bg-primary/10 border-primary text-primary"
                        : "bg-background border-border hover:bg-muted"
                  }
                  ${isPastDate || isSoldOut ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                `}
                style={
                  isSelected
                    ? {
                        backgroundColor: routeInfo?.primaryColor,
                        borderColor: routeInfo?.primaryColor,
                      }
                    : {}
                }
              >
                <span className={`text-[10px] font-medium leading-tight ${isSelected ? "text-white" : ""}`}>{date.getDate()}</span>

                <div className="mt-0.5">
                  {isSoldOut ? (
                    <span className="text-[9px] font-medium text-red-600 bg-red-100 py-0.5 rounded px-0 leading-none whitespace-nowrap">售完</span>
                  ) : (
                    <span
                      className={`text-[9px] font-bold py-0.5 rounded px-0 leading-none whitespace-nowrap ${
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

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const isFormValid = () => {
    // 如果選擇暫不劃位，只需要驗證乘客資料和條款同意
    if (seatSelectionType === "postpone") {
      return formData.name && formData.phone && termsAccepted
    }

    // 如果選擇取消劃位，需要驗證所有項目
    return selectedDate && pickupLocation && pickupLocation !== "" && formData.name && formData.phone && termsAccepted
  }

  const handleSubmit = () => {
    if (isFormValid()) {
      console.log("[v0] Submitting edited reservation:", {
        ticketId,
        selectedDate,
        pickupLocation,
        formData,
      })
      // TODO: Submit to API
      setShowSuccessDialog(true)
    }
  }

  const handleSuccessDialogClose = () => {
    setShowSuccessDialog(false)
    router.push("/web/my-tickets")
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DesktopNavigation activeTab="my-tickets" />
      
      <header className="bg-primary px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-6xl mx-auto flex items-center">
          <Link href="/web/my-tickets" className="text-primary-foreground">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="flex-1 font-bold text-xl text-primary-foreground text-center">取消劃位/修改劃位</h1>
        </div>
      </header>

      <div className="flex-1 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Main Form (2 columns on desktop) */}
            <div className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="font-semibold text-lg text-foreground mb-4">已選擇票券</h2>
            <Card className="shadow-sm border border-border bg-card">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                      <img
                        src={ticketData.ticketImage || "/placeholder.svg"}
                        alt={ticketData.ticketName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-primary">{ticketData.ticketName}</h3>
                      <p className="font-bold text-primary">{ticketData.price}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">{ticketData.type}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* 劃位選擇 Radio Group - 放在票券 card 外面 */}
            <div className="mt-4">
              <Label className="text-lg font-bold text-foreground mb-4 block">
                <span className="text-red-500">*</span> 劃位選擇
              </Label>
              <RadioGroup
                value={seatSelectionType}
                onValueChange={setSeatSelectionType}
                className="grid grid-cols-2 gap-4"
              >
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="cancel" id="cancel" className="w-6 h-6 bg-white border-2 border-gray-300" />
                  <Label htmlFor="cancel" className="text-lg font-medium text-foreground cursor-pointer">
                    修改劃位
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="postpone" id="postpone" className="w-6 h-6 bg-white border-2 border-gray-300" />
                  <Label htmlFor="postpone" className="text-lg font-medium text-foreground cursor-pointer">
                    暫不劃位
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {seatSelectionType === "cancel" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <h2 className="font-semibold text-lg text-foreground">選擇日期</h2>
                  <span className="text-xs text-red-500">日期下方數字表示尚有空位數</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDateSelectionCollapsed(!dateSelectionCollapsed)}
                  className="text-muted-foreground"
                >
                  {dateSelectionCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                  {selectedDate && dateSelectionCollapsed ? "已完成" : ""}
                </Button>
              </div>

              {!dateSelectionCollapsed && (
                <Card className="shadow-sm border border-border bg-card">
                  <CardContent className="p-4">
                    <CustomCalendar />
                  </CardContent>
                </Card>
              )}
            </div>
          )}


          <div>
            <h2 className="font-semibold text-lg text-foreground mb-4">乘客資料</h2>
              <Card className="shadow-sm">
                <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="opacity-60">
                    <Label className="text-sm font-bold text-foreground">票種（不可修改）</Label>
                    <Input
                      value={getTicketTypeLabel(ticketData.ticketType)}
                      disabled
                      className="mt-2 bg-muted cursor-not-allowed"
                    />
                  </div>

                  <div className="opacity-60">
                    <Label className="text-sm font-bold text-foreground">票券序號（不可修改）</Label>
                    <Input value={ticketData.ticketSerial} disabled className="mt-2 bg-muted cursor-not-allowed" />
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-bold text-foreground flex items-center space-x-2">
                    <span className="text-red-500">*</span>
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: routeInfo?.primaryColor }} />
                    <span>{routeInfo?.name} 上車地點</span>
                  </Label>
                  <select
                    className="mt-2 w-full p-3 border-2 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                  >
                    {routeStations.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-sm font-bold text-foreground">
                      <span className="text-red-500">*</span> 姓名
                    </Label>
                    <Input
                      id="name"
                      placeholder="請輸入姓名"
                      className="mt-2 border-2 focus:ring-2 focus:ring-primary focus:border-primary placeholder:text-muted-foreground/40 transition-colors"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-sm font-bold text-foreground">
                      <span className="text-red-500">*</span> 手機號碼
                    </Label>
                    <div className="flex gap-2 mt-2">
                      <select
                        value={formData.countryCode}
                        onChange={(e) => handleInputChange("countryCode", e.target.value)}
                        className="w-32 p-3 border-2 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
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
                        id="phone"
                        placeholder="請輸入手機號碼"
                        className="flex-1 border-2 focus:ring-2 focus:ring-primary focus:border-primary placeholder:text-muted-foreground/40 transition-colors"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email" className="text-sm font-bold text-foreground">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="請輸入電子郵件"
                      className="mt-2 border-2 focus:ring-2 focus:ring-primary focus:border-primary placeholder:text-muted-foreground/40 transition-colors"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="id" className="text-sm font-bold text-foreground">
                      身分證/護照號碼
                    </Label>
                    <Input
                      id="id"
                      placeholder="請輸入身分證或護照號碼"
                      className="mt-2 border-2 focus:ring-2 focus:ring-primary focus:border-primary placeholder:text-muted-foreground/40 transition-colors"
                      value={formData.id}
                      onChange={(e) => handleInputChange("id", e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-bold text-foreground">
                    <span className="text-red-500">*</span> 是否需要低地板公車
                  </Label>
                  <p className="text-xs text-red-500 mt-1">▲行動不便及使用輪椅者、孕婦、娃娃車的乘客請選擇"是"</p>
                  <div className="mt-2 flex space-x-4">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="lowFloor"
                        value="yes"
                        className="w-5 h-5 bg-white border-2 border-gray-600 rounded-full checked:bg-primary checked:border-primary focus:ring-2 focus:ring-primary cursor-pointer"
                        checked={formData.needsAccessibility === "yes"}
                        onChange={(e) => handleInputChange("needsAccessibility", e.target.value)}
                      />
                      <span className="text-foreground">是</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="lowFloor"
                        value="no"
                        className="w-5 h-5 bg-white border-2 border-gray-600 rounded-full checked:bg-primary checked:border-primary focus:ring-2 focus:ring-primary cursor-pointer"
                        checked={formData.needsAccessibility === "no"}
                        onChange={(e) => handleInputChange("needsAccessibility", e.target.value)}
                      />
                      <span className="text-foreground">否</span>
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="pb-8">
            <div className="flex items-start space-x-3 p-4 bg-muted/30 rounded-lg border">
              <Checkbox
                id="terms"
                checked={termsAccepted}
                onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
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

            {/* Right: Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <Card className="shadow-sm border border-border bg-card">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg text-foreground mb-4">劃位摘要</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm text-muted-foreground mb-2">票券名稱</div>
                        <div className="font-medium text-foreground">{ticketData.ticketName}</div>
                        <div className="text-sm text-muted-foreground">{ticketData.type}</div>
                      </div>
                      
                      {seatSelectionType === "cancel" && selectedDate && (
                        <div>
                          <div className="text-sm text-muted-foreground mb-2">選擇日期</div>
                          <div className="font-medium text-foreground">
                            {selectedDate.getFullYear()}/{String(selectedDate.getMonth() + 1).padStart(2, "0")}/{String(selectedDate.getDate()).padStart(2, "0")}
                          </div>
                        </div>
                      )}
                      
                      {seatSelectionType === "postpone" && (
                        <div>
                          <div className="text-sm text-muted-foreground mb-2">劃位狀態</div>
                          <div className="font-medium text-foreground">暫不劃位</div>
                        </div>
                      )}
                      
                      {pickupLocation && (
                        <div>
                          <div className="text-sm text-muted-foreground mb-2">上車地點</div>
                          <div className="font-medium text-foreground">
                            {routeStations.find(s => s.value === pickupLocation)?.label || pickupLocation}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Button - Sticky */}
      <div className="sticky bottom-0 z-40 bg-background/95 backdrop-blur-sm border-t">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button
            className={`w-full h-12 rounded-xl font-medium text-lg transition-all duration-200 ${
              isFormValid()
                ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg"
                : "bg-gray-200 text-gray-400 cursor-not-allowed opacity-60"
            }`}
            onClick={handleSubmit}
            disabled={!isFormValid()}
          >
            {(() => {
              if (seatSelectionType === "postpone") {
                if (!formData.name || !formData.phone) return "請完成乘客資料"
                if (!termsAccepted) return "請同意劃位條款"
                return "確認暫不劃位"
              }

              if (!selectedDate) return "請選擇使用日期"
              if (!pickupLocation || pickupLocation === "") return "請選擇上車地點"
              if (!formData.name || !formData.phone) return "請完成乘客資料"
              if (!termsAccepted) return "請同意劃位條款"
              return "確認修改"
            })()}
          </Button>
        </div>
      </div>

      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-xl">修改成功</AlertDialogTitle>
            <AlertDialogDescription className="text-center text-base pt-2">
              您的票券資訊已成功更新
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button onClick={handleSuccessDialogClose} className="w-full">
              確定
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}