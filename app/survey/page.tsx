"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { CheckCircle, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useRouter } from "next/navigation"
import { DesktopNavigation } from "@/components/desktop-navigation"
import Link from "next/link"

export default function WebSurveyPage() {
  const router = useRouter()
  const [showThankYou, setShowThankYou] = useState(false)
  const [countdown, setCountdown] = useState(5)
  const [surveyAnswers, setSurveyAnswers] = useState({
    convenience: "",
    smoothness: "",
    clarity: "",
    satisfaction: "",
    recommendation: "",
  })

  const [feedbackComments, setFeedbackComments] = useState({
    convenience: "",
    smoothness: "",
    clarity: "",
    satisfaction: "",
    recommendation: "",
  })

  const handleSurveySubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Check if all questions are answered
    const allAnswered = Object.values(surveyAnswers).every((answer) => answer !== "")

    if (!allAnswered) {
      alert("請回答所有問題")
      return
    }

    // 準備完整的調查資料
    const surveyData = {
      answers: surveyAnswers,
      comments: feedbackComments,
    }
    
    console.log("[v0] Survey submitted:", surveyData)
    setShowThankYou(true)
    setCountdown(5)
  }

  useEffect(() => {
    if (showThankYou && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (showThankYou && countdown === 0) {
      // 跳轉到官方網站
      window.location.href = "https://www.penghufuneasy.com.tw/penghufuneasy/index.php?action=index"
    }
  }, [showThankYou, countdown])

  const handleAnswerChange = (question: string, value: string) => {
    setSurveyAnswers((prev) => ({
      ...prev,
      [question]: value,
    }))
    
    // 如果評分改變為4或5，清空對應的意見欄位
    if (parseInt(value) > 3) {
      setFeedbackComments((prev) => ({
        ...prev,
        [question]: "",
      }))
    }
  }

  const handleCommentChange = (question: string, value: string) => {
    setFeedbackComments((prev) => ({
      ...prev,
      [question]: value,
    }))
  }

  const shouldShowCommentInput = (question: string) => {
    const rating = parseInt(surveyAnswers[question as keyof typeof surveyAnswers])
    return rating >= 1 && rating <= 3
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DesktopNavigation activeTab="purchase" />
      
      <header className="bg-primary px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-6xl mx-auto flex items-center">
          <Link href="/my-tickets" className="text-primary-foreground">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="flex-1 font-bold text-xl text-primary-foreground text-center">購票體驗問卷</h1>
        </div>
      </header>

      <div className="flex-1 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="mb-6">
              <p className="text-center text-muted-foreground">請花一分鐘時間，協助我們了解您的購票體驗</p>
            </div>

            <form onSubmit={handleSurveySubmit} className="space-y-8">
              {/* Question 1: Convenience */}
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <Label className="text-base font-semibold">1. 購票流程的便捷性如何？</Label>
                    <RadioGroup
                      value={surveyAnswers.convenience}
                      onValueChange={(value) => handleAnswerChange("convenience", value)}
                    >
                      <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                        <RadioGroupItem value="5" id="conv-5" />
                        <Label htmlFor="conv-5" className="font-normal cursor-pointer flex-1">
                          非常便捷
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                        <RadioGroupItem value="4" id="conv-4" />
                        <Label htmlFor="conv-4" className="font-normal cursor-pointer flex-1">
                          便捷
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                        <RadioGroupItem value="3" id="conv-3" />
                        <Label htmlFor="conv-3" className="font-normal cursor-pointer flex-1">
                          普通
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                        <RadioGroupItem value="2" id="conv-2" />
                        <Label htmlFor="conv-2" className="font-normal cursor-pointer flex-1">
                          不便捷
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                        <RadioGroupItem value="1" id="conv-1" />
                        <Label htmlFor="conv-1" className="font-normal cursor-pointer flex-1">
                          非常不便捷
                        </Label>
                      </div>
                    </RadioGroup>
                    
                    {/* 條件意見輸入 */}
                    {shouldShowCommentInput("convenience") && (
                      <div className="mt-4 space-y-2">
                        <Label className="text-sm text-muted-foreground">
                          請分享您的意見或改善建議：
                        </Label>
                        <textarea
                          placeholder="請告訴我們您認為哪些地方需要改進..."
                          value={feedbackComments.convenience}
                          onChange={(e) => handleCommentChange("convenience", e.target.value)}
                          className="w-full min-h-[80px] px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                          rows={3}
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Question 2: Smoothness */}
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <Label className="text-base font-semibold">2. 操作流暢度如何？</Label>
                    <RadioGroup
                      value={surveyAnswers.smoothness}
                      onValueChange={(value) => handleAnswerChange("smoothness", value)}
                    >
                      <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                        <RadioGroupItem value="5" id="smooth-5" />
                        <Label htmlFor="smooth-5" className="font-normal cursor-pointer flex-1">
                          非常流暢
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                        <RadioGroupItem value="4" id="smooth-4" />
                        <Label htmlFor="smooth-4" className="font-normal cursor-pointer flex-1">
                          流暢
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                        <RadioGroupItem value="3" id="smooth-3" />
                        <Label htmlFor="smooth-3" className="font-normal cursor-pointer flex-1">
                          普通
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                        <RadioGroupItem value="2" id="smooth-2" />
                        <Label htmlFor="smooth-2" className="font-normal cursor-pointer flex-1">
                          不流暢
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                        <RadioGroupItem value="1" id="smooth-1" />
                        <Label htmlFor="smooth-1" className="font-normal cursor-pointer flex-1">
                          非常不流暢
                        </Label>
                      </div>
                    </RadioGroup>
                    
                    {/* 條件意見輸入 */}
                    {shouldShowCommentInput("smoothness") && (
                      <div className="mt-4 space-y-2">
                        <Label className="text-sm text-muted-foreground">
                          請分享您的意見或改善建議：
                        </Label>
                        <textarea
                          placeholder="請告訴我們您認為哪些地方需要改進..."
                          value={feedbackComments.smoothness}
                          onChange={(e) => handleCommentChange("smoothness", e.target.value)}
                          className="w-full min-h-[80px] px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                          rows={3}
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Question 3: Clarity */}
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <Label className="text-base font-semibold">3. 購票流程是否簡單明瞭？</Label>
                    <RadioGroup
                      value={surveyAnswers.clarity}
                      onValueChange={(value) => handleAnswerChange("clarity", value)}
                    >
                      <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                        <RadioGroupItem value="5" id="clarity-5" />
                        <Label htmlFor="clarity-5" className="font-normal cursor-pointer flex-1">
                          非常明瞭
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                        <RadioGroupItem value="4" id="clarity-4" />
                        <Label htmlFor="clarity-4" className="font-normal cursor-pointer flex-1">
                          明瞭
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                        <RadioGroupItem value="3" id="clarity-3" />
                        <Label htmlFor="clarity-3" className="font-normal cursor-pointer flex-1">
                          普通
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                        <RadioGroupItem value="2" id="clarity-2" />
                        <Label htmlFor="clarity-2" className="font-normal cursor-pointer flex-1">
                          不明瞭
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                        <RadioGroupItem value="1" id="clarity-1" />
                        <Label htmlFor="clarity-1" className="font-normal cursor-pointer flex-1">
                          非常不明瞭
                        </Label>
                      </div>
                    </RadioGroup>
                    
                    {/* 條件意見輸入 */}
                    {shouldShowCommentInput("clarity") && (
                      <div className="mt-4 space-y-2">
                        <Label className="text-sm text-muted-foreground">
                          請分享您的意見或改善建議：
                        </Label>
                        <textarea
                          placeholder="請告訴我們您認為哪些地方需要改進..."
                          value={feedbackComments.clarity}
                          onChange={(e) => handleCommentChange("clarity", e.target.value)}
                          className="w-full min-h-[80px] px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                          rows={3}
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Question 4: Satisfaction */}
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <Label className="text-base font-semibold">4. 整體使用體驗滿意度？</Label>
                    <RadioGroup
                      value={surveyAnswers.satisfaction}
                      onValueChange={(value) => handleAnswerChange("satisfaction", value)}
                    >
                      <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                        <RadioGroupItem value="5" id="sat-5" />
                        <Label htmlFor="sat-5" className="font-normal cursor-pointer flex-1">
                          非常滿意
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                        <RadioGroupItem value="4" id="sat-4" />
                        <Label htmlFor="sat-4" className="font-normal cursor-pointer flex-1">
                          滿意
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                        <RadioGroupItem value="3" id="sat-3" />
                        <Label htmlFor="sat-3" className="font-normal cursor-pointer flex-1">
                          普通
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                        <RadioGroupItem value="2" id="sat-2" />
                        <Label htmlFor="sat-2" className="font-normal cursor-pointer flex-1">
                          不滿意
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                        <RadioGroupItem value="1" id="sat-1" />
                        <Label htmlFor="sat-1" className="font-normal cursor-pointer flex-1">
                          非常不滿意
                        </Label>
                      </div>
                    </RadioGroup>
                    
                    {/* 條件意見輸入 */}
                    {shouldShowCommentInput("satisfaction") && (
                      <div className="mt-4 space-y-2">
                        <Label className="text-sm text-muted-foreground">
                          請分享您的意見或改善建議：
                        </Label>
                        <textarea
                          placeholder="請告訴我們您認為哪些地方需要改進..."
                          value={feedbackComments.satisfaction}
                          onChange={(e) => handleCommentChange("satisfaction", e.target.value)}
                          className="w-full min-h-[80px] px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                          rows={3}
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Question 5: Recommendation */}
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <Label className="text-base font-semibold">5. 您是否願意推薦給親友使用？</Label>
                    <RadioGroup
                      value={surveyAnswers.recommendation}
                      onValueChange={(value) => handleAnswerChange("recommendation", value)}
                    >
                      <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                        <RadioGroupItem value="5" id="rec-5" />
                        <Label htmlFor="rec-5" className="font-normal cursor-pointer flex-1">
                          非常願意
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                        <RadioGroupItem value="4" id="rec-4" />
                        <Label htmlFor="rec-4" className="font-normal cursor-pointer flex-1">
                          願意
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                        <RadioGroupItem value="3" id="rec-3" />
                        <Label htmlFor="rec-3" className="font-normal cursor-pointer flex-1">
                          普通
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                        <RadioGroupItem value="2" id="rec-2" />
                        <Label htmlFor="rec-2" className="font-normal cursor-pointer flex-1">
                          不願意
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                        <RadioGroupItem value="1" id="rec-1" />
                        <Label htmlFor="rec-1" className="font-normal cursor-pointer flex-1">
                          非常不願意
                        </Label>
                      </div>
                    </RadioGroup>
                    
                    {/* 條件意見輸入 */}
                    {shouldShowCommentInput("recommendation") && (
                      <div className="mt-4 space-y-2">
                        <Label className="text-sm text-muted-foreground">
                          請分享您的意見或改善建議：
                        </Label>
                        <textarea
                          placeholder="請告訴我們您認為哪些地方需要改進..."
                          value={feedbackComments.recommendation}
                          onChange={(e) => handleCommentChange("recommendation", e.target.value)}
                          className="w-full min-h-[80px] px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                          rows={3}
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Bottom Button - Sticky */}
              <div className="sticky bottom-0 z-40 bg-background/95 backdrop-blur-sm border-t pt-4 pb-4">
                <Button type="submit" className="w-full h-12 text-base bg-primary hover:bg-primary/90 text-primary-foreground">
                  送出問卷
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Thank You Dialog */}
      <Dialog open={showThankYou} onOpenChange={() => {}}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">感謝您的回饋！</DialogTitle>
          </DialogHeader>
          <div className="text-center py-6">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-12 w-12 text-primary-foreground" />
            </div>
            <p className="text-muted-foreground mb-4">您的意見對我們非常重要，我們會持續改善服務品質</p>
            <p className="text-sm text-muted-foreground">
              {countdown > 0 ? `將於 ${countdown} 秒後自動跳轉至官方網站...` : "正在跳轉中..."}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

