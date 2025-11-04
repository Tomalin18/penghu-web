"use client"

import { useEffect, useState } from "react"
import { CheckCircle, Download, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useSearchParams, useRouter } from "next/navigation"
import { saveTicket } from "@/lib/ticket-storage"
import { DesktopNavigation } from "@/components/desktop-navigation"
import { MobileNavigation } from "@/components/mobile-navigation"
import { useIsMobile } from "@/hooks/use-mobile"

export default function WebPurchaseSuccessPage() {
  const router = useRouter()
  const [orderData, setOrderData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [ticketSaved, setTicketSaved] = useState(false)
  const searchParams = useSearchParams()
  const isMobile = useIsMobile()

  const orderDataParam = searchParams.get("orderData")

  useEffect(() => {
    console.log("[v0] Processing order data parameter:", orderDataParam)

    if (orderDataParam) {
      try {
        const parsedOrderData = JSON.parse(orderDataParam)
        console.log("[v0] Successfully parsed order data:", parsedOrderData)
        setOrderData(parsedOrderData)

        if (!ticketSaved) {
          const savedTicket = saveTicket(parsedOrderData)
          console.log("[v0] Ticket saved to localStorage:", savedTicket)
          setTicketSaved(true)
        }
      } catch (error) {
        console.error("[v0] Failed to parse order data:", error)
        // Fallback to mock data if parsing fails
        setOrderData({
          ticketName: "北環線",
          ticketType: "一日券",
          passengerCount: 2,
          totalAmount: 600,
          selectedDates: [{ routeName: "北環線", date: "2025/10/16" }],
          ticketBreakdown: {
            一日券: { label: "一日券", count: 2, subtotal: 600 },
          },
        })
      }
    } else {
      console.log("[v0] No order data parameter found, using fallback")
      // No order data, set fallback
      setOrderData({
        ticketName: "北環線",
        ticketType: "一日券",
        passengerCount: 2,
        totalAmount: 600,
        selectedDates: [{ routeName: "北環線", date: "2025/10/16" }],
        ticketBreakdown: {
          一日券: { label: "一日券", count: 2, subtotal: 600 },
        },
      })
    }

    setIsLoading(false)
  }, [orderDataParam, ticketSaved])

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

  const getStationLabel = (stationId: string) => {
    if (!stationId) return "未指定"
    
    // 從 stationId 中提取車站名稱（格式：stationname-time）
    const parts = stationId.split('-')
    if (parts.length >= 2) {
      const time = parts[parts.length - 1]
      const stationName = parts.slice(0, -1).join('-')
      
      // 車站名稱對應表
      const stationNames: Record<string, string> = {
        'xiweidong': '西衛東站',
        'magonggang': '馬公港站',
        'gongchezong': '公車總站',
        'ziyouta': '自由塔（勝國）站',
        'disanyu': '第三漁港（雅霖）站',
        'wenao': '文澳（元泰.百世多麗）站',
        'dongwei': '東衛站',
        'kuahaidaqiao': '跨海大橋（西嶼端）',
        'sanxianta': '三仙塔',
        'dacaiye': '大菓葉玄武岩柱',
        'erkanjuluo': '二崁聚落',
        'tongliangguta': '通梁古榕',
        'airport': '澎湖機場站',
        'beiliao': '北寮奎壁山',
        'nanliao': '南寮社區',
        'longmen': '龍門閉鎖陣地',
        'museum': '澎湖生活博物館',
        'fengkui': '風櫃洞',
        'fishery': '澎湖縣水產種苗繁殖場',
        'shanshui': '山水沙灘',
        'suogang': '鎖港子午塔',
      }
      
      const displayName = stationNames[stationName] || stationName
      return `${time.slice(0, 2)}:${time.slice(2, 4)} ${displayName}`
    }
    
    return stationId
  }

  if (isLoading || !orderData) {
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
      {!isMobile && <DesktopNavigation activeTab="purchase" />}
      
      <header className="bg-primary px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="font-bold text-xl text-primary-foreground text-center">購票 - 訂購成功</h1>
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
                <h2 className="font-bold text-lg md:text-xl text-foreground mb-2">訂購成功！</h2>
                <p className="text-muted-foreground">您的票券已成功購買</p>
              </div>
            </div>
            <div className="flex flex-col gap-2 flex-shrink-0">
              <Button
                className="h-12 md:h-16 px-4 flex flex-col items-center justify-center gap-0.5 bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={() => router.push("/web/survey")}
              >
                <span className="text-xs md:text-sm leading-tight">填寫購票</span>
                <span className="text-xs md:text-sm leading-tight">滿意度調查</span>
              </Button>
              <Button
                className="h-12 md:h-16 px-4 flex flex-col items-center justify-center gap-0.5 bg-primary hover:bg-primary/90 text-primary-foreground"
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
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground text-sm md:text-base mb-1">
                      {orderData.ticketName || orderData.ticketInfo?.name || "澎湖好行票券"}
                    </h3>
                    {/* 顯示所有路線資訊 */}
                    <div className="space-y-1">
                      {orderData.selectedDates?.map((dateInfo: any, routeIndex: number) => (
                        <div key={routeIndex} className="flex items-center text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                          <span>路線{routeIndex + 1}：{dateInfo.routeName} 搭乘日期：{dateInfo.date}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <Badge variant="default" className="text-xs">
                      已購買
                    </Badge>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-3">
                  <div className="text-xs text-muted-foreground">
                    <div>數量: {orderData.passengers?.length || 0} 張</div>
                    <div>金額: NT${orderData.totalAmount || 0}</div>
                  </div>
                  <div className="text-xs text-muted-foreground text-right">
                    <div>購買: {new Date().toLocaleDateString('zh-TW')}</div>
                  </div>
                </div>

                {/* 票券明細 */}
                {orderData.ticketBreakdown && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-xs md:text-sm text-foreground mb-2">票券明細</h4>
                    <div className="bg-muted/50 p-3 rounded-lg space-y-1">
                      {Object.entries(orderData.ticketBreakdown).map(([key, detail]: [string, any]) => (
                        <div key={key} className="flex justify-between text-xs">
                          <span className="text-muted-foreground">
                            {detail.label} x {detail.count}
                          </span>
                          <span className="font-medium">NT${detail.subtotal}</span>
                        </div>
                      ))}
                      <div className="pt-2 border-t border-border flex justify-between font-semibold text-xs">
                        <span>總計</span>
                        <span className="text-primary">NT${orderData.totalAmount}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 每條路線的完整資訊 */}
                {orderData.selectedDates?.map((dateInfo: any, routeIndex: number) => (
                  <div key={routeIndex} className="mb-4 last:mb-0">
                    {/* 路線分隔線 */}
                    {routeIndex > 0 && (
                      <div className="border-t border-border my-4"></div>
                    )}
                    
                    {/* 路線標題 */}
                    <div className="flex items-center mb-3">
                      <MapPin className="h-4 w-4 mr-2 text-primary" />
                      <h4 className="font-semibold text-sm text-foreground">
                        路線{routeIndex + 1}：{dateInfo.routeName}
                      </h4>
                      <span className="ml-2 text-xs text-muted-foreground">
                        搭乘日期：{dateInfo.date}
                      </span>
                    </div>

                    {/* 該路線的乘客資訊 */}
                    <div className="bg-muted/30 p-3 rounded-lg">
                      <h5 className="font-medium text-xs text-foreground mb-2">乘客資訊</h5>
                      <div className="space-y-2">
                        {orderData.passengers?.map((passenger: any, passengerIndex: number) => {
                          // 取得該乘客的上車地點
                          const getPickupLocation = (passenger: any) => {
                            if (passenger.pickupLocations) {
                              // 找到第一個有值的地點
                              const firstLocation = Object.values(passenger.pickupLocations).find(location => location) as string
                              if (firstLocation) {
                                return getStationLabel(firstLocation)
                              }
                            }
                            return "未指定"
                          }

                          return (
                            <div key={passengerIndex} className="text-xs">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 items-center mb-1">
                                <div className="flex items-center gap-1">
                                  <span className="text-muted-foreground">姓名：</span>
                                  <span className="font-medium">{passenger.name}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <span className="text-muted-foreground">票種：</span>
                                  <span className="font-medium">{getTicketTypeLabel(passenger.ticketType)}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-1 mb-1">
                                <span className="text-muted-foreground">上車地點：</span>
                                <span className="font-medium">{getPickupLocation(passenger)}</span>
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
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {isMobile && <MobileNavigation activeTab="purchase" />}
    </div>
  )
}

