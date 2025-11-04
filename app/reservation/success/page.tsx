"use client"

import { useEffect, useState } from "react"
import { CheckCircle, Download, MapPin, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MobileNavigation } from "@/components/mobile-navigation"
import { useRouter } from "next/navigation"
import { useIsMobile } from "@/hooks/use-mobile"

interface RouteInfo {
  id: string
  name: string
  date: Date
}

interface PassengerInfo {
  ticketType: string
  name: string
  email: string
  phone: string
  id: string
  ticketSerial: string
  needsAccessibility: string
  sameAsPassenger1: boolean
  pickupLocations: Record<string, string>
}

interface ReservationData {
  ticketInfo: {
    name: string
    price: string
    type: string
  }
  routes: RouteInfo[]
  passengers: PassengerInfo[]
  totalPassengers: number
  ticketQuantities: Record<string, number>
}

export default function WebReservationSuccessPage() {
  const router = useRouter()
  const [reservationData, setReservationData] = useState<ReservationData | null>(null)
  const isMobile = useIsMobile()

  useEffect(() => {
    const storedData = localStorage.getItem("reservationData")
    if (storedData) {
      const data = JSON.parse(storedData)
      // Convert date strings back to Date objects
      data.routes = data.routes.map((route: any) => ({
        ...route,
        date: new Date(route.date),
      }))
      setReservationData(data)
    } else {
      // If no data found, redirect back to reservation page
      router.push("/reservation")
    }
  }, [router])

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

  if (!reservationData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">載入中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      
      <header className="bg-primary px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="font-bold text-xl text-primary-foreground text-center">劃位 - 成功</h1>
        </div>
      </header>

      <div className="flex-1 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Success Message */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="h-8 w-8 md:h-12 md:w-12 text-primary-foreground" />
              </div>
              <div>
                <h2 className="font-bold text-lg md:text-xl text-foreground mb-2">劃位成功！</h2>
                <p className="text-muted-foreground">您的劃位已完成</p>
              </div>
            </div>
            <div className="flex-shrink-0">
              <Button
                variant="outline"
                className="h-12 md:h-16 px-4 flex flex-col items-center justify-center gap-0.5 py-0 bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => {
                  // TODO: Implement save to album functionality
                  alert("保存至相簿功能開發中")
                }}
              >
                <Download className="h-4 w-4 mb-1" />
                <span className="text-xs md:text-sm leading-tight">保存至相簿</span>
              </Button>
            </div>
          </div>

          {/* Ticket Cards */}
          <div className="space-y-4">
            <Card className="shadow-sm border-l-4 border-l-primary">
              <CardContent className="p-4 md:p-6">
                {/* 票券基本資訊 */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground text-sm md:text-base mb-2">
                      {reservationData.ticketInfo.name}
                    </h3>
                    {/* 顯示所有路線資訊 */}
                    <div className="space-y-1 mb-2">
                      {reservationData.routes?.map((route: any, routeIndex: number) => (
                        <div key={routeIndex} className="flex items-center text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                          <span>路線{routeIndex + 1}：{route.name} 搭乘日期：{route.date.getFullYear()}/{String(route.date.getMonth() + 1).padStart(2, "0")}/{String(route.date.getDate()).padStart(2, "0")}</span>
                        </div>
                      ))}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <div>數量: {reservationData.passengers.length} 張</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <Badge variant="default" className="text-xs">
                      已劃位
                    </Badge>
                    <div className="text-xs text-muted-foreground text-right mt-1">
                      <div>劃位: {new Date().toLocaleDateString('zh-TW')}</div>
                    </div>
                  </div>
                </div>

                {/* 票券明細 */}
                {(() => {
                  // 計算票券明細
                  const ticketBreakdown = reservationData.passengers.reduce((acc: any, passenger: any) => {
                    const ticketPrice = passenger.ticketType === "adult" ? 300 : 150 // 根據實際價格調整
                    const ticketTypeLabel = getTicketTypeLabel(passenger.ticketType)
                    
                    if (acc[passenger.ticketType]) {
                      acc[passenger.ticketType].count += 1
                      acc[passenger.ticketType].subtotal += ticketPrice
                    } else {
                      acc[passenger.ticketType] = {
                        label: ticketTypeLabel,
                        count: 1,
                        price: ticketPrice,
                        subtotal: ticketPrice,
                      }
                    }
                    return acc
                  }, {})
                  
                  const totalAmount = Object.values(ticketBreakdown).reduce((sum: number, item: any) => sum + item.subtotal, 0)
                  
                  return (
                    <div className="mb-4">
                      <h4 className="font-semibold text-xs md:text-sm text-foreground mb-2">票券明細</h4>
                      <div className="bg-muted/50 p-3 rounded-lg space-y-1">
                        {Object.entries(ticketBreakdown).map(([key, detail]: [string, any]) => (
                          <div key={key} className="flex justify-between text-xs">
                            <span className="text-muted-foreground">
                              {detail.label} x {detail.count}
                            </span>
                            <span className="font-medium">NT${detail.subtotal}</span>
                          </div>
                        ))}
                        <div className="pt-2 border-t border-border flex justify-between font-semibold text-xs">
                          <span>總計</span>
                          <span className="text-primary">NT${totalAmount}</span>
                        </div>
                      </div>
                    </div>
                  )
                })()}

                {/* 每條路線的完整資訊 */}
                {reservationData.routes.map((route: any, routeIndex: number) => (
                  <div key={routeIndex} className="mb-4 last:mb-0">
                    {/* 路線分隔線 */}
                    {routeIndex > 0 && (
                      <div className="border-t border-border my-4"></div>
                    )}
                    
                    {/* 路線標題 */}
                    <div className="flex items-center mb-3">
                      <MapPin className="h-4 w-4 mr-2 text-primary" />
                      <h4 className="font-semibold text-sm text-foreground">
                        路線{routeIndex + 1}：{route.name}
                      </h4>
                      <span className="ml-2 text-xs text-muted-foreground">
                        搭乘日期：{route.date.getFullYear()}/{String(route.date.getMonth() + 1).padStart(2, "0")}/{String(route.date.getDate()).padStart(2, "0")}
                      </span>
                    </div>

                    {/* 該路線的乘客資訊 */}
                    <div className="bg-muted/30 p-3 rounded-lg">
                      <h5 className="font-medium text-xs text-foreground mb-2">乘客資訊</h5>
                      <div className="space-y-2">
                        {reservationData.passengers.map((passenger: any, passengerIndex: number) => {
                          // 取得該乘客在當前路線的上車地點
                          const getPickupLocation = (passenger: any, currentRoute: any) => {
                            if (passenger.pickupLocations && passenger.pickupLocations[currentRoute.id]) {
                              const stationId = passenger.pickupLocations[currentRoute.id]
                              return getStationLabel(currentRoute.id, stationId)
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
                                <span className="font-medium">{getPickupLocation(passenger, route)}</span>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 items-center mb-1">
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
                  </div>
                ))}

                <div className="flex gap-2 mt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 h-8 md:h-10 text-xs md:text-sm bg-transparent"
                    onClick={() => router.push("/my-tickets")}
                  >
                    <Calendar className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                    我的車票
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {isMobile && <MobileNavigation activeTab="reservation" />}
    </div>
  )
}

