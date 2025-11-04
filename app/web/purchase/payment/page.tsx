"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DesktopNavigation } from "@/components/desktop-navigation"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

export default function WebPaymentPage() {
  const [selectedPayment, setSelectedPayment] = useState("credit")
  const [orderData, setOrderData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const orderDataParam = searchParams.get("orderData")
    if (orderDataParam) {
      try {
        const parsedOrderData = JSON.parse(orderDataParam)
        setOrderData(parsedOrderData)
      } catch (error) {
        console.error("Failed to parse order data:", error)
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
  }, [])

  const paymentMethods = [
    { id: "credit", name: "信用卡", color: "#438EA7" },
    { id: "linepay", name: "LINE Pay", color: "#00B900" }
  ]

  const handlePayment = () => {
    const orderDataString = encodeURIComponent(JSON.stringify(orderData))
    if (selectedPayment === "linepay") {
      router.push(`/web/purchase/payment-failed?orderData=${orderDataString}`)
    } else {
      router.push(`/web/purchase/success?orderData=${orderDataString}`)
    }
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
      <DesktopNavigation activeTab="purchase" />
      
      <header className="bg-primary px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-6xl mx-auto flex items-center">
          <Link href="/web/purchase/passenger-info" className="text-primary-foreground">
            <span className="text-xl">←</span>
          </Link>
          <h1 className="flex-1 font-bold text-xl text-primary-foreground text-center">購票 - 選擇付款方式</h1>
        </div>
      </header>

      <div className="flex-1 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Order Summary */}
            <div>
              <Card className="shadow-sm sticky top-8">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg text-foreground mb-4">訂單摘要</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">路線</span>
                      <span className="text-foreground font-medium">
                        {orderData.selectedDates.map((dateInfo: any) => dateInfo.routeName).join("、")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">日期</span>
                      <span className="text-foreground font-medium">
                        {orderData.selectedDates.map((dateInfo: any) => dateInfo.date).join("、")}
                      </span>
                    </div>

                    <div className="border-t pt-3 mt-3">
                      <span className="text-muted-foreground text-sm font-medium">票種明細</span>
                      <div className="mt-3 space-y-2">
                        {orderData.ticketBreakdown &&
                          Object.entries(orderData.ticketBreakdown).map(([ticketType, details]: [string, any]) => (
                            <div key={ticketType} className="flex justify-between text-sm">
                              <span className="text-foreground">
                                {details.label} × {details.count}
                              </span>
                              <span className="text-foreground font-medium">NT${details.subtotal}</span>
                            </div>
                          ))}
                      </div>
                    </div>

                    <div className="border-t pt-3 mt-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">小計</span>
                        <span className="text-foreground font-medium">NT${orderData.totalAmount}</span>
                      </div>
                    </div>

                    <hr className="my-4" />
                    <div className="flex justify-between">
                      <span className="font-semibold text-lg text-foreground">總金額</span>
                      <span className="font-bold text-primary text-xl">NT${orderData.totalAmount}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right: Payment Methods */}
            <div>
              <h2 className="font-semibold text-xl text-foreground mb-6">付款方式</h2>
              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <Card
                    key={method.id}
                    className={`shadow-sm cursor-pointer transition-all border-2 ${
                      selectedPayment === method.id
                        ? "border-primary bg-primary/5"
                        : "border-transparent hover:border-primary/50"
                    }`}
                    onClick={() => setSelectedPayment(method.id)}
                  >
                    <CardContent className="py-4 px-6">
                      <div className="flex items-center justify-between">
                        <span
                          className={`font-medium text-lg ${selectedPayment === method.id ? "text-primary" : "text-foreground"}`}
                        >
                          {method.name}
                        </span>
                        {selectedPayment === method.id && (
                          <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                            <div className="w-2.5 h-2.5 bg-primary-foreground rounded-full"></div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <p className="text-red-500 text-sm mt-4">*請於30分鐘內完成付款</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Button - Sticky */}
      <div className="sticky bottom-0 z-40 bg-background/95 backdrop-blur-sm border-t">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button
            className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-medium text-lg"
            onClick={handlePayment}
          >
            前往付款
          </Button>
        </div>
      </div>
    </div>
  )
}

